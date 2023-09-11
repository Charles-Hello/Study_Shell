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
import redis


requests.packages.urllib3.disable_warnings()
# 默认走的是你config的auth认证(如有需要，则修改)
with open(r'/ql/data/config/auth.json', 'r') as f2:
    token = f2.read()
datapro = json.loads(token)
token = datapro['token']
wxid_file = '/ql/data/scripts/wxid.txt'
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
ql_url_list = ['192.168.1.155:5700','192.168.1.155:5703',]
client_id = ['gPr_row88j6t', 'sYeg5TlEY-lu']
client_secret = ['7yMcbSQJRc5r8w2Y-lVJ8C3N', '0nyo3LtBJMNE8z6bJI_wNXmE']
#需要自动登陆面板的
# 填写你的面板账号密码
#--------------mysql数据库-----------------------

jd_mysql_host = "127.0.0.1"
jd_mysql_username = "root"
jd_mysql_password = "aa114060"
jd_mysql_database = "jddatabase"

db_config = {
        "host": jd_mysql_host,
        "user": jd_mysql_username,
        "password": jd_mysql_password,
        "database": jd_mysql_database,
}
#--------------mysql数据库-----------------------
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
Redis_ip = '192.168.1.155'  ## Redis地址
Redis_port = '19736'  ## Redis端口，默认为6379
Redis_pass = ''  ## Redis密码，无则不填
# 主动调用发送接口
# API_URL = "http://192.168.1.51:8090"
API_URL = "http://192.168.1.51:8000"

# # 自行定义nolan服务器发送url
# API_URL = "http://192.168.1.155:9191/api"

class My_Redis:
    def __init__(self, host: str, port: int, password=None):
        if password is None:
            self.r = redis.StrictRedis(
                host=host, port=port, decode_responses=True)
        else:
            self.r = redis.StrictRedis(
                host=host, port=port, password=password, decode_responses=True)

    def Redis_pipe(self, key: str) -> str:
        try:
            with self.r.monitor() as m:
                for command in m.listen():
                    a = command['command']
                    b = a.split(" ")
                    method = b[0].lower()
                    _key = b[1]
                    if re.findall(r'get|set', method) != [] and _key == key:
                        return self.r.get(key)
        except Exception as e:
            pass

    def Redis_set(self, key: str, value: str):
        self.r.set(key, value)


    def Redis_get(self, key: str):
        return self.r.get(key)
      

i = My_Redis(host=Redis_ip,port=Redis_port,password=Redis_pass)
guid = i.Redis_get('guid')
Authorization = i.Redis_get('Authorization')

headers = {
      'Name': 'iHttp',
      'Ver': "1.1.6.1",
      'Udid': '0b4891edc500803721b76cf782200fd3',
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36 Edg/97.0.1072.76',
}

def send_text_msg(used_id,msg):

    payload = ujson.dumps({
    "action": "send_message",
    "params": {
        "detail_type": "private",
        "user_id": used_id,
        "message": [
            {
                "type": "text",
                "data": {
                    "text": msg
                }
            }
        ]
    }
})

    requests.post(API_URL, headers=headers, data=payload)


# def send_text_msg(robot_wxid, to_wxid, msg):
    
#     data = dict()
#     data["event"] = "SendTextMsg"
#     data["robot_wxid"] = robot_wxid
#     data["to_wxid"] = to_wxid
#     data["msg"] = msg
#     result = ujson.dumps(data)
#     return requests.post(url=API_URL, data=result, headers=headers)

# headers = {
#         'accept': 'text/plain',
#         'Authorization': Authorization,
#         'Content-Type': 'application/json-patch+json',
#   }
# def send_text_msg(robot_wxid, to_wxid, msg,
#                         final_from_wxid=None,
#                         from_wxid=None):
#     """
#     发送普通文本消息
#     :param robot_wxid:机器人ID
#     :param to_wxid:消息接收ID 人/群
#     :param msg:文本消息
#     :return:发送消息
#     """
#     if final_from_wxid:
#         if final_from_wxid != robot_wxid:
#             to_wxid = final_from_wxid
#             if from_wxid != '':
#                 to_wxid = from_wxid
#         else:
#             to_wxid = to_wxid
#     data = '{\n  "Guid": "' + guid + '",\n  "atWxids": [""],\n  "UserName": "' + to_wxid + '",\n  "Content": "' + msg + '"\n}'
#     requests.post(url=f'{API_URL}/Message/WXSendMsg', data=data.encode("utf-8"), headers=headers)

