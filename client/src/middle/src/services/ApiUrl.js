import config from '../../../config';

class ApiUrl {
  get base() {
    return config.apiPath;
  }

  //=== AUTH ===
  get login() {
    return this.base + 'auth/login';
  }

  //=== patient ===
  get patient() {
    return this.base + 'patient';
  }

  //=== upload ===
  get upload() {
    return this.base + 'upload';
  }

}
export default new ApiUrl();
