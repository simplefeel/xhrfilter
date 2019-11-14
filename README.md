
<img src="https://si.geilicdn.com/img-43f90000016e69ccedd80a2166a4_300_300.jpg" style="text-align:center"/>
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

## 安装


1. CDN引入
  
```html
<script src="https://unpkg.com/xhrfilter@1.0.0/dist/xhrfilter.min.js"></script>
```

2. NPM引入

```js
require('xhrfilter')
```

3. 手动引入（右键另存下载[xhrfilter.min.js](https://github.com/simplefeel/xhrfilter/blob/master/dist/xhrfilter.min.js) 到本地） 
```html
<script src='xhrfilter.min.js'></script>
``` 

## 使用

> 本项目内置重复请求过滤，规则是：A请求发出，A请求结果还未返回，紧接着相同的B请求（判断相同请求的条件是相同的url和相同的请求参数）发出，则取消（absort）B请求

**在加载项目本身文件之前加载该js文件，内部无需任何处理**


## 扩展

本项目支持扩展拦截请求的规则，可以通过暴露的`use(plugin)`方法，传入自定义的拦截处理逻辑

案例一：

```js
<!-- npm引入包的方式 -->

import {use} from 'xhrfilter'

xhrfilter.use(xhrDebounce);

// 请求去抖，500内发出的相同请求只发出一次
function xhrDebounce(context, arg, xhr, conditions) {
  var timeNow = Date.now();
  var url = conditions.url;
  var bool = false;
  if (!conditions.xhrTime[url]) {
    conditions.xhrTime[url] = Date.now();
  } else {
    if (timeNow - conditions.xhrTime[url] <= 500) {
      bool = true
    } else {
      conditions.xhrTime[url] = Date.now();
    }
  }
  return bool
}
```

案例二：

```js
<!-- CDN引入的方式 -->

xhrfilter.use(xhrThrottle)

var pendingUrl = {};

// 不管是get请求还是post请求，只要url相同就去重
function xhrThrottle(context, arg, xhr, conditions) {
  var url = conditions.url;
  if (pendingUrl[url]) {
    setTimeout(function () {
      xhr.abort()
    }, 0)
  } else {
    pendingUrl[url] = xhr
  }
}

```

以上案例都可在项目`examples`文件夹下找到

## API

- xhrfilter.use(plugin)
  - 参数：
    - context 当前xhrfilter实例
    - arg 当前请求的参数
    - xhr 当前请求的 XMLHttpRequest 对象
    - conditions 内部的一些参数，包含当前请求的 url 参数
  - 用法：
    安装自定义过滤逻辑插件
  - 参考：
    `examples`案例

## 参考

[ajaxHook](https://github.com/wendux/Ajax-hook) - 拦截xhr请求，添加自定义处理逻辑



