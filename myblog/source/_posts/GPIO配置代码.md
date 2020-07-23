---
title: GPIO配置代码
date: 2020-07-20 14:19:02
tags:
- stm32
categories:
- 单片机
- stm32

---

# 头文件和源文件 #

	头文件：stm32f10x_gpio.h
	
	源文件：stm32f10x_gpio.c

# 函数介绍 #

## 初始化函数： ##


> void GPIO_Init(GPIO_TypeDef* GPIOx, GPIO_InitTypeDef* GPIO_InitStruct);

	作用：初始化一个或者多个IO口（同一组）的工作方式和速度。
	
	该函数主要是操作GPIO_CRL(CRH)寄存器，在上拉或者下拉的时候有设置BSRR或者BRR寄存器 
    GPIOx: GPIOA~GPIOG

    typedef struct
       {
         uint16_t GPIO_Pin;             //指定要初始化的IO口         
         GPIOSpeed_TypeDef GPIO_Speed; //设置IO口输出速度
         GPIOMode_TypeDef GPIO_Mode;    //设置工作模式：8种中的一个
       }GPIO_InitTypeDef;


    GPIO_InitTypeDef  GPIO_InitStructure;
    GPIO_InitStructure.GPIO_Pin = GPIO_Pin_5; //LED0-->PB.5 端口配置
    GPIO_InitStructure.GPIO_Mode = GPIO_Mode_Out_PP;  //推挽输出
    GPIO_InitStructure.GPIO_Speed = GPIO_Speed_50MHz; //IO口速度为50MHz
    GPIO_Init(GPIOB, &GPIO_InitStructure);	 //根据设定参数初始化GPIOB.5

## 读取输入电平函数： ##

> uint8_t GPIO_ReadInputDataBit(GPIO_TypeDef* GPIOx, uint16_t GPIO_Pin);

	作用：读取某个GPIO的输入电平。实际操作的是GPIOx_IDR寄存器。
	GPIO_ReadInputDataBit(GPIOA, GPIO_Pin_5);//读取GPIOA.5的输入电平


> uint16_t GPIO_ReadInputData(GPIO_TypeDef* GPIOx);

	作用：读取某组GPIO的输入电平。实际操作的是GPIOx_IDR寄存器。
	GPIO_ReadInputData(GPIOA);//读取GPIOA组中所有io口输入电平

## 读取输出电平函数： ##

> uint8_t GPIO_ReadOutputDataBit(GPIO_TypeDef* GPIOx, uint16_t GPIO_Pin);

    作用：读取某个GPIO的输出电平。实际操作的是GPIO_ODR寄存器。
	GPIO_ReadOutputDataBit(GPIOA, GPIO_Pin_5);//读取GPIOA.5的输出电平

> uint16_t GPIO_ReadOutputData(GPIO_TypeDef* GPIOx);
	作用：读取某组GPIO的输出电平。实际操作的是GPIO_ODR寄存器。

	GPIO_ReadOutputData(GPIOA);//读取GPIOA组中所有io口输出电平

## 设置输出电平函数： ##

> void GPIO_SetBits(GPIO_TypeDef* GPIOx, uint16_t GPIO_Pin);

    作用：设置某个IO口输出为高电平（1）。实际操作BSRR寄存器

> void GPIO_ResetBits(GPIO_TypeDef* GPIOx, uint16_t GPIO_Pin);
    作用：设置某个IO口输出为低电平（0）。实际操作的BRR寄存器。

## 这两个函数不常用，也是用来设置IO口输出电平。 ##

	void GPIO_WriteBit(GPIO_TypeDef* GPIOx, uint16_t GPIO_Pin, BitAction BitVal);
	void GPIO_Write(GPIO_TypeDef* GPIOx, uint16_t PortVal);



## 跑马灯配置: ##

### 配置步骤： ###
	1、使能IO口时钟。调用函数RCC_APB2PeriphColckCmd();不同的IO组，调用的时钟使能函数不一样。
	2、初始化IO口模式。调用函数GPIO_Init();
	3、操作IO口，输出高低电平。
		GPIO_SetBits();
		GPIO_ResetBits();

### 配置 ###
	led.c
	void LED_Init(void)
	{
	  GPIO_InitTypeDef GPIO_InitStructure;
		
	  RCC_APB2PeriphClockCmd(RCC_APB2Periph_GPIOD,ENABLE);//GPIOD
	  RCC_APB2PeriphClockCmd(RCC_APB2Periph_GPIOA,ENABLE);//GPIOA
		
		GPIO_InitStructure.GPIO_Mode=GPIO_Mode_Out_PP;
		GPIO_InitStructure.GPIO_Pin=GPIO_Pin_2;
		GPIO_InitStructure.GPIO_Speed=GPIO_Speed_50MHz;
		GPIO_Init(GPIOD,&GPIO_InitStructure);
		GPIO_SetBits(GPIOD,GPIO_Pin_2);
		
		
		GPIO_InitStructure.GPIO_Mode=GPIO_Mode_Out_PP;
		GPIO_InitStructure.GPIO_Pin=GPIO_Pin_8;
		GPIO_InitStructure.GPIO_Speed=GPIO_Speed_50MHz;
		GPIO_Init(GPIOA,&GPIO_InitStructure);
		GPIO_SetBits(GPIOA,GPIO_Pin_8);
	}

	main.c
	int main(void)
	{
	 
	delay_init();
	LED_Init();
		
	while(1){
	
		GPIO_SetBits(GPIOD,GPIO_Pin_2);
		GPIO_SetBits(GPIOA,GPIO_Pin_8);
		
		delay_ms(500);
		
		
		GPIO_ResetBits(GPIOD,GPIO_Pin_2);
		GPIO_ResetBits(GPIOA,GPIO_Pin_8);
		delay_ms(500);
	
	}
	
	}

