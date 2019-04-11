// 数组去重
function unique(arr) {
  let result = [],
    hash = {};
  for (let i = 0, elem; (elem = arr[i]) != null; i++) {
    if (!hash[elem]) {
      result.push(elem);
      hash[elem] = true;
    }
  }
  return result;
}

// 求第一个数组中没有第二个数组中部分的值
function differenceSecond(m, n) {
  let a = [...m, ...n];
  let b = n;
  let aHasNaN = m.some(function(v) {
    return isNaN(v);
  });
  let bHasNaN = n.some(function(v) {
    return isNaN(v);
  });
  let difference = a
    .filter(function(v) {
      return b.indexOf(v) == -1 && !isNaN(v);
    })
    .concat(
      b.filter(function(v) {
        return a.indexOf(v) == -1 && !isNaN(v);
      })
    )
    .concat(aHasNaN ^ bHasNaN ? [NaN] : []);
  return difference;
}

