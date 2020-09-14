---
title: DHT11程序
date: 2020-08-15 15:13:30
tags:
- DHT11
categories:
- 单片机
- 52单片机

---
# 一、介绍 #

## 1、DHT11技术性能特征 ##


![DHT11](/images/单片机/52单片机/DHT11/DHT11.png)


	工作电压范围：3.3V-5.5V
	
	工作电流 ：平均0.5mA
	
	输出：单总线数字信号
	
	测量范围：湿度20~90％RH，温度0~50℃
	
	精度 ：湿度±5%，温度±2℃
	
	分辨率 ：湿度1%，温度1℃

## 2、介绍 ##


**DHT11数字湿温度传感器采用单总线数据格式。单个数据引脚端口完成输入输出双向传输。其数据包由5Byte（40Bit）组成。数据分小数部分和整数部分，一次完整的数据传输为40bit，高位先出。**

**DHT11的数据格式为：8bit湿度整数数据+8bit湿度小数数据+8bit温度整数数据+8bit温度小数数据+8bit校验和。其中校验和数据为前四个字节相加。**

**传感器数据输出的是未编码的二进制数据。数据(湿度、温度、整数、小数)之间应该分开处理。**


**某次从DHT11读到的数据如图所示**



![数据返回类型](/images/单片机/52单片机/DHT11/数据返回类型.png)


	由以上数据就可得到湿度和温度的值，计算方法：
	湿度= byte4 . byte3=45.0 (％RH)
	温度= byte2 . byte1=28.0 ( ℃)
	校验= byte4+ byte3+ byte2+ byte1=73(校验正确)


## 3、数据发送流程 ##


![数据发送过程](/images/单片机/52单片机/DHT11/数据发送过程.png)



## 4、DHT11输出数字‘0’的时序 ##

![0时序](/images/单片机/52单片机/DHT11/0时序.png)


## 5、DHT11输出数字‘1’的时序 ##

![1时序](/images/单片机/52单片机/DHT11/1时序.png)

# 二、代码 #

**dht11.h**

	#ifndef __DHT11_H_
	
	#define __DHT11_H_
	
	
	#include "reg52.h"
	
	#define uchar unsigned char
	
	#define uint unsigned int
	  
	      
	extern signed char  humi_value;
	extern signed char  temp_value;
	
	
	void DHT11_delay_us(unsigned char n);
	
	
	void DHT11_delay_ms(unsigned int z);
	
	void DHT11_start();
	unsigned char DHT11_rec_byte() ;
	
	void DHT11_receive() ;







	#endif

**dht11.c**

	#include "dht11.h"
	sbit  Data=P1^1;
	void DHT11_delay_us(unsigned char n)
	{
	    while(--n);
	}
	
	void DHT11_delay_ms(unsigned int z)
	{
	   unsigned int i,j;
	   for(i=z;i>0;i--)
	      for(j=110;j>0;j--);
	}
	
	void DHT11_start()
	{
	   Data=1;
	   DHT11_delay_us(2);
	   Data=0;
	   DHT11_delay_ms(30);   //延时18ms以上
	   Data=1;
	   DHT11_delay_us(30);
	}
	
	unsigned char DHT11_rec_byte()      //接收一个字节
	{
	   unsigned char i,dat=0;
	  for(i=0;i<8;i++)    //从高到低依次接收8位数据
	   {
	      while(!Data);   ////等待50us低电平过去
	      DHT11_delay_us(8);     //延时60us，如果还为高则数据为1，否则为0
	      dat<<=1;           //移位使正确接收8位数据，数据为0时直接移位
	      if(Data==1)    //数据为1时，使dat加1来接收数据1
	         dat+=1;
	      while(Data);  //等待数据线拉低
	    }
	    return dat;
	}
	
	void DHT11_receive()      //接收40位的数据
	{
	    unsigned char R_H,R_L,T_H,T_L,RH,RL,TH,TL,revise;
	    DHT11_start();
	    if(Data==0)
	    {
	        while(Data==0);   //等待拉高
	        DHT11_delay_us(40);  //拉高后延时80us
	        R_H=DHT11_rec_byte();    //接收湿度高八位
	        R_L=DHT11_rec_byte();    //接收湿度低八位
	        T_H=DHT11_rec_byte();    //接收温度高八位
	        T_L=DHT11_rec_byte();    //接收温度低八位
	        revise=DHT11_rec_byte(); //接收校正位
	
	        DHT11_delay_us(25);    //结束
	
	        if((R_H+R_L+T_H+T_L)==revise)      //校正
	        {
	            RH=R_H;
	            RL=R_L;
	            TH=T_H;
	            TL=T_L;
	        }
	        humi_value = RH;
	        temp_value = TH;
	    }
	}
