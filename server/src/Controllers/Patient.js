import Express from 'express';
import mongoose from 'mongoose';
import validator from 'validator';
import _ from 'lodash';
//=== import internal ===
import { Patient } from './../Models';
import { getErrorMessage, generateErrors } from './Error';

class PatientController {
    //=== constructor ===
    constructor() {

    }

    /**
     * @api {get} /api/v1/patient Get all patients
     * @apiName patientList
     * @apiGroup Patient
     * @apiPermission auth
     * @apiSuccess {Array} Array data of patients.
     * @apiParam {String} name_search PatientId, Patient name or phone.
     * @apiVersion 1.0.0
     */
    list(req, res) {
        let query = {};
        if (req.query.name_search) {

            const where_query = `function() { return this.patientId.toString().match(/${req.query.name_search}/) != null; }`;
            query.$or = [
                {
                    'patientName': {
                        $regex: req.query.name_search,
                        $options: 'i'
                    }
                },
                {
                    'phone': {
                        $regex: req.query.name_search,
                        $options: 'i'
                    }
                }, {
                    $where: where_query
                }
            ];
        }

        Patient.find(query).then(datas => {
            return res.json(datas);
        }, err => {
            return res.send(err);
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        });
    }

    /**
     * @api {get} /api/v1/patient/:patientId Read patient
     * @apiName read patient
     * @apiGroup Patient
     * @apiPermission auth
     * @apiParam {Number} patientId
     * @apiSuccess {ObjectId} _id
     * @apiSuccess {Number} patientId   Patient ID
     * @apiSuccess {String} patientName  Patient name.
     * @apiSuccess {Date} [birthday]  birthday
     * @apiSuccess {String} [gender=male]  male|female
     * @apiSuccess {String} [photo]  Profile image
     * @apiSuccess {String} [pastMediacation]
     * @apiSuccess {String} [tag]
     * @apiSuccess {Boolean} [planningPregnancy]
     * @apiSuccess {String} [elaborate]
     * @apiSuccess {String} [phone]
     * @apiSuccess {String} [address]  Address
     * @apiSuccess {Number} [postalCode]  Postal Code
     * @apiSuccess {String} [email] Email
     * @apiSuccess {Array} [contacts]
     * @apiSuccess {String} [contacts.address]
     * @apiSuccess {String} [contacts.email]
     * @apiSuccess {Number} [contacts.postalCode]
     * @apiVersion 1.0.0
     */
    read(req, res) {
        return res.json(req.patient);
    }

    /**
     * @api {post} /api/v1/patient Create patient
     * @apiGroup Patient
     * @apiPermission auth
     * @apiParam {Number} patientId   Patient ID
     * @apiParam {String} patientName  Patient name.
     * @apiParam {Date} [birthday]  birthday
     * @apiParam {String} [gender=male]  male|female
     * @apiParam {String} [photo]  Profile image
     * @apiParam {String} [pastMediacation]
     * @apiParam {String} [tag]
     * @apiParam {Boolean} [planningPregnancy]
     * @apiParam {String} [elaborate]
     * @apiParam {String} [phone]
     * @apiParam {String} [address]  Address
     * @apiParam {String} [postalCode]  Postal Code
     * @apiParam {String} [email] Email
     * @apiParam {Array} [contacts]
     * @apiParam {String} [contacts.address]
     * @apiParam {String} [contacts.email]
     * @apiParam {String} [contacts.postalCode]
     * 
     * @apiSuccess {ObjectId} _id
     * @apiSuccess {Number} patientId   Patient ID
     * @apiSuccess {String} patientName  Patient name.
     * @apiSuccess {Date} [birthday]  birthday
     * @apiSuccess {String} [gender=male]  male|female
     * @apiSuccess {String} [photo]  Profile image
     * @apiSuccess {String} [pastMediacation]
     * @apiSuccess {String} [tag]
     * @apiSuccess {Boolean} [planningPregnancy]
     * @apiSuccess {String} [elaborate]
     * @apiSuccess {String} [phone]
     * @apiSuccess {String} [address]  Address
     * @apiSuccess {String} [postalCode]  Postal Code
     * @apiSuccess {String} [email] Email
     * @apiSuccess {Array} [contacts]
     * @apiSuccess {String} [contacts.address]
     * @apiSuccess {String} [contacts.email]
     * @apiSuccess {String} [contacts.postalCode]
     * @apiVersion 1.0.0
     */
    create(req, res) {

        let patient = new Patient(req.body);

        patient.validate((err) => {
            if (err) {
                const messages = generateErrors(err.errors);
                return res.status(400).send({
                    validate: messages
                });
            }

            patient.save().then(data => {
                return res.json(data);
            }, err => {
                return res.status(400).send({
                    message: getErrorMessage(err)
                });
            });
        });

    }

    /**
     * @api {put} /api/v1/patient/:patientId Update patient
     * @apiGroup Patient
     * @apiPermission auth
     * @apiParam {Number} patientId
     * @apiParam {String} [patientName]  Patient name.
     * @apiParam {Date} [birthday]  birthday
     * @apiParam {String} [gender=male]  male|female
     * @apiParam {String} [photo]  Profile image
     * @apiParam {String} [pastMediacation]
     * @apiParam {String} [tag]
     * @apiParam {Boolean} [planningPregnancy]
     * @apiParam {String} [elaborate]
     * @apiParam {String} [phone]
     * 
     * @apiSuccess {ObjectId} _id
     * @apiSuccess {Number} patientId   Patient ID
     * @apiSuccess {String} patientName  Patient name.
     * @apiSuccess {Date} [birthday]  birthday
     * @apiSuccess {String} [gender=male]  male|female
     * @apiSuccess {String} [photo]  Profile image
     * @apiSuccess {String} [pastMediacation]
     * @apiSuccess {String} [tag]
     * @apiSuccess {Boolean} [planningPregnancy]
     * @apiSuccess {String} [elaborate]
     * @apiSuccess {String} [phone]
     * @apiSuccess {Array} [contacts]
     * @apiSuccess {String} [contacts.address]
     * @apiSuccess {String} [contacts.email]
     * @apiSuccess {String} [contacts.postalCode]
     * @apiVersion 1.0.0
     */
    update(req, res) {
        delete req.body._id;
        delete req.body.patientId;
        delete req.body.contacts;
        let patient = req.patient;

        patient.set(req.body);

        patient.validate((err) => {
            if (err) {
                const messages = generateErrors(err.errors);
                return res.status(400).send({
                    validate: messages
                });
            }            

            patient.save().then(data => {
                return res.json(data);
            }, err => {
                return res.status(400).send({
                    message: getErrorMessage(err)
                });
            });
        });
    }

    /**
     * @api {delete} /api/v1/patient/:patientId Remove patient
     * @apiGroup Patient
     * @apiPermission auth
     * @apiParam {Number} patientId
     * @apiSuccess {Json} Object Object for patient.
     * @apiVersion 1.0.0
     */
    remove(req, res) {
        req.patient.remove().then((data) => {
            return res.json(data);
        }, err => {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        });
    }

    getPatientByID(req, res, next, id) {

        // if (!mongoose.Types.ObjectId.isValid(id)) {
        //     return res.status(400).send({
        //         message: 'Patient is invalid'
        //     });
        // }

        if (!validator.isNumeric(id)) {
            return res.status(400).send({
                message: 'Patient is invalid'
            });
        }

        Patient.findOne({ patientId: id }).then(data => {
            if (!data) {
                return res.status(400).send({
                    message: 'No Patient with that identifier has been found'
                });
            }
            req.patient = data;
            return next();
        }, err => {
            return next(err);
        });
    }
}

export default new PatientController();