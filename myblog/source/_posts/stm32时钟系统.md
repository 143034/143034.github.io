---
title: stm32时钟系统
date: 2020-07-23 18:01:41
tags:
- stm32
- 时钟系统
categories:
- 单片机
- stm32

---
# 介绍: #

![时钟图](/images/单片机/stm32/时钟图.png)

## 1、STM32 有5个时钟源:HSI、HSE、LSI、LSE、PLL。 ##

	①、HSI是高速内部时钟，RC振荡器，频率为8MHz，精度不高。
	 
	②、HSE是高速外部时钟，可接石英/陶瓷谐振器，或者接外部时 钟源，频率范围为4MHz~16MHz。
	
	③、LSI是低速内部时钟，RC振荡器，频率为40kHz，提供低功耗时钟。WDG
	
	④、LSE是低速外部时钟，接频率为32.768kHz的石英晶体。RTC
	
	⑤、PLL为锁相环倍频输出，其时钟输入源可选择为HSI/2、HSE或者HSE/2。倍频可选择为2~16倍，但是其输出频率最大不得超过72MHz。

## 2、 系统时钟SYSCLK可来源于三个时钟源：   ##
     
	①、HSI振荡器时钟
	②、HSE振荡器时钟
	③、PLL时钟

## 3、注意： ##


	STM32可以选择一个时钟信号输出到MCO脚(PA8)上，可以选择为PLL输出的2分频、HSI、HSE、或者系统时钟。
	
	任何一个外设在使用之前，必须首先使能其相应的时钟。


## 4、几个重要的时钟： ##

	SYSCLK(系统时钟) :
	AHB总线时钟
	APB1总线时钟(低速): 速度最高36MHz
	APB2总线时钟(高速): 速度最高72MHz
	PLL时钟

## 5、相关配置寄存器 ##
	
	typedef struct
	{
	  __IO uint32_t CR;                //HSI,HSE,CSS,PLL等的使能和就绪标志位 
	  __IO uint32_t CFGR;           //PLL等的时钟源选择，分频系数设定
	  __IO uint32_t CIR;               // 清除/使能 时钟就绪中断
	  __IO uint32_t APB2RSTR;  //APB2线上外设复位寄存器
	  __IO uint32_t APB1RSTR;   //APB1线上外设复位寄存器
	  __IO uint32_t AHBENR;    //DMA，SDIO等时钟使能
	  __IO uint32_t APB2ENR;   //APB2线上外设时钟使能
	  __IO uint32_t APB1ENR;   //APB1线上外设时钟使能
	  __IO uint32_t BDCR;        //备份域控制寄存器
	  __IO uint32_t CSR;           //控制状态寄存器
	} RCC_TypeDef;
