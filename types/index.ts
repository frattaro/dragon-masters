export type Enemy = {
  image: string;
  hp: number;
  name: string;
  attack: number;
  attackImage: string;
  attackSound: string;
};

export type Dragon = {
  hp: number;
  maxHP: number;
  name: string;
  attack: number;
  image: string;
  attackImage: string;
};

export type Tile = {
  tile: string;
  event?: () => void;
};

export type Map = {
  maxWidth: number;
  maxHeight: number;
  music: string;
  tiles: Tile[];
};

export type TileProperties = {
  top?: string;
  topMargin?: number;
  leftMargin?: number;
  width?: number;
  height?: number;
  canWalk: boolean;
};
