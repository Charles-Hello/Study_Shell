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
requests.packages.urllib3.disable_warnings()
#默认走的是你config的auth认证(如有需要，则修改)
with open(r'/ql/config/auth.json', 'r') as f2:
    token = f2.read()
datapro = json.loads(token)
token = datapro['token']
#青龙内网端口
url = '127.0.0.1:5600'

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
API_URL = "http://192.168.1.50:8090"
headers = {
    'Name': 'iHttp',
    'Ver': "1.1.6.1",
    'Udid': '0b4891edc500803721b76cf782200fd3',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36 Edg/97.0.1072.76',
}
def send_text_msg(robot_wxid, to_wxid, msg):
    data = dict()
    data["event"] = "SendTextMsg"
    data["robot_wxid"] = robot_wxid
    data["to_wxid"] = to_wxid
    data["msg"] = msg
    result = ujson.dumps(data)
    return requests.post(url=API_URL, data=result, headers=headers)


# def env_status():
#     headers = {
#         'Connection': 'keep-alive',
#         'Authorization': token,
#         'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.74 Safari/537.36 Edg/99.0.1150.55',
#     }
#     response = requests.get(f'http://{url}/api/envs',
#                             headers=headers,verify=False).json()
#     return response

# def enable_ck(id, url, client_id, client_secret):
#     headers = {
#         'Connection': 'keep-alive',
#         'Accept': 'application/json',
#         'Authorization': 'Bearer %s' % get_token(
#             url, client_id, client_secret),
#         'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.82 Safari/537.36 Edg/98.0.1108.51',
#         'Content-Type': 'application/json;charset=UTF-8',
#         'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6',
#     }
#
#     data = f'[{id}]'
#
#     response = requests.put(
#         f'http://{url}/open/envs/enable',
#         headers=headers, data=data, verify=False)
#
#     print(response.text)


