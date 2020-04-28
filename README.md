# lotoze-hs (Handwritten signature 手写签章)

> Handwritten signature 需要注意的是：最好将此功能作为一个独立的页面展示。
>这是一个移动端的Vue组件，经过测试在安卓和IOS都可以将其作为H5页面镶嵌在APP中。
>不过还需要进一步完善，欢迎小伙伴的指点以及加入！

## Install

```
    npm install --save lotoze-hs
```
## Use
```
    //main.js
        
        import vueHS from "lotoze-hs";
        Vue.use(vueHS);
```
```
    <template>
        <Lotoze-HS :options="options"></Lotoze-HS>
    </template
    export default {
        data() {
            return {
                options: {
                    server: "/form/html/Signature", //提交地址
                    zoom: 2, //最终效果中单个文字的缩放倍数
                    viewWidth: 80, //默认最终效果中单个文字宽度
                    viewHeight: 80, //默认最终效果中单个文字高度
                    width: 40, //默认输入显示区域单个文字宽度
                    height: 40, //默认输入显示区域单个文字高度
                    color: "#000000", //默认字体画笔颜色
                    brushSizeArr: [4,6,8,10,11,12,14], //笔触大小选项
                    lineWidth: 4, //默认笔触大小
                    cursorPointWidth: 2, //默认指针宽度
                    cursorPointHeight: 40, //默认指针高度
                    cursorPointColor: "#ff4400", //默认指针颜色
                    spaceWidth: 10, //默认空格宽度
                    pcStipulateWidth: 375, // 默认自动换行时宽度
                }
            }    
        }
    }
```

