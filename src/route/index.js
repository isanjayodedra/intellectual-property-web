const express = require('express');
const authRoute = require('./authRoute');
const userRoute = require('./userRoute');
const roleRoute = require('./roleRoute');
const adminRoute = require('./adminRoute');

const router = express.Router();

const defaultRoutes = [
    {
        path: '/auth',
        route: authRoute,
    },
    {
        path: '/roles',
        route: roleRoute,
    },
    {
        path: '/admin',
        route: adminRoute,
    },
    {
        path: '/user',
        route: userRoute,
    }
];
defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

module.exports = router;
