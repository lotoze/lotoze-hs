<template>
  <div v-if="show" class="alert-box alert-loading">
    <div class="loading-item">
      <div class="loader">
        <div class="loader-inner pacman">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <span class="tooltip">
              <p>加载中</p>
            </span>
      </div>
    </div>
  </div>

</template>

<script>

  export default {
    name: 'AlertLoading',
    props: {
      show: {
        type: Boolean
      }
    },
    components: {
    }
  }
</script>

<style scoped>
  .alert-box{
    position: absolute;
    width: 20rem;
    height: 20rem;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    background-color: rgba(0,0,0,0.8);
    border-radius: 10px;
    z-index: 9999;
  }
  .loading-item{
    display: flex;
    justify-content: center;
    margin-top: 30%;
  }
  .loading-item .loader .tooltip p{
    margin-top: 2rem;
    font-size: 2rem;
    color: #fff;
  }
</style>
