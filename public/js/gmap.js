var gmap = (function(){
  var location = document.getElementById('location');
  var mapButton = document.getElementById('mapButton')
  var display = document.getElementById('map-images')
  var markerObject = [];
  var markerPosition = [];
  var markerTracker = [];
  var map;

  //Binding Events
  mapButton.addEventListener('click', function(e){
    e.preventDefault()
    animate.toggleMap()
  })

  //Methods
  function initMap(){
      map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 37.09024, lng: -95.71289},
      zoom: 12,
      zoomControl: true,
      zoomControlOptions: {
          position: google.maps.ControlPosition.RIGHT_BOTTOM
      },
    });
    console.log("initMap Ran")
    var options ={types: ['(regions)'] }
    var autocomplete = new google.maps.places.Autocomplete(location, options)

    if(markerObject.length !== 0){
      markerTracker = [];
      utility.clearDom(display)
      for(var i = 0; i<markerObject[0].length; i++){
        setMarkers(markerObject[0][i].latitude, markerObject[0][i].longitude)
        image.appendImg(display, markerObject[0][i].url_l, "div-images", "img-responsive map-images", markerObject[0][i].id, markerObject[0][i].secret)
      }
      animate.imageHover(markerTracker, map)
      extendBounds(map)
    }

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
      title: "hello world!",
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

  function extendBounds(map){
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
    grabImages: grabImages,
    extendBounds : extendBounds
  }

})()
