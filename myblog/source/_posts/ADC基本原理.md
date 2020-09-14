---
title: ADC基本原理
date: 2020-08-09 09:04:52
tags:
- stm32
categories:
- 单片机
- stm32

---

# 一、ADC介绍 #


> Analog-to-Digital Converter的缩写。指模/数转换器或者模拟/数字转换器。是指将连续变量的模拟信号转换为离散的数字信号的器件。典型的模拟数字转换器将模拟信号转换为表示一定比例电压值的数字信号。


## STM32F10x  ADC特点 ##

- 12位逐次逼近型的模拟数字转换器。
- 最多带3个ADC控制器
- 最多支持18个通道，可最多测量16个外部和2个内部信号源。
- 支持单次和连续转换模式
- 转换结束，注入转换结束，和发生模拟看门狗事件时产生中断。
- 通道0到通道n的自动扫描模式
- 自动校准
- 采样间隔可以按通道编程
- 规则通道和注入通道均有外部触发选项
- 转换结果支持左对齐或右对齐方式存储在16位数据寄存器
- ADC转换时间：最大转换速率 1us。（最大转换速度为1MHz，在ADCCLK=14M，采样周期为1.5个ADC时钟下得到。）
- ADC供电要求：2.4V-3.6V
- ADC输入范围：VREF- ≤  VIN  ≤  VREF+



**STM32F10x大容量芯片带3个ADC控制器**


## STM32F10x系列芯片ADC通道和引脚对应关系 ##


![通道引脚对应关系](/images/单片机/stm32/ADC/通道引脚对应关系.png)


## ADC引脚 ##

![ADC引脚](/images/单片机/stm32/ADC/ADC引脚.png)


## ADC框图 ##

![ADC框图1](/images/单片机/stm32/ADC/ADC框图1.png)

![ADC框图2](/images/单片机/stm32/ADC/ADC框图2.png)


## STM32通道组 ##

- 规则通道组：相当正常运行的程序。最多16个通道。

     规则通道和它的转换顺序在ADC_SQRx寄存器中选择，规则组转换的总数应写入ADC_SQR1寄存器的L[3:0]中

- 注入通道组：相当于中断。最多4个通道。

     注入组和它的转换顺序在ADC_JSQR寄存器中选择。注入组里转化的总数应写入ADC_JSQR寄存器的L[1:0]中

![注入组和规则组](/images/单片机/stm32/ADC/注入组和规则组.png)


**STM32F1的ADC的各通道可以单次，连续，扫描或者间断模式执行。**



## 单次转化 VS 连续转换 ##


![单次转换](/images/单片机/stm32/ADC/单次转换.png)


![连续转换](/images/单片机/stm32/ADC/连续转换.png)


## 扫描模式 ##


![扫描模式](/images/单片机/stm32/ADC/扫描模式.png)



![扫描模式配置](/images/单片机/stm32/ADC/扫描模式配置.png)



## ADC中断 ##


![ADC中断](/images/单片机/stm32/ADC/ADC中断.png)


## ADC时钟配置 ##

![ADC时钟配置寄存器](/images/单片机/stm32/ADC/ADC时钟配置寄存器.png)


**不要让ADC时钟超过14MHz，否则可能不准。**


**RCC_ADCCLKConfig(RCC_PCLK2_Div6); **



# 二、寄存器 #

## ADC_CR1寄存器 ##

![ADC_CR1寄存器](/images/单片机/stm32/ADC/ADC_CR1寄存器.png)


![ADC_CR1寄存器1](/images/单片机/stm32/ADC/ADC_CR1寄存器1.png)

![ADC_CR1寄存器3](/images/单片机/stm32/ADC/ADC_CR1寄存器3.png)


**在扫描模式下，由ADC_SQRx或者ADC_JSQRx寄存器选中的通道被转换。如果设置了EOCIE或者JEOCIE，在最后一个通道转换完毕后才会产生EOC或者JEOC中断。**

## ADC_CR2寄存器 ##


![ADC_CR2寄存器](/images/单片机/stm32/ADC/ADC_CR2寄存器.png)


![ADC_CR2寄存器2](/images/单片机/stm32/ADC/ADC_CR2寄存器2.png)


## 数据对齐方式 ##

![数据对齐](/images/单片机/stm32/ADC/数据对齐.png)


![ADC_CR2寄存器3](/images/单片机/stm32/ADC/ADC_CR2寄存器3.png)


## ADC_SMPR1寄存器 ##

![ADC_SMPR1寄存器](/images/单片机/stm32/ADC/ADC_SMPR1寄存器.png)


## ADC_SMPR2寄存器 ##

![ADC_SMPR2寄存器](/images/单片机/stm32/ADC/ADC_SMPR2寄存器.png)



## ADC的采样时间  ##

![可编程的通道采集时间](/images/单片机/stm32/ADC/可编程的通道采集时间.png)



**最小采样时间1us(ADC时钟=14MHz，采样周期为1.5周期下得到）**



## ADC_SQR1/SQR2/SQR3规则序列寄存器 ##

![ADC_SQR1SQR2SQR3规则序列寄存器](/images/单片机/stm32/ADC/ADC_SQR1SQR2SQR3规则序列寄存器.png)


## ADC_JSQR注入系列寄存器 ##

![ADC_JSQR注入系列寄存器](/images/单片机/stm32/ADC/ADC_JSQR注入系列寄存器.png)



## ADC_DR规则通道数据寄存器 ##

![ADC_DR规则通道数据寄存器](/images/单片机/stm32/ADC/ADC_DR规则通道数据寄存器.png)


## ADC_JDR注入通道数据寄存器 ##

![ADC_JDR注入通道数据寄存器](/images/单片机/stm32/ADC/ADC_JDR注入通道数据寄存器.png)


## ADC_SR状态寄存器 ##

![ADC_SR状态寄存器](/images/单片机/stm32/ADC/ADC_SR状态寄存器.png)


# 三、常用库函数 #


	void ADC_Init(ADC_TypeDef* ADCx, ADC_InitTypeDef* ADC_InitStruct);
	void ADC_DeInit(ADC_TypeDef* ADCx)
	void ADC_Cmd(ADC_TypeDef* ADCx, FunctionalState NewState);
	void ADC_ITConfig(ADC_TypeDef* ADCx, uint16_t ADC_IT, FunctionalState NewState);
	void ADC_SoftwareStartConvCmd(ADC_TypeDef* ADCx, FunctionalState NewState);
	void ADC_RegularChannelConfig(ADC_TypeDef* ADCx, uint8_t ADC_Channel, uint8_t Rank, uint8_t ADC_SampleTime);
	uint16_t ADC_GetConversionValue(ADC_TypeDef* ADCx);
	
	void ADC_ResetCalibration(ADC_TypeDef* ADCx);
	FlagStatus ADC_GetResetCalibrationStatus(ADC_TypeDef* ADCx);
	void ADC_StartCalibration(ADC_TypeDef* ADCx);
	FlagStatus ADC_GetCalibrationStatus(ADC_TypeDef* ADCx);


## ADC初始化函数ADC_Init ##


> void ADC_Init(ADC_TypeDef* ADCx, ADC_InitTypeDef* ADC_InitStruct);


	ypedef struct
	{
	  uint32_t ADC_Mode;//ADC模式：配置ADC_CR1寄存器的位[19:16]  ：DUALMODE[3:0]位
	  FunctionalState ADC_ScanConvMode; //是否使用扫描模式。ADC_CR1位8：SCAN位 
	  FunctionalState ADC_ContinuousConvMode; //单次转换OR连续转换：ADC_CR2的位1：CONT
	  uint32_t ADC_ExternalTrigConv;  //触发方式：ADC_CR2的位[19:17] ：EXTSEL[2:0]                
	  uint32_t ADC_DataAlign;   //对齐方式：左对齐还是右对齐：ADC_CR2的位11：ALIGN         
	  uint8_t ADC_NbrOfChannel;//规则通道序列长度：ADC_SQR1的位[23:20]： L[3:0]       
	}ADC_InitTypeDef;
	
	ADC_InitStructure.ADC_Mode = ADC_Mode_Independent;//独立模式ADC_InitStructure.ADC_ScanConvMode = DISABLE;	//不开启扫描 
	ADC_InitStructure.ADC_ContinuousConvMode = DISABLE;//单次转换模式
	ADC_InitStructure.ADC_ExternalTrigConv = ADC_ExternalTrigConv_None;//触发软件 
	ADC_InitStructure.ADC_DataAlign = ADC_DataAlign_Right;//ADC数据右对齐
	ADC_InitStructure.ADC_NbrOfChannel = 1;//顺序进行规则转换的ADC通道的数目
	ADC_Init(ADC1, &ADC_InitStructure);	


## ADC使能函数 ADC_Cmd(); ##



> void ADC_Cmd(ADC_TypeDef* ADCx, FunctionalState NewState);

	ADC_Cmd(ADC1, ENABLE);	//使能指定的ADC1


## ADC使能软件转换函数 ADC_SoftwareStartConvCmd ##


> void ADC_SoftwareStartConvCmd(ADC_TypeDef* ADCx,FunctionalState NewState);

	ADC_SoftwareStartConvCmd(ADC1, ENABLE);//使能ADC1的软件转换启动


## ADC 规则通道配置函数ADC_RegularChannelConfig ##


> void ADC_RegularChannelConfig(ADC_TypeDef* ADCx,uint8_t ADC_Channel, uint8_t Rank, uint8_t ADC_SampleTime);

	ADC_RegularChannelConfig(ADC1, ADC_Channel_1, 1,ADC_SampleTime_239Cycles5 );


## ADC 获取转换结果函数ADC_GetConversionValue ##



> uint16_t ADC_GetConversionValue(ADC_TypeDef* ADCx);


	ADC_GetConversionValue(ADC1);//获取ADC1转换结果


# 四、配置 #


- 开启PA口时钟和ADC1时钟，设置PA1为模拟输入。

      GPIO_Init();      

     APB2PeriphClockCmd();

- 复位ADC1，同时设置ADC1分频因子。

      RCC_ADCCLKConfig(RCC_PCLK2_Div6);

      ADC_DeInit(ADC1);

- 初始化ADC1参数，设置ADC1的工作模式以及规则序列的相关信息。

     void ADC_Init(ADC_TypeDef* ADCx, ADC_InitTypeDef* ADC_InitStruct)；

- 使能ADC并校准。

	ADC_Cmd(ADC1, ENABLE);

- 配置规则通道参数：

     ADC_RegularChannelConfig();

- 开启软件转换：ADC_SoftwareStartConvCmd(ADC1);

- 等待转换完成，读取ADC值。

    ADC_GetConversionValue(ADC1);



# 五、代码 #



	void  Adc_Init(void)
	{ 	
		ADC_InitTypeDef ADC_InitStructure; 
		GPIO_InitTypeDef GPIO_InitStructure;
	
		RCC_APB2PeriphClockCmd(RCC_APB2Periph_GPIOA |RCC_APB2Periph_ADC1	, ENABLE );	  
	 
	
		RCC_ADCCLKConfig(RCC_PCLK2_Div6);   //设置分频因子
	
		//PA1模拟输入                        
		GPIO_InitStructure.GPIO_Pin = GPIO_Pin_1;
		GPIO_InitStructure.GPIO_Mode = GPIO_Mode_AIN;	
		GPIO_Init(GPIOA, &GPIO_InitStructure);	
	
		ADC_DeInit(ADC1);  //复位ADC1
	
		ADC_InitStructure.ADC_Mode = ADC_Mode_Independent;	
		ADC_InitStructure.ADC_ScanConvMode = DISABLE;	
		ADC_InitStructure.ADC_ContinuousConvMode = DISABLE;	
		ADC_InitStructure.ADC_ExternalTrigConv = ADC_ExternalTrigConv_None;	
		ADC_InitStructure.ADC_DataAlign = ADC_DataAlign_Right;
		ADC_InitStructure.ADC_NbrOfChannel = 1;	
		ADC_Init(ADC1, &ADC_InitStructure);	//ADC初始化  
	
	  
		ADC_Cmd(ADC1, ENABLE);	//ADC1使能
		
		ADC_ResetCalibration(ADC1);	//使能复位校准
		 
		while(ADC_GetResetCalibrationStatus(ADC1));	//等待结束
		
		ADC_StartCalibration(ADC1);	 //开启校准
	 
		while(ADC_GetCalibrationStatus(ADC1));	 //等待结束
	 
		//	ADC_SoftwareStartConvCmd(ADC1, ENABLE);	
	
	}				  
	
	u16 Get_Adc(u8 ch)   
	{
	    //规则组通道设置
		ADC_RegularChannelConfig(ADC1, ch, 1, ADC_SampleTime_239Cycles5 );			    
	  
		ADC_SoftwareStartConvCmd(ADC1, ENABLE);		//软件转换启动
		 
		while(!ADC_GetFlagStatus(ADC1, ADC_FLAG_EOC ));//等待转换结束
	
		return ADC_GetConversionValue(ADC1);	//返回转换结果
	}
	
	u16 Get_Adc_Average(u8 ch,u8 times)
	{
		u32 temp_val=0;
		u8 t;
		for(t=0;t<times;t++)
		{
			temp_val+=Get_Adc(ch);
			delay_ms(5);
		}
		return temp_val/times;
	} 	 