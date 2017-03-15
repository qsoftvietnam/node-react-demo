import mongoose, { Schema } from 'mongoose';
import validator from 'validator';

const ContactSchema = new Schema({
    address: String,
    postalCode: String,
    email: {
        type: String,
        validate: {
            validator: function (v) {
                return validator.isEmail(v) || !v;
            },
            message: '{VALUE} is not a valid email!'
        },
    }
}, {
        timestamps: true
    })

export default ContactSchema;