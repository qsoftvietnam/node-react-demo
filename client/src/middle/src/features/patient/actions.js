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

function savePatient(params, sucess) {
  return (dispatch) => {
    let mappers = [];

    FetchHelper.postEncode(
        ApiUrl.patient,
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

export default {
  patientFetch,
  patientReset,
  fetchPatient,
  savePatient,
  patientSave
}
