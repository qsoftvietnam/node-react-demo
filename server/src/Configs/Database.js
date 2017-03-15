import bluebird from 'bluebird';

export default {
    db: {
        uri: 'mongodb://localhost:27017/' + process.env.DB_NAME || 'offshore',
        options: {
            promiseLibrary: bluebird
        }
    },

    seed: process.env.MONGO_SEED || false,
    seedDb: {
        seedUser: {
            username: process.env.MONGO_SEED_USER_USERNAME || 'user',
            email: process.env.MONGO_SEED_USER_EMAIL || 'user@local.com',
            password: process.env.MONGO_SEED_USER_PASSWORD || 'user',
            fullname: 'User Local',
            roles: ['user']
        },
        seedAdmin: {
            username: process.env.MONGO_SEED_ADMIN_USERNAME || 'admin',
            email: process.env.MONGO_SEED_ADMIN_EMAIL || 'admin@local.com',
            password: process.env.MONGO_SEED_ADMIN_PASSWORD || 'admin',
            fullname: 'Admin Local',
            roles: ['user', 'admin']
        }
    }
};