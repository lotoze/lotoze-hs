<template>
    <div class="cover" ref="cover" v-if="isClose" @click="coverClose">
      <slot name="coverAlert"></slot>
    </div>
</template>

<script>
  export default {
    name: 'Cover',
    props: {
      show: {
        type: Boolean
      }
    },
    data() {
      return {
        isClose: false
      }
    },
    watch: {
      "show": function () {
        this.isClose = this.show;
      }
    },
    methods: {
      coverClose: function () {
        this.isClose = false;
        this.$emit("coverClose", this.isClose);
      }
    }
  }
</script>

<style scoped>
  .cover{
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    background-color: rgba(0,0,0, 0.6);
    z-index: 9999;
  }
</style>
