var zoom = 1;
var condition;
var newZoom;
var position = {
	x: null,
	y: null,
	index: null
};
var circles = [];
var otherCircles = [];
var enemies = [];
var zxc;
var asd;
var width;
var height;
var picture;
var asd = 30;

function setup(){
	
	socket = io.connect('http://localhost:3000');
	picture = loadImage('images/background.png');
	width = window.innerWidth
	|| document.documentElement.clientWidth
	|| document.body.clientWidth;

	height = window.innerHeight
	|| document.documentElement.clientHeight
	|| document.body.clientHeight;
	createCanvas(width, height);
	text = new GetName();
	circle = new Circle(0, 0, 34, 255, 255, 255, null);
	score = new Score(circle.radius, 0, circle.radius + 5, 8);
	name = new Score(text.text, 0, 0, 8);
	
	circlePosition = {
		x: circle.position.x,
		y: circle.position.y,
		radius: circle.radius
	};

	socket.emit('newPlayer', circlePosition);

	socket.on('circlePosition',
		function(data){
			otherCircles = data;
		});

	setInterval(function(){
		if(circle.radius == null){
			if(zxc <= asd + 100){
				newZoom = (34 / zxc * 1.5);
				zxc++;
			}
		}
	}, 33);

}

function draw(){
	
	circle.id = socket.id;
	condition = false;
	background(242, 251, 255);
	
	translate(width / 2, height / 2);
	if(circle.radius != null){
		newZoom = (64 / circle.radius * 1.5);
	}
	zoom = lerp(zoom, newZoom, 0.1);
	scale(zoom);

	translate(-circle.position.x, -circle.position.y);
	// translate(-scoreBoard.position.x, -scoreBoard.position.y);
	
	for(var x = -1800; x <= 1200; x++){
		for(var y = -1800; y <= 1200; y++){
			if(x % 600 == 0 && y % 600 == 0){
				image(picture, x, y);
			}
		}
	}

	circlePosition = {
		x: circle.position.x,
		y: circle.position.y,
		radius: circle.radius
	};

	socket.emit('updatingPosition', circlePosition);

	socket.on('update',
		function(data){
			if(!condition){
				for(var x = 0; x < data.length; x++){
					if(position.x != data[x].x && position.y != data[x].y){
						circles[x] = new Circle(data[x].x, data[x].y, data[x].radius, data[x].red, data[x].green, data[x].blue, null);
					} 
				}
				condition = true;
			}
		});

	for (var x = circles.length - 1; x >= 0; x--) {
		if (circle.eat(circles[x])) {
			position = {
				x: circles[x].position.x,
				y: circles[x].position.y,
				index: x
			};
			circles.splice(x, 1);
			circle.radius++;
			socket.emit('eat', position);
			console.log(circle.radius + 5);
			score.position.y = circle.radius + 5;
			score.size = score.size + 0.5;
			name.size = name.size + 0.5;
			// score.position.x = score.position.x - 0.01;
		}
	}

	for(var x = 0; x < enemies.length; x++){
		if(circle.eat(enemies[x])){
			if(circle.radius * 0.95 >= enemies[x].radius){
				circle.radius = circle.radius + (enemies[x].radius / Math.PI) / 2;
				enemies.splice(x, 1);
			} else if(circle.radius <= enemies[x].radius * 0.95){
				zxc = circle.radius;
				asd = zxc;
				circle.radius = null;
			}			
		}
	}
	
	for(var x = 0; x < circles.length; x++){
		circles[x].show();
	}

	for(var x = 0; x < otherCircles.length; x++){
		if(otherCircles[x].id != socket.id){
			enemies[x] = new Circle(otherCircles[x].x, otherCircles[x].y, otherCircles[x].radius, 255, 0, 0, otherCircles[x].id);
			enemies[x].show();
		}
	}

	circle.show();
	if(circle.radius != null){
		circle.update();
		score.show();
		score.update();
	}
	circle.constrain();
	score.constrain();
	

}