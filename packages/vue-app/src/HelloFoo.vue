<template>
  <h1>Hello Foo!</h1>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'

export default {
  name: "HelloFoo",
  components: {
    // HelloWorld
  },

  mounted() {
    console.log('window.location.href: ', window.location.href)
  }

};
</script>
