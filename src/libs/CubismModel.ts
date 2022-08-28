// @url https://astie.dog/blog/posts/mevdzj-4dsm

import {
  ACubismMotion,
  csmVector,
  CubismEyeBlink,
  CubismIdHandle,
  CubismUserModel,
} from "./Live2dSDK";

interface MotionResources {
  [name: string]: ACubismMotion;
}

export default class AppCubismUserModel extends CubismUserModel {
  private motionResources: MotionResources;
  private expressionResources: MotionResources;
  private lipSyncParamIds: csmVector<CubismIdHandle> =
    new csmVector<CubismIdHandle>();
  private eyeBlinkParamIds: csmVector<CubismIdHandle> =
    new csmVector<CubismIdHandle>();

  constructor() {
    super();
    this.motionResources = {};
    this.expressionResources = {};
    this.lipSyncParamIds = new csmVector<CubismIdHandle>();
    this.eyeBlinkParamIds = new csmVector<CubismIdHandle>();
  }

  /**
   * 自動目ぱちを設定
   * @param eyeBlink
   */
  public setEyeBlink(eyeBlink: CubismEyeBlink) {
    this._eyeBlink = eyeBlink;
  }

  /**
   * モーション更新時に置き換える目ぱち用IDを追加
   * @param id 目ぱち用ID
   */
  public addEyeBlinkParameterId(id: CubismIdHandle) {
    this.eyeBlinkParamIds.pushBack(id);
  }

  /**
   * モーション更新時に置き換える口パク用IDを追加
   * @param id 口パク用ID
   */
  public addLipSyncParameterId(id: CubismIdHandle) {
    this.lipSyncParamIds.pushBack(id);
  }

  /**
   * モーションを追加して、ID（インデックス）を返す
   * @param buffer モーションデータ
   * @param name モーション名
   */
  public addMotion(
    buffer: ArrayBuffer,
    name: string,
    fadeIn = 1,
    fadeOut = 1
  ): string {
    const motion = this.loadMotion(buffer, buffer.byteLength, name);
    if (fadeIn > 0) motion.setFadeInTime(fadeIn);
    if (fadeOut > 0) motion.setFadeOutTime(fadeOut);

    motion.setEffectIds(this.eyeBlinkParamIds, this.lipSyncParamIds);

    this.motionResources[name] = motion;

    return name;
  }

  /**
   * 表情モーションを追加して、ID（インデックス）を返す
   * @param buffer モーションデータ
   * @param name モーション名
   */
  public addExpressionMotion(
    buffer: ArrayBuffer,
    name: string,
    fadeIn = 1,
    fadeOut = 1
  ): string {
    const motion = this.loadExpression(buffer, buffer.byteLength, name);
    if (fadeIn > 0) motion.setFadeInTime(fadeIn);
    if (fadeOut > 0) motion.setFadeOutTime(fadeOut);

    this.expressionResources[name] = motion;

    return name;
  }

  /**
   * 登録されているモーションのIDと名前のリストを返す
   */
  public get motionNames(): string[] {
    return Object.keys(this.motionResources);
  }

  /**
   * モーションの再生が終わっているかどうか
   */
  public get isMotionFinished(): boolean {
    return this._motionManager.isFinished();
  }

  /**
   * 表情モーションの再生が終わっているかどうか
   */
  public get isExpressionFinished(): boolean {
    return this._expressionManager.isFinished();
  }

  /**
   * モーションの名前を指定して再生する
   * @param name モーション名
   */
  public startMotionByName(name: string) {
    const motion = this.motionResources[name];
    if (!motion) return;
    this._motionManager.startMotionPriority(motion, false, 0);
  }

  /**
   * 表情モーションの名前を指定して再生する
   * @param name モーション名
   */
  public startExpressionByName(name: string) {
    const motion = this.expressionResources[name];
    if (!motion) return;
    this._expressionManager.startMotionPriority(motion, false, 2);
  }

  /**
   * モデルのパラメータを更新する
   */
  public update(deltaTimeSecond: number) {
    this.getModel().loadParameters();

    // モデルのパラメータを更新
    const motionUpdated = this._motionManager.updateMotion(
      this.getModel(),
      deltaTimeSecond
    );

    const expressionUpdated = this._expressionManager.updateMotion(
      this.getModel(),
      deltaTimeSecond
    );

    this.getModel().saveParameters();

    // まばたき
    if (!motionUpdated && !expressionUpdated && this._eyeBlink != null) {
      this._eyeBlink.updateParameters(this._model, deltaTimeSecond);
    }

    if (!motionUpdated) {
      this._expressionManager.updateMotion(this._model, deltaTimeSecond);
    }

    // ポーズ
    if (this._pose !== null) {
      this._pose.updateParameters(this._model, 0);
    }
    // 物理演算
    if (this._physics != null) {
      this._physics.evaluate(this._model, deltaTimeSecond);
    }
    this._model.update();
  }
}
