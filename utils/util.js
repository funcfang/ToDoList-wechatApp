/*
   时间格式转换
   eg: Mon Aug 02 2021 00:00:00 GMT+0800 (中国标准时间) -> 2021-08-02 08:00:00
   若date格式是：2021-08-02T00:00:00+08:00,需要new Date(date)
*/
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1 //注意getMonth()返回是 0-11
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('-')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

//自定义标题和内容一致的对话框
function showModalTowErrors(content) {
  wx.showModal({
    title: content,
    content: content,
    showCancel: false,
  })
}

//自定义标题、内容的对话框  - 也用于request的错误返回res
function showModalErrorAndMsg(title, res) {
  if (typeof (res) == 'string') {
    wx.showModal({
      title: title,
      content: res,
      showCancel: false,
    })
  } else if (typeof (res) == 'object') {
    if (res.statusCode == 401) {
      showModalErrorAndMsg("账户过期", "请重新打开小程序进行登录")
      return
    }
    if (res.statusCode == 502) {
      showModalErrorAndMsg("系统错误", "服务器累了，让服务器歇会吧")
      return
    }
    if (res.statusCode == 500) {
      // showModalErrorAndMsg("系统错误", "恭喜你发现一个BUG！快反馈给开发人员吧~")
      showModalErrorAndMsg("系统错误", res.data.message)
      return
    }
    wx.showModal({
      title: title,
      content: res.data.message + "",
      showCancel: false,
    })
  } else {
    wx.showModal({
      title: title,
      content: title,
      showCancel: false,
    })
  }
}

//等待提示框，内容自定义
function showLodaingIng(content) {
  wx.showLoading({
    title: content
  })
}

// 显示Toast
function showToast(title, icon, duration, isMask) {
  var _icon = 'none'
  var _duration = 1500
  var _isMask = false
  if (icon != undefined && icon != "") _icon = icon
  if (duration != undefined && duration != "") _duration = duration
  if (isMask != undefined && isMask != "") _isMask = isMask
  wx.showToast({
    title: title,
    icon: _icon,
    duration: _duration,
    mask: _isMask
  })
}

//将时间转换成标准格式--time有时分，即年月日时分秒，2021-08-02 00:00
// 2021-08-02 00:00 -> 2021-08-02T00:00:00.000+08:00
function setTimeFormat(time) {
  return time.substr(0, 10) + 'T' + time.substr(11, 5) + ":00.000+08:00"
}

// 将日期转换成标准格式 --time无时分，即年月日时分秒，2021-08-02 
// 2021-08-02 -> 2021-08-02T00:00:00.000+08:00
function setDateFormat(time) {
  return time + "T00:00:00.000+08:00"
}

// 时间的截取 
// eg: 2021-08-07T11:48:42.655+08:00  -> 2021-08-07 11:48
function substrTime(time) {
  return time.substring(0, 10) + " " + time.substring(11, 16)
}

//转换时间函数 --自己写了才发现原来本来就有 - -！
function changeDate(time) {
  var year = time.getFullYear()
  var month = time.getMonth() + 1 //注意getMonth()返回是 0-11
  var day = time.getDate()
  var hour = time.getHours()
  var minute = time.getMinutes()
  if (month < 10)
    month = '0' + month
  if (day < 10)
    day = '0' + day
  if (hour < 10)
    hour = '0' + hour
  if (minute < 10)
    minute = '0' + minute
  var time = year + '-' + month + '-' + day + ' ' + hour + ":" + minute
  return time
}

//通用的request请求,有显示loading和toast
// const request_common = (url_name, method, data, show_name) => {
//   return new Promise((resolve, reject) => {
//     if (method === "GET") {
//       wx.showNavigationBarLoading()
//     } else {
//       showLodaingIng(show_name + "中")
//     }
//     wx.request({
//       url: getApp().globalData.url + url_name,
//       data: data,
//       method: method,
//       header: {
//         'X-APP':"MiniProgram",
//         'content-type': "application/json; charset=utf-8",
//         'token': wx.getStorageSync('token')
//       },
//       success(res) {
//         wx.hideLoading()
//         console.log(url_name + "返回 common", res)
//         let statusCode = 200
//         if (method === "DELETE"||method === "delete") {
//           statusCode = 204
//         }
//         if (res.statusCode === statusCode) {
//           if (method != "GET") {
//             wx.showToast({
//               title: show_name + "成功",
//               duration: 1200,
//               mask: true
//             })
//             setTimeout(function () {
//               resolve(res)
//             }, 1200)
//           } else {
//             resolve(res)
//           }

//         } else {
//           console.log("fail ", res)
//           showModalErrorAndMsg(show_name + "失败", res)
//           reject(res)
//         }
//       },
//       fail: function (error) {
//         // 发生网络错误等情况触发
//         console.log("请求失败 ", error)
//         wx.hideLoading()
//         showModalTowErrors(show_name + "失败")
//         reject(error)
//       },
//       complete() {

//         if (method === "GET") {
//           wx.hideNavigationBarLoading()
//         }
//       }
//     })
//   })
// }


// //通用的request请求,有显示loading和toast
// const request_common_noApi = (url_name, method, data, show_name) => {
//   return new Promise((resolve, reject) => {
//     if (method === "GET") {
//       wx.showNavigationBarLoading()
//     } else {
//       showLodaingIng(show_name + "中")
//     }
//     wx.request({
//       url: getApp().globalData.url_file + url_name,
//       data: data,
//       method: method,
//       header: {
//         'X-APP':"MiniProgram",
//         'content-type': "application/json; charset=utf-8",
//         'token': wx.getStorageSync('token')
//       },
//       success(res) {
//         wx.hideLoading()
//         console.log(url_name + "返回 common", res)
//         let statusCode = 200
//         if (method === "DELETE") {
//           statusCode = 204
//         }
//         if (res.statusCode === statusCode) {
//           if (method != "GET") {
//             wx.showToast({
//               title: show_name + "成功",
//               duration: 1200,
//               mask: true
//             })
//             setTimeout(function () {
//               resolve(res)
//             }, 1200)
//           } else {
//             resolve(res)
//           }

//         } else {
//           console.log("fail ", res)
//           showModalErrorAndMsg(show_name + "失败", res)
//           reject(res)
//         }
//       },
//       fail: function (error) {
//         // 发生网络错误等情况触发
//         console.log("请求失败 ", error)
//         wx.hideLoading()
//         showModalTowErrors(show_name + "失败")
//         reject(error)
//       },
//       complete() {

//         if (method === "GET") {
//           wx.hideNavigationBarLoading()
//         }
//       }
//     })
//   })
// }

// //通用的request请求,无显示loading和toast，纯处理，没反馈提示
// const request_common_noTip = (url_name, method, data, show_name) => {
//   return new Promise((resolve, reject) => {
//     wx.request({
//       url: getApp().globalData.url + url_name,
//       data: data,
//       method: method,
//       header: {
//         'X-APP':"MiniProgram",
//         'content-type': "application/json; charset=utf-8",
//         'token': wx.getStorageSync('token')
//       },
//       success(res) {
//         wx.hideLoading()
//         console.log(url_name + "返回 学院公告内重做", res)
//         let statusCode = 200
//         if (method === "DELETE"||method === "delete") {
//           statusCode = 204
//         }
//         if (res.statusCode == statusCode) {
//           resolve(res)
//         } else {
//           console.log("fail ", res)
//           showModalErrorAndMsg(show_name + "失败", res)
//           reject(res)
//         }
//       },
//       fail: function (error) {
//         // 发生网络错误等情况触发
//         console.log("请求失败 ", error)
//         wx.hideLoading()
//         showModalTowErrors(show_name + "失败")
//         reject(error)
//       }
//     })
//   })
// }

// //通用的GET请求，没有显示loading，
// const request_getCommon = (url_name, data) => {
//   return new Promise((resolve, reject) => {
//     wx.showNavigationBarLoading()
//     wx.request({
//       url: getApp().globalData.url + url_name,
//       method: "GET",
//       data: data,
//       header: {
//         'X-APP':"MiniProgram",
//         'content-type': "application/json; charset=utf-8",
//         'token': wx.getStorageSync('token')
//       },
//       success(res) {
//         console.log(url_name + "返回  getCommon", res)
//         if (res.statusCode == 200) {
//           resolve(res)
//         } else {
//           console.log('res.statusCode ', res.statusCode)
//           if (res.statusCode == 502) {
//             showModalErrorAndMsg("系统错误", "服务器累了，让服务器歇会吧")
//             reject(res)
//           }
//           showModalErrorAndMsg("加载失败", res)
//           reject(res)
//         }
//       },
//       fail: function (error) {
//         // 发生网络错误等情况触发
//         showModalTowErrors("加载失败")
//         reject(error)
//       },
//       complete() {
//         wx.hideNavigationBarLoading()
//       }
//     })
//   })
// }

// //获取列表请求 - 可能会设计到分页加载、模糊搜索等的请求，data中需自己定义好~
// const request_getList = (url_name, data) => {
//   return new Promise((resolve, reject) => {
//     wx.showNavigationBarLoading()
//     wx.request({
//       url: getApp().globalData.url + url_name,
//       data: data,
//       method: "GET",
//       header: {
//         'X-APP':"MiniProgram",
//         'content-type': "application/json; charset=utf-8",
//         'token': wx.getStorageSync('token')
//       },
//       success(res) {
//         wx.hideLoading()
//         console.log(url_name + " 列表后台返回", res)
//         if (res.statusCode == 200) {
//           resolve(res)
//         } else {
//           showModalErrorAndMsg("加载失败", res)
//           reject(res)
//         }
//       },
//       fail: function (error) {
//         // 发生网络错误等情况触发
//         console.log("请求失败")
//         wx.hideLoading()
//         showModalTowErrors("加载失败")
//         reject(error)
//       },
//       complete() {
//         wx.hideNavigationBarLoading()
//       }
//     })
//   })
// }

// //获取列表, 配置文件头无api
// const request_getList_noApi = (url_name, data) => {
//   return new Promise((resolve, reject) => {
//     wx.showNavigationBarLoading()
//     wx.request({
//       url: getApp().globalData.url_file + url_name,
//       data: data,
//       method: "GET",
//       header: {
//         'X-APP':"MiniProgram",
//         'content-type': "application/json; charset=utf-8",
//         'token': wx.getStorageSync('token')
//       },
//       success(res) {
//         console.log("列表后台返回", res)
//         if (res.statusCode == 200) {
//           resolve(res)
//         } else {
//           if (res.statusCode == 502) {
//             showModalErrorAndMsg("系统错误", "服务器累了，让服务器歇会吧")
//             reject(res)
//           }
//           showModalErrorAndMsg("加载失败", res)
//           reject(res)
//         }
//       },
//       fail: function (error) {
//         // 发生网络错误等情况触发
//         console.log("请求失败")
//         showModalTowErrors("加载失败")
//         reject(error)
//       },
//       complete() {
//         wx.hideNavigationBarLoading()
//       }
//     })
//   })
// }

// //通用的上传文件请求, 一次只能一个文件
// const upload_file = (url_name, data, show_name) => {
//   return new Promise((resolve, reject) => {
//     showLodaingIng(show_name + "中")
//     wx.uploadFile({
//       url: getApp().globalData.url + url_name,
//       filePath: data.path,
//       fileName: data.name,
//       name: 'file',
//       formData:{
//         fileName:data.name
//       },
//       header: {
//         'X-APP':"MiniProgram",
//         'token': wx.getStorageSync('token'),
//         "Content-Type": "multipart/form-data",

//       },
//       success(res) {
//         console.log("文件返回", res)
//         if (res.statusCode == 200) {
//           // wx.hideLoading()
//           resolve(res)
//         } else {
//           wx.hideLoading()
//           showModalErrorAndMsg(show_name + "失败", res)
//           reject(res)
//         }
//       },
//       fail: function (error) {
//         wx.hideLoading()
//         showModalTowErrors(show_name + "失败")
//         reject(error)
//       },
//     })
//   })
// }

// //多文件上传
// const FormData = require('./formData.js')
// const upload_files = (filesList, url) => {
//   return new Promise((resolve, reject) => {
//     let formData = new FormData(); //封装fromdata,多文件上传
//     for (let i = 0; i < filesList.length; i++) {
//       console.log(i, filesList[i])
//       formData.appendFile('file[]', filesList[i].path, filesList[i].name)
//     }
//     let data = formData.getData();
//     wx.request({
//       url: getApp().globalData.url + url,
//       method: "POST",
//       header: {
//         'X-APP':"MiniProgram",
//         'content-type': data.contentType,
//         'token': wx.getStorageSync('token')
//       },
//       data: data.buffer,
//       success(res) {
//         console.log("success ", res)
//         resolve(res)
//       },
//       fail(res) {
//         wx.hideLoading()
//         showModalErrorAndMsg(show_name + "失败", res)
//         reject(res)
//       },
//       complete(res) {

//       }
//     })
//   })
// }

// //用于简历详情的获奖附件处理，将获奖日期转换为 年-月 格式
// function resume_attachments(data) {
//   let list = []
//   for (let i = 0; i < data.length; i++) {
//     let date = new Date(data[i].date)
//     let year = date.getFullYear()
//     let month = date.getMonth() + 1
//     date = year + "年" + month + "月"
//     data[i].date = date
//     list.push(data[i])
//   }
//   return list
// }

//预览文件
function readFile(file_url) {
  showLodaingIng("加载中")
  wx.downloadFile({
    url: getApp().globalData.url_file + file_url,
    method: "GET",
    header: {
      'X-APP': "MiniProgram",
      'content-type': "application/json; charset=utf-8",
      'token': wx.getStorageSync('token')
    },
    success: function (res) {
      //console.log("请求文件返回 ", res)
      var filePath = res.tempFilePath; // 小程序中文件的临时文件
      wx.openDocument({
        filePath: filePath,
        // 文档打开格式记得写上，否则可能不能打开文档。 文档类型只能是一个
        // 若是想打开多种类型的文档，可以解析文档地址中的文档格式，动态复制到fileTpye参数
        // fileType: 'docx', 
        success: function (res) {
          wx.showToast({
            title: "加载成功",
            duration: 100
          })
          wx.hideLoading()
          //console.log('打开文档成功')
        },
        fail: (res) => {
          wx.hideLoading()
          //console.log("打开失败 ", res)
          wx.showModal({
            title: "打开失败",
            content: res.errMsg,
            showCancel: false
          })
        }
      })
    },
    fail(res) {
      // wx.hideLoading()
      showModalTowErrors("加载失败")
    }
  })
}

//是否纯数字
function isRealNum(val) {
  // isNaN()函数 把空串 空格 以及NUll 按照0来处理 所以先去除，

  if (val === "" || val == null) {
    return false;
  }
  if (!isNaN(val)) {
    //对于空数组和只有一个数值成员的数组或全是数字组成的字符串，isNaN返回false，例如：'123'、[]、[2]、['123'],isNaN返回false,
    //所以如果不需要val包含这些特殊情况，则这个判断改写为if(!isNaN(val) && typeof val === 'number' )
    return true;
  } else {
    return false;
  }
}

//预览单个图片
function previewImg_single(url, showContent) {
  if (showContent == undefined) {
    showContent = '图片未上传'
  }
  let urls = []
  if (url == getApp().globalData.url_file) {
    wx.showToast({
      icon: 'error',
      title: showContent
    })
  } else {
    urls[0] = url
    wx.previewImage({
      current: url,
      urls: urls
    })
  }
}

// 判断用户机型是否全面屏
const isFullScreen = () => {
  return new Promise((resolve, reject) => {
    wx.getSystemInfo({
      success: function (res) {
        if (res.screenHeight - res.safeArea.height > 40) {
          console.log("是全面屏")
          resolve(true)
        } else {
          resolve(false)
        }
      }
    })
  })
}

// 选择文件
const chooseFile = (amount) => {
  return new Promise((resolve, reject) => {
    wx.chooseMessageFile({
      count: amount,
      type: 'file',
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        // const tempFilePaths = res.tempFiles
        resolve(res.tempFiles)

        // that.data.uploads_add = res.tempFiles
        // console.log(tempFilePaths)
      },
      fail() {
        console.log("退出选择文件")
      }

    })
  })
}


module.exports = {
  formatTime,
  showModalTowErrors,
  showModalErrorAndMsg,
  showLodaingIng,
  setTimeFormat,
  setDateFormat,
  // request_getList,
  // request_common,
  // upload_file,
  readFile,
  // resume_attachments,
  // request_getCommon,
  // request_getList_noApi,
  isRealNum, //是否纯数字
  substrTime,
  previewImg_single, //预览单个图片
  // upload_files, //多文件上传
  // request_common_noTip,
  isFullScreen,
  chooseFile,
  showToast,
  // request_common_noApi
}