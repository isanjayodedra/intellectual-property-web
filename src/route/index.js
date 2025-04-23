const express = require('express');
const authRoute = require('./authRoute');

const router = express.Router();

console.log('Congratulations! API Route is working!');
const defaultRoutes = [
    {
        path: '/auth',
        route: authRoute,
    },
];
defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

module.exports = router;
