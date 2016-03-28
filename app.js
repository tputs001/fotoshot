var express = require('express');
var bodyParser = require('body-parser').json();
var request = require('request')
var app = express();

app.use(express.static('./'))
app.post('/search', bodyParser, function(req, res){
  var location = req.body.location.split(',')
  var newLocation = location.length > 2 ? location[0] + ',' + location[1] : location.join(',')
  console.log(newLocation)
  var p1 = new Promise(
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
  p1.then(
    function(body){
      var woeID = JSON.parse(body).places.place[0].woeid
      console.log(woeID)
      request({
        url: 'https://api.flickr.com/services/rest/?method=flickr.photos.search',
        qs: {
              api_key: '35a14d760960d79479d36e04d9a80c55',
              tags: req.body.tag,
              has_geo: "1",
              sort: "interestingness-desc",
              woe_id : woeID,
              extras: "geo, url_m",
              format: 'json',
              nojsoncallback: "?"
            }
      }, function(error, response, body){
        console.log(body)
        res.send(body)
      })
    }
  )
})

app.listen(8080, function(){console.log("listening to port 8080")})
