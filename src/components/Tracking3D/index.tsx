import { useEffect, useRef, useState } from "react";
import {
  Clock,
  DirectionalLight,
  Euler,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from "three";
import { css } from "@emotion/css";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { VRM, VRMUtils } from "@pixiv/three-vrm";
import React from "react";
import { Camera } from "@mediapipe/camera_utils";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Holistic, Results } from "@mediapipe/holistic";
import { animateVRM } from "@components/Tracking3D/animateVRM";

const Sample = (): JSX.Element => {
  const [mod, setMod] = useState<VRM | null>(null);
  const [oldLookTarget, _] = useState<Euler>(new Euler());
  const videoRef = useRef<HTMLVideoElement>(null);

  // renderer
  const renderer = new WebGLRenderer({ alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  document.body.appendChild(renderer.domElement);

  // camera
  const orbitCamera = new PerspectiveCamera(
    35,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  orbitCamera.position.set(0.0, 1.4, 0.7);

  // controls
  const orbitControls = new OrbitControls(orbitCamera, renderer.domElement);
  orbitControls.screenSpacePanning = true;
  orbitControls.target.set(0.0, 1.4, 0.0);
  orbitControls.update();

  // scene
  const scene = new Scene();

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

  useEffect(() => {
    // Import Character VRM
    const loader = new GLTFLoader();
    loader.crossOrigin = "anonymous";
    // Import model from URL, add your own model here
    loader.load(
      "https://cdn.glitch.com/29e07830-2317-4b15-a044-135e73c7f840%2FAshtra.vrm?v=1630342336981",

      (gltf) => {
        VRMUtils.removeUnnecessaryJoints(gltf.scene);

        VRM.from(gltf).then((vrm) => {
          scene.add(vrm.scene);
          vrm.scene.rotation.y = Math.PI; // Rotate model 180deg to face camera
          setMod(vrm);
        });
      },

      (progress) =>
        console.log(
          "Loading model...",
          100.0 * (progress.loaded / progress.total),
          "%"
        ),

      (error) => console.error(error)
    );
  }, []);

  const onResults = (results: Results) => {
    // Animate model
    animateVRM(mod, oldLookTarget, videoRef.current, results);
  };

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

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
  }, [onResults]);

  return (
    <div className={rootStyle}>
      <video ref={videoRef} className={hiddenStyle}></video>
    </div>
  );
};

const Live2DModelStyle = css`
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
    /*
    height: 0;
    width: 0;
    position: absolute;
    opacity: 0;
     */
  }
`;

export default Sample;
