import { TileProperties } from "@/types";

import { tileSideLength } from "./constants";

export const mapTileProperties: Record<string, TileProperties> = {
  grass: {
    canWalk: true
  },
  water: {
    top: "/submerged.png",
    topMargin: 0,
    leftMargin: 0,
    width: tileSideLength,
    height: tileSideLength,
    canWalk: true
  },
  tree: {
    top: "/tree-top.png",
    topMargin: -130,
    leftMargin: -25,
    width: 150,
    height: 150,
    canWalk: false
  }
};
