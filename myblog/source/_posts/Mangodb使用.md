---
title: Mangodb使用
date: 2020-08-17 17:10:49
tags:
- mangodb
categories:
- python
- 数据库

---

# 连接 #

	from pymongo import MongoClient
	
	# 连接服务器
	conn = MongoClient("localhost", 27017)
	
	# 连接数据库
	db = conn.mydb
	
	# 获取集合
	collection = db.student
	
	#添加文档
	#collection.insert({"name":"abc", "age":19, "gender":1,"address":"北京", "isDelete":0})
	collection.insert([{"name":"abc1", "age":19, "gender":1,"address":"北京", "isDelete":0},{"name":"abc2", "age":19, "gender":1,"address":"北京", "isDelete":0}])
	
	#断开
	conn.close()

# 查询文档 #



	import pymongo
	from pymongo import MongoClient
	from bson.objectid import ObjectId#用于ID查询
	
	# 连接服务器
	conn = MongoClient("localhost", 27017)
	
	# 连接数据库
	db = conn.mydb
	
	# 获取集合
	collection = db.student
	
	# 查询文档
	
	# 查询部分文档
	'''
	res = collection.find({"age":{"$gt":18}})
	for row in res:
	    print(row)
	    print(type(row))
	'''
	
	# 查询所有文档
	'''
	res = collection.find()
	for row in res:
	    print(row)
	    print(type(row))
	'''
	
	#统计查询
	'''
	res = collection.find({"age":{"$gt":18}}).count()
	print(res)
	'''
	
	
	#根据id查询
	'''
	res = collection.find({"_id":ObjectId("5995084b019723fe2a0d8d14")})
	print(res[0])
	'''
	
	# 排序
	'''
	# res = collection.find().sort("age")#升序
	res = collection.find().sort("age", pymongo.DESCENDING)
	for row in res:
	    print(row)
	'''
	
	# 分页查询
	res = collection.find().skip(1).limit(1)
	for row in res:
	    print(row)
	
	
	#断开
	conn.close()

# 更新文档 #

	from pymongo import MongoClient
	
	# 连接服务器
	conn = MongoClient("localhost", 27017)
	# 连接数据库
	db = conn.mydb
	# 获取集合
	collection = db.student
	
	collection.update({"name":"lilei"},{"$set":{"age":25}})
	
	#断开
	conn.close()

# 删除文档 #

	from pymongo import MongoClient
	
	# 连接服务器
	conn = MongoClient("localhost", 27017)
	# 连接数据库
	db = conn.mydb
	# 获取集合
	collection = db.student
	
	collection.remove({"name":"lilei"})
	#全部删除
	collection.remove()
	#断开
	conn.close()



