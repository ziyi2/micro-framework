import { Settings } from "gulp-typescript";

export enum TargetTypeEnum {
  CommonJS = "CommonJS",
  ESModule = "ESModule",
}

export interface ITarget {
  name: string;
  type: TargetTypeEnum;
  tsconfig: Settings;
  dest: string;
}
