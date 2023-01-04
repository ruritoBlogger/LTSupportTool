/* VRM Character Animator */
import * as Kalidokit from "kalidokit";
import {
  rigFace,
  rigPosition,
  rigRotation,
} from "@components/Tracking3D/helper";
import { VRM } from "@pixiv/three-vrm";
import { Euler } from "three";
import { Results } from "@mediapipe/holistic";

export const animateVRM = (
  vrm: VRM | null,
  oldLookTarget: Euler,
  videoElement: HTMLVideoElement | null,
  results: Results
) => {
  if (!vrm || !videoElement) {
    return;
  }

  const faceLandmarks = results.faceLandmarks;
  // Pose 3D Landmarks are with respect to Hip distance in meters
  // @ts-ignore
  const pose3DLandmarks = results.ea;
  // Pose 2D landmarks are with respect to videoWidth and videoHeight
  const pose2DLandmarks = results.poseLandmarks;
  // Be careful, hand landmarks may be reversed
  const leftHandLandmarks = results.rightHandLandmarks;
  const rightHandLandmarks = results.leftHandLandmarks;

  // Animate Face
  if (faceLandmarks) {
    const riggedFace = Kalidokit.Face.solve(faceLandmarks, {
      runtime: "mediapipe",
      video: videoElement,
    });
    rigFace(riggedFace, vrm, oldLookTarget);
  }

  // Animate Pose
  if (pose2DLandmarks && pose3DLandmarks) {
    const riggedPose = Kalidokit.Pose.solve(pose3DLandmarks, pose2DLandmarks, {
      runtime: "mediapipe",
      video: videoElement,
    });

    if (!riggedPose) return;

    rigRotation("Hips", vrm, riggedPose.Hips.rotation, 0.7);
    rigPosition(
      "Hips",
      vrm,
      {
        x: -riggedPose.Hips.position.x, // Reverse direction
        y: riggedPose.Hips.position.y + 1, // Add a bit of height
        z: -riggedPose.Hips.position.z, // Reverse direction
      },
      1,
      0.07
    );

    rigRotation("Chest", vrm, riggedPose.Spine, 0.25, 0.3);
    rigRotation("Spine", vrm, riggedPose.Spine, 0.45, 0.3);

    rigRotation("RightUpperArm", vrm, riggedPose.RightUpperArm, 1, 0.3);
    rigRotation("RightLowerArm", vrm, riggedPose.RightLowerArm, 1, 0.3);
    rigRotation("LeftUpperArm", vrm, riggedPose.LeftUpperArm, 1, 0.3);
    rigRotation("LeftLowerArm", vrm, riggedPose.LeftLowerArm, 1, 0.3);

    rigRotation("LeftUpperLeg", vrm, riggedPose.LeftUpperLeg, 1, 0.3);
    rigRotation("LeftLowerLeg", vrm, riggedPose.LeftLowerLeg, 1, 0.3);
    rigRotation("RightUpperLeg", vrm, riggedPose.RightUpperLeg, 1, 0.3);
    rigRotation("RightLowerLeg", vrm, riggedPose.RightLowerLeg, 1, 0.3);

    // Animate Hands
    if (leftHandLandmarks) {
      const riggedLeftHand = Kalidokit.Hand.solve(leftHandLandmarks, "Left");
      if (!riggedLeftHand) return;

      rigRotation("LeftHand", vrm, {
        // Combine pose rotation Z and hand rotation X Y
        z: riggedPose.LeftHand.z,
        y: riggedLeftHand.LeftWrist.y,
        x: riggedLeftHand.LeftWrist.x,
      });
      rigRotation("LeftRingProximal", vrm, riggedLeftHand.LeftRingProximal);
      rigRotation(
        "LeftRingIntermediate",
        vrm,
        riggedLeftHand.LeftRingIntermediate
      );
      rigRotation("LeftRingDistal", vrm, riggedLeftHand.LeftRingDistal);
      rigRotation("LeftIndexProximal", vrm, riggedLeftHand.LeftIndexProximal);
      rigRotation(
        "LeftIndexIntermediate",
        vrm,
        riggedLeftHand.LeftIndexIntermediate
      );
      rigRotation("LeftIndexDistal", vrm, riggedLeftHand.LeftIndexDistal);
      rigRotation("LeftMiddleProximal", vrm, riggedLeftHand.LeftMiddleProximal);
      rigRotation(
        "LeftMiddleIntermediate",
        vrm,
        riggedLeftHand.LeftMiddleIntermediate
      );
      rigRotation("LeftMiddleDistal", vrm, riggedLeftHand.LeftMiddleDistal);
      rigRotation("LeftThumbProximal", vrm, riggedLeftHand.LeftThumbProximal);
      rigRotation(
        "LeftThumbIntermediate",
        vrm,
        riggedLeftHand.LeftThumbIntermediate
      );
      rigRotation("LeftThumbDistal", vrm, riggedLeftHand.LeftThumbDistal);
      rigRotation("LeftLittleProximal", vrm, riggedLeftHand.LeftLittleProximal);
      rigRotation(
        "LeftLittleIntermediate",
        vrm,
        riggedLeftHand.LeftLittleIntermediate
      );
      rigRotation("LeftLittleDistal", vrm, riggedLeftHand.LeftLittleDistal);
    }
    if (rightHandLandmarks) {
      const riggedRightHand = Kalidokit.Hand.solve(rightHandLandmarks, "Right");
      if (!riggedRightHand) return;

      rigRotation("RightHand", vrm, {
        // Combine Z axis from pose hand and X/Y axis from hand wrist rotation
        z: riggedPose.RightHand.z,
        y: riggedRightHand.RightWrist.y,
        x: riggedRightHand.RightWrist.x,
      });
      rigRotation("RightRingProximal", vrm, riggedRightHand.RightRingProximal);
      rigRotation(
        "RightRingIntermediate",
        vrm,
        riggedRightHand.RightRingIntermediate
      );
      rigRotation("RightRingDistal", vrm, riggedRightHand.RightRingDistal);
      rigRotation(
        "RightIndexProximal",
        vrm,
        riggedRightHand.RightIndexProximal
      );
      rigRotation(
        "RightIndexIntermediate",
        vrm,
        riggedRightHand.RightIndexIntermediate
      );
      rigRotation("RightIndexDistal", vrm, riggedRightHand.RightIndexDistal);
      rigRotation(
        "RightMiddleProximal",
        vrm,
        riggedRightHand.RightMiddleProximal
      );
      rigRotation(
        "RightMiddleIntermediate",
        vrm,
        riggedRightHand.RightMiddleIntermediate
      );
      rigRotation("RightMiddleDistal", vrm, riggedRightHand.RightMiddleDistal);
      rigRotation(
        "RightThumbProximal",
        vrm,
        riggedRightHand.RightThumbProximal
      );
      rigRotation(
        "RightThumbIntermediate",
        vrm,
        riggedRightHand.RightThumbIntermediate
      );
      rigRotation("RightThumbDistal", vrm, riggedRightHand.RightThumbDistal);
      rigRotation(
        "RightLittleProximal",
        vrm,
        riggedRightHand.RightLittleProximal
      );
      rigRotation(
        "RightLittleIntermediate",
        vrm,
        riggedRightHand.RightLittleIntermediate
      );
      rigRotation("RightLittleDistal", vrm, riggedRightHand.RightLittleDistal);
    }
  }
};
