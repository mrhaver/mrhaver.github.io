var express = require('express');
var nunjucks = require('nunjucks');
const path = require('path');

var app = express();
app.use(express.static(path.join(__dirname, 'public')));

// Apply nunjucks and add custom filter and function (for example). 
nunjucks.configure(['views/', 'views/pages', 'views/blocks', 'views/partials', 'macros'], { // set folders with templates
    autoescape: true,
    express: app
});

app.get('/', function (req, res) {
    res.render('index.html');
});

app.get('/pages/:viewName', function (req, res) {
    let viewName = req.params.viewName;

    res.render(viewName + '.html');
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000...');
});