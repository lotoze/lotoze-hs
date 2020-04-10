<template>
    <div class="brush-size">
      <ul id="brushSizeItems">

      </ul>
    </div>
</template>

<script>
  export default {
    name: 'BrushSize',
    props: {
      chooseArr: {
        type: Array
      }
    },
    data() {
      return {
        brushSizeItems: null,
        nowBrushSize: null
      }
    },
    mounted () {
      this.init();
      this.renderBrunshSizeItem();
    },
    methods: {
      init: function () {
        this.brushSizeItems = document.getElementById("brushSizeItems");
      },
      renderBrunshSizeItem() {
        if(this.chooseArr && this.chooseArr.length > 0) {
          let str = "";
          for(let i = 0; i < this.chooseArr.length; i++) {
            if(i !== 0) {
              str += `<li style="text-align: left; padding: 8px 5px; border-top: 1px solid #f2f2f2;" class="choose-item" data-id="${this.chooseArr[i]}"><span>${this.chooseArr[i]}</span></li>`
            } else {
              str += `<li style="text-align: left; padding: 8px 5px;" class="choose-item" data-id="${this.chooseArr[i]}"><span>${this.chooseArr[i]}(默认)</span></li>`
            }
          }
          this.brushSizeItems.innerHTML = str;
        }
        this.$nextTick(function () {
          // DOM 现在更新了
          // `this` 绑定到当前实例
          // this.handleChange();
          let slef = this;
          $("#brushSizeItems li").on("tap", function(e) {
            var id = $(this).attr("data-id");
            this.nowBrushSize = Number(id);
            slef.$emit("getChangeBrushSize", this.nowBrushSize)
          })
        })
      },
    }
  }
</script>

<style scoped>
  .brush-size{
    position: absolute;
    z-index: 999;
    left: 50%;
    top: calc(100% + 3px);
    background-color: #fff;
    width: 6rem;
    margin-left: -3rem;
  }
</style>
