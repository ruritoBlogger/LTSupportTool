import { useCallback, useEffect, useRef, useState } from "react";
import {
  Clock,
  DirectionalLight,
  Euler,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from "three";
import { css } from "@emotion/css";
import React from "react";
import { Camera } from "@mediapipe/camera_utils";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Holistic, Results } from "@mediapipe/holistic";
import { animateVRM } from "@components/Tracking3D/animateVRM";
import { useLoadVRM } from "@components/Tracking3D/useLoadVRM";

const Tracking3D = (): JSX.Element => {
  const { vrm: mod, loadVrm } = useLoadVRM();
  const [scene] = useState<Scene>(new Scene());
  const [oldLookTarget] = useState<Euler>(new Euler());
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    loadVrm(scene);
  }, [loadVrm, scene]);

  const onResults = (results: Results) => {
    // Animate model
    animateVRM(mod, oldLookTarget, videoRef.current, results);
  };

  useEffect(() => {
    const videoElement = videoRef.current;
    const canvasElement = canvasRef.current;
    if (!videoElement || !canvasElement) return;

    // renderer
    const renderer = new WebGLRenderer({ canvas: canvasElement, alpha: true });
    renderer.setSize(canvasElement.clientWidth, canvasElement.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // camera
    const orbitCamera = new PerspectiveCamera(
      35,
      canvasElement.clientWidth / canvasElement.clientHeight,
      0.1,
      1000
    );
    orbitCamera.position.set(0.0, 1.4, 0.7);

    // controls
    const orbitControls = new OrbitControls(orbitCamera, canvasElement);
    orbitControls.screenSpacePanning = true;
    orbitControls.target.set(0.0, 1.4, 0.0);
    orbitControls.update();

    // scene

    // light
    const light = new DirectionalLight(0xffffff);
    light.position.set(1.0, 1.0, 1.0).normalize();
    scene.add(light);

    // Main Render Loop
    const clock = new Clock();

    function animate() {
      requestAnimationFrame(animate);

      if (mod) {
        // Update model to render physics
        mod.update(clock.getDelta());
      }
      renderer.render(scene, orbitCamera);
    }
    animate();

    const holistic = new Holistic({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic@0.5.1635989137/${file}`;
      },
    });

    holistic.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.7,
      refineFaceLandmarks: true,
    });
    // Pass holistic a callback function
    holistic.onResults(onResults);

    // Use `Mediapipe` utils to get camera - lower resolution = higher fps
    const camera = new Camera(videoElement, {
      onFrame: async () => {
        await holistic.send({ image: videoElement });
      },
      width: 1280,
      height: 720,
    });
    camera.start();
  }, [videoRef.current, canvasRef.current]);

  return (
    <div className={rootStyle}>
      <video ref={videoRef} className={hiddenStyle} />
      <canvas ref={canvasRef} className={modelStyle} />
    </div>
  );
};

const modelStyle = css`
  && {
    height: 100%;
    width: 100%;
  }
`;

const rootStyle = css`
  && {
    height: 100%;
    width: 100%;
    background-color: inherit;
  }
`;

/**
 * NOTE:
 * モデルの描画に必要
 * ただ画面表示する必要はないため非表示に
 */
const hiddenStyle = css`
  && {
    height: 0;
    width: 0;
    position: absolute;
    opacity: 0;
  }
`;

export default Tracking3D;
