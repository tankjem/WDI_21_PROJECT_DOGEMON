var DogeApp = DogeApp || {};

DogeApp.API_URL = "http://localhost:3000/api";

DogeApp.setRequestHeader = function(jqXHR) {
  var token = window.localStorage.getItem("token");
  if(!!token) return jqXHR.setRequestHeader("Authorization", "Bearer " + token);
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
    DogeApp.getTemplate("show", { user: data });
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
    if(!!data.token) {
      window.localStorage.setItem("token", data.token);
    }
  })
  .fail(DogeApp.handleFormErrors);
}

DogeApp.handleFormErrors = function(jqXHR) {
  var $form = $("form");
  for(field in jqXHR.responseJSON.errors) {
    $form.find("input[name=" + field + "]").parent(".form-group").addClass("has-error");
  }
  $form.find("button").removeAttr("disabled");
}

DogeApp.getEditForm = function() {
  event.preventDefault();

  var id = $(this).data('id');

  return $.get(DogeApp.API_URL + "/users/" + id).done(function(data) {
    DogeApp.getTemplate("edit", { user: data });
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
  if(loggedIn) {
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
    $(".menu").slideToggle("slow", function() {
    });
  });
});

ready;

// The map


var map = new google.maps.Map(document.getElementById('map'), 
{
  center: { lat: 51.5080072, lng: -0.1019284 },
  zoom: 14,
  styles: [{"featureType":"administrative","elementType":"labels","stylers":[{"visibility":"simplified"},{"color":"#e94f3f"}]},{"featureType":"landscape","elementType":"all","stylers":[{"visibility":"on"},{"gamma":"0.50"},{"hue":"#ff4a00"},{"lightness":"-79"},{"saturation":"-86"}]},{"featureType":"landscape.man_made","elementType":"all","stylers":[{"hue":"#ff1700"}]},{"featureType":"landscape.natural.landcover","elementType":"all","stylers":[{"visibility":"on"},{"hue":"#ff0000"}]},{"featureType":"poi","elementType":"all","stylers":[{"color":"#e74231"},{"visibility":"off"}]},{"featureType":"poi","elementType":"labels.text.stroke","stylers":[{"color":"#4d6447"},{"visibility":"off"}]},{"featureType":"poi","elementType":"labels.icon","stylers":[{"color":"#f0ce41"},{"visibility":"off"}]},{"featureType":"poi.park","elementType":"all","stylers":[{"color":"#363f42"}]},{"featureType":"road","elementType":"all","stylers":[{"color":"#231f20"}]},{"featureType":"road","elementType":"labels.text.fill","stylers":[{"color":"#6c5e53"}]},{"featureType":"transit","elementType":"all","stylers":[{"color":"#313639"},{"visibility":"off"}]},{"featureType":"transit","elementType":"labels.text","stylers":[{"hue":"#ff0000"}]},{"featureType":"transit","elementType":"labels.text.fill","stylers":[{"visibility":"simplified"},{"hue":"#ff0000"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#0e171d"}]}]

});

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
  new google.maps.LatLng(51.514462, -0.075382),
  new google.maps.LatLng(51.516465, -0.069771) 
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
    north: 51.516465,
    south: 51.514462,
    east: -0.069771,
    west: -0.075382
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

 for (var i = 0; i < 80; i++) {
  var icon = {
      url: "./images/safe-icon.png", // url
      scaledSize: new google.maps.Size(30, 30), // scaled size
      origin: new google.maps.Point(0,0), // origin
      anchor: new google.maps.Point(0,0) // anchor
  };
   var randMarker = new google.maps.Marker({
     position: getRandom_marker(bounds), 
     map: map,
     icon: icon
   });

   // Resource radius
   var resourceCircle = new google.maps.Circle({
     map: map,
     radius: 10,
     strokeColor: '#ffff4d', 
     strokeOpacity: 0.5,   
     fillColor: '#ffff4d',
     fillOpacity: 0.2,
   });

   resourceCircle.bindTo('center', randMarker, 'position');
  };
};

setRandMarkers();

google.maps.event.addListener(map, 'zoom_changed', function() {
  if (map.getZoom() < 19) map.setZoom(19);
});


// Red Zones

function setRandRedZones() {

 for (var i = 0; i < 5; i++) {
  var skullIcon = {
      url: "./images/skull.png", // url
      scaledSize: new google.maps.Size(30, 30), // scaled size
      origin: new google.maps.Point(0,0), // origin
      anchor: new google.maps.Point(0,0) // anchor
  };
   var randRedMarker = new google.maps.Marker({
     position: getRandom_marker(bounds),
     map: map,
     icon: skullIcon
   });

   // Resource radius
   var redCircle = new google.maps.Circle({
     map: map,
     radius: 40,
     strokeColor: '#ff0000', 
     strokeOpacity: 0.2,   
     fillColor: '#ff0000',
     fillOpacity: 0.2,
   });

   redCircle.bindTo('center', randRedMarker, 'position');

  };
};

setRandRedZones();


// added inventory for loop

// DogeApp.inventoryCreation = function(){
//   for (var i = 0; i < 30; i++) {
    
//     var inventory = document.createElement('div');
//     inventory.setAttribute("class","items");
//   }
// }
