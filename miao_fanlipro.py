'''
cron 58 23 * * *
new Env('京东返利地狱或天堂');
'''
import datetime
import random
import time
import os
import re
import requests
import sys
import json
import  re
from random import sample
import os
import asyncio
from datetime import datetime,timedelta
import httpx


from miao_config import *
requests.packages.urllib3.disable_warnings()
sys.path.append('../../tmp')
#ip（改）

dnow = datetime.now().strftime('%Y-%m-%d')
dnow_reg = re.compile(dnow)


async def getRequest(method, url, data=None, headers=None, params=None, json=None, allow_redirects=False, timeout=30):
    max_retries = 4
    retry_wait_time = 10
    
    for retry in range(max_retries):
        try:
            async with httpx.AsyncClient(verify=False, follow_redirects=allow_redirects) as client:
                res = await client.request(method, url=url, data=data, headers=headers, params=params, json=json, timeout=timeout)
            return res
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            if retry < max_retries - 1:
                print(f"Retrying in {retry_wait_time} seconds...")
                await asyncio.sleep(retry_wait_time)
    
    return False



async def get_fl(cookie):
    try:
        jin_list = []
        jin_name = []
        today,allday = False,False
        data = ''
        if not cookie:
            print('获取京粉CK失败')
            return today,allday
        dnow = (datetime.now()+timedelta(days=-1)).strftime('%Y-%m-%d %H:%M:%S')
        dtnow = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        body = {"funName": "listOrderSku","unionId": "","param": {"startTime": dnow,"endTime": dtnow,"orderStatus": 0,"optType": 1,"unionRole": 1},"page": {"pageNo": 1,"pageSize": 100}}
        url = f'https://api.m.jd.com/api?functionId=listOrderSku&_={dtnow}&appid=u&body={body}&loginType=2';
        headers = {
            'Host': 'api.m.jd.com',
            'Accept': '*/*',
            'Accept-Encoding': 'gzip, deflate, br',
            'Accept-Language': 'zh-cn',
            'Connection': 'keep-alive',
            'Content-Type': 'application/json',
            'cookie': cookie,
            'Referer': 'https://jingfenapp.jd.com',
            'User-Agent': await userAgent(),
        }
        for _ in range(3):
            res = await getRequest('GET',url=url,headers=headers)
            if res and res.status_code == 200:
                data = res.json()
                break
            else:
                continue
        
        if type(data) == dict and 'code' in data and data['code'] == 200:
            jforders = data['result']
            allday = True
            keys = ['待付款','取消']
            for order in jforders:
                if re.search(dnow_reg,order['orderTime']) and all(k not in order['validCodeMsg'] for k in keys):
                    jin_list.append(order['orderId'])
                    jin_name.append(order['skuName'])
                    print(order['orderId'],order['estimateFee'],order['validCodeMsg'],order['skuName'])
                    # await writejf(order['orderId'],order['estimateFee'],order['validCodeMsg'],order['skuName'])
                    today = True
        return jin_list,jin_name
    except Exception as e:
        name = "文件名：" + os.path.split(__file__)[-1].split(".")[0]
        sign = f"{name}\n报错行数：{e.__traceback__.tb_lineno}行\n报错原因：{e}"
        print(sign)




async def userAgent():
    """
    随机生成一个UA
    jdapp;iPhone;10.0.4;14.2;9fb54498b32e17dfc5717744b5eaecda8366223c;network/wifi;ADID/2CF597D0-10D8-4DF8-C5A2-61FD79AC8035;model/iPhone11,1;addressid/7785283669;appBuild/167707;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 14_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/null;supportJDSHWK/1
    :return: ua
    'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.15(0x18000f29) NetType/WIFI Language/zh_CN'

    """
    uuid = ''.join(sample('123456789abcdef123456789abcdef123456789abcdef123456789abcdef', 40))
    addressid = ''.join(sample('1234567898647', 10))
    iosVer = ''.join(sample(["14.5.1", "14.4", "14.3", "14.2", "14.1", "14.0.1", "13.7", "13.1.2", "13.1.1"], 1))
    iosV = iosVer.replace('.', '_')
    iPhone = ''.join(sample(["8", "9", "10", "11", "12", "13"], 1))
    ADID = ''.join(sample('0987654321ABCDEF', 8)) + '-' + ''.join(sample('0987654321ABCDEF', 4)) + '-' + ''.join(sample('0987654321ABCDEF', 4)) + '-' + ''.join(sample('0987654321ABCDEF', 4)) + '-' + ''.join(sample('0987654321ABCDEF', 12))
    return f'jdapp;iPhone;10.0.4;{iosVer};{uuid};network/wifi;ADID/{ADID};model/iPhone{iPhone},1;addressid/{addressid};appBuild/167707;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS {iosV} like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/null;supportJDSHWK/1'


async def get_todayorder(cookie):
    try:
        # print(cookie)
        # jdpin = re.findall('pt_pin=(.*)', cookie)[0]
        url = "https://api.m.jd.com/client.action?functionId=newUserAllOrderList&clientVersion=10.3.4&build=92466&client=android&partner=huaweiharmony&oaid=00000000-0000-0000-0000-000000000000&eid=eidAbcd38121ddscwtBOEHdIRX+8fa3hUootUcLQT475D0fH2wmEo8TVqVfsUJ56R3hwHEE16CVy/Q3V5tENhygqLIhKwCVRMllF8ygoN3vlMOxe2t9u&sdkVersion=29&lang=zh_CN&harmonyOs=1&networkType=wifi&uts=0f31TVRjBSsdMc2dBO7HUOWTXcUTutp2CJQOsGBrepqT%2FqhBlsPOGyHOmhkmC5ljCq0Wk6lYsgxxcIOWe5Rv46R5Lqj%2B%2F3po10nHIecDv%2FXCrFvo3schW6vICefuZNanHXgdwOhWUeAl55DRxFYK6Tm0w3dD6p%2F4IlnkUmC5nWq9SvmJMZgO5fZmv9%2FQHDkEXfDsri%2FA8dYTF5XUP1NH3Q%3D%3D&uemps=0-0&ext=%7B%22prstate%22%3A%220%22%2C%22pvcStu%22%3A%221%22%7D&ef=1&ep=%7B%22hdid%22%3A%22JM9F1ywUPwflvMIpYPok0tt5k9kW4ArJEU3lfLhxBqw%3D%22%2C%22ts%22%3A1643016843309%2C%22ridx%22%3A-1%2C%22cipher%22%3A%7B%22d_model%22%3A%22WUPCBUPCCJK%3D%22%2C%22wifiBssid%22%3A%22dW5hbw93bq%3D%3D%22%2C%22osVersion%22%3A%22CJK%3D%22%2C%22d_brand%22%3A%22IPVLV0VT%22%2C%22screen%22%3A%22CtSzCsenCNqm%22%2C%22uuid%22%3A%22CwC2ZwTuEQO2YJS0EJLwYq%3D%3D%22%2C%22aid%22%3A%22CwC2ZwTuEQO2YJS0EJLwYq%3D%3D%22%2C%22openudid%22%3A%22CwC2ZwTuEQO2YJS0EJLwYq%3D%3D%22%7D%2C%22ciphertype%22%3A5%2C%22version%22%3A%221.2.0%22%2C%22appname%22%3A%22com.jingdong.app.mall%22%7D&st=1643016856640&sign=d1ce5caa63ae6fb3eef3b71aea21003b&sv=100"
        # 最近订单记录链接
        data = "body=%7B%22deis%22%3A%22dy%22%2C%22phcre%22%3A%22v%22%2C%22newMyOrder%22%3A%221%22%2C%22newUiSwitch%22%3A%221%22%2C%22page%22%3A%221%22%2C%22pagesize%22%3A%2210%22%2C%22plugin_version%22%3A103004%7D&"
        # 最近订单body
        headers = {
            "Charset": "UTF-8",
            "Accept-Encoding": "gzip,deflate",
            "Cache-Control": "no-cache",
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            "Content-Length": "199",
            'Cookie': cookie,
            "user-agent": await userAgent(),
        }
        # 最近订单记录
        for _ in range(3):
            res = await getRequest('POST', url=url, data=data, headers=headers)
            if res and res.status_code == 200:
                data = res.json()
                # print(data)
                break
            else:
                continue
        ordlist, orddict = [], []
        if 'orderList' not in data:
            print(f'pin: {cookie}\t没有查到订单!')
            return ordlist
        allorder = {k: v for k, v in data.items() if k == 'orderList'}
        sku_list, sku_name, orderStatus, dataSubmit, price, wareId, wname = [], [], [], [], [], [], []
        if allorder:
            for order in allorder['orderList']:
                if re.search(dnow_reg, order['dataSubmit']):
                    sku_list.append(order['orderId'])
                    sku_name.append(order['shopName'])
                    orderStatus.append(order['orderStatus'])
                    dataSubmit.append(order['dataSubmit'])
                    price.append(order['price'])
                    if 'wareId' in order['orderMsg']['wareInfoList'][0]:
                        wareId.append(order['orderMsg']['wareInfoList'][0]['wareId'])
                    if 'wname' in order['orderMsg']['wareInfoList'][0]:
                        wname.append(order['orderMsg']['wareInfoList'][0]['wname'])
                    else:
                        wname.append('')
        if sku_list:
            mid = map(list, zip(sku_list, sku_name, orderStatus, dataSubmit, price, wareId, wname))
            for item in mid:
                orddict = dict(
                    zip(['orderId', 'shopName', 'orderStatus', 'dataSubmit', 'price', 'wareId',
                         'wname'], item))
                ordlist.append(orddict)
                # print(ordlist)
        return sku_list, wname,wareId
    except Exception as e:
        name = "文件名：" + os.path.split(__file__)[-1].split(".")[0]
        sign = f"{name}\n报错行数：{e.__traceback__.tb_lineno}行\n报错原因：{e}"
        print(sign)




# 获取pin
cookie_findall = re.compile(r'pt_pin=(.+?);')


def get_pin(cookie):
    try:
        return cookie_findall.findall(cookie)[0]
    except:
        print('ck格式不正确，请检查')




class Judge_env(object):
    def main_run(self):
        if '/jd' in os.path.abspath(os.path.dirname(__file__)):
            cookie_list = self.v4_cookie()
        else:
            cookie_list = os.environ["JD_COOKIE"].split(
                '&')  # 获取cookie_list的合集
        if len(cookie_list) < 1:
            print('请填写环境变量JD_COOKIE\n')
        return cookie_list

    def v4_cookie(self):
        a = []
        b = re.compile(r'Cookie' + '.*?=\"(.*?)\"', re.I)
        with open('/jd/config/config.sh', 'r') as f:
            for line in f.readlines():
                try:
                    regular = b.match(line).group(1)
                    a.append(regular)
                except:
                    pass
        return a


cookie_list = Judge_env().main_run()



def to_hell(hell,fromIndex,get_id):
    

    data = '{"fromIndex":' + f'{fromIndex}' + ',"toIndex":' + f'{hell}' + '}'

    response = requests.put(
        f'http://{ql_url}/api/envs/{get_id}/move',
        headers=ql_headers, data=data,
        verify=False)
    if response.status_code == 200:
        print('执行正常～')
    else:
        print('出错')


def ck_to_hell(pin):
    
    response = requests.get(f'http://{ql_url}/api/envs', headers=ql_headers,
                            verify=False)
    data = json.loads(response.text)
    get_len = (len(data['data'])) - 1
    if pin in pin_list:
        return
    for num in range(len(data['data'])):
        if pin in data['data'][num]['value']:
            get_pin_id = data['data'][num]['id']
            print('不走返利的狗：' + pin)
            #先ban再hell
            # ban(get_pin_id)
            to_hell(get_len,num,get_pin_id)



def ck_to_Heaven(pin):
  
    response = requests.get(f'http://{ql_url}/api/envs', headers=ql_headers,
                            verify=False)
    data = json.loads(response.text)
    if pin in pin_list:
        return
    for num in range(len(data['data'])):
        if pin in data['data'][num]['value']:
            get_pin_id = data['data'][num]['id']
            print('奖励返利置顶：' + pin)
            send_text_msg(user_id,
                     tnanko, '奖励返利置顶：' + pin)
            #位置（可改）
            to_hell(7,num+1,get_pin_id)


def get_token(url, client_id, client_secret):
    headers = {
        'Connection': 'keep-alive',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36 Edg/97.0.1072.69',
        'Accept': '*/*',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6',
    }
    response = requests.get(
        f'http://{url}/open/auth/token?client_id={client_id}&client_secret={client_secret}',
        headers=headers, verify=False)
    print(response.text)
    data = json.loads(response.text)
    open_token = data['data']['token']
    return open_token



def get_main_data():

    headers = {
        'Accept': '*/*',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6,ca;q=0.5,da;q=0.4',
        'Authorization': 'Bearer %s' % get_token(
            ql_url_list[1], client_id[1], client_secret[1]),
        'If-None-Match': 'W/"16d-l7MGIlfc5s4zE/eoqkCOBF30kKo"',
        'Referer': 'http://{ql_url_list[1]}/env',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36 Edg/105.0.1343.50',
    }

    params = {
        'searchValue': '',
        't': '1664259184630',
    }

    response = requests.get(f'http://{ql_url_list[1]}/open/envs', params=params, headers=headers,
                            verify=False)
    maindata = response.text
    # print(maindata)
    data = json.loads(maindata)
    main_ck = data['data'][0]['value']
    print(main_ck)
    return main_ck
def ban(id):

    data = f'[{id}]'

    response = requests.put(
        f'http://{ql_url}/api/envs/disable', headers=ql_headers, data=data, verify=False)
    print(response.text)

main_ck = get_main_data()
jin_list , jin_name  = asyncio.run(get_fl(main_ck))




async def get_yj(sj_id):
    link = "https://item.jd.com/" + sj_id + ".html"
    api = "https://api.jingpinku.com/get_powerful_coup_link/api"
    params = {  # 请求参数, 拼接组成url
        'appid': '2109251717175528',
        'appkey': 'V0iZtEDOWJOvBQr7lT5hHVJAYbfqh5wH',
        'union_id': '2011731356',
        'content': link
    }
    headers={
        "User-Agent": await userAgent(),
    }
    fl = await getRequest('GET',url=api,params=params,headers=headers)
    fl = fl.json()
    print(fl)
    yj = fl['official']
    yj = yj.replace('➖➖➖➖➖','')
    if not yj :
        print("这个东西没有返利")
        return False
    else:
        return True



def ck_dd(cookie):
    get_ck = re.findall('pt_pin=(.*);', cookie)[0]
    sku_list, sku_name, yj_id=  asyncio.run(get_todayorder(cookie))
    print(f"这个{get_ck}的sku： {sku_list}")
    print(jin_list)
    try:
        for e, gg in enumerate(sku_list):
            if asyncio.run(get_yj(yj_id[e])):
                if int(gg) in jin_list:
                    with open(wxid_file, 'r') as f1:
                        a = f1.read()
                    if f'{get_ck}' in a:
                        to_wxid_pro = re.findall(f'{get_ck}\$(.*)', a)[0]
                        send_text_msg(user_id,
                                 to_wxid_pro,
                                 f'{get_ck}\n这个商品:\n{sku_name[e]}\n\n走了返利,ck已置顶')
                    send_text_msg(user_id,
                             tnanko,
                             f'{get_ck}\n这个商品:{sku_name[e]}\n\n走了返利,已置顶')
                    print(user_id,
                             tnanko,
                             f'{get_ck}\n这个商品:\n\n走了返利,已置顶')
                    # 这里写置顶
                    ck_to_Heaven(get_ck)
                    break
                else:
                    with open(wxid_file, 'r') as f1:
                        a = f1.read()
                    if f'{get_ck}' in a:
                        to_wxid_pro = re.findall(f'{get_ck}\$(.*)', a)[0]
                        send_text_msg(user_id,
                                 to_wxid_pro,
                                 f'{get_ck}\n这个商品:\n{sku_name[e]}\n\n没有走返利\npin已被禁止挂机\n如有错误,请联系管理员解锁\n如果购买东西却没有置顶\n找群主发pin')
                    send_text_msg(user_id,
                             tnanko,
                             f'{get_ck}\n这个商品{sku_name[e]}:\n没有走返利,被标记')
                    print(f'{get_ck}\n这个商品:\n{sku_name[e]}\n没有走返利,被标记\n')
                    time.sleep(2)
                    # 这里写置底并且拉黑小黑屋
                    ck_to_hell(get_ck)
    except Exception as e:
        sign = f"报错行数：{e.__traceback__.tb_lineno}行"
        fail = f'{sign}\n异常时间：\t{time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(time.time()))}\n{e}\n报错翻译：\n'
        print(fail)


def main():
    print('🔔京东浏览记录，开始！\n')
    print(f'=========共{len(cookie_list)}京东个账号Cookie=========\n')
    # 枚举开始（改）
    for e, cookie in enumerate(cookie_list[2:], start=1):
        try:
            pin = get_pin(cookie)
            print(f'******开始【账号 {e}】 {pin} *********')
            print(f'{cookie}')
            ck_dd(cookie)
            #防止黑ip（改）
            time.sleep(35)
        except Exception as e:
            print(e)


if __name__ == '__main__':
    main()
