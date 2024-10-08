import { useState } from "react";

export default function KnobB({
  size,
  state,
  min,
  max,
  step,
  name,
  unit,
  simvar,
  simevent,
  updateControlState,
  sensitivity = 1,
  repeat = false,
  textSize,
}) {
  const [visible, setVisible] = useState(false);
  let lastMouseX = null;
  let lastTouchX = null;

  const getRotation = () => {
    const totalRotations = 4;
    const maxRotation = totalRotations * 360;
    const normalizedValue = ((state - min) / (max - min)) * maxRotation;
    return `rotate(${normalizedValue}deg)`;
  };

  const handleMouseMove = (event) => {
    if (lastMouseX === null) lastMouseX = event.clientX;

    const rawValue =
      state + (event.clientX - lastMouseX) / (5 / sensitivity / step);
    let newValue = Math.round(rawValue / step) * step;

    if (!repeat) {
      if (newValue > max) newValue = max;
      if (newValue < min) newValue = min;
    } else {
      if (newValue > max) {
        newValue = min + (newValue - max - 1);
      } else if (newValue < min) {
        newValue = max - (min - newValue - 1);
      }
    }

    if (state !== newValue) {
      updateControlState(
        simvar,
        newValue,
        Array.isArray(simevent) ? simevent[0] : simevent
      );
    }
  };

  const handleTouchMove = (event) => {
    const touch = event.touches[0];
    if (lastTouchX === null) lastTouchX = touch.clientX;

    const rawValue =
      state + (touch.clientX - lastTouchX) / (5 / sensitivity / step);
    let newValue = Math.round(rawValue / step) * step;

    if (!repeat) {
      if (newValue > max) newValue = max;
      if (newValue < min) newValue = min;
    } else {
      if (newValue > max) {
        newValue = min + (newValue - max - 1);
      } else if (newValue < min) {
        newValue = max - (min - newValue - 1);
      }
    }

    if (state !== newValue) {
      updateControlState(
        simvar,
        newValue,
        Array.isArray(simevent) ? simevent[0] : simevent
      );
    }
  };

  const handleClick = () => {
    if (Array.isArray(simevent))
      updateControlState(simvar, state, simevent[1], true);
  };

  const handleMouseDown = () => {
    setVisible(true);

    const handleMouseUp = () => {
      setVisible(false);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      lastMouseX = null;
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleTouchStart = (event) => {
    setVisible(true);
    lastTouchX = event.touches[0].clientX;

    const handleTouchEnd = () => {
      setVisible(false);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
      lastTouchX = null;
    };

    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("touchend", handleTouchEnd);
  };

  return (
    <div className="flex flex-col gap-1 items-center">
      <span
        className="text-neutral-200 uppercase whitespace-nowrap"
        style={{
          fontSize: `${textSize}px`,
        }}
      >
        {name}
      </span>
      <div
        className="relative"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          cursor: "pointer",
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onClick={handleClick}
      >
        <svg
          width={size}
          viewBox="0 0 50 50"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="25" cy="25" r="25" fill="#1E1E1E" />
          <circle
            cx="25"
            cy="25"
            r="24.5"
            stroke="#F6F6F6"
            strokeOpacity="0.25"
          />
          <circle cx="25" cy="25" r="22" fill="#A4A4A4" />
          <circle cx="25" cy="25" r="22" fill="url(#paint0_radial_2082_201)" />
          <defs>
            <radialGradient
              id="paint0_radial_2082_201"
              cx="0"
              cy="0"
              r="1"
              gradientUnits="userSpaceOnUse"
              gradientTransform="translate(25 25) rotate(90) scale(19.5)"
            >
              <stop offset="0.5" stopOpacity="0.25" />
              <stop offset="1" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>

        <div
          className="absolute top-1/2 left-1/2 flex items-center content-center"
          style={{
            transform: `translate(-50%, -50%) ${getRotation()}`,
          }}
        >
          <svg
            width={size * 0.64}
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12.098 2.79783C13.3619 -0.932609 18.6381 -0.93261 19.902 2.79783L20.6068 4.87819L22.5762 3.90555C26.1078 2.16144 29.8386 5.89224 28.0944 9.42377L27.1218 11.3932L29.2022 12.098C32.9326 13.3619 32.9326 18.6381 29.2022 19.902L27.1218 20.6068L28.0944 22.5762C29.8386 26.1078 26.1078 29.8386 22.5762 28.0944L20.6068 27.1218L19.902 29.2022C18.6381 32.9326 13.3619 32.9326 12.098 29.2022L11.3932 27.1218L9.42377 28.0944C5.89224 29.8386 2.16144 26.1078 3.90555 22.5762L4.87819 20.6068L2.79783 19.902C-0.932609 18.6381 -0.93261 13.3619 2.79783 12.098L4.87819 11.3932L3.90555 9.42377C2.16144 5.89224 5.89224 2.16144 9.42376 3.90555L11.3932 4.87819L12.098 2.79783Z"
              fill="#CECECE"
            />
            <path
              d="M16.2171 8.89153L22.4939 19.876C22.5891 20.0426 22.4688 20.25 22.2768 20.25H9.72318C9.53122 20.25 9.41088 20.0426 9.50612 19.876L15.7829 8.89153C15.8789 8.72358 16.1211 8.72358 16.2171 8.89153Z"
              stroke="#0EA5E9"
              strokeWidth="1.5"
            />
          </svg>
        </div>

        <div
          className="absolute -top-4 left-1/2 -translate-x-1/2 text-amber-200 bg-neutral-900 p-1 text-center rounded border border-neutral-200/50"
          style={{
            width: `${size}px`,
            visibility: visible ? "visible" : "hidden",
            fontSize: `${textSize}px`,
          }}
        >
          {parseInt(state)} {unit}
        </div>
      </div>
    </div>
  );
}
