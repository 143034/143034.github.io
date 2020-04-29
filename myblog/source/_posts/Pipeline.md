---
title: Pipeline
tags: 
- Pipeline
categories:
- scrapy

date: 2020-04-25 00:43:31
---



# scrapy框架中的使用Pipeline #


## 1.settings文件中设置（整体设置） ##
`ITEM_PIPELINES = {
   'paper_downloader.pipelines.CsvPipeline': 302,
}`



## 2.在爬虫文件中编写特定的管道（单个设置） ##
### 在爬虫文件中引入 ###

`custom_settings = {
    'ITEM_PIPELINES':{
        'paper_downloader.pipelines.CsvPipeline': 302,
    }    
}`
### 同时要在settings文件进行整体设置 ###

`ITEM_PIPELINES = {
    'paper_downloader.pipelines.CsvPipeline': 302,
}`
