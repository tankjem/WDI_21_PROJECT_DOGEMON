// function generateRandomLong() {
//     var num = (Math.random()*180).toFixed(3);
//     var posorneg = Math.floor(Math.random());
//     if (posorneg == 0) {
//         num = num * -1;
//     }
//     console.log("Lng = " + num);
//     return num;
// }
//
// function generateRandomLat() {
//     var num = (Math.random()*90).toFixed(3);
//     var posorneg = Math.floor(Math.random());
//     if (posorneg == 0) {
//         num = num * -1;
//     }
//     console.log("Lat = " + num);
//     return num;
// }
//
// function randomIntFromInterval(min,max) {
//   return Math.floor(Math.random()*(max-min+1)+min);
// }
//
// function getRandomPosition() {
//
//   var marker = new google.maps.Marker({
//     position: { lat: generateRandomLat(), lng: generateRandomLong() },
//     map: map,
//     animation: google.maps.Animation.DROP,
//     icon: "resource" + randomIntFromInterval(1,4) + ".png"
//   });
//
//   map.panTo(marker.getPosition());
//   map.setZoom(15);
// }
//
//
// window.setInterval(function(){
//   getRandomPosition();
// }, 500);
