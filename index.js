/////////////////////////////////////////////
// Node.js Server using Express Framework ///
/////////////////////////////////////////////


//////////////////
// Dependencies //
//////////////////
var express = require("express");
var ejsLayouts = require('express-ejs-layouts');
var request = require('request');
var movieCtrl = require('./controllers/movies');

var app = express();

var favs = [];



///////////////////
// Middleware /////
///////////////////
app.set('view engine', 'ejs'); //using the ejs template engine (Jade is another example)
app.use(ejsLayouts);
// This is tricky: Express will only serve static files
// (css, html, etc.) that are located in < __dirname + '/static' >
// Also, it will only look for files there if their path is 
// prefixed with '/static'
app.use('/static', express.static(__dirname + '/static'));


///////////////////
// Routes /////////
///////////////////
app.get("/", function(req, res) {
  var query = req.query.q;
  console.log(query);

  if (query) {
    request({
      url: 'http://www.omdbapi.com',
      qs: {s: query}
    }, function(err, response, body) {
      if (!err && response.statusCode == 200) {
        var data = JSON.parse(body);
        // console.log(Object.keys(data)); //>> [ 'Search', 'totalResults', 'Response' ]
        // res.send(data.Search);
        res.render('results', {results: data.Search});
      }
    });
  } else {
    res.render("index");
  }
});

app.use("/movies", movieCtrl);



///////////////////
// Start Server (on port 3000)
///////////////////
var port = process.env.PORT || 3000;
app.listen(port);
console.log("Starting express-apis-omdb server on port", port);
