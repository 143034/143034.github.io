---
title: RTC实时时钟
date: 2020-08-08 09:37:21
tags:
- stm32
categories:
- 单片机
- stm32


---
# 一、介绍 #

> RTC是个独立的定时器。RTC模块拥有一个连续计数的计数器，在相应的软件配置下，可以提供时钟日历的功能。修改计数器的值可以重新设置当前时间和日期。


**RTC模块和时钟配置系统(RCC_BDCR寄存器)是在后备区域，即在系统复位或从待机模式唤醒后RTC的设置和时间维持不变。但是在系统复位后，会自动禁止访问后备寄存器和RTC，以防止对后备区域(BKP)的意外写操作。所以在要设置时间之前， 先要取消备份区域（BKP）写保护。**


## RTC特征 ##

![RTC特征](/images/单片机/stm32/RTC/RTC特征.png)




## RTC工作原理框图 ##


![RTC工作原理框图](/images/单片机/stm32/RTC/RTC工作原理框图.png)


## TC由两部分组成 ##


**APB1接口**：用来和APB1总线相连。通过APB1接口可以访问RTC的相关寄存器（预分频值，计数器值，闹钟值）。

**RTC核心**：由一组可编程计数器组成。分两个主要模块。

- 第一个是RTC预分频模块，它可以编程产生最长1秒的RTC时间基TR_CLK。如果设置了秒中断允许位，可以产生秒中断。
- 第二个是32位的可编程计数器，可被初始化为当前时间。系统时间按TR_CLK周期累加并与存储在RTC_ALR寄存器中的可编程时间相比，当匹配时候如果设置了闹钟中断允许位，可以产生闹钟中断。



**RTC内核完全独立于APB1接口，软件通过APB1接口对RTC相关寄存器访问。但是相关寄存器只在RTC APB1时钟进行重新同步的RTC时钟的上升沿被更新。所以软件必须先等待寄存器同步标志位（RTC_CRL的RSF位）被硬件置1才读。**


## RTC时钟源 ##

![RTC时钟源](/images/单片机/stm32/RTC/RTC时钟源.png)

# 二、寄存器 #

## BKP备份寄存器 ##


- 备份寄存器是42个16位的寄存器。可用来存储84个字节数据。
- 它们处在备份区域，当VDD电源切断，仍然由VBAT维持供电。
- 当系统在待机模式下被唤醒，或者系统复位或者电源复位，它们也不会复位。
- 执行以下操作将使能对后备寄存器和RTC访问：
- 设置寄存器RCC_APB1ENR的PWREN和BKPEN位，使能电源和后备时钟。
- 设置寄存器PWR_CR的DBP位，使能对RTC和后备寄存器的访问。

**提醒：一共有42个16位备份寄存器。常用来保存一些系统配置信息和相关标志位。**



![BKP备份寄存器](/images/单片机/stm32/RTC/BKP备份寄存器.png)

## RTC相关寄存器 ##


	RTC控制寄存器             (RTC_CRH，   RTC_CRL)
	RTC预分频装载寄存器       (RTC_PRLH， RTC_PRLL)
	RTC预分频余数寄存器       (RTC_DIVH，  RTC_DIVL)
	RTC计数器寄存器           (RTC_CNTH， RTC_CNTL)
	RTC闹钟寄存器             (RTC_ALRH ，RTC_ALRL)


## RTC控制寄存器高位（RTC_CRH) ##



![RTC_CRH](/images/单片机/stm32/RTC/RTC_CRH.png)

## RTC控制寄存器低位（RTC_CRL) ##


![RTC_CRL](/images/单片机/stm32/RTC/RTC_CRL.png)

**修改CRH/CRL寄存器，必须先判断RSF位，确定已经同步。**

**修改CNT,ALR,PRL的时候，必须先配置CNF位进入配置模式，修改完之后，设置CNF位为0退出配置模式**

**同时在对RTC相关寄存器写操作之前，必须判断上一次写操作已经结束，也就是判断RTOFF位是否置位。**


## RTC_PRLH和RTC_PRLL ##


![RTC_PRLH和RTC_PRLL](/images/单片机/stm32/RTC/RTC_PRLH和RTC_PRLL.PNG)

## RTC_DIVH和RTC_DIVL ##

![RTC_DIVH和RTC_DIVL](/images/单片机/stm32/RTC/RTC_DIVH和RTC_DIVL.png)

## RTC_CNTH和RTC_CNTL ##

![RTC_CNTH和RTC_CNTL](/images/单片机/stm32/RTC/RTC_CNTH和RTC_CNTL.png)

## RTC_ALRH和RTC_ALRL ##

![RTC_ALRH和RTC_ALRL](/images/单片机/stm32/RTC/RTC_ALRH和RTC_ALRL.png)


## 配置RTC寄存器 ##

![配置RTC寄存器](/images/单片机/stm32/RTC/配置RTC寄存器.png)

## 读RTC寄存器 ##

![读RTC寄存器](/images/单片机/stm32/RTC/读RTC寄存器.png)


# RTC相关库函数讲解 #


	void RTC_ITConfig(uint16_t RTC_IT, FunctionalState NewState);
	void RTC_EnterConfigMode(void);
	void RTC_ExitConfigMode(void);
	uint32_t  RTC_GetCounter(void);
	void RTC_SetCounter(uint32_t CounterValue);
	void RTC_SetPrescaler(uint32_t PrescalerValue);
	void RTC_SetAlarm(uint32_t AlarmValue);
	uint32_t  RTC_GetDivider(void);
	void RTC_WaitForLastTask(void);
	void RTC_WaitForSynchro(void);
	FlagStatus RTC_GetFlagStatus(uint16_t RTC_FLAG);
	void RTC_ClearFlag(uint16_t RTC_FLAG);
	ITStatus RTC_GetITStatus(uint16_t RTC_IT);
	void RTC_ClearITPendingBit(uint16_t RTC_IT);









# 三、RTC时钟源和时钟操作函数： #


> void RCC_RTCCLKConfig(uint32_t  CLKSource)；//时钟源选择

> void RCC_RTCCLKCmd(FunctionalState NewState)//时钟使能

## RTC配置函数（预分频，计数值： ##

> void RTC_SetPrescaler(uint32_t PrescalerValue);//预分频配置：PRLH/PRLL

> void RTC_SetCounter(uint32_t CounterValue)；//设置计数器值：CNTH/CNTL

> void RTC_SetAlarm(uint32_t AlarmValue)；//闹钟设置：ALRH/ALRL

## RTC中断设置函数： ##

> void RTC_ITConfig(uint16_t RTC_IT, FunctionalState NewState);//CRH

## RTC允许配置和退出配置函数： ##

> void RTC_EnterConfigMode(void);//允许RTC配置 :CRL位 CNF

> void RTC_ExitConfigMode(void);//退出配置模式:CRL位 CNF


## 同步函数： ##

> void RTC_WaitForLastTask(void)；//等待上次操作完成：CRL位RTOFF

> void RTC_WaitForSynchro(void)；//等待时钟同步：CRL位RSF


## 相关状态位获取清除函数： ##

> FlagStatus RTC_GetFlagStatus(uint16_t RTC_FLAG);

> void RTC_ClearFlag(uint16_t RTC_FLAG);

> ITStatus RTC_GetITStatus(uint16_t RTC_IT);

> void RTC_ClearITPendingBit(uint16_t RTC_IT);

## 其他相关函数（BKP等） ##

> PWR_BackupAccessCmd();//BKP后备区域访问使能

> RCC_APB1PeriphClockCmd();//能PWR和BKP时钟

> RCC_LSEConfig();//开启LSE，RTC选择LSE作为时钟源	

## 其他相关函数（BKP等） ##

> PWR_BackupAccessCmd();//BKP后备区域访问使能

> uint16_t BKP_ReadBackupRegister(uint16_t BKP_DR);//读BKP寄存器

> void BKP_WriteBackupRegister(uint16_t BKP_DR, uint16_t Data);//写BKP

## RTC配置一般步骤  ##
- **使能PWR和BKP时钟**：RCC_APB1PeriphClockCmd();
- **使能后备寄存器访问**:   PWR_BackupAccessCmd();
- **配置RTC时钟源**，**使能RTC时钟**：

      RCC_RTCCLKConfig();

      RCC_RTCCLKCmd();

      如果使用LSE，要打开LSE：RCC_LSEConfig(RCC_LSE_ON);

- **设置RTC预分频系数**：RTC_SetPrescaler();
- **设置时间**：RTC_SetCounter();
- **开启相关中断**（如果需要）:RTC_ITConfig()；
- **编写中断服务函数**：RTC_IRQHandler();
- **部分操作要等待写操作完成和同步**。

    RTC_WaitForLastTask();//等待最近一次对RTC寄存器的写操作完成

    RTC_WaitForSynchro();	//等待RTC寄存器同步 
