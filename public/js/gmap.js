var gmap = (function(){
  var location = document.getElementById('location');
  var mapButton = document.getElementById('mapButton')
  var display = document.getElementById('map-images')
  var rightPanel = document.getElementById("right-panel")
  var markerObject = [];
  var markerPosition = [];
  var markerTracker = [];
  var latLng = {};
  var map;

  //Methods
  function initMap(id="map"){
      map = new google.maps.Map(document.getElementById(id), {
      center: {lat: 34.0522, lng: -118.2437},
      zoom: 12,
      zoomControl: true,
      zoomControlOptions: {
          position: google.maps.ControlPosition.RIGHT_BOTTOM
      },
    });
    var options ={types: ['(regions)'] }
    var autocomplete = new google.maps.places.Autocomplete(location, options)
    google.maps.event.addDomListener(location,'keydown',function(e){
      if(e.keyCode===13 && $('.pac-item-selected').length == 0){
        google.maps.event.trigger(this,'keydown',{keyCode:40})
      }
    });
  }

  function initMarker(){
    if(markerObject.length !== 0){
      markerTracker = [];
      utility.clearDom(display)
      for(var i = 0; i<markerObject[0].length; i++){
        setMarkers(markerObject[0][i].latitude, markerObject[0][i].longitude)
        image.appendImg(display, markerObject[0][i].url_m, "div-images", "img-responsive map-images", markerObject[0][i].id, markerObject[0][i].secret, markerObject[0][i].latitude, markerObject[0][i].longitude, markerObject[0][i].url_l)
      }
      animate.imageHover(markerTracker, map)
      extendBounds(map)
    }
  }

  function initDirection(){
    var directionsDisplay = new google.maps.DirectionsRenderer;
    var directionsService = new google.maps.DirectionsService;
    var currentPos;
    utility.clearDom(rightPanel)
    directionsDisplay.setMap(map);
    directionsDisplay.setPanel(rightPanel);

    function calculateAndDisplayRoute(directionsService, directionsDisplay, currentPos) {
      directionsService.route({
        origin: currentPos,
        destination: latLng,
        travelMode: google.maps.TravelMode.DRIVING
      }, function(response, status){
        if(status === google.maps.DirectionsStatus.OK){
          directionsDisplay.setDirections(response)
        } else {
          alert("Unfortunately, this is on another continent.")
        }
      });
    }

    var getDirections = new Promise(
      function(resolve, reject){
        var infoWindow = new google.maps.InfoWindow({map : map});
        if(navigator.geolocation){
          navigator.geolocation.getCurrentPosition(function(position){
            var currentPos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            infoWindow.setPosition(currentPos)
            infoWindow.setContent("You are here!")
            map.setCenter(currentPos)
            resolve(currentPos)
          })
        } else {
          alert("Something went wrong."))
        }
      }
    )
    getDirections.then(function(currentPos){
      calculateAndDisplayRoute(directionsService, directionsDisplay, currentPos);
    })
  }

  function setMarkers(lat, lng){
    var myLatlng = new google.maps.LatLng(lat, lng)
    var marker = new google.maps.Marker({
      position: myLatlng,
      title: "images!",
      map: map,
      icon: {url:"./img/redpin.png"}
    })
    markerPosition.push(marker.position)
    markerTracker.push(marker)
  }

  function grabImages(data){
    markerObject = [];
    markerObject.push(data)
  }

  function getGeo(lat, lng){
   latLng = {
      lat : parseFloat(lat),
      lng : parseFloat(lng)
    }
  }

  function extendBounds(map){
    var latlngBounds = new google.maps.LatLngBounds()
    for(var i =0; i < markerPosition.length; i++){
      latlngBounds.extend(markerPosition[i])
    }
    map.setCenter(latlngBounds.getCenter());
    map.fitBounds(latlngBounds);
  }

  function mapModal(){
    $('#myModal').modal('hide')
    $('#mapModal').on('shown.bs.modal', function(){
      $('body').addClass('modal-open');
      initMap('left-panel');
      initDirection();
      $(this).off('shown.bs.modal')
    })
  }

  return {
    initMap : initMap,
    initMarker : initMarker,
    mapModal : mapModal,
    getGeo : getGeo,
    setMarkers: setMarkers,
    grabImages: grabImages,
    extendBounds : extendBounds,
  }

})()
