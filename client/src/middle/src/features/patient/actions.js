import * as Types from './types';
import {ApiUrl, FetchHelper} from '../../services';

//=== ACTIONS TYPES REDUX ===
function patientFetch(list) {
    return {
        type: Types.PATIENT_FETCH,
        list
    };
}

function patientReset() {
    return {
        type: Types.PATIENT_RESET
    };
}

function patientAttach(identity) {
  return {
    type: Types.PATIENT_ATTACH,
    identity
  };
}

function patientClear() {
  return {
    type: Types.PATIENT_CLEAR
  };
}

function patientSave(patient) {
    return {
        type: Types.PATIENT_SAVE,
        patient
    };
}

function patientSaveFaild(faild) {
    return {
        type: Types.PATIENT_SAVE_FAILD,
        faild
    };
}

function patientSaveError(error) {
    return {
        type: Types.PATIENT_SAVE_ERROR,
        error
    };
}

function patientDelete(result, identity) {
    return {
        type: Types.PATIENT_DELETE,
        result,
        identity
    };
}

function patientDeleteFaild(identity) {
    return {
        type: Types.PATIENT_DELETE_FAILD,
        identity
    };
}

//=== ACTIONS LOGIC ===
function fetchPatient(params, type) {
  return (dispatch) => {
    FetchHelper.get(
        ApiUrl.patient,
        params,
        undefined,
        (res) => {
            dispatch(patientFetch(res));
        },
        (faild) => {
            dispatch(patientReset(faild || null));
        },
        (error) => {
            dispatch(patientReset(error || null));
        }
    );
  }
}

function initPatient(params, type) {
  return (dispatch) => {
    const {patientId} = params;
    let mappers = ['patientId'];

    FetchHelper.get(
        ApiUrl.patient + '/' + patientId,
        {},
        undefined,
        (res) => {
            dispatch(patientAttach(res));
        },
        (faild) => {
            dispatch(patientClear());
        },
        (error) => {
            dispatch(patientClear());
        }
    );
  }
}

function savePatient(params, editable) {
  return (dispatch) => {
    let mappers = [];
    let {patientId} = params;
    let method = !editable ? 'POST' : 'PUT';
    let url = !editable ? ApiUrl.patient : ApiUrl.patient + '/' + patientId;

    FetchHelper.postEncode(
        url,
        method,
        params,
        mappers,
        (res) => {
            dispatch(patientSave(res));
        },
        (faild) => {
            dispatch(patientSaveFaild(faild));
        },
        (error) => {
            dispatch(patientSaveError(error || null));
        }
    );
  }
}

function deletePatient(params, identity) {
  return (dispatch) => {
    let promise = null;
    let mappers = ['patientId'];

    FetchHelper.postEncode(
      ApiUrl.patient + '/' + params.patientId,
      'DELETE',
      params,
      mappers,
      (result) => {
        console.log(result);
        dispatch(patientDelete(result, identity));
      },
      (faild) => {
        dispatch(patientDeleteFaild(identity));
      },
      (error) => {
        dispatch(patientDeleteFaild(identity));
      }
    );

    return promise;
  }
}

export default {
  patientFetch,
  patientReset,
  fetchPatient,
  savePatient,
  initPatient,
  patientSave,
  deletePatient
}
