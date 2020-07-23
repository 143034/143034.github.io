---
title: scrapy数据导出
date: 2020-05-02 23:15:40
tags:
- scrapy
- 数据导出
categories:
- scrapy

---

# 一、概念 #


> Scrapy内部实现了多个Exporter，每个Exporter实现一种数据格式的导出支持的数据格式有：JSON，CSV，XML，Pickle。

# 二、scrapy数据导出方式 #

## 2.1、命令导出数据 ##
    使用-o和-t参数指定导出文件路径以及导出数据格式
    scrapy crawl books -o books.csv

    需要明确地指定导出数据格式时，使用-t参数
    scrapy crawl books -t csv -o books1.data

    运行以上命令后，Scrapy爬虫会以-t参数中的数据格式字符串（如csv、json、xml）为键，
    在配置字典FEED_EXPORTERS中搜索Exporter

### 导出文件路径时可使用的特殊变量 ###
    %(name)s：会被替换为Spider的名字。
  
    %(time)s：会被替换为文件创建时间。

![导出数据](/images/scrapy/导出数据.png)


## 2.2、配置文件导出 ##

### FEED_URI ###

导出文件路径。

    FEED_URI = 'export_data/%(name)s.data'

### FEED_FORMAT ###

导出数据格式。

    FEED_FORMAT = 'csv'

### FEED_EXPORT_ENCODING ###

导出文件编码（默认情况下json文件使用数字编码，其他使用utf-8编码）。

    FEED_EXPORT_ENCODING = 'gbk'

### FEED_EXPORT_FIELDS ###

导出数据包含的字段（默认情况下导出所有字段），并指定次序。

    FEED_EXPORT_FIELDS = ['name', 'author', 'price']

### FEED_EXPORTERS ###

用户自定义Exporter字典，添加新的导出数据格式时使用。

    FEED_EXPORTERS = {'excel': 'my_project.my_exporters.ExcelItemExporter'}








