---
title: GPIO位操作
date: 2020-07-21 19:39:08
tags:
- GPI0
- stm32
categories:
- 单片机
- stm32

---

# 位操作原理： #


> 把每个比特膨胀为一个32位的字，当访问这些字的时候就达到了访问比特的目的，比如说BSRR寄存器有32个位，那么可以映射到32个地址上，我们去访问（读-改-写）这32个地址就达到访问32个比特的目的。

![位操作原理](/images/单片机/stm32/位操作原理.png)

# 支持区域： #

	其中一个是 SRAM 区的最低 1MB 范围，0x20000000 ‐ 0x200FFFFF（SRAM   区中的最低 1MB）
	
	第二个则是片内外设区的最低 1MB范围，0x40000000 ‐ 0x400FFFFF（片上外设区中最低 1MB）

# 位带操作优越性 #

![优越性](/images/单片机/stm32/位带操作优越性.png)


# 映射关系： #
	
	位带区：   支持位带操作的地址区
	位带别名：对别名地址的访问最终作用到位带区的访问上
	注意：这中间有一个地址映射过程）


![映射关系.png](/images/单片机/stm32/映射关系.png)


# 代码： #

	#define BITBAND(addr, bitnum) ((addr & 0xF0000000)+0x2000000+((addr &0xFFFFF)<<5)+(bitnum<<2)) 
	#define MEM_ADDR(addr)  *((volatile unsigned long  *)(addr)) 
	#define BIT_ADDR(addr, bitnum)   MEM_ADDR(BITBAND(addr, bitnum)) 
	//IO口地址映射
	#define GPIOA_ODR_Addr    (GPIOA_BASE+12) //0x4001080C 
	#define GPIOB_ODR_Addr    (GPIOB_BASE+12) //0x40010C0C 
	#define GPIOF_ODR_Addr    (GPIOF_BASE+12) //0x40011A0C    
	#define GPIOG_ODR_Addr    (GPIOG_BASE+12) //0x40011E0C    
	#define GPIOA_IDR_Addr    (GPIOA_BASE+8) //0x40010808 
	#define GPIOB_IDR_Addr    (GPIOB_BASE+8) //0x40010C08 
	#define GPIOG_IDR_Addr    (GPIOG_BASE+8) //0x40011E08 
	//IO口操作,只对单一的IO口!
	//确保n的值小于16!
	#define PAout(n)   BIT_ADDR(GPIOA_ODR_Addr,n)  //输出 
	#define PAin(n)    BIT_ADDR(GPIOA_IDR_Addr,n)  //输入 
	
	#define PBout(n)   BIT_ADDR(GPIOB_ODR_Addr,n)  //输出 
	#define PBin(n)     BIT_ADDR(GPIOB_IDR_Addr,n)  //输入 
	#define PFout(n)   BIT_ADDR(GPIOF_ODR_Addr,n)  //输出 
	#define PFin(n)    BIT_ADDR(GPIOF_IDR_Addr,n)  //输入
	
	#define PGout(n)   BIT_ADDR(GPIOG_ODR_Addr,n)  //输出 
	#define PGin(n)    BIT_ADDR(GPIOG_IDR_Addr,n)  //输入




