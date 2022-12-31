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
import * as Kalidokit from "kalidokit";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Holistic } from "@mediapipe/holistic";
import {
  rigFace,
  rigPosition,
  rigRotation,
} from "@components/Tracking3D/helper";

const clamp = Kalidokit.Utils.clamp;
const lerp = Kalidokit.Vector.lerp;

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

  /* VRM Character Animator */
  const animateVRM = (vrm, results) => {
    const videoElement = videoRef.current;
    if (!vrm || !videoElement) {
      return;
    }
    // Take the results from `Holistic` and animate character based on its Face, Pose, and Hand Keypoints.
    let riggedPose, riggedLeftHand, riggedRightHand, riggedFace;

    const faceLandmarks = results.faceLandmarks;
    // Pose 3D Landmarks are with respect to Hip distance in meters
    const pose3DLandmarks = results.ea;
    // Pose 2D landmarks are with respect to videoWidth and videoHeight
    const pose2DLandmarks = results.poseLandmarks;
    // Be careful, hand landmarks may be reversed
    const leftHandLandmarks = results.rightHandLandmarks;
    const rightHandLandmarks = results.leftHandLandmarks;

    // Animate Face
    if (faceLandmarks) {
      riggedFace = Kalidokit.Face.solve(faceLandmarks, {
        runtime: "mediapipe",
        video: videoElement,
      });
      rigFace(riggedFace, mod, oldLookTarget);
    }

    // Animate Pose
    if (pose2DLandmarks && pose3DLandmarks) {
      riggedPose = Kalidokit.Pose.solve(pose3DLandmarks, pose2DLandmarks, {
        runtime: "mediapipe",
        video: videoElement,
      });
      rigRotation("Hips", mod, riggedPose.Hips.rotation, 0.7);
      rigPosition(
        "Hips",
        mod,
        {
          x: -riggedPose.Hips.position.x, // Reverse direction
          y: riggedPose.Hips.position.y + 1, // Add a bit of height
          z: -riggedPose.Hips.position.z, // Reverse direction
        },
        1,
        0.07
      );

      rigRotation("Chest", mod, riggedPose.Spine, 0.25, 0.3);
      rigRotation("Spine", mod, riggedPose.Spine, 0.45, 0.3);

      rigRotation("RightUpperArm", mod, riggedPose.RightUpperArm, 1, 0.3);
      rigRotation("RightLowerArm", mod, riggedPose.RightLowerArm, 1, 0.3);
      rigRotation("LeftUpperArm", mod, riggedPose.LeftUpperArm, 1, 0.3);
      rigRotation("LeftLowerArm", mod, riggedPose.LeftLowerArm, 1, 0.3);

      rigRotation("LeftUpperLeg", mod, riggedPose.LeftUpperLeg, 1, 0.3);
      rigRotation("LeftLowerLeg", mod, riggedPose.LeftLowerLeg, 1, 0.3);
      rigRotation("RightUpperLeg", mod, riggedPose.RightUpperLeg, 1, 0.3);
      rigRotation("RightLowerLeg", mod, riggedPose.RightLowerLeg, 1, 0.3);
    }

    // Animate Hands
    if (leftHandLandmarks) {
      riggedLeftHand = Kalidokit.Hand.solve(leftHandLandmarks, "Left");
      rigRotation("LeftHand", mod, {
        // Combine pose rotation Z and hand rotation X Y
        z: riggedPose.LeftHand.z,
        y: riggedLeftHand.LeftWrist.y,
        x: riggedLeftHand.LeftWrist.x,
      });
      rigRotation("LeftRingProximal", mod, riggedLeftHand.LeftRingProximal);
      rigRotation(
        "LeftRingIntermediate",
        mod,
        riggedLeftHand.LeftRingIntermediate
      );
      rigRotation("LeftRingDistal", mod, riggedLeftHand.LeftRingDistal);
      rigRotation("LeftIndexProximal", mod, riggedLeftHand.LeftIndexProximal);
      rigRotation(
        "LeftIndexIntermediate",
        mod,
        riggedLeftHand.LeftIndexIntermediate
      );
      rigRotation("LeftIndexDistal", mod, riggedLeftHand.LeftIndexDistal);
      rigRotation("LeftMiddleProximal", mod, riggedLeftHand.LeftMiddleProximal);
      rigRotation(
        "LeftMiddleIntermediate",
        mod,
        riggedLeftHand.LeftMiddleIntermediate
      );
      rigRotation("LeftMiddleDistal", mod, riggedLeftHand.LeftMiddleDistal);
      rigRotation("LeftThumbProximal", mod, riggedLeftHand.LeftThumbProximal);
      rigRotation(
        "LeftThumbIntermediate",
        mod,
        riggedLeftHand.LeftThumbIntermediate
      );
      rigRotation("LeftThumbDistal", mod, riggedLeftHand.LeftThumbDistal);
      rigRotation("LeftLittleProximal", mod, riggedLeftHand.LeftLittleProximal);
      rigRotation(
        "LeftLittleIntermediate",
        mod,
        riggedLeftHand.LeftLittleIntermediate
      );
      rigRotation("LeftLittleDistal", mod, riggedLeftHand.LeftLittleDistal);
    }
    if (rightHandLandmarks) {
      riggedRightHand = Kalidokit.Hand.solve(rightHandLandmarks, "Right");
      rigRotation("RightHand", mod, {
        // Combine Z axis from pose hand and X/Y axis from hand wrist rotation
        z: riggedPose.RightHand.z,
        y: riggedRightHand.RightWrist.y,
        x: riggedRightHand.RightWrist.x,
      });
      rigRotation("RightRingProximal", mod, riggedRightHand.RightRingProximal);
      rigRotation(
        "RightRingIntermediate",
        mod,
        riggedRightHand.RightRingIntermediate
      );
      rigRotation("RightRingDistal", mod, riggedRightHand.RightRingDistal);
      rigRotation(
        "RightIndexProximal",
        mod,
        riggedRightHand.RightIndexProximal
      );
      rigRotation(
        "RightIndexIntermediate",
        mod,
        riggedRightHand.RightIndexIntermediate
      );
      rigRotation("RightIndexDistal", mod, riggedRightHand.RightIndexDistal);
      rigRotation(
        "RightMiddleProximal",
        mod,
        riggedRightHand.RightMiddleProximal
      );
      rigRotation(
        "RightMiddleIntermediate",
        mod,
        riggedRightHand.RightMiddleIntermediate
      );
      rigRotation("RightMiddleDistal", mod, riggedRightHand.RightMiddleDistal);
      rigRotation(
        "RightThumbProximal",
        mod,
        riggedRightHand.RightThumbProximal
      );
      rigRotation(
        "RightThumbIntermediate",
        mod,
        riggedRightHand.RightThumbIntermediate
      );
      rigRotation("RightThumbDistal", mod, riggedRightHand.RightThumbDistal);
      rigRotation(
        "RightLittleProximal",
        mod,
        riggedRightHand.RightLittleProximal
      );
      rigRotation(
        "RightLittleIntermediate",
        mod,
        riggedRightHand.RightLittleIntermediate
      );
      rigRotation("RightLittleDistal", mod, riggedRightHand.RightLittleDistal);
    }
  };

  const onResults = (results) => {
    // Animate model
    animateVRM(mod, results);
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
