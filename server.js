const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const blog = require('./controllers/blog');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use('/public', express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.use('/', blog);

app.listen('3000', () => console.log('Server started at :3000'));
