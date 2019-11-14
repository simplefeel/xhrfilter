// 判断数据是否为空
function isNotEmpty(value) {
  if (value == null) {
    return false
  }
  if (typeof value == "object") {
    return Object
      .keys(value)
      .length != 0
  }
  return value.length != 0;
}

// 判断两个对象的值是否相等
function isObjectValueEqual(a, b) {
  var aProps = Object.getOwnPropertyNames(a);
  var bProps = Object.getOwnPropertyNames(b);

  if (aProps.length != bProps.length) {
    return false;
  }

  for (var i = 0; i < aProps.length; i++) {
    var propName = aProps[i];
    if (isObj(a[propName])) {
      if (!isObj(b[propName])) 
        return false;
      isObjectValueEqual(a[propName], b[propName])
    } else {
      if (a[propName] !== b[propName]) {
        return false;
      }
    }
  }
  return true;
}

function isEqualValue(a, b) {
  let aType = typeof a,
    bType = typeof b;
  if (aType !== bType) {
    return false
  } else if (aType === bType && isObj(aType)) {
    isObjectValueEqual(a, b)
  } else if (aType === bType && !isObj(aType)) {
    return a === b
  }
}

function isObj(obj) {
  return Object
    .prototype
    .toString
    .call(obj) == '[object Object]'
}

export {isNotEmpty, isEqualValue}