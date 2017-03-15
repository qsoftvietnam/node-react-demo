export default {
    options: {
        algorithm: 'HS256',
        expiresIn: '365 days'
    },
    secretKey: process.env.SECRET_KEY || 'qsoftvietnam'
}