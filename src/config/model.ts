interface Models {
  [key: string]: Model;
}
export interface Model {
  moc3: string;
  model3: string;
  physics3: string;
  textures: string[];
  motions: string[];
}

export const models: Models = {
  model: {
    moc3: `/kasukabe/kasukabe.moc3`,
    model3: `/kasukabe/kasukabe.model3.json`,
    physics3: `/kasukabe/kasukabe.physics3.json`,
    textures: [
      `/kasukabe/kasukabe.2048/texture_00.png`,
      `/kasukabe/kasukabe.2048/texture_01.png`,
      `/kasukabe/kasukabe.2048/texture_02.png`,
    ],
    // motions: [`/kasukabe/照れ.exp3.json`],
    motions: [`/kasukabe/がーん.exp3.json`],
  },
};
