import mongoose, { Schema } from 'mongoose';

const OauthTokenSchema = new Schema({
    token: {
        type: String,
        required: true,
        unique: true
    },
    expriedAt: Date,
    clientId: {
        required: true,
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    scopes: []
})

export default mongoose.model('OauthToken', OauthTokenSchema);