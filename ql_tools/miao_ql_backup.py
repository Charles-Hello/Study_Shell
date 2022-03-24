# -*- coding: utf-8 -*-
"""
@Time ： 2022/3/18 17:39
@Auth ： maomao
@File ：ali.py
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
from aligo import Aligo
from config import *
import logging
import os
import sys
import tarfile
import time
from threading import Thread
logging.basicConfig(level=logging.INFO, format='%(message)s')
logger = logging.getLogger(__name__)

#这里填写root里面的你想要保存的ql的路径
path_list = ['ql','ql2','ql3','ql4','ql10']
QLBK_MAX_FLIES = 1  # 最大备份保留数量
QLBK_EXCLUDE_NAMES = ['log', '.git', '.github',
                      'node_modules', 'backups']  # 排除目录名

def start1(pathpro):
    try:
        from notify import send
    except:

        logger.info("无推送文件")

    def env(key):
        return os.environ.get(key)

    os.chdir(f'/root/{pathpro}/')

    if env("QLBK_EXCLUDE_NAMES"):
        QLBK_EXCLUDE_NAMES = env("QLBK_EXCLUDE_NAMES")
        logger.info(f'检测到设置变量 {QLBK_EXCLUDE_NAMES}')

    QLBK_BACKUPS_PATH = f'/root/{pathpro}/backups'  # 备份目标目录
    if env("QLBK_BACKUPS_PATH"):
        QLBK_BACKUPS_PATH = str(env("QLBK_BACKUPS_PATH"))
        logger.info(f'检测到设置变量 {QLBK_BACKUPS_PATH}')


    if env("QLBK_MAX_FLIES"):
        QLBK_MAX_FLIES = int(env("QLBK_MAX_FLIES"))
        logger.info(f'检测到设置变量 {QLBK_MAX_FLIES}')
    """开始备份"""
    logger.info('将所需备份目录文件进行压缩...')
    retval = os.getcwd()
    print('@@@@@@@修改！！！！！！'+retval)
    mkdir(QLBK_BACKUPS_PATH,QLBK_BACKUPS_PATH)
    now_time = time.strftime("%Y%m%d_%H%M%S", time.localtime())
    files_name = f'{QLBK_BACKUPS_PATH}/qinglong_{now_time}.tar.gz'
    logger.info(f'创建备份文件: {files_name}')
    if make_targz(files_name, retval):
        send_msg(user_id, tnanko, '备份文件压缩完成...开始上传至阿里云盘！')
        logger.info('备份文件压缩完成...开始上传至阿里云盘')
        #QLBK_BACKUPS_PATH = f'/root/{pathpro}/backups'  # 备份目标目录
        #pathpro =ql
        remote_folder = ali.get_file_by_path(f'{QLBK_BACKUPS_PATH}')  # 云盘目录
        ali.sync_folder(f'{QLBK_BACKUPS_PATH}/',  # 上传至网盘
                        flag=True,
                        remote_folder=remote_folder.file_id)
        message_up_time = time.strftime(
            "%Y年%m月%d日 %H时%M分%S秒", time.localtime())
        text = f'已备份至阿里网盘:\nql/{QLBK_BACKUPS_PATH}/qinglong_{now_time}.tar.gz\n' \
               f'\n备份完成时间:\n{message_up_time}\n'
        try:
            send_msg(user_id, tnanko, text)

        except:
            send_msg(user_id, tnanko, '通知发送失败')
            logger.info("通知发送失败")
        logger.info('---------------------备份完成---------------------')
        send_msg(user_id, tnanko, f'--{pathpro}备份完成--')
    else:
        try:
            send_msg(user_id, tnanko,'备份压缩失败,请检查日志')
        except:
            logger.info("通知发送失败")


def make_targz(output_filename, retval):
    """
    压缩为 tar.gz
    :param output_filename: 压缩文件名
    :param retval: 备份目录
    :return: bool
    """
    try:
        tar = tarfile.open(output_filename, "w:gz")
        os.chdir(retval)
        path = os.listdir(os.getcwd())
        for p in path:
            if os.path.isdir(p):
                if p not in QLBK_EXCLUDE_NAMES:
                    pathfile = os.path.join(retval, p)
                    tar.add(pathfile)
        tar.close()
        return True
    except Exception as e:
        logger.info(f'压缩失败: {str(e)}')
        return False


def mkdir(path,QLBK_BACKUPS_PATH):
    """创建备份目录"""
    folder = os.path.exists(path)
    if not folder:  # 判断是否存在文件夹如果不存在则创建为文件夹
        logger.info(f'第一次备份,创建备份目录: {QLBK_BACKUPS_PATH}')
        os.makedirs(path)  # 创建文件时如果路径不存在会创建这个路径
    else:  # 如有备份文件夹则检查备份文件数量
        backup_files = f'{path}'
        files_all = os.listdir(backup_files)  # backup_files中的所有文件
        logger.info(f'当前备份文件 {len(files_all)}/{QLBK_MAX_FLIES}')
        files_num = len(files_all)
        print('files_num:'+str(files_num))
        print("QLBK_MAX_FLIES:"+str(QLBK_MAX_FLIES))
        if files_num > QLBK_MAX_FLIES:
            logger.info(f'达到最大备份数量 {QLBK_MAX_FLIES} 个')
            check_files(files_all, files_num, backup_files, QLBK_MAX_FLIES)


def show(qr_link: str):
    """打印二维码链接"""
    logger.info('请手动复制以下链接，打开阿里网盘App扫描登录')
    logger.info(f'https://cli.im/api/qrcode/code?text={qr_link}')


def fileremove(filename):
    """删除旧的备份文件"""
    if os.path.exists(filename):
        os.remove(filename)
        logger.info('已删除本地旧的备份文件: %s' % filename)
        remote_folder = ali.get_file_by_path(filename)  # 待删除文件 ID
        if remote_folder is not None:
            ali.move_file_to_trash(file_id=remote_folder.file_id)
            logger.info('已删除云盘旧的备份文件: %s' % filename)
        else:
            logger.info('未找到云端旧的备份文件: %s' % filename)
    else:
        pass


def check_files(files_all, files_num, backup_files, QLBK_MAX_FLIES):
    """检查旧的备份文件"""
    create_time = []
    file_name = []
    for names in files_all:
        if names.endswith(".tar.gz"):
            filename = os.path.join(backup_files, names)
            file_name.append(filename)
            create_time.append(os.path.getctime(filename))  # 获取文件的修改时间
    # 将两个list转换为dict
    dit = dict(zip(create_time, file_name))
    # 根据dit的key对dit进行排序（变为list）
    dit = sorted(dit.items(), key=lambda d: d[-2], reverse=False)
    for i in range(files_num - QLBK_MAX_FLIES):  # 删除文件个数
        file_location = dit[i][1]
        print(file_location)
        fileremove(file_location)


if __name__ == '__main__':
    try:
        ali = Aligo(port=8080)
        send_msg(user_id, tnanko, '如果我显示没有登陆\n则去下面扫码\nhttp://192.168.1.145:8080')
        #直接图像扫码
        # ali = Aligo(level=logging.INFO, show=show)
        # 提供 port 参数即可, 之后打开浏览器访问 http://<YOUR_IP>:<port>
        try:
            res = requests.get('127.0.0.1:8080').status_code
            send_msg(user_id,tnanko,'请前往网址进行扫码登陆！')
            print('请前往网址进行扫码登陆！')
        except Exception as e:
            print(e)
            send_msg(user_id, tnanko, '阿里云盘成功登陆！')
            print('阿里云盘成功登陆！')

    except:
        logger.info('登录失败')
        send_msg(user_id, tnanko, '登录失败！')
        try:
            send_msg(user_id, tnanko, '阿里网盘登录失败,请手动重新运行本脚本登录！')
        except:
            logger.info("通知发送失败")
    threads = []
    for pathpro in path_list:
        print('*'*20+pathpro+'*'*20)
        nowtime = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
        logger.info(
            '---------' + str(nowtime) + ' 备份程序开始执行------------')
        logger.info('登录阿里云盘')
        threads.append(
            Thread(target=start1,
                   args=(pathpro,)))
    for t in threads:
        t.start()
