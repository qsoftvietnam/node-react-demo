/*=== import the common packages ===*/
import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import moment from 'moment';
import {Grid, Col, Row} from 'react-bootstrap';
import {MuiThemeProvider, TextField, Snackbar, DatePicker, RaisedButton, FlatButton, FontIcon, RadioButtonGroup, RadioButton, Dialog} from 'material-ui';
import Dropzone from 'react-dropzone';
import {browserHistory} from 'react-router';
/*=== import internal ===*/
import './styles.scss'; // import styles of create patient page
import {actions, types} from '../../middle'; // call to actions & types (redux)
import {FetchHelper} from '../../middle/src/services';  // call to actions & types (redux)
import 'whatwg-fetch';

// map data of redux
const mapStateToProps = (state) => {
  const {patient} = state

  return {
    patient
  };
}

class PatientForm extends Component {
  // constructor: this is function to setup default states & call to the init functions
  constructor(props) {
    super(props);

    this.state = {
      patient : { // the attribute of a patient
        patientId: '',
        patientName: '',
        birthday: null,
        gender: 'male',
        pastMediacation: '',
        tag: '',
        address: '',
        postalCode: '',
        email: '',
        planningPregnancy: false,
        elaborate: '',
        photo: null,
        contacts: []
      },
      isValid: true,
      errorText: { // validate for each attribute
        patientId: null,
        patientName: null,
        birthday: null,
        gender: null,
        pastMediacation: null,
        tag: null,
        address: null,
        postalCode: null,
        email: null,
        planningPregnancy: null,
        elaborate: null
      },
      file: null,
      notificationType: null,
      message: '',
      openMessage: false,
      pastMediacationLabelTop: styles.textAreaLabelTop,
      tagLabelTop: styles.textAreaLabelTop,
      elaborateLabelTop: styles.textAreaLabelTop,
      maxDate: new Date()
    }
  }

  // componentWillReceiveProps: this function will called when have a new props or prop received a new value (lifecycle react)
  componentWillReceiveProps(props) {
    const {patient} = props;

    if (patient !== undefined && patient.action !== null) {
        if (patient.action === types.patient.PATIENT_SAVE) {
          this.setState({openMessage: true, message: 'Save patient successfully !'});
        }

        if (patient.action === types.patient.PATIENT_SAVE_FAILD && patient.saveFaild !== undefined && patient.saveFaild.validate !== undefined ) {
            this.setState({isValid: false, message: 'Form Invalid !', errorText: patient.saveFaild.validate});
        }

        if (patient.action === types.patient.PATIENT_SAVE_ERROR) {
          this.setState({isValid: false, message: 'An error happen in process data or internet quality.'});
        }
    }
  }

  // onDrop: this function is using to upload avatar. it is callback of Dropzone
  onDrop(acceptedFiles, rejectedFiles) {
      if (acceptedFiles.length > 0) {
        acceptedFiles.forEach((file)=> {
            this.setState({file: file});
            let form = new FormData();
            form.append('avatar', file, file.name);

            fetch('http://localhost:3002/api/v1/upload', {
              method: 'POST',
              headers: {
                'Authorization': 'Bearer ' + FetchHelper.token
              },
              body: form
            }).then((response) => {
              if (response.status === 200) {
                return response.json();
              }
            }).then((res) => {
              this.state.patient.photo = res.url;
              this.setState({patient: this.state.patient});
            });
        });
      }

  }

  // validations: this function to apply the rule for validations
  validations() {
    for (let [name, value] of Object.entries(this.state.patient)) {
      this.ruleValid(name, value);
    }
  }

  // ruleValid: this function defined the rule
  ruleValid(name, value) {
    let fields = {
      patientId: 'PATIENT ID',
      patientName: 'PATIENT NAME',
      email: 'EMAIL'
    };

    switch(name) {
      case 'patientId':
      case 'patientName':
        this.state.isValid = true;
        this.state.errorText[name] = null;

        if (value === '') {
          this.state.isValid = false;
          this.state.errorText[name] = 'This '+ fields[name] +' is required';
        }

        this.setState({isValid: this.state.isValid, errorText: this.state.errorText});
      break;

      case 'email':
        if (value !== '' && value !== null) {
          let regex = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;
          this.state.isValid = true;
          this.state.errorText[name] = null;

          if (!regex.test(value)) {
            this.state.isValid = false;
            this.state.errorText[name] = 'This '+ fields[name] +' invalid format';
          }
        }
      default:
        break;
    }
  }

  // convertDatas: this function to convert date with a format
  convertDatas() {
    let results = {};
    let {patient, patient:{birthday}} = this.state;

    for (let [name, value] of Object.entries(patient)) {
      if (value !== '' && value !== null) {
        results[name] = value;
      }
    }

    if (birthday !== null) {
      results['birthday'] = moment(birthday).format('YYYY-MM-DD HH:mm');
    }

    return results;
  }

  // onChangeValue: this is function to handle the change of the inputs in form. we will set state again when the value changed
  onChangeValue(name, value, type) {
      if(typeof (name) !== 'undefined') {
        switch(name) {
          case 'planningPregnancy':
            if (!value) {
              this.state.patient.elaborate = '';
            }
          break;
        }

        this.ruleValid(name, value);
        this.state.patient[name] = value;
        this.setState({patient: this.state.patient});

        if(type == 'textarea') {
            var attrLabelTop = name + 'LabelTop';
            var objChangeState = {};
            objChangeState[attrLabelTop] = (value.length > 0) ? styles.textAreaLabelFocusTop : styles.textAreaLabelTop;
            this.setState(objChangeState);
        }
      }
  }

  // onSave: check form validations before call to save action in middle
  onSave() {
    this.validations();

    if (!this.state.isValid) {
      this.setState({message: 'Form invalid !'});
    }

    if (this.state.isValid) {
      this.props.dispatch(actions.patient.savePatient(this.convertDatas())); // call to save action in middle (redux)
    }
  }

  // onToList: redirect to patient page after save a patient
  onToList() {
    this.props.router.push('/patient');
  }

  // render: this is function to render all element of create patient page into dom
  render() {
    return (
      <MuiThemeProvider>
        <Grid className="form">
          <Row>
            <Col className="frm-patient" sm={12} xs={12}>
              <Row>
                <Col className="frm-p-avatar" sm={3} xs={12}>
                    <Dropzone onDrop={(acceptedFiles, rejectedFiles) => this.onDrop(acceptedFiles, rejectedFiles)} multiple={false}>
                        <div className="default-area">
                            <div className="default-img">
                                <img src="/images/camera.png"/>
                                <div>Profile photo</div>
                            </div>
                            <div className="preview-img">
                                {this.state.file !== null ? <img src={this.state.file.preview} /> : null}
                            </div>
                        </div>
                    </Dropzone>
                </Col>
                <Col className="frm-p-profile" sm={9} xs={12}>
                  <Row>
                    <Col className="lbl-change-top" sm={6} xs={12}>
                      <TextField
                        className="input-border"
                        floatingLabelText="PATIENT ID"
                        multiLine={false}
                        fullWidth={true}
                        rows={1}
                        name="patientId"
                        value={this.state.patient.patientId}
                        onChange={(event, value)=>this.onChangeValue(event.target.name, value, 'text')}
                        errorText={this.state.errorText.patientId}
                        errorStyle={styles.errorTextField}
                      />
                    </Col>
                    <Col className="lbl-change-top" sm={6} xs={12}>
                      <TextField
                        className="input-border"
                        floatingLabelText="PATIENT NAME"
                        multiLine={false}
                        fullWidth={true}
                        rows={1}
                        name="patientName"
                        value={this.state.patient.patientName}
                        onChange={(event, value)=>this.onChangeValue(event.target.name, value, 'text')}
                        errorText={this.state.errorText.patientName}
                        errorStyle={styles.errorTextField}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col className="lbl-change-top" sm={6} xs={12}>
                      <DatePicker
                        className="input-border"
                        container="inline"
                        floatingLabelText="BIRTHDAY"
                        fullWidth={true}
                        textFieldStyle={{height: '72px'}}
                        value={this.state.patient.birthday}
                        onChange={(firstParam, value)=>this.onChangeValue('birthday', value, 'text')}
                        maxDate={this.state.maxDate}
                        errorText={this.state.errorText.birthday}
                        errorStyle={styles.errorTextField}
                      />
                    </Col>
                    <Col className="lbl-not-top" sm={6} xs={12}>
                        <div className="gender-area">
                            <label className="title">GENDER</label>
                            <RadioButtonGroup name="gender" className="patient-gender" defaultSelected={this.state.patient.gender} onChange={(event, value)=>this.onChangeValue(event.target.name, value, 'radio')}>
                              <RadioButton
                                value="male"
                                label="Male"
                              />
                              <RadioButton
                                value="female"
                                label="Female"
                              />
                            </RadioButtonGroup>
                        </div>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col>
            <Col className="text-area-change-top mg-top-bt-15 mg-top-0" sm={12} xs={12}>
              <TextField
                className="input-border textarea-elm"
                floatingLabelText="PAST MEDIACATION"
                floatingLabelStyle={this.state.pastMediacationLabelTop}                
                hintText="Mediacation"
                multiLine={true}
                fullWidth={true}
                rows={6}
                floatingLabelFixed={true}
                hintStyle={styles.hintTextField}
                name="pastMediacation"
                value={this.state.patient.pastMediacation}
                onChange={(event, value)=>this.onChangeValue(event.target.name, value, 'textarea')}
                errorText={this.state.errorText.mediacation}
                errorStyle={styles.errorTextField}
              />
            </Col>
            <Col className="text-area-change-top mg-top-bt-15 mg-bt-0" sm={12} xs={12}>
              <TextField
                className="input-border textarea-elm"
                floatingLabelText="TAG"
                floatingLabelStyle={this.state.tagLabelTop}
                hintText="Add a tag"
                multiLine={true}
                fullWidth={true}
                rows={1}
                floatingLabelFixed={true}
                hintStyle={styles.hintTextField}
                name="tag"
                value={this.state.patient.tag}
                onChange={(event, value)=>this.onChangeValue(event.target.name, value, 'textarea')}
                errorText={this.state.errorText.tag}
                errorStyle={styles.errorTextField}
              />
            </Col>
          </Row>
          <Row className="row-contact">
            <Col className="" sm={2} xs={12}>
              <h3>Contact</h3>
            </Col>
            <Col sm={10} xs={12}>
              <div className="frm-p-contact lbl-change-top">
                <Row>
                    <Col sm={6} xs={12}>
                      <TextField
                        className="input-border"
                        floatingLabelText="ADDRESS"
                        multiLine={false}
                        fullWidth={true}
                        rows={1}
                        name="address"
                        value={this.state.patient.address}
                        onChange={(event, value)=>this.onChangeValue(event.target.name, value, 'text')}
                        errorText={this.state.errorText.address}
                        errorStyle={styles.errorTextField}
                      />
                    </Col>
                    <Col sm={6} xs={12}>
                      <TextField
                        className="input-border"
                        floatingLabelText="POSTAL CODE"
                        multiLine={false}
                        fullWidth={true}
                        rows={1}
                        name="postalCode"
                        value={this.state.patient.postalCode}
                        onChange={(event, value)=>this.onChangeValue(event.target.name, value, 'text')}
                        errorText={this.state.errorText.postalCode}
                        errorStyle={styles.errorTextField}
                      />
                    </Col>
                </Row>
                <Row>
                    <Col sm={12} xs={12}>
                      <TextField
                        className="input-border"
                        floatingLabelText="EMAIL"
                        multiLine={false}
                        fullWidth={true}
                        rows={2}
                        name="email"
                        value={this.state.patient.email}
                        onChange={(event, value)=>this.onChangeValue(event.target.name, value, 'text')}
                        errorText={this.state.errorText.email}
                        errorStyle={styles.errorTextField}
                      />
                    </Col>
                </Row>
                <Row>
                    <Col sm={12} xs={12}>
                      <FlatButton
                        className="lower"
                        label="Add another contact"
                        primary={true}
                        icon={<FontIcon className="fa fa-plus" style={{fontSize: '14px'}}/>}
                      />
                    </Col>
                </Row>
              </div>
            </Col>
          </Row>
          <Row>
            <Col sm={12} xs={12}>
                <div className="row-fluid">
                  <h3>Are you planning for pregnancy?</h3>
                  <RadioButtonGroup name="planningPregnancy" className="planning-pregnancy" defaultSelected={this.state.patient.planningPregnancy} onChange={(event, value)=>this.onChangeValue(event.target.name, value, 'radio')}>
                      <RadioButton
                        value={true}
                        label="Yes"
                      />
                      <RadioButton
                        value={false}
                        label="No"
                      />
                  </RadioButtonGroup>
                </div>
                <div className="row-fluid text-area-change-top textarea-elm">
                  <TextField
                    className="input-border"
                    floatingLabelText="IF YES, PLEASE ELABORATE"
                    floatingLabelStyle={this.state.elaborateLabelTop}
                    hintText="Elaborate"
                    multiLine={true}
                    fullWidth={true}
                    rows={6}
                    floatingLabelFixed={true}
                    hintStyle={styles.hintTextField}
                    name="elaborate"
                    disabled={!this.state.patient.planningPregnancy}
                    value={this.state.patient.elaborate}
                    onChange={(event, value)=>this.onChangeValue(event.target.name, value, 'textarea')}
                    errorText={this.state.errorText.elaborate}
                    errorStyle={styles.errorTextField}
                  />
                </div>
            </Col>
          </Row>
          <Row>
            <Col sm={1} xs={12}>
              <RaisedButton
                className="btn-save"
                label="Save"
                primary={true}
                onClick={() => this.onSave()}
                icon={<FontIcon className="fa fa-floppy-o" style={{fontSize: '14px'}}/>}
              />
            </Col>
            <Col sm={1} xs={12}>
              <RaisedButton
                className="btn-back"
                label="Back"
                primary={true}
                onClick={() => this.onToList()}
                icon={<FontIcon className="fa fa-arrow-left" style={{fontSize: '14px'}}/>}
              />
            </Col>
          </Row>

          <Snackbar
            open={!this.state.isValid}
            message={this.state.message}
            bodyStyle={styles.backgroudError}
          />

          <Dialog
            title="Notification"
            actions={[
              <FlatButton
                label="Ok"
                primary={true}
                keyboardFocused={true}
                onTouchTap={() => this.onToList()}
              />
            ]}
            open={this.state.openMessage}
          >
            {this.state.message}
          </Dialog>
        </Grid>
      </MuiThemeProvider>
    )
  }
}

module.exports = connect(mapStateToProps)(PatientForm)

// the object to apply for style element
const styles = {
  errorTextField: {
    marginLeft: '20px',
    marginTop: '-2px',
    fontSize: '11px',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    width: '90%',
    overflow: 'hidden'
  },
  hintTextField: {
    color: '#d2d2d2',
    left: '20px',
    top: '40px',
    fontSize: '16px',
    fontWeight: 'normal'
  },
  backgroudError: {
    backgroundColor: '#dc4437',
    textAlign: 'center'
  },
  textAreaLabelTop: {
      top: '15px'
  },
  textAreaLabelFocusTop: {
      top: '-15px',
      fontSize: '12px'
  }
};
