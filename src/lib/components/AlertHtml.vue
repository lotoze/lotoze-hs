<template>
  <Cover :show="show" @coverClose="coverClose">
    <template v-slot:coverAlert>
      <div class="alert-box alert-html">
        <slot name="html"></slot>
      </div>
    </template>
  </Cover>

</template>

<script>
  import Cover from './Cover'
  export default {
    name: 'AlertHtml',
    props: {
      show: {
        type: Boolean
      }
    },
    components: {
      "Cover": Cover
    },
    methods: {
      coverClose: function (data) {
        this.$emit("close", data);
      }
    }
  }
</script>

<style scoped>
  .alert-box{
    position: absolute;
    width: 90%;
    height: 70%;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    background-color: #fff;
    z-index: 9999;
    border-radius: 10px;
  }
</style>
