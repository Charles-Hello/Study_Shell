# -*- coding: utf-8 -*-
"""
@Time ： 2022/2/22 19:02
@Auth ： maomao
@File ：check_ck.py
@IDE ：PyCharm
@Motto：ABC(Always Be Coding)
"""
import requests
import re
import json
import sys
import os

requests.packages.urllib3.disable_warnings()
import time
import json
from miao_config import *
'''
cron: 20 1-23/5 * * *
new Env('ck失效机器人推送');
'''


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
    data = json.loads(response.text)
    open_token = data['data']['token']
    return open_token

def get_status():
    headers = {
        'Connection': 'keep-alive',
        'Authorization': 'Bearer %s' % token,
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36 Edg/97.0.1072.62',
        'Accept': '*/*',
        'Referer': f'{url}/env',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6',
        'If-None-Match': 'W/"3f20-/tBSqCVA/3mptrjg4KNtQSfoZBs"',
    }

    params = (
        ('searchValue', ''),
    )

    response = requests.get(f'http://{url}/api/envs', headers=headers, params=params, verify=False)
    data = json.loads(response.text)
    return data
data = get_status()
with open('/ql/scripts/wxid.txt','r') as f1:
    g = f1.read()


for a in range(len((data['data']))):
    status = data['data'][a]['status']
    if status == 1:
        ck = data['data'][a]['value']
        print(ck)
        pin = re.findall('pt_pin=(.*);',ck)[0]
        if pin in g :
            wxid = re.findall(f'{pin}\$(.*)',g)[0]
            send_text_msg('wxid_p8geau233z3412',wxid, '你这个'+pin+'失效或者被锁\n请再次登陆京东\n回复「教学」查看教学\n重新登陆即可')







