<template>
  <div class="circle-loader" :class="status">
    <div class="status draw"></div>
  </div>
</template>

<script>
export default {
  name: 'LoadingIndicator',
  props: {
    status: {
      type: String,
      required: true
    }
  }
}
</script>
