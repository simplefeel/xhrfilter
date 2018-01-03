
# xhrfilter.js [![Build Status](https://travis-ci.org/simplefeel/xhrfilter.svg?branch=master)](https://travis-ci.org/simplefeel/xhrfilter.svg?branch=master)</br>

- 去重，全局节流重复的xhr请求，默认500ms内只发送一次重复的请求
- 原生js编写，不依赖任何其它库
- 大小只有1kb
- 使用方便，全局引入后，无需做其它任何处理

## 什么情况下会产生重复xhr请求？

>重复xhr请求定义：相同的请求地址，相同的请求参数

1.后端响应慢的情况下，前端发出xhr请求，后端没有成功返回响应数据期间，前端又发出了一次重复xhr请求。</br>
2.不考虑后端响应慢的情况，一定时间内前端多次重复发出xhr请求，比如重复点击提交按钮。

## 处理方式？

1.前端全局拦截xhr请求，如果请求未完成，此时如果又有相同xhr请求，则取消掉这次请求。如何判定是否为相同请求，简单的判断依据是：相同的url以及相同的请求数据即为相同请求。<br/>
2.前端请求事件去抖，比如一个form表单提交可以通过限制一定时间内只发一次请求来控制请求次数，比如可以使用lodash的_.debounce()方法。<br/>
3.还有一种比较繁琐的方式，比如一个form表单提交，可以在每次点击提交按钮之后置灰（disabled），服务端响应成功之后再还原按钮为可点击状态。这种方式需要在每个需要控制请求的地方都添加，我最开始的处理方式也是这种，然后项目中一旦涉及到有很多表单提交之类或者数据post请求之类的，就会特别繁琐，这也是xhrfilter.js诞生的背景。

> 本项目已经内置去抖机制，默认500ms内只发送一次重复请求

## Install

右键另存下载 [xhrfilter.min.js](https://github.com/simplefeel/xhrfilter/blob/master/dist/xhrfilter.min.js) 

## Usage

```
<script src='xhrfilter.min.js'></script>
``` 
在加载项目本身文件之前加载该js文件，内部无需任何处理

## Relation

[ajaxHook](https://github.com/wendux/Ajax-hook) - 拦截xhr请求，添加自定义处理逻辑



