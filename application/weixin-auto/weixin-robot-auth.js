var md5 = require('MD5');
var config = require('../../config.js');
require('node-jquery');

exports._AUTH = function ( req , res ){
  /* 
   *
   * 认证签名模块
   *
   * 验证headers部分必要信息
   * x-wechat-robot-key
   * x-wechat-robot-version
   * x-wechat-robot-timestamp
   * x-wechat-robot-signature
   *  md5( appkey , appsecret , timestamp )
   *
   * data 
   *  token
   *  name
   *  id
   *  debug_mode
   *
   */
  app_id = req.body.id;
  var timestamp = req.headers['x-wechat-robot-timestamp'];
  var version = req.headers['x-wechat-robot-version'];

  var server_appkey = config[ app_id ].appkey;
  var server_appsecret = config[ app_id ].appsecret;
  var server_signature = md5( server_appkey + server_appsecret + timestamp );

  console.log('Server side get message ' , app_id , config[app_id].appkey , config[app_id].appsecret );
  console.log('client side get message ' , app_id , timestamp , version );
  console.log('Signature : ' , server_signature);

  return req.headers['x-wechat-robot-signature'] == server_signature ? true : false

}
