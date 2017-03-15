import jsonwebtoken from 'jsonwebtoken';
import mongoose from 'mongoose';
import { Jwt } from './../Configs';
import { User } from './../Models';
import { getErrorMessage } from './Error';

class AuthController {
    //=== constructor ===
    constructor() {

    }

    /**
     * @api {get} /api/v1/auth/me Get user by token
     * @apiGroup Auth
     * @apiPermission auth
     * @apiSuccess {String}  email
     * @apiSuccess {String}  username
     * @apiSuccess {String}  [avatar]
     * @apiSuccess {String}  [fullname]
     * @apiSuccess {String}  gender
     * @apiSuccess {Date}  [brithday]
     * @apiVersion 1.0.0
     * @apiHeader {String} Authorization Accesstoken for user.
     * @apiHeaderExample {json} Header-Example:
     *     {
     *       "Authorization": "Bearer token-here"
     *     }
     */
    me(req, res) {
        if (!req.auth)
            return res.status(401).send({
                message: 'Not Login'
            });

        User.findById(req.auth.id).then(user => {
            return res.json(user);
        }, err => {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        });

    }

    /**
     * @api {post} /api/v1/auth Register user
     * @apiGroup Auth
     * @apiVersion 1.0.0
     * @apiParam {String} email Email
     * @apiParam {String} username Username
     * @apiParam {String} password Password
     * @apiParam {String} [fullname]
     * @apiParam {String} [gender]
     * @apiParam {Date} [brithday]
     *
     * @apiSuccess {String} accessToken token of the User.
     * @apiSuccess {Json} user  User profile.
     * @apiSuccess {String}  user.email
     * @apiSuccess {String}  user.username
     * @apiSuccess {String}  [user.avatar]
     * @apiSuccess {String}  [user.fullname]
     * @apiSuccess {String}  user.gender
     * @apiSuccess {Date}  [user.brithday]
     */
    register(req, res) {

        req.checkBody({
            'email': {
                optional: {
                    options: { checkFalsy: true }
                },
                isEmail: {
                    errorMessage: 'Invalid Email'
                }
            },
            'username': {
                optional: true,
                isLength: {
                    options: [{ min: 6 }],
                    errorMessage: 'User name too short'
                },
                errorMessage: 'Invalid username'
            }
        });

        req.getValidationResult().then(function (result) {
            if (!result.isEmpty()) {
                return res.status(400).json(result.mapped());
            }

            delete req.body.roles
            let user = new User({
                email: req.body.email,
                username: req.body.username,
                password: req.body.password,
                gender: req.body.gender,
            });
            user.roles = ['user'];
            user.save().then(doc => {

                jsonwebtoken.sign({ email: doc.email, id: doc._id, username: doc.username }, Jwt.secretKey, Jwt.options, (err, token) => {
                    if (err) {
                        return res.status(400).send(err);
                    }
                    return res.json({
                        accessToken: token,
                        user: doc
                    });

                });
            }, err => {
                return res.status(400).send({
                    message: getErrorMessage(err)
                });
            });
        });
    }

    /**
     * @api {post} /api/v1/auth/login Login
     * @apiGroup Auth
     * @apiVersion 1.0.0
     * @apiParam {String} username Username
     * @apiParam {String} password Password
     * @apiSuccess {String} accessToken token of the User.
     * @apiSuccess {Json} user  User profile.
     * @apiSuccess {String}  user.email
     * @apiSuccess {String}  user.username
     * @apiSuccess {String}  [user.avatar]
     * @apiSuccess {String}  [user.fullname]
     * @apiSuccess {String}  user.gender
     * @apiSuccess {Date}  [user.brithday]
     */
    login(req, res) {        
        User.findOne({
            username: req.body.username
        }).then(user => {
            if (!user) {
                return res.status(400).send({
                    message: 'Login Fail!'
                });
            } else {
                if (!user.authenticate(req.body.password)) {
                    return res.status(400).send({
                        message: 'Wrong password!'
                    });
                }
                jsonwebtoken.sign({ email: user.email, id: user._id, username: user.username }, Jwt.secretKey, Jwt.options, (err, token) => {
                    if (err) {
                        return res.status(400).send(err);
                    }
                    return res.json({
                        accessToken: token,
                        user: user
                    });

                });

            }
        }, err => {
            return res.status(400).send(err);
        });
    }
}


export default new AuthController();