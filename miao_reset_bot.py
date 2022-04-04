# -*- coding: utf-8 -*-
"""
@Time ： 2022/1/6 08:46
@Auth ： maomao
@File ：reset.py
@IDE ：PyCharm
@Motto：ABC(Always Be Coding)
"""
import requests
import re
import sys
import os
requests.packages.urllib3.disable_warnings()
import time

'''
cron: 0 0-23/1 * * *
new Env('重启机器人');
'''

import subprocess
ret, val = subprocess.getstatusoutput("cd /ql ; if [ -d '/jd' ]; then cd /jd/jbot; pm2 start ecosystem.config.js; cd /jd; pm2 restart jbot; else ps -ef | grep 'python3 -m jbot' | grep -v grep | awk '{print $1}' | xargs kill -9 2>/dev/null; nohup python3 -m jbot >/ql/log/bot/bot.log 2>&1 & fi ")
print(ret)