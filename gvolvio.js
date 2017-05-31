$(document).ready(function() {

var provider = new firebase.auth.GoogleAuthProvider();
var uid;
var name;
var xv = 0;
var yv = 0;
var xpos = 200;
var ypos = 200;
var changeRef = firebase.database().ref('users/');
var keys = [];
var userRef;
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
	processing.size($(window).width()-20, $(window).height()-($("#signIn").height()+$("#signOut").height()+50));
	processing.background(0,0,0);
	 
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
		
changeRef.on('value', function(snapshot) {
   processing.background(0,0,0);
  snapshot.forEach(function(childSnapshot) {
    polygon(childSnapshot.val().sides, (childSnapshot.val().xpos-xpos)+200, (childSnapshot.val().ypos-ypos)+200, childSnapshot.val().radius, childSnapshot.val().fillColor, 0)
    processing.fill(255,0,0);
    processing.text(childSnapshot.val().name, (childSnapshot.val().xpos-xpos)+(processing.width/2-radius/2), (childSnapshot.val().ypos-ypos)+(processing.width/2-radius/2));
    processing.fill(255);
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
	
$( "#signOut" ).click(function () {
	userRef.remove();
	firebase.auth().signOut().then(function() {
  location.reload();
}).catch(function(error) {
  // An error happened.
});
	
});
	

});
//V 0.7
