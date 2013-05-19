var config, fs, http, request;
var md5 = require('MD5');
var restler = require('restler');//use for uploading multipart form-data
var needle = require('needle');
var Spooky = require('spooky');
var http_get = require('http-get');

request = require('superagent');
config = require('../../config.js');
fs = require('fs');
http = require('http');
require('node-jquery');

/*
 * Login中注意获取 token,token每次都不一样 
 * 所有的post请求中需要添加Referer : http://mp.weixin.qq.com/cgi-bin/singlemsgpage 
 * 其他的url请求中，同样需要使用相应的Referer
 */

var selfCount = 0;
var token;
var domain = 'http://mrqxinwen.sinaapp.com/';

module.exports = {

  login: function(req, fn) {
    var wx_pwd, wx_usr , app_id;
    app_id = 'wx';//req.body.id;//接受的是post请求，拿到app_id
    /*
    if ( req.session.is_login ) {
      return fn(null, req.session.is_login);
    }
    */
    wx_usr = config[ app_id ].user;
    wx_pwd = md5(config[ app_id ].pwd.substr(0, 16));
    console.log( '密码是 : ' ,  wx_pwd );
    return request.post('https://mp.weixin.qq.com/cgi-bin/login?lang=zh_CN')
      .set('Referer', 'https://mp.weixin.qq.com/cgi-bin/loginpage?t=wxm2-login&lang=zh_CN')
      .type('form')
      .set('X-Requested-With','XMLHttpRequest')
      .send({ username: wx_usr , pwd: wx_pwd, imgcode: '', f: 'json'})
      .end(function(res) {
        console.log('返回的text : ' , res.text );
        console.log('登陆模块，拿到的token:',  JSON.parse(res.text).ErrMsg.split('&')[2].split('=')[1] );
        var cookie, rs, _i, _len, _ref;
        token = JSON.parse(res.text).ErrMsg.split('&')[2].split('=')[1];
        cookie = '';
        if (res.header['set-cookie']) {
          console.log('返回的整个header : ' , res.header );
          _ref = res.header['set-cookie'];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            rs = _ref[_i];
            cookie += rs.replace(/Path=\//g, '').replace('; ;','; ').replace('Secure; HttpOnly','');
          }
        }
        return fn(null, cookie);
    });
  },

  sender: function(req, options, fn) {
    var fakeid, msg, psotParams;
    msg = options.msg;
    fakeid = options.fakeid;
    if (!msg) {
      fn({ error: 'missing msg' });
      return;
    }
    if (!fakeid) {
      fn({ error: 'missing fakeid' });
      return;
    }
    psotParams = {
      type: 1,
      content: msg,
      error: false,
      tofakeid: fakeid,
      token : token ,  
      ajax: 1
    };
    console.log('cookie is : ', options.cookie );
    //options.cookie = 'hasWarningUser=1; ptisp=ctc; pt2gguin=o0306136741; uin=o0306136741; skey=@AEvClZMrh; RK=hN5v4PGKzN; ptui_loginuin=306136741@qq.com; pgv_pvi=6398624768; pgv_si=s2338737152; pgv_pvid=7333718876; pgv_info=ssid=s2037040275; __hash__=147593be51baf3d1cc0daf37ab798af6; cert=xG4k66ZF2FhMFN0lwirOgWNfGzn2qsuV; slave_user=gh_719b7addfdfe; slave_sid=eEc0azY2WkYyRmhNRk4wbHdpck9nV05mR3puMnFzdVY2eWNjRGFRRk80b3NTb0xsR2E4VTVUOEpzdEpRV2NLMUpXYmwzMFlSM2xnVEhfZG05amRjYmpUQk1DcUZNN0V1MlFQNE9LVFI0N0pMNlU0ZFVHVmxIVjVma1ZQaWpsV1Y=';
    //options.cookie = 'hasWarningUser=1; ptisp=ctc; pt2gguin=o0306136741; uin=o0306136741; ptui_loginuin=306136741@qq.com;  cert=xG4k66ZF2FhMFN0lwirOgWNfGzn2qsuV; slave_user=gh_719b7addfdfe; slave_sid=eEc0azY2WkYyRmhNRk4wbHdpck9nV05mR3puMnFzdVY2eWNjRGFRRk80b3NTb0xsR2E4VTVUOEpzdEpRV2NLMUpXYmwzMFlSM2xnVEhfZG05amRjYmpUQk1DcUZNN0V1MlFQNE9LVFI0N0pMNlU0ZFVHVmxIVjVma1ZQaWpsV1Y=';
    //var newcookie = 'hasWarningUser=1; ptisp=ctc; pt2gguin=o0306136741; uin=o0306136741; ptui_loginuin=306136741@qq.com;' + options.cookie;
    var newcookie = options.cookie;
    console.log('token is : ' , token  );
    console.log('new cookie is : ' , newcookie );
    return request.post('https://mp.weixin.qq.com/cgi-bin/singlesend?t=ajax-response&lang=zh_CN').type('form').send(psotParams).set('Cookie', newcookie ).set('Referer', 'http://mp.weixin.qq.com/cgi-bin/singlemsgpage?token='+token+'&fromfakeid='+fakeid+'&msgid=&source=&count=20&t=wxm-').end(function(res) {
      results = JSON.parse(res.text);
      if (results['ret'] === '-20000') {
        delete req.session.is_login;
      }
      return fn(null, results);
    });
  },

  uploadmaterial: function(req , options , fn) {

    var resource = { url: 'http://tp3.sinaimg.cn/1685135222/180/40016952064/1' };
    var timestamp = new Date().getTime(); 
    var randnumber = Math.floor(Math.random()*1000+1);
    var filename = timestamp + randnumber + '.jpg';
    var referer;
    http_get.get( resource , './resource/tmp/' + filename , function (error, result) {
      if (error) {
        console.error(error);
        return fn( null , 'upload failed');
      } else {
        console.log('File downloaded at: ' + result.file);
        fs.stat( result.file , function(err, stats) {
          console.log( '文件大小是: ' + stats.size );
          console.log( '目前的token是：' + token );
          console.log( '目前的cookies' , options.cookie );
          request.get('http://mp.weixin.qq.com/cgi-bin/filemanagepage?t=wxm-file&lang=zh_CN&token='+ token +'&lang=zh_CN&pagesize=10&pageidx=0&type=0&groupid=0').set('Cookie', options.cookie).set('Referer', 'http://mp.weixin.qq.com/cgi-bin/filemanagepage').end(function(res) {
            var pattern = /<script id="tFileMain" type="text\/html">([\s\S]*)<\/script>/;
            try {
              /* 获取所有的fakeid */
              var templateContent = pattern.exec(res.text)[0];
              referer = templateContent.split('file_from_')[1].substring(0 , 13);
              console.log('这个是referer number ：'+ referer );
            }catch(e){
              console.error(e);
            }
            /* 上传照片到微信公众平台 */
            request.post('https://mp.weixin.qq.com/cgi-bin/uploadmaterial?cgi=uploadmaterial&type=0&token='+token+'t=iframe-uploadfile&lang=zh_CN&formId=null')
              .set('Content-Type', 'image/jpg' )
              .set('Cookie', options.cookie )
              .attach('uploadFile', result.file).end(function ( res ){
                console.log( res.text );
              });
          });
        });
      }
    });
  

  },

  send_appmsg: function(req , options, fn) {
    //return this.login(function(err, cookie) {
      var psotParams;
      var result;

      $.get(  domain + 'action/api.php?socket=today_news_list', function(data) {
        console.log('返回的数据' ,  data );
        if( typeof( data ) == 'string' ){
          result = JSON.parse( data );
        }else{
          result = data;
        }

        psotParams = {
          error: false,
          AppMsgId: '10000008',//10000008
          count: 5,
          title0: result[0].title || (result[0].weibo.replace(/<[^>]+>/g,"")).substring( 0, 12 ),
          digest0: result[0].title || (result[0].weibo.replace(/<[^>]+>/g,"")).substring( 0, 12 ),
          content0: '<img src="'+ result[0].crop_picture +'" />'+
                    '<style>#media{display:none}</style>'+
                    '<p>'+ result[0].weibo.substring(0 , 20 ) +'...详细内容，点击下方“阅读全文”</p>'+
                    '<p><span style="color:#ff0000;font-size:24px;">↓↓↓↓↓↓↓↓↓↓</span></p>', 
          fileid0: '10000013',
          sourceurl0: domain + '#' + result[0].id ,

          title1: result[1].title || (result[1].weibo.replace(/<[^>]+>/g,"")).substring( 0, 12 ) , 
          content1: '<img src="'+ result[1].crop_picture +'" />'+
                    '<style>#media{display:none}</style>'+
                    '<p>'+ result[1].weibo.substring(0 , 20 ) +'...详细内容，点击下方“阅读全文”</p>'+
                    '<p><span style="color:#ff0000;font-size:24px;">↓↓↓↓↓↓↓↓↓↓</span></p>', 
          fileid1: '10000015',
          sourceurl1: domain + '#' + result[1].id ,

          title2: result[2].title || (result[2].weibo.replace(/<[^>]+>/g,"")).substring( 0, 12 ) ,
          content2: '<img src="'+ result[2].crop_picture +'" />'+
                    '<style>#media{display:none}</style>'+
                    '<p>'+ result[2].weibo.substring(0 , 20 ) +'...详细内容，点击下方“阅读全文”</p>'+
                    '<p><span style="color:#ff0000;font-size:24px;">↓↓↓↓↓↓↓↓↓↓</span></p>' , 
          fileid2: '10000016',
          sourceurl2: domain + '#' + result[2].id ,

          title3: result[3].title || (result[3].weibo.replace(/<[^>]+>/g,"")).substring( 0, 12 ) ,
          content3: '<img src="'+ result[3].crop_picture +'" />'+
                    '<style>#media{display:none}</style>'+
                    '<p>'+ result[3].weibo.substring(0 , 20 ) +'...详细内容，点击下方“阅读全文”</p>'+
                    '<p><span style="color:#ff0000;font-size:24px;">↓↓↓↓↓↓↓↓↓↓</span></p>' , 
          fileid3: '10000017',
          sourceurl3: domain + '#' + result[3].id ,

          title4: result[4].title || (result[4].weibo.replace(/<[^>]+>/g,"")).substring( 0, 12 ) ,
          content4: '<img src="'+ result[4].crop_picture +'" />'+
                    '<style>#media{display:none}</style>'+
                    '<p>'+ result[4].weibo.substring(0 , 20 ) +'...详细内容，点击下方“阅读全文”</p>'+
                    '<p><span style="color:#ff0000;font-size:24px;">↓↓↓↓↓↓↓↓↓↓</span></p>' , 
          fileid4: '10000018',
          sourceurl4: domain + '#' + result[4].id ,
          
          preusername: options.wechatid , //options.username,
          'token' : token , 
          ajax: 1
        };

        console.log( '这里是wechat id' ,   options.wechatid );

        console.log( '请求次数统计' + (selfCount++) );
        //if( selfCount == 2 ){
          //如果selfCount出现问题，马上停止
          return request.get('https://mp.weixin.qq.com/cgi-bin/operate_appmsg?token='+token+'&lang=zh_CN&sub=edit&t=wxm-appmsgs-edit-new&type=10&subtype=3&AppMsgId=10000008&lang=zh_CN').type('form').set('Cookie', options.cookie).set(
            'Referer', 'https://mp.weixin.qq.com/cgi-bin/operate_appmsg&token='+token+'&lang=zh_CN&sub=edit&t=wxm-appmsgs-edit-new&type=10&subtype=3&ismul=1'
            ).send(psotParams).end(function(res) {
            var results;
            console.log( res.text );
            results = JSON.parse(res.text);
            console.log( results );
            return fn(null, results['msg']);
          });

      });
      //}
    //});
  },

  getFakeId : function ( req , options , fn ){
    console.log( '请求次数统计' + (selfCount++) );
    if( selfCount ){

      /* 
       * 如果selfCount出现问题，马上停止
       * 获取fakeid 列表页面 
       * 利用jsdom获取
       * 发现微信是通过异步加载的方式去加载friends fakeid list
       *
       * 利用接口查询的方式找到对应的friends list，其中pageidx 为查询的页数
      */

      return request.get('https://mp.weixin.qq.com/cgi-bin/contactmanagepage?t=wxm-friend&token='+ token +'&lang=zh_CN&pagesize=10&pageidx='+ options.page +'&type=0&groupid=0').set('Cookie', options.cookie).set('Referer', 'http://mp.weixin.qq.com/cgi-bin/contactmanagepage').end(function(res) {
        var results, fakes ;
        console.log( res.text );
        try {
          /* 获取所有的fakeid */
          var rs = res.text.replace(/document.location.hostname.match.*\[0\]/g, '"'+req.host+'"');
          var pattern = /<script id="json-friendList" .*>([\s\S]*?)<\/script>/;
          results = rs.match(/<script id="json-friendList" .*>([\s\S]*?)<\/script>/)[1];
          console.log( '尝试使用dom进行解析' ,  results );
        }catch(e){
          console.error(e);
        }
        return fn(null, results);
      });

    }
  },

  getUserInfo : function ( req , options , fn ){
    console.log( '请求次数统计' + (selfCount++) );
    if( selfCount ){
      /*
       * 利用微信用户fakeid获取其对应的用户资料
       * test fakeid : 2777921522 - lbj96347 
       * test fakeid : 486718695 - cashlee4248
       */
      return request.get('http://mp.weixin.qq.com/cgi-bin/getcontactinfo?t=ajax-getcontactinfo&fakeid='+ options.fakeId + '&token=' + token ).set('Cookie', options.cookie).set('Referer', 'http://mp.weixin.qq.com/cgi-bin/getcontactinfo&token=' + token ).end(function(res) {
        var results, fakes;
        results = res.text;
        console.log( results );
        console.log( 'result 的类型是' + typeof( results ) );
        return fn( null , results);
      });
    }
  },

  sendGroupMsg : function ( req , options , fn ){

    var psotParams = {
      type : "10" , 
      fid : "10000008" , 
      appmsgid : "10000008" ,
      error : false , 
      needcomment : 0 , 
      groupid : -1 ,
      sex : 0 , 
      country : '',  
      city : '',  
      province : '',
      "token" : token , 
      ajax : 1
    };
    console.log( '请求次数统计' + (selfCount++) );
    if( selfCount ){
      var full_cookie = options.cookie  + 'remember_acct=meiriquan@qq.com; hasWarningUser=1;';
      console.log('第二次输出cookie : ' + full_cookie );
      return request.post('http://mp.weixin.qq.com/cgi-bin/masssend?t=ajax-response' ).set('Cookie', full_cookie).set('Referer', 'http://mp.weixin.qq.com/cgi-bin/masssendpage?t=wxm-send&token='+ token + '&lang=zh-cn' ).send(psotParams).end(function(res) {
        var results;
        results = res.text;
        console.log( results );
        return fn(null, 'done');
      });
    }
  }

};
