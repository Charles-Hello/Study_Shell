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
from miao_ql_api import ql_api
import requests
'''
cron: 0 0-23/3 * * *
new Env('ql删除过期ck');
'''
# cron "30 23 * * *" script-path=miao_dele_low_ck.py,tag=匹配cron用
# const $ = new Env('ql删除过期ck');



ql_api().delete_ck()

