import * as Types from './types';

const initialState = {
  action: null,
  list: null,
  attach: null,
  saveResult: null,
  saveFaild: null,
  saveError: null
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

      default:
        return state
    }
}
