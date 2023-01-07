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
from miao_ql_api import ql_api
'''
cron: 20 1-23/5 * * *
new Env('ck失效机器人推送');
'''
ql_api().check_ck()







