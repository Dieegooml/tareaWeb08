export default {
    secret: process.env.JWT_SECRET,
    jwtExpiration: 60,
    jwtRefreshExpiration: 86400,
};