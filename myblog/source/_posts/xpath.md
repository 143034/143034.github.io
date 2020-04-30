---
title: xpath
date: 2020-04-30 23:43:18
tags: 
- 选择器
- scrapy
categories:
- python
- scrapy
---


# 一、概念 #

> XPath即XML路径语言（XML Path Language），它是一种用来确定xml文档中某部分位置的语言。

# 二、基本语法 #

![xpath](/images/xpath/xpath.png)


## / ##

    描述一个从根开始的绝对路径。

## E1/E2 ##

    选中E1子节点中的所有E2。

## //E ##

    选中文档中的所有E，无论在什么位置。

## E1//E2 ##

    选中E1后代节点中的所有E2，无论在后代中的什么位置。

## E/text() ##

    选中E的文本子节点。

## E/* ##

    选中E的所有元素子节点。

## */E ##

    选中孙节点中的所有E。

## E/@ATTR ##

    选中E的ATTR属性。
    response.xpath('//img/@src')
## //@ATTR ##

    选中文档中所有ATTR属性。
    response.xpath('//@href')
## E/@* ##

    选中E的所有属性。
    response.xpath('//a[1]/img/@*')
## . ##

    选中当前节点，用来描述相对路径。

## .. ##
    选中当前节点的父节点，用来描述相对路径。

## last函数 ##
    选中最后1个
    response.xpath('//a[last()]')
## position函数 ##
    选中前3个
    response.xpath('//a[position()<=3]')
## 选中所有含有id属性的div ##
    response.xpath('//div[@id]')
## 选中所有含有id属性且值为"images"的div ##
    response.xpath('//div[@id="images"]')
# 三、常用函数 #


## string(arg) ##
    返回参数的字符串值。（将列表字符串自动合并）

    sel.xpath('string(/html/body/a/strong)').extract()

## contains(str1, str2) ##

    判断str1中是否包含str2，返回布尔值。
    sel.xpath('//p[contains(@class, "small")]')

