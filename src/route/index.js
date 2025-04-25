const express = require('express');
const authRoute = require('./authRoute');
const baseRoute = require('./baseRoute');

const router = express.Router();

const defaultRoutes = [
    {
        path: '/auth',
        route: authRoute,
    },
    {
        path: '/base',
        route: baseRoute,
    }
];
defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

module.exports = router;
