---
title: SysTick定时器
date: 2020-07-24 10:30:34
tags:
- stm32
categories:
- 单片机
- stm32

---

# 介绍: #

1、Systick定时器，是一个简单的定时器，对于CM3,CM4内核芯片，都有Systick定时器。

2、Systick定时器常用来做延时，或者实时系统的心跳时钟。这样可以节省MCU资源，不用浪费一个定时器。比如UCOS中，分时复用，需要一个最小的时间戳，一般在STM32+UCOS系统中，都采用Systick做UCOS心跳时钟。

3、Systick定时器就是系统滴答定时器，一个24 位的倒计数定时器，计到0 时，将从RELOAD 寄存器中自动重装载定时初值。只要不把它在SysTick 控制及状态寄存器中的使能位清除，就永不停息，即使在睡眠模式下也能工作。

4、SysTick定时器被捆绑在NVIC中，用于产生SYSTICK异常（异常号：15）。Systick中断的优先级也可以设置。

##  Systick寄存器  ##

	CTRL             SysTick 控制和状态寄存器  LOAD             
	SysTick 自动重装载除值寄存器 
	VAL                SysTick 当前值寄存器  CALIB             
	SysTick 校准值寄存器

# 寄存器介绍：  #

SysTick 控制和状态寄存器- CTRL

![控制和状态寄存器CTRL](/images/单片机/stm32/控制和状态寄存器CTRL.png)

重装载数值寄存器- LOAD

![重装载数值寄存器](/images/单片机/stm32/重装载数值寄存器.png)

当前值寄存器- VAL

![当前值寄存器VAL](/images/单片机/stm32/当前值寄存器VAL.png)


# 配置: #

> 对于STM32，外部时钟源是 HCLK(AHB总线时钟）的1/8,内核时钟是 HCLK时钟



## 固件库中的Systick相关函数： ##

    SysTick_CLKSourceConfig()    //Systick时钟源选择  misc.c文件中

    SysTick_Config(uint32_t ticks) //初始化systick,时钟为HCLK,并开启中断
                                                    //core_cm3.h/core_cm4.h文件中

## Systick中断服务函数： ##

    void SysTick_Handler(void);

## SysTick_CLKSourceConfig函数： ##
	void SysTick_CLKSourceConfig(uint32_t SysTick_CLKSource)
	{
	  /* Check the parameters */
	  assert_param(IS_SYSTICK_CLK_SOURCE(SysTick_CLKSource));
	
	  if (SysTick_CLKSource == SysTick_CLKSource_HCLK)
	  {
	    SysTick->CTRL |= SysTick_CLKSource_HCLK;
	  }
	  else
	  {
	    SysTick->CTRL &= SysTick_CLKSource_HCLK_Div8;
	  }
	}

## SysTick_CLKSourceConfig函数： ##
	static __INLINE uint32_t SysTick_Config(uint32_t ticks)
	{ 
	  if (ticks > SysTick_LOAD_RELOAD_Msk)  return (1);         /* Reload value impossible */
	   
	 /* set reload register */                                                            
	  SysTick->LOAD  = (ticks & SysTick_LOAD_RELOAD_Msk) - 1; 
	/* set Priority for Cortex-M0 System Interrupts */
	  NVIC_SetPriority (SysTick_IRQn, (1<<__NVIC_PRIO_BITS) - 1); 
	  SysTick->VAL   = 0;                                        /* Load the SysTick Counter Value */
	  SysTick->CTRL  = SysTick_CTRL_CLKSOURCE_Msk | 
	                   SysTick_CTRL_TICKINT_Msk   | 
	                   SysTick_CTRL_ENABLE_Msk;     /* Enable SysTick IRQ and SysTick Timer */
	  return (0);                                                  /* Function successful */
	}


## 主函数 ##
	static __IO uint32_t TimingDelay;
	void Delay(__IO uint32_t nTime)
	{ 
	   TimingDelay = nTime;
	   while(TimingDelay != 0);
	}
	void SysTick_Handler(void)
	{
	    if (TimingDelay != 0x00) 
	     { 
	       TimingDelay--;
	     }
	}
	 int main(void)
	 {  …
	    if (SysTick_Config(SystemCoreClock / 1000)) //systick时钟为HCLK，中断时间间隔1ms
	     {
	     while (1);
	     }
	    while(1)
	     { Delay(200);//2ms
	     … 
	     }
	}
