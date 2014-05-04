/**
 * Created by user on 4/6/14.
 */

function initialize() {
    var map_canvas = document.getElementById('zemljevid');
    var lat= parseFloat(document.getElementById("lat1").innerHTML);
    var lng= parseFloat(document.getElementById("lng1").innerHTML);

    var LatLng = new google.maps.LatLng(lat, lng);
    var map_options = {
        center: LatLng,
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    var map = new google.maps.Map(map_canvas, map_options)

     var marker = new google.maps.Marker({
      position: LatLng,
      map: map
  });

}
google.maps.event.addDomListener(window, 'load', initialize);
