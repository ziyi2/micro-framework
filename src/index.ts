export * from "./comm/comm1";
export * from "./comm/comm2";
export * from "./core/core";
export * from "./nav/nav";
export * from "./opt/opt1";
export * from "./opt/opt2";
export * from "./sandbox/sandbox1";
export * from "./sandbox/sandbox2";
export * from "./sandbox/sandbox3";

export function a(): string {
  // 没有分号
  return "a";
}

export function a(): number {
  const a = 1;
  const b = 2;
  return a + b;
}
