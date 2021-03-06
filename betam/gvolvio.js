$(document).ready(function() {

var uid;
var name = name;
var xv = 0;
var yv = 0;
var xpos = 200;
var ypos = 200;
var keys = [];
var userRef;
var sides = 5;
var radius = 20;
var fillColor = 255;
var strokeColor;

//Nickname Creation
	<input type="text" id="nickname" name="nickname">
	
    	function sketchProc(processing) {
		
//POLYGON CREATION
		
function polygon(sides, centerX, centerY, radius, fillColor, strokeColor) {
    processing.fill(fillColor);
    processing.stroke(strokeColor);
    var innerAngle = 360/sides;
    var rotationAngle = innerAngle;
    processing.beginShape();
    var i = 0;
    for (i = 0; i < sides + 3; i++) {
        processing.vertex(centerX + (radius*Math.sin((Math.PI/180)*rotationAngle)), centerY + (radius*Math.cos((Math.PI/180)*rotationAngle)));
        rotationAngle = innerAngle * i;
    }
    processing.endShape();
}
//END POLYGON
		
processing.setup = function() {
	processing.size($(window).width()-20, $(window).height()-($("#signIn").height()+$("#signOut").height()+20));
	processing.background(200,200,200);
	 
};

    	function keyAction () {
    if (keys[38]) { //this checks if up arrow is pressed
        yv = yv - 1;
    }
    if (keys[40]) {
        yv = yv + 1;
    }
    if (keys[37]) {
        xv = xv - 1;
    }
    if (keys[39]) {
        xv = xv + 1;
    }
    if (keys [77]) {
	yv = yv + 1;
    }
}

function movement () {
    keyAction();
    xpos = xpos + xv; //setting the positions to the positions + movement
    ypos = ypos + yv;
    if (xpos < -40000) {xpos = 2*-40000 - xpos; xv = -xv;}
    if (xpos >  40000) {xpos = 2* 40000 - xpos; xv = -xv;}
    if (ypos < -40000) {ypos = 2*-40000 - ypos; yv = -yv;}
    if (ypos >  40000) {ypos = 2* 40000 - ypos; yv = -yv;}
    xv = xv * 0.8; //slowing it down
    yv = yv * 0.8;
    firebase.database().ref('users/' + uid).set({
    xpos: Math.round(xpos),
    ypos: Math.round(ypos),
    name: name,
    fillColor: fillColor,
    sides: sides,
    radius: radius
  });
}

processing.draw = function() {
	movement();
};
		
changeRef.on('value', function(snapshot) {
   processing.background(175,175,175);
   processing.fill(255,200,200);
   processing.rect((-4000-xpos)+(processing.width/2), (-4000-ypos)+(processing.height/2),8000,8000);
  snapshot.forEach(function(childSnapshot) {
    polygon(childSnapshot.val().sides, (childSnapshot.val().xpos-xpos)+(processing.width/2), (childSnapshot.val().ypos-ypos)+(processing.height/2), childSnapshot.val().radius, childSnapshot.val().fillColor, 0)
    processing.fill(255,0,0);
    processing.ellipse(60,20,16,16);
    processing.text(childSnapshot.val().name, (childSnapshot.val().xpos-xpos)+(processing.width/2), (childSnapshot.val().ypos-ypos)+(processing.height/2));
    processing.fill(255);
    processing.ellipse(60,20,16,16);
    processing.text("("+Math.round(xpos)+", "+Math.round(ypos)+")", 15, 15);
  });
});
	
$( window ).resize(function() {
  processing.size($(window).width()-20, $(window).height()-($("#signIn").height()+$("#signOut").height()+20));
});		

$(document).keydown(function (e) {
    keys[e.which] = true;
	keyAction();
});

$(document).keyup(function (e) {
    keys[e.which]= false;
    keyAction();
});
};		

var canvas = document.getElementById("canvas");
var processingInstance = new Processing(canvas, sketchProc);
	
  } else {
    // User is signed out.
    // ...
  }
});
	
//2.0
