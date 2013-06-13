function information(place, placeName) {

	$("#information").css('display','block');
	var text = "Your nearest " + placeName + " is: <span>" + place.name + "</span>";
	$("#placeName").html(text);
	$("#placeNameTitle").html(placeName + ".");
	$("#placeAddress").html(place.vicinity);
	
}

function informationDuration(distance, duration) {
	$("#duration").html(duration);	
}	  
				
function initialize() {
		
	
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(local, errors);		
		// FireFox OS Simulator
		//local("");
	} else {	
		$("#errors").html("Geolocation is not supported by this browser.");	
	}
	
	function errors (error) {
		$("#errors").html("Geolocation is not supported by this browser.");	
	}	
}

	var placeTypes=["bar","movie_theater","restaurant"]; 
	var placeTypeNames=["bar","cinema","restaurant"]; 
	var placeLabels=["Drink","Film","Eat"]; 

	var	coordenates = {
			Lat: 0,
			Lng: 0
		};
	
	<!-- Intialization of the map -->
	function local(position) {	
		coordenates.Lat = position.coords.latitude;
		coordenates.Lng = position.coords.longitude;
		// FireFox OS Simulator
		//coordenates.Lat = 40.4701259;
		//coordenates.Lng = -3.7177411;
		localization(0);
	}
	
		// FireFox OS Simulator
		//function localization(position, placeType) {	
		function localization(placeTypeId) {
		
		placeType = placeTypes[placeTypeId];
		
			// FireFox OS Simulator
			//if (placeType == null || placeType == "") {
			//	placeType = "restaurant";
			//}
			
			//coordenates = {
			//	Lat: position.coords.latitude,
			//	Lng: position.coords.longitude
				//Lat: 40.4701873,
				//Lng: -5
			//}			
						
			var currentPos = new google.maps.LatLng(coordenates.Lat,coordenates.Lng);
			
			var mapProp = {
			  center:currentPos,
			  disableDefaultUI: true,
			  zoom:16,
			  mapTypeId:google.maps.MapTypeId.ROADMAP
			};

			var map = new google.maps.Map(document.getElementById("mainMap"), mapProp);		
			
			// Find closest restaurant
			var placeRequest = {
				location: currentPos,
				rankBy: google.maps.places.RankBy.DISTANCE,
				types: [placeType]
			}
			
			function nearByCallBack(results, status) {
				if (status == google.maps.places.PlacesServiceStatus.OK) {
					var place = results[0];
					placePos = new google.maps.LatLng(place.geometry.location.lat(), place.geometry.location.lng());
					obtainDistance(placePos);
					obtainDirection(currentPos, placePos);					
					information(place, placeTypeNames[placeTypeId]);
				}
			}
			
			function createMarker(position, icon){						
				var marker = new google.maps.Marker(
					{
					  position: position,
					  icon: icon
					}
				);
				marker.setMap(map);
			}
			
			var placeService = new google.maps.places.PlacesService(map);
			placeService.nearbySearch(placeRequest, nearByCallBack);
					
			// Get Distance
			function obtainDistance(placePos){
			
				var distanceRequest = {
						origins: [currentPos],
						destinations: [placePos],
						travelMode: google.maps.TravelMode.WALKING,
						unitSystem: google.maps.UnitSystem.METRIC,
						avoidHighways: false,
						avoidTolls: false
					}
					
				function distanceCallback(response, status) {			  
					if (status == google.maps.DistanceMatrixStatus.OK) {
						var distance = response.rows[0].elements[0].distance.text;
						var duration = response.rows[0].elements[0].duration.text;
						informationDuration(distance, duration);
					}
				}

				var distanceService = new google.maps.DistanceMatrixService();
				distanceService.getDistanceMatrix(distanceRequest, distanceCallback);
			}
			
			function obtainDirection(currentPos, placePos){
				var directionsDisplay = new google.maps.DirectionsRenderer();
				directionsDisplay.setMap(map);

				 var request = {
					origin:currentPos,
					destination:placePos,
					travelMode: google.maps.TravelMode.WALKING
				 };
				 
				function directionCallBack(result, status) {
					if (status == google.maps.DirectionsStatus.OK) {
						directionsDisplay.setDirections(result);
					}
				}
				 
				var directionsService = new google.maps.DirectionsService();
				directionsService.route(request, directionCallBack);
			}	
	}
