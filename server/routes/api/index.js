const route = require('express').Router()
const socketRoute = require('./socketRoute')

route.post('/socket', socketRoute)

module.exports = route;