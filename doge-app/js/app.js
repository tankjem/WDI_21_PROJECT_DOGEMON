var DogeApp = DogeApp || {};

DogeApp.API_URL = "http://localhost:3000/api";

DogeApp.setRequestHeader = function(jqXHR) {
  var token = window.localStorage.getItem("token");
  if (!!token) return jqXHR.setRequestHeader("Authorization", "Bearer " + token);
}

DogeApp.getTemplate = function(template, data) {
  return $.get('/templates/' + template + '.html').done(function(templateHtml) {
    var html = _.template(templateHtml)(data);
    DogeApp.$main.html(html);
    DogeApp.updateUI();
  });
}

// users???

DogeApp.getUser = function() {
  event.preventDefault();

  var id = $(this).data('id');

  return $.ajax({
    method: "GET",
    url: DogeApp.API_URL + "/users/" + id
  }).done(function(data) {
    DogeApp.getTemplate("show", {
      user: data
    });
  });
}

DogeApp.handleForm = function() {
  event.preventDefault();

  $(this).find('button').prop('disabled', true);

  var data = $(this).serialize();
  var method = $(this).attr("method");
  var url = DogeApp.API_URL + $(this).attr("action");

  return $.ajax({
      url: url,
      method: method,
      data: data,
      beforeSend: DogeApp.setRequestHeader
    })
    .done(function(data) {
      if (!!data.token) {
        window.localStorage.setItem("token", data.token);
      }
    })
    .fail(DogeApp.handleFormErrors);
}

DogeApp.handleFormErrors = function(jqXHR) {
  var $form = $("form");
  for (field in jqXHR.responseJSON.errors) {
    $form.find("input[name=" + field + "]").parent(".form-group").addClass("has-error");
  }
  $form.find("button").removeAttr("disabled");
}

DogeApp.getEditForm = function() {
  event.preventDefault();

  var id = $(this).data('id');

  return $.get(DogeApp.API_URL + "/users/" + id).done(function(data) {
    DogeApp.getTemplate("edit", {
      user: data
    });
  });
}

DogeApp.loadPage = function() {
  event.preventDefault();
  DogeApp.getTemplate($(this).data("template"));
}

DogeApp.logout = function() {
  event.preventDefault();
  window.localStorage.clear();
  DogeApp.updateUI();
}

DogeApp.updateUI = function() {
  var loggedIn = !!window.localStorage.getItem("token");
  if (loggedIn) {
    $(".logged-in").removeClass("hidden");
    $(".logged-out").addClass("hidden");
  } else {
    $(".logged-in").addClass("hidden");
    $(".logged-out").removeClass("hidden");
  }
}

DogeApp.initEventHandlers = function() {
  this.$main = $("main");
  this.$main.on("submit", "form", this.handleForm);
  $(".menu a").not(".logout").not(".user-profile").on('click', this.loadPage);
  $(".menu a").on('click', '.user-profile', this.getUser);
  $(".menu a.logout").on('click', this.logout);
  this.$main.on("click", "a.edit-user", this.getEditForm);
  this.$main.on("focus", "form input", function() {
    $(this).parents('.form-group').removeClass('has-error');
  });
}

DogeApp.init = function() {
  this.initEventHandlers();
  this.updateUI();
}.bind(DogeApp);

$(DogeApp.init);

// Drop down menu

var ready = $(function() {
  $(".menu").hide();
  $(".hamburger").click(function() {
    $(".menu").slideToggle("slow", function() {});
  });
});

ready;

// The map

var map = new google.maps.Map(document.getElementById('map'), {

  center: {
    lat: 51.5080072,
    lng: -0.1019284
  },
  zoom: 14,
  styles: [{"featureType":"all","elementType":"labels.text.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"color":"#000000"},{"lightness":13}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#000000"}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#144b53"},{"lightness":14},{"weight":1.4}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#08304b"}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#0c4152"},{"lightness":5}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#000000"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#0b434f"},{"lightness":25}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"color":"#000000"}]},{"featureType":"road.arterial","elementType":"geometry.stroke","stylers":[{"color":"#0b3d51"},{"lightness":16}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#000000"}]},{"featureType":"transit","elementType":"all","stylers":[{"color":"#146474"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#021019"}]}]
});

// Try HTML5 geolocation.


// initMap();

map.setCenter(new google.maps.LatLng(51.515170, -0.072260));
map.setZoom(18);

// map.addListener('click', function(e) {

//   var marker = new google.maps.Marker({
//     position: e.latLng,
//     map: map,
//     animation: google.maps.Animation.BOUNCE,
//     icon: "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
//   });

//     marker.addListener('click', function() {
//       this.setAnimation(null);
//     });
//   });

// navigator.geolocation.getCurrentPosition(function(position) {
//  var marker = new google.maps.Marker({
//     position: { lat: position.coords.latitude, lng: position.coords.longitude },
//   map: map,
//   animation: google.maps.Animation.DROP,
//       url: "./images/safe-icon.png", // url
//       scaledSize: new google.maps.Size(30, 30), // scaled size
//       origin: new google.maps.Point(0,0), // origin
//       anchor: new google.maps.Point(0, 0) // anchor
//   });

//  map.panTo(marker.getPosition());
//  map.setZoom(16);
// });

// Bounds Rectangle

var bounds = new google.maps.LatLngBounds(
  new google.maps.LatLng(51.511883, -0.084863),
  new google.maps.LatLng(51.518263, -0.061775)
);

var lastValidCenter = map.getCenter();

google.maps.event.addListener(map, 'center_changed', function() {
  if (bounds.contains(map.getCenter())) {
    // still within valid bounds, so save the last valid position
    lastValidCenter = map.getCenter();
    return;
  }

  // not valid anymore => return to last valid position
  map.panTo(lastValidCenter);
});

var rectangle = new google.maps.Rectangle({
  strokeColor: '#FF0000',
  strokeOpacity: 0.8,
  strokeWeight: 40,
  fillColor: '#FF0000',
  fillOpacity: 0,
  map: map,
  bounds: {
    north: 51.518263,
    south: 51.511883,
    east: -0.061775,
    west: -0.084863
  }
});

// Resource Drops

function getRandom_marker(bounds) {
  var lat_min = bounds.getSouthWest().lat(),
    lat_range = bounds.getNorthEast().lat() - lat_min,
    lng_min = bounds.getSouthWest().lng(),
    lng_range = bounds.getNorthEast().lng() - lng_min;

  return new google.maps.LatLng(lat_min + (Math.random() * lat_range),
    lng_min + (Math.random() * lng_range));
}

function setRandMarkers() {

  for (var i = 0; i < 100; i++) {
    var icon = {
      url: "./images/safe-icon.png", // url
      scaledSize: new google.maps.Size(30, 30), // scaled size
      origin: new google.maps.Point(0,0), // origin
      anchor: new google.maps.Point(15,15) // anchor
    };

   var randMarker = new google.maps.Marker({
     position: getRandom_marker(bounds), 
     map: map,
     icon: icon
   });

   // Resource radius
   var resourceCircle = new google.maps.Circle({
     map: map,
     radius: 15,
     strokeColor: '#ffffff', 
     strokeOpacity: 0.2,   
     fillColor: '#ffffff',
     fillOpacity: 0.3,
   });

   resourceCircle.bindTo('center', randMarker, 'position');

  }
}

setRandMarkers();

google.maps.event.addListener(map, 'zoom_changed', function() {
  if (map.getZoom() < 18) map.setZoom(18);
});


// Red Zones

function setRandRedZones() {

 for (var i = 0; i < 5; i++) {
  var skullIcon = {
      url: "./images/skull.png", // url
      scaledSize: new google.maps.Size(60, 60), // scaled size
      origin: new google.maps.Point(0,0), // origin
      anchor: new google.maps.Point(25,25) // anchor
  };

   var randRedMarker = new google.maps.Marker({
     position: getRandom_marker(bounds),
     map: map,
     icon: skullIcon
   });

   // Resource radius
   var redCircle = new google.maps.Circle({
     map: map,
     radius: 80,
     strokeColor: '#ff0000', 
     strokeOpacity: 1,   
     fillColor: '#ff0000',
     fillOpacity: 0.5
   });

   redCircle.bindTo('center', randRedMarker, 'position');

  }
}

setRandRedZones();

  // Try HTML5 geolocation. << Ed's code

//   function initMap() {
//     var infoWindow = new google.maps.InfoWindow({
//       map: map
//     });

//   }

// function geoLocator() {
//   if (navigator.geolocation) {
//     navigator.geolocation.getCurrentPosition(function(position) {
//       var pos = {
//         lat: position.coords.latitude,
//         lng: position.coords.longitude
//       };

//       infoWindow.setPosition(pos);
//       infoWindow.setContent('Location found.');
//       map.setCenter(pos);
//     }, function() {
//       handleLocationError(true, infoWindow, map.getCenter());
//     });
//   } else {
//     // Browser doesn't support Geolocation
//     handleLocationError(false, infoWindow, map.getCenter());
//   }
// }

// function handleLocationError(browserHasGeolocation, infoWindow, pos) {
//   infoWindow.setPosition(pos);
//   infoWindow.setContent(browserHasGeolocation ?
//     'Error: The Geolocation service failed.' :
//     'Error: Your browser doesn\'t support geolocation.');
// };

// geoLocator();

// initMap();


// added inventory for loop

// DogeApp.inventoryCreation = function(){
//   for (var i = 0; i < 30; i++) {

//     var inventory = document.createElement('div');
//     inventory.setAttribute("class","items");
//   }
// }
