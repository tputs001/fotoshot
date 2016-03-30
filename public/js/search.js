var search = (function(){

  //Caching the dom
  var tag = document.getElementById('tag');
  var location = document.getElementById('location');
  var form = document.getElementById('search')
  var display = document.getElementById("images")
  var exif = document.getElementById("exif")
  var exifObject;
  var collection = [];
  var parsedImages;

  //Binding Events
  form.addEventListener('submit', function(e){
    console.log("ping")
    e.preventDefault();
    ajaxInput(tag, location)
  })

  location.addEventListener('keydown', function(e){
    if(e.keyCode == 13){
      e.preventDefault();
    }
  })

  document.body.addEventListener('click', function(e){
    var target = e.target
    if(target.nodeName == "IMG") { ajaxExif(target.attributes.photoid.value, target.attributes.secret.value, e.srcElement.src) }
  })

  //Methods
  function ajaxInput(tag, location){
    var input = {
      tag: tag.value,
      location: location.value,
    }

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
        appendDom(display, data[i].url_m, "div-images", "img-responsive images", data[i].id, data[i].secret)
      }
      animate.scrollDown();
    }
  }

  function ajaxExif(photoId, secret, src){
    var xhr = new XMLHttpRequest()
    xhr.open('GET', '/exif/' + photoId +'/' + secret)
    xhr.send(null)
    xhr.onload = function(event){
      exifObject = JSON.parse(xhr.responseText)
      getExif(exifObject, src)
    }
  }

  function getExif(object, src){
    var data = object.photo.exif
    var exifImage = document.getElementById('exif-image')
    var exposure;
    var aperture;
    var iso;

    for(var i = 0; i<data.length; i++){
      if(data[i].label == "Exposure"){
        exposure = data[i].raw._content
      } else if(data[i].label == "Aperture"){
        aperture = data[i].raw._content
      } else if(data[i].label == "ISO Speed"){
        iso = data[i].raw._content
      }
    }
    appendExif(exifImage, src, exposure, iso, aperture)
  }

  function appendExif(container, src, expo, iso, apert){
    var exposure = document.getElementById('exposure')
    var isoData = document.getElementById('iso')
    var aperture = document.getElementById('aperture')
    var img = document.createElement('img');
    img.src = src
    container.appendChild(img)
    exposure.textContent = expo;
    isoData.textContent = iso;
    aperture.textContent = apert;

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
