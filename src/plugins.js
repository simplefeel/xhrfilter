import {isNotEmpty, isEqualValue} from './utils'

function xhrUnique(context, arg, xhr, conditions) {
  var sendData = arg[0];
  var url = conditions.url;
  // ---------- 相同url且相同数据请求则取消此次请求  ----------
  if (isNotEmpty(sendData)) {
    if (!conditions.pendingData[url]) {
      conditions.pendingData[url] = sendData;
      conditions.pendingRequestUrl[url] = xhr
    } else {
      if (isEqualValue(sendData, conditions.pendingData[url]) && conditions.pendingRequestUrl[url]) {
        setTimeout(function () {
          xhr.abort()
        }, 0)
      }
    }
  } else {
    if (conditions.pendingRequestUrl[url]) {
      setTimeout(function () {
        xhr.abort()
      }, 0)
    } else {
      conditions.pendingRequestUrl[url] = xhr
    }
  }
}

export {xhrUnique}