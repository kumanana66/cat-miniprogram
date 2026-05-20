# 图片资源说明

请在此目录下放置以下图片文件（PNG格式，建议尺寸 81x81px）：

## TabBar图标（tab目录下）
- tab/home.png          首页未选中图标
- tab/home_active.png   首页选中图标
- tab/profile.png       档案未选中图标
- tab/profile_active.png 档案选中图标
- tab/health.png        健康未选中图标
- tab/health_active.png 健康选中图标
- tab/consult.png       咨询未选中图标
- tab/consult_active.png 咨询选中图标

## 其他图片
- default_cat.png       默认猫咪头像（建议200x200px）

## 临时解决方案
如果暂时没有图标，可以：
1. 使用任意PNG图片替代（重命名即可）
2. 或在 app.json 的 tabBar 中删除 iconPath 和 selectedIconPath 字段（tabBar将只显示文字）
