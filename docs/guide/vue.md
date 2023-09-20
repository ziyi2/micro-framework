# Vue 示例

> 以下是代码块，告诉开发者如何使用库 API，这里可以引入开发者发布的 NPM 包进行使用说明，注意代码块在 Markdown 中不是真正会运行的代码，只是告诉开发者如何使用

``` vue
<template>
  <div>{{msg}}</div>
</template>

<script>
  export default {
    data() {
      return {
         msg: 'Hello, Vue in Markdown!',
      }
    },
  }
</script>
```

> 以下是真正在 Markdown 中运行的 Vue 代码，和上述代码块中的代码一模一样，会在文档中展示运行结果，这里也可以设计输入框等交互动作，从而加深开发者对于上述代码块的理解

<template>
  <div>{{msg}}</div>
</template>

<script>
  export default {
    data() {
      return {
         msg: 'Hello, Vue in Markdown!',
      }
    },
  }
</script>
