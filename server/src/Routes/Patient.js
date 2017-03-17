import Express from 'express';

import { Patient, Contact } from './../Controllers';
import Policies, { PatientPolicy, AuthPolicy } from './../Policies';

const Router = Express.Router();

Router.route('/')
    .get(AuthPolicy.requireLogin, Patient.list)
    .post(AuthPolicy.requireLogin, Patient.create);

Router.route('/:patientId(\\d+)/')
    .get(AuthPolicy.requireLogin, Patient.read)
    .put(AuthPolicy.requireLogin, Patient.update)
    .delete(AuthPolicy.requireLogin, Patient.remove);

Router.route('/:patientId(\\d+)/contact')
    .post(Contact.create);

Router.route('/:patientId(\\d+)/contact/:contactId')
    .delete(Contact.remove)
    .put(Contact.update);

Router.param('patientId', Patient.getPatientByID);
Router.param('contactId', Contact.getRecordByID);

export default Router;