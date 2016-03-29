var gmap = (function(){
  var location = document.getElementById('location');
  var markerPosition = [];
  var map;

  function initMap(){
      map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 37.09024, lng: -95.71289},
      scrollwheel: false,
      zoom: 4
    });

    var options ={types: ['(regions)'] }
    var autocomplete = new google.maps.places.Autocomplete(location, options)

    autocomplete.addListener('place_changed', function(){
      console.log("triggered?")
    })

    google.maps.event.addDomListener(location,'keydown',function(e){
      if(e.keyCode===13 && $('.pac-item-selected').length == 0){
        google.maps.event.trigger(this,'keydown',{keyCode:40})
      }
    });
  }

  function setMarkers(lat, lng){
    var myLatlng = new google.maps.LatLng(lat, lng)
    var marker = new google.maps.Marker({
      position: myLatlng,
      title: "hello world!"
    })
    markerPosition.push(marker.position)
    marker.setMap(map)
  }

  function extendBounds(){
    var latlngBounds = new google.maps.LatLngBounds()
    for(var i =0; i < markerPosition.length; i++){
      latlngBounds.extend(markerPosition[i])
    }
    map.setCenter(latlngBounds.getCenter());
    map.fitBounds(latlngBounds);
  }


  return {
    initMap : initMap,
    setMarkers: setMarkers,
    extendBounds: extendBounds
  }

})()
