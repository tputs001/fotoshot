var animate = (function(){
  function scrollDown(){
    $('body').animate({
        scrollTop: $('#img-container').offset().top
    }, 500);
  }

  function toggleMap(e){
    $('#map-container').slideToggle(1000, function(){
      gmap.initMap();
    });
    e.stopPropagation();
  }

  return {
    scrollDown : scrollDown,
    toggleMap : toggleMap
  }

})()
