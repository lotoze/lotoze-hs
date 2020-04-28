<template>
  <div class="lotoze-HS">
    <div class="top-btn">
      <span @click="clearFontView">清除</span>
      <span @click="preview">保存</span>
    </div>
    <div class="lotoze-view scroll-box" :style="{top: topBtnHeight+ 'px'}">
      <div id="fontView" ref="fontView" :style="[{width: !isWrap ? simpleFontOption.pcStipulateWidth + 'px' : 'auto'}, {whiteSpace: isWrap ? 'nowrap' : 'normal'}]">
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
    <div class="lotoze-hand" :style="{height: lotozeHandHeight + 'px !important;'}">
      <div class="btns">
        <ul>
          <li>
            <p><colorPicker :popper-class="['color-packer']" v-model="simpleFontOption.color" v-on:change="handleChangeColor"/></p>
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

      <canvas id="hand" :width="initWidth" :height="initHeight">

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
            <div id="finalView" ref="finalView" :style="[{width: !isWrap ? (simpleFontOption.zoom || simpleFontOption.viewWidth/simpleFontOption.width) * simpleFontOption.pcStipulateWidth + 'px' : 'auto'}, {whiteSpace: isWrap ? 'nowrap' : 'normal'}]">
              <template v-for="(item, index) in fontArr">
                <img v-if="(item !== '<br/>') && (item !== 'space')" :src="item" alt="" :width="simpleFontOption.viewWidth || (this.simpleFontOption.width * this.simpleFontOption.zoom)" :height="simpleFontOption.viewHeight || (this.simpleFontOption.viewHeight * this.simpleFontOption.zoom)">
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
    <AlertMessage ref="alertMessage"></AlertMessage>
  </div>
</template>

<script>
  import $ from "zepto";
  import html2canvas from "html2canvas";
  import "zepto/src/touch";
  import * as BTNEV from "../assets/js/btnEventCallBack.js";

  import AlertLoading from './AlertLoading'
  import AlertHtml from './AlertHtml'
  import AlertMessage from './AlertMessage'
  import BrushSize from './BrushSize'

  import {submitHE} from "../api/axios.js";
  import * as TimeUtil from "../utils/TimeUtil.js";
  import * as UrlUtil from "../utils/UrlUtil.js";

  import vcolorpicker from "vcolorpicker";


  export default {
    name: 'Lotoze-HS',
    props: ["options"],
    components: {
      "AlertLoading": AlertLoading,
      "AlertHtml": AlertHtml,
      "AlertMessage": AlertMessage,
      "BrushSize": BrushSize,
        "vcolorpicker": vcolorpicker
    },

    data () {
      return {
        simpleFontOption: {
          server: "/form/html/Signature",
          zoom: 2,
          viewWidth: 80,
          viewHeight: 80,
          width: 40,
          height: 40,
          color: "#000000",
          brushSizeArr: [4,6,8,10,11,12,14],
          lineWidth: 4,
          cursorPointWidth: 2,
          cursorPointHeight: 40,
          cursorPointColor: "#ff4400",
          spaceWidth: 10,
          pcStipulateWidth: 300, //PC规定宽度，
        },
        isWrap: false,
        color: "#000000",
        params: {},
        initWidth: 0,
        initHeight: 0,
        topBtnHeight: 0,
        lotozeViewHeight: 0,
        lotozeHandHeight: 0,
        formData: null,
        serverData: {},
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
        bool: false,
        scrollBox: null
      }
    },

    computed: {
      isShow() {
        return this.brushSizeIsShow !== true ? false : true;
      },
    },
    created(){
      // alert(window.devicePixelRatio +"---"+ window.screen.width + "----" + window.screen.availHeight + "");
      if(this.options) this.simpleFontOption = Object.assign({}, this.simpleFontOption, this.options);
      this.formData = new FormData();
      var locationHref = window.location.href;
      if(locationHref.indexOf("?") !== -1) {
        var locationSearch = window.location.search;
        var params = UrlUtil.getLocationSearchParameters(locationSearch);
        this.params = params;
        // if(this.params.SAVE_URL && this.params.SAVE_URL == "countersignSignature") {
        //   this.simpleFontOption.server = "/form/html/countersignSignature";
        // }
        for(var param in params) {
          this.formData.append(param, params[param]);
        }
      }
    },
    mounted: function () {
      this.init();
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
        this.initWidth = this.handCanvas.width();
        this.initHeight = this.handCanvas.height();
        this.topBtnHeight = $(".lotoze-HS .top-btn").height();
        this.lotozeViewHeight = $(".lotoze-HS > .lotoze-view").height();
        // alert(window.devicePixelRatio)
        // alert(window.screen.width)
        // alert(window.screen.height)
        let clientHeight = document.body.clientHeight;
        this.lotozeHandHeight = clientHeight - (this.topBtnHeight + this.lotozeViewHeight) - 5;
        // this.lotozeHandHeight = $(".lotoze-HS .lotoze-hand").height();
        // alert(this.lotozeHandHeight)
        this.scrollBox = document.getElementsByClassName("scroll-box")[0];

        //必须传值必须大于当前屏幕宽度，否则就按屏幕宽度来
        // if(this.params.handwriteWidth && this.params.handwriteWidth > this.scrollBox.clientWidth) {
        //   console.log(666666666666)
        //   this.simpleFontOption.pcStipulateWidth = this.params.handwriteWidth;
        // } else {
        //   console.log(7777777777)
        //   this.simpleFontOption.pcStipulateWidth = this.scrollBox.clientWidth;
        // }
        //无论是什么都可以。有个最小值3倍的初始化宽度
        if(this.params.handwriteWidth > this.simpleFontOption.width*3){
          this.simpleFontOption.pcStipulateWidth = this.params.handwriteWidth;
        } else {
          this.simpleFontOption.pcStipulateWidth = this.scrollBox.clientWidth;
        }

        this.checkIsWrap();
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
            this.isCreate = true;
            // this.timer = setTimeout(() => {
            //   this.createSimpleFontImage();
            // }, 3000)
          })
          this.handCanvas.on("touchcancel", () => {
            e.stopPropagation();
            this.handContext.closePath();
            this.bool = false;
            this.isCreate = true;
            // this.timer = setTimeout(() => {
            //   this.createSimpleFontImage();
            // }, 3000)
          })
        })
      },
      createSimpleFontImage: function () {
        if(this.isCreate) {
          console.log("create");
          this.checkIsBr(); //判断是否已达到规定宽度，如果达到换行
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
        if(this.fontArr.length > 0) {
          this.isCursorPointShow = false;
          this.isAlertLoading = true;
          var finalView = document.getElementById("finalView")
          var imgs = finalView.getElementsByTagName("img");
          this.$nextTick(() => {
            if(!this.isCursorPointShow) {
              html2canvas(this.$refs.finalView, {
                width: imgs.length < 3 ? imgs.length * (this.simpleFontOption.viewWidth || this.simpleFontOption.width * this.simpleFontOption.zoom) : finalView.scrollWidth,
                height: finalView.scrollHeight
              }).then(canvas => {
                let dataURL = canvas.toDataURL("image/png");
                this.saveImgUrl = dataURL;
                // var reader = new FileReader();
                // reader.onload = (e) => {
                //   console.log(reader.readAsDataURL(dataURL));
                // }
                var file = this.dataURLtoFile(dataURL, Math.floor(Math.random() * 100000) + TimeUtil.format(new Date(), "yyyy-MM-dd"));
                if(this.params.auto && this.params.auto == 1){
                  var u = navigator.userAgent, app = navigator.appVersion;
                  var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //g
                  var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
                  if (isAndroid) {
                    window.Android.savehandwriting(dataURL);
                  }
                  if (isIOS) {
                    window.location = "savehandwriting:" + dataURL;
                  }

                } else {
                  // this.formData.append("DATA_ID", 1);
                  // this.formData.append("FORM_ID", "64d8f230-81a8-6a5c-1751-a401ddc1e9f6");
                  // this.formData.append("ITEM_ID", "data_5e8bf12ff2e3b");
                  // this.formData.append("BIND_DATA", "");
                  // this.formData.append("P", "e55i0u2u145vsdad9h4oi7jglf");
                  this.formData.append("SIGNATURE", file);
                  submitHE(this.simpleFontOption.server, this.formData).then((res) => {
                    var originUrl = localStorage.getItem("originUrl");
                    if(originUrl) {

                      localStorage.removeItem("originUrl");
                      window.history.back();
                      // window.location.replace(originUrl);
                    }
                  },(err) => {
                    throw new Error(err);
                  })
                }

                this.isCursorPointShow = true;
                this.isAlertLoading = false;
                // this.isAlertHtml = true;
              })
            }
          })
        } else {
          this.$refs.alertMessage.alertMessage("您还没有书写文字，无法保存~");
        }

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
      },
      checkIsWrap() {
        if(this.simpleFontOption.pcStipulateWidth < this.scrollBox.clientWidth){
          this.isWrap = false;
        } else {
          this.isWrap = true;
        }
      },
      checkIsBr () {
        var nowScrollBoxWidth = this.scrollBox.scrollWidth;
        if(this.simpleFontOption.pcStipulateWidth > this.scrollBox.clientWidth && (nowScrollBoxWidth - this.simpleFontOption.pcStipulateWidth) > 0){
          BTNEV.lotozeLineFeed(this); //换行
        }
        //(nowScrollBoxWidth - this.simpleFontOption.pcStipulateWidth) < 0  说明没到300
        //(nowScrollBoxWidth - this.simpleFontOption.pcStipulateWidth) = 0  说明刚刚好到300
        //(nowScrollBoxWidth - this.simpleFontOption.pcStipulateWidth) > 0  说明超过300 不太可能
        //(nowScrollBoxWidth - this.simpleFontOption.pcStipulateWidth) < 0 && (nowScrollBoxWidth - this.simpleFontOption.pcStipulateWidth) - this.simpleFontOption.width <= 0 //如果没到300，那就要看是否剩下的够一个汉字，不够就换行
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  @import "../assets/font/iconfont.css";
  @import "../assets/style/public.css";
  @import "~loaders.css";
  .lotoze-HS{
    width: 100%;
    height: 100%;
  }
  .top-btn{
    display: flex;
    justify-content: space-between;
    padding: 0.5rem;
    color: #3385ff;
  }
  .top-btn span{
    font-size: 1.4rem;
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
    height: 10rem;
  }
  .lotoze-HS > .lotoze-view{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 95%;
    text-align: left;
    margin: 0.5rem auto;
  }
  .lotoze-view{
    text-align: left;
    background-color: #f2f2f2;
    margin: 0.5rem;
    border-radius: 5px;
    overflow-x: auto;
    padding: 0;
  }
  .lotoze-view #fontView,
  .lotoze-view #finalView{
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
  /*.lotoze-view::after{*/
  /*  content: "";*/
  /*  display: block;*/
  /*  height: 30px;*/
  /*}*/

  .lotoze-hand {
    width: 100%;
    /*height: 36.3rem;*/
    background-color: #fff;
    position: fixed;
    bottom: 0.5rem;
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
    width: 25rem;
    height: 25rem;
    border: 1px solid #ccc;
  }
  .save-img{
    width: 90%;
    display: block;
    margin: 5% auto 0;
  }

  .color-packer{
    position: absolute;
    z-index: 99999;
  }

</style>
