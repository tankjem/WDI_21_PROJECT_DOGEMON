
// overwriting prototype stuff. Sorry not sorry
google.maps.Circle.prototype.contains = function(latLng) {
  return this.getBounds().contains(latLng) && google.maps.geometry.spherical.computeDistanceBetween(this.getCenter(), latLng) <= this.getRadius();
}

var DogeApp = DogeApp || {};

DogeApp.pos;
DogeApp.event;
DogeApp.user;

var eventNumber = "";

DogeApp.API_URL = "http://localhost:3000/api";

DogeApp.setRequestHeader = function(jqXHR) {
  var token = window.localStorage.getItem("token");
  if(!!token) return jqXHR.setRequestHeader("Authorization", "Bearer " + token);
}

DogeApp.getTemplate = function(template, data, $element) {

  return $.get('/templates/' + template + '.html').done(function(templateHtml) {
    var html = _.template(templateHtml)(data);

    if(!$element) {
      DogeApp.$main.html(html);
    } else {
      $element.html(html);
    }

    DogeApp.updateUI();
  });
}

// user show

DogeApp.getUser = function(button) {
  event.preventDefault();

  return $.ajax({
    method: "GET",
    url: DogeApp.API_URL + "/user",
    beforeSend: DogeApp.setRequestHeader
  }).done(function(data) {
    DogeApp.user = data;
    // var $content = $('#content');
    // DogeApp.getTemplate("user/show", { user: data }, $content);
    // $content.removeClass('hidden');
    // DogeApp.getTemplate("/user/show", { user: data });
    DogeApp.gameLogic(button, data);
  });

}

DogeApp.deleteUser = function() {
  event.preventDefault();

  return $.ajax({
    method: "DELETE",
    url: DogeApp.API_URL + "/user",
    beforeSend: DogeApp.setRequestHeader
  }).done(DogeApp.getUser);// should be landing page instead of getUser, but it isn't done yet.
}

// pcs

DogeApp.getPc = function() {
  event.preventDefault();

  var id = $(this).data('id');
  console.log(id);
  return $.ajax({
    method: "GET",
    url: DogeApp.API_URL + "/pcs/" + id,
    beforeSend: DogeApp.setRequestHeader
  }).done(function(data) {
    var $content = $('#content');
    DogeApp.getTemplate("/pc/show", { pc: data }, $content);
    $content.removeClass('hidden');
    // DogeApp.getTemplate("/pc/show", { pc: data });
  });
}

DogeApp.deletePc = function() {
  event.preventDefault();

  var id = $(this).data('id');

  return $.ajax({
    method: "DELETE",
    url: DogeApp.API_URL + "/pcs/" + id,
    beforeSend: DogeApp.setRequestHeader
  }).done(DogeApp.getUser);
}


// forms (edit/new)

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

      DogeApp.getUser();
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

  return $.ajax({
    method: "GET",
    url: DogeApp.API_URL + "/user",
    beforeSend: DogeApp.setRequestHeader
  }).done(function(data) {
    DogeApp.getTemplate("/user/edit", { user: data });
  });
}

//events
DogeApp.getEvent = function(testMarker) {
  // event.preventDefault();
  return $.ajax({
    method: "GET",
    url: DogeApp.API_URL + "/event",
    beforeSend: DogeApp.setRequestHeader
  }).done(function(data){
    // console.log(data);
    DogeApp.event = data;
    // var $content = $('#content');
    // DogeApp.getTemplate("events/show", { event: data }, $content);
    // $content.removeClass('hidden');
    DogeApp.customInfoWindow(testMarker, data);

  });

}

DogeApp.getItem = function() {
  event.preventDefault();
  return $.ajax({
    method: "GET",
    url: DogeApp.API_URL + "/item",
    beforeSend: DogeApp.setRequestHeader
  }).done(function(data){
    var $content = $('#content');
    DogeApp.getTemplate("items/show", {item:data}, $content);
    $content.removeClass('hidden');
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
  this.$content = $("#content");
  this.$map = $("#map"); 
  this.$main.on("submit", "form", this.handleForm);
  this.$content.on('click', 'h4 a.delete-pc', this.deletePc);
  this.$content.on('click', 'h4 a.pc-show', this.getPc);
  $(".menu a").not(".logout, .profile, .edit-user, .pc-show").on('click', this.loadPage);
  $(".menu a.profile").on('click', this.getUser);
  $(".delete-user").on('click', this.deleteUser);
  $(".menu a.logout").on('click', this.logout);
  $(".edit-user").on("click", this.getEditForm);
  this.$content.on("focus", "form input", function() {
    $(this).parents('.form-group').removeClass('has-error');
  });

  // if(pcDeath !== 0) {
  //   this.deletePc;
  // }

            // THE MAP


  DogeApp.map = new google.maps.Map(document.getElementById('map'), {

    center: {
      lat: 51.5080072,
      lng: -0.1019284
    },
    zoom: 14,
    minZoom: 18,
    styles: [{"featureType":"all","elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#000000"},{"lightness":40}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#000000"},{"lightness":16}]},{"featureType":"all","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":17},{"weight":1.2}]},{"featureType":"administrative.country","elementType":"geometry.fill","stylers":[{"visibility":"off"},{"hue":"#76ff00"}]},{"featureType":"administrative.locality","elementType":"geometry.stroke","stylers":[{"visibility":"on"},{"color":"#7e2727"}]},{"featureType":"administrative.locality","elementType":"labels.text.fill","stylers":[{"visibility":"on"},{"color":"#a5a0a0"}]},{"featureType":"administrative.neighborhood","elementType":"geometry.fill","stylers":[{"color":"#915b5b"},{"visibility":"off"}]},{"featureType":"administrative.neighborhood","elementType":"geometry.stroke","stylers":[{"visibility":"off"},{"saturation":"-19"},{"color":"#c53d3d"}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"landscape.natural.landcover","elementType":"geometry.fill","stylers":[{"visibility":"off"},{"color":"#994e4e"}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":21}]},{"featureType":"poi.attraction","elementType":"geometry.fill","stylers":[{"visibility":"off"},{"color":"#a85d5d"}]},{"featureType":"poi.attraction","elementType":"geometry.stroke","stylers":[{"color":"#e10909"}]},{"featureType":"poi.place_of_worship","elementType":"geometry.fill","stylers":[{"visibility":"off"},{"color":"#6e2e2e"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#c42222"},{"lightness":29},{"weight":0.2},{"visibility":"on"}]},{"featureType":"road.highway","elementType":"labels.text.fill","stylers":[{"visibility":"on"},{"color":"#4f5049"}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":16}]},{"featureType":"road.local","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"color":"#5a5353"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":19}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#aa967c"},{"lightness":17}]},{"featureType":"water","elementType":"geometry.fill","stylers":[{"color":"#486d7a"},{"visibility":"on"}]},{"featureType":"water","elementType":"geometry.stroke","stylers":[{"visibility":"off"},{"color":"#af9393"}]}],
    disableDefaultUI: true
  });

  // 
  DogeApp.map.setCenter(new google.maps.LatLng(51.515170, -0.072260));
  DogeApp.map.setZoom(18);
  DogeApp.setBounds();
  DogeApp.getCurrentPosition(function() {
    DogeApp.setPlayerMarker();
    DogeApp.setRandMarkers();
    DogeApp.setRandRedZones();
  });
}

// // =================== auto-updating player marker

DogeApp.getCurrentPosition = function(callback) {
  navigator.geolocation.getCurrentPosition(function(position) {
    DogeApp.pos = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    }

    if(callback) callback();
  });
}

DogeApp.playerMarker = null;

DogeApp.setPlayerMarker = function() {
  if (DogeApp.playerMarker) {
    DogeApp.playerMarker.setPosition(DogeApp.pos);
  }
  else {
    DogeApp.playerMarker = new google.maps.Marker({
      position: DogeApp.pos,
      map: DogeApp.map,
      icon: {
        url: "/images/pcmarker.png",
        scaledSize: new google.maps.Size(60, 60),
        origin: new google.maps.Point(0,0),
        anchor: new google.maps.Point(25,25)
      }
    });
  }
  DogeApp.map.setCenter(DogeApp.pos);
  setInterval(DogeApp.getCurrentPosition, 1000 * 10);
}
  

// Bounds Rectangle


DogeApp.setBounds = function() {
  var bounds = new google.maps.LatLngBounds(
    new google.maps.LatLng(51.511883, -0.084863),
    new google.maps.LatLng(51.518263, -0.061775)
  );

  var lastValidCenter = DogeApp.map.getCenter();

  google.maps.event.addListener(DogeApp.map, 'center_changed', function() {
    if (bounds.contains(DogeApp.map.getCenter())) {
      // still within valid bounds, so save the last valid position
      lastValidCenter = DogeApp.map.getCenter();
      return;
    }
    // not valid anymore => return to last valid position
    DogeApp.map.panTo(lastValidCenter);
  });

  DogeApp.bounds = bounds;
}

// ================= Random Resource Drops

DogeApp.getRandomMarker = function() {
  var lat_min = DogeApp.bounds.getSouthWest().lat(),
    lat_range = DogeApp.bounds.getNorthEast().lat() - lat_min,
    lng_min = DogeApp.bounds.getSouthWest().lng(),
    lng_range = DogeApp.bounds.getNorthEast().lng() - lng_min;

  return new google.maps.LatLng(lat_min + (Math.random() * lat_range),
    lng_min + (Math.random() * lng_range));
}

DogeApp.setRandMarkers = function() {
  var testMarker = new google.maps.Marker({
    position: { lat: DogeApp.pos.lat + 0.0001, lng: DogeApp.pos.lng - 0.0001},
    map: DogeApp.map,
    icon: {
        url: "https://prometheus.atlas-sys.com/download/attachments/127894715/box-icon.png",
        scaledSize: new google.maps.Size(30, 30),
        origin: new google.maps.Point(0,0),
        anchor: new google.maps.Point(15,15)
      },
    animation: google.maps.Animation.BOUNCE
  });

  var resourceCircleTest = new google.maps.Circle({
    map: DogeApp.map,
    radius: 20,
    strokeColor: '#ffffff',
    strokeOpacity: 0.2,
    fillColor: '#ffffff',
    fillOpacity: 0.3,
  });

  resourceCircleTest.bindTo('center', testMarker, 'position');
  var resourceCircleBoundsTest = resourceCircleTest.getBounds();

// ============== The content div, showing events

  DogeApp.getEvent(testMarker);


  // testMarker.addListener("click", function() {
  //   if (resourceCircleBoundsTest.contains(DogeApp.pos)) {
  //     testMarker.setMap(null);
  //     resourceCircleTest.setMap(null);
  //   } 
  // });

  $('button').on('click', hideContent);


  function hideContent() {
    $('#content').addClass('hidden');
  };

  if (resourceCircleBoundsTest.contains(DogeApp.pos)) {
    console.log("A resource is close by.");
  };


  for (var i = 0; i < 150; i++) {

    var randMarker = new google.maps.Marker({
      position: DogeApp.getRandomMarker(),
      map: DogeApp.map,
      icon: {
        url: "https://prometheus.atlas-sys.com/download/attachments/127894715/box-icon.png", // url
        scaledSize: new google.maps.Size(30, 30), // scaled size
        origin: new google.maps.Point(0,0), // origin
        anchor: new google.maps.Point(15,15) // anchor
      }
    });

    // Resource radius
    var resourceCircle = new google.maps.Circle({
      map: DogeApp.map,
      radius: 20,
      strokeColor: '#ffffff',
      strokeOpacity: 0.2,
      fillColor: '#ffffff',
      fillOpacity: 0.3,
    });

    resourceCircle.bindTo('center', randMarker, 'position');

    var resourceCircleBounds = resourceCircle.getBounds();

  };

  randMarker.addListener("click", function() {
    if (resourceCircleBounds.contains(DogeApp.pos)) {
      randMarker.setMap(null);
      resourceCircle.setMap(null);

      DogeApp.customInfoWindow();
    } 
  });
}




// //  ============= Red Zones

DogeApp.setRandRedZones = function() {

  for (var i = 0; i < 8; i++) {
    var skullIcon = {
      url: "./images/skull.png", // url
      scaledSize: new google.maps.Size(60, 60), // scaled size
      origin: new google.maps.Point(0,0), // origin
      anchor: new google.maps.Point(25,25) // anchor
    };

    var randRedMarker = new google.maps.Marker({
      position: DogeApp.getRandomMarker(),
      map: DogeApp.map,
      icon: skullIcon
    });

    // Resource radius
    var redCircle = new google.maps.Circle({
      map: DogeApp.map,
      radius: 100,
      strokeColor: '#ff0000',
      strokeOpacity: 1,
      fillColor: '#ff0000',
      fillOpacity: 0.5
    });

    redCircle.bindTo('center', randRedMarker, 'position');

    var redCircleBounds = redCircle.getBounds();

    if (redCircleBounds.contains(DogeApp.pos)) {
      console.log("You're in the red zone!");
    }
  
  }
};

$('#main-map').on('click', hideContent);

function hideContent() {
  $('#content').addClass('hidden');
};


//  ============= game event logic

DogeApp.customInfoWindow = function(marker, data){
  
  var button = data.choices[0]
  DogeApp.getUser(button)
  marker.addListener("click", function(){
    if((data.choices).length === 2) {
      $("body").prepend("<div id='content'>" 
        + '<a href="#" aria-label="Close Account Info Modal Box" id="close">&cross;</a><br><br>'
        + data.name 
        + "<br><img src='" 
        + data.image_url 
        + "' width='100' height='100'><div>" 
        + data.description 
        + "</div><div class='choice1'>" 
        + data.choices[0] 
        + "</div><div class='choice2'>" 
        + data.choices[1] 
        + "</div><br></div>");
      DogeApp.gameLogic();
    } else {
      $("body").prepend("<div id='content'>" 
        + '<a href="#" aria-label="Close Account Info Modal Box" id="close">&cross;</a><br><br>'
        + data.name 
        + "<br><img src='" 
        + data.image_url 
        + "' width='100' height='100'><div>" 
        + data.description 
        + "</div><div class='choice1'>" 
        + data.choices[0] 
        + "</div><div class='choice2'>" 
        + data.choices[1]  
        + "</div><div class='choice3'>" 
        + data.choices[2] 
        + "</div><br></div>");
      DogeApp.gameLogic();
    }
  });

  console.log(data, " is still the event");
}

DogeApp.gameLogic = function(button, data) {
  $(".choice1").on("click", function() {
    
  })

  $('#content #close').on('click', function() {
    $('#content').addClass('hidden');
  })
}


// function buttonChoices (){
//   var btns = document.getElementsByClassName("choice-click");
//   for (var i=0;i<btns.length;i++){
//     addEvent(btns[i], 'click', console.log("hello");
//   }
// }



$(function() {
  DogeApp.initEventHandlers();
  DogeApp.updateUI();  
})
