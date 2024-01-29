// 需要定义一个防冲突的全局属性（可以配置一些特殊符号，减少命名冲突的概率）
const lifeCycleKey = "single-spa-lifecycle-@xxx";

// lifeCycleKey 防冲突检查
export function checkLifeCycleKeyConflict() {
  console.log("window[lifeCycleKey]", window[lifeCycleKey]);

  if (!window[lifeCycleKey]) {
    window[lifeCycleKey] = new Map();
    // 用于标识 window[lifeCycleKey] 是一个生命周期函数存储池
    window[lifeCycleKey].set(lifeCycleKey, lifeCycleKey);
    return;
  }

  // 创建之前的冲突检测和创建之后的被覆盖检测
  if (
    !window[lifeCycleKey] instanceof Map ||
    window[lifeCycleKey].get(lifeCycleKey) !== lifeCycleKey
  ) {
    // 如果是创建之前已经存在 window[lifeCycleKey]，那么说明 window[lifeCycleKey] 已经被其它程序创建
    // 如果是创建之后 window[lifeCycleKey] 被覆盖，那么说明 window[lifeCycleKey] 已经被其它程序覆盖
    throw new Error("window.single-spa-lifecycle-@xxx 存在冲突");
  }
}

// 微应用初始化时调用，用于存储生命周期函数
// 需要注意微应用设置的 app 标识参数仍然是一个耦合项（需要和主应用进行约定）
// 主应用在调用 getMicroAppLifecycle 时需要传入同样的 app 标识
// 在后续的方案中我们会讲解如何去除该 app 标识，从而形成彻底的解耦能力
export function registerMicroAppLifecycle(app, lifeCycle) {
  // 防冲突处理（注意这里是实时检测，防止开辟映射以后被覆盖）
  checkLifeCycleKeyConflict();

  // 如果存储池中已经存在了微应用对应生命周期函数，那么直接报错（防止同名微应用覆盖）
  // 这种方式可以避免微应用之间的命名冲突
  if (window[lifeCycleKey].has(app)) {
    throw new Error(`app: ${app} 已经存在`);
  }

  // 将微应用的生命周期函数存储到全局变量中
  window[lifeCycleKey].set(app, lifeCycle);
}

// 去除微应用的生命周期函数
// 只有在执行 singleSpa.unloadApplication('app1'); 时需要使用
// 微应用 unload 之前执行，再次 load 时会重新初始化微应用执行 registerMicroAppLifecycle
export function unregisterMicroAppLifecycle(app) {
  // 防冲突处理（注意这里是实时检测，防止开辟映射以后被覆盖）
  checkLifeCycleKeyConflict();

  // 如果存储池中不存在该微应用对应生命周期函数，那么直接报错
  if (!window[lifeCycleKey].has(app)) {
    throw new Error(`app: ${app} 不存在`);
  }

  // 将微应用的生命周期函数从全局变量中移除
  window[lifeCycleKey].delete(app);
}

// 主应用在加载和执行完微应用后获取生命周期函数
export function getMicroAppLifecycle(app) {
  // 防冲突处理（注意这里是实时检测，防止开辟映射以后被覆盖）
  checkLifeCycleKeyConflict();

  // 根据 app 标识获取对应的生命周期函数
  const lifeCycle = window[lifeCycleKey].get(app);
  if (!lifeCycle) {
    throw new Error(`app: ${app} 不存在`);
  }
  return lifeCycle;
}
