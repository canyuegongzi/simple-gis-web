## simple-gis-web

leaflet，mapbox，cesium 通用业务功能封装，框架布局以vue为基础，但地图相关的基础功能已经单独抽离为Service,可单独使用

此案例基于笔者近一年多的 webGis 开发经验整理完成，包括常见的点、线、面、弹框、数据可视化、差值渲染等，后续会抽时间逐步更新。

1. [前端开发中如何实现WebGIS数据可视化（一）——地图创建、点位绘制](https://juejin.cn/post/6985900607588532260)
2. [前端开发中如何实现WebGIS数据可视化（二）——线、面绘制](https://juejin.cn/post/6988758381225836552)

```bin
docker build -t simple-gis-web  .

docker tag 713f3970cee9b1734546b88a7ccf61c14947236686d9ba85f990200e5781b32a canyuegongzi/simple-gis-web:1.2
 
docker push canyuegongzi/simple-gis-web:1.3 

```
