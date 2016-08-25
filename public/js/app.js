
// overwriting prototype stuff. Sorry not sorry
google.maps.Circle.prototype.contains = function(latLng) {
  return this.getBounds().contains(latLng) && google.maps.geometry.spherical.computeDistanceBetween(this.getCenter(), latLng) <= this.getRadius();
}

var DogeApp = DogeApp || {};

DogeApp.pos;
DogeApp.event;
DogeApp.user;
DogeApp.item;

var eventNumber = "";

DogeApp.API_URL = "https://zoogle.herokuapp.com/api";

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
  });
}
DogeApp.updateUserData = function(user) {
  event.preventDefault();
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
    // DogeApp.user = data;
    // $("body").prepend("<div id='content'>" + DogeApp.user.username + "<br><img src='" + DogeApp.user.image_url + "' width='100' height='100'><div>" + DogeApp.user.health + "</div><br></div>");
    var $content = $('#content');
    DogeApp.getTemplate("/user/show", { user: data }, $content);
    $content.removeClass('hidden');
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
  // event.preventDefault();
  return $.ajax({
    method: "GET",
    url: DogeApp.API_URL + "/event",
    beforeSend: DogeApp.setRequestHeader
  }).done(function(data){
    console.log(data);
    DogeApp.event = data;
    // var $content = $('#content');
    // DogeApp.getTemplate("events/show", { event: data }, $content);
    // $content.removeClass('hidden');
    DogeApp.customInfoWindow(testMarker, data);
    DogeApp.getItem();
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
  this.$content.on("submit", "form", this.handleForm);
  $(".menu a").not(".logout, .profile, .edit-user").on('click', this.loadPage);
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

    if (callback) callback();
  });
}

DogeApp.playerMarker = null;

DogeApp.setPlayerMarker = function() {
  if (DogeApp.playerMarker) {
    DogeApp.playerMarker.setPosition(DogeApp.pos);
  } else {
    DogeApp.playerMarker = new google.maps.Marker({
      position: DogeApp.pos,
      map: DogeApp.map,
      icon: {
        url: "/images/pcmarker.png",
        scaledSize: new google.maps.Size(60, 60),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(25, 25)
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
    position: {
      lat: DogeApp.pos.lat + 0.0001,
      lng: DogeApp.pos.lng - 0.0001
    },
    map: DogeApp.map,
    icon: {
      url: "https://prometheus.atlas-sys.com/download/attachments/127894715/box-icon.png",
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
  $('button').on('click', hideContent);


  function hideContent() {
    $('#content').addClass('hidden');
  };

  if (resourceCircleBoundsTest.contains(DogeApp.pos)) {
    console.log("A resource is close by.");
  };


  for (var i = 0; i < 175; i++) {

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
      radius: 25,
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
  $('#content').addClass('hidden');
};


//  ============= game event logic

DogeApp.customInfoWindow = function(marker, data){
  // Will this work if I take out the [0]?
  var button = data.choices[0]
  DogeApp.getUserData(button)
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





// events logic. Massive and needs to be refactored if at all possible. Sounds like future Shu work. Sucker.

DogeApp.gameLogic = function(button, data) {
  // $(".choice1").on("click", function() {

  // })
  var event = DogeApp.event
  var hud = document.getElementById('hud');

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
      DogeApp.user.inventory.push(DogeApp.item);

      // console.log(DogeApp.user.health);
      console.log("The user now needs clarity ", DogeApp.user.inventory);
      // DogeApp.getItem(DogeApp.user);
      DogeApp.updateUserData(DogeApp.user);
    })
    $(".choice2").on("click", function() {
      document.getElementById('hud').innerHTML = "You nope'd out of the situation. You did not manage to obtain any loot.";

    })
  }
  if(event.event_number === 2 ) {
    $(".choice1").on("click", function() {
      document.getElementById('hud').innerHTML = "Rosie gives you a delighted smile, and hands you a rose.";
    })
    $(".choice2").on("click", function() {
     document.getElementById('hud').innerHTML = "The young woman finishes up her routine and nimbly escapes the zombies. You wonder if you'll see her again...";
    })
    $(".choice3").on("click", function() {
      document.getElementById('hud').innerHTML = "You nope'd out of the situation. You did not manage to obtain any loot."
    })
  }
  if( event.event_number === 3) {
    $(".choice1").on("click", function() {
      document.getElementById('hud').innerHTML = "You get an item!";
    })
    $(".choice2").on("click", function() {
      document.getElementById('hud').innerHTML = "You nope'd out of the situation. You did not manage to obtain any loot."
    })
  }
  if( event.event_number === 6) {
    $(".choice1").on("click", function() {
      var successBase = 0.5;
      var totalSuccess = successBase + 0.4 * ( (1/55) * DogeApp.user.attack );
      var damageTaken = 0;
      if(Math.random() < totalSuccess) {
        if(Math.random() > 0.85 ) {
          damageTaken = Math.ceil(10-DogeApp.user.armour + 10*Math.random());
        }
        document.getElementById('hud').innerHTML = "You have killed the other human. Oh the horrow! The hu-manatee!. You sustained " + damageTaken + " damage.";
      } else {
        if(Math.random() > 0.7 ) {
          damageTaken = Math.ceil(20-DogeApp.user.armour + 15*Math.random());
        } else {
          damageTaken = Math.ceil(30-DogeApp.user.armour + 20*Math.random());
        }
        document.getElementById('hud').innerHTML = "You had to run away. You are sad. Sadface. :(. You have taken " + damageTaken + " damage.";
      }
      DogeApp.user.health = DogeApp.user.health - damageTaken;
      console.log(DogeApp.user.health);
    })
    $(".choice2").on("click", function() {
      document.getElementById('hud').innerHTML = "You nope'd out of the situation. You did not manage to obtain any loot.";
    })
    $(".choice3").on("click", function() {
      var chanceFound = 0.5
      if(Math.random() > chanceFound) {
        document.getElementById('hud').innerHTML = "You successfully hide from them. You wonder if you made the right call...";
      } else {
        damageTaken = Math.ceil(20-DogeApp.user.armour + 15*Math.random());
        document.getElementById('hud').innerHTML = "AHHHHHHHHHHH, they found you! RUN AWAAAAAAAAAAAY. You take " + damageTaken + " damage.";
      }
    })
  }
  if( event.event_number === 7) {
    $(".choice1").on("click", function() {
      document.getElementById('hud').innerHTML = "The zombie looks sad. A single, zombified tear falls majestically down its cheek.";
    })
    $(".choice2").on("click", function() {
      document.getElementById('hud').innerHTML = "Wow. That was mean. I hope this doesn't happen in the presentation...";//neon easter egg?
    })
    $(".choice3").on("click", function() {
      document.getElementById('hud').innerHTML = "YOYOYOSUP! You receive an item!";
    })
  }
  if( event.event_number === 8) {
    $(".choice1").on("click", function() {
      document.getElementById('hud').innerHTML = "Kids - never do drugs. They're bad and tasty.";
      DogeApp.user.health = DogeApp.user.health - 25;
      console.log(DogeApp.user.health);
    })
    $(".choice2").on("click", function() {
      document.getElementById('hud').innerHTML = "Kids - never do drugs. They're bad and tasty.";
      DogeApp.user.health = DogeApp.user.health - 25;
      console.log(DogeApp.user.health);

    })
    $(".choice3").on("click", function() {
      document.getElementById('hud').innerHTML = "Correct. But they sure are tasty though...";
    })
  }
  if( event.event_number === 9) {
    $(".choice1").on("click", function() {
      document.getElementById('hud').innerHTML = "Ahh, welcome. I see you're a fan of mass murder too. I like your style. Have an item.";
    })
    $(".choice2").on("click", function() {
      document.getElementById('hud').innerHTML = "As I'm coding this, Shu always wins. WELCOME TO MY SHUTOPIA!";
      DogeApp.user.health = DogeApp.user.health - 9999999;
      console.log(DogeApp.user.health);
    })
    $(".choice3").on("click", function() {
      document.getElementById('hud').innerHTML = "Ignore eh? This feels just like my interaction with my parents growing up. Sadface.";
    })
  }
  if( event.event_number === 10) {
    $(".choice1").on("click", function() {
      document.getElementById('hud').innerHTML = "Slightly awkwardly, you take the armour from him. You quickly beat a retreat when he starts telling you about his bank robbing past.";
    })
    $(".choice2").on("click", function() {
      document.getElementById('hud').innerHTML = "You cannot hope to beat a man with a shit ton of armour. AND a shopping trolley.";
      DogeApp.user.health = DogeApp.user.health - 9999999;
      console.log(DogeApp.user.health);
    })
    $(".choice3").on("click", function() {
      document.getElementById('hud').innerHTML = ":(";
    })
  }
  if( event.event_number === 11) {
    $(".choice1").on("click", function() {
      document.getElementById('hud').innerHTML = "You try to think of something to say to distract from Leeds. Your brain betrays you and you mention Leeds again. In small talk. The worst kind of talk. Apart from the one that your significant other wants to have with you. Dear god, he is still going on about Leeds...";
    })
    $(".choice2").on("click", function() {
      document.getElementById('hud').innerHTML = "You can see the 'North of the wall' Wildling rage as he brings the full force of his fury and indignation and Northern-ness down on you.";
      DogeApp.user.health = DogeApp.user.health - 9999999;
      console.log(DogeApp.user.health);
    })
    $(".choice3").on("click", function() {
      document.getElementById('hud').innerHTML = ":(";
    })
  }
  if( event.event_number === 12) {
    $(".choice1").on("click", function() {
      document.getElementById('hud').innerHTML = "KWAAAAAAAAAAAAAAAAK"; // should be a wav file for surprise. Bex - looking at you...
    })
    $(".choice2").on("click", function() {
      document.getElementById('hud').innerHTML = "You never mess with a Kiwi's kebab...";
      DogeApp.user.health = DogeApp.user.health - 9999999;
      console.log(DogeApp.user.health);
    })
    $(".choice3").on("click", function() {
      document.getElementById('hud').innerHTML = ":(";
    })
  }
  if( event.event_number === 13) {
    $(".choice1").on("click", function() {
      document.getElementById('hud').innerHTML = "BEFORE YOU GO GO";
    })
    $(".choice2").on("click", function() {
      document.getElementById('hud').innerHTML = "That's a bad mistake. You should never take Json's cocktails...";
      DogeApp.user.health = DogeApp.user.health - 9999999;
      console.log(DogeApp.user.health);
    })
    $(".choice3").on("click", function() {
      document.getElementById('hud').innerHTML = ":(";
    })
  }
  if( event.event_number === 14) {
    $(".choice1").on("click", function() {
      document.getElementById('hud').innerHTML = "No. You must learn to help yourself.";
    })
    $(".choice2").on("click", function() {
      document.getElementById('hud').innerHTML = "He shows you how to fish. A little while later, you manage to fish out this item!";
    })
    $(".choice3").on("click", function() {
      document.getElementById('hud').innerHTML = ":(";
    })
  }
  if( event.event_number === 15) {
    $(".choice1").on("click", function() {
      document.getElementById('hud').innerHTML = "Something something Doge, something something meme. Giphy.";
    })
    $(".choice2").on("click", function() {
      document.getElementById('hud').innerHTML = "Hey - nice style. Have an item!";
    })
    $(".choice3").on("click", function() {
      document.getElementById('hud').innerHTML = ":(";
    })
  }
  if( event.event_number === 16) {
    $(".choice1").on("click", function() {
      document.getElementById('hud').innerHTML = "He nods and throws you an item!";
    })
    $(".choice2").on("click", function() {
      document.getElementById('hud').innerHTML = "Oh noes. You woke the dragon. You have no defence against his onslaught";
      DogeApp.user.health = DogeApp.user.health - 9999999;
      console.log(DogeApp.user.health);
    })
    $(".choice3").on("click", function() {
      document.getElementById('hud').innerHTML = ":(";
    })
  }
  if( event.event_number === 17) {
    $(".choice1").on("click", function() {
      document.getElementById('hud').innerHTML = "Hey, how's it going? Have an item.";
    })
    $(".choice2").on("click", function() {
      document.getElementById('hud').innerHTML = "My chair? It's mine. DON'T TRY TO STEAL IT!";
      DogeApp.user.health = DogeApp.user.health - 9999999;
      console.log(DogeApp.user.health);
    })
    $(".choice3").on("click", function() {
      document.getElementById('hud').innerHTML = ":(";
    })
  }
  if( event.event_number === 18) {
    $(".choice1").on("click", function() {
      document.getElementById('hud').innerHTML = "Thank you for the advice - here, have this item.";
    })
    $(".choice2").on("click", function() {
      document.getElementById('hud').innerHTML = "She runs away, screaming 'Stranger danger! Stranger dangerrrrrrrrr!";
    })
    $(".choice3").on("click", function() {
      document.getElementById('hud').innerHTML = ":(";
    })
  }
  if( event.event_number === 19) {
    $(".choice1").on("click", function() {
      document.getElementById('hud').innerHTML = "Nice punt. Have an item";
    })
    $(".choice2").on("click", function() {
      document.getElementById('hud').innerHTML = "Hey - no touching!";
      DogeApp.user.health = DogeApp.user.health - 9999999;
      console.log(DogeApp.user.health);
    })
    $(".choice3").on("click", function() {
      document.getElementById('hud').innerHTML = ":(";
    })
  }
  if( event.event_number === 20) {
    $(".choice1").on("click", function() {
      document.getElementById('hud').innerHTML = "Hah, just joking! You run away.";
    })
    $(".choice2").on("click", function() {
      document.getElementById('hud').innerHTML = "Well, why not? You're already here. After you drink the coffee, you bolt.";
      DogeApp.user.health = DogeApp.user.health + 10;
      console.log(DogeApp.user.health);
    })
    $(".choice3").on("click", function() {
      document.getElementById('hud').innerHTML = "You back away slowly, then run when you have the chance.";
    })
  }
  if( event.event_number === 21) {
    $(".choice1").on("click", function() {
      document.getElementById('hud').innerHTML = "You need to be wary. Have this item to shield you against them";
    })
    $(".choice2").on("click", function() {
      document.getElementById('hud').innerHTML = "Ahhhhh! Dieeeee!";
      DogeApp.user.health = DogeApp.user.health - 99999;
      console.log(DogeApp.user.health);
    })
    $(".choice3").on("click", function() {
      document.getElementById('hud').innerHTML = ":(";
    })
  }
  if( event.event_number === 22) {
    $(".choice1").on("click", function() {
      document.getElementById('hud').innerHTML = "He doesn't say a word.";
    })
    $(".choice2").on("click", function() {
      document.getElementById('hud').innerHTML = "He doesn't say a word. But he beats you to death.";
      DogeApp.user.health = DogeApp.user.health - 99999;
      console.log(DogeApp.user.health);
    })
    $(".choice3").on("click", function() {
      document.getElementById('hud').innerHTML = "He doesn't say a word.";
    })
  }
  if( event.event_number === 23) {
    $(".choice1").on("click", function() {
      document.getElementById('hud').innerHTML = "Hey, you're alright. Have this item.";
    })
    $(".choice2").on("click", function() {
      document.getElementById('hud').innerHTML = "Ignore my invitation, eh? Die!";
      DogeApp.user.health = DogeApp.user.health - 99999;
      console.log(DogeApp.user.health);
    })
    $(".choice3").on("click", function() {
      document.getElementById('hud').innerHTML = ":(";
    })
  }
  if( event.event_number === 24) {
    $(".choice1").on("click", function() {
     document.getElementById('hud').innerHTML = "Oui. Baguette. Bibliotheque. Bonjour. Other French words. Have an item.";
    })
    $(".choice2").on("click", function() {
      document.getElementById('hud').innerHTML = "This man is mesmerizing. You watch his sexy French dance of death.";
    })
    $(".choice3").on("click", function() {
      document.getElementById('hud').innerHTML = ":(";
    })
  }
  if( event.event_number === 25) {
    $(".choice1").on("click", function() {
      document.getElementById('hud').innerHTML = "Hey, you're alright. Have this item.";
    })
    $(".choice2").on("click", function() {
      document.getElementById('hud').innerHTML = "He continues to chop off heads. You're not sure how you feel about this situation.";
    })
    $(".choice3").on("click", function() {
      document.getElementById('hud').innerHTML = ":(";
    })
  }
  // missing Ed, Toni

  $('#content #close').on('click', function() {
    $('#content').addClass('hidden');
  })

  $('.choice1, .choice2, .choice3').on('click', function() {
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
