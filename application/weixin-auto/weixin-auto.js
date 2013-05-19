/*
 *
 * 2013/03/28
 *
 * to-do list 
 *
 * 封装一个登陆的类
 * 优化代码结构
 *
 */

require('node-jquery');
var md5 = require('MD5');
var wechatOfficial = 'https://mp.weixin.qq.com/';
var wx = require('./weixin-handler.js');

/*
 * 登陆获取cookies 和 token 
 */

exports._LOGIN = function ( req , res ){
  return wx.login(req, function(err, cookie) {
    var data, fakeid, _i, _len, _results;
    if (cookie) {
      req.session.is_login = cookie;
      console.log( cookie );
      console.log('登陆成功了');
      res.send('success');
    }
    if (err) {
      res.json(err);
      res.send('failed');
    }
  });
};

/*
 * 登陆并发送一条消息
 * 需要添加Referer，token，cookies
 */ 
exports._MESSAGE = function ( req , res ){

  var fakeids;
  fakeids = ['486718695'];
  return wx.login(req, function(err, cookie) {
    var data, fakeid, _i, _len, _results , getMsg;

    if (cookie){ req.session.is_login = cookie; }
    if (err){ res.json(err); }

    getMsg = 'hello world';//req.body.data;//收到的message 暂时固定 
    _results = [];
    for (_i = 0, _len = fakeids.length; _i < _len; _i++) {
      fakeid = fakeids[_i];
      data = {
        msg: getMsg,
        fakeid: fakeid,
        cookie: cookie
      };
      _results.push(wx.sender(req, data, function(err, results) {
        if (err) {
          res.json(err);
        }
        return res.json(results);
      }));
    }
    return _results;
  });

}


/*
 *
 * 登陆并上传一张图片
 *
 */

exports._IMG_UPLOAD = function ( req , res ){

  var fakeids, getMsg;
  getMsg = '我来测试啦啦啦了!!!!';
  fakeids = ['486718695'];
  return wx.login(req, function(err, cookie) {
    var data, fakeid, _i, _len, _results;
    if (cookie) { req.session.is_login = cookie; }
    if (err) {res.json(err);}
    _results = [];
    for (_i = 0, _len = fakeids.length; _i < _len; _i++) {
      fakeid = fakeids[_i];
      data = {
        msg: getMsg,
        fakeid: fakeid,
        cookie: cookie
      };
      _results.push(wx.uploadmaterial(req, data, function(err, results) {
        if (err) {
          res.json(err);
        }
        return res.send(results);
      }));
    }
    return _results;
  });

}


/*
 *
 * 登陆并推送一条图文信息
 *
 */

exports._APP_MESSAGE = function ( req , res ){

  /*
   * 推送消息的detail内容...
   * req.query.msg;
   * 收到的message 暂时固定 
   *
   * 考虑从sae推id过来给这边
   */
  var receiveId = 'cashlee4248';//req.body.data;
  var wechatids = [ 'cashlee4248' ];
  return wx.login(req, function(err, cookie) {
    var data, wechatid, _i, _len, _results;
    if (cookie) { req.session.is_login = cookie; }
    if (err) { res.json(err); }
    _results = [];
    for (_i = 0, _len = wechatids.length; _i < _len; _i++) {
      //wechatid = wechatids[_i];
      console.log( 'cookies 的详细内容是 ：' , cookie );
      data = {
        msg: '',
        'wechatid': receiveId,
        cookie: cookie
      };
      _results.push(wx.send_appmsg(req, data, function(err, results) {
        if (err) { res.json(err); }
        return res.json(results);
      }));
    }
    return _results;
  });
};

/*
 *
 * Group Send的方式
 *
 * 推送一条图文消息
 *
 */

exports._GROUP_MESSAGE = function ( req , res ){

  var fakeids, msg;
  /*
   *
   * 推送消息的detail内容...
   *
   * req.query.msg;
   * 收到的message 暂时固定 
   *
   */
  getMsg = '我来测试啦啦啦了!!!!这里是Group type啊！千万要小心'
  console.log( getMsg );
  /* 
   */
  fakeids = [ '486718695' ];
  return wx.login(req, function(err, cookie) {
    var data, fakeid, _i, _len, _results;

    if (cookie) { req.session.is_login = cookie; }
    if (err) { res.json(err); }

    _results = [];

    for (_i = 0, _len = fakeids.length; _i < _len; _i++) {
      fakeid = fakeids[_i];
      data = {
        msg: getMsg,
        fakeid: fakeid,
        cookie: cookie
      };
      console.log('第一次输出cookie : ' +  cookie );
      _results.push(wx.sendGroupMsg(req, data, function(err, results) {
        if (err) {
          res.json(err);
        }
        return res.json(results);
      }));
    }

    return _results;
  });

};




/*
 *
 *
 * 发起一次请求，并且能够推送一条图文信息
 *
 */


exports._REQUEST = function ( req , res ){
  $.ajax({
    url : 'http://localhost:3000/weixinimg',
    type : 'GET',
    beforeSend: function (){ console.log('sending ...'); },
    error: function (){ console.log('get error'); },
    success : function (data){
      res.send( data );
    }
  });
}


exports._GET_FAKE_ID = function ( req , res ){

  var requestPage = '1';req.body.data;
  console.log( '请求的页面是' , requestPage );
  return wx.login(req, function(err, cookie) {
    var data, fakeid, _i, _len, _results;

    if (cookie) { req.session.is_login = cookie; }
    if (err) { res.json(err); }

    _results = [];

    data = {
      page : requestPage ,  
      cookie: cookie
    };
    _results.push(wx.getFakeId(req, data, function(err, results) {
      if (err) {
        res.json(err);
      }
      return res.send(results);
    }));

    return _results;

  });

}


exports._GET_USER_INFO = function ( req , res ){

  var fakeId = req.body.data;
  return wx.login(req, function(err, cookie) {
    var data, fakeid, _i, _len, _results;

    if (cookie) { req.session.is_login = cookie; }
    if (err) { res.json(err); }

    _results = [];

    data = {
      'fakeId' : fakeId , 
      cookie: cookie
    };
    _results.push(wx.getUserInfo(req, data, function( err, results) {
      if (err) { res.json(err); }
      return res.send( results );
    }));
    return _results;
  });

}
