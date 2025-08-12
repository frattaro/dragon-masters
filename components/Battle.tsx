import { css } from "@emotion/react";
import { RefObject, useRef, useState } from "react";

import { Dragon, Enemy } from "../types";
import BattleText from "./BattleText";

export default function Battle({
  open,
  onClose,
  dragon,
  setDragon,
  enemy,
  setEnemy
}:
  | {
      open: false;
      onClose: () => void;
      dragon: Dragon;
      setDragon: (newDragon: Dragon) => void;
      enemy: Enemy | null;
      setEnemy: (newEnemy: Enemy) => void;
    }
  | {
      open: true;
      onClose: () => void;
      dragon: Dragon;
      setDragon: (newDragon: Dragon) => void;
      enemy: Enemy;
      setEnemy: (newEnemy: Enemy) => void;
    }) {
  const [showTopBattleText, setShowTopBattleText] = useState(false);
  const [showBottomBattleText, setShowBottomBattleText] = useState(false);
  const [showEnemyAttackImage, setShowEnemyAttackImage] = useState(false);
  const [attackDisabled, setAttackDisabled] = useState(false);
  const [lost, setLost] = useState(false);
  const [win, setWin] = useState(false);
  const fireballAudioRef = useRef<HTMLAudioElement | null>(null);

  const attackSoundMap: Record<string, RefObject<HTMLAudioElement | null>> = {
    fireball: fireballAudioRef
  };

  const topBattleText = `Hit ${enemy?.name} for ${dragon.attack}!`;
  const bottomBattleText = `${dragon.name} hit for ${enemy?.attack} damage!`;

  const enemyAttack = async () => {
    return new Promise<Dragon>((resolve) => {
      setShowEnemyAttackImage(true);
      if (enemy) attackSoundMap[enemy.attackSound].current?.play();

      setTimeout(async () => {
        setShowEnemyAttackImage(false);
        setShowBottomBattleText(true);
        const newDragon = {
          ...dragon,
          hp: Math.max(dragon.hp - (enemy?.attack || 0), 0)
        };
        setDragon(newDragon);

        setTimeout(async () => {
          setShowBottomBattleText(false);
          resolve(newDragon);
        }, 1000);
      }, 1000);
    });
  };

  const enemyTurn = async () => {
    return enemyAttack();
  };

  return (
    <>
      <div
        className="battle"
        css={css`
          position: absolute;
          inset: 0;
          display: ${open ? "block" : "none"};
          backdrop-filter: blur(7.5px);
          background-color: rgba(0, 0, 0, 0.4);
        `}
      >
        <img
          src={enemy?.image}
          alt={enemy?.name}
          css={css`
            position: absolute;
            max-height: 80vh;
            left: 50vw;
            top: 10vh;
          `}
        />
        <div
          css={css`
            position: absolute;
            bottom: 0;
            left: 0;
            color: #fff;
          `}
        >
          {dragon.name}: {dragon.hp}/{dragon.maxHP}
        </div>
        <BattleText
          open={showTopBattleText}
          text={topBattleText}
          position="top"
        />
        <img
          src={enemy?.attackImage}
          css={css`
            position: absolute;
            top: 30vh;
            left: 40vw;
            display: ${showEnemyAttackImage ? "block" : "none"};
          `}
          alt="Enemy attack"
        />
        <BattleText
          open={showBottomBattleText}
          text={bottomBattleText}
          position="bottom"
        />
        <button
          disabled={attackDisabled}
          css={css`
            height: 48px;
            width: 80px;
            background-color: rgba(0, 0, 0, 0.33);
            border: 0;
            color: #fff;
            position: absolute;
            right: 0;
            top: 0;
          `}
          onClick={() => {
            if (!enemy) return;
            onClose();
          }}
        >
          Run away!
        </button>
        <button
          disabled={attackDisabled}
          css={css`
            height: 48px;
            width: 80px;
            background-color: rgba(0, 0, 0, 0.33);
            border: 0;
            color: #fff;
            position: absolute;
            right: 0;
            bottom: 0;
          `}
          onClick={() => {
            if (!enemy) return;

            setAttackDisabled(true);

            const newEnemy = enemy;
            newEnemy.hp = enemy.hp - dragon.attack;
            setEnemy(newEnemy);

            setShowTopBattleText(true);
            setTimeout(async () => {
              setShowTopBattleText(false);
              if (newEnemy.hp <= 0) {
                setWin(true);

                setTimeout(() => {
                  onClose();
                  setAttackDisabled(false);
                  setWin(false);
                }, 2000);
                return;
              }

              const newDragon = await enemyTurn();

              if (newDragon.hp) {
                setAttackDisabled(false);
                return;
              }

              setLost(true);

              setTimeout(() => {
                onClose();
                setAttackDisabled(false);
                setLost(false);
              }, 2000);
            }, 1000);
          }}
        >
          Attack!
        </button>
      </div>
      <div
        css={css`
          position: absolute;
          inset: 0;
          display: ${lost ? "block" : "none"};
          background-color: rgba(255, 0, 0, 0.33);
        `}
      >
        <BattleText position="center" open={true} text="LOST" />
      </div>
      <div
        css={css`
          position: absolute;
          inset: 0;
          display: ${win ? "block" : "none"};
          background-color: rgba(0, 255, 128, 0.33);
        `}
      >
        <BattleText position="center" open={true} text="WIN" />
      </div>
      <audio src="./fireball.wav" ref={fireballAudioRef} />
    </>
  );
}
