import * as express from 'express';
import * as nodeHttp from 'http'
import * as socketIo from 'socket.io';

const app = express()
const http = new nodeHttp.Server(app);
const io = socketIo(http);

// app.get('/', function(req, res){
//   res.sendFile(__dirname + '/index.html');
// });

io.on('connection', function(socket: any){
  console.log('a user connected');
});





http.listen(3000, function(){
  console.log('listening on *:3000');
});