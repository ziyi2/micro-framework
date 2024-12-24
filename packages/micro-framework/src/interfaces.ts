import type { Activity, LifeCycleFn } from "single-spa";

declare global {
  interface Window {
    __POWERED_BY_FRAMEWORK__?: boolean;
  }
}

export type ObjectType = Record<string, unknown>;

interface IEntry {
  scripts?: string[];
  styles?: string[];
  html?: string;
}

export type EntryType = IEntry | string;

export interface IRegisterApp<T extends ObjectType = ObjectType> {
  name: string;
  // single-spa 的 app 参数会被 entry 进行封装处理
  entry: EntryType;
  activeWhen: Activity;
  // single-spa 的 customProps 参数在这里重命名为 props，并且不支持传递函数
  props?: T;
  container: string | HTMLElement;
}

// 框架不支持生命周期对象传递数组，所以这里对生命周期对象进行了封装
export type AppLifecycle<ExtraProps extends ObjectType = ObjectType> = {
  bootstrap: LifeCycleFn<ExtraProps>;
  mount: LifeCycleFn<ExtraProps>;
  unmount: LifeCycleFn<ExtraProps>;
};
