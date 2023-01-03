import { models } from "@config/model";
import { css } from "@emotion/css";
import AppCubismUserModel from "@libs/CubismModel";
import { draw, live2dRender } from "@libs/renderer";
import { Camera } from "@mediapipe/camera_utils";
import {
  FaceMesh,
  FACEMESH_TESSELATION,
  NormalizedLandmarkList,
  Results as FaceResult,
} from "@mediapipe/face_mesh";
import { Paper } from "@mui/material";
import axios from "axios";
import * as Kalidokit from "kalidokit";
import { useCallback, useEffect, useRef, useState } from "react";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";

/**
 * カメラ情報を用いた顔のトラッキングを行う
 * @url https://zenn.dev/mooriii/articles/f6a2eef484e837
 */
const Tracking = ({ showCamera }: { showCamera?: boolean }): JSX.Element => {
  const [mod, setMod] = useState<AppCubismUserModel | null>(null);
  const avatarCanvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { model: live2dModel } = models;

  const animateLive2DModel = useCallback(
    (points: NormalizedLandmarkList) => {
      const videoElement = videoRef.current;
      const avatarCanvasElement = avatarCanvasRef.current;
      if (!mod || !points || !videoElement || !avatarCanvasElement) return;
      const riggedFace = Kalidokit.Face.solve(points, {
        runtime: "mediapipe",
        video: videoElement,
      });

      const lastUpdateTime = Date.now();
      draw(avatarCanvasElement, lastUpdateTime, mod, riggedFace, 1);
    },
    [mod]
  );

  const load = useCallback(async () => {
    if (canvasRef.current && avatarCanvasRef.current) {
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

        const mod = await live2dRender(
          avatarCanvasRef.current,
          model,
          {
            moc3,
            physics,
            textures,
          },
          {
            autoBlink: true,
            x: 0,
            y: -0.3,
            scale: 3.5,
          }
        );
        setMod(mod);
      } catch (e) {
        console.error(e);
      }
    }
  }, [
    live2dModel.moc3,
    live2dModel.model3,
    live2dModel.physics3,
    live2dModel.textures,
  ]);

  useEffect(() => {
    load();
  }, [load]);

  const drawResults = useCallback((points: NormalizedLandmarkList) => {
    const canvasElement = canvasRef.current;
    if (!canvasElement) return;
    const canvasCtx = canvasElement.getContext("2d");
    if (!canvasCtx) return;
    canvasCtx.save();
    canvasCtx.clearRect(
      0,
      0,
      canvasElement.clientWidth,
      canvasElement.clientHeight
    );

    // 用意したcanvasにトラッキングしたデータを表示
    drawConnectors(canvasCtx, points, FACEMESH_TESSELATION, {
      color: "#C0C0C070",
      lineWidth: 1,
    });
    if (points && points.length === 478) {
      drawLandmarks(canvasCtx, [points[468], points[468 + 5]], {
        color: "#ffe603",
        lineWidth: 2,
      });
    }
  }, []);

  // facemeshから結果が取れたときのコールバック関数
  const onResult = useCallback(
    (results: FaceResult) => {
      animateLive2DModel(results.multiFaceLandmarks[0]);
      drawResults(results.multiFaceLandmarks[0]);
    },
    [animateLive2DModel, drawResults]
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
      <canvas ref={avatarCanvasRef} className={Live2DModelStyle} />
      <Paper className={cardStyle} style={{ opacity: showCamera ? 1 : 0 }}>
        <video ref={videoRef} className={trackingStyle} />
        <canvas ref={canvasRef} className={trackingStyle} />
      </Paper>
    </div>
  );
};

const rootStyle = css`
  && {
    height: 100%;
    width: 100%;
    display: grid;
    background-color: inherit;
  }
`;

const cardStyle = css`
  && {
    width: 384px;
    height: 216px;
    grid-area: 1/2;
    justify-self: end;
    align-self: end;
    display: grid;
  }
`;

const trackingStyle = css`
  && {
    grid-area: 1/2;
    width: 100%;
    height: 100%;
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
    grid-area: 1/2;
  }
`;

export default Tracking;
