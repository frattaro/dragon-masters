import { tileSideLength } from "@/utils/constants";
import { css } from "@emotion/react";
import { memo } from "react";

export default memo(function Map({
  map
}: {
  map: {
    tiles: {
      tile: string;
    }[];
  };
}) {
  return (
    <>
      {map.tiles.map((x, i) => (
        <div
          key={i}
          css={css`
            height: ${tileSideLength}px;
            width: ${tileSideLength}px;
            background-image: url("${x.tile}.png");
            background-size: cover;
          `}
        ></div>
      ))}
    </>
  );
});
