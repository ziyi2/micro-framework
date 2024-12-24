import { Settings } from "gulp-typescript";

export enum TargetTypeEnum {
  CommonJS = "CommonJS",
  ESModule = "ESModule",
}

export interface IPackageJson {
  name: string;
  main: string;
  module?: string;
  "jsnext:main"?: string;
  [key: string]: unknown;
}

export interface ITarget {
  name: string;
  type: TargetTypeEnum;
  tsconfig: Settings;
  packagejson: IPackageJson;
  dest: string;
}
