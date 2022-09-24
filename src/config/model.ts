interface Models {
  [key: string]: Model;
}
export interface Model {
  moc3: string;
  model3: string;
  physics3: string;
  textures: string[];
}

const baseDir = "/hiyori_free_jp/runtime/";

export const models: Models = {
  model: {
    moc3: baseDir + "hiyori_free_t08.moc3",
    model3: baseDir + "hiyori_free_t08.model3.json",
    physics3: baseDir + "hiyori_free_t08.physics3.json",
    textures: [baseDir + "hiyori_free_t08.2048/texture_00.png"],
  },
};
