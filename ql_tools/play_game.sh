
ssh() {
  echo '开始一键安装ssh'
  sudo apt install openssh-server
  sudo passwd root
  sudo sed -i "s/PermitRootLogin prohibit-password/PermitRootLogin yes/g" /etc/ssh/sshd_config
  sudo systemctl restart sshd
  echo 'ssh安装成功！'
  cat << EOF
**************************************
*       安装ssh成功         *
*       默认端口为22         *
**************************************
EOF
}

samba() {
  echo '开始一键安装samba'
  sudo apt-get install samba samba-common
  sed '$a\[share]\\n  path=/root\\n  public=yes\\n  writable=yes\\n  available=yes' /etc/samba/smb.conf
  sduo  touch /etc/samba/smbpasswd
  sudo smbpasswd -a root
  sudo /etc/init.d/smbd restart
  echo 'samba局域网安装成功！'
  cat << EOF
**************************************
*       安装samba成功             *
*       连接smb://本机的ip        *
*       默认以share为目录名字        *
*       默认以root为共享目录        *
**************************************
EOF
}

ql1() {
  echo '正在创建ql'
  docker run -dit \
-v $PWD/ql/config:/ql/config \
-v $PWD/ql/log:/ql/log \
-v $PWD/ql/db:/ql/db \
-v $PWD/ql/repo:/ql/repo \
-v $PWD/ql/raw:/ql/raw \
-v $PWD/ql/scripts:/ql/scripts \
-v $PWD/ql/jbot:/ql/jbot\
-p 5700:5700 \
--name qinglong \
--hostname qinglong \
--restart unless-stopped \
whyour/qinglong:latest
  echo 'ql容器搭建成功！'
  cat << EOF
**************************************
*       搭建容器🐉1 成功             *
*       访问面板: 127.0.0.1:5700        *
**************************************
EOF
}

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
  echo "请选择您需要进行的操作:"
    echo "  1) 安装 ql"
    echo "  2) 安装 ql2"
    echo "  3) 安装 ql3"
    echo "  4) 安装 ql4"
    echo ""
    echo -n "请输入编号: "
    read N
    case $N in
    1) ql1 ;;
    2) ql2 ;;
    3) ql3 ;;
    4) ql4 ;;
    *) echo "输入错误！" ;;
    esac
}

main() {
    if [[ $EUID -eq 0 ]]
then
    cat << EOF
**************************************
*       Welcome to My tools          *
*       Author: miaomiaomiao         *
*       Date: 2022/3/8               *
**************************************
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

