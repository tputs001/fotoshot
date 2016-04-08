var image = (function(){

  //Caching the dom
  var tag = document.getElementById('tag');
  var location = document.getElementById('location');
  var form = document.getElementById('search');
  var display = document.getElementById('img-container');
  var largeImg = document.getElementById('image-lg')
  var shutter = document.getElementById('shutter')
  var aperture = document.getElementById('aperture')
  var model = document.getElementById('model')
  var iso = document.getElementById('iso')
  var author = document.getElementById('author')
  var topTags = document.getElementById('topTags')
  var down = document.getElementById('down')
  var title = document.getElementById('title')

  //Binding Events
  form.addEventListener('submit', function(e){
    e.preventDefault()
    ajaxInput(e, tag.value, location.value)
    state('search')
  })

  topTags.addEventListener('click', function(e){
    console.log(e)
    if(e.target.nodeName == 'H1'){
      ajaxInput(e, e.target.textContent)
    } else {
      ajaxInput(e, e.target.attributes.tag.value)
    }
  })

  document.body.addEventListener('click', function(e){
    var target = e.target
    if(target.nodeName == 'IMG' && !(utility.hasClass(e, 'pop'))) {
      ajaxExif(target.attributes.photoid.value, target.attributes.secret.value, target.attributes.lg.value);
      gmap.getGeo(target.attributes.lat.value, target.attributes.lng.value);
    }
    if(target.id == 'direction'){ gmap.mapModal() }
    if(target.id == 'trending'){ajaxTrending(e, 'unsorted'); state('trending')}
    if(target.id == 'views'){ajaxTrending(e, 'views')}
    if(target.id == 'date'){ajaxTrending(e, 'date')}
    if(target.id == 'old'){ajaxTrending(e, 'old')}
    if(target.id == 'mapButton'){animate.toggleHidden('#location'); animate.toggleMap(e); state('explore')}
    if(target.className == 'tags'){ajaxInput(e, target.attributes.tag.value)}
    if(utility.hasClass(e, 'pageDown')){animate.scrollDown(e, '#down')}
  })

  //Methods
  function ajaxInput(e, tag, location){
    var input = {
      tag: tag,
      location: location || 'nothing'
    }

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
        appendImg(display, collection[i].url_m, 'div-images', 'img-responsive images', collection[i].id, collection[i].secret, collection[i].latitude, collection[i].longitude, collection[i].url_l)
      }
      animate.setToggle(true)
      animate.scrollDown(e, '#img-container');
      gmap.grabImages(collection)
      gmap.initMap();
      gmap.initMarker();
    }
  }

  function appendImg(container, src, divClass, imgClass, photoId, secret, lat, lng, srcLg){
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
    img.setAttribute('lg', srcLg)
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
      if(object.stat == 'fail'){
        getExif('fail', src)
      } else {
        getExif(object, src)
      }
    }
  }

  function getExif(object, src){
    if(object == 'fail'){
      var exif = {
        model : 'Not Available',
        shutter: 'Not Available',
        aperture: 'Not Available',
        iso: 'Not Available',
        author: 'Not Available',
      }
    } else {
      var data = object.photo.exif
      var exif = {}
      for(var i = 0; i<data.length; i++){
        if(data[i].label == 'Creator'){ exif.author = data[i].raw._content }
        if(data[i].label == 'Model'){ exif.model = data[i].raw._content }
        if(data[i].label == 'Exposure'){ exif.shutter = data[i].raw._content }
        if(data[i].label == 'Aperture'){ exif.aperture = 'F/' + data[i].raw._content }
        if(data[i].label == 'ISO Speed'){ exif.iso = data[i].raw._content }
      }
    }
    console.log(src)

    utility.clearDom(largeImg)
    appendExif(largeImg, src, exif)
  }

  function appendExif(container, src, exifObject){
    var img = document.createElement('img');
    img.src = src
    img.className = 'image-lg'
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
      var data = JSON.parse(xhr.responseText)
      var trending = data.photos.photo
      var sortedData = trending
      if(sort == 'unsorted'){var sortedData = trending}
      if(sort == 'views'){sortedData = _.sortBy(trending, function(obj){return parseInt(obj.views)}).reverse()}
      if(sort == 'date'){sortedData = _.sortBy(trending, 'datetaken').reverse()}
      if(sort == 'old'){sortedData = _.sortBy(trending, 'datetaken')}
      for(var i = 0; i<sortedData.length; i++){
        appendTrend(display, sortedData[i])
      }
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
    var views = document.createElement('h5')
    var viewText = document.createTextNode("Total Views: " + object.views)
    var media = document.createElement('div')
    var mediaAlign = document.createElement('div')
    var mediaBody = document.createElement('div')
    var nameElement = document.createElement('h3')
    var name = document.createTextNode(object.ownername)
    var date = document.createElement('h5')
    var date_taken = document.createTextNode('Date Taken: ' + object.datetaken)
    var flickr = document.createElement('h5')
    var flickrProfile = document.createElement('a')
    var flickrProfileText = document.createTextNode('My Flickr Profile')

    profile.className = 'img-circle media-object profile'
    profile.src = "http://farm" + object.iconfarm + ".staticflickr.com/" + object.iconserver + "/buddyicons/" + object.owner + ".jpg"
    img.src = object.url_l;

    media.className = 'media'
    mediaAlign.className = 'media-left media-middle'
    mediaBody.className = 'media-body'
    nameElement.className = 'media-heading'

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

    div.className = 'col-md-9';
    div2.className = 'col-md-3';
    img.className = 'img-responsive'
    row.className = 'row'
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
        var tagLi = document.createElement('li');
        var tagText = document.createTextNode(tags[i])
        tagLi.className = 'tags'
        tagLi.setAttribute('tag', tags[i])
        tagLi.appendChild(tagText)
        div2.appendChild(tagLi)
      }
    }
  }

  function state(id){
    if(id == 'trending'){
      $('#topTags').fadeOut('slow')
      $('#title').fadeOut('slow')
      $('#filter').removeClass('hidden');
      $('#img-container').removeClass('text-center')
    } else if(id == 'search'){
      $('#topTags').addClass('hidden')
      $('#filter').addClass('hidden');
      $('title').removeClass("hidden");
    } else if(id == 'explore'){
      $('#filter').addClass('hidden');
    }
  }

  $(document).ready(function (){
    console.log("run?")
    $("#checkContainer").hide().show("slide", { direction: "left" }, 1800);

  })

  return {
    appendImg : appendImg
  }
})()
