# -*- coding: utf-8 -*-
"""
@Time ： 2022/1/16 08:13
@Auth ： maomao
@File ：miao_dele_low_ck.py
@IDE ：PyCharm
@Motto：ABC(Always Be Coding)
"""

requests.packages.urllib3.disable_warnings()
from  miao_config import *
import requests
'''
cron: 0 0-23/3 * * *
new Env('ql删除过期ck');
'''
#检测ql状态如果为假，则删除



def delete_ck(id):

    headers = {
        'Connection': 'keep-alive',
        'Accept': 'application/json',
        'Authorization': 'Bearer %s' % token,
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36 Edg/97.0.1072.62',
        'Content-Type': 'application/json;charset=UTF-8',
        'Origin': url,
        'Referer': f'http://{url}/env',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6',
    }

    data = f'["{id}"]'

    response = requests.delete(f'http://{url}/api/envs',
                               headers=headers, data=data,
                               verify=False)
    # print(data)
    print(response.text)

def get_status():
    headers = {
        'Connection': 'keep-alive',
        'Authorization': 'Bearer %s' % token,
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36 Edg/97.0.1072.62',
        'Accept': '*/*',
        'Referer': f'http://{url}/env',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6',
        'If-None-Match': 'W/"3f20-/tBSqCVA/3mptrjg4KNtQSfoZBs"',
    }

    params = (
        ('searchValue', ''),
    )

    response = requests.get(f'http://{url}/api/envs', headers=headers, params=params, verify=False)
    data = json.loads(response.text)
    print(data)
    for a in range(len(data['data'])):
        if data['data'][a]['status'] == 1:
            id = data['data'][a]['id']
            print(id)
            delete_ck(id)


get_status()

