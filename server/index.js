const express = require('express')
const http = require('http');
const cors = require('cors')
const bodyParser = require('body-parser');
const setupSocket = require('./config/socketios');
const routes = require('./routes')

const app = express()
const server = http.createServer(app)
const PORT = process.env.PORT || 3008;

app.use(bodyParser.json());
app.use(cors())
app.use('/', routes)

app.get('/', (req, res) => {
    res.send('Hello, this is your server!')
})

setupSocket(server);
  
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})