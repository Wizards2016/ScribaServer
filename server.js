var express = require('express');
var app = express();
var controller = require('./controllers');
var router = require('express').Router();
var parser = require('body-parser');


app.use(parser.json());
app.use('/', router);

router.get('/messages', controller.messages.get);
router.post('/messages', controller.messages.post);

app.set('port', 8000);
if(!module.parent){
  app.listen(app.get('port'));
  console.log('Listening on', app.get('port'));
}

module.exports.app = app;
module.exports = router;
