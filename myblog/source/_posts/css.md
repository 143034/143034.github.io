---
title: css
date: 2020-05-01 15:44:12
tags: 
- css
- 选择器
- scrapy
categories:
- scrapy


---

# 一、概念 #
> CSS即层叠样式表，其选择器是一种用来确定HTML文档中某部 分位置的语言。
 
# 二、基本语法 #
![css](/images/css/css.png)

## E ##

    选中E元素。
    response.css('img')

## E1,E2 ##
 
    选中E1和E2元素。
    response.css('base,title')

## E1 E2 ##

    选中E1后代元素中的E2元素。
    response.css('div img')

## E1>E2 ##

    选中E1子元素中的E2元素。
    response.css('body>div')


## [ATTR] ##

    选中包含ATTR属性的元素。
    response.css('[style]')

## [ATTR=VALUE] ##

    选中包含ATTR属性且值为VALUE的元素。
    response.css('[id=images-1]')

## E:nth-child(n) ##

    选中E元素，且该元素必须是其父元素的 第n个子元素。
    选中每个div的第一个a
    response.css('div>a:nth-child(1)')
    选中第二个div的第一个a
    response.css('div:nth-child(2)>a:nth-child(1)')

## E:first-child ##
    选中E元素，该元素必须是其父元素的第一 个子元素。

## E:last-child ##

    选中E元素，该元素必须是其父元素的倒数第一个子元素。
    选中第一个div的最后一个a
    response.css('div:first-child>a:last-child')

## E::text ##

    选中E元素的文本节点。
    response.css('a::text')