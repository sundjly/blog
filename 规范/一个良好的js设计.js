/*
 * @author:sundjly
 * @date:2017-1-8
 * @last Modified by sundjly
 * */
// 编写一个js函数fn，该函数有一个参数n（数字类型），其返回值是一个数组
// ，该数组内是n个随机且不重复的整数，且整数的取值范围是[2,32]。

//健壮：最基本的兼容处理、边界处理。异常处理。用户输入校验。
// 可靠：尽可能在任何情况下，都返回一个可靠的结果

// 思路：1.对n的取值范围校验
// 2.对n是否存在的校验
// 3. 对n是否为整数的校验
// 4. n为字符串数字或者浮点型时，转化为整数
// 5.清晰的注释


/**
 * 获取指定个数的随机整数，整数范围[2,32]
 * @param {number} n:需要的整数个数
 * @return {array} 返回包含n个整数的数组。如果n非法，则返回空数组
 */
// console.log("fn="+fn("2"));
function fn(n) {
    // 将整数取值范围作为变量提取出来
    var min = 2,
        max = 32;

    //参数检验
    if (!isThere(n)) return [];
    if (!typeOK(n) && !isOKStr(n)) return [];
    n = formatInitNum(n);
    if (!rangeOK(n, min, max)) return [];
    // 准备一个容器保存结果
    var arr = [];
    // 循环
    for (var i = 0; i < n; i++) {
        // 创建一个随机数
        var rand = getRand(min, max);
        // 检查是否重复
        if (checkInArr(arr, rand)) {
            i--;
        } else {
            arr.push(rand);
        }
    }
    return arr;
}

function isThere(n) {
    return (n == undefined || n == null) ? false : true;
}

function typeOK(n) {
    return (typeof n == "number") ? true : false;
}

function isOKStr(n) {
    return (typeof n == "string") ? true : false;
}

function rangeOK(n, min, max) {
    return (n > 0 && n <= (max - min + 1)) ? true : false;
}

function formatInitNum(n) {
    var num = parseInt(n);
    if (isNaN(num)) {
        return 0;
    } else {
        return num;
    }
}
// 获取给定范围的随机数
function getRand(min, max) {
    var range = max - min + 1;
    return Math.floor(Math.random() * range + min);
}
//rand是否与arr里面的值重复
function checkInArr(arr, rand) {
    var arrLength = arr.length,
        p = false;
    if (arrLength > 0) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] == rand) {
                p = true;
            }
        }
        return p;
    } else {
        return p;
    }
}


/**
 * 解析当前页的url，取出传递的参数
 */
function getQueryStringsArgs() {
    // 去得查询的字符串并去掉开头的问号
    var qs = (location.search.length > 0 ? location.search.substring(1) : ""),
        // 保存数据的对象
        args = {},
        // 去得每一项
        items = (qs.length ? qs.split("&") : []),
        item = null,
        name = null,
        value = null;

    // 逐个将每项解析出来
    for (var i = 0; i < items.length; i++) {
        item = items[i].split("=");
        // 因为查询字符串被编码过的，所以要用decodeURLComponent()解码
        name = decodeURLComponent(item[0]);
        value = decodeURLComponent(item[1]);
        if (name.length) {
            args[name] = value;
        }
    }
    return args;
}