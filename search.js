var search = (function(){

  //Caching the dom
  var tag = document.getElementById('tag');
  var location = document.getElementById('location');
  var form = document.getElementById('search')
  var display = document.getElementById("images")
  var parsedImages;

  //Binding Events
  form.addEventListener('submit', function(e){
    e.preventDefault();
    sendInput(tag, location)
  })

  location.addEventListener('keydown', function(e){
    if(e.keyCode == 13){
      e.preventDefault();
    }
  })

  //methods
  function sendInput(tag, location){
    var input = {
      tag: tag.value,
      location: location.value,
    }
    console.log(input)

    var xhr = new XMLHttpRequest()
    xhr.open('POST', '/search')
    xhr.setRequestHeader('Content-type', 'application/json')
    xhr.send(JSON.stringify(input))
    xhr.onload = function(event){
      parsedImages = JSON.parse(xhr.responseText)
      var data = parsedImages.photos.photo
      var collection = _.sortBy(data, function(obj){return parseInt(obj.views)}).reverse()
      for(var i = 0; i<collection.length; i++){
        console.log(collection[i].views)
        appendDom(data[i].url_m)
        gmap.setMarkers(data[i].latitude, data[i].longitude)
      }
      gmap.extendBounds()
      scrolling()
    }
  }

  function scrolling(){
    $('body').animate({
        scrollTop: $('#images').offset().top
    }, 500);
  }

  function appendDom(src){
    var div =  document.createElement('div');
    var img = document.createElement('img')
    div.className = "div-images"
    img.className= "img-responsive images"
    img.src = src
    div.appendChild(img)
    display.appendChild(div)
  }
})()
