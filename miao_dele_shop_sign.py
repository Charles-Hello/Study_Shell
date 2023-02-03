# -*- coding: utf-8 -*-
"""
@Time ： 2022/3/16 09:06
@Auth ： maomao
@File ：dele_shop_sign.py
@IDE ：PyCharm
@Motto：ABC(Always Be Coding)
"""
'''
cron: 0 23 * * *
new Env('ql删除失效店铺签到');
'''

import requests
import re
import os

requests.packages.urllib3.disable_warnings()
'''———————————————————————需要填写的地方——————————————————————————————'''
#填写签到脚本目录的目录
src = '/ql/log/Annyoo2021_scripts_jd_shop_sign_73/'

'''———————————————————————需要填写的地方——————————————————————————————'''
files = os.listdir(src)
files_path = [f'{src}{file}' for file in files]
files_path.sort(key=lambda fp: os.path.getctime(fp),reverse=True)
newest_file = files_path[0]
with open(newest_file,'r') as f1:
    a = f1.read()

results = re.findall('第(.*)个店铺签到活动已失效',a)
# print(results)
with open('/ql/config/config.sh','r') as f1:
    b = f1.read()

for hh in results:
    try:
        print(hh)
        gg = re.findall(f'export MyShopToken{hh}=".*"',b)[0]
        b = b.replace(gg,'')
        with open('/ql/config/config.sh','w') as f2:
            f2.write(b)
    except:
        pass

with open('/ql/config/config.sh','r')as f1:
    kk =f1.read()

re_tool = re.findall('export MyShopToken.*=".*"',kk)
a = 1
for num in re_tool:
    # print(num)
    ding = re.findall('export MyShopToken(.*)=".*"',num)[0]
    # print(ding)
    re_tool = re.sub(ding, str(a),num)
    # print(re_tool)
    kk  = kk.replace(num,re_tool)
    with open('/ql/config/config.sh','w') as f2:
        f2.write(kk)
    a +=1
