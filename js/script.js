// DOM ready
$(function() {
    // Load Google Maps async
	var script = document.createElement('script');
	script.type = 'text/javascript';
	script.src = 'https://maps.googleapis.com/maps/api/js?sensor=false&' +	'callback=initializeMap';
	document.body.appendChild(script);
	
	// Check for hash
	if (window.location.hash) {
		var hash = window.location.hash.replace("#", "");		
	} else {
		$("#map").addClass("active");
	}
	
	// Hash changes
	$(window).bind("hashchange", function() {
		if (window.location.hash == "#map") {			
			$(".prognose").removeClass("active");
			$("#map").addClass("active");
			google.maps.event.trigger(map, 'resize');
		} else {
			var strand = window.location.hash.replace("#", "");
			showPrognose(strand);
		}
	});
	
	var hasTouch = "ontouchstart" in window;
	var markers = [];
	
	// Google Maps async load
	window.initializeMap = function() {
		var mapOptions = {
		  zoom: 10,
		  center: new google.maps.LatLng(55.85, 12.5),
		  mapTypeId: google.maps.MapTypeId.ROADMAP
		};
		
		window.map = new google.maps.Map(document.getElementById('google-map'), mapOptions);
		findAndZoomToLocation();
		if (markers.length > 0) placeMarkers(markers, map);
	}	
	
	// Load badevand	
	$.getJSON("http://pipes.yahoo.com/pipes/pipe.run?_id=aa240069f533d2b96d820f0f5441333a&_render=json&_callback=?", function(data) {
		// Save markers
		markers = data.value.items;
		if ("setZoom" in map) placeMarkers(markers, map);
	});	
	
	var placeMarkers = function(markers, map) {
		$.each(markers, function(i, item) {
			var image = getFlagUrl(item.Icon);
			var latLng = new google.maps.LatLng(item.Latitude,item.Longitude);
			var marker = new google.maps.Marker({
				position: latLng,
				map: map,
				title: item.ToolTip,
				icon: image
			});
			
			if (hasTouch) {
				google.maps.event.addListener(marker, 'mousedown', function() {
					showPrognose(item.Name);
				});
			} else {			
				google.maps.event.addListener(marker, 'click', function() {
					showPrognose(item.Name);
				});
			}
		});		
	}
	
	var showPrognose = function(strand) {
		window.location.hash = strand;
		getPrognose(strand, function(html) {
			$(".prognose .header").text(strand);
			$(".prognose").addClass("active").find(".content").html(html);
			$("#map").removeClass("active");
		});
	}

	var getFlagUrl = function (status) {
		var url;
		if (status == 'green') url = 'img/FlagGreen.png';
		else if (status == 'red')  url ='img/FlagRed.png';
		else if (status == 'yellow') url = 'img/FlagYellow.png';
		else url = 'img/FlagGrey.png';
		
		var img = new google.maps.MarkerImage(url, null, new google.maps.Point(0, 0));
		return img;
	}
	
	var findAndZoomToLocation = function() {	
		if (navigator.geolocation) {
		  navigator.geolocation.getCurrentPosition(function(position) {
			var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
			map.setCenter(pos);
			map.setZoom(12);
		  });
		}
	}
	
	var getPrognose = function(strand, callback) {
		$.getJSON("http://pipes.yahoo.com/pipes/pipe.run?_id=07d66f15e36a523cc69cf740103eeab8&_render=json&strand=" + strand + "&_callback=?", function(data) {
			if (data.count) callback(data.value.items[0].content);
		});		
	}
});