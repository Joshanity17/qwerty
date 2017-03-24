function Circle(positionX, positionY, radius, red, green, blue, id) {
	this.position = createVector(positionX, positionY);
	this.radius = radius;
	this.velocity = createVector(0, 0);
	this.id = id;


	this.show = function() {
		fill(red,green,blue);
		ellipse(this.position.x, this.position.y, this.radius * 2, this.radius * 2);
	}

	this.constrain = function(){
		circle.position.x = constrain(circle.position.x, -600 * 3, 600 * 3);
		circle.position.y = constrain(circle.position.y, -600 * 3, 600 * 3);		
	}

	this.update = function() {
		var newVelocity;
		velocity = createVector(mouseX - width / 2, mouseY - height / 2);
		newVelocity = createVector(mouseX - width / 2, mouseY - height / 2);
		newVelocity.setMag(3);
		this.velocity.lerp(newVelocity, 0.2);
		this.position.add(this.velocity);
	}
	
	this.eat = function(other) {
		if(other != null){
			var distance = p5.Vector.dist(this.position, other.position);
			if (distance + 20 < this.radius + other.radius) {
				return true;
			} else {
				return false;
			}
		}
	}

}

function Score(text, positionX, positionY, size){
	this.text = text;
	this.position = createVector(positionX, positionY);
	this.velocity = createVector(0, 0);
	this.size = size;

	this.update = function() {
		var newVelocity;
		velocity = createVector(mouseX - width / 2, mouseY - height / 2);
		newVelocity = createVector(mouseX - width / 2, mouseY - height / 2);
		newVelocity.setMag(3);
		this.velocity.lerp(newVelocity, 0.2);
		this.position.add(this.velocity);
	}
	
	this.show = function() {
		fill(0);
		textAlign(CENTER);
		textSize(this.size);
		text(this.text, this.position.x, this.position.y);	
	}

	this.constrain = function(){
		score.position.x = constrain(score.position.x, -600 * 3, 600 * 3);
		score.position.y = constrain(score.position.y, -600 * 3, 600 * 3);		
	}


}

function GetName(){
	if(document.getElementById(input).value != null){
	 	window.location.href = "canvas.html";
	} else{
		alert("MORON");
	}
}

// var area = Math.PI * Math.pow(this.radius, 2) + Math.PI * Math.pow(other.radius, 2);
// this.radius = Math.sqrt(area / Math.PI);