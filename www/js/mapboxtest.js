

L.mapbox.accessToken = 'pk.eyJ1IjoianVzdGluZ3JpZmZpcyIsImEiOiJjaW5vZTVoOXkxMDRwdWttM3h6ZXJubnl0In0.bxjqQibLLysx3i5CIbktLQ';
// Create a map in the div #map


$( document ).ready("#map-page", function() {
			
			L.mapbox.map('map', 'mapbox.streets');

			var ref = new Firebase("https://emplaced.firebaseio.com/places/obs/-KGp9K2eWhFAq79pV0U3");
			ref.once("value", function(snapshot) {
			  	console.log("data", snapshot.val());
			  	var obs = snapshot.val();
			  	lat = obs.location.latitude;
			  	lon = obs.location.longitude;
			  	image = obs.image;
			  	desc = obs.description;

			  	setMapBox(lat, lon);
			  	setMarker(lat, lon, image, desc );
			});

			var setMarks = function(lat, lon, image, desc) {
				var markers = {
				    "type": "FeatureCollection",
				    "features": [{
				    	"type": "Feature",
				        "properties": {
				            "description": "<div class=\'marker-title\'>emplace - story</div><p>"+locdes+"</p><img src="+ locimg +" style='float:left;margin-right:5px' height='200px' width='200px'>",
				            "marker-symbol": "marker"
				        },
				        "geometry": {
				            "type": "Point",
				            "coordinates": [loclat, loclon]
				        }
				    }]
				};
			};
			
			var setMapBox = function (loclat, loclon) {
					latString = loclat.toFixed(2);
					lonString = loclon.toFixed(2);
					lat = parseFloat(latString);
					lon = parseFloat(lonString);
				
				map = new mapboxgl.Map({
				    container: 'map',
				    style: 'mapbox://styles/mapbox/streets-v8',
				    center: [loc, loc],
				    zoom: 11.15
				});
			};

				map.on('load', function () {
				    // Add marker data as a new GeoJSON source.
				    map.addSource("markers", {
				        "type": "geojson",
				        "data": markers
				    });

				    // Add a layer showing the markers.
				    map.addLayer({
				        "id": "markers",
				        "type": "symbol",
				        "source": "markers",
				        "layout": {
				            "icon-image": "{marker-symbol}-15",
				            "icon-allow-overlap": true
				        }
				    });
				});

				// When a click event occurs near a marker icon, open a popup at the location of
				// the feature, with description HTML from its properties.
				map.on('click', function (e) {
				    var features = map.queryRenderedFeatures(e.point, { layers: ['markers'] });

				    if (!features.length) {
				        return;
				    }

				    var feature = features[0];

				    // Populate the popup and set its coordinates
				    // based on the feature found.
				    var popup = new mapboxgl.Popup()
				        .setLngLat(feature.geometry.coordinates)
				        .setHTML(feature.properties.description)
				        .addTo(map);
				});

				// Use the same approach as above to indicate that the symbols are clickable
				// by changing the cursor style to 'pointer'.
				map.on('mousemove', function (e) {
				    var features = map.queryRenderedFeatures(e.point, { layers: ['markers'] });
				    map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';
				});
});
