"use client";

// The URL on your server where CesiumJS's static files are hosted.
if (typeof window !== "undefined") {
  (window as any).CESIUM_BASE_URL = "/";
}

import { useEffect, useRef } from "react";
import { Camera, Ion, Rectangle, Terrain, Viewer } from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";

// Your access token can be found at: https://ion.cesium.com/tokens.
// This is the default access token from your ion account
Ion.defaultAccessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlZDdiMzcwYy1hNjcwLTQ0YTUtYWZmYS0yY2E5NTBmZDc2MTEiLCJpZCI6MzM3NTAwLCJpYXQiOjE3NTY4MDM4NTd9.4Lq_uU3n4SSDdy_FmPka-9Zg7eOIb-wc1L7yQw_dmv4";

// 设置默认视角为中国
// 参数分别为：西边经度、南边纬度、东边经度、北边纬度
Camera.DEFAULT_VIEW_RECTANGLE = Rectangle.fromDegrees(89.5, 20.4, 110.4, 61.2);

export default function Home() {
  const cesiumContainerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<Viewer | null>(null);

  useEffect(() => {
    // 确保容器存在后再初始化 Viewer
    if (!cesiumContainerRef.current) return;

    // Initialize the Cesium Viewer
    const viewer = new Viewer(cesiumContainerRef.current, {
      geocoder: false, // 不会创建地理位置搜索工具
      homeButton: false, // 不会创建 HomeButton
      sceneModePicker: false, // 不会创建 2D、3D、CV 模式切换按钮
      baseLayerPicker: false, // 不会创建地图选择按钮
      navigationHelpButton: false, // 不会创建帮助按钮
      animation: false, // 不会创建动画部件
      timeline: false, // 不会创建时间轴部件
      fullscreenButton: false, // 不会创建全屏按钮
    });

    viewerRef.current = viewer;

    // 组件卸载时销毁 viewer
    return () => {
      if (viewerRef.current) {
        viewerRef.current.destroy();
        viewerRef.current = null;
      }
    };
  }, []);

  return <div ref={cesiumContainerRef} style={{ width: "100%", height: "100vh" }} />;
}
