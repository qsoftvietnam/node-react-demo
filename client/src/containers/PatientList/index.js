/*=== import the common packages ===*/
import React, {Component} from 'react';
import {connect} from 'react-redux';
import moment from 'moment';
import {Col, Row, Media, Form, FormGroup, ControlLabel, FormControl, Button, Label} from 'react-bootstrap';
import {MuiThemeProvider, Dialog, FontIcon, FlatButton, FloatingActionButton} from 'material-ui';
/*=== import internal ===*/
import './styles.scss'; // import styles of list patient page
import {actions, types} from '../../middle';  // call to actions & types (redux)
import config from '../../config'; // include the common config

class PatientList extends Component {
  // constructor: this is function to setup default states & call to the init functions
  constructor(props) {
    super(props);

    this.state = {
      patients: [],
      patient: null,
      openMessage: false,
      message: ''
    };
  }

  // componentWillMount: this function will called before render (lifecycle react)
  componentWillMount() {
    this.fetch();
  }

  // componentWillReceiveProps: this function will called when have a new props or prop received a new value (lifecycle react)
  componentWillReceiveProps(props) {
    const {patient, auth} = props;

    if (auth !== undefined && auth.action !== null) {
        if (auth.action === types.auth.LOGGED_OUT) {
            this.props.router.push('login');
        }
    }

    if (patient !== undefined && patient.action !== null) {
        if (patient.action === types.patient.PATIENT_FETCH && patient.list !== null) {
          this.setState({patients: patient.list});
        }

        if (patient.action === types.patient.PATIENT_DELETE) {
          this.fetch();
        }

        if (patient.action === types.patient.PATIENT_DELETE_FAILD) {

        }
    }
  }

  // fetch: this is function to fetch data
  fetch() {
    this.props.dispatch(actions.patient.fetchPatient());
  }

  // onLogout: this is function to logout
  onLogout() {
    this.props.dispatch(actions.auth.logout());
  }

  // onToCreate: this is function to redirect to create patient page
  onToPage(route) {
    if (route !== undefined) {
      this.props.router.push(route);
    }
  }

  // openMessage: this is function to open popup
  openMessage(open) {
    let message = '';

    if (open) {
      message = 'Delete this patient?'
    }

    this.setState({openMessage: open, message: message});
  }

  // onPreDetelePatient: this is function to attach patient before delete
  onPreDetelePatient(patient) {
    this.openMessage(true);
    this.setState({patient: patient});
  }

  // onDeletePatient: this is function to delete a patient
  onDeletePatient() {
    this.openMessage(false);
    this.props.dispatch(actions.patient.deletePatient(this.state.patient, this.state.patient));
  }

  // renderPatientlist: render html for list patient
  renderPatientlist(patient) {
    return (
      <Media key={patient._id}>
        <Media.Left className="p-l-image" align="top"  onClick={() => {this.onToPage('patient/' + patient.patientId)}}>
          <img  width={84} height={84} src={config.serverPath + patient.photo} alt="Image"/>
        </Media.Left>
        <Media.Body className="media-content">
          <Media.Heading><p><span className="lbl-title" onClick={() => {this.onToPage('patient/' + patient.patientId)}}>{patient.patientName}</span> <Label className="lbl-new">New</Label></p></Media.Heading>

          <div className="p-l-state">
            <span>CP</span>
            <span>Full time</span>
            <span><a>Need appointment</a></span>
          </div>
          <div className="p-l-timestamp">
            <div className="p-l-timestamp-item">
              <span>Meeting times: </span>
              <span className="p-l-t-time">8</span>
            </div>
            <div className="p-l-timestamp-item">
              <span>Update time: </span>
              <span className="p-l-t-time">{moment(patient.updatedAt).format('DD/MM/YY')}</span>
            </div>
          </div>
          <span></span>
        </Media.Body>
        <Media.Body className="p-l-location">
          <div className="p-l-location-inner">
            <i className="glyphicon glyphicon-map-marker" aria-hidden="true"></i>
            <span>{patient.address || '--'}</span>
          </div>
        </Media.Body>
        <Media.Body className="p-l-actions">
          <FloatingActionButton
            mini={true}
            secondary={true}
            onTouchTap={() => {this.onPreDetelePatient(patient)}}
          >
            <FontIcon className="fa fa-trash" style={{fontSize: '14px'}}/>
          </FloatingActionButton>
        </Media.Body>
      </Media>
    );
  }

  // render: this is function to render all element of list patient page into dom
  render() {
    return (
      <MuiThemeProvider>
        <div className="main-body">
          <section className="search-box">
            <Row>
              <Form className="col-sm-12">
                <FormGroup controlId="formInlineName">
                  <Col sm={5}>
                    <FormControl type="text" placeholder="Enter patient id, name, phone..." />
                  </Col>
                  <Col sm={5}>
                    <FormControl type="text" placeholder="Find all hospital" />
                  </Col>
                  <Col className="" sm={1}>
                    <Button bsStyle="warning" type="button">
                      <FontIcon className="fa fa-search" style={{color: '#ffffff', fontSize: '14px', marginRight: '5px'}}/>
                      <span>Find</span>
                    </Button>
                  </Col>

                  <Col className="" sm={1}>
                    <Button bsStyle="info" type="button" onClick={() => {this.onLogout()}}>
                      <FontIcon className="fa fa-sign-out" style={{color: '#ffffff', fontSize: '14px', marginRight: '5px'}}/>
                      <span>Logout</span>
                    </Button>
                  </Col>
                </FormGroup>
              </Form>
            </Row>
          </section>
          <section className="cover-list">
            <Row>
              <Col className="filter-box" sm={3} xs={12}>
                <div className="filter-box-inner">
                  <div className="f-b-item">
                    <ControlLabel>Status</ControlLabel>
                    <select className="form-control">
                      <option value="Open">Open</option>
                      <option value="Pending">Pending</option>
                      <option value="Finished">Finished</option>
                    </select>
                  </div>
                  <div className="f-b-item">
                    <ControlLabel>Update Time</ControlLabel>
                    <select className="form-control">
                      <option value="day">Last day</option>
                      <option value="weak">Last week</option>
                      <option value="two">Last month</option>
                      <option value="year">Last year</option>
                    </select>
                  </div>
                </div>
              </Col>
              <Col className="wrapper-patient-list" sm={9} xs={12}>
                <div className="inner-patient-list">
                  <div className="patient-list=header">
                    <Row>
                      <Col sm={6} xs={12}>
                        <h3 className="patient-list-title">{this.state.patients.length} Results</h3>
                      </Col>
                      <Col className="text-right" sm={6} xs={12}>
                        <Button bsStyle="success" type="button" onClick={() => {this.onToPage('patient/create')}}>
                          <FontIcon className="fa fa-plus" style={{color: '#ffffff', fontSize: '14px', marginRight: '5px'}}/>
                          <span>Create</span>
                        </Button>
                      </Col>
                    </Row>
                  </div>
                  <div className="patient-list">
                    {
                      this.state.patients.map((patient) => {
                        return this.renderPatientlist(patient);
                      })
                    }
                  </div>
                </div>
              </Col>
            </Row>
          </section>

          <Dialog
            title="Confirm"
            actions={[
              <FlatButton
                label="Cancel"
                primary={true}
                keyboardFocused={true}
                onTouchTap={() => {this.openMessage(false)}}
              />,
              <FlatButton
                label="Ok"
                primary={true}
                keyboardFocused={true}
                onTouchTap={() => {this.onDeletePatient()}}
              />
            ]}
            open={this.state.openMessage}
          >
            {this.state.message}
          </Dialog>
        </div>
      </MuiThemeProvider>
    )
  }
}

// map data of redux
const mapStateToProps = (state) => {
  const {auth, patient} = state

  return {
    auth,
    patient
  };
}

// map the states to props to using in patient list page
module.exports = connect(mapStateToProps)(PatientList)
