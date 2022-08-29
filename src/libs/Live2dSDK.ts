// @url https://astie.dog/blog/posts/mevdzj-4dsm

import { Live2DCubismFramework } from "./Framework/src/live2dcubismframework";
const CubismFramework = Live2DCubismFramework.CubismFramework;

import { Live2DCubismFramework as icubismmodelsetting } from "./Framework/src/icubismmodelsetting";
abstract class ICubismModelSetting extends icubismmodelsetting.ICubismModelSetting {}

import { Live2DCubismFramework as cubismmodelsettingjson } from "./Framework/src/cubismmodelsettingjson";
class CubismModelSettingJson extends cubismmodelsettingjson.CubismModelSettingJson {}

// math
import { Live2DCubismFramework as cubismmatrix44 } from "./Framework/src/math/cubismmatrix44";
class CubismMatrix44 extends cubismmatrix44.CubismMatrix44 {}

import { Live2DCubismFramework as cubismusermodel } from "./Framework/src/model/cubismusermodel";
class CubismUserModel extends cubismusermodel.CubismUserModel {}

// motion
import { Live2DCubismFramework as acubismmotion } from "./Framework/src/motion/acubismmotion";
abstract class ACubismMotion extends acubismmotion.ACubismMotion {}

import { Live2DCubismFramework as cubismmotion } from "./Framework/src/motion/cubismmotion";
class CubismMotion extends cubismmotion.CubismMotion {}

import { Live2DCubismFramework as cubismexpressionmotion } from "./Framework/src/motion/cubismexpressionmotion";
class CubismExpressionMotion extends cubismexpressionmotion.CubismExpressionMotion {}

import { Live2DCubismFramework as cubismmotionmanager } from "./Framework/src/motion/cubismmotionmanager";
class CubismMotionManager extends cubismmotionmanager.CubismMotionManager {}

// physics
import { Live2DCubismFramework as cubismphysics } from "./Framework/src/physics/cubismphysics";
class CubismPhysics extends cubismphysics.CubismPhysics {}

// cubismid
import { Live2DCubismFramework as cubismid } from "./Framework/src/id/cubismid";
type CubismIdHandle = cubismid.CubismIdHandle;

// effect
import { Live2DCubismFramework as cubismeyeblink } from "./Framework/src/effect/cubismeyeblink";
class CubismEyeBlink extends cubismeyeblink.CubismEyeBlink {}

// type
import { Live2DCubismFramework as csmvector } from "./Framework/src/type/csmvector";
class csmVector<T> extends csmvector.csmVector<T> {}

export {
  ACubismMotion,
  csmVector,
  CubismExpressionMotion,
  CubismEyeBlink,
  CubismFramework,
  CubismMatrix44,
  CubismModelSettingJson,
  CubismMotion,
  CubismMotionManager,
  CubismPhysics,
  CubismUserModel,
  ICubismModelSetting,
};
export type { CubismIdHandle };
