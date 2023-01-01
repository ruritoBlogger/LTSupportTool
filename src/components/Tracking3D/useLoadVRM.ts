import { useCallback, useState } from "react";
import { VRM, VRMUtils } from "@pixiv/three-vrm";
import { Scene } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

interface UseLoadVRMReturn {
  vrm: VRM | null;
  loadVrm: (scene: Scene) => void;
}

export const useLoadVRM = (): UseLoadVRMReturn => {
  const [vrm, setVrm] = useState<VRM | null>(null);

  // TODO: 読み込むモデルを指定出来るように
  const loadModel = useCallback(
    (scene: Scene) => {
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
            setVrm(vrm);
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
    },
    [GLTFLoader, VRMUtils, VRM]
  );

  return {
    vrm: vrm,
    loadVrm: loadModel,
  };
};
