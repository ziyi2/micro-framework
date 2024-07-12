/**
 * @author Kuitos
 * @since 2020-03-02
 */
import { concat, mergeWith } from 'lodash';
import getEngineFlagAddon from './engineFlag';
import getRuntimePublicPathAddOn from './runtimePublicPath';
// global: 沙箱隔离的全局对象
// publicPath: 主应用的 publicPath
export default function getAddOns(global, publicPath) {
  return mergeWith({}, getEngineFlagAddon(global), getRuntimePublicPathAddOn(global, publicPath), (v1, v2) =>
    concat(v1 ?? [], v2 ?? []),
  );
}
