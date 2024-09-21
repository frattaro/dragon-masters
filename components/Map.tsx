import { Map } from "@/types";
import { tileSideLength } from "@/utils/constants";
import { mapTileProperties } from "@/utils/mapTileProperties";
import { css } from "@emotion/react";
import { memo } from "react";

export default memo(function Map({ map }: { map: Map }) {
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
            position: relative;
          `}
        >
          {mapTileProperties[x.tile].top ? (
            <img
              src={mapTileProperties[x.tile].top}
              alt="tile enhacement"
              css={css`
                position: absolute;
                top: ${mapTileProperties[x.tile].topMargin}px;
                left: ${mapTileProperties[x.tile].leftMargin}px;
                width: ${mapTileProperties[x.tile].width}px;
                height: ${mapTileProperties[x.tile].height}px;
                z-index: 100;
                opacity: 0.9;
              `}
            />
          ) : null}
        </div>
      ))}
    </>
  );
});
