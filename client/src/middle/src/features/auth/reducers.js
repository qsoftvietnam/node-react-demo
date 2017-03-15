import * as Types from './types'

const initialState = {
  id: null,
  token: null,
  isLogged: false,
  info: {},
  error: false,
  message: null,
  action: null,
  remember: true
}

export default function auth(state = initialState, action) {
  state.action = action.type;
  state.error = false;
  state.message = null;

  switch (action.type) {
    case Types.LOGGED_IN:
      return Object.assign({}, state, action.auth)

    case Types.LOGGED_OUT:
      return Object.assign({}, state, {
        id: null,
        token: null,
        isLogged: false,
        info: {},
        remember: true
      })

    case Types.LOGGED_ERROR:
      return Object.assign({}, state, {
        error: true,
        message: action.message
      })

    case Types.REMEMBER_CHANGE:
      return Object.assign({}, state, {
        remember: action.remember
      })

    default:
      return state
  }
}
