
class AuthPolicy {

    constructor() {

    }

    requireLogin(req, res, next) {
        if (!req.auth) {
            return res.status(403).json({
                message: 'User is not authorized'
            });
        } else {
            return next();
        }
    }
}

export default new AuthPolicy();