/* eslint-env jasmine, jquery, browser */
/* global UProgress */

describe('API', () => {
  let up;

  beforeAll(() => {
    up = new UProgress();
  });

  afterAll(() => {
    up.destroy();
  });

  it('shoud expose start method', () => {
    expect(up.start).toEqual(jasmine.any(Function));
  });

  it('shoud expose done method', () => {
    expect(up.done).toEqual(jasmine.any(Function));
  });

  it('shoud expose set method', () => {
    expect(up.set).toEqual(jasmine.any(Function));
  });

  it('shoud expose destroy method', () => {
    expect(up.destroy).toEqual(jasmine.any(Function));
  });

  it('shoud expose refresh method', () => {
    expect(up.refresh).toEqual(jasmine.any(Function));
  });

  it('shoud expose status method', () => {
    expect(up.status).toEqual(jasmine.any(Function));
  });

  it('shoud expose options method', () => {
    expect(up.options).toEqual(jasmine.any(Function));
  });

  it('shoud expose the static Default options object', () => {
    expect(UProgress.Default).toEqual(jasmine.any(Object));
  });

  it('shoud not expose any other methods or attributes', () => {
    expect(Object.getOwnPropertyNames(up).sort()).toEqual(
      ['options', 'start', 'done', 'set', 'destroy', 'refresh', 'status'].sort()
    );
  });

  it('shoud expose a sealed static default options object', () => {
    expect(Object.isSealed(UProgress.Default)).toBeTruthy();
    expect(() => Object.defineProperty(UProgress.Default, 'testProp', {value: 'test'})).toThrowError(TypeError);
  });

  it('shoud expose a frozen API', () => {
    expect(Object.isFrozen(up)).toBeTruthy();
    expect(() => Object.defineProperty(up, 'testProp', {value: 'test'})).toThrowError(TypeError);
    expect(() => Object.defineProperty(up, 'start', {value: 'test'})).toThrowError(TypeError);
  });
});
