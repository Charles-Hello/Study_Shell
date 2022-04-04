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
'''
cron: 0 0-23/1 * * *
new Env('ql删除重复任务');
'''

#delete的原理是删除 任务列表中一模一样的字段






def dele_re_task(task_id):
    headers = {
        'Connection': 'keep-alive',
        'Accept': 'application/json',
        'Authorization': 'Bearer %s' % token,
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36 Edg/97.0.1072.62',
        'Content-Type': 'application/json;charset=UTF-8',
        'Origin': f'http://{url}',
        'Referer': f'http://{url}/crontab',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6',
    }

    data =f'["{task_id}"]'

    response = requests.delete(f'http://{url}/api/crons',
                               headers=headers, data=data,
                               verify=False)
    # print(response.text)


def get_task():
    headers = {
        'Connection': 'keep-alive',
        'Authorization': 'Bearer %s' % token,
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36 Edg/97.0.1072.62',
        'sentry-trace': 'e6fca68c13f44e8e9d75dfb6246ef165-a3d048b6c66d674c-1',
        'Accept': '*/*',
        'Referer': f'http://{url}/crontab',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6',
        'If-None-Match': 'W/"14c5d-arXSa2PHwhCGMy3tTjFT7O66TLM"',
    }

    response = requests.get(f'http://{url}/api/crons',
                            headers=headers, verify=False)
    # print(response.text)

    data = json.loads(response.text)
    print('总共有：' + str(len(data['data'])) + '个任务')
    li = []
    for a in range(len(data['data'])):
        all_task = data['data'][a]['command']
        li.append(all_task)
    # print(li)

    id_li = []
    for b in range(len(data['data'])):
        all_task_id = data['data'][b]['id']
        id_li.append(all_task_id)

    # print(id_li)

    # 任务列表和id列表是一一对应的～Å

    news_li = []
    for index, i in enumerate(li):
        if i not in news_li:
            news_li.append(i)
        else:
            # 通找到对应id进行删除
            dele_re_task(id_li[index])
            # 进行去重操作～

    print('去重后所的任务数量为' + str(len(news_li)) + "个")


get_task()
