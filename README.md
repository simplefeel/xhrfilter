
# xhrfilter.js [![Build Status](https://travis-ci.org/simplefeel/xhrfilter.svg?branch=master)](https://travis-ci.org/simplefeel/xhrfilter.svg?branch=master)</br>
>去重，阻止前端请求（原生xhr,ajax）的重复提交，不依赖任何库

## 什么情况下会产生重复xhr请求？

>重复xhr请求定义：相同的请求地址，相同的请求参数

1.后端响应慢的情况下，前端发出xhr请求，后端没有成功返回响应数据期间，前端又发出了一次重复xhr请求。</br>
2.不考虑后端响应慢的情况，一定时间内前端多次重复发出xhr请求，比如重复点击提交按钮。

## 处理方式？

1.前端全局拦截xhr请求，如果请求未完成，此时如果又有相同xhr请求，则取消掉这次请求。如何判定是否为相同请求，简单的判断依据是：相同的url以及相同的请求数据即为相同请求。<br/>
2.前端请求事件去抖，比如一个form表单提交可以通过限制一定时间内只发一次请求来控制请求次数，比如可以使用lodash的_.debounce()方法

> 本项目只处理第一种情况，第二种情况需要配合函数去抖实现

## Install

右键另存下载 [xhrfilter.js](https://github.com/simplefeel/xhrfilter/blob/master/dist/xhrfilter.min.js) 

## Usage

```
<script src='xhrfilter.js'></script>
``` 
在加载项目本身文件之前加载该js文件，内部无需任何处理

## Relation

[ajaxHook](https://github.com/wendux/Ajax-hook) - 拦截xhr请求，添加自定义处理逻辑



