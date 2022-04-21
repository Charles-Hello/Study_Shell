#!/bin/bash

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
  if [ $(grep -c "$FIND_STR" $FIND_FILE) -ne '0' ]; then
      echo "已经挂载了共享目录,跳过"
  else
    read -p "请输入你想要共享的文档：" path
    sed -i "\$a\[share]\n  path=/$path\n  public=yes\n  writable=yes\n  available=yes  \ndeadtime=1000  \nmax connections=0  " /etc/samba/smb.conf
  fi
  sudo  touch /etc/samba/smbpasswd
  echo '当前登录linux的用户名一致即root'
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
  echo -e "本shell和diybot只确保在2.11.3流畅运行！\n不推荐小白安装其他版本！"
  echo
  read -p "请输入你想创建ql容器几：" name
  echo -e -p "输入latest或者2.11.3(默认: 2.11.3，回车)"
  echo
  read -p "请输入你想ql版本：" version
  [[ -z ${version}   ]] && version="2.11.3"
  val=$(expr 2 \* $name - 1)
  _ip=$(expr 5700 + $val)
  docker run -dit \
    -v $PWD/ql$name/config:/ql/config \
    -v $PWD/ql$name/log:/ql/log \
    -v $PWD/ql$name/db:/ql/db \
    -v $PWD/ql$name/repo:/ql/repo \
    -v $PWD/ql$name/raw:/ql/raw \
    -v $PWD/ql$name/scripts:/ql/scripts \
    -v $PWD/ql$name/jbot:/ql/jbot \
    -v $PWD/ql$name/deps:/ql/deps -p $_ip:5700 \
    --name qinglong$name \
    --hostname qinglong \
    --restart unless-stopped \
    whyour/qinglong:"$version"
    #拉取依赖并安装
  if [ $? -eq 0 ]; then
    echo "ql$name 容器搭建成功！"
    echo "**************************************"
    echo "*       搭建容器🐉$name 成功               *"
    echo "*       访问面板: 127.0.0.1:$_ip  *"
    echo "**************************************"
  else
    echo "命令失败"
  fi
}

backup() {
  wget https://raw.githubusercontent.com/Charles-Hello/study_shell/master/ql_backup.py && echo "请先修改好backup.py的里面的内容再运行python3 ql_backup.py"
}

up_apt() {
  echo 'apt-get 安装程序运行'
  sudo apt-get update
  sudo apt-get upgrade
  sudo apt-get -f install
  apt-get install -y sudo wget curl psmisc net-tools
}

install_docker() {
  curl -sSL https://get.daocloud.io/docker | sh
}

ql() {
  clear
  echo "请选择您需要进行的操作:"
    echo "  1) 安装 ql"
    echo "  2) 返回上一级"
    echo "  3) 退出脚本"
    echo ""
    echo -n "请输入编号: "
    read N
    case $N in
    1) ql1 ;;
    2) main ;;
    3) exit ;;
    *) echo "输入错误！" ;;
  esac
}

main() {
    if [[ $EUID -eq 0 ]]; then
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
    echo "  4) 备份服务器目录"
    echo "  5) 更新apt包(first)"
    echo "  6) 安装docker"
    echo "  7) 退出脚本"
    echo ""
    echo -n "请输入编号: "
    read N
    case $N in
      1) ssh ;;
      2) samba ;;
      3) ql ;;
      4) backup ;;
      5) up_apt ;;
      6) install_docker ;;
      7) exit ;;
      *) echo "输入错误！请重新 bash root.sh 启动脚本" ;;
    esac
  else
    echo '请使用root执行'
  fi
}
main
