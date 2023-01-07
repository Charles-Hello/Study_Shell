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
from ql_api import ql_api
import requests
'''
cron: 0 0-23/3 * * *
new Env('ql删除过期ck');
'''
#检测ql状态如果为假，则删除



ql_api.delete_ck()

