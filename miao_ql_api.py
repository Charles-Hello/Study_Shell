

#  青龙内网端口
from miao_config import *
class ql_api():
    def __init__(self):

        self.url = ql_url
        
        self.headers =ql_headers
    
    
    def login(self):
      data = '{"username":"%s","password":"%s"}' % (username, password)

      response = requests.post(f'http://{self.url}/api/user/login',
                              headers=self.headers, data=data, verify=False)
      print(response.text)
      

    def dele_re_task(self,task_id):

        data =f'["{task_id}"]'

        requests.delete(f'http://{self.url}/api/crons',
                                  headers=self.headers, data=data,
                                  verify=False)
    def get_task(self):

        response = requests.get(f'http://{self.url}/api/crons',
                                headers=self.headers, verify=False)

        data = json.loads(response.text)
        li = []
        for a in range(data['data']['total']):
            all_task = data['data']['data'][a]['command']
            li.append(all_task)
        # print(li)

        id_li = []
        for b in range(data['data']['total']):
            all_task_id = data['data']['data'][b]['id']
            id_li.append(all_task_id)

        # print(id_li)

        # 任务列表和id列表是一一对应的～Å

        news_li = []
        for index, i in enumerate(li):
            if i not in news_li:
                news_li.append(i)
            else:
                # 通找到对应id进行删除
                self.dele_re_task(id_li[index])
                # 进行去重操作～

        print('去重后所的任务数量为' + str(len(news_li)) + "个")
    
    def check_ck(self):
        data = self.get_status()
        with open(wxid_file,'r') as f1:
            g = f1.read()
            
        for a in range(len((data['data']))):
            status = data['data'][a]['status']
            if status == 1:
                ck = data['data'][a]['value']
                print(ck)
                pin = re.findall('pt_pin=(.*);',ck)[0]
                import urllib.parse
                def is_Chinese(word):
                    for ch in word:
                        if '\u4e00' <= ch <= '\u9fff':
                            return True
                    return False

                if not is_Chinese(pin):
                    pin = urllib.parse.unquote(pin)
                if pin in g :
                    wxid = re.findall(f'{pin}\$(.*)',g)[0]
                    send_text_msg(wxid, '你这个'+pin+'失效\n请再次登陆京东\n回复「教学」查看上车教学\n重新登陆即可\n输入「查询」查看总上车情况')
                    time.sleep(15)
    def get_status(self):
        params = (
            ('searchValue', ''),
        )
        response = requests.get(f'http://{self.url}/api/envs', headers=self.headers, params=params, verify=False)
        data = json.loads(response.text)
        return data
      
    

    def delete_ck(self):

        data = self.get_status()
        for a in range(len(data['data'])):
            if data['data'][a]['status'] == 1:
                id = data['data'][a]['id']
                print(id)
                data = f'["{id}"]'
                response = requests.delete(f'http://{self.url}/api/envs',
                                            headers=self.headers, data=data,
                                            verify=False)
                print(response.text)








 
