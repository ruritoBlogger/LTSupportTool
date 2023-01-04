import { VRM, VRMSchema } from "@pixiv/three-vrm";
import { Euler, Quaternion, Vector3 } from "three";
import * as Kalidokit from "kalidokit";

const clamp = Kalidokit.Utils.clamp;
const lerp = Kalidokit.Vector.lerp;

export const rigRotation = (
  name: string,
  vrm: VRM | null,
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
  vrm: VRM | null,
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

export const rigFace = (
  riggedFace: Kalidokit.TFace | undefined,
  mod: VRM | null,
  oldLookTarget: Euler
) => {
  if (!mod || !mod.blendShapeProxy || !riggedFace) {
    return;
  }
  rigRotation("Neck", mod, riggedFace.head, 0.7);

  // Blendshapes and Preset Name Schema
  const Blendshape = mod.blendShapeProxy;
  const PresetName = VRMSchema.BlendShapePresetName;

  // Simple example without winking. Interpolate based on old blendshape, then stabilize blink with `Kalidokit` helper function.
  // for VRM, 1 is closed, 0 is open.
  riggedFace.eye.l = lerp(
    clamp(1 - riggedFace.eye.l, 0, 1),
    Blendshape.getValue(PresetName.Blink)!,
    0.5
  );
  riggedFace.eye.r = lerp(
    clamp(1 - riggedFace.eye.r, 0, 1),
    Blendshape.getValue(PresetName.Blink)!,
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
    lerp(riggedFace.mouth.shape.I, Blendshape.getValue(PresetName.I)!, 0.5)
  );
  Blendshape.setValue(
    PresetName.A,
    lerp(riggedFace.mouth.shape.A, Blendshape.getValue(PresetName.A)!, 0.5)
  );
  Blendshape.setValue(
    PresetName.E,
    lerp(riggedFace.mouth.shape.E, Blendshape.getValue(PresetName.E)!, 0.5)
  );
  Blendshape.setValue(
    PresetName.O,
    lerp(riggedFace.mouth.shape.O, Blendshape.getValue(PresetName.O)!, 0.5)
  );
  Blendshape.setValue(
    PresetName.U,
    lerp(riggedFace.mouth.shape.U, Blendshape.getValue(PresetName.U)!, 0.5)
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
  mod.lookAt!.applyer!.lookAt(lookTarget);
};
