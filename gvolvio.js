$(document).ready(function() {

var provider = new firebase.auth.GoogleAuthProvider();
var uid;
var name;
var xv = 0;
var yv = 0;
var xpos = 200;
var ypos = 200;
var userRef = firebase.database().ref('users/');
var keys = [];
var sides = 5;
var radius = 20;
var fillColor = 255;
var strokeColor;

	
$( "#signIn" ).click(function() {

firebase.auth().signInWithRedirect(provider);

firebase.auth().getRedirectResult().then(function(result) {
  if (result.credential) {
    // This gives you a Google Access Token. You can use it to access the Google API.
    var token = result.credential.accessToken;
    // ...
  }
  // The signed-in user info.
  user = result.user;
}).catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  // The email of the user's account used.
  var email = error.email;
  // The firebase.auth.AuthCredential type that was used.
  var credential = error.credential;
  // ...
});
});
	
	
	
	firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
	uid = user.uid;
	name = user.displayName;
	userRef = firebase.database().ref('users/'+uid);
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
	processing.background(175,175,175);
	 
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
}

function movement () {
    keyAction();
    xpos = xpos + xv; //setting the positions to the positions + movement
    ypos = ypos + yv;
    if (xpos < -4000) {xpos = 2*-4000 - xpos; xv = -xv;}
    if (xpos >  4000) {xpos = 2* 4000 - xpos; xv = -xv;}
    if (ypos < -4000) {ypos = 2*-4000 - ypos; yv = -yv;}
    if (ypos >  4000) {ypos = 2* 4000 - ypos; yv = -yv;}
    xv = xv * 0.9; //slowing it down
    yv = yv * 0.9;
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


//Draw Stuff!!!
		
	userRef.on('value', function(snapshot) {
   processing.background(175,175,175);
   processing.fill(0,0,0);
   processing.rect((-4000-xpos)+(processing.width/2), (-4000-ypos)+(processing.height/2),8000,8000);
  snapshot.forEach(function(childSnapshot) {
    processing.stroke(255);
    processing.strokeWeight(3);
    processing.fill(220, 226, 237);
    processing.ellipse((childSnapshot.val().xpos-xpos)+(processing.width/2), (childSnapshot.val().ypos-ypos)+(processing.height/2), childSnapshot.val().radius, childSnapshot.val().radius)	  
    processing.fill(0);
    var charName = childSnapshot.val().name;
    //if (charName !== undefined) {
    processing.text(charName.charAt(0), (childSnapshot.val().xpos-xpos)+(processing.width/2), (childSnapshot.val().ypos-ypos)+(processing.height/2));
    //}
    processing.fill(255);
    processing.text("("+Math.round(xpos)+", "+Math.round(ypos)+")", 15, 15);
  });
});
//End of Draw Stuff

$( window ).resize(function() {
  processing.size($(window).width()-20, $(window).height()-($("#signIn").height()+$("#signOut").height()+20));
  userRef.once('value', function(snapshot) {
   processing.background(175,175,175);
   processing.fill(0,0,0);
   processing.rect((-4000-xpos)+(processing.width/2), (-4000-ypos)+(processing.height/2),8000,8000);
  snapshot.forEach(function(childSnapshot) {
    processing.stroke(255);
    processing.strokeWeight(3);
    processing.fill(220, 226, 237);
    processing.ellipse((childSnapshot.val().xpos-xpos)+(processing.width/2), (childSnapshot.val().ypos-ypos)+(processing.height/2), childSnapshot.val().radius, childSnapshot.val().radius)	  
    processing.fill(0);
    var charName = childSnapshot.val().name;
    //if (charName !== undefined) {
    processing.text(charName.charAt(0), (childSnapshot.val().xpos-xpos)+(processing.width/2), (childSnapshot.val().ypos-ypos)+(processing.height/2));
    //}
    processing.fill(255);
    processing.text("("+Math.round(xpos)+", "+Math.round(ypos)+")", 15, 15);
  });
});

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
	
$( "#signOut" ).click(function () {
	userRef.remove();
	firebase.auth().signOut().then(function() {
  location.reload();
}).catch(function(error) {
  // An error happened.
});
	
});
	

});
//V 1.6
