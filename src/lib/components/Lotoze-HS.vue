<template>
  <div class="lotoze-HS">
    <div class="top-btn">
      <span @click="clearFontView">清除</span>
      <span @click="preview">保存</span>
    </div>
    <div class="lotoze-view scroll-box">
      <div id="fontView" ref="fontView">
        <span id="initCursorPoint" v-if="fontArr.length == 0"
              :style="{
                    display: 'inline-block',
                    width: (simpleFontOption.cursorPointWidth || 2) + 'px',
                    height: (simpleFontOption.cursorPointHeight || simpleFontOption.height) + 'px',
                    backgroundColor: simpleFontOption.cursorPointColor,
                    animation: 'cursorPointAnimation 0.5s infinite'}"></span>
        <template v-for="(item, index) in fontArr">
          <img v-if="(item !== '<br/>') && (item !== 'space')" :src="item" alt="" :width="simpleFontOption.width" :height="simpleFontOption.height">
          <em v-else-if="item === '<br/>'"><br/></em>
          <span v-else-if="item === 'space'" class="space" :style="{width: simpleFontOption.spaceWidth + 'px', height: simpleFontOption.height + 'px'}"></span>
          <span id="cursorPoint" v-if="(fontArr.length == 0 || index == fontArr.length-1) && isCursorPointShow"
                :style="{
                    display: 'inline-block',
                    width: (simpleFontOption.cursorPointWidth || 2) + 'px',
                    height: (simpleFontOption.cursorPointHeight || simpleFontOption.height) + 'px',
                    backgroundColor: simpleFontOption.cursorPointColor,
                    animation: 'cursorPointAnimation 0.5s infinite'}"></span>
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
          <li @click="changeProp(2, 'LINE_FEED')">
            <p><i class="icon iconfont icon-huiche"></i></p>
            <p>换行</p>
          </li>
          <li @click="changeProp(3, 'BLANK_SPACE')">
            <p><i class="icon iconfont icon-quchukongge"></i></p>
            <p>空格</p>
          </li>
          <li style="position: relative;" @click="handleShow">
            <p><i class="icon iconfont icon-webicon318"></i> <span>{{ nowBrushSize || simpleFontOption.lineWidth }}</span></p>
            <p>笔触</p>
            <BrushSize v-show="isShow" @getChangeBrushSize="getChangeBrushSize" :chooseArr="simpleFontOption.brushSizeArr"></BrushSize>
          </li>
          <li style="position: relative;" @click="clearHandCanvas">
            <p><i class="icon iconfont icon-qingpingxianxing"></i></p>
            <p>清屏</p>
          </li>
        </ul>

      </div>
      &#10;&#13;

      <canvas id="hand" width="290" height="290">

      </canvas>

      <div class="cure">
        <button @click="createSimpleFontImage">确定</button>
        <button @click="backSpace">退格</button>
      </div>
    </div>

    <AlertLoading :show="isAlertLoading"></AlertLoading>
    <AlertHtml :show="isAlertHtml" @close="close">
      <template v-slot:html>
<!--        <img class="save-img" :src="saveImgUrl" alt="">-->
<!--        <p class="save-tip"></p>-->
        <div class="title">
          <h4>最终效果为：</h4>
        </div>
        <div class="preview-box">
          <div class="lotoze-view">
            <div id="finalView" ref="finalView">
              <template v-for="(item, index) in fontArr">
                <img v-if="(item !== '<br/>') && (item !== 'space')" :src="item" alt="" :width="simpleFontOption.viewWidth" :height="simpleFontOption.viewHeight">
                <br v-else-if="item === '<br/>'"/>
                <span v-else-if="item === 'space'" class="space" :style="{width: simpleFontOption.spaceWidth + 'px', height: simpleFontOption.height + 'px'}"></span>
              </template>
            </div>
          </div>
        </div>
        <div class="save-btn">
          <button @click="save">确定</button>
        </div>
      </template>
    </AlertHtml>
  </div>
</template>

<script>
  import $ from "zepto";
  import "zepto/src/touch";
  import html2canvas from "html2canvas";
  import * as BTNEV from "../assets/js/btnEventCallBack.js";

  import AlertLoading from './AlertLoading'
  import AlertHtml from './AlertHtml'
  import BrushSize from './BrushSize'

  import {submitHE} from "../api/axios.js";
  import * as TimeUtil from "../utils/TimeUtil.js";
  export default {
    name: 'LotozeHS',
    props: ["options"],
    components: {
      "AlertLoading": AlertLoading,
      "AlertHtml": AlertHtml,
      "BrushSize": BrushSize
    },
    data () {
      return {
        simpleFontOption: {
          server: "",
          viewWidth: 100,
          viewHeight: 100,
          width: 40,
          height: 40,
          color: "#000000",
          brushSizeArr: [4,6,8,10,11,12,14],
          lineWidth: 4,
          cursorPointWidth: 2,
          cursorPointHeight: 40,
          cursorPointColor: "#ff4400",
          spaceWidth: 10
        },
        isAlertHtml: false,
        isAlertLoading: false,
        timer: null,
        isCursorPointShow: true,
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
    created(){
      console.log(this.options)
      this.simpleFontOption = Object.assign({}, this.simpleFontOption, this.options);
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
        this.handCanvas = $("#hand");
        this.handContext = document.getElementById("hand").getContext("2d");
        this.handContext.lineCap = "round";
        this.handContext.lineJoin = "round";
        this.handContext.lineWidth = this.simpleFontOption.lineWidth;
      },
      draw: function() {
        this.handCanvas.on("touchstart", (e) => {
          e.stopPropagation();
          // clearTimeout(this.timer);
          this.isCreate = true;
          this.bool = true;
          this.handContext.beginPath();
          this.handContext.moveTo(e.changedTouches[0].pageX - this.handCanvas.offset().left, e.changedTouches[0].pageY - this.handCanvas.offset().top);
          this.handCanvas.on("touchmove", (e) => {
            e.stopPropagation();
            if(this.bool) {
              this.handContext.lineTo(e.changedTouches[0].pageX - this.handCanvas.offset().left, e.changedTouches[0].pageY - this.handCanvas.offset().top);
              this.handContext.stroke();
            }
          })

          this.handCanvas.on("touchend", (e) => {
            e.stopPropagation();
            this.handContext.closePath();
            this.bool = false;
            // this.isCreate = true;
            // this.timer = setTimeout(() => {
            //   this.createSimpleFontImage();
            // }, 3000)
          })
          this.handCanvas.on("touchcancel", () => {
            e.stopPropagation();
            this.handContext.closePath();
            this.bool = false;
            // this.isCreate = true;
            // this.timer = setTimeout(() => {
            //   this.createSimpleFontImage();
            // }, 3000)
          })
        })
      },
      createSimpleFontImage: function () {
        if(this.isCreate) {
          console.log("create");
          var image = this.handCanvas[0].toDataURL("image/png");
          this.fontArr.push(image);
          this.lastIndex = this.fontArr.length;
          this.handContext.clearRect(0,0,this.handCanvas.width(), this.handCanvas.height());
        }
        this.isCreate = false;
      },
      preview: function() {
        this.isAlertHtml = true;
      },
      save: function() {
        this.isCursorPointShow = false;
        this.isAlertLoading = true;
        var finalView = document.getElementById("finalView")
        var imgs = finalView.getElementsByTagName("img");
        this.$nextTick(() => {
          if(!this.isCursorPointShow) {
            html2canvas(this.$refs.finalView, {
              width: imgs.length < 3 ? imgs.length * this.simpleFontOption.viewWidth : finalView.scrollWidth,
              height: finalView.scrollHeight
            }).then(canvas => {
              let dataURL = canvas.toDataURL("image/png");
              this.saveImgUrl = dataURL;
              // var reader = new FileReader();
              // reader.onload = (e) => {
              //   console.log(reader.readAsDataURL(dataURL));
              // }
              var file = this.dataURLtoFile(dataURL, Math.floor(Math.random() * 100000) + TimeUtil.format(new Date(), "yyyy-MM-dd"));
              console.log(file);
              var formData = new FormData();
              formData.append("DATA_ID", 1);
              formData.append("FORM_ID", "64d8f230-81a8-6a5c-1751-a401ddc1e9f6");
              formData.append("ITEM_ID", "data_5e8bf12ff2e3b");
              formData.append("BIND_DATA", "");
              formData.append("P", "e55i0u2u145vsdad9h4oi7jglf");
              formData.append("SIGNATURE", file);
              submitHE(this.simpleFontOption.server, formData).then((res) => {
              },(err) => {
                throw new Error(err);
              })
              this.isCursorPointShow = true;
              this.isAlertLoading = false;
              // this.isAlertHtml = true;
            })
          }
        })
      },
      dataURLtoFile: function(dataurl, filename) {//将base64转换为文件，dataurl为base64字符串，filename为文件名（必须带后缀名，如.jpg,.png）
        var arr = dataurl.split(','),
          mime = arr[0].match(/:(.*?);/)[1],
          sufix = mime.split("/")[1],
          bstr = atob(arr[1]),
          n = bstr.length,
          u8arr = new Uint8Array(n);
        while(n--){
          u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename+ "." + sufix, {type:mime});
      },

      fileReader: function(base64) {

      },
      backSpace: function() {
        this.fontArr.splice(this.fontArr.length - 1, 1)
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
      close: function (data) {
        this.isAlertHtml = data;
      },
      clearFontView: function () {
        this.fontArr = [];
      },
      clearHandCanvas: function () {
        this.handContext.clearRect(0,0,this.handCanvas.width(), this.handCanvas.height());
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  @import "../assets/style/public.css";
  .lotoze-HS{
    width: 100%;
    height: 100%;
  }
  .top-btn{
    display: flex;
    justify-content: space-between;
    padding: 10px;
    color: #3385ff;
  }
  .top-btn span{
    font-size: 1.6rem;
  }
  .title{
    text-align: left;
    padding-left: 1rem;
    padding-top: 2rem;
  }
  .title h4{
    font-size: 1.8rem;
  }
  .preview-box{
    height: 60%;
    overflow-y: auto;
  }
  /*.font-view-box{*/
  /*  height: 24%;*/
  /*  overflow-y: auto;*/
  /*  background-color: #fff;*/
  /*}*/
  .scroll-box.scroll-box{
    height: 14rem;
  }
  .lotoze-view{
    text-align: left;
    background-color: #f2f2f2;
    margin: 10px;
    border-radius: 5px;
    overflow-x: auto;
    padding: 0;
  }
  .lotoze-view #fontView,
  .lotoze-view #finalView{
    white-space: nowrap;
    font-size: 0;
  }
  .lotoze-view #fontView img,
  .lotoze-view #finalView img{
    display: inline-block;
  }
  .lotoze-view #fontView br,
  .lotoze-view #finalView br{
    font-size: 1rem;
  }
  .lotoze-view #fontView .space,
  .lotoze-view #finalView .space{
    display: inline-block;
  }
  .lotoze-view::after{
    content: "";
    display: block;
    height: 30px;
  }

  .lotoze-hand {
    width: 100%;
    height: 36.3rem;
    background-color: #fff;
    position: fixed;
    bottom: 1rem;
    left: 50%;
    transform: translateX(-50%);
    z-index: 8888;
  }
  .lotoze-hand .btns {
    padding: 1rem 0 1rem;
  }
  .lotoze-hand .btns ul{
    display: flex;
    justify-content: space-between;
  }
  .lotoze-hand .btns ul li{
    display: inline-block;
    width: 4rem;
    height: 3rem;
    padding: 0.5rem;
    cursor: pointer;
    border: 1px dashed gray;
    margin: 0 0.8rem;
  }
  .lotoze-hand .btns ul li i,
  .lotoze-hand .btns ul li p{
    font-size: 1.2rem;
  }
  .lotoze-hand .cure{
    display: flex;
    justify-content: space-around;
  }
  .lotoze-hand .cure button{
    width: 40%;
    height: 3rem;
    margin-top: 1rem;
    border-radius: 30px;
    background-color: #3385ff;
    border: 1px solid #3385ff;
    color: #fff;
    outline: 0;
    font-size: 1.4rem;
  }
  .lotoze-hand .cure button:nth-of-type(2) {
    background-color: #909399;
    border: 1px solid #909399;
  }
  .save-btn button{
    width: 60%;
    height: 3rem;
    margin-top: 1rem;
    border-radius: 30px;
    background-color: #3385ff;
    border: 1px solid #3385ff;
    color: #fff;
    outline: 0;
    font-size: 1.4rem;
  }
  #hand{
    width: 290px;
    height: 290px;
    border: 1px solid #ccc;
  }
  .save-img{
    width: 90%;
    display: block;
    margin: 5% auto 0;
  }

</style>
