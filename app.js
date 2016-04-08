var express = require('express');
var bodyParser = require('body-parser').json();
var request = require('request');
var app = express();

app.use(express.static('./'))
app.use(express.static('./public/js'))
app.use(express.static('./public/css'))

app.post('/search', bodyParser, function(req, res){
  if(req.body.location == "nothing"){
    request({
      url: 'https://api.flickr.com/services/rest/?method=flickr.photos.search',
      qs: {
            api_key: '35a14d760960d79479d36e04d9a80c55',
            tags: req.body.tag,
            has_geo: 1,
            sort: "interestingness-desc",
            content_type: 1,
            min_taken_date: 1325376000,
            per_page: 52,
            extras: "url_m, url_l, views, tags, geo",
            format: 'json',
            nojsoncallback: "?"
          }
    }, function(error, response, body){
      res.send(body)
    })
  } else {
    var location = req.body.location.split(',')
    var newLocation = location.length > 2 ? location[0] + ',' + location[1] : location.join(',')
    var getWoe = new Promise(
      function(resolve, reject){
        request({
          url: 'http://where.yahooapis.com/v1/places.q('+ newLocation + ')',
          qs: {
                format: 'json',
                appid: 'dj0yJmk9ZElRQXNiU2EzeHVtJmQ9WVdrOVNGaDRXSFkyTmpJbWNHbzlNQS0tJnM9Y29uc3VtZXJzZWNyZXQmeD03ZA',
              }
        }, function(error, response, body){
          if(!error && response.statusCode == 200){
            resolve(body)
          } else {
            console.log(error)
          }
        }
      )}
    )
    getWoe.then(
      function(body){
        var woeID = JSON.parse(body).places.place[0].woeid
        request({
          url: 'https://api.flickr.com/services/rest/?method=flickr.photos.search',
          qs: {
                api_key: '35a14d760960d79479d36e04d9a80c55',
                tags: req.body.tag,
                has_geo: 1,
                sort: "interestingness-desc",
                content_type: 1,
                min_taken_date: 1325376000,
                per_page: 52,
                woe_id : woeID,
                extras: "url_m, url_l, views, tags, geo",
                format: 'json',
                nojsoncallback: "?"
              }
        }, function(error, response, body){
          res.send(body)
        })
      }
    )
  }
})

app.get('/exif/:photoId/:secret', function(req, res){
  var photo_id = req.params.photoId
  var secret = req.params.secret
  request({
    url: 'https://api.flickr.com/services/rest/?method=flickr.photos.getExif',
    qs: {
        api_key: '35a14d760960d79479d36e04d9a80c55',
        photo_id: photo_id,
        secret: secret,
        format: "json",
        nojsoncallback: "?"
      }
  }, function(error, response, body){
    res.send(body)
  })
})

app.get('/trending', function(req, res){
  request({
    url: 'https://api.flickr.com/services/rest/?method=flickr.interestingness.getList',
    qs: {
      api_key: '35a14d760960d79479d36e04d9a80c55',
      extras: "url_l, tags, geo, views, date_taken, owner_name, icon_server, description, o_dims",
      format: "json",
      per_page: 20,
      nojsoncallback: "?"
    }
  }, function(error, response, body){
    res.send(body)
  })
})
var port = process.env.PORT || 1337;
app.listen(port, function(){ console.log("Listening on port " + port)})
