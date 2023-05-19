let instance;

export class WebLoginInstance {
  static get() {
    if (!instance) {
      instance = new WebLoginInstance()
    }
    return instance
  }

  setWebLoginContext(context) {
    this._context = context;
  }

  getWebLoginContext() {
    return this._context;
  }

  callContract(params) {
    return this._context.callContract(params);
  }

}