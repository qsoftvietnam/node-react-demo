import * as Types from './types';

const initialState = {
  action: null,
  list: null,
  attach: null,
  saveResult: null,
  saveFaild: null,
  saveError: null,
  delete: {
    identity: null,
    result: null
  }
}

export default function patients(state = initialState, action) {
  state.action = action.type;

  switch (action.type) {
      case Types.PATIENT_FETCH:
        return Object.assign({}, state, {
            list: action.list
          }
        );

      case Types.PATIENT_RESET:
        return Object.assign({}, state, {
          list: null
        });

      case Types.PATIENT_ATTACH:
        return Object.assign({}, state, {
            attach: action.identity
          }
        );

      case Types.PATIENT_CLEAR:
        return Object.assign({}, state, {
            attach: null
          }
        );

      case Types.PATIENT_RESET:
        return Object.assign({}, state, {
          list: null
        });

      case Types.PATIENT_SAVE:
        return Object.assign({}, state, {
          saveResult: action.patient
        });
      case Types.PATIENT_SAVE_FAILD:
        return Object.assign({}, state, {
          saveFaild: action.faild
        });

      case Types.PATIENT_SAVE_ERROR:
        return Object.assign({}, state, {
          saveError: action.error
        });

      case Types.PATIENT_DELETE:
        return Object.assign({}, state, {
          delete: {
            identity: action.identity,
            result: action.result
          }
        });

      case Types.PATIENT_DELETE_FAILD:
        return Object.assign({}, state, {
          delete: {
            identity: action.identity,
            result: null
          },
        });

      default:
        return state
    }
}
