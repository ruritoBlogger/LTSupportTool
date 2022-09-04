import { models } from "@config/model";
import { css } from "@emotion/css";
import AppCubismUserModel from "@libs/CubismModel";
import { draw, live2dRender } from "@libs/renderer";
import { Camera } from "@mediapipe/camera_utils";
import {
  FaceMesh,
  NormalizedLandmarkList,
  Results as FaceResult,
} from "@mediapipe/face_mesh";
import axios from "axios";
import { Face } from "kalidokit";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * カメラ情報を用いた顔のトラッキングを行う
 * @url https://zenn.dev/mooriii/articles/f6a2eef484e837
 */
const Tracking = (): JSX.Element => {
  const [mod, setMod] = useState<AppCubismUserModel | null>(null);
  const avatarCanvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { model: live2dModel } = models;

  const animateLive2DModel = useCallback(
    (points: NormalizedLandmarkList) => {
      const videoElement = videoRef.current;
      if (!mod || !points) return;
      const riggedFace = Face.solve(points, {
        runtime: "mediapipe",
        video: videoElement,
      });

      const lastUpdateTime = Date.now();
      draw(avatarCanvasRef.current!, lastUpdateTime, mod, riggedFace, 0);
    },
    [mod]
  );

  const load = useCallback(async () => {
    if (canvasRef.current!) {
      try {
        const [model, moc3, physics] = await Promise.all([
          axios
            .get<ArrayBuffer>(live2dModel.model3, {
              responseType: "arraybuffer",
            })
            .then((res) => res.data),
          axios
            .get(live2dModel.moc3, { responseType: "arraybuffer" })
            .then((res) => res.data),
          axios
            .get(live2dModel.physics3, { responseType: "arraybuffer" })
            .then((res) => res.data),
        ]);
        const textures = await Promise.all(
          live2dModel.textures.map(async (texture) => {
            const res = await axios.get(texture, { responseType: "blob" });
            return res.data as Blob;
          })
        );
        const motions = await Promise.all(
          live2dModel.motions.map(async (motion) => {
            const res = await axios.get(motion, {
              responseType: "arraybuffer",
            });
            return res.data;
          })
        );
        // const motions: Array<ArrayBuffer> = [];

        const mod = await live2dRender(
          avatarCanvasRef.current!,
          model,
          {
            moc3,
            physics,
            textures,
            motions,
          },
          {
            autoBlink: true,
            x: 0,
            y: 0,
            scale: 4,
          }
        );
        setMod(mod);
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // facemeshから結果が取れたときのコールバック関数
  const onResult = useCallback(
    (results: FaceResult) => {
      animateLive2DModel(results.multiFaceLandmarks[0]);
    },
    [animateLive2DModel]
  );

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      const facemesh = new FaceMesh({
        locateFile: (file) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
        },
      });

      // facemeshのオプション（詳細はドキュメントを）
      facemesh.setOptions({
        maxNumFaces: 1,
        refineLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });
      // facemeshの結果が取得できたときのコールバックを設定
      facemesh.onResults(onResult);

      const camera = new Camera(videoElement, {
        onFrame: async () => {
          // frameごとにWebカメラの映像をfacemeshのAPIに投げる
          await facemesh.send({ image: videoElement });
        },
        width: 1280,
        height: 720,
      });
      camera.start();
    }
  }, [onResult]);

  return (
    <div className={rootStyle}>
      <video className={hiddenStyle} ref={videoRef} />
      <canvas className={hiddenStyle} ref={canvasRef} />
      <canvas ref={avatarCanvasRef} className={Live2DModelStyle} />
    </div>
  );
};

const rootStyle = css`
  && {
    height: 100%;
    width: 100%;
    background-color: white;
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

const Live2DModelStyle = css`
  && {
    height: 100%;
    width: 100%;
  }
`;

export default Tracking;
