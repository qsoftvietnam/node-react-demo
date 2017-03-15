import mongoose from 'mongoose';
import { Patient } from './../Models';
import _ from 'lodash';
import { getErrorMessage } from './Error';
import util from 'util';

/**
 * @api {post} /api/v1/patient/:patientId/contact Create contact for patient
 * @apiGroup Patient/Contact
 * @apiPermission auth
 * @apiParam {String} [address]  Address
 * @apiParam {Number} [postalCode]  Postal Code
 * @apiParam {String} [email] Email
 * @apiSuccess {ObjectId} _id
 * @apiSuccess {String} [email]
 * @apiSuccess {String} [address]
 * @apiSuccess {Number} [postalCode]
 * @apiVersion 1.0.0
 */
export function create(req, res) {
    req.checkBody({
        'email': {
            optional: true,
            isEmail: {
                errorMessage: 'Invalid Email'
            }
        }
    });

    req.getValidationResult().then(function (result) {
        if (!result.isEmpty()) {
            return res.status(400).json(result.mapped());
        }
        const patient = req.patient;
        patient.contacts.push(req.body);
        const contact = _.last(patient.contacts);
        patient.save().then(data => {
            return res.json(contact);
        }, err => {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        });
    });



}


/**
 * @api {delete} /api/v1/patient/:patientId/contact/:contactId Remove contact for patient
 * @apiGroup Patient/Contact
 * @apiPermission auth
 * @apiSuccess {ObjectId} _id
 * @apiSuccess {String} [email]
 * @apiSuccess {String} [address]
 * @apiSuccess {Number} [postalCode]
 * @apiVersion 1.0.0
 */
export function remove(req, res) {
    const contact = req.contact;
    const patient = req.patient;
    contact.remove();
    patient.save().then(() => {
        return res.json(contact);
    }, err => {
        return res.status(400).send({
            message: getErrorMessage(err)
        });
    });

}

/**
 * @api {put} /api/v1/patient/:patientId/contact/:contactId Update contact for patient
 * @apiGroup Patient/Contact
 * @apiPermission auth
 * @apiParam {String} [address]  Address
 * @apiParam {Number} [postalCode]  Postal Code
 * @apiParam {String} [email] Email
 * 
 * @apiSuccess {ObjectId} _id
 * @apiSuccess {String} [email]
 * @apiSuccess {String} [address]
 * @apiSuccess {Number} [postalCode]
 * @apiVersion 1.0.0
 */
export function update(req, res) {
    let contact = req.contact;
    const patient = req.patient;
    delete req.body._id;
    contact.set(req.body);
    patient.save().then(() => {
        return res.json(contact);
    }, err => {
        return res.status(400).send({
            message: getErrorMessage(err)
        });
    });

}

export function getRecordByID(req, res, next, id) {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            message: 'Contact is invalid'
        });
    }

    var contact = req.patient.contacts.id(id);

    if (!contact) {
        return res.status(400).send({
            message: 'No Contact with that identifier has been found'
        });
    }
    req.contact = contact;
    return next();
}