# ToDo任务清单-小程序

## 1.小程序体验码

<img src="https://oss.funcfang.cn/images/todo_icon.png" alt="todo_icon"  />

**后端地址：[ToDoList_Server](https://github.com/fangfang1122/ToDoList_Server)**

**希望我的开发思路能对你有一定的帮助。**

### 实现功能：

1. 清单的创建及任务的发布
2. 文件及图片的上传
3. ~~清单小组的加入~~

### 说明：

​    目前许多功能仍未完善,存在很大问题，现在还在开发中,「我的一天」存在问题,推荐使用「清单」功能。

​	为了更好的使用体验，基本没有任何弹窗。

​	用户唯一标识通过后台获取用户openid实现。

​	不建议存取敏感信息，目前开发能力有限，存在很多漏洞，无法保证数据安全。

### More：

​    ToDo 为我今年愿单之一，想自己学习且独立写一个前后端的软件，便萌发想法跟学校申请了该项目，早在今年7月就了有第一版ToDo，但当时做的比较简单和草率。

​    最近重新开发了ToDo，由于对第一版十分不满意，便相当于重写了ToDo，花了3天时间前后端同时开发，同时还得重新设计UI，才有了现在的初版ToDo，但存在很多问题，后续有空再改进，这个月太忙了。（2021.12.8）

​	没想到会有人来使用这个小程序，由于最近忙于期末和科研项目，可能有些问题没时间修复，等我寒假有空吧~（2021.12.25）

## 2.部分页面
<img src="https://oss.funcfang.cn/images/todo.png" alt="todo"  />

## 3.组件

使用到的组件：

1. [LinUI](https://doc.mini.talelin.com/start/)
2. [小历同学](https://treadpit.github.io/wx_calendar/)

### 4.整体架构

```
├── api 页面封装的请求
├── component 组件
├── custom-tab-bar 自定义Tabbar栏
├── miniprogram_npm 引用组件
├── pages
│    └── about 关于
│    └── allTaskList 全部事项
│    └── index 首页
│    └── information 编辑信息
│    └── list 清单
│    │    └── listDetail 清单详情
│    └── mine 我的
│    └── setting 设置
│    └── task 任务页面
├── images icon 存放区
├── resource 静态资源，完成音效MP3
├── app.js
├── app.json 
├── app.wxss 全局样式
```

### 5.（打算）遵循原则

（经验不足，开发时按自己习惯写的，下次版本增加遵循原则，[参考](https://github.com/MrXujiang/openCoder/tree/master/webapp)）

> 1.最小化组件拆分

> 2.单一职责模式

> 3.多用函数式编程方式 map, filter, reduce, some, any, forEach, every

> 4.页面文件不超过300行，超过考虑拆分组件

> 5.命名规范

```
1.css 使用BEM命名规范  https://zhuanlan.zhihu.com/p/72631379

2.js 驼峰式命名  

3.组件 大驼峰命名  

4.文件和文件夹 驼峰式命名
```

