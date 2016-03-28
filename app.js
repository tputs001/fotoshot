var express = require('express');
var bodyParser = require('body-parser').json();
var request = require('request')
var app = express();

app.use(express.static('./'))
app.post('/search', bodyParser, function(req, res){
  console.log(req.body)
  // if(req.body.lat == undefined
  request({
    url: 'https://api.flickr.com/services/rest/?method=flickr.photos.search',
    qs: {
          api_key: '35a14d760960d79479d36e04d9a80c55',
          tags: req.body.tag,
          has_geo: "1",
          sort: "interestingness-desc",
          extras: "geo, url_m",
          format: 'json',
          nojsoncallback: "?"
        }
  }, function(error, response, body){
    // console.log(body)
    res.send(body)
  })
})

app.listen(8080, function(){console.log("listening to port 8080")})


// http://api.flickr.com/services/rest/?method=flickr.places.findByLatLon&api_key=35a14d760960d79479d36e04d9a80c55&lat=36.778261&lon=-119.41793239999998&accuracy=6&format=json&jsoncallback=?
