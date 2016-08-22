var ready = $(function() {
  $(".menu").hide();
  $(".hamburger").click(function() {
    $(".menu").slideToggle("slow", function() {
    });
  });
});

ready;

var map = new google.maps.Map(document.getElementById('map'), 
{
  center: { lat: 51.5080072, lng: -0.1019284 },
  zoom: 14,
  styles: [{"featureType":"all","elementType":"labels.text.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"color":"#000000"},{"lightness":13}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#000000"}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#144b53"},{"lightness":14},{"weight":1.4}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#08304b"}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#0c4152"},{"lightness":5}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#000000"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#0b434f"},{"lightness":25}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"color":"#000000"}]},{"featureType":"road.arterial","elementType":"geometry.stroke","stylers":[{"color":"#0b3d51"},{"lightness":16}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#000000"}]},{"featureType":"transit","elementType":"all","stylers":[{"color":"#146474"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#021019"}]}]
});

map.addListener('click', function(e) {
  var marker = new google.maps.Marker({
    position: e.latLng,
    map: map, 
    animation: google.maps.Animation.BOUNCE,
    icon: "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png"
  });

    marker.addListener('click', function() {
      this.setAnimation(null);
    });
  });

navigator.geolocation.getCurrentPosition(function(position) {
 var marker = new google.maps.Marker({
    position: { lat: position.coords.latitude, lng: position.coords.longitude },
  map: map,
  animation: google.maps.Animation.DROP,
  icon: "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
  });

 map.panTo(marker.getPosition());
 map.setZoom(17);
});

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
    strokeWeight: 4,
    // fillColor: '#FF0000',
    // fillOpacity: 0.35,
    map: map,
    bounds: {
      north: 51.518263,
      south: 51.511883,
      east: -0.061775,
      west: -0.084863
    }
  });