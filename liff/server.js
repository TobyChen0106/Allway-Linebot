const express = require('express');

const path = require('path');
const port = process.env.PORT || 80;
const app = express();
var bodyParser = require('body-parser')
const apiRoute = require('./src/route/api');

app.use(bodyParser.json())
// app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'build')));
app.use('/api', apiRoute);


app.get('/ping', function (req, res) {
  return res.send('pong');
});

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port);

