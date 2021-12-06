const API_BASE_URL = 'https://funcfang.cn/api' // 主域名
const API_UPLOAD_URL = 'https://funcfang.cn/' // 主域名文件 ，这边改了app.js记得也改
import {
    showModalErrorAndMsg,
    showToast,
    showModalTowErrors,
    showLodaingIng
} from '../utils/util'

const request = (url, method, data, isShowModal = true, show_name, isShowSuccessToast = true, content_type = 'application/json') => {
    let _url = API_BASE_URL + url
    method = method.toUpperCase() //整成大写，以防万一
    if (method === "GET") show_name = show_name || '获取'
    if (method === "POST") show_name = show_name || '保存'
    if (method === "DELETE") show_name = show_name || '删除'
    return new Promise((resolve, reject) => {
        wx.showNavigationBarLoading()
        if (isShowModal) {
            showLodaingIng(show_name + "中")
        }
        wx.request({
            url: _url,
            method: method,
            data: data,
            header: {
                'Content-Type': content_type,
                'X-APP': "MiniProgram",
                'token': wx.getStorageSync('token'),
            },
            success(res) {
                wx.hideNavigationBarLoading()
                wx.hideLoading()
                console.log(url + "返回 request", res)
                if (res.statusCode === 200 || res.statusCode === 204) {
                    if (isShowSuccessToast === false || isShowModal === false) {
                        resolve(res.data)
                        return
                    }
                    if (method != "GET") {
                        showToast(show_name + "成功", "", 1200, true)
                        setTimeout(function () {
                            resolve(res.data)
                        }, 1200)
                    } else {
                        resolve(res.data)
                    }
                } else {
                    if (res.statusCode === 401) {
                        console.log("账户token过期", res)
                        reject(res)
                    }
                    console.log("fail ", res)
                    showModalErrorAndMsg(show_name + "失败", res)
                    reject(res)
                }
            },
            fail(error) {
                console.log("请求失败 ", error)
                wx.hideNavigationBarLoading()
                wx.hideLoading()
                showModalTowErrors(show_name + "失败")
                reject(error)
            },
            complete() {

            }
        })
    })
}

const upload_file = (url, data, show_name = '上传') => {
    let _url = API_BASE_URL + url
    return new Promise((resolve, reject) => {
        showLodaingIng(show_name + "中")
        wx.uploadFile({
            url: _url,
            filePath: data.path,
            name: 'file',
            formData: {
                'filename': data.name,
                'name':data.name,
                'Filename': data.name,
            },
            header: {
                'token': wx.getStorageSync('token'),
                "Content-Type": "multipart/form-data",
            },
            success(res) {
                wx.hideLoading()
                console.log("文件返回 upload", res)
                if (res.statusCode == 200) {
                    resolve(res.data)
                } else {
                    showModalErrorAndMsg(show_name + "失败", res)
                    reject(res)
                }
            },
            fail: function (error) {
                wx.hideLoading()
                showModalTowErrors(show_name + "失败")
                reject(error)
            },
        })
    })
}

//多文件上传
const FormData = require('../utils/formData')
const upload_files = (url, filesList) => {
    let _url = API_BASE_URL + url
    return new Promise((resolve, reject) => {
        let formData = new FormData(); //封装fromdata,多文件上传
        for (let i = 0; i < filesList.length; i++) {
            //   console.log(i, filesList[i])
            formData.appendFile('file[]', filesList[i].path, filesList[i].name)
        }
        let data = formData.getData();
        wx.request({
            url: _url,
            method: "POST",
            header: {
                'X-APP': "MiniProgram",
                'content-type': data.contentType,
                'token': wx.getStorageSync('token')
            },
            data: data.buffer,
            success(res) {
                showToast("上传成功", 'success', 1500)
                setTimeout(() => {
                    resolve(res)
                }, 1500)

            },
            fail(res) {
                wx.hideLoading()
                showModalErrorAndMsg(show_name + "失败", res)
                reject(res)
            },
            complete(res) {

            }
        })
    })
}

/**
 * 小程序的promise没有finally方法，自己扩展下
 */
// Promise.prototype.finally = function (callback) {
//     var Promise = this.constructor;
//     return this.then(
//         function (value) {
//             Promise.resolve(callback()).then(
//                 function () {
//                     return value;
//                 }
//             );
//         },
//         function (reason) {
//             Promise.resolve(callback()).then(
//                 function () {
//                     throw reason;
//                 }
//             );
//         }
//     );
// }

module.exports = {
    request,
    upload_file,
    upload_files
}