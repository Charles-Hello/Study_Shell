
if [ ! -d "/ql" ];then
  dir_root=/jd
else
  dir_root=/ql
fi
dir_bot=$dir_root/jbot
dir_repo=$dir_root/repo
dir_config=$dir_root/config

bot_yilai(){
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
