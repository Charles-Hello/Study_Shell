
if [ ! -d "/ql" ];then
  dir_root=/jd
else
  dir_root=/ql
fi
#一级目录
dir_bot=$dir_root/jbot
dir_repo=$dir_root/repo
dir_config=$dir_root/config

#二级目录
diybot_config_diybotset=$dir_config/user.session
bot_json=$dir_config/bot.




url="https://github.com/Charles-Hello/ql_diybot.git"
repo_path="${dir_repo}/dockerbot"


git_clone_scripts() {
    local url=$1
    local dir=$2
    local branch=$3
    [[ $branch ]] && local part_cmd="-b $branch "
    echo -e "开始克隆仓库 $url 到 $dir\n"
    git clone $part_cmd $url $dir
    exit_status=$?
}

function judge(){
  content=`sed -n "$1p" $bot_json`
  result=$(echo $content | grep "123456789")
  if [[ $result != "" ]]; then
    echo -e  "没有写$2"
    if [[ "$1" == 12 ]];then
      read -p "是否需要用代理呢？请输入[y/n]:   " answer_if
      case $answer_if in
      Y | y)
          get_answer=true
           echo "将帮你填写代理为true";;
      N | n)
          get_answer=false
           echo "将帮你填写代理为false";;
      *)
        get_answer=false
	   echo "输入错误！默认为你填写false"
      esac
    elif [[ "$1" == 24 ]];then
      read -p "开启CMD输入[y], 否则输入[n]:   " answer_if
      case $answer_if in
      Y | y)
          get_answer=true
           echo "开启CMD";;
      N | n)
          get_answer=false
           echo "关闭CMD";;
      *)
        get_answer=false
	   echo "输入错误！默认为你填写true"
      esac
    elif [[ "$1" == 14 ]];then
      read -p "用socks5输入[y], http输入[n]:   " answer_if
      case $answer_if in
      Y | y)
          get_answer=socks5
           echo "将帮你填写代理为socks5";;
      N | n)
          get_answer=http
           echo "将帮你填写代理为http！";;
      *)
        get_answer=socks5
	   echo "输入错误！默认为你填写socks5"
      esac
    elif [[ "$1" == 16 ]];then
      read -p "请输入你的代理ip地址: " get_answer
    elif [[ "$1" == 18 ]];then
      read -p "请输入你的代理ip端口: " get_answer
    else
    read -p "请输入你的$2：" get_answer
    fi
    if [[ "$1" == "4" ]] || [[ "$1" == "12" ]] || [[ "$1" == "18" ]] || [[ "$1" == "24" ]]; then
      sed -ri "s/\"$2\":"\(.*\)"/\"$2\":$get_answer,"/ $bot_json
    else
      sed -ri "s/\"$2\":"\(.*\)"/\"$2\":\"$get_answer\","/ $bot_json
    fi
  else
    echo -e  "写了$2，跳过！"
  fi
  if [[ "$answer_if" == y ]] ; then return 1;else echo return 0; fi
}

if read -p "部署多容器输入[y], 单输入[n]:   " answer_if ;then
case $answer_if in
      Y | y)
           echo "没写！";;
      N | n)echo
            judge 4 user_id
            judge 6 bot_token
            judge 8 api_id
            judge 10 api_hash
            judge 12 proxy
            if [[ "$?" ]] ; then judge 14 proxy_type;judge 16 proxy_add ;judge 18 proxy_port ; else echo "跳过代理填写"; fi
            judge 24 StartCMD;;
      *) echo
	   echo "输入错误！退出脚本"
      esac
fi



bot_yilai(){

  #拉取dockerbot
  ##判断一个目录存在，且为空。一开始容器的dockerbot的git为空，所以需要拉取
  if [[ ! -d ${repo_path}/.git ]]; then
    rm -rf ${repo_path}
    git_clone_scripts ${url} ${repo_path} "main"
  fi
  ##强制复制目录且存在目标覆盖，没有通知
  cp -rf "$repo_path/jbot" $dir_root


  if [[ ! -f "$dir_root/config/bot.json" ]]; then
    cp -f "$repo_path/config/bot.json" "$dir_root/config"
  fi
  #复制环境变量
   cp -f "$repo_path/requirements.txt" "$dir_root/config"

  #填写bot.json文件
  judge


  clear
  echo -e "\n安装bot依赖...\n"
  apk --no-cache add -f zlib-dev gcc jpeg-dev python3-dev musl-dev freetype-dev
  echo -e "\nbot依赖安装成功...\n"

  echo -e "\nbot文件下载成功...\n"
  echo -e "安装python3依赖...\n"
  cd $dir_bot
  pip3 config set global.index-url https://mirrors.aliyun.com/pypi/simple/
  pip3 --default-timeout=100 install -r requirements.txt --no-cache-dir
  echo -e "\npython3依赖安装成功...\n"

  cd $dir_config
  echo -e "安装容器里面的python3依赖...\n"
  pip3 config set global.index-url https://mirrors.aliyun.com/pypi/simple/
  pip3 --default-timeout=100 install -r requirements.txt --no-cache-dir
  echo -e "\n全部依赖安装成功...\n"





  echo "检测 user 文件 "
  if [ -f $diybot_config_diybotset ]; then
    echo "  └—结果：user有残留，正在删除～"
    rm $dir_config/user.session
    rm $dir_config/user.session-journal
  else
    echo "  └—结果：不存在，安全登录！"
  fi


  cd $dir_root
  if [ ! -d "/ql/log/bot" ]; then
      mkdir $dir_root/log/bot
  fi
  if [[ -z $(grep -E "123456789" $dir_root/config/bot.json) ]]; then
    if [ -d "/ql" ]; then
        ps -ef | grep "python3 -m jbot" | grep -v grep | awk '{print $1}' | xargs kill -9 2>/dev/null
        nohup python3 -m jbot >$dir_root/log/bot/bot.log 2>&1 &
        echo -e "bot启动成功...\n"
    else
        cd $dir_bot
        pm2 start ecosystem.config.js
        cd $dir_root
        pm2 restart jbot
        echo -e "bot启动成功...\n"
    fi
else
    echo -e  "似乎 $dir_root/config/bot.json 还未修改为你自己的信息，可能是首次部署容器，因此不启动Telegram Bot...\n配置好bot.json后再次运行本程序即可启动"
fi
}


start() {
  clear
  echo "稍等片刻后，输入手机号（带国家代码）和 Telegram 验证码以完成登录"
  echo "登陆完成后使用 Ctrl + C 退出脚本，并使用以下命令启动 user 监控"
  echo ""
  echo "如果没有显示登陆手机号则通过下面口令查看log报错！"
  echo "cat /ql/log/bot/run.log"
  echo "user.py-->[Errno 9] Bad file descriptor   user没有登陆"
  echo "user登陆的open出现证明网络问题或者等待几分钟再重试"

  if [ -d "/jd" ]
    then echo "cd $dir_root;pm2 restart jbot"
  else
    echo "cd $dir_root;nohup python3 -m jbot > /ql/log/bot/bot.log 2>&1 &"
  fi
  echo ""
  cd $dir_root
  python3 -m jbot
}

main() {
    cat << EOF
"""
              ┏┓      ┏┓
            ┏┛┻━━━┛┻┓
            ┃      ☃      ┃
            ┃  ┳┛  ┗┳  ┃
            ┃      ┻      ┃
            ┗━┓      ┏━┛
                ┃      ┗━━━┓
                ┃  喵喵喵     ┣┓
                ┃　 的bot     ┏┛
                ┗┓┓┏━┳┓┏┛
                  ┃┫┫  ┃┫┫
                  ┗┻┛  ┗┻┛
"""
EOF
    echo "请选择您需要进行的操作:"
    echo "  1) 安装所有的依赖并启动bot"
    echo "  2) 启动diyboy"
    echo "  3) 退出脚本"
    echo ""
    echo -n "请输入编号: "
    read N
    case $N in
    1) bot_yilai ;;
    2) start ;;
    3) exit ;;
    *) echo "输入错误！请重新 bash diybot.sh 启动脚本" ;;
    esac
}
main
