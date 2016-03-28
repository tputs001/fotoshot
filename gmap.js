var gmap = (function(){
  var location = document.getElementById('location');
  var imageArray = []
  var map;
  var lngLat = {}

  function pushData(data){
    imageArray.push(data)
  }

  function showArray(){
    console.log(imageArray)
  }

  function initMap(){
      map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 37.09024, lng: -95.71289},
      scrollwheel: false,
      zoom: 4
    });

    var options ={types: ['(regions)'] }
    var autocomplete = new google.maps.places.Autocomplete(location, options)
    autocomplete.addListener('place_changed', function(){
      console.log("autocomplete")
      var place = autocomplete.getPlace();
      lngLat.lat = place.geometry.location.lat()
      lngLat.lng = place.geometry.location.lng()
    })

    google.maps.event.addDomListener(location,'keydown',function(e){
      if(e.keyCode===13 && $('.pac-item-selected').length == 0){
        google.maps.event.trigger(this,'keydown',{keyCode:40})
      }
    });
  }

  return {
    initMap : initMap,
    lngLat : lngLat,
    pushData : pushData,
    showArray: showArray
  }

})()
