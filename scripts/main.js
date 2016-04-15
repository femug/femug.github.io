'use strict';

var map;
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 3
  });
  setCoords(map, 'Brasil');
  fetchData();
}

function setCoords(gmaps_map, map_location) {
  var geocoder =  new google.maps.Geocoder();
  geocoder.geocode( { 'address': map_location}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      var center = new google.maps.LatLng(results[0].geometry.location.lat(), results[0].geometry.location.lng());
      gmaps_map.panTo(center);
    } else {
      alert("Something got wrong: " + status);
    }
  });
}

function fetchData() {
  var contentString = '';
  fetch('https://cdn.rawgit.com/femug/femug/20160414_2/femug-list.json')
    .then(function(response) {
      var contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        return response.json()
          .then(function(json) {
            json.femug.map(function(item, index) {
              contentString = ''+
                '<div id="content">'+
                '  <div id="siteNotice"></div>'+
                '  <h1 id="firstHeading" class="firstHeading"><a href="'+ item.url +'" target="_blank">'+ item.name +'</a></h1>'+
                '  <h2>'+ item.host_city +'</h2>'+
                '  <div id="bodyContent">'+
                '    <ul>'+
                '      <li><a href="'+ item.url +'" target="_blank">'+ item.url +'</a></li>'+
                '      <li><a href="'+ item.host_form +'" target="_blank">Host form</a></li>'+
                '      <li><strong>Founder:</strong> '+ item.founder +'</li>'+
                '      <li><strong>Moderators: </strong>'+
                '        <ul><li>'+
                '          '+ item.moderators +
                '        </li></ul>'+
                '      </li>'+
                '    </ul>'+
                '  </div>'+
                '</div>';

                var infowindow = new google.maps.InfoWindow({
                  content: contentString
                });

                var marker = new google.maps.Marker({
                  position: {
                    lat: parseFloat(item.geo.lat),
                    lng: parseFloat(item.geo.lng)
                  },
                  map: map,
                  title: item.name
                });

                marker.addListener('click', function() {
                  infowindow.open(map, marker);
                });

            });
          });
      } else {
        console.log("Problem fetching JSON!");
      }
    });
}
