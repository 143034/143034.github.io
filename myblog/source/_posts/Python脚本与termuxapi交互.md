---
title: Python脚本与termuxapi交互
date: 2020-10-14 10:55:52
tags:
- python
- termux
categories:
- python

---

# 一、步骤简介 #

1. **使用os.system命令运行shell命令**

2. **返回值保存在某一个文件中，再通过python读取内容。**


### 1.1、termuxapi使用 ###

见国光termux文档



# 二、代码示例 #
	import os 
	import time
	import json
	os.system(f"rm -rf test.json")
	os.system(f"termux-dialog confirm -i 'Hello Termux' -t 'confirm测试' >> test.json")
	time.sleep(2)
	with open("test.json","r") as f:
	    date =  json.load(f)
	    if date["text"] == 'yes':
	        print(1)
	    else:
	        print(0)
	    f.close()
	os.system(f"rm -rf test.json")

# 三、可实现功能 #

1. **菜单功能显示**
2. **电话簿备份**
3. **播放器**