---
title: 使用LinkExtractor提取链接
date: 2020-04-29 17:12:08
tags: 
- 链接提取 
- scrapy
categories:
- scrapy

---


# 介绍 #
> Scrapy提供了一个专门用于提取链接的类LinkExtractor，在 提取大量链接或提取规则比较复杂时，使用LinkExtractor更加方便。

# 导入 #

> from scrapy.linkextractors import LinkExtractor

    example:
    '''创建一个LinkExtractor对象，使用一个或多个构造器参数 描述提取规则'''
    le = LinkExtractor(restrict_css='ul.pager li.next') 
    '''调用LinkExtractor对象的extract_links方法传入一个 Response对象,在Response对象所包含的页面中提取链接，最终返回一个列表.'''
    links = le.extract_links(response)


# 提取规则 #


## LinkExtractor的参数： ##
### allow ###
接收一个正则表达式或一个正则表达式列表，提取绝对url与正则表达式匹配的链接，如果该参数为空（默认），就提取全部链接。

    le = LinkExtractor(allow=pattern)

### deny ###
接收一个正则表达式或一个正则表达式列表，与allow相反

    le = LinkExtractor(deny=pattern)

### allow_domains ###
接收一个域名或一个域名列表，提取到指定域的链接。

    le = LinkExtractor(allow_domains=domains)

### deny_domains ###
接收一个域名或一个域名列表，与allow_domains相反，排除到指定域的链接。

    le = LinkExtractor(deny_domains='github.com')

### restrict_xpaths ###
接收一个XPath表达式或一个XPath表达式列表，提取XPath表达式选中区域下的链接。

    le = LinkExtractor(restrict_xpaths='//div[@id="top"]')

### restrict_css ###
接收一个CSS选择器或一个CSS选择器列表，提取CSS选择器选中区域下的链接。

    le = LinkExtractor(restrict_css='div#bottom')

### tags ###
接收一个标签（字符串）或一个标签列表，提取指定标签内的链接，默认为['a', 'area']。
### attrs ###
接收一个属性（字符串）或一个属性列表，提取指定属性内的链接，默认为['href']。

    le = LinkExtractor(tags='script', attrs='src')
