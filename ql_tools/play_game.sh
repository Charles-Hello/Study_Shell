ssh() {
  clear
  echo '开始一键安装ssh'
  sudo apt install openssh-server
  sudo passwd root
  sudo sed -i "s/PermitRootLogin prohibit-password/PermitRootLogin yes/g" /etc/ssh/sshd_config
  sudo systemctl restart sshd
  sudo ufw allow ssh #打开防火墙
  sudo iptables -A INPUT -p tcp --dport 22 -m conntrack --ctstate NEW,ESTABLISHED -j ACCEPT  #开放22端口
  echo 'ssh安装成功！'
  cat << EOF
**************************************
*       安装ssh成功         *
*       已经开启root访问        *
*       默认端口为22         *
**************************************
EOF
}

samba() {
  clear
  echo '开始一键安装samba'
  sudo apt-get install samba samba-common
  FIND_FILE="/etc/samba/smb.conf"
  FIND_STR="writable=yes"
  # 判断匹配函数，匹配函数不为0，则包含给定字符
  if [ `grep -c "$FIND_STR" $FIND_FILE` -ne '0' ];then
      echo "已经挂载了共享目录,跳过"
  else
    read -p "请输入你想要共享的文档：" path
    sed -i "\$a\[share]\n  path=/$path\n  public=yes\n  writable=yes\n  available=yes" /etc/samba/smb.conf
    fi
  sudo  touch /etc/samba/smbpasswd
  echo '请输入你的密码'
  sudo smbpasswd -a root
  sudo /etc/init.d/smbd restart
  echo 'samba局域网安装成功！'
  cat << EOF
**************************************
*       安装samba成功             *
*       连接smb://本机的ip        *
*       默认以share为目录名字        *
*       账号为：root            *
*       密码为：你设置的密码        *
**************************************
EOF
}

ql1() {
  docker run -dit \
-v $PWD/ql/config:/ql/config \
-v $PWD/ql/log:/ql/log \
-v $PWD/ql/db:/ql/db \
-v $PWD/ql/repo:/ql/repo \
-v $PWD/ql/raw:/ql/raw \
-v $PWD/ql/scripts:/ql/scripts \
-v $PWD/ql/jbot:/ql/jbot\
-v $PWD/ql/deps:/ql/deps\
-p 5700:5700 \
--name qinglong \
--hostname qinglong \
--restart unless-stopped \
whyour/qinglong:latest
  echo "ql 容器搭建成功！"
  cat << EOF
**************************************
*       搭建容器🐉1 成功             *
*       访问面板: 127.0.0.1:5700        *
**************************************
EOF
}
#
ql2() {
  echo '正在创建ql2'
    docker run -dit \
  -v $PWD/ql2/config:/ql/config \
  -v $PWD/ql2/log:/ql/log \
  -v $PWD/ql2/db:/ql/db \
  -v $PWD/ql2/repo:/ql/repo \
  -v $PWD/ql2/raw:/ql/raw \
  -v $PWD/ql2/scripts:/ql/scripts \
  -v $PWD/ql2/jbot:/ql/jbot\
  -p 5703:5700 \
  --name qinglong2 \
  --hostname qinglong \
  --restart unless-stopped \
  whyour/qinglong:latest
  echo 'ql2容器搭建成功！'
  cat << EOF
**************************************
*       搭建容器🐉2 成功             *
*       访问面板: 127.0.0.1:5703        *
***************************************
EOF
}



ql3() {
  echo '正在创建ql3'
  docker run -dit \
  -v $PWD/ql3/config:/ql/config \
  -v $PWD/ql3/log:/ql/log \
  -v $PWD/ql3/db:/ql/db \
  -v $PWD/ql3/repo:/ql/repo \
  -v $PWD/ql3/raw:/ql/raw \
  -v $PWD/ql3/scripts:/ql/scripts \
  -v $PWD/ql3/jbot:/ql/jbot\
  -p 5705:5700 \
  --name qinglong3 \
  --hostname qinglong \
  --restart unless-stopped \
  whyour/qinglong:latest
  echo 'ql3容器搭建成功！'
  cat << EOF
**************************************
*       搭建容器🐉3 成功             *
*       访问面板: 127.0.0.1:5705        *
**************************************
EOF
}

ql4() {
  echo '正在创建ql4'
    docker run -dit \
  -v $PWD/ql4/config:/ql/config \
  -v $PWD/ql4/log:/ql/log \
  -v $PWD/ql4/db:/ql/db \
  -v $PWD/ql4/repo:/ql/repo \
  -v $PWD/ql4/raw:/ql/raw \
  -v $PWD/ql4/scripts:/ql/scripts \
  -v $PWD/ql4/jbot:/ql/jbot\
  -p 5707:5700 \
  --name qinglong4 \
  --hostname qinglong \
  --restart unless-stopped \
  whyour/qinglong:latest
  echo 'ql4容器搭建成功！'
  cat << EOF
**************************************
*       搭建容器🐉4 成功             *
*       访问面板: 127.0.0.1:5707        *
**************************************
EOF
}


ql() {
  clear
  echo "请选择您需要进行的操作:"
    echo "  1) 安装 ql"
    echo "  2) 安装 ql2"
    echo "  3) 安装 ql3"
    echo "  4) 安装 ql4"
    echo "  5) 返回上一级"
    echo "  6) 退出脚本"
    echo ""
    echo -n "请输入编号: "
    read N
    case $N in
    1) ql1 ;;
    2) ql2 ;;
    3) ql3 ;;
    4) ql4 ;;
    5) main;;
    6) exit ;;
    *) echo "输入错误！" ;;
    esac
}

main() {
    if [[ $EUID -eq 0 ]]
then
    cat << EOF
  ███████╗███╗   ███╗██╗██╗     ███████╗
  ██╔════╝████╗ ████║██║██║     ██╔════╝
  ███████╗██╔████╔██║██║██║     █████╗
  ╚════██║██║╚██╔╝██║██║██║     ██╔══╝
  ███████║██║ ╚═╝ ██║██║███████╗███████╗
  ╚══════╝╚═╝     ╚═╝╚═╝╚══════╝╚══════╝
EOF
    echo "请选择您需要进行的操作:"
    echo "  1) 安装 ssh"
    echo "  2) 安装 samba"
    echo "  3) 安装青龙容器"
    echo "  4) 退出脚本"
    echo ""
    echo -n "请输入编号: "
    read N
    case $N in
    1) ssh ;;
    2) samba ;;
    3) ql ;;
    4) exit ;;
    *) echo "输入错误！请重新 bash root.sh 启动脚本" ;;
    esac
    else
  echo '请使用root执行'
fi
}
main

