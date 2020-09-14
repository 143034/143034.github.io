---
title: mysql使用
date: 2020-08-17 16:52:14
tags: 
- mysql
categories:
- python
- 数据库

---

# 链接数据库 #

	import pymysql
	
	# 参数1：mysql服务所在主机的IP
	# 参数2：用户名
	# 参数3：密码
	# 参数4：要连接的数据库名
	#db = pymysql.connect("localhost", "root", "sunck", "kaige")
	db = pymysql.connect(  
			host='58.87.82.31',
	    	port=10200,
	    	user='root',
	    	passwd='1234qwer',
	    	db='paper',
	    	# charset='utf8'
	    	)
	# 创建一个cursor对象
	cursor = db.cursor()
	
	sql = "select * from papers"
	#执行sql语句
	cursor.execute(sql)
	#获取返回的信息
	data = cursor.fetchall()
	print(data)
	
	#断开
	cursor.close()
	db.close()

# 创建表 #

	import pymysql
	
	db = pymysql.connect("10.0.142.171", "root", "sunck", "kaige")
	cursor = db.cursor()
	
	# 检查表是否存在，如果存则删除
	cursor.execute("drop table if exists bandcard")
	#建表
	sql = 'create table bandcard(id int auto_increment primary key, money int not null)'
	cursor.execute(sql)
	
	
	cursor.close()
	db.close()

# 插入数据 #

	import pymysql
	
	db = pymysql.connect(  
			host='58.87.82.31',
	    	port=10200,
	    	user='root',
	    	passwd='1234qwer',
	    	db='paper',
	    	# charset='utf8'
	    	)
	cursor = db.cursor()
	
	
	
	sql = 'insert into papers values(0,0,0,0,0,0,0,0,0,0)'
	try:
	    cursor.execute(sql)
	    db.commit()
	except:
	    # 如果提交失败，回滚到上一次数据
	    db.rollback()
	
	
	cursor.close()
	db.close()



# 更新数据 #


	import pymysql
	
	db = pymysql.connect("10.0.142.171", "root", "sunck", "kaige")
	cursor = db.cursor()
	
	
	
	sql = 'update bandcard set money=1000 where id=1'
	try:
	    cursor.execute(sql)
	    db.commit()
	except:
	    # 如果提交失败，回滚到上一次数据
	    db.rollback()
	
	
	cursor.close()
	db.close()


# 数据删除 #

	import pymysql
	
	db = pymysql.connect("10.0.142.171", "root", "sunck", "kaige")
	cursor = db.cursor()
	
	
	
	sql = 'delete from bandcard where money = 200'
	try:
	    cursor.execute(sql)
	    db.commit()
	except:
	    # 如果提交失败，回滚到上一次数据
	    db.rollback()
	
	
	cursor.close()
	db.close()


# 数据查询 #

	'''
	fetchone()
	功能：获取下一个查询结果集，结果集是一个对象
	
	fetchall()
	功能：接收全部的返回的行
	
	rowcount:是一个只读属性，返回execute()方法影响的行数
	
	'''
	import pymysql
	
	db = pymysql.connect("10.0.142.171", "root", "sunck", "kaige")
	cursor = db.cursor()
	
	
	
	sql = 'select * from bandcard where money>400'
	try:
	    cursor.execute(sql)
	
	    reslist = cursor.fetchall()
	    for row in reslist:
	        print("%d--%d" % (row[0], row[1]))
	
	except:
	    # 如果提交失败，回滚到上一次数据
	    db.rollback()
	
	
	cursor.close()