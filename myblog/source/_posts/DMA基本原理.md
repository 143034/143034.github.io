---
title: DMA基本原理
date: 2020-08-12 19:31:50
tags:
- stm32
categories:
- 单片机
- stm32

---


# 一、DMA简介 #



> DMA 全称Direct Memory Access，即直接存储器访问。


> DMA传输将数据从一个地址空间复制到另一个地址空间。当CPU初始化这个传输动作，传输动作本身是由DMA控制器来实现和完成的。


> DMA传输方式无需CPU直接控制传输，也没有中断处理方式那样保留现场和恢复现场过程，通过硬件为RAM和IO设备开辟一条直接传输数据的通道，使得CPU的效率大大提高。



> **作用：为CPU减负。**


**STM32最多有2个DMA控制器（DMA2仅存在大容量产品中），DMA1有7个通道。DMA2有5个通道。每个通道专门用来管理来自于一个或多个外设对存储器访问的请求。还有一个仲裁起来协调各个DMA请求的优先权。**


## DMA框图 ##


![DMA框图](/images/单片机/stm32/DMA/DMA框图.png)

## STM32的DMA有以下一些特性 ##

- 每个通道都直接连接专用的硬件DMA请求，都支持软件触发，这些通过软件来配置。
- 在七个请求间的优先权可以通过软件编程设置(共有四级：很高、高、中等和低)，假如在相等优先权时由硬件决定(请求0优先于请求1，依此类推) 。 
- 独立的源和目标数据区的传输宽度(字节、半字、全字)，模拟打包和拆包的过程。源和目标地址必须按数据传输宽度对齐。 
- 支持循环的缓冲器管理 
- 每个通道都有3个事件标志(DMA 半传输，DMA传输完成和DMA传输出错)，这3个事件标志逻辑或成为一个单独的中断请求。 
- 外设和存储器，存储器和外设的传输 ，存储器和存储器间的传输
- 闪存、SRAM、外设的SRAM、APB1 APB2和AHB外设均可作为访问的源和目标。 
- 可编程的数据传输数目：最大为65536

**DMA1控制器**

![DMA1控制器](/images/单片机/stm32/DMA/DMA1控制器.png)

**DMA2控制器**

![DMA2控制器](/images/单片机/stm32/DMA/DMA2控制器.png)

**DMA处理**

![DMA处理](/images/单片机/stm32/DMA/DMA处理.png)


**DMA_CCRX寄存器**

![DMA_CCRX寄存器](/images/单片机/stm32/DMA/DMA_CCRX寄存器.png)

**仲裁器**

![仲裁器](/images/单片机/stm32/DMA/仲裁器.png)

**DMA_CCRX寄存器1**

![DMA_CCRX寄存器1](/images/单片机/stm32/DMA/DMA_CCRX寄存器1.png)

**DMA通道**

![DMA通道](/images/单片机/stm32/DMA/DMA通道.png)

**指针增量**
![指针增量](/images/单片机/stm32/DMA/指针增量.png)

**循环模式**

![循环模式](/images/单片机/stm32/DMA/循环模式.png)

**存储器到存储器模式**

![存储器到存储器模式](/images/单片机/stm32/DMA/存储器到存储器模式.png)


**通道传输数据量**

![通道传输数据量](/images/单片机/stm32/DMA/通道传输数据量.png)

**中断**

![中断](/images/单片机/stm32/DMA/中断.png)

**通道配置过程**

![通道配置过程](/images/单片机/stm32/DMA/通道配置过程.png)




## 常用DMA库函数 ##
	void DMA_Init(DMA_Channel_TypeDef* DMAy_Channelx, 
	                                                          DMA_InitTypeDef* DMA_InitStruct);
	void DMA_Cmd(DMA_Channel_TypeDef* DMAy_Channelx,
	                                                           FunctionalState NewState);
	void DMA_ITConfig(DMA_Channel_TypeDef* DMAy_Channelx, 
	                                   uint32_t DMA_IT, FunctionalState NewState);
	void DMA_SetCurrDataCounter(DMA_Channel_TypeDef* DMAy_Channelx,
	                                    uint16_t DataNumber); 
	uint16_t DMA_GetCurrDataCounter(DMA_Channel_TypeDef* DMAy_Channelx);
	
	FlagStatus DMA_GetFlagStatus(uint32_t DMAy_FLAG);
	void DMA_ClearFlag(uint32_t DMAy_FLAG);
	ITStatus DMA_GetITStatus(uint32_t DMAy_IT);
	void DMA_ClearITPendingBit(uint32_t DMAy_IT);


## 常用的外设DMA使能库函数 ##



	void USART_DMACmd(USART_TypeDef* USARTx, uint16_t USART_DMAReq,
	                                                                             FunctionalState NewState);
	void ADC_DMACmd(ADC_TypeDef* ADCx, FunctionalState NewState);
	void DAC_DMACmd(uint32_t DAC_Channel, FunctionalState NewState);
	void I2C_DMACmd(I2C_TypeDef* I2Cx, FunctionalState NewState);
	void SDIO_DMACmd(FunctionalState NewState);
	void SPI_I2S_DMACmd(SPI_TypeDef* SPIx, uint16_t SPI_I2S_DMAReq, 
	                                                                          FunctionalState NewState);
	
	void TIM_DMAConfig(TIM_TypeDef* TIMx, uint16_t TIM_DMABase, 
	                                                                      uint16_t TIM_DMABurstLength)
	void TIM_DMACmd(TIM_TypeDef* TIMx, uint16_t TIM_DMASource,
	                                                                       FunctionalState NewState);




> void DMA_Init(DMA_Channel_TypeDef* DMAy_Channelx, DMA_InitTypeDef* DMA_InitStruct)



	typedef struct
	{
	  uint32_t DMA_PeripheralBaseAddr; //外设基地址
	  uint32_t DMA_MemoryBaseAddr; //存储器基地址
	  uint32_t DMA_DIR;         //数据传输方向
	  uint32_t DMA_BufferSize;  //通道传输数据量
	  uint32_t DMA_PeripheralInc;//外设增量模式
	  uint32_t DMA_MemoryInc;  //存储器增量模式
	  uint32_t DMA_PeripheralDataSize; //外设数据宽度
	  uint32_t DMA_MemoryDataSize; //存储器数据宽度
	  uint32_t DMA_Mode;  //模式：是否循环
	  uint32_t DMA_Priority; //优先级
	  uint32_t DMA_M2M;    //是否存储器到存储器方式     
	}DMA_InitTypeDef;


# 二、DMA配置程序过程 #


- 使能DMA时钟

    RCC_AHBPeriphClockCmd();

- 初始化DMA通道参数

    DMA_Init();
- 使能串口DMA发送,串口DMA使能函数：

    USART_DMACmd();

- 使能DMA1通道，启动传输。

    DMA_Cmd();

- 查询DMA传输状态

    DMA_GetFlagStatus();

- 获取/设置通道当前剩余数据量：

    DMA_GetCurrDataCounter();
    DMA_SetCurrDataCounter();
