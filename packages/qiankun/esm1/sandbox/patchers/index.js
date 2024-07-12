/**
 * @author Kuitos
 * @since 2019-04-11
 */
import { SandBoxType } from '../../interfaces';
import * as css from './css';
import { patchLooseSandbox, patchStrictSandbox } from './dynamicAppend';
import patchHistoryListener from './historyListener';
import patchInterval from './interval';
import patchWindowListener from './windowListener';
export function patchAtMounting(appName, elementGetter, sandbox, scopedCSS, excludeAssetFilter, speedySandBox) {
  const basePatchers = [
    () => patchInterval(sandbox.proxy),
    () => patchWindowListener(sandbox.proxy),
    () => patchHistoryListener(),
  ];
  const patchersInSandbox = {
    [SandBoxType.LegacyProxy]: [
      ...basePatchers,
      () => patchLooseSandbox(appName, elementGetter, sandbox, true, scopedCSS, excludeAssetFilter),
    ],
    [SandBoxType.Proxy]: [
      ...basePatchers,
      () => patchStrictSandbox(appName, elementGetter, sandbox, true, scopedCSS, excludeAssetFilter, speedySandBox),
    ],
    [SandBoxType.Snapshot]: [
      ...basePatchers,
      () => patchLooseSandbox(appName, elementGetter, sandbox, true, scopedCSS, excludeAssetFilter),
    ],
  };
  return patchersInSandbox[sandbox.type]?.map((patch) => patch());
}
// 在应用启动时执行的 patcher, 用于处理一些副作用
export function patchAtBootstrapping(appName, elementGetter, sandbox, scopedCSS, excludeAssetFilter, speedySandBox) {
  const patchersInSandbox = {
    // 旧版沙箱
    [SandBoxType.LegacyProxy]: [
      () => patchLooseSandbox(appName, elementGetter, sandbox, false, scopedCSS, excludeAssetFilter),
    ],
    // Proxy 沙箱
    [SandBoxType.Proxy]: [
      () => patchStrictSandbox(appName, elementGetter, sandbox, false, scopedCSS, excludeAssetFilter, speedySandBox),
    ],
    [SandBoxType.Snapshot]: [
      () => patchLooseSandbox(appName, elementGetter, sandbox, false, scopedCSS, excludeAssetFilter),
    ],
  };
  // 根据沙箱类型执行对应的 patcher
  return patchersInSandbox[sandbox.type]?.map((patch) => patch());
}
export { css };
