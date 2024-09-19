import { css } from "@emotion/react";

export default function BattleText({
  open,
  text,
  position
}: {
  open: boolean;
  text: string;
  position: string;
}) {
  return (
    <div
      css={css`
        position: absolute;
        top: ${position === "top" ? "50px" : "300px"};
        left: 50%;
        transform: translateX(-50%);
        display: ${open ? "flex" : "none"};
        white-space: nowrap;
        --color-background: #31037d;
        --axis-x: 1px;
        --axis-y: 1rem;
        --delay: 10;
        --color-black: #000;
        --color-white: #fff;
        --color-orange: #d49c3d;
        --color-red: #d14b3d;
        --color-violet: #cf52eb;
        --color-blue: #44a3f7;
        --color-green: #5acb3c;
        --color-yellow: #debf40;
        --color-foreground: var(--color-white);
        --font-name: Righteous;
        font-size: 24px;
        align-items: center;
        justify-content: center;
        .c-rainbow {
          counter-reset: rainbow;
          position: relative;
          display: block;
          list-style: none;
          padding: 0;
          margin: 0;
          &__layer {
            --text-color: var(--color-foreground);
            counter-increment: rainbow;
            font-size: 3rem;
            color: var(--text-color);
            text-shadow:
              -1px -1px 0 var(--color-black),
              1px -1px 0 var(--color-black),
              -1px 1px 0 var(--color-black),
              1px 1px 0 var(--color-black),
              4px 4px 0 rgba(0, 0, 0, 0.2);
            animation: rainbow 1.5s ease-in-out infinite;
            &:nth-of-type(1) {
              animation-delay: calc(1 / var(--delay) * 1s);
              left: calc(var(--axis-x) * 1);
              z-index: -1 * 10;
            }
            &:nth-of-type(2) {
              animation-delay: calc(2 / var(--delay) * 1s);
              left: calc(var(--axis-x) * 2);
              z-index: -#{$i * 10};
            }
            &:nth-of-type(3) {
              animation-delay: calc(3 / var(--delay) * 1s);
              left: calc(var(--axis-x) * 3);
              z-index: -#{$i * 10};
            }
            &:nth-of-type(4) {
              animation-delay: calc(4 / var(--delay) * 1s);
              left: calc(var(--axis-x) * 4);
              z-index: -#{$i * 10};
            }
            &:nth-of-type(5) {
              animation-delay: calc(5 / var(--delay) * 1s);
              left: calc(var(--axis-x) * 5);
              z-index: -#{$i * 10};
            }
            &:nth-of-type(6) {
              animation-delay: calc(6 / var(--delay) * 1s);
              left: calc(var(--axis-x) * 6);
              z-index: -#{$i * 10};
            }
            &:nth-of-type(7) {
              animation-delay: calc(7 / var(--delay) * 1s);
              left: calc(var(--axis-x) * 7);
              z-index: -#{$i * 10};
            }
            &:not(:first-of-type) {
              position: absolute;
              top: 0;
            }
            &--white {
              --text-color: var(--color-white);
            }
            &--orange {
              --text-color: var(--color-orange);
            }
            &--red {
              --text-color: var(--color-red);
            }
            &--violet {
              --text-color: var(--color-violet);
            }
            &--blue {
              --text-color: var(--color-blue);
            }
            &--green {
              --text-color: var(--color-green);
            }
            &--yellow {
              --text-color: var(--color-yellow);
            }
          }
        }

        @keyframes rainbow {
          0%,
          100% {
            transform: translatey(var(--axis-y));
          }
          50% {
            transform: translatey(calc(var(--axis-y) * -1));
          }
        }
      `}
    >
      <ul className="c-rainbow">
        <li className="c-rainbow__layer c-rainbow__layer--white">{text}</li>
        <li className="c-rainbow__layer c-rainbow__layer--orange">{text}</li>
        <li className="c-rainbow__layer c-rainbow__layer--red">{text}</li>
        <li className="c-rainbow__layer c-rainbow__layer--violet">{text}</li>
        <li className="c-rainbow__layer c-rainbow__layer--blue">{text}</li>
        <li className="c-rainbow__layer c-rainbow__layer--green">{text}</li>
        <li className="c-rainbow__layer c-rainbow__layer--yellow">{text}</li>
      </ul>
    </div>
  );
}
