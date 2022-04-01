# -*- coding: utf-8 -*-
"""
@Time ： 2022/1/20 19:12
@Auth ： maomao
@File ：miao_ck_to_hell.py
@IDE ：PyCharm
@Motto：ABC(Always Be Coding)
"""
import requests
requests.packages.urllib3.disable_warnings()
from miao_config import *

'''
cron: 0 0-23/3 * * *
new Env('ql置底废物ck');
'''

pin_list =['jd_7ec312d2a20b9','jd_53176b51ecb57','jd_4ee786ea1319d','jd_6c0f4a7b18b49','13434002877_p','jd_4fd4dce4a5135','122272973-806174','jd_457e111bac9ec']


'''———————————————————————需要填写的地方——————————————————————————————'''
#填写呱佬抽奖的目录
src = '/ql/log/gua_luckDraw/'

'''———————————————————————需要填写的地方——————————————————————————————'''
files = os.listdir(src)
files_path = [f'{src}{file}' for file in files]
files_path.sort(key=lambda fp: os.path.getctime(fp),reverse=True)
newest_file = files_path[0]
print(newest_file) # 绝对路径

with open(f'{newest_file}','r') as f1:
    a = f1.read()

get_pin = re.findall('辣鸡账号的pin：(.*)',a)
total_ck = len(get_pin)




def to_hell(before,hell,get_id):
    headers = {
        'Connection': 'keep-alive',
        'Accept': 'application/json',
        'Authorization': 'Bearer %s' % token,
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36 Edg/97.0.1072.62',
        'Content-Type': 'application/json;charset=UTF-8',
        'Origin': f'http://{url}',
        'Referer': f'http://{url}/env',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6',
    }


    data = '{"fromIndex":'+f'{before}'+',"toIndex":'+f'{hell}'+'}'

    response = requests.put(
        f'http://{url}/api/envs/{get_id}/move',
        headers=headers, data=data,
        verify=False)

    print('已将其打进深渊～～')

def get_total():
    if total_ck==0:
        print('暂时没有账号火爆～')
        return
    headers = {
        'Connection': 'keep-alive',
        'Authorization': 'Bearer %s' % token,
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36 Edg/97.0.1072.62',
        'sentry-trace': '0d31c0f0bc7649c2a40a7dd200c27163-815c6c9ed4b8a764-1',
        'Accept': '*/*',
        'Referer': f'http://{url}/env',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6',
    }



    response = requests.get(f'http://{url}/api/envs', headers=headers,  verify=False)
    # print(response.text)
    data = json.loads(response.text)
    get_len = (len(data['data']))-1
    for fucknum in get_pin:
        if fucknum in pin_list:
            continue
        for num in range(len(data['data'])):
            if fucknum in data['data'][num]['value']:
                get_pin_id = data['data'][num]['id']
                print('黑号(火爆)的pin：'+fucknum)
                get_pin_num = num
                to_hell(get_pin_num,get_len,get_pin_id)


get_total()

