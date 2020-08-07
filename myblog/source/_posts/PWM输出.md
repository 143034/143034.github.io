---
title: PWM输出
date: 2020-08-04 17:17:53
tags:
- stm32
categories:
- 单片机
- stm32

---

# 一、STM32 PWM工作过程 #


![pwm工作过程](/images/单片机/stm32/PWM/pwm工作过程.png)

![pwm工作过程1](/images/单片机/stm32/PWM/pwm工作过程1.png)

![pwm工作过程2](/images/单片机/stm32/PWM/pwm工作过程2.png)

	CCR1:捕获比较(值)寄存器（x=1,2,3,4):设置比较值。
	CCMR1: OC1M[2:0]位：
	              对于PWM方式下，用于设置PWM模式1【110】或者PWM模式2【111】
	CCER:CC1P位：输入/捕获1输出极性。0：高电平有效，1：低电平有效。
	CCER:CC1E位：输入/捕获1输出使能。0：关闭，1：打开。



## PWM模式1 & PWM模式2 ##


> 寄存器TIMx_CCMR1的OC1M[2:0]位来分析：

**模式选择**

![模式选择](/images/单片机/stm32/PWM/模式选择.png)

**向上计数配置**

![向上计数配置](/images/单片机/stm32/PWM/向上计数配置.png)

**PWM模式**

![PWM模式](/images/单片机/stm32/PWM/PWM模式.png)

> void TIM_OC2PreloadConfig(TIM_TypeDef* TIMx, uint16_t TIM_OCPreload);

> void TIM_ARRPreloadConfig(TIM_TypeDef* TIMx, FunctionalState NewState);


## 自动重载的预装载寄存器 ##

![自动重载寄存器1](/images/单片机/stm32/PWM/自动重载寄存器1.png)
![自动重载寄存器2](/images/单片机/stm32/PWM/自动重载寄存器2.png)


> void TIM_ARRPreloadConfig(TIM_TypeDef* TIMx, FunctionalState NewState);

	简单的说，ARPE=1,ARR立即生效。。。APRE=0,ARR下个比较周期生效。


## STM32 定时器3输出通道引脚 ##


![定时器3输出通道](/images/单片机/stm32/PWM/定时器3输出通道.png)


# 二、PWM输出库函数 #



> void TIM_OCxInit(TIM_TypeDef* TIMx, TIM_OCInitTypeDef* TIM_OCInitStruct);


	typedef struct
	{
	  uint16_t TIM_OCMode;  //PWM模式1或者模式2
	  uint16_t TIM_OutputState; //输出使能 OR失能
	  uint16_t TIM_OutputNState;
	  uint16_t TIM_Pulse; //比较值，写CCRx
	  uint16_t TIM_OCPolarity; //比较输出极性
	  uint16_t TIM_OCNPolarity; 
	  uint16_t TIM_OCIdleState;  
	  uint16_t TIM_OCNIdleState; 
	} TIM_OCInitTypeDef;
	
	
	TIM_OCInitStructure.TIM_OCMode = TIM_OCMode_PWM2; //PWM模式2
	TIM_OCInitStructure.TIM_OutputState = TIM_OutputState_Enable; //比较输出使能
	TIM_OCInitStructure. TIM_Pulse=100;
	TIM_OCInitStructure.TIM_OCPolarity = TIM_OCPolarity_High; //输出极性:TIM输出比较极性高
	TIM_OC2Init(TIM3, &TIM_OCInitStructure);  //根据T指定的参数初始化外设TIM3 OC2


## 设置比较值函数： ##

> void TIM_SetCompareX(TIM_TypeDef* TIMx, uint16_t Compare2);

## 使能输出比较预装载： ##

> void TIM_OC2PreloadConfig(TIM_TypeDef* TIMx, uint16_t TIM_OCPreload);

## 使能自动重装载的预装载寄存器允许位： ##

> void TIM_ARRPreloadConfig(TIM_TypeDef* TIMx, FunctionalState NewState);


# 三、PWM输出配置步骤： #

- **使能定时器3和相关IO口时钟。**

	使能定时器3时钟：RCC_APB1PeriphClockCmd();
	使能GPIOB时钟：RCC_APB2PeriphClockCmd();

- **初始化IO口为复用功能输出。**

	函数：GPIO_Init();

	GPIO_InitStructure.GPIO_Mode = GPIO_Mode_AF_PP; 

	可选则开启端口映射

	RCC_APB2PeriphClockCmd(RCC_APB2Periph_AFIO,ENABLE);

	GPIO_PinRemapConfig(GPIO_PartialRemap_TIM3, ENABLE); 

- **初始化定时器：ARR,PSC等：TIM_TimeBaseInit();**
- **初始化输出比较参数:TIM_OC2Init();**
- **使能预装载寄存器： TIM_OC2PreloadConfig(TIM3, TIM_OCPreload_Enable);** 
- **使能定时器。TIM_Cmd();**
- **不断改变比较值CCRx，达到不同的占空比效果:TIM_SetCompare2();**




# 四、代码 #



	void TIM1_PWM_Init(u16 arr,u16 psc)
	{  
		 GPIO_InitTypeDef GPIO_InitStructure;
		TIM_TimeBaseInitTypeDef  TIM_TimeBaseStructure;
		TIM_OCInitTypeDef  TIM_OCInitStructure;
	
		RCC_APB2PeriphClockCmd(RCC_APB2Periph_TIM1, ENABLE);
	 	RCC_APB2PeriphClockCmd(RCC_APB2Periph_GPIOA , ENABLE); 
		                                                                     	
	

		GPIO_InitStructure.GPIO_Pin = GPIO_Pin_8; //TIM_CH1
		GPIO_InitStructure.GPIO_Mode = GPIO_Mode_AF_PP; 
		GPIO_InitStructure.GPIO_Speed = GPIO_Speed_50MHz;
		GPIO_Init(GPIOA, &GPIO_InitStructure);
	
		
		TIM_TimeBaseStructure.TIM_Period = arr;
		TIM_TimeBaseStructure.TIM_Prescaler =psc; 
		TIM_TimeBaseStructure.TIM_ClockDivision = 0;
		TIM_TimeBaseStructure.TIM_CounterMode = TIM_CounterMode_Up;  
		TIM_TimeBaseInit(TIM1, &TIM_TimeBaseStructure); 
	
	 
		TIM_OCInitStructure.TIM_OCMode = TIM_OCMode_PWM2; 
		TIM_OCInitStructure.TIM_OutputState = TIM_OutputState_Enable; 
		TIM_OCInitStructure.TIM_Pulse = 0; 
		TIM_OCInitStructure.TIM_OCPolarity = TIM_OCPolarity_High; 
		TIM_OC1Init(TIM1, &TIM_OCInitStructure);  
	
	  TIM_CtrlPWMOutputs(TIM1,ENABLE);	//moe主输出使能
	
		TIM_OC1PreloadConfig(TIM1, TIM_OCPreload_Enable);  //使能预装载
		
		TIM_ARRPreloadConfig(TIM1, ENABLE); //使能预装载寄存器
		
		TIM_Cmd(TIM1, ENABLE);  //使能定时器
	 
	   
	}