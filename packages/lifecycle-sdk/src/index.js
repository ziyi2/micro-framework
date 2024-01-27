// 需要定义一个防冲突的全局属性（可以配置一些特殊符号，减少命名冲突的概率）
const lifeCycleKey = "single-spa-lifecycle-@xxx";

// lifeCycleKey 防冲突检查
export function checkLifeCycleKeyConflict() {
  if (!window[lifeCycleKey]) {
    window[lifeCycleKey] = [];
    // 用于标识 window[lifeCycleKey] 是一个生命周期函数存储池
    window[lifeCycleKey][lifeCycleKey] = lifeCycleKey;
    return;
  }

  // 根据上述创建逻辑判断 window[lifeCycleKey] 是否存在冲突
  // 如果存在冲突，那么说明 window[lifeCycleKey] 已经被其它程序占用
  if (
    !Array.isArray(window[lifeCycleKey]) ||
    window[lifeCycleKey][lifeCycleKey] !== lifeCycleKey
  ) {
    throw new Error("window.single-spa-lifecycle-@xxx 存在冲突");
  }
}

// 微应用初始化时调用，用于存储生命周期函数

// 需要注意微应用设置的 app 标识参数仍然是一个耦合项（需要和主应用进行约定）
// 主应用在调用 getLifecycle 时需要传入同样的 app 标识
// 在后续的 Fetch 方案中我们会讲解如何去除该 app 标识，从而形成彻底的解耦能力
export function setLifecycle(app, lifeCycle) {
  // 防冲突处理
  checkLifeCycleKeyConflict();

  // 如果存储池中已经存在了微应用对应生命周期函数
  // 那么更新已有的生命周期函数（微应用被再次初始化加载）
  const hasRecord = window[lifeCycleKey].find((item) => item.app === app);
  if (hasRecord) {
    hasRecord.lifeCycle = lifeCycle;
    return;
  }

  // 将生命周期函数存储到数组中
  window[lifeCycleKey].push({
    app,
    lifeCycle,
  });
}

// 主应用在加载和执行完微应用后获取生命周期函数
export function getLifecycle(app) {
  // 防冲突处理
  checkLifeCycleKeyConflict();

  // 根据 app 标识获取对应的生命周期函数
  const record = window[lifeCycleKey].find((item) => item.app === app);
  return record && record.lifeCycle;
}
