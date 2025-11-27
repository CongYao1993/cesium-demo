"use client";

// The URL on your server where CesiumJS's static files are hosted.
if (typeof window !== "undefined") {
  (window as any).CESIUM_BASE_URL = "/";
}

import { useEffect, useRef } from "react";
import { Ion, Terrain, Viewer } from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";

// Your access token can be found at: https://ion.cesium.com/tokens.
// This is the default access token from your ion account
Ion.defaultAccessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlZDdiMzcwYy1hNjcwLTQ0YTUtYWZmYS0yY2E5NTBmZDc2MTEiLCJpZCI6MzM3NTAwLCJpYXQiOjE3NTY4MDM4NTd9.4Lq_uU3n4SSDdy_FmPka-9Zg7eOIb-wc1L7yQw_dmv4";

export default function Home() {
  const cesiumContainerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<Viewer | null>(null);

  useEffect(() => {
    // 确保容器存在后再初始化 Viewer
    if (!cesiumContainerRef.current) return;

    // Initialize the Cesium Viewer
    const viewer = new Viewer(cesiumContainerRef.current);

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
