import mongoose, { Schema } from 'mongoose';
import crypto from 'crypto';

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    salt: String,
    password: {
        type: String,
        required: [true, 'Why no type?'],
        min: [6, 'Too short'],
    },
    fullname: String,
    gender: String,
    brithday: Date,
    avatar: String,
    token: String,
    roles: [String]
}, {
        timestamps: true
    });

/**
 * Generate password
 */
UserSchema.pre('save', function (next) {
    if (this.password && this.isModified('password')) {
        this.salt = crypto.randomBytes(16).toString('base64');
        this.password = this.hashPassword(this.password);
    }

    switch (this.gender) {
        case 'female':
            this.gender = 'female';
            this.avatar = '/user/fe_male.png';
            break;
        default:
            this.gender = 'male';
            this.avatar = '/user/male.png';
            break;
    }

    next();
});

/**
 * Generate hash password
 */
UserSchema.methods.hashPassword = function (password) {
    if (this.salt && password) {
        return crypto.pbkdf2Sync(password, new Buffer(this.salt, 'base64'), 10000, 64, 'SHA1').toString('base64');
    } else {
        return password;
    }
};

/**
 * Check authenticate
 */
UserSchema.methods.authenticate = function (password) {
    return this.password === this.hashPassword(password);
};

/**
 * Save token
 */
UserSchema.methods.saveToken = function (token) {
    var self = this;
    const OauthToken = self.model('OauthToken');
    let oauth = new OauthToken({
        token: token,
        clientId: self
    })
    return oauth.save();
};

/**
 * Remove field
 */
UserSchema.set('toJSON', {
    transform: (doc, ret, options) => {
        delete ret.password;
        delete ret.salt;
        return ret;
    }
});

export default mongoose.model('User', UserSchema);