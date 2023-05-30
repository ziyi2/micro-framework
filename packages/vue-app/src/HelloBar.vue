<template>
  <h1>Hello Bar!</h1>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'

export default {
  name: "HelloBar",
  components: {
    // HelloWorld
  },

  mounted() {
    console.log('window.location.href: ', window.location.href)
  }
};
</script>
