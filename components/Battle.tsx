import { Dragon, Enemy } from "@/pages";
import { css } from "@emotion/react";
import { useState } from "react";

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
  const topBattleText = `Hit ${enemy?.name} for ${dragon.attack}!`;
  const bottomBattleText = `${dragon.name} hit for ${enemy?.attack} damage!`;

  const enemyAttack = async () => {
    return new Promise<Dragon>((resolve) => {
      setShowEnemyAttackImage(true);

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
    <div
      className="battle"
      css={css`
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 100vw;
        height: 100vh;
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
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
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
          top: 220px;
          left: 50%;
          transform: translateX(-50%);
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
          background-color: rgba(0, 0, 0, 0.66);
          border: 0;
          color: #fff;
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
              onClose();
              setAttackDisabled(false);
              return;
            }

            const newDragon = await enemyTurn();

            if (newDragon.hp) {
              setAttackDisabled(false);
              return;
            }

            onClose();
            setAttackDisabled(false);
          }, 1000);
        }}
      >
        Attack!
      </button>
    </div>
  );
}
