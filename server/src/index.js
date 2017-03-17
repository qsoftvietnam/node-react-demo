import Express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectMongo from 'connect-mongo';
import session from 'express-session';
import BodyParser from 'body-parser';
import cors from 'cors';
import ExpressValidator from 'express-validator';
import jwt from 'express-jwt';
import swagger from 'swagger-express';
import morgan from 'morgan';
import path from 'path';

//=== import internal ===
import Configs, { Database, App as AppConfig, Jwt as JwtConfig } from './Configs';
import Policies from './Policies';
import Routes from './Routes';
import * as Models from './Models';

import { seed } from './setup';

const app = Express();
const expressRouter = Express.Router();

//=== connection database ===
mongoose.connect(Database.db.uri, Database.db.options);

const MongoStore = connectMongo(session);

//Setup seed db
seed();

// Enable cors
app.use(cors());

app.use(Express.static('static'));
app.use(Express.static('dist'));

//Write log request
app.use(morgan('combined', AppConfig.logs));

// Init validator request
app.use(ExpressValidator({
    errorFormatter: (param, msg, value) => {
        let namespace = param.split('.')
            , root = namespace.shift()
            , formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));

// Parser data request
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({
    extended: true
}));

app.use(session({
    secret: JwtConfig.secretKey,
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
}));


// Parser jwt
app.use(jwt({
    secret: JwtConfig.secretKey,
    credentialsRequired: false,
    requestProperty: 'auth',
    getToken: (req) => {
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            req.accessToken = req.headers.authorization.split(' ')[1];
            return req.headers.authorization.split(' ')[1];
        } else if (req.query && req.query.access_token) {
            req.accessToken = req.query.access_token;
            return req.query.access_token;
        }
        return false;
    }
}));

app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
        next();
        // res.status(401).send({
        //     message: 'Invalid token...'
        // });
    }
});

// Init router
app.use('/api/v1', expressRouter.use('/auth', Routes.Auth));
app.use('/api/v1', expressRouter.use('/patient', Routes.Patient));
app.use('/api/v1', expressRouter.use('/hospital', Routes.Hospital));
app.use('/api/v1', expressRouter.use('/upload', Routes.Upload));
app.use('/api/v1', expressRouter.use('/tag', Routes.Tag));

app.get('/', function (req, res) {
	res.sendFile(path.join(process.pwd(), './dist/index.html'));
});

//=== start server ===
const server = app.listen(AppConfig.port, () => {
    const host = server.address().address;
    const port = server.address().port;

    console.log(`App listening on port ${port}`);
});

//export default app;
module.exports = app;
