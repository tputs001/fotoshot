var image = (function(){

  //Caching the dom
  var tag = document.getElementById('tag');
  var location = document.getElementById('location');
  var form = document.getElementById('search');
  var display = document.getElementById("img-container");
  var exifList = document.getElementById('list');
  var exifImage = document.getElementById('exif-image')
  var shutter = document.getElementById("shutter")
  var aperture = document.getElementById("aperture")
  var model = document.getElementById("model")
  var iso = document.getElementById("iso")
  var author = document.getElementById("author")
  var topTags = document.getElementById("topTags")

  //Binding Events
  form.addEventListener('submit', function(e){
    e.preventDefault();
    ajaxInput(tag, location)
  })

  topTags.addEventListener('click', function(e){
    e.preventDefault();
    console.log(e.target.attributes.length)
    ajaxInput(e.target.attributes.tag, "")
  })

  document.body.addEventListener('click', function(e){
    var target = e.target
    // console.log(e)
    if(target.nodeName == "IMG" && target.attributes.length > 2) {
      ajaxExif(target.attributes.photoid.value, target.attributes.secret.value, e.srcElement.src);
      gmap.getGeo(target.attributes.lat.value, target.attributes.lng.value);
    }
    if(target.textContent == "Directions"){ gmap.mapModal() }
    if(target.textContent == "Trending"){ajaxTrending(e, "unsorted")}
    if(target.textContent == "Sort By View"){ajaxTrending(e, "views")}
    if(target.textContent == "Sort By Date"){ajaxTrending(e, "date")}
    if(target.textContent == "Explore"){animate.toggleHidden('#location')}
  })

  //Methods
  function ajaxInput(tag, location){
    var input = {
      tag: tag.value,
      location: location.value || "nothing",
    }

    console.log(input)

    var xhr = new XMLHttpRequest()
    xhr.open('POST', '/search')
    xhr.setRequestHeader('Content-type', 'application/json')
    xhr.send(JSON.stringify(input))
    xhr.onload = function(event){
      $('#img-container').addClass('text-center');
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

  function ajaxTrending(e, sort){
    e.preventDefault()
    var xhr = new XMLHttpRequest();
    xhr.open('get', '/trending')
    xhr.send(null);
    xhr.onload = function(){
      utility.clearDom(display)
      $('#img-container').removeClass("text-center");
      $('#filter').removeClass("hidden");
      var data = JSON.parse(xhr.responseText)
      var trending = data.photos.photo
      var sortedData = trending
      if(sort == "unsorted"){var sortedData = trending}
      if(sort == "views"){var sortedData = _.sortBy(trending, "views")}
      if(sort == "date"){var sortedData = _.sortBy(trending, "datetaken")}

      console.log(sortedData)

      for(var i = 0; i<sortedData.length; i++){
        appendTrend(display, sortedData[i])
      }
       animate.scrollDown()
    }
  }

  function appendTrend(container, object){
    var div = document.createElement('div')
    var div2 = document.createElement('div')
    var row = document.createElement('div')
    var img = document.createElement('img')
    var hr = document.createElement('hr')
    var h3 = document.createElement('h3')
    var title = document.createTextNode(object.title)
    var profile = document.createElement('img')
    var views = document.createElement("h5")
    var viewText = document.createTextNode("Total Views: " + object.views)
    var media = document.createElement('div')
    var mediaAlign = document.createElement('div')
    var mediaBody = document.createElement('div')
    var nameElement = document.createElement('h3')
    var name = document.createTextNode(object.ownername)
    var date = document.createElement('h5')
    var date_taken = document.createTextNode("Date Taken: " + object.datetaken)
    var flickr = document.createElement('h5')
    var flickrProfile = document.createElement("a")
    var flickrProfileText = document.createTextNode("My Flickr Profile")

    profile.className = "img-circle media-object profile"
    profile.src = "http://farm" + object.iconfarm + ".staticflickr.com/" + object.iconserver + "/buddyicons/" + object.owner + ".jpg"
    img.src = object.url_l;

    media.className = "media"
    mediaAlign.className = "media-left media-middle"
    mediaBody.className = "media-body"
    nameElement.className = "media-heading"

    mediaAlign.appendChild(profile)
    mediaBody.appendChild(nameElement)
    nameElement.appendChild(name)

    media.appendChild(mediaAlign)
    media.appendChild(mediaBody)
    div2.appendChild(media)

    views.appendChild(viewText)

    date.appendChild(date_taken)
    div2.appendChild(date)
    div2.appendChild(views)

    div.className = "col-md-9";
    div2.className = "col-md-3";
    img.className = "img-responsive"
    row.className = "row"
    flickrProfile.href = "https://www.flickr.com/people/" + object.owner
    flickrProfile.appendChild(flickrProfileText)

    h3.appendChild(title)
    div.appendChild(img)
    tags(object.tags)
    flickr.appendChild(flickrProfile)
    div2.appendChild(flickr)
    row.appendChild(div)
    row.appendChild(div2)
    container.appendChild(h3)
    container.appendChild(row)
    container.appendChild(hr)

    function tags(data){
      var tags = data.split(' ')
      for(var i = 0;  i < tags.length; i++){
        var tagLi = document.createElement("li");
        var tagText = document.createTextNode(tags[i])
        tagLi.className = "tags"
        tagLi.appendChild(tagText)
        div2.appendChild(tagLi)
      }
    }
  }

  return {
    appendImg : appendImg
  }
})()
