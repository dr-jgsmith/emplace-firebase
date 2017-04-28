var myAuth = new Firebase("https://emplaced.firebaseio.com/");


//var obs;
var keyData;

var myID = {
	data: ''
};

var tag = {
	tags: ''
};

function Authenticate(myAuth){
	myAuth.onAuth(function(authData){
		if (authData) {
			console.log("Authenticated with uid:", authData.uid);
	} else {
		console.log("Client unauthenticated.");
			$( ":mobile-pagecontainer" ).pagecontainer( "change", "#homepage" );
		  	}
	});
};

/////////////////////////////////////////////////////////////////////////////////



/////////////////////////////////////////////////////////////////////////////////
//var map = '';
var latitude = 39.8282;
var longitude = -98.5795;

function getPosition() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(quickCoords);
    }
};

function quickCoords(loc) {
	latitude = loc.coords.latitude;
	longitude = loc.coords.longitude;
	
	if(latitude){
		map.setCenter(latitude, longitude);
		map.refresh();
	}
};

function getDataCoords(id) {
	var ref = new Firebase("https://emplaced.firebaseio.com/places/obs/"+id);
	ref.once("value", function(snapshot) {
		console.log("location data", snapshot.val());
		var obs = snapshot.val();
		latitude = obs.location.latitude;
		longitude = obs.location.longitude;

		if(latitude){
			map.setCenter(latitude, longitude);
			map.refresh();
		}
	});
};

function setMap(latitude,longitude) {
	var page = $("body").outerHeight();
	var foot = $("#postStory").height();
	var newW = $("#footer").width();
	var mapHgt = page*.78;
	dimH = Math.floor(mapHgt);

	h = $("#basic_map").height((dimH-100)+"px");
	w = $("#basic_map").width(newW+"px");
	console.log(h);


	map = new GMaps({
		div: '#basic_map',
		lat: latitude,
		lng: longitude,
		width: w,
		height: h,
		zoom: 14,
		zoomControl : true,
		zoomControlOpt: {
        	style : 'SMALL',
        	position: 'TOP_LEFT'
    	}
	});

}; 

var setMarker = function(lat, lon, image, desc) {
	map.addMarker({
		lat: lat,
		lng: lon,
		opacity: 0,
		title: 'emplaced story',
		infoWindow: {
			content: "<img src=" + image + " id='storyData' style='float:left;margin-right:5px' height='200px' width='200px'>"
				+"<div>Story - "+desc+"</div>",
		},
		mouseover: function(){
        		(this.infoWindow).open(this.map, this);
    	},
    	mouseout: function(){
        	this.infoWindow.close();
    	}
	});

	map.drawCircle({
      lat: lat,
      lng: lon,
      radius: 250,
      strokeColor: '#ff0000',
      strokeOpacity: .5,
      strokeWeight: 1,
      fillColor: '#ff0000'
    });
};

		
function getMarkerData() {
	//setMap(latitude, longitude);	
	var ref = new Firebase("https://emplaced.firebaseio.com/places/obs/");
	ref.on("child_added", function(snapshot) {
		console.log("data", snapshot.val());
		var obs = snapshot.val();
		lat = obs.location.latitude;
		lon = obs.location.longitude;
		image = obs.image;
		desc = obs.description;

		setMarker(lat, lon, image, desc);
	
	});

};

function getSingleMapObject(id) {
	//setMap(latitude, longitude);	
	var ref = new Firebase("https://emplaced.firebaseio.com/places/obs/"+id);
	
	ref.once("value", function(snapshot) {
		console.log("data", snapshot.val());
		var obs = snapshot.val();
		lat = obs.location.latitude;
		lon = obs.location.longitude;
		image = obs.image;
		desc = obs.description;
	
		setMarker(lat, lon, image, desc);
		$("#storyBlock").append(storyObject(image, desc));
	});

};

function storyObject(image, desc) {
	var storyText = " ";
	 storyText += "<blockquote>";
     storyText += "Story Topic/Themes/Tags Will Go Here";
     storyText += "</blockquote>";
     storyText += "<img src='"+image+"'' alt='' title='' width='200px' height='200px'/>";
     storyText += "<p>"+desc+"</p>";

     return storyText;
};

//function extractTag(textDoc){

//};


function storyFeed(id, obs){
		var subDesc = obs.description.substring(0,75);
		 var feedContent = " ";
		 feedContent += "<li id='feed_blurb'>";
		 feedContent += "<a href='#story' id="+id+" class='story_blurb' data-role='button' data-transition='pop'>";
          feedContent += "<div class='feat_small_icon'><img src="+obs.image+" alt='' title='' /></div>";
          feedContent += "<div class='feat_small_details'style='color: #000'>"+subDesc+"...</div>";
          feedContent += "</a>";
          feedContent += "</li>";

          return feedContent;
      };

function listPhotos(id, lat, lon, image, desc) {
		 var shortDes = desc.substring(0,25);
		 photo = ' ';
		 photo += "<li>";
		photo += "<a rel='gallery-1' href='#' id="+id+" title='Photo title' class='swipebox'>";
		photo += "<img src="+image+" alt='image' width='100px' height='100px'/>";
		photo += "</a>";
		photo += "<div class='post_title'>";
		photo += "</div>";
		photo += "</li>";

		return photo
};


var geolocationCallback = function(location) {
			var time = new Date();
			var timestamp = time.getTime();
			var latitude = location.coords.latitude;
			var longitude = location.coords.longitude;
			
			var description = $('textarea[name=description]').val();
			//var sentiment = $('fieldset[name=sentiment]').val();
			
			if (!$("#myImage")[0].files[0]) {
				
				alert("Houston, We Have A Problem! Please Upload a Photo.");
			
			} else {
				
				var file = $("#myImage")[0].files[0];
				var reader = new FileReader();
				
				reader.onloadend = function() {
					var ref = new Firebase("https://emplaced.firebaseio.com/");
					var authData = ref.getAuth();
					
					var myPost = new Firebase("https://emplaced.firebaseio.com/places/obs");
					
					var newPost = myPost.push({
						"author" : authData.uid,
						//"place1" : genPlace,
						"description" : description,
						"image" : reader.result,
						"time" : timestamp,
						"location" : {
							"latitude": latitude,
							"longitude": longitude
						}
					});
					
					var newLocId = newPost.key();
						
					var geoRef = new Firebase("https://emplaced.firebaseio.com/places/");
					var geoFire = new GeoFire(geoRef);
					
					geoFire.set(newLocId, [latitude, longitude]).then(function(){
							//Load coordinated into geoFire with reference to new place observation.
					});	
				};
			};

				if (file) {
					console.log("within if statement fired");
					reader.readAsDataURL(file);
					
					$("#storyPost")[0].reset();	
						
					$("#description").focus();
					
					//reader.onloadend();
				}
				else {
					console.log('else fired uploadFile');
				}
					
};



///////////////////////////////////////////////////////////////////////////////////////////////



////////////////////////////////////////////////////////////////////////////////////////////////
//Defining jQuery Events
$(document).on("pagecreate", "#homepage", function () {
	//Defining the global functions and variables
	var ref = new Firebase("https://emplaced.firebaseio.com/");
	var authData = ref.getAuth();
	
	if (authData) {
	  console.log("User " + authData.uid + " is logged in with " + authData.provider);
	  $( ":mobile-pagecontainer" ).pagecontainer( "change", "#stories" );
	} else {
	  console.log("User is logged out");
	}
});
/////////////////////////////////////////////////////////////////////////////////////////



////////////////////////////////////////////////////////////////////////////////////////	
$(document).on("pagecreate", "#register", function () {
    var myRef = new Firebase("https://emplaced.firebaseio.com/");
	
	$('#signup_btn').on('click', function(e) {
		e.preventDefault();
		var firstname = $("input[name=first_name").val();
		var lastname = $("input[name=last_name]").val();
		var useremail = $("input[name=email]").val();
		var pass = $("input[name=password]").val();
		
		myRef.createUser({
		  email : useremail,
		  password : pass
		}, function(error, userData) {
		  if (error) {
			console.log("Error creating user:", error);
		  } else {
			console.log("Successfully created user account with uid:", userData.uid);
			
			myRef.child("users").push({
				"firstname" : firstname, 
				"lastname": lastname, 
				"email" : useremail,
				"user_id": userData.uid
			});
			
			$( ":mobile-pagecontainer" ).pagecontainer( "change", "#login" );
		  }
		});
		
	});
});	
/////////////////////////////////////////////////////////////////////////////////////////////



////////////////////////////////////////////////////////////////////////////////////////////
$(document).on("pagecreate", "#login", function () {	
		
		$('#login_btn').on('tap', function(e) {
			e.preventDefault();
			
			var useremail = $("input[name=email]").val();
			var pass = $("input[name=password]").val();
			//alert(useremail);
			
			myAuth.authWithPassword({
				email : useremail,
				password : pass
				}, function(error, authData) {
					if (error) {
			
						console.log("Login Failed!", error);
					} else {
						console.log("Authenticated successfully with payload: ", authData);
						
						$( ":mobile-pagecontainer" ).pagecontainer( "change", "#stories" );
					}
				});
			
		});
});
//////////////////////////////////////////////////////////////////////////////////


/////////////////////////////////////////////////////////////////////////////////
$( document ).on("pagecreate", "#stories", function(e, data) {
		Authenticate(myAuth);
		var pstRef = new Firebase("https://emplaced.firebaseio.com/places/obs");
		
		pstRef.on("child_added", function(snapshot,  prevChildKey) {
			  	console.log("added", snapshot.key(), snapshot.val());
			  	var keyData = snapshot.key();
			  	//var obs = snapshot.val();
			  	
			  	$('#storylist').prepend(storyFeed(keyData, snapshot.val()));;
		});
		
		$(document).on('tap', '.story_blurb', function () {
			myID.data = this.id;
			$(":mobile-pagecontainer").pagecontainer("change", "#story")
		});
});

/////////////////////////////////////////////////////////////////////////////////////



////////////////////////////////////////////////////////////////////////////////////
$(document).on('pagecreate', "#places", function(e, data){
		Authenticate(myAuth);

		start = " ";

		var ref = new Firebase("https://emplaced.firebaseio.com/places/obs/");
		//alert("https://emplaced.firebaseio.com/places/obs/"+id+"/");
		ref.orderByChild("time").limitToLast(6).on("child_added", function(snapshot) {
			  	console.log("data", snapshot.val());
			  	var id = snapshot.key();
			  	var obs = snapshot.val();
			  	lat = obs.location.latitude;
			  	lon = obs.location.longitude;
			  	image = obs.image;
			  	desc = obs.description;

			  	$("#photoslist").append(listPhotos(id, lat, lon, image, desc ));
		});



});
////////////////////////////////////////////////////////////////////////////////////////



/////////////////////////////////////////////////////////////////////////////////////////
$(document).on('pageshow', "#story", function(){
	id = myID.data;
	console.log(id);

	Authenticate(myAuth);

	setMap(latitude,longitude);

	$("#storyPost")[0].reset();	
						
	$("#description").focus();
	//$(document).ready(function(){


		if(id) {
			
				getDataCoords(id);


				getSingleMapObject(id);

				map.refresh();

		} else { 
			
				alert("Allow Empalce to retrieve your location.");
	               // timeout at 60000 milliseconds (60 seconds)
	           
				getPosition();

				getMarkerData();

				map.refresh();
		
		};
  
});
///////////////////////////////////////////////////////////////////////////////////



////////////////////////////////////////////////////////////////////////////////////

$(document).on("pagecreate", "#user", function () {
		myAuth.onAuth(function(authData){
				if (authData) {
					console.log("Authenticated with uid:", authData.uid);
				} else {
					console.log("Client unauthenticated.")
					$( ":mobile-pagecontainer" ).pagecontainer( "change", "#homepage" );
		  		}
			});
});

$(document).on("pageshow", "#logout", function () {
		
		myAuth.unauth();
		$( ":mobile-pagecontainer" ).pagecontainer( "change", "#homepage" );
		// body...
});

$('#submit_loader').on('click', function( event ) {  

		event.preventDefault();
		
		if (typeof navigator !== "undefined" && typeof navigator.geolocation !== "undefined") {	

			function errorHandler(err) {
						if(err.code == 1) {
						   alert("Error: Access is denied!");
						}
						
						else if( err.code == 2) {
						   alert("Error: Position is unavailable!");
						}
			}
			
			alert("Allow Empalce to retrieve your location.");
               // timeout at 60000 milliseconds (60 seconds)
            
			var options = {
				  enableHighAccuracy: true,
				  timeout:60000,
				  };
            navigator.geolocation.getCurrentPosition(geolocationCallback, errorHandler, options);
			
				

		} else {
               alert("Sorry, browser does not support geolocation!");
			}
		
});
