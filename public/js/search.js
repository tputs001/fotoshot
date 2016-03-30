var search = (function(){

  //Caching the dom
  var tag = document.getElementById('tag');
  var location = document.getElementById('location');
  var form = document.getElementById('search')
  var display = document.getElementById("images")
  var collection = [];
  var parsedImages;

  //Binding Events
  form.addEventListener('submit', function(e){
    console.log("ping")
    e.preventDefault();
    sendInput(tag, location)
  })

  location.addEventListener('keydown', function(e){
    if(e.keyCode == 13){
      e.preventDefault();
    }
  })

  document.body.addEventListener('click', function(e){
    var target = e.target
    if(target.nodeName == "IMG") { getImage(target.attributes.photoid.value, target.attributes.secret.value) }
  })

  //Methods
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
      collection = _.sortBy(data, function(obj){return parseInt(obj.views)}).reverse()
      gmap.getImages(collection)
      for(var i = 0; i<collection.length; i++){
        console.log(collection[i])
        appendDom(display, data[i].url_m, "div-images", "img-responsive images", data[i].id, data[i].secret)
      }
      animate.scrollDown();
    }
  }

  function getImage(photoId, secret){
    var xhr = new XMLHttpRequest()
    xhr.open('GET', '/exif/' + photoId +'/' + secret)
    xhr.send(null)
    xhr.onload = function(event){
      console.log(xhr.responseText)
    }
  }

  function appendDom(container, src, divClass, imgClass, photoId, secret){
    var div =  document.createElement('div');
    var img = document.createElement('img')
    div.className = divClass
    img.className= imgClass
    img.setAttribute('photoId', photoId)
    img.setAttribute('secret', secret)
    img.src = src
    div.appendChild(img)
    container.appendChild(div)
  }

  function clearDom(clearId){
    while(clearId.hasChildNodes()){
      clearId.removeChild(clearId.lastChild)
    }
}

  return {
    appendDom : appendDom,
    clearDom : clearDom
  }

})()
