const cluster = require('cluster');

if (cluster.isMaster) {
  const cpuCount = require('os').cpus().length;

  for (let i = 0; i < cpuCount; i += 1) {
    cluster.fork();
  }
} else {
  const express = require('express');
  const compression = require('compression');
  const bodyParser = require('body-parser');
  const app = express();

  const blog = require('./controllers/blog');

  app.use(compression());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true,
  }));
  app.use('/public', express.static(__dirname + '/public'));
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');

  app.use('/', blog);

  app.listen('3000', () => console.log('Server started at :3000'));
}
