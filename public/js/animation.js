var animate = (function(){
  var boolean = true;
  var toToggle = true;
  var hidden = true;

  function scrollDown(e, id){
    e.preventDefault()
    $('body').animate({
        scrollTop: $(id).offset().top
    }, 500);
  }

  function toggleMap(e){
    e.preventDefault()
    $('#map-container').slideToggle(1000)
    if(toToggle){
      gmap.initMap();
      gmap.initMarker();
      toToggle = false
    }

    if(boolean){
      $('html').css('overflow', 'hidden');
      boolean = false;
    } else {
      $('html').css('overflow', 'auto');
      boolean = true;
    }
  }

  function setToggle(boolean){
    toToggle = boolean;
  }

  function imageHover(markerPosition, map){
    $('.map-images').hover(
      function() {
        var index = $('.map-images').index(this);
        var coordinate = {
          lat: markerPosition[index].position.lat(),
          lng: markerPosition[index].position.lng()
        }
        markerPosition[index].setIcon('../img/greenpin.png');
        zoomIn(map, coordinate)
      },
      function() {
        var index = $('.map-images').index(this);
        markerPosition[index].setIcon('../img/redpin.png');
        gmap.extendBounds(map)
      }
    )
  }

  function toggleHidden(id){
    if(hidden){
      hidden=  false;
      $(id).removeClass('hidden')
    } else {
      hidden = true;
      $(id).addClass('hidden')
    }
  }

  function zoomIn(map, coordinate){
    map.setZoom(11);
    map.panTo(coordinate)
  }


  return {
    scrollDown : scrollDown,
    toggleMap : toggleMap,
    imageHover : imageHover,
    setToggle : setToggle,
    toggleHidden : toggleHidden
  }

})()
