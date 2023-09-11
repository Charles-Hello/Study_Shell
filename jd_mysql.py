import mysql.connector
from miao_config import db_config

# 连接到MySQL数据库
def get_wxid_bypin(pt_pin):
    try:
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor()

        # 查询表jd_ck_wskey_table中满足条件的记录
        query = f"SELECT wxid FROM jd_ck_wskey_table WHERE pt_pin = '{pt_pin}'"
        cursor.execute(query)

        # 提取所有满足条件的wskey并存储为列表
        pt_pin = cursor.fetchall()
        if len(pt_pin) ==0:
            print("没有这个pt_pin,不进行推送")
            return False
        else:
            print(pt_pin[0][0])
            return pt_pin[0][0]
    except mysql.connector.Error as error:
        print(f"MySQL连接错误: {error}")

    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()
            print("MySQL连接已关闭")
            
# get_wxid_bypin("山野间")