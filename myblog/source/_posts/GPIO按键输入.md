---
title: GPIO按键输入
date: 2020-07-22 11:49:53
tags: 
- stm32
categories:
- 单片机
- stm32

---

# 一、GPIO读取输入 #

### 读取IO口输入电平调用库函数为： ###

> uint8_t GPIO_ReadInputDataBit(GPIO_TypeDef* GPIOx, uint16_t GPIO_Pin);

### 读取IO口输入电平操作寄存器为： ###

	GPIOx_IDR:端口输入寄存器

### 使用位带操作读取IO口输入电平： ###

	PEin(4)          -读取GPIOE.4口电平
	PEin(n)          -读取GPIOE.n口电平

# 二、按键输入实验配置步骤: #

	1、使能按键对应IO口时钟。调用函数：
	RCC_APB2PeriphClockCmd();
	2、初始化IO模式：上拉/下拉输入。调用函数：
	GPIO_Init();
	3、扫描IO口电平（库函数/寄存器/位操作）。


# 三、按键扫描 #
### 支持连续按 ###

	u8 KEY_Scan(void)
	    {
	      if(KEY按下）
	     {
	           delay_ms(10)；//延时10-20ms，防抖。
	           if(KEY确实按下)
	            {
	               return KEY_Value；
	             }
	          return 无效值；
	     }
	    }
### 不支持连续按 ###

	u8 KEY_Scan(void)
	    {
	     static u8 key_up=1;
	      if（key_up &&  KEY按下）
	      {
	        delay_ms(10);//延时，防抖
	        key_up=0;//标记这次key已经按下
	        if(KEY确实按下)
	          {
	           return KEY_VALUE;
	          }
	        }else if(KEY没有按下)  key_up=1;
	       return 没有按下
	    }
