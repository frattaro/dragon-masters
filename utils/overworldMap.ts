import { Map } from "@/types";

const overworldMap: Map = {
  maxWidth: 50,
  maxHeight: 50,
  music: "overworld",
  tiles: new Array(50 * 50)
    .fill({
      tile: "grass"
    })
    .map((x, i) => {
      if (5 * 50 <= i && i <= 5 * 50 + 3) {
        return {
          tile: "water"
        };
      }

      if (i === 4 * 50 + 7) {
        return {
          tile: "tree"
        };
      }

      return x;
    })
};

export default overworldMap;
