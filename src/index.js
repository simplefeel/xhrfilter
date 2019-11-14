import {xhrUnique} from './plugins'

import {XhrFilter} from './core'

function create() {
  var instance = new XhrFilter();
  return instance
}

function use(plugin) {
  return xhrfilter.use(plugin)
}
// 创建实例
var xhrfilter = create()
// 如果当前请求结果还未返回，接着发出了相同url，相同请求参数的请求，取消后一次请求
xhrfilter.use(xhrUnique)

export {use}