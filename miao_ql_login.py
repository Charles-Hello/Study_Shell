# -*- coding: utf-8 -*-
"""
@Time ： 2022/1/24 23:17
@Auth ： maomao
@File ：ql_login.py
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
import requests
from miao_config import *
'''
cron: 0 0-23/7 * * *
new Env('ql自动登陆');
'''


headers = {
    'Connection': 'keep-alive',
    'Accept': 'application/json',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36 Edg/97.0.1072.69',
    'Content-Type': 'application/json;charset=UTF-8',
    'Origin': f'http://{url}',
    'Referer': f'https://{url}/login',
    'Accept-Language': 'zh-CN,zh;q=0.9',
}

data = '{"username":"%s","password":"%s"}' % (username, password)

response = requests.post(f'http://{url}/api/user/login',
                         headers=headers, data=data, verify=False)
print(response.text)



