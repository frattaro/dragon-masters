import Battle from "@/components/Battle";
import Controls from "@/components/Controls";
import Map from "@/components/Map";
import { Dragon, Enemy } from "@/types";
import { tileSideLength } from "@/utils/constants";
import { mapTileProperties } from "@/utils/mapTileProperties";
import overworldMap from "@/utils/overworldMap";
import { css } from "@emotion/react";
import Head from "next/head";
import { RefObject, useCallback, useEffect, useRef, useState } from "react";

const enemies: Record<string, Enemy> = {
  redDragon: {
    image: "red-dragon-ai.png",
    hp: 100,
    name: "Red Dragon!",
    attackImage: "fireball.png",
    attackSound: "fireball",
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
    attackImage: "fireball.png"
  });
  const [enemy, setEnemy] = useState<Enemy>(enemies.redDragon);
  const [battle, setBattle] = useState(false);
  const overworldAudioRef = useRef<HTMLAudioElement | null>(null);
  const battleAudioRef = useRef<HTMLAudioElement | null>(null);
  const [map] = useState(overworldMap);
  const [musicMap] = useState<
    Record<string, RefObject<HTMLAudioElement | null>>
  >({
    overworld: overworldAudioRef,
    battle: battleAudioRef
  });
  const [music, setMusic] = useState<{
    prev: string | null;
    current: string | null;
  }>({
    prev: null,
    current: map.music
  });
  const [world, setWorld] = useState({
    left: 0,
    top: 0
  });
  const [battleSpriteId, setBattleSpriteId] = useState<number | undefined>();

  const handleMusic = useCallback(() => {
    const audio = musicMap[music.current || ""]?.current;
    if (audio) {
      if (document.visibilityState === "visible") {
        audio.play();
        return;
      }

      audio.pause();
    }
  }, [music, musicMap]);

  useEffect(() => {
    window.addEventListener(
      "click",
      () => {
        handleMusic();
      },
      { once: true }
    );
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    window.addEventListener("visibilitychange", handleMusic);

    return () => {
      window.removeEventListener("visibilitychange", handleMusic);
    };
  }, [handleMusic]);

  useEffect(() => {
    musicMap[music.prev || ""]?.current?.pause();
    musicMap[music.current || ""]?.current?.play();
  }, [music, musicMap]);

  const launchBattle = useCallback(
    (newEnemy: Enemy, associatedSpriteId: number) => {
      if (!dragon.hp) return;

      setBattleSpriteId(associatedSpriteId);

      setEnemy({
        ...newEnemy
      });
      setBattle(true);
      setMusic((curr) => ({
        prev: curr.current,
        current: "battle"
      }));
    },
    [dragon, setMusic]
  );

  const [sprites, setSprites] = useState([
    {
      id: 1,
      name: "Player",
      left: 0,
      top: 0,
      image: "player.png"
    },
    {
      id: 2,
      name: "Red Dragon",
      left: 3,
      top: 1,
      image: "dragon-overworld.png",
      onCollide: () => {
        launchBattle({ ...enemies.redDragon }, 2);
      }
    },
    {
      id: 3,
      name: "Purple Mushroom",
      left: 4,
      top: 0,
      image: "mushroom.png",
      onCollide: () => {
        alert(`${dragon.name} eats the mushroom. It's fully healed!`);
        setSprites((prev) => {
          const newSprites = [...prev];
          newSprites.splice(newSprites.findIndex((x) => x.id === 3));
          return newSprites;
        });

        setDragon((prev) => ({
          ...prev,
          hp: prev.maxHP
        }));
      }
    }
  ]);

  const checkCollision = useCallback(
    (newPositionLeft: number, newPositionTop: number) => {
      return sprites.find(
        (x) => x.left === newPositionLeft && x.top === newPositionTop
      );
    },
    [sprites]
  );

  const checkCanWalk = useCallback(
    (newPositionLeft: number, newPositionTop: number) => {
      return mapTileProperties[
        map.tiles[newPositionTop * map.maxWidth + newPositionLeft].tile
      ].canWalk;
    },
    [map]
  );

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

    if (!checkCanWalk(newSprites[0].left, newSprites[0].top)) return;

    const collision = checkCollision(newSprites[0].left, newSprites[0].top);
    if (collision) {
      collision.onCollide?.();
      return;
    }

    setSprites(newSprites);
    onPlayerMove(newSprites[0]);

    const mapIndex = newSprites[0].top * map.maxWidth + newSprites[0].left;
    map.tiles[mapIndex].event?.();
  }, [map, sprites, battle, onPlayerMove, checkCollision, checkCanWalk]);

  const moveUp = useCallback(() => {
    if (battle) return;
    const newSprites = [
      {
        ...sprites[0],
        top: Math.max(sprites[0].top - 1, 0)
      },
      ...sprites.slice(1)
    ];

    if (!checkCanWalk(newSprites[0].left, newSprites[0].top)) return;

    const collision = checkCollision(newSprites[0].left, newSprites[0].top);
    if (collision) {
      collision.onCollide?.();
      return;
    }

    setSprites(newSprites);
    onPlayerMove(newSprites[0]);

    const mapIndex = newSprites[0].top * map.maxWidth + newSprites[0].left;
    map.tiles[mapIndex].event?.();
  }, [map, sprites, battle, onPlayerMove, checkCollision, checkCanWalk]);

  const moveLeft = useCallback(() => {
    if (battle) return;
    const newSprites = [
      {
        ...sprites[0],
        left: Math.max(sprites[0].left - 1, 0)
      },
      ...sprites.slice(1)
    ];

    if (!checkCanWalk(newSprites[0].left, newSprites[0].top)) return;

    const collision = checkCollision(newSprites[0].left, newSprites[0].top);
    if (collision) {
      collision.onCollide?.();
      return;
    }

    setSprites(newSprites);
    onPlayerMove(newSprites[0]);

    const mapIndex = newSprites[0].top * map.maxWidth + newSprites[0].left;
    map.tiles[mapIndex].event?.();
  }, [map, sprites, battle, onPlayerMove, checkCollision, checkCanWalk]);

  const moveRight = useCallback(() => {
    if (battle) return;
    const newSprites = [
      {
        ...sprites[0],
        left: Math.min(sprites[0].left + 1, map.maxWidth - 1)
      },
      ...sprites.slice(1)
    ];

    if (!checkCanWalk(newSprites[0].left, newSprites[0].top)) return;

    const collision = checkCollision(newSprites[0].left, newSprites[0].top);
    if (collision) {
      collision.onCollide?.();
      return;
    }

    setSprites(newSprites);
    onPlayerMove(newSprites[0]);

    const mapIndex = newSprites[0].top * map.maxWidth + newSprites[0].left;
    map.tiles[mapIndex].event?.();
  }, [map, sprites, battle, onPlayerMove, checkCollision, checkCanWalk]);

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
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
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
          touch-action: none;
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
        onClose={() => {
          if (battleSpriteId) {
            const newSprites = [...sprites];
            newSprites.splice(
              sprites.findIndex((x) => x.id === battleSpriteId),
              1
            );
            setSprites(newSprites);
          }

          setBattle(false);
          setMusic((curr) => ({
            prev: curr.current,
            current: curr.prev
          }));
        }}
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

      <audio loop src="/overworld.wav" ref={overworldAudioRef} />
      <audio loop src="/battle.wav" ref={battleAudioRef} />
    </>
  );
}
