var bgm = new Audio('/sound/l4d.mp3');
bgm.play();


// overwriting prototype stuff. Sorry not sorry
google.maps.Circle.prototype.contains = function(latLng) {
  return this.getBounds().contains(latLng) && google.maps.geometry.spherical.computeDistanceBetween(this.getCenter(), latLng) <= this.getRadius();
}

var DogeApp = DogeApp || {};

DogeApp.pos;
DogeApp.event;
DogeApp.user;
DogeApp.item;
DogeApp.equippedWeaponStat;
DogeApp.equippedArmourStat;

var eventNumber = "";

DogeApp.API_URL = "/api";

DogeApp.setRequestHeader = function(jqXHR) {
  var token = window.localStorage.getItem("token");
  if (!!token) return jqXHR.setRequestHeader("Authorization", "Bearer " + token);
}

DogeApp.getTemplate = function(template, data, $element) {
  return $.get('/templates/' + template + '.html').done(function(templateHtml) {
    var html = _.template(templateHtml)(data);
    if (!$element) {
      DogeApp.$content.html(html);
      DogeApp.$content.removeClass('hidden');
    } else {
      $element.html(html);
    }
    DogeApp.updateUI();
  });
}

// user show

DogeApp.getUserData = function(button, damage) {
  event.preventDefault();

  return $.ajax({
    method: "GET",
    url: DogeApp.API_URL + "/user",
    beforeSend: DogeApp.setRequestHeader
  }).done(function(data) {
    DogeApp.user = data;
    DogeApp.gameLogic(button, data);
    DogeApp.userNeeds(data);
    DogeApp.equipItem(data);
  });
}
DogeApp.updateUserData = function(user) {
  // event.preventDefault();
  return $.ajax({
    method: "PUT",
    url: DogeApp.API_URL + "/user",
    data: user,
    beforeSend: DogeApp.setRequestHeader
  }).done(function(data) {
    console.log(data.health);
  });
}


DogeApp.getUser = function() {
  event.preventDefault();

  return $.ajax({
    method: "GET",
    url: DogeApp.API_URL + "/user",
    beforeSend: DogeApp.setRequestHeader
  }).done(function(data) {
    var $content = $('#content');
    DogeApp.getTemplate("/user/show", { user: data }, $content);
    $content.removeClass('hidden');
    $('.menu').addClass('hidden');
  });
}

DogeApp.deleteUser = function() {
  event.preventDefault();

  return $.ajax({
    method: "DELETE",
    url: DogeApp.API_URL + "/user",
    beforeSend: DogeApp.setRequestHeader
  }).done(DogeApp.getUser); // should be landing page instead of getUser, but it isn't done yet.
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
      beforeSend: DogeApp.setRequestHeader,
  })
    .done(function(data) {
      var $form = $('.form-flex');
      $form.remove();

      if (!!data.token) {

        window.localStorage.setItem("token", data.token);
      }
      DogeApp.updateUI();
      DogeApp.getUser();
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

  $('.menu').addClass('hidden');

  return $.ajax({
    method: "GET",
    url: DogeApp.API_URL + "/user",
    beforeSend: DogeApp.setRequestHeader
  }).done(function(data) {
    DogeApp.getTemplate("/user/edit", {
      user: data
    });
  });
}

//events
DogeApp.getEvent = function(testMarker) {
// DogeApp.getEvent = function(randMarker) {
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
    // DogeApp.customInfoWindow(randMarker, data);
    DogeApp.getItem(data);
  });
}

DogeApp.getItem = function() {
  // event.preventDefault();
  return $.ajax({
    method: "GET",
    url: DogeApp.API_URL + "/item",
    beforeSend: DogeApp.setRequestHeader
  }).done(function(data){
    DogeApp.item = data;
    // console.log(data);
    // var $content = $('#content');
    // DogeApp.getTemplate("items/show", {item:data}, $content);
    // $content.removeClass('hidden');
  });
}

DogeApp.loadPage = function() {
  event.preventDefault();
  var $content = $('#content');
  DogeApp.getTemplate($(this).data("template"));
  // $content.removeClass('hidden');
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
  this.$content = $("#content");
  this.$map = $("#map");
  this.$menu = $('.menu');
  this.$content.on("submit", "form", this.handleForm);
  $(".menu a").not(".logout, .profile, .edit-user").on('click', this.loadPage);
  $(".menu a.profile").on('click', this.getUser);
  $(".delete-user").on('click', this.deleteUser);
  $(".menu a.logout").on('click', this.logout);
  $(".edit-user").on("click", this.getEditForm);
  this.$content.on("focus", "form input", function() {
    $(this).parents('.form-group').removeClass('has-error');
  });

  $('.menu a').on('click', function() {
    $('.menu').addClass('hidden');
  })

  this.$content.on('click', '#close', function() {
    event.preventDefault();
    DogeApp.$content.addClass('hidden');
    DogeApp.$menu.removeClass('hidden');
  });


  // if(pcDeath !== 0) {
  //   this.deletePc;
  // }

            // === THE MAP

  DogeApp.map = new google.maps.Map(document.getElementById('map'), {

    center: {
      lat: 51.5080072,
      lng: -0.1019284
    },
    zoom: 14,
    minZoom: 18,
    styles: [{
      "featureType": "all",
      "elementType": "labels.text.fill",
      "stylers": [{
        "saturation": 36
      }, {
        "color": "#000000"
      }, {
        "lightness": 40
      }]
    }, {
      "featureType": "all",
      "elementType": "labels.text.stroke",
      "stylers": [{
        "visibility": "on"
      }, {
        "color": "#000000"
      }, {
        "lightness": 16
      }]
    }, {
      "featureType": "all",
      "elementType": "labels.icon",
      "stylers": [{
        "visibility": "off"
      }]
    }, {
      "featureType": "administrative",
      "elementType": "geometry.fill",
      "stylers": [{
        "color": "#000000"
      }, {
        "lightness": 20
      }]
    }, {
      "featureType": "administrative",
      "elementType": "geometry.stroke",
      "stylers": [{
        "color": "#000000"
      }, {
        "lightness": 17
      }, {
        "weight": 1.2
      }]
    }, {
      "featureType": "administrative.country",
      "elementType": "geometry.fill",
      "stylers": [{
        "visibility": "off"
      }, {
        "hue": "#76ff00"
      }]
    }, {
      "featureType": "administrative.locality",
      "elementType": "geometry.stroke",
      "stylers": [{
        "visibility": "on"
      }, {
        "color": "#7e2727"
      }]
    }, {
      "featureType": "administrative.locality",
      "elementType": "labels.text.fill",
      "stylers": [{
        "visibility": "on"
      }, {
        "color": "#a5a0a0"
      }]
    }, {
      "featureType": "administrative.neighborhood",
      "elementType": "geometry.fill",
      "stylers": [{
        "color": "#915b5b"
      }, {
        "visibility": "off"
      }]
    }, {
      "featureType": "administrative.neighborhood",
      "elementType": "geometry.stroke",
      "stylers": [{
        "visibility": "off"
      }, {
        "saturation": "-19"
      }, {
        "color": "#c53d3d"
      }]
    }, {
      "featureType": "landscape",
      "elementType": "geometry",
      "stylers": [{
        "color": "#000000"
      }, {
        "lightness": 20
      }]
    }, {
      "featureType": "landscape.natural.landcover",
      "elementType": "geometry.fill",
      "stylers": [{
        "visibility": "off"
      }, {
        "color": "#994e4e"
      }]
    }, {
      "featureType": "poi",
      "elementType": "geometry",
      "stylers": [{
        "color": "#000000"
      }, {
        "lightness": 21
      }]
    }, {
      "featureType": "poi.attraction",
      "elementType": "geometry.fill",
      "stylers": [{
        "visibility": "off"
      }, {
        "color": "#a85d5d"
      }]
    }, {
      "featureType": "poi.attraction",
      "elementType": "geometry.stroke",
      "stylers": [{
        "color": "#e10909"
      }]
    }, {
      "featureType": "poi.place_of_worship",
      "elementType": "geometry.fill",
      "stylers": [{
        "visibility": "off"
      }, {
        "color": "#6e2e2e"
      }]
    }, {
      "featureType": "road.highway",
      "elementType": "geometry.fill",
      "stylers": [{
        "color": "#000000"
      }, {
        "lightness": 17
      }]
    }, {
      "featureType": "road.highway",
      "elementType": "geometry.stroke",
      "stylers": [{
        "color": "#c42222"
      }, {
        "lightness": 29
      }, {
        "weight": 0.2
      }, {
        "visibility": "on"
      }]
    }, {
      "featureType": "road.highway",
      "elementType": "labels.text.fill",
      "stylers": [{
        "visibility": "on"
      }, {
        "color": "#4f5049"
      }]
    }, {
      "featureType": "road.arterial",
      "elementType": "geometry",
      "stylers": [{
        "color": "#000000"
      }, {
        "lightness": 18
      }]
    }, {
      "featureType": "road.local",
      "elementType": "geometry",
      "stylers": [{
        "color": "#000000"
      }, {
        "lightness": 16
      }]
    }, {
      "featureType": "road.local",
      "elementType": "geometry.fill",
      "stylers": [{
        "visibility": "on"
      }, {
        "color": "#5a5353"
      }]
    }, {
      "featureType": "transit",
      "elementType": "geometry",
      "stylers": [{
        "color": "#000000"
      }, {
        "lightness": 19
      }]
    }, {
      "featureType": "water",
      "elementType": "geometry",
      "stylers": [{
        "color": "#aa967c"
      }, {
        "lightness": 17
      }]
    }, {
      "featureType": "water",
      "elementType": "geometry.fill",
      "stylers": [{
        "color": "#486d7a"
      }, {
        "visibility": "on"
      }]
    }, {
      "featureType": "water",
      "elementType": "geometry.stroke",
      "stylers": [{
        "visibility": "off"
      }, {
        "color": "#af9393"
      }]
    }],
    disableDefaultUI: true
  });

  DogeApp.map.setCenter(new google.maps.LatLng(51.515170, -0.072260));
  DogeApp.map.setZoom(18);
  DogeApp.setBounds();

  DogeApp.getCurrentPosition(function() {
    DogeApp.setTestMarkers();
    // DogeApp.setRandMarkers();
    DogeApp.setRandRedZones();
  });
  setInterval(DogeApp.userNeeds, 1000 * 60 * 45);
  setInterval(DogeApp.getCurrentPosition, 1000 * 30);
}

// // =================== auto-updating player marker

DogeApp.getCurrentPosition = function(callback) {
  navigator.geolocation.getCurrentPosition(function(position) {
    DogeApp.pos = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    }
    console.log("Moving" + DogeApp.pos.lat + DogeApp.pos.lng);

    if(callback) callback();
  });
}

DogeApp.playerMarker = null;

DogeApp.setPlayerMarker = function() {
  navigator.geolocation.getCurrentPosition(function(position) {
    var newPoint = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    if (DogeApp.playerMarker) {
      DogeApp.playerMarker.setPosition(newPoint);
    } else {
      DogeApp.playerMarker = new google.maps.Marker({
        position: newPoint,
        map: DogeApp.map,
        icon: {
          url: "/images/pcmarker.png",
          scaledSize: new google.maps.Size(60, 60),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(25, 25)
          }
      });
    }
    DogeApp.map.setCenter(newPoint);
    console.log()
  });
  setTimeout(DogeApp.setPlayerMarker, 1000 * 20);
}

DogeApp.setPlayerMarker();


DogeApp.checkUserDeath = function() {
  if(DogeApp.user.health <= 0) {
    // Add to a screen, much like the register/login screens where you cannot click anything but continue
    DogeApp.user.health = 100;
    DogeApp.user.inventory = [];
    DogeApp.user.food = 100;
    DogeApp.user.water = 100;
    DogeApp.user.attack = 10;
    DogeApp.user.armour = 10;
    DogeApp.updateUserData(DogeApp.user);
    console.log("You have died. Idiot.")
  } else {
    console.log("Still alive")
  }
}

DogeApp.userNeeds = function() {
  if(DogeApp.user.food < 5) {
    DogeApp.user.food = 0;
    DogeApp.user.health = DogeApp.user.health - 15;
  } else {
    DogeApp.user.food = DogeApp.user.food - 5;
  }
  if(DogeApp.user.water < 5) {
    DogeApp.user.water = 0;
    DogeApp.user.health = DogeApp.user.health - 15;
  } else {
    DogeApp.user.water = DogeApp.user.water - 5;
  }
  DogeApp.updateUserData(DogeApp.user);
  DogeApp.checkUserDeath();
}


DogeApp.equipItem = function() {
  $("div.item-click").on("click", function() {
    if($(".type").html() === "Weapon") {
      $("#equippedWeapon").html($(".name").html())
      DogeApp.equippedWeaponStat = $(".damage").html()
    } else if($(".type").html() === "Armour") {
      $("#equippedArmour").html($(".name").html())
      DogeApp.equippedArmourStat = $(".armour").html()
    } else if($(".type").html() === "Health") {
      DogeApp.user.health = DogeApp.user.health + Number($(".health").html())
      // need to pop this out of the array
      DogeApp.updateUserData(DogeApp.user);
    }
  });
}

// setInterval(DogeApp.getCurrentPosition, 1000 * 30);


// === >>> Bounds Rectangle <<< ===

DogeApp.setBounds = function() {

  // Oct 1st -- Bex; set this to a circular radius around the player 
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

DogeApp.setTestMarkers = function() {
// DogeApp.setRandMarkers = function() {
  var testMarker = new google.maps.Marker({
    position: {
      lat: DogeApp.pos.lat + 0.0001,
      lng: DogeApp.pos.lng - 0.0001
    },
    map: DogeApp.map,
    icon: {
      url: "/images/box-icon.png",
      scaledSize: new google.maps.Size(30, 30),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(15, 15)
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

  testMarker.addListener("click", function() {
    if (resourceCircleBoundsTest.contains(DogeApp.pos)) {
      testMarker.setMap(null);
      resourceCircleTest.setMap(null);
    }
  });

  if (resourceCircleBoundsTest.contains(DogeApp.pos)) {
    console.log("A resource is close by.");
  };


  for (var i = 0; i < 150; i++) {

    var randMarker = new google.maps.Marker({
      position: DogeApp.getRandomMarker(),
      map: DogeApp.map,
      icon: {
        url: "/images/box-icon.png", // url
        scaledSize: new google.maps.Size(30, 30), // scaled size
        origin: new google.maps.Point(0,0), // origin
        anchor: new google.maps.Point(15,15) // anchor
      }
    });

    // Resource radius
    var resourceCircle = new google.maps.Circle({
      map: DogeApp.map,
      radius: 30,
      strokeColor: '#ffffff',
      strokeOpacity: 0.2,
      fillColor: '#ffffff',
      fillOpacity: 0.3,
    });

    resourceCircle.bindTo('center', randMarker, 'position');

    var resourceCircleBounds = resourceCircle.getBounds();

    // DogeApp.getEvent(randMarker);
  };

  randMarker.addListener("click", function() {
    if (resourceCircleBounds.contains(DogeApp.pos)) {
      randMarker.setMap(null);
      resourceCircle.setMap(null);

      // DogeApp.customInfoWindow();
    }
  });
}




// //  ============= Red Zones

DogeApp.setRandRedZones = function() {

  for (var i = 0; i < 5; i++) {
    var skullIcon = {
      url: "./images/skull.png", // url
      scaledSize: new google.maps.Size(60, 60), // scaled size
      origin: new google.maps.Point(0, 0), // origin
      anchor: new google.maps.Point(25, 25) // anchor
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
  $('#content-event').addClass('hidden');
};


//  ============= game event logic

DogeApp.customInfoWindow = function(marker, data){
  // Will this work if I take out the [0]?
  var button = data.choices[0]
  DogeApp.getUserData(button)
  marker.addListener("click", function(){
    if((data.choices).length === 2) {
      $("body").prepend("<div id='content-event'>"
        + '<a href="#" aria-label="Close Account Info Modal Box" id="close">&cross;</a><br><br>'
        + "<div class='choice-title'>"
        + "<h3>"
        + data.name
        + "</h3>"
        + "</div>"
        + "<div class='choice-info'>"
        + "<br><img src='"
        + data.image_url
        + "' width='100' height='100'>"
        + data.description
        + "</div><div class='choice1'>"
        + data.choices[0]
        + "</div><div class='choice2'>"
        + data.choices[1]
        + "</div></div</div>");
      DogeApp.gameLogic();
    } else {
      $("body").prepend("<div id='content-event'>"
      + '<a href="#" aria-label="Close Account Info Modal Box" id="close">&cross;</a>'
      + "<div class='choice-title'>"
      + "<h3>"
      + data.name
      + "</h3>"
      + "</div>"
      + "<div class='choice-info'>"
      + "<br><img src='"
      + data.image_url
      + "' width='100' height='100'><div>"
      + data.description
      +"</div>"
      +"<div class='choice-list'>"
      + "<div class='choice1'>"
      + data.choices[0]
      + "</div>"
      + "<div class='choice2'>"
      + data.choices[1]
      + "</div>"
      + "<div class='choice3'>"
      + data.choices[2]
      + "</div>"
      +"</div>"
      + "</div</div>");
        DogeApp.gameLogic();
    }
  });
}


// events logic. Massive and needs to be refactored if at all possible. Sounds like future Shu work. Sucker.

DogeApp.gameLogic = function(button, data) {
  var event = DogeApp.event
  var hud = document.getElementById('hud');
  // console.log(DogeApp.user.inventory)
  if(event.event_number === 1 ) {
    $(".choice1").on("click", function() {
      var successBase = 0.5;
      var totalSuccess = successBase + 0.4 * ( (1/55) * DogeApp.user.attack );
      var damageTaken = 0;
      if(Math.random() < totalSuccess) {
        if(Math.random() > 0.7 ) {
          damageTaken = Math.ceil(10-DogeApp.user.armour + 10*Math.random());
        }
      document.getElementById('hud').innerHTML ="You have killed the zombie. You sustained " + damageTaken + " damage.";
      } else {
        if(Math.random() > 0.7 ) {
          damageTaken = Math.ceil(20-DogeApp.user.armour + 15*Math.random());
        } else {
          damageTaken = Math.ceil(30-DogeApp.user.armour + 20*Math.random());
        }

        document.getElementById('hud').innerHTML = "That was idiotic. You had to flee from the zombie. Like a scardy cat. You have taken " + damageTaken + " damage.";
      }
      DogeApp.user.health = DogeApp.user.health - damageTaken;
      DogeApp.updateUserData(DogeApp.user);
      DogeApp.checkUserDeath();
    })
    $(".choice2").on("click", function() {
      document.getElementById('hud').innerHTML = "Deciding that the situation is too risky, you walk away.";
    })
  }
  if(event.event_number === 2 ) {
    $(".choice1").on("click", function() {
      if(Math.random() > 0.10 ) {
        DogeApp.user.food = DogeApp.user.food + 25;
        DogeApp.user.water = DogeApp.user.water + 25;
        document.getElementById('hud').innerHTML = "The girl tells you that she is lost. You help her find her way back to her family by following her tracks. They were very grateful, and provided you with food and water. Food + 25, Water + 25";
      } else {
        damageTaken = Math.ceil(30-DogeApp.user.armour + 20*Math.random());
        document.getElementById('hud').innerHTML = "She looks up. Too late, you realise that she is no longer of this world. She sinks her teeth into your flesh. You have taken " + damageTaken + " damage.";
        DogeApp.user.health = DogeApp.user.health - damageTaken;
      }
      DogeApp.updateUserData(DogeApp.user);
      DogeApp.checkUserDeath();
    })
    $(".choice2").on("click", function() {
      if(Math.random() > 0.20 ) {
        document.getElementById('hud').innerHTML = "Good call. You catch a glimpse of the zombie's pale, rotten face as you cave her skull in.";
      } else {
        document.getElementById('hud').innerHTML = "You cave her skull in. She couldn't still have been human...could she?";
      }
    })
    $(".choice3").on("click", function() {
      document.getElementById('hud').innerHTML = "Deciding that the situation is too risky, you walk away."
    })
  }
  if(event.event_number === 3) {
    $(".choice1").on("click", function() {
      var itemChance = Math.ceil(Math.random()*4)
      if (item === 1) {
        DogeApp.user.food = DogeApp.user.food + 25;
        document.getElementById('hud').innerHTML = "Within the cache, you find some canned food. Food + 25";
      } else if (item === 2) {
        DogeApp.user.water = DogeApp.user.water + 25;
        document.getElementById('hud').innerHTML = "Within the cache, you find some bottles of water. Water + 25";
      } else if (item === 3) {
        DogeApp.user.attack = DogeApp.user.attack + 5;
        document.getElementById('hud').innerHTML = "Within the cache, you find a weapon. Attack + 5";
      } else {
        DogeApp.user.armour = DogeApp.user.armour + 5;
        document.getElementById('hud').innerHTML = "Within the cache, you find a kevlar vest. Armour + 5";
      }
      DogeApp.updateUserData(DogeApp.user);
    })
    $(".choice2").on("click", function() {
      document.getElementById('hud').innerHTML = "Deciding that the situation is too risky, you walk away."
    })
  }
  if(event.event_number === 4) {
    $(".choice1").on("click", function() {
      var successBase = 0.5;
      var totalSuccess = successBase + 0.4 * ( (1/55) * DogeApp.user.attack );
      var damageTaken = 0;
      if(Math.random() < totalSuccess) {
        if(Math.random() > 0.85 ) {
          damageTaken = Math.ceil(10-DogeApp.user.armour + 10*Math.random());
        }
        document.getElementById('hud').innerHTML = "You have killed your human attacker. You sustained " + damageTaken + " damage.";
        DogeApp.updateUserData(DogeApp.user);
      } else {
        if(Math.random() > 0.7 ) {
          damageTaken = Math.ceil(20-DogeApp.user.armour + 15*Math.random());
        } else {
          damageTaken = Math.ceil(30-DogeApp.user.armour + 20*Math.random());
        }
        document.getElementById('hud').innerHTML = "You were forced to run away. You have taken " + damageTaken + " damage.";
      }
      DogeApp.user.health = DogeApp.user.health - damageTaken;
      DogeApp.updateUserData(DogeApp.user);
      DogeApp.checkUserDeath();
    })
    $(".choice2").on("click", function() {
      document.getElementById('hud').innerHTML = "Deciding that the situation is too risky, you walk away.";
    })
    $(".choice3").on("click", function() {
      var chanceFound = 0.5
      if(Math.random() > chanceFound) {
        document.getElementById('hud').innerHTML = "You successfully hide from them. You wonder if you made the right call...";
      } else {
        damageTaken = Math.ceil(20-DogeApp.user.armour + 15*Math.random());
        document.getElementById('hud').innerHTML = "AHHHHHHHHHHH, they found you! RUN AWAAAAAAAAAAAY. You take " + damageTaken + " damage.";
      }
      DogeApp.user.health = DogeApp.user.health - damageTaken;
      DogeApp.updateUserData(DogeApp.user);
      DogeApp.checkUserDeath();
    })
  }
  if(event.event_number === 5) {
    $(".choice1").on("click", function() {
      document.getElementById('hud').innerHTML = "Repeat after me. You. Never. Take. Strange. Drugs. Health - 25.";
      DogeApp.user.health = DogeApp.user.health - 25;
      DogeApp.updateUserData(DogeApp.user);
      DogeApp.checkUserDeath();
    })
    $(".choice2").on("click", function() {
      document.getElementById('hud').innerHTML = "Repeat after me. You. Never. Take. Strange. Drugs. Health - 25";
      DogeApp.user.health = DogeApp.user.health - 25;
      DogeApp.updateUserData(DogeApp.user);
      DogeApp.checkUserDeath();
    })
    $(".choice3").on("click", function() {
      document.getElementById('hud').innerHTML = "You leave the drugs. Who the hell eats mystery road drugs anyway?";
    })
  }
  if(event.event_number === 6) {
    $(".choice1").on("click", function() {
      document.getElementById('hud').innerHTML = "He refuses. He states that you must learn to help yourself.";
    })
    $(".choice2").on("click", function() {
      document.getElementById('hud').innerHTML = "He shows you how to fish. A little while later, you manage to fish yourself some trout for dinner! Food + 50, Health + 20.";
      DogeApp.user.health = DogeApp.user.health + 20;
      DogeApp.user.food = DogeApp.user.food + 50;
      DogeApp.updateUserData(DogeApp.user);
    })
    $(".choice3").on("click", function() {
      document.getElementById('hud').innerHTML = "Deciding that the situation is too risky, you walk away.";
    })
  }


  //  ===== Closing buttons

  $('#content-event #close').on('click', function() {
    $('#content-event').addClass('hidden');
    $('.menu').removeClass('hidden');
  })

  $('.choice1, .choice2, .choice3').on('click', function() {
    $('#content-event').addClass('hidden');
    $('.menu').removeClass('hidden');
  })
}

$(function() {
  DogeApp.initEventHandlers();
  DogeApp.updateUI();
})
