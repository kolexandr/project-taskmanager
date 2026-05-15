require('@testing-library/jest-dom');

class MockResponse {
  constructor(body, init = {}) {
    this._body = body;
    this.status = init.status || 200;
  }

  async json() {
    return JSON.parse(this._body);
  }

  async text() {
    return this._body;
  }
}

global.Response = MockResponse;
