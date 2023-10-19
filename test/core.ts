import { core, hello } from "@/core/core";

describe("src/core/core.ts", () => {
  it("core 入参测试", () => {
    expect(core("Jest")).toBe("Hello Jest");
  });

  it("hello 入参测试", () => {
    expect(hello("Jest")).toBe("Hello Jest");
  });
});
