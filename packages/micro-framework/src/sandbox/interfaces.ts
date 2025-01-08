type FakeWindow = Window & Record<PropertyKey, unknown>;
export type GlobalWindow = (Window & typeof globalThis) | FakeWindow;
