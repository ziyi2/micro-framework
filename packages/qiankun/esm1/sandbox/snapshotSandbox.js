import { SandBoxType } from '../interfaces';
function iter(obj, callbackFn) {
    // eslint-disable-next-line guard-for-in, no-restricted-syntax
    for (const prop in obj) {
        // patch for clearInterval for compatible reason, see #1490
        if (obj.hasOwnProperty(prop) || prop === 'clearInterval') {
            callbackFn(prop);
        }
    }
}
/**
 * 基于 diff 方式实现的沙箱，用于不支持 Proxy 的低版本浏览器
 */
export default class SnapshotSandbox {
    proxy;
    name;
    type;
    sandboxRunning = true;
    windowSnapshot;
    modifyPropsMap = {};
    constructor(name) {
        this.name = name;
        this.proxy = window;
        this.type = SandBoxType.Snapshot;
    }
    active() {
        // 记录当前快照
        this.windowSnapshot = {};
        iter(window, (prop) => {
            this.windowSnapshot[prop] = window[prop];
        });
        // 恢复之前的变更
        Object.keys(this.modifyPropsMap).forEach((p) => {
            window[p] = this.modifyPropsMap[p];
        });
        this.sandboxRunning = true;
    }
    inactive() {
        this.modifyPropsMap = {};
        iter(window, (prop) => {
            if (window[prop] !== this.windowSnapshot[prop]) {
                // 记录变更，恢复环境
                this.modifyPropsMap[prop] = window[prop];
                window[prop] = this.windowSnapshot[prop];
            }
        });
        if (process.env.NODE_ENV === 'development') {
            console.info(`[qiankun:sandbox] ${this.name} origin window restore...`, Object.keys(this.modifyPropsMap));
        }
        this.sandboxRunning = false;
    }
    patchDocument() { }
}
