---
title: useGeolocation
toc: content
---

# useGeolocation

返回当前浏览器的经纬度 仅在在`HTTPS`才可用

## 代码演示

### 基础用法

<!-- <code src="./demos/Demo1.tsx" ></code> -->

## API

### Result

|  参数  |             说明             | 类型 |
| :----: | :--------------------------: | :--: |
| coords | 地理信息 `(GPS - w84)经纬度` | `-`  |

#### 更多查看 [Web 地理API](https://developer.mozilla.org/zh-CN/docs/Web/API/Geolocation_API)

```ts
coords.latitude; // 用户地理位置的十进制纬度

coords.longitude; // 用户地理位置的十进制经度

coords.accuracy; // 用户地理位置的 位置精度 以米为单位

coords.altitudeAccuracy; // 用户地理位置的 位置海拔精度 以米为单位

coords.heading; // 用户设备当前移动的角度方向，以正北方向顺时针计算。

coords.speed; // 用户当前的 移动速度 以米为单位

coords.timestamp; // 响应的时间戳
```
