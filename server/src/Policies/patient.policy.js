import acl from 'acl';

const Role = new acl(new acl.memoryBackend());


Role.allow([
    {
        roles: ['guest', 'member'],
        allows: [
            { resources: '/', permissions: 'get' },
            { resources: ['forums', 'news'], permissions: ['get', 'put', 'delete'] }
        ]
    },
    {
        roles: ['admin'],
        allows: [
            { resources: '*', permissions: '*' }
        ]
    }
])

class PatientPolicy {

    constructor() {

    }

    isAllowed(req, res, next) {
        const roles = (req.user) ? req.user.roles : ['guest'];

        Role.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), (err, isAllowed) => {
            if (err) {
                // An authorization error occurred
                return res.status(500).send('Unexpected authorization error');
            } else {
                if (isAllowed) {
                    // Access granted! Invoke next middleware
                    return next();
                } else {
                    return res.status(403).json({
                        message: 'User is not authorized'
                    });
                }
            }
        });
    }
}
export default new PatientPolicy();