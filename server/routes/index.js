const route = require('express').Router();
const apiRoutes = require('./api')

route.post('/api', apiRoutes)

module.exports = route;