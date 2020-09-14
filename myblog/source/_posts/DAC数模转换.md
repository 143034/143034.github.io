---
title: DAC数模转换
date: 2020-08-11 14:39:17
tags:
- stm32
categories:
- 单片机
- stm32

---


# 一、数模转换原理 #

> STM32的DAC模块(数字/模拟转换模块)是12位数字输入，电压输出型的DAC。DAC可以配置为8位或12位模式，也可以与DMA控制器配合使用。DAC工作在12位模式时，数据可以设置成左对齐或右对齐。DAC模块有2个输出通道，每个通道都有单独的转换器。在双DAC模式下，2个通道可以独立地进行转换，也可以同时进行转换并同步地更新2个通道的输出。DAC可以通过引脚输入参考电压VREF+以获得更精确的转换结果。



## STM32的DAC模块主要特点 ##
- 2个DAC转换器：每个转换器对应1个输出通道 
- 8位或者12位单调输出 
- 12位模式下数据左对齐或者右对齐 
- 同步更新功能 
- 噪声波形生成 
- 三角波形生成 
- 双DAC通道同时或者分别转换
- 每个通道都有DMA功能 



## DAC模块方图 ##

![DAC模块方图](/images/单片机/stm32/DAC数模转换/DAC模块方图.png)

![DAC引脚](/images/单片机/stm32/DAC数模转换/DAC引脚.png)

**VDDA和VSSA为DAC模块模拟部分的供电。**

**Vref+则是DAC模块的参考电压。**

**DAC_OUTx就是DAC的输出通道了（对应PA4或者PA5引脚）。**

**DAC_OUT1  ->PA4**

**DAC_OUT2  ->PA5**


**GPIO配置**

![GPIO配置](/images/单片机/stm32/DAC数模转换/GPIO配置.png)

**DAC转换**

![DAC转换](/images/单片机/stm32/DAC数模转换/DAC转换.png)

**DAC数据格式**

![DAC数据格式](/images/单片机/stm32/DAC数模转换/DAC数据格式.png)

**选择DAC触发**

![选择DAC触发](/images/单片机/stm32/DAC数模转换/选择DAC触发.png)


**DAC输出电压**

![DAC输出电压](/images/单片机/stm32/DAC数模转换/DAC输出电压.png)

**使能DAC通道**

![使能DAC通道](/images/单片机/stm32/DAC数模转换/使能DAC通道.png)

**使能DAC输出缓存**

![使能DAC输出缓存](/images/单片机/stm32/DAC数模转换/使能DAC输出缓存.png)



# 二、DAC相关寄存器 #

![DAC相关寄存器](/images/单片机/stm32/DAC数模转换/DAC相关寄存器.png)


## DAC通道1相关寄存器 ##


**DAC控制寄存器 DAC_CR**

**DAC软件触发寄存器DAC_SWTRIGR**

**DAC通道1的12位右对齐数据保持寄存器DAC_DHR12R1**

**DAC通道1的12位左对齐数据保持寄存器DAC_DHR12L1**

**DAC通道1的8位右对齐数据保持寄存器DAC_DHR8R1**

**DAC通道1数据输出寄存器DAC_DOR1**



**DAC控制寄存器DAC_CR**


![DAC控制寄存器DAC_CR](/images/单片机/stm32/DAC数模转换/DAC控制寄存器DAC_CR.png)


**DAC通道1的12位右对齐数据保持寄存器DAC_DHR12R1**

![12位右对齐数据保持寄存器DAC_DHR12R1](/images/单片机/stm32/DAC数模转换/12位右对齐数据保持寄存器DAC_DHR12R1.png)


**DAC通道1的12位左对齐数据保持寄存器DAC_DHR12L1**

![12位左对齐数据保持寄存器DAC_DHR12L1](/images/单片机/stm32/DAC数模转换/左对齐数据保持寄存器DAC_DHR12L1.png)


**8位右对齐数据保持寄存器DAC_DHR8R1**

![8位右对齐数据保持寄存器DAC_DHR8R1](/images/单片机/stm32/DAC数模转换/8位右对齐数据保持寄存器DAC_DHR8R1.png)



**数据输出寄存器DAC_DOR1**

![数据输出寄存器DAC_DOR1](/images/单片机/stm32/DAC数模转换/数据输出寄存器DAC_DOR1.png)




# 三、DAC配置步骤 #


![配置步骤1](/images/单片机/stm32/DAC数模转换/配置步骤1.png)

![配置步骤2](/images/单片机/stm32/DAC数模转换/配置步骤2.png)

![配置步骤3](/images/单片机/stm32/DAC数模转换/配置步骤3.png)


# 四、代码 #


	void Dac1_Init(void)
	{
	  
		GPIO_InitTypeDef GPIO_InitStructure;
		DAC_InitTypeDef DAC_InitType;
	
		RCC_APB2PeriphClockCmd(RCC_APB2Periph_GPIOA, ENABLE );	
	    RCC_APB1PeriphClockCmd(RCC_APB1Periph_DAC, ENABLE );	  
	
		GPIO_InitStructure.GPIO_Pin = GPIO_Pin_4;				
		GPIO_InitStructure.GPIO_Mode = GPIO_Mode_AIN; 		 //模拟输入
		GPIO_InitStructure.GPIO_Speed = GPIO_Speed_50MHz;
	    GPIO_Init(GPIOA, &GPIO_InitStructure);
		GPIO_SetBits(GPIOA,GPIO_Pin_4)	;
						
		DAC_InitType.DAC_Trigger=DAC_Trigger_None;	//不适用触发功能 TEN1=0
		DAC_InitType.DAC_WaveGeneration=DAC_WaveGeneration_None;//不使用波形发生
		DAC_InitType.DAC_LFSRUnmask_TriangleAmplitude=DAC_LFSRUnmask_Bit0;//屏蔽、幅值设置
		DAC_InitType.DAC_OutputBuffer=DAC_OutputBuffer_Disable ;	//DAC1缓存关闭 BOFF1=1
	    DAC_Init(DAC_Channel_1,&DAC_InitType);	 //初始化通道
	
		DAC_Cmd(DAC_Channel_1, ENABLE);  //使能DAC1
	  
	    DAC_SetChannel1Data(DAC_Align_12b_R, 0);  //12位右对齐，设置值
	
	}
	
	//设置值
	void Dac1_Set_Vol(u16 vol)
	{
		float temp=vol;
		temp/=1000;
		temp=temp*4096/3.3;
		DAC_SetChannel1Data(DAC_Align_12b_R,temp);//12Î»ÓÒ¶ÔÆëÊý¾Ý¸ñÊ½ÉèÖÃDACÖµ
	}