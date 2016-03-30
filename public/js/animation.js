var animate = (function(){
  var boolean = true;

  function scrollDown(){
    $('body').animate({
        scrollTop: $('#img-container').offset().top
    }, 500);
  }

  function toggleMap(e){
    $('#map-container').slideToggle(1000, function(){
      gmap.initMap();
    })
    if(boolean){
      $('html').css('overflow', 'hidden');
      boolean = false;
    } else {
      $('html').css('overflow', 'auto');
      boolean = true;
    }
    e.stopPropagation();
  }

  return {
    scrollDown : scrollDown,
    toggleMap : toggleMap
  }

})()
