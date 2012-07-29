// DOM ready
function initializeMap() {
	var mapOptions = {
	  zoom: 10,
	  center: new google.maps.LatLng(55.85, 12.5),
	  mapTypeId: google.maps.MapTypeId.ROADMAP
	};

	window.map = new google.maps.Map(document.getElementById('google-map'), mapOptions);
		
	// Try HTML5 geolocation
	if (navigator.geolocation) {
	  navigator.geolocation.getCurrentPosition(function(position) {
		var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
		map.setCenter(pos);
		map.setZoom(12);
	  }, function() {
		//alert("No geolocation");
	  });
	}
	
	// Show badevand
	var hasTouch = "ontouchstart" in window;
	$.getJSON("http://pipes.yahoo.com/pipes/pipe.run?_id=aa240069f533d2b96d820f0f5441333a&_render=json&_callback=?", function(data) {
		$.each(data.value.items, function(i, item) {
			var image = getFlagUrl(item.Icon);
			var latLng = new google.maps.LatLng(item.Latitude,item.Longitude);
			var marker = new google.maps.Marker({
				position: latLng,
				map: map,
				title: item.ToolTip,
				icon: image
			});
			
			var openPrognose = function() {
				var win = window.open('http://oresund.badevand.dk/DashboardEngine.aspx?DashboardID=BathingWater\\DK\\Prognose&[PP1]=' + item.Name);
				win.focus();
			}
			
			if (hasTouch) {
				google.maps.event.addListener(marker, 'mousedown', openPrognose);
			} else {			
				google.maps.event.addListener(marker, 'click', openPrognose);
			}
		});		
	});
}

function getFlagUrl(status) {
	if (status == 'green') return 'img/FlagGreen.png';
	if (status == 'red') return 'img/FlagRed.png';
	if (status == 'yellow') return 'img/FlagYellow.png';
	else return 'img/FlagGrey.png';
}

$(function() {
    // Load Google Maps async
	var script = document.createElement('script');
	script.type = 'text/javascript';
	script.src = 'https://maps.googleapis.com/maps/api/js?sensor=false&' +	'callback=initializeMap';
	document.body.appendChild(script);
	
	// Check for hash
	if (window.location.hash) {
		var hash = window.location.hash.replace("#", "");		
	}
});