import { SandBoxType } from '../../../../interfaces';
import { noop } from 'lodash';
import { patchStrictSandbox } from '../forStrictSandbox';
jest.mock('import-html-entry', () => ({
    execScripts: jest.fn(),
}));
describe('forStrictSandbox test', () => {
    const { prototype: { createTreeWalker: originalCreateTreeWalker }, } = Document;
    beforeAll(() => {
        Document.prototype.createTreeWalker = function createTreeWalker(root, whatToShow, filter) {
            if (document !== root) {
                throw new TypeError('error');
            }
            return originalCreateTreeWalker.call(this, root, whatToShow, filter);
        };
    });
    afterAll(() => {
        Document.prototype.createTreeWalker = originalCreateTreeWalker;
    });
    it('should not throw on patched document', () => {
        let patchedDocument;
        const appName = 'test-app';
        const wrapper = document.createElement('div');
        const sandbox = {
            name: appName,
            type: SandBoxType.Proxy,
            proxy: window,
            sandboxRunning: true,
            latestSetProp: null,
            patchDocument: (patched) => {
                patchedDocument = patched;
            },
            active: noop,
            inactive: noop,
        };
        patchStrictSandbox(appName, () => wrapper, sandbox, true, false, undefined, true);
        expect(patchedDocument).toBeDefined();
        expect(() => patchedDocument?.createTreeWalker(patchedDocument)).not.toThrow();
    });
});
