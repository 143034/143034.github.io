---
title: Nginx
date: 2020-04-21 09:43:23
tags: Nginx
---



# 基本操作 #


















## 一、虚拟主机 ##



> 定义：一台服务器当多台服务器使用，从而可以配置多个网站

>一个server标签就是一个虚拟主机

配置虚拟主机的两种方式：

### 1.1、基于端口 ###




### 1.2、基于域名 ###
    1、在nginx.conf下配置

    upstream first.myweb.com {
        server 192.168.0.100:8000;
    }
     upstream second.myweb.com {

        server 192.168.0.100:8001;
    }
    server {
        listen       80;
        server_name  first.myweb.com;
        location / {
           proxy_pass http://first.myweb.com;
        }
    }
    server {
        listen       80;
        server_name  second.myweb.com;

        location / {
            proxy_pass http://second.myweb.com;
        }
    }
    #配置两个基于域名的虚拟主机，分别转发至两个服务器：192.169.0.100:8000||8001



    2、获取nginx的ip地址
    ifconfig


    3、将nginx的ip地址解析到本地计算机中

    打开C:\Windows\System32\drivers\etc\hosts文件写入：

    nginx ip    first.myweb.com    second.myweb.com

 
    4、使用浏览器进行访问域名就能打开对应的网站服务器



