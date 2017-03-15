var dotenv = require('dotenv');
require('babel-register')({
    presets: ['es2015']
});
dotenv.config();
require('./src/index');