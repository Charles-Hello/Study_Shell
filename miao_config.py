# -*- coding: utf-8 -*-
"""
@Time ： 2022/3/15 09:35
@Auth ： maomao
@File ：config.py.py
@IDE ：PyCharm
@Motto：ABC(Always Be Coding)
"""
import requests
import json
import os
import re
import ujson
import time
requests.packages.urllib3.disable_warnings()
#默认走的是你config的auth认证(如有需要，则修改)
with open(r'/ql/data/config/auth.json', 'r') as f2:
    token = f2.read()
datapro = json.loads(token)
token = datapro['token']
wxid_file = '/ql/data/config/wxid.txt'
#青龙内网端口
ql_url = '127.0.0.1:5600'
ql_headers = {
        'Connection': 'keep-alive',
        'Accept': 'application/json',
        'Authorization': 'Bearer %s' % token,
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36 Edg/97.0.1072.62',
        'Content-Type': 'application/json;charset=UTF-8',
        'Origin': f'http://{ql_url}',
        'Referer': f'http://{ql_url}/crontab',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6',
    }
#返利白名单（改）
pin_list = ['jd_7ec312d2a20b9', 'jd_53176b51ecb57',
            'jd_4ee786ea1319d', 'jd_6c0f4a7b18b49', '13434002877_p',
            'jd_4fd4dce4a5135', '122272973-806174',
            'jd_457e111bac9ec','13794951707_p']
    # 常规ql「用于跑tg活动」
ql_url_list = ['192.168.1.145:5700','192.168.1.145:5703',]
client_id = ['gPr_row88j6t', 'sYeg5TlEY-lu']
client_secret = ['7yMcbSQJRc5r8w2Y-lVJ8C3N', '0nyo3LtBJMNE8z6bJI_wNXmE']
#需要自动登陆面板的
# 填写你的面板账号密码
username = '1140601003'
password = 'ken1140601003@@@'
dormitory = '12361142051@chatroom'
tnanko = 'wxid_xq2w7jl6cbi811'
jd_xianbao = '5748551094@chatroom'
jd_miaomiaomiao = "19244435890@chatroom"
group_id = '24446492186@chatroom'
user_id = 'wxid_p8geau233z3412'
taobao_fuli = '17573440617@chatroom'
taobao_xianbao = '5739151628@chatroom'
# 主动调用发送接口
API_URL = "http://192.168.1.51:8090"

def send_text_msg(robot_wxid, to_wxid, msg):
    headers = {
      'Name': 'iHttp',
      'Ver': "1.1.6.1",
      'Udid': '0b4891edc500803721b76cf782200fd3',
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36 Edg/97.0.1072.76',
}
    data = dict()
    data["event"] = "SendTextMsg"
    data["robot_wxid"] = robot_wxid
    data["to_wxid"] = to_wxid
    data["msg"] = msg
    result = ujson.dumps(data)
    return requests.post(url=API_URL, data=result, headers=headers)


