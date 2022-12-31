import { VRM, VRMSchema } from "@pixiv/three-vrm";
import { Euler, Quaternion, Vector3 } from "three";

export const rigRotation = (
  name: string,
  vrm: VRM | undefined,
  rotation = { x: 0, y: 0, z: 0 },
  dampener = 1,
  lerpAmount = 0.3
) => {
  if (!vrm || !vrm.humanoid) {
    return;
  }

  // @ts-ignore
  const Part = vrm.humanoid.getBoneNode(VRMSchema.HumanoidBoneName[name]);
  if (!Part) {
    return;
  }

  let euler = new Euler(
    rotation.x * dampener,
    rotation.y * dampener,
    rotation.z * dampener
  );
  let quaternion = new Quaternion().setFromEuler(euler);
  Part.quaternion.slerp(quaternion, lerpAmount); // interpolate
};

// Animate Position Helper Function
export const rigPosition = (
  name: string,
  vrm: VRM | undefined,
  position = { x: 0, y: 0, z: 0 },
  dampener = 1,
  lerpAmount = 0.3
) => {
  if (!vrm || !vrm.humanoid) {
    return;
  }

  // @ts-ignore
  const Part = vrm.humanoid.getBoneNode(VRMSchema.HumanoidBoneName[name]);
  if (!Part) {
    return;
  }
  let vector = new Vector3(
    position.x * dampener,
    position.y * dampener,
    position.z * dampener
  );
  Part.position.lerp(vector, lerpAmount); // interpolate
};
