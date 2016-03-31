var search = (function(){

  //Caching the dom
  var tag = document.getElementById('tag');
  var location = document.getElementById('location');
  var form = document.getElementById('search')
  var display = document.getElementById("images")
  var exifList = document.getElementById('list')
  var collection = [];
  var parsedImages;

  //Binding Events
  form.addEventListener('submit', function(e){
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
        appendDom(display, collection[i].url_l, "div-images", "img-responsive images", collection[i].id, collection[i].secret)
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
    var exifObject = {}

    for(var i = 0; i<data.length; i++){
      if(data[i].label == "Image Description"){ exifObject.description = data[i].raw._content }
      if(data[i].label == "Creator"){ exifObject.author = data[i].raw._content }
      if(data[i].label == "Make"){ exifObject.make = data[i].raw._content }
      if(data[i].label == "Model"){ exifObject.model = data[i].raw._content }
      if(data[i].label == "Exposure"){ exifObject.shutter = data[i].raw._content }
      if(data[i].label == "Aperture"){ exifObject.aperture = data[i].raw._content }
      if(data[i].label == "ISO Speed"){ exifObject.iso = data[i].raw._content }
    }

    clearDom(exifList)
    clearDom(exifImage)
    appendExif(exifImage, src, exifObject)
  }

  function appendExif(container, src, exifObject){
    var img = document.createElement('img');
    img.src = src
    img.className = "image-lg"
    container.appendChild(img)
    for (var key in exifObject) {
      var li = document.createElement('li');
      var listText = document.createTextNode(capitalizeFirstLetter(key) + ': ' + exifObject[key])
      li.className = "list-group-item"
      li.appendChild(listText)
      exifList.appendChild(li)
    }
  }

  function appendDom(container, src, divClass, imgClass, photoId, secret){
    var div =  document.createElement('div');
    var img = document.createElement('img')
    div.className = divClass
    img.className= imgClass
    img.setAttribute('photoId', photoId)
    img.setAttribute('secret', secret)
    img.setAttribute('data-toggle', 'modal')
    img.setAttribute('data-target', '#myModal')
    img.src = src

    div.appendChild(img)
    container.appendChild(div)
  }

  function clearDom(clearId){
    while(clearId.hasChildNodes()){
      clearId.removeChild(clearId.lastChild)
    }
  }

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  return {
    appendDom : appendDom,
    clearDom : clearDom
  }

})()
