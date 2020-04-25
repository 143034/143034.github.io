---
title: Nginx
date: 2020-04-21 09:43:23
tags: Nginx
categories:
- 服务器
---



# 基本操作 #




## 一、负载均衡 ##



> 随着业务访问量变大，一台服务器不够使用，此时会把多个机器组成一个集群对外提供服务。通常是指将请“均匀”分摊到急群众多个服务器节点上执行。

### 1.1、Nginx实现 ###
     #在nginx.conf配置


     upstream first.myweb.com {
            #ip_hash
            #least_conn;
            server 192.168.0.100:8000 weight=3;
		    server 192.168.0.100:8001 weight=1;
        }


     server {
            listen       80;
            server_name  first.myweb.com;

            location / {
                proxy_pass http://first.myweb.com;
            }
        }
`


> upstream是配置nginx后端服务器负载均衡的模块，能对后端的服务器的健康状态检查若后端服务器中一台机器故障，则前端请求不会转发到该故障的机器。

### 1.2、负载均衡策略 ###
    1、轮寻（默认）

    2、权重
    weight;

    3、ip_hash
    ip_hash;
    也叫ip绑定，每个请求按访问ip的hash值分配，这样每个访问客户端会固定访问一个后端服务器，可以解决会话session丢失的问题。

    4、最少连接
    least_conn;





## 二、虚拟主机 ##



> 定义：一台服务器当多台服务器使用，从而可以配置多个网站

>一个server标签就是一个虚拟主机

配置虚拟主机的两种方式：

### 2.1、基于端口 ###




### 2.2、基于域名 ###
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



