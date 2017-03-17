//=== Import Internal ===
import * as Types from './types';
import {ApiUrl, FetchHelper} from '../../services';

//=== ACTIONS TYPES REDUX ===
function loggedIn(auth) {
  return {
    type: Types.LOGGED_IN,
    auth
  };
}

function loggedOut() {
  return {
    type: Types.LOGGED_OUT
  };
}

function logginError(message) {
  return {
    type: Types.LOGGED_ERROR,
    message
  };
}

function rememberChange(remember) {
  return {
    type: Types.REMEMBER_CHANGE,
    remember
  };
}

//=== ACTIONS LOGIC ===
function login(params) {
  return (dispatch) => {
    if (params.username === '' || params.username === null || params.password === '' || params.password === null) {
      dispatch(logginError('Login failed wrong password or username'));
      return;
    }

    FetchHelper.postEncode(
        ApiUrl.login,
        undefined,
        params,
        undefined,
        (res) => {
          let auth = {
            id: res.user._id,
            token: res.accessToken,
            remember: params.remember,
            isLogged: true,
            info: res.user
          };

          FetchHelper.token = auth.token;

          if (params.remember !== undefined && params.remember) {
            localStorage.setItem("auth", JSON.stringify(auth));
          }

          dispatch(loggedIn(auth));
        },
        (res) => {
          dispatch(logginError('Login failed wrong password or username'));
        },
        (error) => {
          dispatch(logginError('Server overload! try again'));
        }
    );
  }
}

function logout() {
  return (dispatch) => {
    localStorage.removeItem('auth');
    dispatch(loggedOut());
  }
}

export default {
  login,
  logout,
  rememberChange,
}
