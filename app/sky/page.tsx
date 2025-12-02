"use client";

// The URL on your server where CesiumJS's static files are hosted.
if (typeof window !== "undefined") {
  (window as any).CESIUM_BASE_URL = "/";
}

import { useCallback, useEffect, useRef, useState } from "react";
import { Camera, Ion, Rectangle, SkyBox, Viewer } from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";

// Your access token can be found at: https://ion.cesium.com/tokens.
// This is the default access token from your ion account
Ion.defaultAccessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlZDdiMzcwYy1hNjcwLTQ0YTUtYWZmYS0yY2E5NTBmZDc2MTEiLCJpZCI6MzM3NTAwLCJpYXQiOjE3NTY4MDM4NTd9.4Lq_uU3n4SSDdy_FmPka-9Zg7eOIb-wc1L7yQw_dmv4";

// 设置默认视角为中国
// 参数分别为：西边经度、南边纬度、东边经度、北边纬度
Camera.DEFAULT_VIEW_RECTANGLE = Rectangle.fromDegrees(69.5, 0.4, 130.4, 81.2);

// 定义天空盒配置，包含中文标签和对应的基础路径
const SKYBOX_CONFIGS: { [key: string]: { label: string; path: string } } = {
  // 'default' 仅用于按钮标签和 key，其恢复逻辑在 switchSkybox 中处理
  default: { label: "默认", path: "" },
  sunny: { label: "晴天", path: "Textures/Sky/Sunny" },
  night: { label: "夜晚", path: "Textures/Sky/Night" },
  blue: { label: "蓝天", path: "Textures/Sky/Blue" },
};

// 辅助函数：根据基础路径创建 SkyBox 的 sources 对象
const createSkyBoxSources = (basePath: string) => ({
  positiveX: `${basePath}/px.jpg`,
  negativeX: `${basePath}/nx.jpg`,
  positiveY: `${basePath}/py.jpg`,
  negativeY: `${basePath}/ny.jpg`,
  positiveZ: `${basePath}/pz.jpg`,
  negativeZ: `${basePath}/nz.jpg`,
});

export default function Home() {
  const cesiumContainerRef = useRef<HTMLDivElement>(null);
  const [viewer, setViewer] = useState<Viewer | null>(null);
  const defaultSourcesRef = useRef<SkyBox | null>(null);
  const [activeSourceKey, setActiveSourceKey] = useState<string>("default");

  // 封装切换天空盒的函数
  const switchSkybox = useCallback(
    (key: string) => {
      if (viewer) {
        // 特殊处理 'default' 键，恢复到保存的默认实例
        if (key === "default") {
          if (defaultSourcesRef.current) {
            viewer.scene.skyBox.sources = defaultSourcesRef.current;
            setActiveSourceKey(key);
          }
          return;
        }

        // 处理其他自定义天空盒
        const config = SKYBOX_CONFIGS[key];
        if (config) {
          const newSources = createSkyBoxSources(config.path);

          if (viewer.scene.skyBox) {
            // 通过修改 sources 属性来更新纹理，避免 'This value cannot be modified' 错误
            viewer.scene.skyBox.sources = newSources;
          } else {
            // 如果不存在，则创建并赋值 (不常见，但作为后备)
            viewer.scene.skyBox = new SkyBox({ sources: newSources });
          }

          setActiveSourceKey(key);
        }
      }
    },
    [viewer]
  );

  useEffect(() => {
    // 确保容器存在后再初始化 Viewer
    if (!cesiumContainerRef.current) return;

    // Initialize the Cesium Viewer
    const newViewer = new Viewer(cesiumContainerRef.current);

    // 捕获 Cesium 自动创建的默认天空盒实例，用于 '默认' 按钮恢复
    if (newViewer.scene.skyBox) {
      defaultSourcesRef.current = newViewer.scene.skyBox.sources;
    }

    setViewer(newViewer);

    // 组件卸载时销毁 viewer
    return () => {
      if (newViewer) {
        newViewer.destroy();
      }
    };
  }, []);

  return (
    <div className="relative w-full h-screen">
      {/* 按钮容器 - 居中显示在顶部 */}
      <div className="absolute top-5 left-1/2 transform -translate-x-1/2 z-10 flex flex-wrap justify-center space-x-2 p-3 bg-gray-900 bg-opacity-70 rounded-xl shadow-2xl backdrop-blur-sm">
        {Object.entries(SKYBOX_CONFIGS).map(([key, { label }]) => (
          <button
            key={key}
            onClick={() => switchSkybox(key)}
            className={`px-4 py-2 mx-2 rounded-full transition-all duration-200 shadow-lg font-medium text-sm md:text-base 
              ${
                activeSourceKey === key
                  ? "bg-blue-600 text-white ring-4 ring-blue-300 transform scale-105"
                  : "bg-white text-gray-800 hover:bg-gray-100 hover:shadow-xl"
              }`}
            // 按钮禁用状态直到 Viewer 初始化完成
            disabled={!viewer}
          >
            {label}
          </button>
        ))}
      </div>

      <div ref={cesiumContainerRef} className="w-full h-full" />
    </div>
  );
}
