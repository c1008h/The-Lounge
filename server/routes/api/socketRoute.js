const route = require('express').Router();

route.post('/', (req, res) => {
    try {
        const { message } = req.body
        
        console.log('data received in serve:', message)

    } catch (error) {
        console.error("Error receiving message in server: ", error)
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

module.exports = route;