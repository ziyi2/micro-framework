/**
 * @author Kuitos
 * @since 2020-10-13
 */
import { checkActivityFunctions } from 'single-spa';
import {
  calcAppCount,
  isAllAppsUnmounted,
  patchHTMLDynamicAppendPrototypeFunctions,
  rebuildCSSRules,
  recordStyledComponentsCSSRules,
} from './common';
/**
 * Just hijack dynamic head append, that could avoid accidentally hijacking the insertion of elements except in head.
 * Such a case: ReactDOM.createPortal(<style>.test{color:blue}</style>, container),
 * this could make we append the style element into app wrapper but it will cause an error while the react portal unmounting, as ReactDOM could not find the style in body children list.
 * @param appName
 * @param appWrapperGetter
 * @param sandbox
 * @param mounting
 * @param scopedCSS
 * @param excludeAssetFilter
 */
export function patchLooseSandbox(
  appName,
  appWrapperGetter,
  sandbox,
  mounting = true,
  scopedCSS = false,
  excludeAssetFilter,
) {
  const { proxy } = sandbox;
  let dynamicStyleSheetElements = [];
  const unpatchDynamicAppendPrototypeFunctions = patchHTMLDynamicAppendPrototypeFunctions(
    /*
      check if the currently specified application is active
      While we switch page from qiankun app to a normal react routing page, the normal one may load stylesheet dynamically while page rendering,
      but the url change listener must wait until the current call stack is flushed.
      This scenario may cause we record the stylesheet from react routing page dynamic injection,
      and remove them after the url change triggered and qiankun app is unmounting
      see https://github.com/ReactTraining/history/blob/master/modules/createHashHistory.js#L222-L230
     */
    // 检查当前指定的应用是否处于激活状态
    () => checkActivityFunctions(window.location).some((name) => name === appName),
    // 由于单例模式，所以这里不需要像 proxy 一样将配置和代理对象进行关联
    () => ({
      appName,
      appWrapperGetter,
      proxy,
      strictGlobal: false,
      speedySandbox: false,
      scopedCSS,
      dynamicStyleSheetElements,
      excludeAssetFilter,
    }),
  );
  // 如果还没有挂载，则增加应用的 bootstrapping 计数
  if (!mounting) calcAppCount(appName, 'increase', 'bootstrapping');
  // 如果正在挂载，则增加应用的 mounting 计数
  if (mounting) calcAppCount(appName, 'increase', 'mounting');
  return function free() {
    // 如果没有挂载，则减少应用的 bootstrapping 计数
    if (!mounting) calcAppCount(appName, 'decrease', 'bootstrapping');
    // 如果正在挂载，则减少应用的 mounting 计数
    if (mounting) calcAppCount(appName, 'decrease', 'mounting');
    // release the overwrite prototype after all the micro apps unmounted
    // 释放所有微应用卸载后重写的原型
    if (isAllAppsUnmounted()) unpatchDynamicAppendPrototypeFunctions();
    recordStyledComponentsCSSRules(dynamicStyleSheetElements);
    // As now the sub app content all wrapped with a special id container,
    // the dynamic style sheet would be removed automatically while unmounting
    return function rebuild() {
      rebuildCSSRules(dynamicStyleSheetElements, (stylesheetElement) => {
        const appWrapper = appWrapperGetter();
        if (!appWrapper.contains(stylesheetElement)) {
          // Using document.head.appendChild ensures that appendChild invocation can also directly use the HTMLHeadElement.prototype.appendChild method which is overwritten at mounting phase
          document.head.appendChild.call(appWrapper, stylesheetElement);
          return true;
        }
        return false;
      });
      // As the patcher will be invoked every mounting phase, we could release the cache for gc after rebuilding
      if (mounting) {
        dynamicStyleSheetElements = [];
      }
    };
  };
}
