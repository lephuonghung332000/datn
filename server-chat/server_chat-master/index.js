const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)

io.on('connection', function (client) {

  console.log('client connect...', client.id);

  client.on('message', function (data) {
    console.log(data);
    io.emit('message', data)
  })


  client.on('connect', function () {
  })

  client.on('disconnect', function () {
    console.log('client disconnect...', client.id)
    // handleDisconnect()
  })

  client.on('error', function (err) {
    console.log('received error from client:', client.id)
    console.log(err)
  })
})

var server_port = process.env.PORT || 3000;
server.listen(server_port, function (err) {
  if (err) throw err
  console.log('Listening on port %d', server_port);
});

app.get('/', (req, res) => {
  res.send("server successed starting.")
})

