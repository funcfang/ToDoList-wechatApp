

# 微信小程序-ToDo任务清单后端-Go

## 1.小程序体验码

<img src="https://gitee.com/wx_a1fae56917/images/raw/master/TyporaImages/image-20211208133404456.png" alt="image-20211208133404456"  />

**前端小程序地址：[ToDoList-wechatApp](https://github.com/fangfang1122/ToDoList-wechatApp)**

**希望我的开发思路能对你有一定的帮助。**

### 实现功能：

1. 清单的创建及任务的发布
2. 文件及图片的上传
3. ~~清单小组的加入~~

### 说明：

目前许多功能仍未完善,存在很大问题，现在还在开发中,「我的一天」存在问题,推荐使用「清单」功能。

为了更好的使用体验，基本没有任何弹窗。

用户唯一标识通过后台获取用户openid实现。

不建议存取敏感信息，目前开发能力有限，存在很多漏洞，无法保证数据安全。

### More：

ToDo 为我今年愿单之一，想自己学习且独立写一个前后端的软件，便萌发想法跟学校申请了该项目，早在今年7月就了有第一版ToDo，但当时做的比较简单和草率。

最近重新开发了ToDo，由于对第一版十分不满意，便相当于重写了ToDo，花了3天时间前后端同时开发，同时还得重新设计UI，才有了现在的初版ToDo，但存在很多问题，后续有空再改进，这个月太忙了。（2021.12.8）

## 2.部分页面

![image-20211208140806922](https://gitee.com/wx_a1fae56917/images/raw/master/TyporaImages/image-20211208140806922.png)

## 3.整体架构

```
├──  api 路由API接口逻辑
│   └── v1 第一版本API
│   └── api.go 内部通用函数调用
│   └── auth.go 管理员接口逻辑
│   └── upload.go 文件上传封装
│   └── validate.go JSON封装校验
├──  conf 用于存储配置文件
│	 └── app.ini 项目配置文件
├── middleware 中间件
├── models 应用数据库模型
├── pkg 第三方包
│	└── e 错误码包 (目前还没咋用，但很有必要)
│ 	└── setting 项目配置包
│ 	└── util 工具包
├── routers 路由逻辑处理
│ 	└── router.go
├── upload 文件上传目录
├── go.mod 描述直接依赖包
├── go.sum 描述依赖树锁定
├── main.go 主程序入口
```
