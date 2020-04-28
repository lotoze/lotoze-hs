<template>
  <div class="lotoze-HS">
    <div class="save" @click="save">
      <span>保存</span>
    </div>
    <div class="lotoze-view">
      <div id="fontView" ref="fontView">
        <template v-for="(item, index) in fontArr">
          <img src="item" alt="" :width="simpleFontOption.width" :height="simpleFontOption.height">
          <span id="cursorPoint"
                :style="{display: 'inline-block',
                              width: simpleFontOption.cursorPointWidth || 2 + 'px',
                              height: simpleFontOption.cursorPointHeight || this.simpleFontOption.height + 'px',
                              backgroundColor: this.simpleFontOption.cursorPointColor,
                              animation: 'cursorPointAnimation 0.5s infinite'"></span>
        </template>
      </div>
    </div>

    <div class="lotoze-hand">
      <div class="btns">
        <ul>
          <li>
            <p><colorPicker v-model="simpleFontOption.color" v-on:change="handleChangeColor"/></p>

            <p>颜色</p>
          </li>
          <li>
            <p><i class="icon iconfont icon-huiche" @click="changeProp(2, 'LINE_FEED')"></i></p>
            <p>换行</p>
          </li>
          <li>
            <p><i class="icon iconfont icon-quchukongge" @click="changeProp(3, 'BLANK_SPACE')"></i></p>
            <p>空格</p>
          </li>
          <li style="position: relative;" @click="handleShow">
            <p><i class="icon iconfont icon-webicon318" @click="changeProp(4, 'BRUSH_SIZE')"></i> <span>{{ nowBrushSize || simpleFontOption.lineWidth }}</span></p>
            <p>笔触大小</p>
            <BrushSize v-show="isShow" @getChangeBrushSize="getChangeBrushSize" :chooseArr="simpleFontOption.brushSizeArr"></BrushSize>
          </li>
        </ul>

      </div>
      &#10;&#13;

      <canvas id="hand" width="300" height="300">

      </canvas>

      <div class="cure">
        <button @click="createSimpleFontImage">确定</button>
      </div>
    </div>
    <AlertHtml>
      <template v-slot:html>
        <img class="save-img" :src="saveImgUrl" alt="">
      </template>
    </AlertHtml>
  </div>
</template>

<script>
  import $ from "zepto";
  import html2canvas from "html2canvas";
  import "zepto/src/touch";
  import * as BTNEV from "@/assets/js/btnEventCallBack.js";

  import AlertHtml from './AlertHtml'
  import BrushSize from './BrushSize'
  export default {
    name: 'HS',
    components: {
      "AlertHtml": AlertHtml,
      "BrushSize": BrushSize
    },
    data () {
      return {
        simpleFontOption: {
          width: 35,
          height: 35,
          color: "#000000",
          brushSizeArr: [4,6,8,10,11,12],
          lineWidth: 4,
          cursorPointWidth: 2,
          cursorPointHeight: 35,
          cursorPointColor: "#ff4400",
        },
        timer: null,
        isCreate: false,
        lastIndex: 0,
        nowBrushSize: "",
        brushSizeIsShow: false,
        saveImgUrl: "",
        fontView: null,
        viewCanvas: null,
        handCanvas: null,
        handContext: null,
        fontArr: [],
        bool: false
      }
    },
    computed: {
      isShow() {
        return this.brushSizeIsShow !== true ? false : true;
      }
    },
    mounted: function () {
      this.init();
      // this.handCanvas.on("touchend",  (e) => {
      //   console.log(e);
      // })
      this.draw();
    },
    methods: {
      init: function() {
        this.fontView = document.getElementById("fontView");
        // this.viewCanvas = $("#viewCanvas");
        // this.viewContext =  document.getElementById("viewCanvas").getContext("2d");
        this.handCanvas = $("#hand");
        // this.canvas = document.getElementById("hand");
        this.handContext = document.getElementById("hand").getContext("2d");
        this.handContext.lineCap = "round";
        this.handContext.lineJoin = "round";
        this.handContext.lineWidth = this.simpleFontOption.lineWidth;
        this.renderFonts();
      },
      // draw: function() {
      //   var canvasOffsetLeft = this.canvas.offsetLeft;
      //   var canvasOffsetTop = this.canvas.offsetTop;
      //   // var canvasOffsetLeft = this.canvas.offset().left;
      //   // var canvasOffsetTop = this.canvas.offset().top;
      //   this.canvas.onmousedown = (downEV) => {
      //     this.bool = true;
      //     this.context.beginPath();
      //     this.context.moveTo(downEV.pageX - canvasOffsetLeft, downEV.pageY - canvasOffsetTop);
      //     this.canvas.onmousemove =  (moveEV) => {
      //       if(this.bool) {
      //         this.context.lineTo(moveEV.pageX - canvasOffsetLeft, moveEV.pageY - canvasOffsetTop);
      //         this.context.stroke();
      //       }
      //     }
      //
      //     this.canvas.onmouseup = () => {
      //       this.context.closePath();
      //       this.bool = false;
      //     }
      //
      //     this.canvas.onmouseleave = () => {
      //       this.context.closePath();
      //       this.bool = false;
      //     }
      //   }
      // },
      draw: function() {
        this.handCanvas.on("touchstart", (e) => {
          clearTimeout(this.timer);
          this.bool = true;
          this.handContext.beginPath();
          this.handContext.moveTo(e.changedTouches[0].pageX - this.handCanvas.offset().left, e.changedTouches[0].pageY - this.handCanvas.offset().top);
          this.handCanvas.on("touchmove", (e) => {
            if(this.bool) {
              this.handContext.lineTo(e.changedTouches[0].pageX - this.handCanvas.offset().left, e.changedTouches[0].pageY - this.handCanvas.offset().top);
              this.handContext.stroke();
            }
          })

          this.handCanvas.on("touchend", (e) => {
            this.handContext.closePath();
            this.bool = false;
            this.isCreate = true;
            // this.createSimpleFontImage();
            this.timer = setTimeout(() => {
              this.createSimpleFontImage();
            }, 3000)
          })

          // this.handCanvas.on("touchcancel", () => {
          //   // this.handContext.closePath();
          //   // this.bool = false;
          //   this.timer = setTimeout(this.createSimpleFontImage, 1000)
          // })
        })
      },
      createSimpleFontImage: function () {
        if(this.isCreate) {
          console.log("create");
          var image = this.handCanvas[0].toDataURL("image/png");
          this.fontArr.push(image);
          this.lastIndex = this.fontArr.length;
          this.renderFonts();
          this.handContext.clearRect(0,0,this.handCanvas.width(), this.handCanvas.height());
        }
        this.isCreate = false;
      },
      renderFonts: function (){
        // for(var i = 0; i < this.fontArr.length; i++){
        //   var img = new Image();
        //   img.onload = () => {
        //     console.log(i);
        //     this.viewContext.drawImage(img, (i-1) * this.simpleFontOption.width, 0, this.simpleFontOption.width, this.simpleFontOption.height);
        //   }
        //   img.src = this.fontArr[i];
        //
        // }

        //img展示
        var str = "";
        if(this.fontArr && this.fontArr.length > 0) {
          for(var i = 0; i < this.fontArr.length; i++) {
            if(this.fontArr[i] === "<br/>") {
              // str += `<p style="height: ${this.simpleFontOption.height}px;"></p>`
              str += `<br/>`
            } else {
              str += `<img src="${this.fontArr[i]}" width="${this.simpleFontOption.width}" height="${this.simpleFontOption.height}"> `;
            }
            if(i == (this.fontArr.length-1)) {
              str += `<span id="cursorPoint"
                            style="
                              display: inline-block;
                              width: ${this.simpleFontOption.cursorPointWidth || 2}px;
                              height: ${this.simpleFontOption.cursorPointHeight || this.simpleFontOption.height}px;
                              background-color: ${this.simpleFontOption.cursorPointColor};
                              animation: cursorPointAnimation 0.5s infinite;"></span>`;
            }

          }
        } else {
          str += `<span id="cursorPoint"
                            style="
                              display: inline-block;
                              width: ${this.simpleFontOption.cursorPointWidth || 2}px;
                              height: ${this.simpleFontOption.cursorPointHeight || this.simpleFontOption.height}px;
                              background-color: ${this.simpleFontOption.cursorPointColor};
                              animation: cursorPointAnimation 0.5s infinite;"></span>`;
        }
        this.fontView.innerHTML = str;
      },
      save: function() {
        html2canvas(this.$refs.fontView, {
          width: this.fontView.scrollWidth
        }).then(canvas => {
          let dataURL = canvas.toDataURL("image/png");
          this.saveImgUrl = dataURL;
        })
      },
      changeProp: function (orderNum, type) {
        switch (type) {
          case "LINE_FEED":
            BTNEV.lotozeLineFeed(this);
            break;
          case "BLANK_SPACE":
            BTNEV.lotozeFlankSpace(this);
            break;
          case "BRUSH_SIZE":
            break;
        }
      },
      handleChangeColor: function (e) {
        this.simpleFontOption.color = e;
        BTNEV.lotozeColor(this, e);
      },
      handleShow: function (e) {
        e.stopPropagation();
        this.brushSizeIsShow = this.brushSizeIsShow ?  false : true;
      },
      getChangeBrushSize: function (size) {
        this.nowBrushSize = size;
        BTNEV.lotozeBrushSize(this, size);
      },
      renderCursorPoint: function (str) {


      },
      cursorAnimation: function () {
        var cursorPoint = document.getElementById("cursorPoint");
        // cursorPoint.style.animation = "";

      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .lotoze-HS{
    width: 100%;
  }
  .save{
    text-align: right;
    padding: 10px;
    color: #3385ff;
  }
  .save span{
    font-size: 1.6rem;
  }
  .lotoze-view{
    text-align: left;
    background-color: #f2f2f2;
    margin: 10px;
    border-radius: 5px;
    font-size: 0;
    overflow-x: auto;

  }
  .lotoze-view #fontView{
    white-space: nowrap;
  }
  .lotoze-view::after{
    content: "";
    display: block;
    height: 30px;
  }

  .lotoze-hand .btns {
    padding: 10px 0;
  }
  .lotoze-hand .btns ul li{
    display: inline-block;
    width: 4rem;
    height: 3rem;
    padding: 5px;
    cursor: pointer;
    border: 1px dashed gray;
    margin: 0 5px;
  }
  .lotoze-hand .cure button{
    width: 300px;
    height: 30px;
    margin-top: 30px;
    border-radius: 30px;
    background-color: #3385ff;
    border: 1px solid #3385ff;
    color: #fff;
    outline: 0;
  }
  #hand{
    width: 300px;
    height: 300px;
    border: 1px solid #ccc;

    /*margin-top: 30px;*/
  }
  .save-img{
    width: 100%;
  }
  #cursorPoint{

  }
</style>
