import mongoose from 'mongoose';

class Hospital {
    constructor() {

        return mongoose.model('Hospitals', new mongoose.Schema({
            name: {
                type: String,
                unique: true
            }
        }));

    }
}

export default new Hospital();