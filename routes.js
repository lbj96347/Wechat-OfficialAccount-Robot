var weixinAuto = require('./application/weixin-auto/weixin-auto.js');

module.exports = function (app){

  app.get('/', function( req , res ){ res.send("hello world"); });

  /*
   *
   * 微信自动登陆机器人路由配置
   *
   * upate: 2013/03/29
   *
   */
  app.get('/weixinlogin', weixinAuto._LOGIN );
  app.get('/weixinmessage', weixinAuto._MESSAGE );
  app.get('/weixinappmessage', weixinAuto._APP_MESSAGE );
  app.get('/weixinupload', weixinAuto._IMG_UPLOAD );
  app.get('/weixinrequest', weixinAuto._REQUEST );
  app.get('/weixingetfakeid', weixinAuto._GET_FAKE_ID );
  app.get('/weixingetuserinfo', weixinAuto._GET_USER_INFO );

}
