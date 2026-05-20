# 图片资源说明

请在此目录下放置以下图片文件（PNG 格式，建议尺寸 81x81px）：

## TabBar 图标（tab 目录下）

- tab/home.png 首页未选中图标
- tab/home_active.png 首页选中图标
- tab/profile.png 档案未选中图标
- tab/profile_active.png 档案选中图标
- tab/health.png 健康未选中图标
- tab/health_active.png 健康选中图标
- tab/consult.png 咨询未选中图标
- tab/consult_active.png 咨询选中图标

## 其他图片

- default_cat.png 默认猫咪头像（建议 200x200px）

## 临时解决方案

如果暂时没有图标，可以：

1. 使用任意 PNG 图片替代（重命名即可）
2. 或在 app.json 的 tabBar 中删除 iconPath 和 selectedIconPath 字段（tabBar 将只显示文字）

   <!-- {
   "pagePath": "pages/index/index",
   "text": "首页",
   "iconPath": "images/tab/home.png",
   "selectedIconPath": "images/tab/home_active.png"
   },
   {
   "pagePath": "pages/profile/index",
   "text": "猫咪档案",
   "iconPath": "images/tab/profile.png",
   "selectedIconPath": "images/tab/profile_active.png"
   },
   {
   "pagePath": "pages/health/index",
   "text": "健康记录",
   "iconPath": "images/tab/health.png",
   "selectedIconPath": "images/tab/health_active.png"
   },
   {
   "pagePath": "pages/consult/index",
   "text": "健康咨询",
   "iconPath": "images/tab/consult.png",
   "selectedIconPath": "images/tab/consult_active.png"
   } -->
