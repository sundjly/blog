/*
 * @Author:  Sundjly
 * @Date: 2018-02-10 18:51:41 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-02-10 18:53:27
 */

;$(function () {
    function ajax(param, callback) {
        $.ajax({
            url: param,
            type: 'get',
            success: function (data) {
                callback(data);
            },
            error: function (data) {
                console.log('error');
            }
        })
    }

    function request(url) {
        return new Promise(function (resolve, reject) {
            ajax(url, resolve);
        })
    }

    request('a.txt').then(function (res) {
        if (res == 0) {
            console.log(res);
            return request('b.txt')
        }
    }).then(function (res2) {
        if (res2 == 1) {
            console.log(res2);
            return request('c.txt');
        }
    }).then(function (res3) {
        console.log(res3);
    })
});