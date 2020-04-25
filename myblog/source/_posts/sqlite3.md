---
title: sqlite3
date: 2020-04-25 12:40:29
tags: 
- sqlite3
categories:
- 数据库
---
# 概念 #

SQLite3只是一个轻型的嵌入式数据库引擎，占用资源非常低，处理速度比Mysql还快，专门用于移动设备上进行适量的数据存取，它只是一个文件，不需要服务器进程。

# 数据定义 #
## 新建表 ##
    create table if not exists 表名 (字段名1 字段类型1，字段名2 字段类型2，。。。);

    CREATE TABLE IF NOT EXISTS t_person (id integer PRIMARY KEY AUTOINCREMENT, name text NOT NULL, age integer NOT NULL); 

## 删除表 ##
    drop：dorp table 表名；drop table if exists 表名；

    DROP TABLE IF EXISTS t_person; 

## 数据操作 ##

## 添加表中的数据 ##
    insert：insert into 表名 (字段1，字段2，。。。) values (字段1的值，字段2的值);字符串内容用单引号。

    INSERT INTO t_person (name, age) VALUES ('大明', 22); 

## 修改表中的数据 ##
    update：update 表名 set 字段1 ＝ 字段1的值，字段2 ＝ 字段2的值，。。。;

    UPDATE t_person SET name = '小明', age = 10; // 把表中name字段的值全部改成小明，age字段的值全部改成10。  

    UPDATE t_person SET age = 12 WHERE name = '小明'; // 把表中name字段值是小明的age值改为12。  

## 删除表中的数据 ##
    delete：delete from 表名；delete from 表名 where 字段 ＝ 字段值。
    DELETE FROM t_person; // 删除表中的所有记录。 

    DELETE FROM t_person WHERE age = 25; // 删除表中字段age等于25的这条记录。 

    DELETE FROM t_person WHERE age > 12 AND age < 15; // 删除表中年龄大于12且小于15的记录。 

## 数据查询 ##

    select：select 字段1， 字段2， 。。。 from 表名；
    
    SELECT name, age FROM t_person WHERE age < 80; 

    SELECT * FROM t_person WHERE age < 80; 

    SELECT name, age nianling FROM t_person ren WHERE ren.age > 80 AND nianling < 90; 

## 计算记录条数 ##
    select count(字段或者*) from 表名；

    SELECT count(name) FROM t_person ren WHERE ren.age > 80; 

    SELECT count(*) FROM t_person ren WHERE ren.age > 80; 

## where ##
    where 字段 ＝ 某值；

## order by ##
    select * from 表名 order by 字段(默认升序)；
    select * from 表名 order by 字段1 asc(先按字段1升序)，字段2 desc(再按字段2降序)；
    SELECT * FROM t_person WHERE age < 100 ORDER BY age DESC, name ASC; // 先按年龄降序，再按名字升序。  

## limit ##
    select * from 表名 limit 数值1，数值2；
    SELECT * FROM t_person WHERE age < 100 ORDER BY age DESC, name ASC LIMIT 3, 5; // 先筛选，后排序，再分页。 

## like ##
    模糊查询，select 字段1 from 表名 where 字段 like ％某值％；

    SELECT * FROM t_person WHERE name like '%明%'; 

## 存储类型 ##
    integer(整型)、real(浮点型)、text(文本字符串)、blob(二进制数据)。

    实际上SQLite是无类型的，建表时声明的类型是为了方便程序员之间的交流，是一种良好的编程规范。

## 字段约束 ##

    not null：字段的值不能为空。
    unique：字段的值必需唯一。
    default：指定字段的默认值。
    primary key：主键，用来唯一的标识某条记录，相当于记录的身份证。主键可以是一个或多个字段，应由计算机自动生成和管理。主键字段默认包含了not null和unique两个约束。
    autoincrement：当主键是integer类型时，应该增加autoincrement约束，能实现主键值的自动增长。

    CREATE TABLE IF NOT EXISTS t_person (id integer PRIMARY KEY AUTOINCREMENT, name text NOT NULL UNIQUE, age integer NOT NULL DEFAULT 30); 

## 外键 ##
    利用外键约束可以用来建立表与表之间的联系，一般是一张表的某个字段，引用着另一张表的主键的字段。

## 创建一个表 ##
    CREATE TABLE IF NOT EXISTS t_class (id integer PRIMARY KEY AUTOINCREMENT, name text NOT NULL UNIQUE);

## 创建一个带外键的表 ##
    t_student表中有一个叫做fk_student_class的外键，这个外键的作用是让t_student表中的class_id字段引用t_class表中的id字段。

    CREATE TABLE IF NOT EXISTS t_student (id integer PRIMARY KEY AUTOINCREMENT, name text NOT NULL, age integer NOT NULL, class_id integer NOT NULL, CONSTRAINT fk_student_class FOREIGN KEY (class_id) REFERENCES t_class(id)); 

## 利用外键来查询多张表中的数据 ##

    SELECT t.name t_name, t.age t_age, tc.name c_name FROM t_student t, t_class tc WHERE t.class_id = tc.id;　// 查询所有学生对应的班级 

    SELECT * FROM t_student WHERE class_id = (SELECT id FROM t_class WHERE name = '四班'); // 查询四班的所有学生