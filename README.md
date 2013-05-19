#Wechat-OfficialAccount-Robot

  Author : CashLee

  Created Date : 2013/03/28

  Bug Fix Date : 2013/05/13

  Version : v0.0.1

#USAG

  git clone https://github.com/lbj96347/Wechat-OfficialAccount-Robot.git

  cd path/Wechat-OfficialAccount-Robot

  npm install ( install all node_module )

  node app.js ( Run Application )

  ... But you should config your wechat-official account and your test account

  open config.js -> user = 'Your Account' pwd = 'Your Password'

  open application/weixin-auto/weixin-auto.js 

    on line 44 -> fakeids = [''];//type yourself's wechat fake id

  ...

  Go to restart app.js

  ...

  Follow this steps for using this application

  1.curl http://localhost:3000/weixinlogin 

  2.curl http://localhost:3000/weixinmessage

#BUG LIST

  疑似appmessage，接口暂时不可用。参数未配置正确

#备注

  这个项目代码比较乱，一方面是写的时间非常仓促，而且当时只是希望做一个临时的实验。因此并没有太多后期的优化。希望大家能够谅解。如果需求大的话我会继续补充文档以及fix存在的Bug。此外还有要说明的是，微信对于网页端的请求参数有了很多新的要求，上面的代码不一定适用，所以对于维护方来说，工作量还是不少的。而且各种政策影响下，这种接口不适用于产品级的场景。仅作交流学习之用！

感谢@老狗真的是人哦 ， @BryantChan , @zegia ，因为你们的及时回复，刺激我再次打开这个写得很渣的项目，让他重见光明，如果你们有时间记得帮忙维护一下。
