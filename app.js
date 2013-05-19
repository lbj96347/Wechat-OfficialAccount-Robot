/*
 *
 * wechat robot sdk for wechat official account auto management
 *
 * Author is CashLee
 *
 * Date : 2013/03/26
 *
 */

var express = require("express");
var app = express();

var routes = require('./routes.js');
var config = require('./config.js');
var session_expires = 72000000;

app.configure( function (){

  app.engine('jade', require('jade').__express);
  app.set('view engine' , 'jade' );
  app.use(express.logger('dev')); 
  app.use(express.bodyParser());
  app.use(express.static(__dirname + '/views'));
  app.use(express.static(__dirname + '/resource'));
  app.use(express.methodOverride());
  app.set('views', __dirname + '/views');
  app.set('resource', __dirname + '/resource');

  app.use(express.cookieParser());
  app.use(express.cookieSession({
    secret: 'this is a screen',
    cookie: {
      expires: new Date(Date.now() + session_expires),
      maxAge: session_expires
    }
  }));

});

routes( app );

var port = process.env.PORT || 3000;
app.listen(port,function (){
  console.log("listening on " + port );
});
