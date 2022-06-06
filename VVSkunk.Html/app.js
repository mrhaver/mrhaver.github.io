var express = require('express');
var nunjucks = require('nunjucks');
const path = require('path');

var app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'assets')));

// Apply nunjucks and add custom filter and function (for example). 
nunjucks.configure(['src/html/', 'src/html/pages', 'src/html/blocks', 'src/html/partials', 'src/macros'], { // set folders with templates
    autoescape: true,
    express: app
});

app.get('/', function (req, res) {
    res.render('table-of-contents.html');
});

app.get('/pages/:viewName', function (req, res) {
    let viewName = req.params.viewName;

    res.render(viewName + '.html');
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000...');
});