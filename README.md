# lotoze-he (Handwritten signature 手写签章)

> Handwritten signature

## Install

```
    npm install --save lotoze-hs
```
## Use
```
    <Lotoze-HS :options="options"></Lotoze-HS>

    export default {
        data() {
            return {
                options: {
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
                }
            }    
        }
    }
```

