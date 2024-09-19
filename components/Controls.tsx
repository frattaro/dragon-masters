import { css } from "@emotion/react";

export default function Controls({
  onUp,
  onDown,
  onLeft,
  onRight,
  show
}: {
  onUp: () => void;
  onDown: () => void;
  onLeft: () => void;
  onRight: () => void;
  show: boolean;
}) {
  const buttonStyles = css`
    width: 48px;
    height: 48px;
    color: #fff;
    background-color: rgba(0, 0, 0, 0.66);
    border: 0;
    margin: 4px;
  `;

  return (
    <div
      css={css`
        position: absolute;
        bottom: 0;
        right: 50px;
        display: ${show ? "block" : "none"};
        text-align: center;
      `}
    >
      <button onClick={onUp} css={buttonStyles}>
        ^
      </button>
      <br />
      <button onClick={onLeft} css={buttonStyles}>
        &lt;
      </button>
      <button onClick={onDown} css={buttonStyles}>
        V
      </button>
      <button onClick={onRight} css={buttonStyles}>
        &gt;
      </button>
    </div>
  );
}
