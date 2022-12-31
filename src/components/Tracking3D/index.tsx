import { useEffect, useRef } from "react";
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
import { VRM, VRMSchema, VRMUtils } from "@pixiv/three-vrm";
import React from "react";
import { Camera } from "@mediapipe/camera_utils";
import * as Kalidokit from "kalidokit";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Holistic } from "@mediapipe/holistic";
import { rigPosition, rigRotation } from "@components/Tracking3D/helper";

const clamp = Kalidokit.Utils.clamp;
const lerp = Kalidokit.Vector.lerp;

const Sample = (): JSX.Element => {
  const videoRef = useRef<HTMLVideoElement>(null);

  /* THREEJS WORLD SETUP */
  let currentVrm;

  // renderer
  const renderer = new WebGLRenderer({ alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
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

    if (currentVrm) {
      // Update model to render physics
      currentVrm.update(clock.getDelta());
    }
    renderer.render(scene, orbitCamera);
  }
  animate();

  /* VRM CHARACTER SETUP */

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
        currentVrm = vrm;
        currentVrm.scene.rotation.y = Math.PI; // Rotate model 180deg to face camera
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

  let oldLookTarget = new Euler();
  const rigFace = (riggedFace) => {
    if (!currentVrm) {
      return;
    }
    rigRotation("Neck", currentVrm, riggedFace.head, 0.7);

    // Blendshapes and Preset Name Schema
    const Blendshape = currentVrm.blendShapeProxy;
    const PresetName = VRMSchema.BlendShapePresetName;

    // Simple example without winking. Interpolate based on old blendshape, then stabilize blink with `Kalidokit` helper function.
    // for VRM, 1 is closed, 0 is open.
    riggedFace.eye.l = lerp(
      clamp(1 - riggedFace.eye.l, 0, 1),
      Blendshape.getValue(PresetName.Blink),
      0.5
    );
    riggedFace.eye.r = lerp(
      clamp(1 - riggedFace.eye.r, 0, 1),
      Blendshape.getValue(PresetName.Blink),
      0.5
    );
    riggedFace.eye = Kalidokit.Face.stabilizeBlink(
      riggedFace.eye,
      riggedFace.head.y
    );
    Blendshape.setValue(PresetName.Blink, riggedFace.eye.l);

    // Interpolate and set mouth blendshapes
    Blendshape.setValue(
      PresetName.I,
      lerp(riggedFace.mouth.shape.I, Blendshape.getValue(PresetName.I), 0.5)
    );
    Blendshape.setValue(
      PresetName.A,
      lerp(riggedFace.mouth.shape.A, Blendshape.getValue(PresetName.A), 0.5)
    );
    Blendshape.setValue(
      PresetName.E,
      lerp(riggedFace.mouth.shape.E, Blendshape.getValue(PresetName.E), 0.5)
    );
    Blendshape.setValue(
      PresetName.O,
      lerp(riggedFace.mouth.shape.O, Blendshape.getValue(PresetName.O), 0.5)
    );
    Blendshape.setValue(
      PresetName.U,
      lerp(riggedFace.mouth.shape.U, Blendshape.getValue(PresetName.U), 0.5)
    );

    //PUPILS
    //interpolate pupil and keep a copy of the value
    let lookTarget = new Euler(
      lerp(oldLookTarget.x, riggedFace.pupil.y, 0.4),
      lerp(oldLookTarget.y, riggedFace.pupil.x, 0.4),
      0,
      "XYZ"
    );
    oldLookTarget.copy(lookTarget);
    currentVrm.lookAt.applyer.lookAt(lookTarget);
  };

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
      rigFace(riggedFace);
    }

    // Animate Pose
    if (pose2DLandmarks && pose3DLandmarks) {
      riggedPose = Kalidokit.Pose.solve(pose3DLandmarks, pose2DLandmarks, {
        runtime: "mediapipe",
        video: videoElement,
      });
      rigRotation("Hips", currentVrm, riggedPose.Hips.rotation, 0.7);
      rigPosition(
        "Hips",
        currentVrm,
        {
          x: -riggedPose.Hips.position.x, // Reverse direction
          y: riggedPose.Hips.position.y + 1, // Add a bit of height
          z: -riggedPose.Hips.position.z, // Reverse direction
        },
        1,
        0.07
      );

      rigRotation("Chest", currentVrm, riggedPose.Spine, 0.25, 0.3);
      rigRotation("Spine", currentVrm, riggedPose.Spine, 0.45, 0.3);

      rigRotation(
        "RightUpperArm",
        currentVrm,
        riggedPose.RightUpperArm,
        1,
        0.3
      );
      rigRotation(
        "RightLowerArm",
        currentVrm,
        riggedPose.RightLowerArm,
        1,
        0.3
      );
      rigRotation("LeftUpperArm", currentVrm, riggedPose.LeftUpperArm, 1, 0.3);
      rigRotation("LeftLowerArm", currentVrm, riggedPose.LeftLowerArm, 1, 0.3);

      rigRotation("LeftUpperLeg", currentVrm, riggedPose.LeftUpperLeg, 1, 0.3);
      rigRotation("LeftLowerLeg", currentVrm, riggedPose.LeftLowerLeg, 1, 0.3);
      rigRotation(
        "RightUpperLeg",
        currentVrm,
        riggedPose.RightUpperLeg,
        1,
        0.3
      );
      rigRotation(
        "RightLowerLeg",
        currentVrm,
        riggedPose.RightLowerLeg,
        1,
        0.3
      );
    }

    // Animate Hands
    if (leftHandLandmarks) {
      riggedLeftHand = Kalidokit.Hand.solve(leftHandLandmarks, "Left");
      rigRotation("LeftHand", currentVrm, {
        // Combine pose rotation Z and hand rotation X Y
        z: riggedPose.LeftHand.z,
        y: riggedLeftHand.LeftWrist.y,
        x: riggedLeftHand.LeftWrist.x,
      });
      rigRotation(
        "LeftRingProximal",
        currentVrm,
        riggedLeftHand.LeftRingProximal
      );
      rigRotation(
        "LeftRingIntermediate",
        currentVrm,
        riggedLeftHand.LeftRingIntermediate
      );
      rigRotation("LeftRingDistal", currentVrm, riggedLeftHand.LeftRingDistal);
      rigRotation(
        "LeftIndexProximal",
        currentVrm,
        riggedLeftHand.LeftIndexProximal
      );
      rigRotation(
        "LeftIndexIntermediate",
        currentVrm,
        riggedLeftHand.LeftIndexIntermediate
      );
      rigRotation(
        "LeftIndexDistal",
        currentVrm,
        riggedLeftHand.LeftIndexDistal
      );
      rigRotation(
        "LeftMiddleProximal",
        currentVrm,
        riggedLeftHand.LeftMiddleProximal
      );
      rigRotation(
        "LeftMiddleIntermediate",
        currentVrm,
        riggedLeftHand.LeftMiddleIntermediate
      );
      rigRotation(
        "LeftMiddleDistal",
        currentVrm,
        riggedLeftHand.LeftMiddleDistal
      );
      rigRotation(
        "LeftThumbProximal",
        currentVrm,
        riggedLeftHand.LeftThumbProximal
      );
      rigRotation(
        "LeftThumbIntermediate",
        currentVrm,
        riggedLeftHand.LeftThumbIntermediate
      );
      rigRotation(
        "LeftThumbDistal",
        currentVrm,
        riggedLeftHand.LeftThumbDistal
      );
      rigRotation(
        "LeftLittleProximal",
        currentVrm,
        riggedLeftHand.LeftLittleProximal
      );
      rigRotation(
        "LeftLittleIntermediate",
        currentVrm,
        riggedLeftHand.LeftLittleIntermediate
      );
      rigRotation(
        "LeftLittleDistal",
        currentVrm,
        riggedLeftHand.LeftLittleDistal
      );
    }
    if (rightHandLandmarks) {
      riggedRightHand = Kalidokit.Hand.solve(rightHandLandmarks, "Right");
      rigRotation("RightHand", currentVrm, {
        // Combine Z axis from pose hand and X/Y axis from hand wrist rotation
        z: riggedPose.RightHand.z,
        y: riggedRightHand.RightWrist.y,
        x: riggedRightHand.RightWrist.x,
      });
      rigRotation(
        "RightRingProximal",
        currentVrm,
        riggedRightHand.RightRingProximal
      );
      rigRotation(
        "RightRingIntermediate",
        currentVrm,
        riggedRightHand.RightRingIntermediate
      );
      rigRotation(
        "RightRingDistal",
        currentVrm,
        riggedRightHand.RightRingDistal
      );
      rigRotation(
        "RightIndexProximal",
        currentVrm,
        riggedRightHand.RightIndexProximal
      );
      rigRotation(
        "RightIndexIntermediate",
        currentVrm,
        riggedRightHand.RightIndexIntermediate
      );
      rigRotation(
        "RightIndexDistal",
        currentVrm,
        riggedRightHand.RightIndexDistal
      );
      rigRotation(
        "RightMiddleProximal",
        currentVrm,
        riggedRightHand.RightMiddleProximal
      );
      rigRotation(
        "RightMiddleIntermediate",
        currentVrm,
        riggedRightHand.RightMiddleIntermediate
      );
      rigRotation(
        "RightMiddleDistal",
        currentVrm,
        riggedRightHand.RightMiddleDistal
      );
      rigRotation(
        "RightThumbProximal",
        currentVrm,
        riggedRightHand.RightThumbProximal
      );
      rigRotation(
        "RightThumbIntermediate",
        currentVrm,
        riggedRightHand.RightThumbIntermediate
      );
      rigRotation(
        "RightThumbDistal",
        currentVrm,
        riggedRightHand.RightThumbDistal
      );
      rigRotation(
        "RightLittleProximal",
        currentVrm,
        riggedRightHand.RightLittleProximal
      );
      rigRotation(
        "RightLittleIntermediate",
        currentVrm,
        riggedRightHand.RightLittleIntermediate
      );
      rigRotation(
        "RightLittleDistal",
        currentVrm,
        riggedRightHand.RightLittleDistal
      );
    }
  };

  const onResults = (results) => {
    // Animate model
    animateVRM(currentVrm, results);
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
