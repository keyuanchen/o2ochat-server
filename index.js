const app = require('express')()

const server = app.listen(8081)

const io = require('socket.io').listen(server)

require('./model/socket.js')(io)

app.get('/', (req, res) => res.send('hello!!!'))

app.listen(3000, _ => console.log('server is running on port 3000'))