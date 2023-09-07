/*
cron "22 6-23/5 * * *" jd_bean_change.js, tag:指定京东日资产变动通知
 */


let fs = require('fs');
const content = fs.readFileSync('/ql/data/scripts/wxid.txt', { flag: 'r', encoding: 'utf-8' }).toString()
const $ = new Env('京东日资产变动通知');
const notify = $.isNode() ? require('./sendNotify') : '';
const JXUserAgent = $.isNode() ? (process.env.JX_USER_AGENT ? process.env.JX_USER_AGENT : ``) : ``;
//Node.js用户请在jdCookie.js处填写京东ck;
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
//通知分为单账号 默认 false,环境变量 BEAN_CHANGE_NOTIFYTIP
const notifyTip = $.isNode() ? process.env.BEAN_CHANGE_NOTIFYTIP : false;

const thefs = require('fs');
const thepath = '/jd/scripts/0sendNotify_Annyooo.js'
const thenotifyTip = $.isNode() ? process.env.MY_NOTIFYTIP : false;

let allMessage = '';
let ReturnMessage = '';
//IOS等用户直接用NobyDa的jd cookie
let cookiesArr = [], cookie = '';
const JD_API_HOST = 'https://api.m.jd.com/client.action';

let jdSignUrl = '' // 算法url
let Authorization = '' // 算法url token 有则填

if ($.isNode()) {
  Object.keys(jdCookieNode).forEach((item) => {
    cookiesArr.push(jdCookieNode[item])
  })
  if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => { };
} else {
  cookiesArr = [$.getdata('CookieJD'), $.getdata('CookieJD2'), ...jsonParse($.getdata('CookiesJD') || "[]").map(item => item.cookie)].filter(item => !!item);
}

jdSignUrl = $.isNode() ? (process.env.gua_cleancart_SignUrl ? process.env.gua_cleancart_SignUrl : `${jdSignUrl}`) : ($.getdata('gua_cleancart_SignUrl') ? $.getdata('gua_cleancart_SignUrl') : `${jdSignUrl}`);
Authorization = process.env.gua_cleancart_Authorization ? process.env.gua_cleancart_Authorization : `${Authorization}`
if (Authorization && Authorization.indexOf("Bearer ") === -1) Authorization = `Bearer ${Authorization}`

!(async () => {
  if (!cookiesArr[0]) {
    $.msg($.name, '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/bean/signIndex.action', { "open-url": "https://bean.m.jd.com/bean/signIndex.action" });
    return;
  }
  for (let i = 0; i < cookiesArr.length; i++) {
    if (cookiesArr[i]) {
      cookie = cookiesArr[i];
      $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
      $.CryptoJS = $.isNode() ? require('crypto-js') : CryptoJS;
      $.index = i + 1;
      $.beanCount = 0;
      $.incomeBean = 0;
      $.expenseBean = 0;
      $.todayIncomeBean = 0;
      $.todayOutcomeBean = 0;
      $.jxbeanCount = 0;
      $.InjxBean = 0;
      $.OutjxBean = 0;
      $.todayInjxBean = 0;
      $.todayOutjxBean = 0;
      $.errorMsg = '';
      $.isLogin = true;
      $.nickName = '';
      $.message = '';
      $.balance = 0;
      $.expiredBalance = 0;
      $.JdzzNum = 0;
      $.JdMsScore = 0;
      $.JdFarmProdName = '';
      $.JdtreeEnergy = 0;
      $.JdtreeTotalEnergy = 0;
      $.JdwaterTotalT = 0;
      $.JdwaterD = 0;
      $.JDwaterEveryDayT = 0;
      $.JDtotalcash = 0;
      $.JDEggcnt = 0;
      $.Jxmctoken = '';
      $.TotalMoney = 0;
      $.eCards = ""
      $.eCardNum = 0
      $.AccBalance = ""
      $.WalletBalance = ""
      $.isPlusVip = 0
      $.totalScore = 0
      $.levelName = ""
      $.JingXiang = ""
      getUA()

      await TotalBean();
      await TotalBean2();
      console.log(`\n**开始【京东账号${$.index}】${$.nickName || $.UserName}***\n`);
      if (!$.isLogin) {
        $.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, { "open-url": "https://bean.m.jd.com/bean/signIndex.action" });

        if ($.isNode()) {
          await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
        }

        if ($.isNode() && thefs.existsSync(thepath) && thenotifyTip) {
          let thenotify = require(thepath);
          await thenotify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
        }

        continue
      }
      await getJdZZ();
      await new Promise(resolve => setTimeout(resolve, 2000));
      await getMs();
      await new Promise(resolve => setTimeout(resolve, 2000));
      await jdfruitRequest('taskInitForFarm', { "version": 14, "channel": 1, "babelChannel": "120" });
      await new Promise(resolve => setTimeout(resolve, 2000));
      await getjdfruit();
      await new Promise(resolve => setTimeout(resolve, 2000));
      await cash();
      await new Promise(resolve => setTimeout(resolve, 2000));
      await TotalMoney();//领现金
      await new Promise(resolve => setTimeout(resolve, 2000));
      await requestAlgo();
      await new Promise(resolve => setTimeout(resolve, 2000));
      await JxmcGetRequest();
      await new Promise(resolve => setTimeout(resolve, 2000));
      await bean();
      await new Promise(resolve => setTimeout(resolve, 2000));
      await GetJxBeanInfo();
      await new Promise(resolve => setTimeout(resolve, 2000));
      // await jxbean();
      await getJxFactory();   //京喜工厂
      await getECard()
      await new Promise(resolve => setTimeout(resolve, 2000));
      await getAccBalance()
      await getBalance()
      await new Promise(resolve => setTimeout(resolve, 2000));
      await queryScore()
      await new Promise(resolve => setTimeout(resolve, 2000));
      await showMsg();
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    if ($.isNode() && notifyTip && allMessage) {
      console.log("单账号通知")
      await notify.sendNotify(`${$.name}`, `${allMessage}`, { url: `https://bean.m.jd.com/beanDetail/index.action?resourceValue=bean` })
      allMessage = ""
    }
  }

  if ($.isNode() && !notifyTip && allMessage) {
    console.log("多账号合并通知")
    await notify.sendNotify(`${$.name}`, `${allMessage}`, { url: `https://bean.m.jd.com/beanDetail/index.action?resourceValue=bean` })
  }
})()
  .catch((e) => {
    $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
  })
  .finally(() => {
    $.done();
  })
async function showMsg() {
  if ($.errorMsg) return
  //allMessage += `账号${$.index}：${$.nickName || $.UserName}\n今日收入：${$.todayIncomeBean}京豆 🐶\n昨日收入：${$.incomeBean}京豆 🐶\n昨日支出：${$.expenseBean}京豆 🐶\n当前京豆：${$.beanCount}(今日将过期${$.expirejingdou})京豆 🐶${$.message}${$.index !== cookiesArr.length ? '\n\n' : ''}`;

  // if ($.isNode()) {
  //   await notify.sendNotify(`${$.name} - 账号${$.index} - ${$.nickName}`, `账号${$.index}：${$.nickName || $.UserName}\n昨日收入：${$.incomeBean}京豆 🐶\n昨日支出：${$.expenseBean}京豆 🐶\n当前京豆：${$.beanCount}京豆 🐶${$.message}`, { url: `https://bean.m.jd.com/beanDetail/index.action?resourceValue=bean` })
  // }

  ReturnMessage = `📣===排名${$.index}====📣\n`
  ReturnMessage += `京东pin：${$.UserName}\n`;
  ReturnMessage += `京东名称：${$.nickName}\n`;

  if ($.levelName || $.isPlusVip || $.JingXiang) {
    ReturnMessage += `账号信息：`
    let msg = ""
    if ($.levelName) {
      if ($.levelName.length > 2) $.levelName = $.levelName.substring(0, 2)
      if ($.levelName == "注册") $.levelName = `普通`
      // $.levelName = `😊普通`;
      // else if ($.levelName == "金牌")
      //     $.levelName = `🥇金牌`;
      // else if ($.levelName == "银牌")
      //     $.levelName = `🥈银牌`;
      // else if ($.levelName == "铜牌")
      //     $.levelName = `🥉铜牌`;
      // else if ($.levelName == "钻石")
      //     $.levelName = `💎钻石`;
      $.levelName = `${$.levelName}|`
    }
    msg = $.isPlusVip == 1 ? `${$.levelName}Plus` : `${$.levelName}会员`
    msg = $.totalScore ? `${msg}(${$.totalScore}分)` : msg
    msg = $.JingXiang ? `${msg},京享值${$.JingXiang}\n` : `${msg}\n`
    ReturnMessage += msg
  }

  ReturnMessage += `今日收支：(以app收入为准)) 🐶 减 ${$.todayOutcomeBean}京豆\n`;
  ReturnMessage += `昨日收支：(以app收入为准)) 🐶 减 ${$.expenseBean}京豆\n`;;
  ReturnMessage += `当前京豆：${$.beanCount}(今日将过期${$.expirejingdou})京豆🐶\n`;
  ReturnMessage += `当前喜豆：${$.jxbeanCount}喜豆\n`;

  if (typeof $.JDEggcnt !== "undefined") {
    ReturnMessage += `京喜牧场：${$.JDEggcnt}枚鸡蛋\n`;
  }
  if (typeof $.TotalMoney !== "undefined") {
    ReturnMessage += `签到现金：${$.TotalMoney}元\n`;
  }
  if (typeof $.JDtotalcash !== "undefined") {
    ReturnMessage += `极速金币：${$.JDtotalcash}金币(≈${($.JDtotalcash / 10000).toFixed(2)}元)\n`;
  }
  // if (typeof $.JdzzNum !== "undefined") {
  //     ReturnMessage += `京东赚赚：${$.JdzzNum}金币(≈${($.JdzzNum / 10000).toFixed(2)}元)\n`;
  // }
  if ($.JdMsScore != 0) {
    ReturnMessage += `京东秒杀：${$.JdMsScore}秒秒币(≈${($.JdMsScore / 1000).toFixed(2)}元)\n`;
  }
  if ($.JdFarmProdName != "") {
    if ($.JdtreeEnergy != 0) {
      ReturnMessage += `东东农场：${$.JdFarmProdName.replace(/(^\s*)|(\s*$)/g, "")},${(($.JdtreeEnergy / $.JdtreeTotalEnergy) * 100).toFixed(2)}%`;
      if ($.JdwaterD != 'Infinity' && $.JdwaterD != '-Infinity') {
        ReturnMessage += `,${$.JdwaterD === 1 ? '明天' : $.JdwaterD === 2 ? '后天' : $.JdwaterD + '天后'}可兑\n`;
      } else {
        ReturnMessage += `\n`;
      }
    } else {
      ReturnMessage += `东东农场：${$.JdFarmProdName.replace(/(^\s*)|(\s*$)/g, "")}\n`;
    }
  }

  const response = await PetRequest('energyCollect');
  const initPetTownRes = await PetRequest('initPetTown');
  if (initPetTownRes.code === '0' && initPetTownRes.resultCode === '0' && initPetTownRes.message === 'success') {
    $.petInfo = initPetTownRes.result;
    if (response.resultCode === '0') {
      ReturnMessage += `东东萌宠：${$.petInfo.goodsInfo.goodsName.replace(/(^\s*)|(\s*$)/g, "")},`;
      ReturnMessage += `${response.result.medalNum}/${response.result.medalNum + response.result.needCollectMedalNum}块,${((response.result.medalPercent / 100 + response.result.medalNum) / (response.result.medalNum + response.result.needCollectMedalNum) * 100).toFixed(2)}%\n`;
      //ReturnMessage += `          已有${response.result.medalNum}块勋章，还需${response.result.needCollectMedalNum}块\n`;
    }
  }

  if ($.jxFactoryInfo) {
    ReturnMessage += `京喜工厂：${$.jxFactoryInfo.replace(/(^\s*)|(\s*$)/g, "")}\n`
  }

  ReturnMessage += `[红包]红包明细[红包]`;

  let theMessage = ReturnMessage;

  if ($.eCardNum) $.message += `\n京东 E卡：${$.eCardNum}张、共${$.eCards}元`
  else $.message += `\n京东 E卡：0张`
  if ($.AccBalance) $.message += `\n${$.AccBalance}`
  if ($.WalletBalance) $.message += `\n${$.WalletBalance}`

  ReturnMessage += `${$.message}\n为了项目可持续性发展📣\n欢迎买东西走走群主返利🌈\n感谢您的支持!谢谢💗\n不走返利,[发怒]京豆会越来越少[发怒]哼！！`;
  allMessage += ReturnMessage;
  $.msg($.name, '', ReturnMessage, { "open-url": "https://bean.m.jd.com/beanDetail/index.action?resourceValue=bean" });
  let test = ReturnMessage
  const myRe = /(\S*)\$/gm;
  const myArray = content.toString().match(myRe)
  const wxidRe = /\$(.*)/gm;
  const wxidArray = content.toString().match(wxidRe)
  const emoji = /'🌅|🥉|🥇|🧧|☀|☁|☔|⛄|📣|💗|🌁|🍉|🈲|🌂|🐶|🌄|🌅|🏭|🌇|🌈|❄|⛅|🌉|💎|🌋|🌌|🌏|🌑|🌔|🌓|⚠|⚠️|🌙|⏫|⏬|🔺|🔻|🔼||👏|👌|💗|👐'/gm;
  const re_emoji = test.match(emoji)
  await new Promise(resolve => setTimeout(resolve, 70000));
  function wx_emoji(emo) {
    var val = "";
    for (var i = 0; i < emo.length; i++) {
      if (val == "")
        val = "\\u" + Number(emo.charCodeAt(i)).toString(16);
      else
        val += "\\u" + Number(emo.charCodeAt(i)).toString(16);
    }
    return '[@emoji=' + val + ']';
  }

  for (let num = 0; num < re_emoji.length; num++) {
    test = test.replace(re_emoji[num], wx_emoji(re_emoji[num]))
  }
  let result = test
  // console.log('test :  '+test)
  for (let a = 0; a < myArray.length; a++) {
    // console.log(typeof(test))
    let gg = myArray[a].replace('$', '')
    // console.log('gg : '+gg)
    let wxid = wxidArray[a].replace('$', '')
    if (test.includes(gg)) {
    //   console.log(wxid)
    //   const API_URL = "http://192.168.1.51:8090/"
    //   const headers = {
    //     // 'Content-Type':'application/json',
    //     'Host': '117.41.184.212:8090',
    //     'Name': 'iHttp',
    //     'Ver': '1.1.6.1',
    //     'Udid': '0b4891edc500803721b76cf782200fd3'
    //   };
    //   const dataString = { "event": "SendTextMsg", "robot_wxid": "wxid_p8geau233z3412", "to_wxid": wxid, "msg": result };
    //   const test_data = JSON.stringify(dataString)
    //   // console.log(test_data)
    //   const options = {
    //     url: API_URL,
    //     headers: headers,
    //     method: 'POST',
    //     body: test_data
    //   };
    //   $.get(options, (err, resp, data) => {
    //     try {
    //       if (err) {
    //         $.logErr(err)
    //       } else {
    //         console.log('success')
    //       }
    //     } catch (e) {
    //       $.logErr(e)
    //     }
    //   })
    // }
      console.log(wxid)
      const API_URL = "http://192.168.1.51:8000/"
      const headers = {
        'Host': '117.41.184.212:8090',
        'Name': 'iHttp',
        'Ver': '1.1.6.1',
        'Udid': '0b4891edc500803721b76cf782200fd3'
      };
      const dataString = {
        "action": "send_message",
        "params": {
            "detail_type": "private",
            "user_id ": wxid,
            "message": [
              {
                  "type": "text",
                  "data": {
                    "text": result
                  }
              }
            ]
        }
      };
      const test_data = JSON.stringify(dataString)
      const options = {
        url: API_URL,
        headers: headers,
        method: 'POST',
        body: test_data
      };
      $.get(options, (err, resp, data) => {
        try {
          if (err) {
            $.logErr(err)
          } else {
            console.log('success')
          }
        } catch (e) {
          $.logErr(e)
        }
      })
    }
  }

  if ($.isNode() && thefs.existsSync(thepath) && thenotifyTip) {
    console.log("\n单账号一对一通知")
    theMessage += `${$.message}`;
    let thenotify = require(thepath);
    await thenotify.sendNotify(`${$.name}`, `${theMessage}`);
  }
}
async function bean() {
  // console.log(`北京时间零点时间戳:${parseInt((Date.now() + 28800000) / 86400000) * 86400000 - 28800000}`);
  // console.log(`北京时间2020-10-28 06:16:05::${new Date("2020/10/28 06:16:05+08:00").getTime()}`)
  // 不管哪个时区。得到都是当前时刻北京时间的时间戳 new Date().getTime() + new Date().getTimezoneOffset()*60*1000 + 8*60*60*1000

  //前一天的0:0:0时间戳
  const tm = parseInt((Date.now() + 28800000) / 86400000) * 86400000 - 28800000 - (24 * 60 * 60 * 1000);
  // 今天0:0:0时间戳
  const tm1 = parseInt((Date.now() + 28800000) / 86400000) * 86400000 - 28800000;
  let page = 1, t = 0, yesterdayArr = [], todayArr = [];
  do {
    let response = await getJingBeanBalanceDetail(page);
    // console.log(`第${page}页: ${JSON.stringify(response)}`);
    if (response && response.code === "0") {
      page++;
      let detailList = response.jingDetailList;
      if (detailList && detailList.length > 0) {
        for (let item of detailList) {
          const date = item.date.replace(/-/g, '/') + "+08:00";
          if (new Date(date).getTime() >= tm1 && (!item['eventMassage'].includes("退还") && !item['eventMassage'].includes('扣赠'))) {
            todayArr.push(item);
          } else if (tm <= new Date(date).getTime() && new Date(date).getTime() < tm1 && (!item['eventMassage'].includes("退还") && !item['eventMassage'].includes('扣赠'))) {
            //昨日的
            yesterdayArr.push(item);
          } else if (tm > new Date(date).getTime()) {
            //前天的
            t = 1;
            break;
          }
        }
      } else {
        $.errorMsg = `bean: 数据异常`;
        $.msg($.name, ``, `账号${$.index}：${$.nickName}\n${$.errorMsg}`);
        t = 1;
      }
    } else if (response && response.code === "3") {
      console.log(`cookie已过期，或者填写不规范，跳出`)
      t = 1;
    } else {
      console.log(`未知情况：${JSON.stringify(response)}`);
      console.log(`未知情况，跳出`)
      t = 1;
    }
  } while (t === 0);
  for (let item of yesterdayArr) {
    if (Number(item.amount) > 0) {
      $.incomeBean += Number(item.amount);
    } else if (Number(item.amount) < 0) {
      $.expenseBean += Number(item.amount);
    }
  }
  for (let item of todayArr) {
    if (Number(item.amount) > 0) {
      $.todayIncomeBean += Number(item.amount);
    } else if (Number(item.amount) < 0) {
      $.todayOutcomeBean += Number(item.amount);
    }
  }
  $.todayOutcomeBean = -$.todayOutcomeBean;
  $.expenseBean = -$.expenseBean;
  await queryexpirejingdou();//过期京豆
  $.todayOutcomeBean = $.todayOutcomeBean + $.expirejingdou;
  await redPacket(); //过期红包
  // console.log(`昨日收入：${$.incomeBean}个京豆 🐶`);
  // console.log(`昨日支出：${$.expenseBean}个京豆 🐶`)
}

function GetJxBeanInfo() {
  return new Promise((resolve) => {
    const options = {
      url: "https://api.jingxi.com/api?functionId=myassets.queryBeanBalance&appid=jx_h5&t=1683638702064&channel=jxapp&cv=1.2.5&clientVersion=1.2.5&client=jxapp&uuid=28014637690804507&cthr=1&loginType=2&body=%7B%22sceneval%22%3A2%2C%22buid%22%3A325%2C%22appCode%22%3A%22msd1188198%22%2C%22time%22%3A1683638702064%2C%22signStr%22%3A%22a5039d6248f173e75c08245e26cb66c9%22%7D",
      headers: {
        "Host": "api.jingxi.com",
        "Accept": "*/*",
        "Connection": "keep-alive",
        "Cookie": cookie,
        "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
        "Accept-Language": "zh-CN,zh-Hans;q=0.9",
        "Referer": "https://st.jingxi.com/",
        "Accept-Encoding": "gzip, deflate, br"
      }
    }
    $.get(options, async (err, resp, data) => {
      try {
        if (err) {
          // console.log(JSON.stringify(err));
          console.log(`喜豆查询: API请求失败，请检查网路重试\n`);
        } else {
          if (data) {
            data = JSON.parse(data)
            if (data.errcode == 0) {
              $.jxbeanCount = data.data.xiBeanNum;
              if (!$.beanCount) {
                $.beanCount = data.data.jingBeanNum;
              }
            }
          }
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve(data);
      }
    });
  });
}
async function jxbean() {
  //前一天的0:0:0时间戳
  const tm = parseInt((Date.now() + 28800000) / 86400000) * 86400000 - 28800000 - (24 * 60 * 60 * 1000);
  // 今天0:0:0时间戳
  const tm1 = parseInt((Date.now() + 28800000) / 86400000) * 86400000 - 28800000;
  var JxYesterdayArr = [],
    JxTodayArr = [];
  var JxResponse = await GetJxBeanDetailData();
  if (JxResponse && JxResponse.ret == "0") {
    var Jxdetail = JxResponse.detail;
    if (Jxdetail && Jxdetail.length > 0) {
      for (let item of Jxdetail) {
        const date = item.createdate.replace(/-/g, '/') + "+08:00";
        if (new Date(date).getTime() >= tm1 && (!item['visibleinfo'].includes("退还") && !item['visibleinfo'].includes('扣赠'))) {
          JxTodayArr.push(item);
        } else if (tm <= new Date(date).getTime() && new Date(date).getTime() < tm1 && (!item['visibleinfo'].includes("退还") && !item['visibleinfo'].includes('扣赠'))) {
          //昨日的
          JxYesterdayArr.push(item);
        } else if (tm > new Date(date).getTime()) {
          break;
        }
      }
    } else {
      // $.errorMsg = `数据异常`;
      // $.msg($.name, ``, `账号${$.index}：${$.nickName}\n${$.errorMsg}`);
    }
    for (let item of JxYesterdayArr) {
      if (Number(item.amount) > 0) {
        $.InjxBean += Number(item.amount);
      } else if (Number(item.amount) < 0) {
        $.OutjxBean += Number(item.amount);
      }
    }
    for (let item of JxTodayArr) {
      if (Number(item.amount) > 0) {
        $.todayInjxBean += Number(item.amount);
      } else if (Number(item.amount) < 0) {
        $.todayOutjxBean += Number(item.amount);
      }
    }
    $.todayOutjxBean = -$.todayOutjxBean;
    $.OutjxBean = -$.OutjxBean;
  }
}


function taskJxUrl(functionId, body = '') {
  let url = ``;
  var UA = `jdpingou;iPhone;4.13.0;14.4.2;${randomString(40)};network/wifi;model/iPhone10,2;appBuild/100609;supportApplePay/1;hasUPPay/0;pushNoticeIsOpen/1;hasOCPay/0;supportBestPay/0;session/${Math.random * 98 + 1};pap/JA2019_3111789;brand/apple;supportJDSHWK/1;Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148`;

  if (body) {
    url = `https://m.jingxi.com/activeapi/${functionId}?${body}`;
    url += `&_=${Date.now() + 2}&sceneval=2&g_login_type=1&callback=jsonpCBK${String.fromCharCode(Math.floor(Math.random() * 26) + "A".charCodeAt(0))}&g_ty=ls`;
  } else {
    url = `https://m.jingxi.com/activeapi/${functionId}?_=${Date.now() + 2}&sceneval=2&g_login_type=1&callback=jsonpCBK${String.fromCharCode(Math.floor(Math.random() * 26) + "A".charCodeAt(0))}&g_ty=ls`;
  }
  return {
    url,
    headers: {
      "Host": "m.jingxi.com",
      "Accept": "*/*",
      "Accept-Encoding": "gzip, deflate, br",
      "User-Agent": UA,
      "Accept-Language": "zh-CN,zh-Hans;q=0.9",
      "Referer": "https://st.jingxi.com/",
      "Cookie": cookie
    }
  }
}

function GetJxBeanDetailData() {
  return new Promise((resolve) => {
    $.get(taskJxUrl("queryuserjingdoudetail", "pagesize=10&type=16"), async (err, resp, data) => {
      try {
        if (err) {
          // console.log(JSON.stringify(err));
          console.log(`GetJxBeanDetailData: API请求失败，请检查网路重试`);
        } else {
          data = JSON.parse(data.match(new RegExp(/jsonpCBK.?\((.*);*/))[1]);

        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve(data);
      }
    });
  });
}


function TotalBean() {
  return new Promise(async resolve => {
    const options = {
      url: "https://me-api.jd.com/user_new/info/GetJDUserInfoUnion",
      headers: {
        Host: "me-api.jd.com",
        Accept: "*/*",
        Connection: "keep-alive",
        Cookie: cookie,
        "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
        "Accept-Language": "zh-cn",
        "Referer": "https://home.m.jd.com/myJd/newhome.action?sceneval=2&ufc=&",
        "Accept-Encoding": "gzip, deflate, br"
      }
    }
    $.get(options, (err, resp, data) => {
      try {
        if (err) {
          console.log("TotalBean请求失败:", JSON.stringify(err))
        } else {
          let res = $.toObj(data, data)
          if (typeof res == 'object') {
            if (res['retcode'] === "1001") {
              $.isLogin = false; //cookie过期
              return;
            }
            if (res['retcode'] === "0" && res.data && res.data.hasOwnProperty("userInfo")) {
              $.nickName = res.data.userInfo.baseInfo.nickname;
              $.levelName = res.data.userInfo.baseInfo.levelName;
              $.isPlusVip = res.data.userInfo.isPlusVip;
            }
            if (res['retcode'] === '0' && res.data && res.data['assetInfo']) {
              $.beanCount = res.data && res.data['assetInfo']['beanNum'];
            } else {
              $.errorMsg = `TotalBean: 数据异常`;
            }
          } else {
            $.log('TotalBean 京东服务器返回空数据,将无法获取等级及VIP信息');
          }
        }
      } catch (e) {
        $.logErr(e)
      }
      finally {
        resolve();
      }
    })
  })
}

function TotalBean2() {
  return new Promise(async (resolve) => {

    const options = {
      url: `https://wq.jd.com/user/info/QueryJDUserInfo?sceneval=2`,
      headers: {
        Cookie: cookie,
        "Host": "wq.jd.com",
        "Connection": "keep-alive",
        "Content-Type": "application/x-www-form-urlencoded;",
        "Accept-Encoding": "gzip, deflate, br",
        'Referer': 'https://wqs.jd.com/',
        'User-Agent': $.UA,
      },
    };
    $.post(options, (err, resp, data) => {
      try {
        if (err) {
          console.log("TotalBean2请求失败:", JSON.stringify(err))
        } else {
          if (data) {
            data = JSON.parse(data);
            // if (!data.user) {
            //     $.isLogin = false; //cookie过期
            //     return;
            // }
            if (data?.base) {
              if (!$.nickName)
                $.nickName = data.base.nickname || ""
              if ($.beanCount == 0) {
                $.beanCount = data.base.jdNum || 0
              }
              $.isPlusVip = data.isPlusVip ? 1 : 3
              $.JingXiang = data.base.jvalue || ""
            }
          } else {
            $.log('京东服务器返回空数据');
          }
        }
      } catch (e) {
        $.logErr(e);
      }
      finally {
        resolve();
      }
    });
  });
}

function getJingBeanBalanceDetail(page) {
  return new Promise(async resolve => {
    const options = {
      "url": `https://bean.m.jd.com/beanDetail/detail.json?page=${page}`,
      "headers": {
        'User-Agent': $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
        "Connection": 'keep-alive',
        "Content-Type": "application/x-www-form-urlencoded;",
        'Cookie': cookie,
      }
    }
    $.post(options, (err, resp, data) => {
      try {
        if (err) {
          // console.log(`${JSON.stringify(err)}`)
          console.log(`京豆查询: API请求失败，请检查网路重试\n`)
        } else {
          if (data) {
            data = JSON.parse(data);
            // console.log(data)
          } else {
            console.log(`京东服务器返回空数据`)
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data);
      }
    })
  })
}

async function queryexpirejingdou(f = 0) {
  $.expirejingdou = 0;
  let functionId = 'jingBeanDetail'
  let body = { "pageSize": 20, "pageNo": 1 }
  let sign = await getSign(functionId, body)
  if (!sign) { console.log(`过期京豆查询: 获取sign失败`); return }
  return new Promise(async resolve => {
    let options = {
      'url': `https://api.m.jd.com/client.action?functionId=jingBeanDetail&lmt=0&${sign}`,
      'headers': {
        'Cookie': cookie,
        'Host': 'api.m.jd.com',
        'Connection': 'keep-alive',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'User-Agent': 'JD4iPhone/167814 (iPhone; iOS; Scale/2.00)',
        'Accept-Language': 'zh-Hans-CN;q=1',
        'Accept-Encoding': 'gzip, deflate, br',
      }
    }
    $.get(options, async (err, resp, data) => {
      try {
        if (err) {
          if (f < 3) {
            f = f + 1
            await $.wait(2000)
            await queryexpirejingdou(f)
          } else {
            console.log(`过期京豆查询: 3次API请求失败，请检查网路重试\n`)
          }
        } else {
          // console.log(data)
          let res = $.toObj(data, data)
          if (typeof res == 'object') {
            if (res.code == 0 && res.others) {
              let thisTime = $.time("yyyy-MM-dd", Date.now())
              let expireArr = {}
              let msg = res.others.jingBeanExpire?.title ? res.others.jingBeanExpire.title + '\n' : (res.others.jingBeanExpiringInfo?.text ? res.others.jingBeanExpiringInfo.text + '\n' : "")
              console.log(msg)
              if (res.others.jingBeanExpiringInfo && res.others.jingBeanExpiringInfo.detailList && res.others.jingBeanExpiringInfo.detailList.length) {
                let detailList = res.others.jingBeanExpiringInfo.detailList.reverse()
                for (let i of detailList) {
                  let expireamount = Number(i.amount)
                  let msg = i.eventMassage.replace(/年/g, "-").replace(/月/g, "-").replace(/日/g, " ").replace(/即将/g, "")
                  let dataStr = msg.match(/([^\s]+)(?=\s)/) && msg.match(/([^\s]+)(?=\s)/)[1] || ""
                  if (dataStr) expireArr[dataStr] = expireamount
                }
              }
              if (Object.keys(expireArr).length != 0) for (let i in expireArr) console.log(`${i} 过期京豆：${expireArr[i]}`)
              if (expireArr.hasOwnProperty(thisTime)) $.expirejingdou = expireArr[thisTime]
            }
          } else {
            console.log(`过期京豆查询 京东服务器返回空数据`)
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}


function redPacket() {
  return new Promise(async resolve => {
    const options = {
      "url": `https://api.m.jd.com/client.action?functionId=myhongbao_getUsableHongBaoList&body=%7B%22appId%22%3A%22appHongBao%22%2C%22appToken%22%3A%22apphongbao_token%22%2C%22platformId%22%3A%22appHongBao%22%2C%22platformToken%22%3A%22apphongbao_token%22%2C%22platform%22%3A%221%22%2C%22orgType%22%3A%222%22%2C%22country%22%3A%22cn%22%2C%22childActivityId%22%3A%22-1%22%2C%22childActiveName%22%3A%22-1%22%2C%22childActivityTime%22%3A%22-1%22%2C%22childActivityUrl%22%3A%22-1%22%2C%22openId%22%3A%22-1%22%2C%22activityArea%22%3A%22-1%22%2C%22applicantErp%22%3A%22-1%22%2C%22eid%22%3A%22-1%22%2C%22fp%22%3A%22-1%22%2C%22shshshfp%22%3A%22-1%22%2C%22shshshfpa%22%3A%22-1%22%2C%22shshshfpb%22%3A%22-1%22%2C%22jda%22%3A%22-1%22%2C%22activityType%22%3A%221%22%2C%22isRvc%22%3A%22-1%22%2C%22pageClickKey%22%3A%22-1%22%2C%22extend%22%3A%22-1%22%2C%22organization%22%3A%22JD%22%7D&appid=JDReactMyRedEnvelope&client=apple&clientVersion=7.0.0`,
      "headers": {
        'Host': 'api.m.jd.com',
        'Accept': '*/*',
        'Connection': 'keep-alive',
        'Accept-Language': 'zh-cn',
        'Referer': 'https://h5.m.jd.com/',
        'Accept-Encoding': 'gzip, deflate, br',
        "Cookie": cookie,
        'User-Agent': $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1")
      }
    }
    $.get(options, (err, resp, data) => {
      try {
        if (err) {
          // console.log(`${JSON.stringify(err)}`)
          console.log(`红包查询: API请求失败，请检查网路重试\n`)
        } else {
          if (data) {
            // console.log(data)
            data = JSON.parse(data)
            $.jxRed = 0, $.jsRed = 0, $.jdRed = 0, $.jdhRed = 0, $.jxRedExpire = 0, $.jsRedExpire = 0, $.jdRedExpire = 0, $.jdhRedExpire = 0;
            let thisTime = $.time("yyyy/MM/dd", Date.now())
            thisTime = `${thisTime} 23:59:59`
            let t = new Date(thisTime).getTime()
            for (let vo of data.hongBaoList || []) {
              if (vo.orgLimitStr && /(极速|京东特价|京喜特价)/g.test(vo.orgLimitStr)) {
                $.jsRed += parseFloat(vo.balance)
                if (vo['endTime'] === t) {
                  $.jsRedExpire += parseFloat(vo.balance)
                }
              } else if (vo.orgLimitStr && vo.orgLimitStr.includes("京喜")) {
                $.jxRed += parseFloat(vo.balance)
                if (vo['endTime'] === t) {
                  $.jxRedExpire += parseFloat(vo.balance)
                }
              } else if (vo.orgLimitStr && vo.orgLimitStr.includes("京东健康")) {
                $.jdhRed += parseFloat(vo.balance)
                if (vo['endTime'] === t) {
                  $.jdhRedExpire += parseFloat(vo.balance)
                }
              } else {
                $.jdRed += parseFloat(vo.balance)
                if (vo['endTime'] === t) {
                  $.jdRedExpire += parseFloat(vo.balance)
                }
              }
            }
            // $.balance = data.balance
            $.balance = ($.jxRed + $.jsRed + $.jdRed + $.jdhRed).toFixed(2)
            $.jxRed = $.jxRed.toFixed(2)
            $.jsRed = $.jsRed.toFixed(2)
            $.jdRed = $.jdRed.toFixed(2)
            $.jdhRed = $.jdhRed.toFixed(2)
            $.expiredBalance = ($.jxRedExpire + $.jsRedExpire + $.jdRedExpire).toFixed(2)
            $.message += `\n总计红包：${$.balance}(总过期${$.expiredBalance})元\n京东红包：${$.jdRed}(将过期${$.jdRedExpire.toFixed(2)})元\n京喜红包：${$.jxRed}(将过期${$.jxRedExpire.toFixed(2)})元\n特价红包：${$.jsRed}(将过期${$.jsRedExpire.toFixed(2)})元`;
          } else {
            console.log(`京东服务器返回空数据`)
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data);
      }
    })
  })
}

function getJdZZ() {
  return new Promise(resolve => {
    $.get(taskJDZZUrl("interactTaskIndex"), async (err, resp, data) => {
      try {
        if (err) {
          // console.log(`${JSON.stringify(err)}`)
          console.log(`京东赚赚: API请求失败，请检查网路重试\n`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            $.JdzzNum = data.data.totalNum
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data);
      }
    })
  })
}

function taskJDZZUrl(functionId, body = {}) {
  return {
    url: `${JD_API_HOST}?functionId=${functionId}&body=${escape(JSON.stringify(body))}&client=wh5&clientVersion=9.1.0`,
    headers: {
      'Cookie': cookie,
      'Host': 'api.m.jd.com',
      'Connection': 'keep-alive',
      'Content-Type': 'application/json',
      'Referer': 'http://wq.jd.com/wxapp/pages/hd-interaction/index/index',
      'User-Agent': $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
      'Accept-Language': 'zh-cn',
      'Accept-Encoding': 'gzip, deflate, br',
    }
  }
}

function getMs() {
  return new Promise(resolve => {
    $.post(taskMsPostUrl('homePageV2', {}, 'appid=SecKill2020'), (err, resp, data) => {
      try {
        if (err) {
          // console.log(`${err},${jsonParse(resp.body)['message']}`)
          console.log(`秒秒币: API请求失败，请检查网路重试\n`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data)
            if (data?.result?.assignment?.assignmentPoints || data.code === 2060) {
              $.JdMsScore = data.result.assignment.assignmentPoints || 0
            }
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data);
      }
    })
  })
}


function taskMsPostUrl(function_id, body = {}, extra = '', function_id2) {
  let url = `${JD_API_HOST}`;
  if (function_id2) {
    url += `?functionId=${function_id2}`;
  }
  return {
    url,
    body: `functionId=${function_id}&body=${escape(JSON.stringify(body))}&client=wh5&clientVersion=1.0.0&${extra}`,
    headers: {
      "Cookie": cookie,
      "origin": "https://h5.m.jd.com",
      "referer": "https://h5.m.jd.com/babelDiy/Zeus/2NUvze9e1uWf4amBhe1AV6ynmSuH/index.html",
      'Content-Type': 'application/x-www-form-urlencoded',
      "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
    }
  }
}

async function getjdfruit() {
  return new Promise(resolve => {
    const option = {
      url: `${JD_API_HOST}?functionId=initForFarm`,
      body: `body=${escape(JSON.stringify({ "version": 4 }))}&appid=wh5&clientVersion=9.1.0`,
      headers: {
        "accept": "*/*",
        "accept-encoding": "gzip, deflate, br",
        "accept-language": "zh-CN,zh;q=0.9",
        "cache-control": "no-cache",
        "cookie": cookie,
        "origin": "https://home.m.jd.com",
        "pragma": "no-cache",
        "referer": "https://home.m.jd.com/myJd/newhome.action",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
        "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
        "Content-Type": "application/x-www-form-urlencoded"
      },
      timeout: 10000,
    };
    $.post(option, (err, resp, data) => {
      try {
        if (err) {
          console.log('东东农场: API请求失败，请检查网路重试\n');
          // console.log(JSON.stringify(err));
          // $.logErr(err);
        } else {
          if (safeGet(data)) {
            $.farmInfo = JSON.parse(data)
            if ($.farmInfo.farmUserPro) {
              $.JdFarmProdName = $.farmInfo.farmUserPro.name;
              $.JdtreeEnergy = $.farmInfo.farmUserPro.treeEnergy;
              $.JdtreeTotalEnergy = $.farmInfo.farmUserPro.treeTotalEnergy;

              let waterEveryDayT = $.JDwaterEveryDayT;
              let waterTotalT = ($.farmInfo.farmUserPro.treeTotalEnergy - $.farmInfo.farmUserPro.treeEnergy - $.farmInfo.farmUserPro.totalEnergy) / 10;//一共还需浇多少次水
              let waterD = Math.ceil(waterTotalT / waterEveryDayT);

              $.JdwaterTotalT = waterTotalT;
              $.JdwaterD = waterD;
            }
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}

function jdfruitRequest(function_id, body = {}, timeout = 1000) {
  return new Promise(resolve => {
    setTimeout(() => {
      $.get(taskfruitUrl(function_id, body), (err, resp, data) => {
        try {
          if (err) {
            // console.log('东东农场:API请求失败，请检查网路重试\n')
            // console.log(JSON.stringify(err));
            // console.log(`function_id:${function_id}`)
          } else {
            if (safeGet(data)) {
              data = JSON.parse(data);
              $.JDwaterEveryDayT = data?.totalWaterTaskInit?.totalWaterTaskTimes || 0;
            }
          }
        } catch (e) {
          $.logErr(e, resp);
        } finally {
          resolve(data);
        }
      })
    }, timeout)
  })
}


async function PetRequest(function_id, body = {}) {
  await $.wait(3000);
  return new Promise((resolve, reject) => {
    $.post(taskPetUrl(function_id, body), (err, resp, data) => {
      try {
        if (err) {
          console.log('东东萌宠: API请求失败，请检查网路重试\n');
          // console.log(JSON.stringify(err));
          // $.logErr(err);
        } else {
          data = JSON.parse(data);
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve(data)
      }
    })
  })
}
function taskPetUrl(function_id, body = {}) {
  body["version"] = 2;
  body["channel"] = 'app';
  return {
    url: `${JD_API_HOST}?functionId=${function_id}`,
    body: `body=${escape(JSON.stringify(body))}&appid=wh5&loginWQBiz=pet-town&clientVersion=9.0.4`,
    headers: {
      'Cookie': cookie,
      'User-Agent': $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
      'Host': 'api.m.jd.com',
      'Content-Type': 'application/x-www-form-urlencoded',
    }
  };
}

function taskfruitUrl(function_id, body = {}) {
  return {
    url: `${JD_API_HOST}?functionId=${function_id}&appid=wh5&body=${escape(JSON.stringify(body))}`,
    headers: {
      Cookie: cookie,
      UserAgent: $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
    },
    timeout: 10000,
  }
}

function safeGet(data) {
  try {
    if (typeof JSON.parse(data) == "object") {
      return true;
    }
  } catch (e) {
    console.log(e);
    console.log(`京东服务器访问数据为空，请检查自身设备网络情况`);
    return false;
  }
}

function cash() {
  return new Promise(resolve => {
    $.get(taskcashUrl('MyAssetsService.execute',
      { "method": "userCashRecord", "data": { "channel": 1, "pageNum": 1, "pageSize": 20 } }),
      async (err, resp, data) => {
        try {
          if (err) {
            // console.log(`${JSON.stringify(err)}`)
            console.log(`极速金币: API请求失败，请检查网路重试\n`)
          } else {
            if (safeGet(data)) {
              data = JSON.parse(data);
              $.JDtotalcash = data.data.goldBalance;
            }
          }
        } catch (e) {
          $.logErr(e, resp)
        } finally {
          resolve(data);
        }
      })
  })
}

//领现金
async function TotalMoney() {
  let functionId = "cash_homePage"
  let body = {}
  $.hasSign = true
  let sign = await getSign(functionId, body)
  if (!$.hasSign) sign = `body=%7B%7D&build=167968&client=apple&clientVersion=10.4.0&d_brand=apple&d_model=iPhone13%2C3&ef=1&eid=eidI25488122a6s9Uqq6qodtQx6rgQhFlHkaE1KqvCRbzRnPZgP/93P%2BzfeY8nyrCw1FMzlQ1pE4X9JdmFEYKWdd1VxutadX0iJ6xedL%2BVBrSHCeDGV1&ep=%7B%22ciphertype%22%3A5%2C%22cipher%22%3A%7B%22screen%22%3A%22CJO3CMeyDJCy%22%2C%22osVersion%22%3A%22CJUkDK%3D%3D%22%2C%22openudid%22%3A%22CJSmCWU0DNYnYtS0DtGmCJY0YJcmDwCmYJC0DNHwZNc5ZQU2DJc3Zq%3D%3D%22%2C%22area%22%3A%22CJZpCJCmC180ENcnCv80ENc1EK%3D%3D%22%2C%22uuid%22%3A%22aQf1ZRdxb2r4ovZ1EJZhcxYlVNZSZz09%22%7D%2C%22ts%22%3A1648428189%2C%22hdid%22%3A%22JM9F1ywUPwflvMIpYPok0tt5k9kW4ArJEU3lfLhxBqw%3D%22%2C%22version%22%3A%221.0.3%22%2C%22appname%22%3A%22com.360buy.jdmobile%22%2C%22ridx%22%3A-1%7D&ext=%7B%22prstate%22%3A%220%22%2C%22pvcStu%22%3A%221%22%7D&isBackground=N&joycious=104&lang=zh_CN&networkType=3g&networklibtype=JDNetworkBaseAF&partner=apple&rfs=0000&scope=11&sign=98c0ea91318ef1313786d86d832f1d4d&st=1648428208392&sv=101&uemps=0-0&uts=0f31TVRjBSv7E8yLFU2g86XnPdLdKKyuazYDek9RnAdkKCbH50GbhlCSab3I2jwM04d75h5qDPiLMTl0I3dvlb3OFGnqX9NrfHUwDOpTEaxACTwWl6n//EOFSpqtKDhg%2BvlR1wAh0RSZ3J87iAf36Ce6nonmQvQAva7GoJM9Nbtdah0dgzXboUL2m5YqrJ1hWoxhCecLcrUWWbHTyAY3Rw%3D%3D`
  return new Promise((resolve) => {
    $.post(apptaskUrl(functionId, sign), async (err, resp, data) => {
      try {
        if (err) {
          // console.log(`${JSON.stringify(err)}`)
          console.log(`签到领现金: API请求失败，请检查网路重试\n`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data.code === 0 && data.data.result) {
              $.TotalMoney = data.data.result.totalMoney || 0
            } else {
              console.log(`签到领现金: 查询失败 ${JSON.stringify(data)}\n`)
            }
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data);
      }
    })
  })
}


function getECard() {
  return new Promise(resolve => {
    let options = {
      url: `https://mygiftcard.jd.com/giftcard/queryGiftCardCountStatusCom/app?source=JDAP`,
      body: `queryList=a%2Cb%2Cc%2Cd%2Ce%2Cf`,
      headers: {
        "Accept": "*/*",
        "Accept-Language": "zh-cn",
        "Accept-Encoding": "gzip, deflate, br",
        "Connection": "keep-alive",
        'Content-Type': 'application/x-www-form-urlencoded',
        'Host': 'mygiftcard.jd.com',
        'Cookie': cookie,
        'User-Agent': $.UA,
        'origin': 'https://mygiftcard.jd.com',
      }
    }
    $.post(options, async (err, resp, data) => {
      try {
        if (err) {
          // console.log(`${JSON.stringify(err)}`)
        } else {
          let res = $.toObj(data, data)
          if (typeof res == 'object') {
            if (res.code == "success" && res.data)
              $.eCards = res.data.a
            $.eCardNum = Number(res.data.b)
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}


function getAccBalance() {
  return new Promise(resolve => {
    let options = {
      url: `https://ms.jr.jd.com/gw/generic/jrm/h5/m/queryUserAccBalance`,
      body: `reqData=&source=jrm`,
      headers: {
        "Accept": "*/*",
        "Accept-Language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
        "Accept": "application/json",
        "Accept-Encoding": "gzip, deflate, br",
        "Connection": "keep-alive",
        "Content-Type": 'application/x-www-form-urlencoded',
        "Host": 'ms.jr.jd.com',
        "Cookie": cookie,
        "User-Agent": $.UA,
        "origin": "https://m.jr.jd.com",
        "Referer": "https://m.jr.jd.com/",
      }
    };
    $.post(options, async (err, resp, data) => {
      try {
        if (err) {
          // console.log(err);
        } else {
          let res = $.toObj(data, data)
          if (res.resultCode == 0 && res.resultData && res.resultData.data) {
            $.AccBalance = `账户余额：${res.resultData.data.balance.toFixed(2)}元`
          }
        }
      } catch (e) {
        console.log(e, resp);
      } finally {
        resolve();
      }
    });
  });
}

function queryScore() {
  return new Promise(resolve => {
    let options = {
      url: `https://rsp.jd.com/windControl/queryScore/v1?lt=m&an=plus.mobile&stamp=${Date.now()}`,
      headers: {
        'Cookie': cookie,
        'User-Agent': $.UA,
        'Referer': 'https://plus.m.jd.com/rights/windControl'
      }
    };
    $.get(options, async (err, resp, data) => {
      try {
        if (err) {
          // console.log(err);
        } else {
          let res = $.toObj(data, data)
          if (res.code == 1000) $.totalScore = res.rs?.userSynthesizeScore?.totalScore || 0
        }
      } catch (e) {
        console.log(e, resp);
      } finally {
        resolve();
      }
    });
  });
}

function getBalance() {
  return new Promise(resolve => {
    let options = {
      url: `https://ms.jr.jd.com/gw/generic/base/h5/m/queryBalance`,
      body: `reqData=&source=jrm`,
      headers: {
        "Accept": "*/*",
        "Accept-Language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
        "Accept": "application/json",
        "Accept-Encoding": "gzip, deflate, br",
        "Connection": "keep-alive",
        "Content-Type": 'application/x-www-form-urlencoded',
        "Host": 'ms.jr.jd.com',
        "Cookie": cookie,
        "User-Agent": $.UA,
        "origin": "https://m.jr.jd.com",
        "Referer": "https://m.jr.jd.com/",
      }
    };
    $.post(options, async (err, resp, data) => {
      try {
        if (err) {
          // console.log(err);
        } else {
          let res = $.toObj(data, data)
          if (res.resultCode == 0 && res.resultData) {
            if (res.resultData.qianbaoAccountExist) {
              $.WalletBalance = `钱包余额：${(res.resultData.qianbaoTotalBalance / 100).toFixed(2)}元`
            } else {
              $.WalletBalance = `钱包余额：未开通钱包`
            }
          }
        }
      } catch (e) {
        console.log(e, resp);
      } finally {
        resolve();
      }
    });
  });
}


function getSign(functionId, body) {
  let sign = ''
  let flag = false
  try {
    const fs = require('fs');
    if (fs.existsSync('./gua_encryption_sign.js')) {
      const encryptionSign = require('./gua_encryption_sign');
      sign = encryptionSign.getSign(functionId, body)
    } else {
      flag = true
    }
    sign = sign.data && sign.data.sign && sign.data.sign || ''
  } catch (e) {
    flag = true
  }
  if (!flag) return sign
  if (!jdSignUrl.match(/^https?:\/\//)) {
    console.log('请填写算法url')
    $.out = true
    return ''
  }
  return new Promise((resolve) => {
    let options = {
      url: jdSignUrl,
      body: JSON.stringify({ "fn": functionId, "body": body }),
      followRedirect: false,
      headers: {
        'Accept': '*/*',
        "accept-encoding": "gzip, deflate, br",
        'Content-Type': 'application/json',
      },
      timeout: 30000
    }
    if (Authorization) options["headers"]["Authorization"] = Authorization
    $.post(options, async (err, resp, data) => {
      try {
        // console.log(data)
        if (err) {
          $.hasSign = false
          console.log(`getSign API请求失败，请检查网路重试`)
        } else {
          let res = $.toObj(data, data)
          if (typeof res === 'object' && res) {
            if (res.code && res.code == 200 && res.data) {
              if (res.data.sign) sign = res.data.sign || ''
              if (sign != '') resolve(sign)
            } else {
              console.log(data)
            }
          } else {
            console.log(data)
          }
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve('')
      }
    })
  })
}


function apptaskUrl(functionId = "", body = "") {
  return {
    url: `https://api.m.jd.com/client.action?functionId=${functionId}`,
    body,
    headers: {
      'Cookie': cookie,
      'Host': 'api.m.jd.com',
      'Connection': 'keep-alive',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Referer': '',
      'User-Agent': 'JD4iPhone/167774 (iPhone; iOS 14.7.1; Scale/3.00)',
      'Accept-Language': 'zh-Hans-CN;q=1',
      'Accept-Encoding': 'gzip, deflate, br',
    }
  }
}


function taskcashUrl(functionId, body = {}) {
  let struuid = randomString(16);
  let nowTime = Date.now();
  let test = `${"lite-android&"}${JSON["stringify"](body)}${"&android&3.1.0&"}${functionId}&${nowTime}&${struuid}`;
  let secret = "12aea658f76e453faf803d15c40a72e0";
  let cryptoJs = $["isNode"]() ? require("crypto-js") : CryptoJS;
  let sign = cryptoJs.HmacSHA256(test, secret).toString();
  let strurl = JD_API_HOST + "api?functionId=" + functionId + "&body=" + `${escape(JSON["stringify"](body))}&appid=lite-android&client=android&uuid=` + struuid + `&clientVersion=3.1.0&t=${nowTime}&sign=${sign}`;
  return {
    url: strurl,
    headers: {
      'Host': "api.m.jd.com",
      'accept': "*/*",
      'kernelplatform': "RN",
      'user-agent': "JDMobileLite/3.1.0 (iPad; iOS 14.4; Scale/2.00)",
      'accept-language': "zh-Hans-CN;q=1, ja-CN;q=0.9",
      'Cookie': cookie
    },
    timeout: 10000
  }
}

async function JxmcGetRequest() {
  let url = ``;
  let myRequest = ``;
  url = `https://m.jingxi.com/jxmc/queryservice/GetHomePageInfo?channel=7&sceneid=1001&activeid=null&activekey=null&isgift=1&isquerypicksite=1&_stk=channel%2Csceneid&_ste=1`;
  url += `&h5st=${decrypt(Date.now(), '', '', url)}&_=${Date.now() + 2}&sceneval=2&g_login_type=1&callback=jsonpCBK${String.fromCharCode(Math.floor(Math.random() * 26) + "A".charCodeAt(0))}&g_ty=ls`;
  myRequest = getGetRequest(`GetHomePageInfo`, url);


  return new Promise(async resolve => {
    $.get(myRequest, (err, resp, data) => {
      try {
        if (err) {
          // console.log(`${JSON.stringify(err)}`)
          console.log(`牧场鸡蛋: API请求失败，请检查网路重试\n`)
          $.runFlag = false;
        } else {
          data = JSON.parse(data.match(new RegExp(/jsonpCBK.?\((.*);*/))[1]);
          if (data.ret === 0) {
            $.JDEggcnt = data.data.eggcnt;
          }
        }
      } catch (e) {
        console.log(data);
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}

// 京喜工厂信息查询
function getJxFactory() {
  return new Promise(async resolve => {
    let infoMsg = "";
    await $.get(jxTaskurl('userinfo/GetUserInfo', `pin=&sharePin=&shareType=&materialTuanPin=&materialTuanId=&source=`, '_time,materialTuanId,materialTuanPin,pin,sharePin,shareType,source,zone'), async (err, resp, data) => {
      try {
        if (err) {
          $.jxFactoryInfo = "查询失败!";
          //console.log("jx工厂查询失败"  + err)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data['ret'] === 0) {
              data = data['data'];
              $.unActive = true;//标记是否开启了京喜活动或者选购了商品进行生产
              if (data.factoryList && data.productionList) {
                const production = data.productionList[0];
                const factory = data.factoryList[0];
                //const productionStage = data.productionStage;
                $.commodityDimId = production.commodityDimId;
                // subTitle = data.user.pin;
                await GetCommodityDetails();//获取已选购的商品信息
                infoMsg = `${$.jxProductName} ,${((production.investedElectric / production.needElectric) * 100).toFixed(2)}%`;
                if (production.investedElectric >= production.needElectric) {
                  if (production['exchangeStatus'] === 1) {
                    infoMsg = `${$.jxProductName} ,已可兑换‼️`;
                  }
                  if (production['exchangeStatus'] === 3) {
                    if (new Date().getHours() === 9) {
                      infoMsg = `${$.jxProductName} ,兑换已超时‼️`;
                    }
                  }
                  // await exchangeProNotify()
                } else {
                  infoMsg += ` ,${((production.needElectric - production.investedElectric) / (2 * 60 * 60 * 24)).toFixed(2)}天可兑`
                }
                if (production.status === 3) {
                  infoMsg = `${$.jxProductName} ,已超时失效‼️`
                }
              } else {
                $.unActive = false;//标记是否开启了京喜活动或者选购了商品进行生产
                if (!data.factoryList) {
                  infoMsg = "未生产商品"
                  // $.msg($.name, '【提示】', `京东账号${$.index}[${$.nickName}]京喜工厂活动未开始\n请手动去京喜APP->我的->京喜工厂 开启活动`);
                } else if (data.factoryList && !data.productionList) {
                  infoMsg = "未生产商品"
                }
              }
            }
          } else {
            console.log(`GetUserInfo异常：${JSON.stringify(data)}`)
          }
        }
        $.jxFactoryInfo = infoMsg;
        // console.log(infoMsg);
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  }
  )
}
// 京喜的Taskurl
function jxTaskurl(functionId, body = '', stk) {
  let url = `https://m.jingxi.com/dreamfactory/${functionId}?zone=dream_factory&${body}&sceneval=2&g_login_type=1&_time=${Date.now()}&_=${Date.now() + 2}&_ste=1`
  url += `&h5st=${decrypt(Date.now(), stk, '', url)}`
  if (stk) {
    url += `&_stk=${encodeURIComponent(stk)}`;
  }
  return {
    url,
    headers: {
      'Cookie': cookie,
      'Host': 'm.jingxi.com',
      'Accept': '*/*',
      'Connection': 'keep-alive',
      'User-Agent': functionId === 'AssistFriend' ? "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.66 Safari/537.36" : 'jdpingou',
      'Accept-Language': 'zh-cn',
      'Referer': 'https://wqsd.jd.com/pingou/dream_factory/index.html',
      'Accept-Encoding': 'gzip, deflate, br',
    }
  }
}

//京喜查询当前生产的商品名称
function GetCommodityDetails() {
  return new Promise(async resolve => {
    // const url = `/dreamfactory/diminfo/GetCommodityDetails?zone=dream_factory&sceneval=2&g_login_type=1&commodityId=${$.commodityDimId}`;
    $.get(jxTaskurl('diminfo/GetCommodityDetails', `commodityId=${$.commodityDimId}`, `_time,commodityId,zone`), (err, resp, data) => {
      try {
        if (err) {
          // console.log(`${JSON.stringify(err)}`)
          console.log(`京喜工厂查询: API请求失败，请检查网路重试\n`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data['ret'] === 0) {
              data = data['data'];
              $.jxProductName = data['commodityList'][0].name;
            } else {
              console.log(`京喜工厂查询异常：${JSON.stringify(data)}\n`)
            }
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}

function getUA() {
  $.UA = `jdapp;iPhone;11.1.4;14.3;${randomString(40)};network/wifi;model/iPhone12,1;addressid/3364463029;appBuild/168210;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1`
}


function randomString(e) {
  e = e || 32;
  let t = "0123456789abcdef", a = t.length, n = "";
  for (let i = 0; i < e; i++)
    n += t.charAt(Math.floor(Math.random() * a));
  return n
}

function getGetRequest(type, url) {
  UA = `jdpingou;iPhone;4.13.0;14.4.2;${randomString(40)};network/wifi;model/iPhone10,2;appBuild/100609;ADID/00000000-0000-0000-0000-000000000000;supportApplePay/1;hasUPPay/0;pushNoticeIsOpen/1;hasOCPay/0;supportBestPay/0;session/${Math.random * 98 + 1};pap/JA2019_3111789;brand/apple;supportJDSHWK/1;Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148`

  const method = `GET`;
  let headers = {
    'Origin': `https://st.jingxi.com`,
    'Cookie': cookie,
    'Connection': `keep-alive`,
    'Accept': `application/json`,
    'Referer': `https://st.jingxi.com/pingou/jxmc/index.html`,
    'Host': `m.jingxi.com`,
    'User-Agent': UA,
    'Accept-Encoding': `gzip, deflate, br`,
    'Accept-Language': `zh-cn`
  };
  return { url: url, method: method, headers: headers };
}


Date.prototype.Format = function (fmt) {
  var e,
    n = this, d = fmt, l = {
      "M+": n.getMonth() + 1,
      "d+": n.getDate(),
      "D+": n.getDate(),
      "h+": n.getHours(),
      "H+": n.getHours(),
      "m+": n.getMinutes(),
      "s+": n.getSeconds(),
      "w+": n.getDay(),
      "q+": Math.floor((n.getMonth() + 3) / 3),
      "S+": n.getMilliseconds()
    };
  /(y+)/i.test(d) && (d = d.replace(RegExp.$1, "".concat(n.getFullYear()).substr(4 - RegExp.$1.length)));
  for (var k in l) {
    if (new RegExp("(".concat(k, ")")).test(d)) {
      var t, a = "S+" === k ? "000" : "00";
      d = d.replace(RegExp.$1, 1 == RegExp.$1.length ? l[k] : ("".concat(a) + l[k]).substr("".concat(l[k]).length))
    }
  }
  return d;
}

function decrypt(time, stk, type, url) {
  stk = stk || (url ? getJxmcUrlData(url, '_stk') : '')
  if (stk) {
    const timestamp = new Date(time).Format("yyyyMMddhhmmssSSS");
    let hash1 = '';
    if ($.fingerprint && $.Jxmctoken && $.enCryptMethodJD) {
      hash1 = $.enCryptMethodJD($.Jxmctoken, $.fingerprint.toString(), timestamp.toString(), $.appId.toString(), $.CryptoJS).toString($.CryptoJS.enc.Hex);
    } else {
      const random = '5gkjB6SpmC9s';
      $.Jxmctoken = `tk01wcdf61cb3a8nYUtHcmhSUFFCfddDPRvKvYaMjHkxo6Aj7dhzO+GXGFa9nPXfcgT+mULoF1b1YIS1ghvSlbwhE0Xc`;
      $.fingerprint = 5287160221454703;
      const str = `${$.Jxmctoken}${$.fingerprint}${timestamp}${$.appId}${random}`;
      hash1 = $.CryptoJS.SHA512(str, $.Jxmctoken).toString($.CryptoJS.enc.Hex);
    }
    let st = '';
    stk.split(',').map((item, index) => {
      st += `${item}:${getJxmcUrlData(url, item)}${index === stk.split(',').length - 1 ? '' : '&'}`;
    })
    const hash2 = $.CryptoJS.HmacSHA256(st, hash1.toString()).toString($.CryptoJS.enc.Hex);
    return encodeURIComponent(["".concat(timestamp.toString()), "".concat($.fingerprint.toString()), "".concat($.appId.toString()), "".concat($.Jxmctoken), "".concat(hash2)].join(";"))
  } else {
    return '20210318144213808;8277529360925161;10001;tk01w952a1b73a8nU0luMGtBanZTHCgj0KFVwDa4n5pJ95T/5bxO/m54p4MtgVEwKNev1u/BUjrpWAUMZPW0Kz2RWP8v;86054c036fe3bf0991bd9a9da1a8d44dd130c6508602215e50bb1e385326779d'
  }
}

async function requestAlgo() {
  $.fingerprint = await generateFp();
  $.appId = 10028;
  const options = {
    "url": `https://cactus.jd.com/request_algo?g_ty=ajax`,
    "headers": {
      'Authority': 'cactus.jd.com',
      'Pragma': 'no-cache',
      'Cache-Control': 'no-cache',
      'Accept': 'application/json',
      'User-Agent': $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
      //'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1',
      'Content-Type': 'application/json',
      'Origin': 'https://st.jingxi.com',
      'Sec-Fetch-Site': 'cross-site',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Dest': 'empty',
      'Referer': 'https://st.jingxi.com/',
      'Accept-Language': 'zh-CN,zh;q=0.9,zh-TW;q=0.8,en;q=0.7'
    },
    'body': JSON.stringify({
      "version": "1.0",
      "fp": $.fingerprint,
      "appId": $.appId.toString(),
      "timestamp": Date.now(),
      "platform": "web",
      "expandParams": ""
    })
  }
  new Promise(async resolve => {
    $.post(options, (err, resp, data) => {
      try {
        if (err) {
          // console.log(`${JSON.stringify(err)}`)
          console.log(`request_algo签名参数: API请求失败，请检查网路重试\n`)
        } else {
          if (data) {
            data = JSON.parse(data);
            if (data['status'] === 200) {
              $.Jxmctoken = data.data.result.tk;
              let enCryptMethodJDString = data.data.result.algo;
              if (enCryptMethodJDString) $.enCryptMethodJD = new Function(`return ${enCryptMethodJDString}`)();
            } else {
              console.log('request_algo 签名参数API请求失败\n')
            }
          } else {
            console.log(`京东服务器返回空数据`)
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}

function generateFp() {
  let e = "0123456789";
  let a = 13;
  let i = '';
  for (; a--;)
    i += e[Math.random() * e.length | 0];
  return (i + Date.now()).slice(0, 16)
}

function getJxmcUrlData(url, name) {
  if (typeof URL !== "undefined") {
    let urls = new URL(url);
    let data = urls.searchParams.get(name);
    return data ? data : '';
  } else {
    const query = url.match(/\?.*/)[0].substring(1)
    const vars = query.split('&')
    for (let i = 0; i < vars.length; i++) {
      const pair = vars[i].split('=')
      if (pair[0] === name) {
        return vars[i].substr(vars[i].indexOf('=') + 1);
      }
    }
    return ''
  }
}

function jsonParse(str) {
  if (typeof str == "string") {
    try {
      return JSON.parse(str);
    } catch (e) {
      console.log(e);
      $.msg($.name, '', '请勿随意在BoxJs输入框修改内容\n建议通过脚本去获取cookie')
      return [];
    }
  }
}
function timeFormat(time) {
  let date;
  if (time) {
    date = new Date(time)
  } else {
    date = new Date();
  }
  return date.getFullYear() + '-' + ((date.getMonth() + 1) >= 10 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1)) + '-' + (date.getDate() >= 10 ? date.getDate() : '0' + date.getDate());
}


// prettier-ignore
function Env(t, e) { class s { constructor(t) { this.env = t } send(t, e = "GET") { t = "string" == typeof t ? { url: t } : t; let s = this.get; return "POST" === e && (s = this.post), new Promise((e, i) => { s.call(this, t, (t, s, r) => { t ? i(t) : e(s) }) }) } get(t) { return this.send.call(this.env, t) } post(t) { return this.send.call(this.env, t, "POST") } } return new class { constructor(t, e) { this.name = t, this.http = new s(this), this.data = null, this.dataFile = "box.dat", this.logs = [], this.isMute = !1, this.isNeedRewrite = !1, this.logSeparator = "\n", this.startTime = (new Date).getTime(), Object.assign(this, e), this.log("", `🔔${this.name}, 开始!`) } isNode() { return "undefined" != typeof module && !!module.exports } isQuanX() { return "undefined" != typeof $task } isSurge() { return "undefined" != typeof $httpClient && "undefined" == typeof $loon } isLoon() { return "undefined" != typeof $loon } toObj(t, e = null) { try { return JSON.parse(t) } catch { return e } } toStr(t, e = null) { try { return JSON.stringify(t) } catch { return e } } getjson(t, e) { let s = e; const i = this.getdata(t); if (i) try { s = JSON.parse(this.getdata(t)) } catch { } return s } setjson(t, e) { try { return this.setdata(JSON.stringify(t), e) } catch { return !1 } } getScript(t) { return new Promise(e => { this.get({ url: t }, (t, s, i) => e(i)) }) } runScript(t, e) { return new Promise(s => { let i = this.getdata("@chavy_boxjs_userCfgs.httpapi"); i = i ? i.replace(/\n/g, "").trim() : i; let r = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout"); r = r ? 1 * r : 20, r = e && e.timeout ? e.timeout : r; const [o, h] = i.split("@"), n = { url: `http://${h}/v1/scripting/evaluate`, body: { script_text: t, mock_type: "cron", timeout: r }, headers: { "X-Key": o, Accept: "*/*" } }; this.post(n, (t, e, i) => s(i)) }).catch(t => this.logErr(t)) } loaddata() { if (!this.isNode()) return {}; { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e); if (!s && !i) return {}; { const i = s ? t : e; try { return JSON.parse(this.fs.readFileSync(i)) } catch (t) { return {} } } } } writedata() { if (this.isNode()) { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e), r = JSON.stringify(this.data); s ? this.fs.writeFileSync(t, r) : i ? this.fs.writeFileSync(e, r) : this.fs.writeFileSync(t, r) } } lodash_get(t, e, s) { const i = e.replace(/\[(\d+)\]/g, ".$1").split("."); let r = t; for (const t of i) if (r = Object(r)[t], void 0 === r) return s; return r } lodash_set(t, e, s) { return Object(t) !== t ? t : (Array.isArray(e) || (e = e.toString().match(/[^.[\]]+/g) || []), e.slice(0, -1).reduce((t, s, i) => Object(t[s]) === t[s] ? t[s] : t[s] = Math.abs(e[i + 1]) >> 0 == +e[i + 1] ? [] : {}, t)[e[e.length - 1]] = s, t) } getdata(t) { let e = this.getval(t); if (/^@/.test(t)) { const [, s, i] = /^@(.*?)\.(.*?)$/.exec(t), r = s ? this.getval(s) : ""; if (r) try { const t = JSON.parse(r); e = t ? this.lodash_get(t, i, "") : e } catch (t) { e = "" } } return e } setdata(t, e) { let s = !1; if (/^@/.test(e)) { const [, i, r] = /^@(.*?)\.(.*?)$/.exec(e), o = this.getval(i), h = i ? "null" === o ? null : o || "{}" : "{}"; try { const e = JSON.parse(h); this.lodash_set(e, r, t), s = this.setval(JSON.stringify(e), i) } catch (e) { const o = {}; this.lodash_set(o, r, t), s = this.setval(JSON.stringify(o), i) } } else s = this.setval(t, e); return s } getval(t) { return this.isSurge() || this.isLoon() ? $persistentStore.read(t) : this.isQuanX() ? $prefs.valueForKey(t) : this.isNode() ? (this.data = this.loaddata(), this.data[t]) : this.data && this.data[t] || null } setval(t, e) { return this.isSurge() || this.isLoon() ? $persistentStore.write(t, e) : this.isQuanX() ? $prefs.setValueForKey(t, e) : this.isNode() ? (this.data = this.loaddata(), this.data[e] = t, this.writedata(), !0) : this.data && this.data[e] || null } initGotEnv(t) { this.got = this.got ? this.got : require("got"), this.cktough = this.cktough ? this.cktough : require("tough-cookie"), this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar, t && (t.headers = t.headers ? t.headers : {}, void 0 === t.headers.Cookie && void 0 === t.cookieJar && (t.cookieJar = this.ckjar)) } get(t, e = (() => { })) { t.headers && (delete t.headers["Content-Type"], delete t.headers["Content-Length"]), this.isSurge() || this.isLoon() ? (this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.get(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) })) : this.isQuanX() ? (this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t))) : this.isNode() && (this.initGotEnv(t), this.got(t).on("redirect", (t, e) => { try { if (t.headers["set-cookie"]) { const s = t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString(); s && this.ckjar.setCookieSync(s, null), e.cookieJar = this.ckjar } } catch (t) { this.logErr(t) } }).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) })) } post(t, e = (() => { })) { if (t.body && t.headers && !t.headers["Content-Type"] && (t.headers["Content-Type"] = "application/x-www-form-urlencoded"), t.headers && delete t.headers["Content-Length"], this.isSurge() || this.isLoon()) this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.post(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) }); else if (this.isQuanX()) t.method = "POST", this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t)); else if (this.isNode()) { this.initGotEnv(t); const { url: s, ...i } = t; this.got.post(s, i).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) }) } } time(t, e = null) { const s = e ? new Date(e) : new Date; let i = { "M+": s.getMonth() + 1, "d+": s.getDate(), "H+": s.getHours(), "m+": s.getMinutes(), "s+": s.getSeconds(), "q+": Math.floor((s.getMonth() + 3) / 3), S: s.getMilliseconds() }; /(y+)/.test(t) && (t = t.replace(RegExp.$1, (s.getFullYear() + "").substr(4 - RegExp.$1.length))); for (let e in i) new RegExp("(" + e + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? i[e] : ("00" + i[e]).substr(("" + i[e]).length))); return t } msg(e = t, s = "", i = "", r) { const o = t => { if (!t) return t; if ("string" == typeof t) return this.isLoon() ? t : this.isQuanX() ? { "open-url": t } : this.isSurge() ? { url: t } : void 0; if ("object" == typeof t) { if (this.isLoon()) { let e = t.openUrl || t.url || t["open-url"], s = t.mediaUrl || t["media-url"]; return { openUrl: e, mediaUrl: s } } if (this.isQuanX()) { let e = t["open-url"] || t.url || t.openUrl, s = t["media-url"] || t.mediaUrl; return { "open-url": e, "media-url": s } } if (this.isSurge()) { let e = t.url || t.openUrl || t["open-url"]; return { url: e } } } }; if (this.isMute || (this.isSurge() || this.isLoon() ? $notification.post(e, s, i, o(r)) : this.isQuanX() && $notify(e, s, i, o(r))), !this.isMuteLog) { let t = ["", "==============📣系统通知📣=============="]; t.push(e), s && t.push(s), i && t.push(i), console.log(t.join("\n")), this.logs = this.logs.concat(t) } } log(...t) { t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(t.join(this.logSeparator)) } logErr(t, e) { const s = !this.isSurge() && !this.isQuanX() && !this.isLoon(); s ? this.log("", `❗️${this.name}, 错误!`, t.stack) : this.log("", `❗️${this.name}, 错误!`, t) } wait(t) { return new Promise(e => setTimeout(e, t)) } done(t = {}) { const e = (new Date).getTime(), s = (e - this.startTime) / 1e3; this.log("", `🔔${this.name}, 结束! 🕛 ${s} 秒`), this.log(), (this.isSurge() || this.isQuanX() || this.isLoon()) && $done(t) } }(t, e) }
