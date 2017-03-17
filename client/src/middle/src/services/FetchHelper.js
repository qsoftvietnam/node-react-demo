import 'whatwg-fetch';

class FetchHelper {
  constructor() {
    this.token = null;
  }

  get(url, params, mappers, sucess, failed, error) {
    if (mappers !== undefined && typeof mappers !== 'object') {
      return false;
    }

    let check = true;

    if (mappers) {
      mappers.forEach((param) => {
        if (params[param] === '' || params[param] === null) {
          check = false;
        }
      });
    }

    if (!check) {
      if (error !== undefined && typeof error === 'function') {
        error();
      }

      return;
    }

    let count = 0;
    for (const key in params ) {
      if (!count) {
        url = url + "?" + key + "="+ params[key];
        count++;
        continue;
      }

      url = url + "&" + key + "=" + params[key];
    }

    fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'credentials': 'include',
        'Authorization': 'Bearer ' + this.token
      }
    }).then((response) => {
      if (response.status === 200) {
          response.json().then((result) => {
            if (sucess !== undefined && typeof sucess === 'function') {
              sucess(result);
            }
          });
        return;
      }

      response.json().then((result) => {
        if (failed !== undefined && typeof failed === 'function') {
          failed(result);
        }
      });
    })
    .catch((message) => {
      if (error !== undefined && typeof error === 'function') {
        error(message);
      }
    });
  }

  post(url, params, mappers, sucess, failed, error) {
    if (mappers !== undefined && typeof mappers !== 'object') {
      return false;
    }

    let check = true;

    mappers.forEach((param) => {
      if (params[param] === '' || params[param] === null) {
        check = false;
      }
    });

    if (!check) {
      if (error !== undefined && typeof error === 'function') {
        error();
      }

      return;
    }

    let form = new FormData();

    for (const key in params ) {
      form.append(key, params[key]);
    }

    fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'multipart/form-data',
        'Authorization': 'Bearer ' + this.token
      },
      body: form
    }).then((response) => {
      return response.json();
    })
    .then((res) => {
      if (res.status == 200) {
          if (sucess !== undefined && typeof sucess === 'function') {
            sucess(res);
          }
        return;
      }

      if (failed !== undefined && typeof failed === 'function') {
        failed(res);
      }
    })
    .catch((message) => {
      if (error !== undefined && typeof error === 'function') {
        error(message);
      }
    })
    .done();
  }

  postEncode(url, method, params, mappers, sucess, failed, error) {
    if (mappers !== undefined && typeof mappers !== 'object') {
      return false;
    }

    let check = true;
    if (mappers) {
      mappers.forEach((param) => {
        if (params[param] === '' || params[param] === null) {
          check = false;
        }
      });
    }

    if (!check) {
      if (error !== undefined && typeof error === 'function') {
        error();
      }

      return;
    }

    let body = '';
    let counter = 0;

    for (const key in params ) {
      if (!counter) {
        body = body + key  + '=' + params[key];
        counter++;
        continue;
      }

      body = body + '&' + key  + '=' + params[key];
    }

    fetch(url, {
      method: method || 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Bearer ' + this.token
      },
      body: body
    }).then((response) => {
      if (response.status === 200) {
          response.json().then((result) => {
            if (sucess !== undefined && typeof sucess === 'function') {
              sucess(result);
            }
          });
        return;
      }

      response.json().then((result) => {
        if (failed !== undefined && typeof failed === 'function') {
          failed(result);
        }
      });
    })
    .catch((message) => {
      if (error !== undefined && typeof error === 'function') {
        error(message);
      }
    });
  }
}

export default new FetchHelper();