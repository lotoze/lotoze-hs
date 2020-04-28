<template>
  <div v-if="show" class="alert-box alert-message">
    <span>{{ msg }}</span>
  </div>

</template>

<script>

  export default {
    name: 'AlertMessage',
    data() {
      return {
        timer: null,
        msg: "",
        show: false
      }
    },
    components: {

    },
    methods: {
      alertMessage(msg, time=1500) {
        this.show = true;
        this.msg = msg;
        if(this.timer != null) clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          this.closeMessage();
        }, time)
      },
      closeMessage() {
        this.show = false;
      }
    }
  }
</script>

<style scoped>
  .alert-box{
    position: absolute;
    width: 20rem;
    height: 10rem;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    background-color: rgba(0,0,0,0.8);
    border-radius: 10px;
    z-index: 9999;
  }
  .alert-message{
    text-align: center;
    line-height: 10rem;
  }
  .alert-message span{
    color: #fff;
  }
</style>
