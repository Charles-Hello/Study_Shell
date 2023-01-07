# -*- coding: utf-8 -*-
"""
@Time ： 2022/1/22 08:53
@Auth ： maomao
@File ：miao_dele_repeat_task.py
@IDE ：PyCharm
@Motto：ABC(Always Be Coding)
"""
import requests
requests.packages.urllib3.disable_warnings()
from  miao_config import *
from ql_api import ql_api
'''
cron: 0 0-23/1 * * *
new Env('ql删除重复任务');
'''

#delete的原理是删除 任务列表中一模一样的字段



ql_api.get_task()
