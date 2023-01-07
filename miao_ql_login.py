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
from miao_ql_api import ql_api
'''
cron: 0 0-23/1 * * *
new Env('ql自动登陆');
'''

ql_api().login()


