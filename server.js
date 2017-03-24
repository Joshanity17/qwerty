
// Using express: http://expressjs.com/
var express = require('express');
// Create the app
var app = express();

// Set up the server
// process.env.PORT is related to deploying on heroku
var server = app.listen(process.env.PORT || 3000, listen);

//Event Variables


//Data variables
var circlePosition = [];
var circles = [];
var width = 1800;
var height = 1800;
var counter = 0;
condition = true;

// This call back just tells us that the server has started
function listen() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://' + host + ':' + port);
}

function position(x, y, radius, red, green, blue, id){
  this.x = x;
  this.y = y;
  this.radius = radius;
  this.red = red;
  this.green = green;
  this.blue = blue;
  this.id = id;
}

function initialize(){
  for(var x = 0; x < 410; x++){
    circlePosition[x] = new position(Math.random() * (width - (-width)) + (-width), Math.random() * (height - (-height)) + (-height), 10, 255, 255, 255, null);
  }
  
}

function eatFunction(data){
  // if(this.listenerCount('eat', eatFunction) == 1){
    circlePosition.splice(data.index, 1);
    counter++;
  //   this.removeListener('eat', eatFunction);
  // }
}

initialize();
setInterval(function(){
  if(counter >= 1){
    newCircle = new position(Math.random() * (width - (-width)) + (-width), Math.random() * (height - (-height)) + (-height), 10, 255, 255, 255, null);
    circlePosition.push(newCircle);
    counter--;
  }
},1000);


app.use(express.static('public'));


// WebSocket Portion
// WebSockets work with the HTTP server
var io = require('socket.io')(server);

setInterval(function(){
  io.sockets.emit('update',circlePosition);
  io.sockets.emit('circlePosition', circles);
},33);

// Register a callback function to run when we have an individual connection
// This is run for each individual user that connects
io.sockets.on('connection',
  // We are given a websocket object in our function
  function (socket) {

    console.log("We have a new client: " + socket.id);

    socket.on('newPlayer',
      function(data){
        var circle = new position(data.x, data.y, data.radius, null, null, null, socket.id);
        circles.push(circle);
      });

    socket.on('updatingPosition',
      function(data){
        for(var x = 0; x < circles.length; x++){
          if(circles[x].id == socket.id){
            circles[x].x = data.x;
            circles[x].y = data.y;
            circles[x].radius = data.radius;
            console.log(circles);
          }
        }
        
      });

    io.sockets.emit('positioning', circlePosition);

    socket.on('eat', eatFunction);
    // socket.on('addListener', 
    //   function(data){
    //     if(this.listenerCount('eat', eatFunction) == 0){
    //       this.addListener('eat', eatFunction);
    //     }
    //   });


    // // When this user emits, client side: socket.emit('otherevent',some data);
    // socket.on('mouse',
    //   function(data) {
    //     // Data comes in as whatever was sent, including objects
    //     console.log("Received: 'mouse' " + data.x + " " + data.y);

    //     // Send it to all other clients
    //     socket.broadcast.emit('mouse', data);

    //     // This is a way to send to everyone including sender
    //     // io.sockets.emit('message', "this goes to everyone");

    //   }
    // );
    
    socket.on('disconnect', function() {
      console.log("Client has disconnected");
      for(var x = 0; x < circles.length; x++){
        if(socket.id == circles[x].id){
          circles.splice(x,1);
        }
      }
    });
  }
  );