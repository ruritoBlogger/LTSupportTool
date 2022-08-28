import AppCubismUserModel from "@libs/CubismModel";
import { models } from "@libs/model";
import { draw, live2dRender } from "@libs/renderer";
import { Camera } from "@mediapipe/camera_utils";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";
import {
  FaceMesh,
  FACEMESH_TESSELATION,
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

  const drawResults = useCallback((points: NormalizedLandmarkList) => {
    const videoElement = videoRef.current;
    const canvasElement = canvasRef.current;
    if (!canvasElement || !videoElement || !points) return;
    canvasElement.width = videoElement.videoWidth ?? 500;
    canvasElement.height = videoElement.videoHeight ?? 300;
    const canvasCtx = canvasElement.getContext("2d");
    if (!canvasCtx) return;
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

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
      drawResults(results.multiFaceLandmarks[0]);
      animateLive2DModel(results.multiFaceLandmarks[0]);
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
    <div className="App">
      <video
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          // カメラの映像が違和感がないように反転
          transform: "ScaleX(-1)",
        }}
        ref={videoRef}
      />
      <canvas
        style={{
          top: 0,
          left: 0,
          position: "absolute",
          transform: "ScaleX(-1)",
        }}
        ref={canvasRef}
      />
      <canvas
        ref={avatarCanvasRef}
        width={1200}
        height={720}
        style={{
          top: 0,
          left: 0,
          position: "absolute",
          zIndex: 1,
          backgroundColor: "white",
        }}
      />
    </div>
  );
};

export default Tracking;
