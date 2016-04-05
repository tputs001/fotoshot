var image = (function(){

  //Caching the dom
  var tag = document.getElementById('tag');
  var location = document.getElementById('location');
  var form = document.getElementById('search');
  var display = document.getElementById("images");
  var exifList = document.getElementById('list');
  var exifImage = document.getElementById('exif-image')
  var shutter = document.getElementById("shutter")
  var aperture = document.getElementById("aperture")
  var model = document.getElementById("model")
  var iso = document.getElementById("iso")
  var author = document.getElementById("author")

  //Binding Events
  form.addEventListener('submit', function(e){
    e.preventDefault();
    ajaxInput(tag, location)
  })

  document.body.addEventListener('click', function(e){
    var target = e.target
    if(target.nodeName == "IMG") {
      ajaxExif(target.attributes.photoid.value, target.attributes.secret.value, e.srcElement.src);
      gmap.getGeo(target.attributes.lat.value, target.attributes.lng.value);
    }
    if(target.textContent == "Directions"){ mapModal() }
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
      utility.clearDom(display)
      var parsedImages = JSON.parse(xhr.responseText)
      var collection = _.sortBy(parsedImages.photos.photo, function(obj){return parseInt(obj.views)}).reverse()
      for(var i = 0; i<collection.length; i++){
        appendImg(display, collection[i].url_l, "div-images", "img-responsive images", collection[i].id, collection[i].secret, collection[i].latitude, collection[i].longitude)
      }
      gmap.grabImages(collection)
      animate.setToggle(true)
      gmap.initMap();
      gmap.initMarker();
      animate.scrollDown();
    }
  }

  function appendImg(container, src, divClass, imgClass, photoId, secret, lat, lng){
    var div =  document.createElement('div');
    var img = document.createElement('img')
    div.className = divClass
    img.className= imgClass
    img.setAttribute('photoId', photoId)
    img.setAttribute('secret', secret)
    img.setAttribute('lat', lat)
    img.setAttribute('lng', lng)
    img.setAttribute('data-toggle', 'modal')
    img.setAttribute('data-target', '#myModal')
    img.src = src
    div.appendChild(img)
    container.appendChild(div)
  }

  function ajaxExif(photoId, secret, src){
    var xhr = new XMLHttpRequest()
    xhr.open('GET', '/exif/' + photoId +'/' + secret)
    xhr.send(null)
    xhr.onload = function(event){
      var object = JSON.parse(xhr.responseText)
      if(object.stat == "fail"){
        getExif("fail", src)
      } else {
        getExif(object, src)
      }
    }
  }

  function getExif(object, src){
    if(object == "fail"){
      var exifObject = {
        model : "Not Available",
        shutter: "Not Available",
        aperture: "Not Available",
        iso: "Not Available",
        author: "Not Available",
      }
    } else {
      var data = object.photo.exif
      var exifObject = {}
      for(var i = 0; i<data.length; i++){
        if(data[i].label == "Creator"){ exifObject.author = data[i].raw._content }
        if(data[i].label == "Model"){ exifObject.model = data[i].raw._content }
        if(data[i].label == "Exposure"){ exifObject.shutter = data[i].raw._content }
        if(data[i].label == "Aperture"){ exifObject.aperture = "F/" + data[i].raw._content }
        if(data[i].label == "ISO Speed"){ exifObject.iso = data[i].raw._content }
      }
    }

    utility.clearDom(exifList)
    utility.clearDom(exifImage)
    appendExif(exifImage, src, exifObject)
  }

  function appendExif(container, src, exifObject){
    var img = document.createElement('img');
    img.src = src
    img.className = "image-lg"
    model.textContent = exifObject.model
    shutter.textContent = exifObject.shutter
    aperture.textContent = exifObject.aperture
    iso.textContent = exifObject.iso
    author.textContent = exifObject.author
    container.appendChild(img)
  }

  function mapModal(){
    $('#myModal').modal('hide')
    $('#mapModal').on('shown.bs.modal', function(){
      $('body').addClass('modal-open');
      gmap.initMap('direction-map');
      gmap.initDirection();
      $(this).off('shown.bs.modal')
    })
  }

  return {
    appendImg : appendImg
  }
})()
