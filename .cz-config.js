// https://github.com/leoforfree/cz-customizable/blob/master/cz-config-EXAMPLE.js
module.exports = {
  // 对原有的 types 进行汉化处理
  types: [
    { value: "特性", name: "特性:    一个新的特性" },
    { value: "修复", name: "修复:    修复一个Bug" },
    { value: "文档", name: "文档:    变更的只有文档" },
    { value: "格式", name: "格式:    空格, 分号等格式修复" },
    { value: "重构", name: "重构:    代码重构，注意和特性、修复区分开" },
    { value: "性能", name: "性能:    提升性能" },
    { value: "测试", name: "测试:    添加一个测试" },
    { value: "工具", name: "工具:    开发工具变动(构建、脚手架工具等)" },
    { value: "回滚", name: "回滚:    代码回退" },
    { value: "开发中", name: "开发中:  功能正在开发，还未完成" },
  ],

  // 以本小册的课程内容进行 scopes 的拆分
  // 如果是组件库，则可以根据组件的名称进行拆分
  // 如果是框架库，也可以根据框架库的模块内容进行拆分
  // 例如这里的框架设计还可以细分为 框架设计(沙箱)、框架设计(性能优化)、框架设计(通信)
  scopes: [
    { name: "方案了解" },
    { name: "框架原理" },
    { name: "工程设计" },
    { name: "框架设计" },
  ],

  usePreparedCommit: false, // to re-use commit from ./.git/COMMIT_EDITMSG
  allowTicketNumber: false,
  isTicketNumberRequired: false,
  ticketNumberPrefix: "TICKET-",
  ticketNumberRegExp: "\\d{1,5}",

  // it needs to match the value for field type. Eg.: 'fix'
  /*
    scopeOverrides: {
      fix: [
  
        {name: 'merge'},
        {name: 'style'},
        {name: 'e2eTest'},
        {name: 'unitTest'}
      ]
    },
    */
  // override the messages, defaults are as follows
  messages: {
    type: "选择一种提交类型:",
    scope: "选择一个 scope (可选):",
    // used if allowCustomScopes is true
    customScope: "选择一个 scope:",
    subject: "短说明:\n",
    body: '长说明，使用"|"换行(可选)：\n',
    breaking: "非兼容性说明 (可选):\n",
    footer: "关联关闭的 issue，例如：#31, #34(可选):\n",
    confirmCommit: "确定提交说明?",
  },

  allowCustomScopes: true,
  allowBreakingChanges: ["feat", "fix"],
  // skip any questions you want
  // skipQuestions: ['scope', 'body'],

  // limit subject length
  subjectLimit: 100,
  // breaklineChar: '|', // It is supported for fields body and footer.
  // footerPrefix : 'ISSUES CLOSED:'
  // askForBreakingChangeFirst : true, // default is false
};
