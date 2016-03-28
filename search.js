var search = (function(){

  //Caching the dom
  var tag = document.getElementById('tag');
  var location = document.getElementById('location');
  var form = document.getElementById('search')
  var display = document.getElementById("images")

  //Binding Events
  form.addEventListener('submit', function(e){
    var test = $('.pac-item-selected').length
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
    console.log(gmap)
    var input = {
      tag: tag.value,
      location: location.value,
      latitude: gmap.lngLat.lat,
      longitude: gmap.lngLat.lng
    }

    console.log(input)

    var xhr = new XMLHttpRequest()
    xhr.open('POST', '/search')
    xhr.setRequestHeader('Content-type', 'application/json')
    xhr.send(JSON.stringify(input))
    xhr.onload = function(event){
      var parsedImages = JSON.parse(xhr.responseText)
      var data = parsedImages.photos.photo
      for(var i = 0; i<data.length; i++){
        appendDom(data[i].url_m)
      }
    }
    // gmap.lngLat.lat = undefined
    // gmap.lngLat.lng = undefined
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
