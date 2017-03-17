import mongoose, { Schema } from 'mongoose';
import ContactSchema from './Contact';
import async from 'async';
import validator from 'validator';

const PatientSchema = new Schema({
    patientId: {
        type: Number,
        required: true,
        unique: true,
        validate: {
            isAsync: true,
            validator: function (v, cb) {
                const self = this;
                const Patient = self.model('Patient');
                Patient.findOne({
                    patientId: v,
                    _id: { '$ne': self._id }
                }).then(doc => {
                    cb(!doc);
                }, err => {
                    cb(true);
                });                
            },
            message: '{PATH} with value {VALUE} already exists!'
        }
    },
    patientName: {
        type: String,
        required: true
    },
    birthday: Date,
    gender: String,
    photo: String,
    pastMediacation: String,
    tag: String,
    planningPregnancy: Boolean,
    elaborate: String,
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
    },
    contacts: [ContactSchema],
    phone: {
        type: String
    },
    tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }]

}, {
        timestamps: true
    });

// Update default photo
PatientSchema.pre('save', function (next) {

    if (!this.photo) {
        switch (this.gender) {
            case 'female':
                this.gender = 'female';
                this.photo = '/patient/patient_female.png';
                break;
            default:
                this.gender = 'male';
                this.photo = '/patient/patient_male.png';
                break;
        }
    }

    next();
});

PatientSchema.methods.addTags = (tags) => {
    const Tag = this.model('Tag');

}

PatientSchema.methods.syncOrCreateTags = () => {

}

// PatientSchema.path('patientId').validate(function (value, done) {

//     this.model('Patient').findOne({ patientId: value }).then(doc => {
//         done(!doc);
//     }, err => {
//         done(true);
//     });
// }, "{PATH} must be unique {VALUE}");


export default mongoose.model('Patient', PatientSchema);
