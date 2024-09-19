import Battle from "@/components/Battle";
import Controls from "@/components/Controls";
import Map from "@/components/Map";
import { tileSideLength } from "@/utils/constants";
import overworldMap from "@/utils/overworldMap";
import { css } from "@emotion/react";
import Head from "next/head";
import { useCallback, useEffect, useRef, useState } from "react";

export type Enemy = {
  image: string;
  hp: number;
  name: string;
  attack: number;
  attackImage: string;
};

export type Dragon = {
  hp: number;
  maxHP: number;
  name: string;
  attack: number;
  image: string;
  attackImage: string;
};

const enemies: Record<string, Enemy> = {
  redDragon: {
    image: "red-dragon.png",
    hp: 100,
    name: "Red Dragon!",
    attackImage: "fire.png",
    attack: 12
  }
};

export default function Home() {
  const [dragon, setDragon] = useState<Dragon>({
    attack: 20,
    name: "Love Dragon",
    hp: 46,
    maxHP: 200,
    image: "dragon.png",
    attackImage: "fire.png"
  });
  const [enemy, setEnemy] = useState<Enemy>(enemies.redDragon);
  const [battle, setBattle] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const clickHandler = () => {
      if (audioRef.current) {
        audioRef.current.volume = 0.33;
        audioRef.current.play();
      }
    };

    window.addEventListener("click", clickHandler);

    return () => {
      window.removeEventListener("click", clickHandler);
    };
  }, [audioRef]);

  const [sprites, setSprites] = useState([
    {
      name: "Player",
      left: 0,
      top: 0,
      image: "player.png"
    },
    {
      name: "Red Dragon",
      left: 3,
      top: 1,
      image: "dragon-overworld.png"
    },
    {
      name: "Purple Mushroom",
      left: 4,
      top: 0,
      image: "mushroom.png"
    }
  ]);

  const [world, setWorld] = useState({
    left: 0,
    top: 0
  });
  const [map] = useState(overworldMap);
  const [currentMusic] = useState(map.music);

  const onPlayerMove = useCallback(
    (playerSprite: (typeof sprites)[number]) => {
      const blocksWide = Math.floor(window.innerWidth / tileSideLength) / 2;
      const blocksTall = Math.floor(window.innerHeight / tileSideLength) / 2;

      setWorld({
        left: Math.max(
          Math.min(0, -1 * (playerSprite.left - blocksWide)),
          (-1 * (tileSideLength * map.maxWidth - window.innerWidth)) /
            tileSideLength
        ),
        top: Math.max(
          Math.min(0, -1 * (playerSprite.top - blocksTall)),
          (-1 * (tileSideLength * map.maxHeight - window.innerHeight)) /
            tileSideLength
        )
      });
    },
    [map]
  );

  const moveDown = useCallback(() => {
    if (battle) return;
    const newSprites = [
      {
        ...sprites[0],
        top: Math.min(sprites[0].top + 1, map.maxHeight - 1)
      },
      ...sprites.slice(1)
    ];
    setSprites(newSprites);
    onPlayerMove(newSprites[0]);

    const mapIndex = newSprites[0].top * map.maxWidth + newSprites[0].left;
    map.tiles[mapIndex].event?.();
  }, [map, sprites, battle, onPlayerMove]);

  const moveUp = useCallback(() => {
    if (battle) return;
    const newSprites = [
      {
        ...sprites[0],
        top: Math.max(sprites[0].top - 1, 0)
      },
      ...sprites.slice(1)
    ];
    setSprites(newSprites);
    onPlayerMove(newSprites[0]);

    const mapIndex = newSprites[0].top * map.maxWidth + newSprites[0].left;
    map.tiles[mapIndex].event?.();
  }, [map, sprites, battle, onPlayerMove]);

  const moveLeft = useCallback(() => {
    if (battle) return;
    const newSprites = [
      {
        ...sprites[0],
        left: Math.max(sprites[0].left - 1, 0)
      },
      ...sprites.slice(1)
    ];
    setSprites(newSprites);
    onPlayerMove(newSprites[0]);

    const mapIndex = newSprites[0].top * map.maxWidth + newSprites[0].left;
    map.tiles[mapIndex].event?.();
  }, [map, sprites, battle, onPlayerMove]);

  const moveRight = useCallback(() => {
    if (battle) return;
    const newSprites = [
      {
        ...sprites[0],
        left: Math.min(sprites[0].left + 1, map.maxWidth - 1)
      },
      ...sprites.slice(1)
    ];
    setSprites(newSprites);
    onPlayerMove(newSprites[0]);

    const mapIndex = newSprites[0].top * map.maxWidth + newSprites[0].left;
    map.tiles[mapIndex].event?.();
  }, [map, sprites, battle, onPlayerMove]);

  const keyHandlers = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        moveDown();
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        moveUp();
      }

      if (e.key === "ArrowRight") {
        e.preventDefault();
        moveRight();
      }

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        moveLeft();
      }
    },
    [moveDown, moveUp, moveLeft, moveRight]
  );

  useEffect(() => {
    document.addEventListener("keydown", keyHandlers);

    return () => {
      document.removeEventListener("keydown", keyHandlers);
    };
  }, [keyHandlers]);

  return (
    <>
      <Head>
        <title>Dragon Masters</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0,, maximum-scale=1.0, user-scalable=no"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div
        className="world"
        css={css`
          position: absolute;
          inset: 0;
          overflow: hidden;
          left: ${world.left * tileSideLength}px;
          top: ${world.top * tileSideLength}px;
          transition: all 1s ease 0s;
        `}
      >
        <div
          css={css`
            position: absolute;
            top: 0;
            left: 0;
            width: ${map.maxWidth * tileSideLength}px;
            display: flex;
            flex-wrap: wrap;
          `}
        >
          <Map map={overworldMap} />
        </div>
        <div
          className="sprites"
          css={css`
            position: absolute;
            inset: 0;
          `}
        >
          {sprites.map((x) => (
            <div
              key={x.name}
              css={css`
                height: ${tileSideLength}px;
                width: ${tileSideLength}px;
                background-image: url("${x.image}");
                background-size: cover;
                left: ${x.left * tileSideLength}px;
                top: ${x.top * tileSideLength}px;
                transition: all 1s ease 0s;
                position: absolute;
              `}
            ></div>
          ))}
        </div>
      </div>
      <Battle
        open={battle}
        onClose={() => setBattle(false)}
        dragon={dragon}
        setDragon={(newDragon) => setDragon(newDragon)}
        enemy={enemy}
        setEnemy={(newEnemy) => setEnemy(newEnemy)}
      />
      <Controls
        onUp={moveUp}
        onDown={moveDown}
        onLeft={moveLeft}
        onRight={moveRight}
        show={!battle}
      />
      {/* eslint-disable-next-line */}
      <audio loop src={`/${currentMusic}`} ref={audioRef} />
    </>
  );
}
