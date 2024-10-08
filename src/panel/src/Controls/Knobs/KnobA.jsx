import { useState } from "react";

export default function KnobA({
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
        style={{ fontSize: `${textSize}px` }}
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
          <circle cx="25" cy="25" r="22" fill="url(#paint0_radial_2072_247)" />
          <defs>
            <radialGradient
              id="paint0_radial_2072_247"
              cx="0"
              cy="0"
              r="1"
              gradientUnits="userSpaceOnUse"
              gradientTransform="translate(25 25) rotate(90) scale(19.5)"
            >
              <stop offset="0.5" stopOpacity="0.5" />
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
            <circle cx="16" cy="16" r="16" fill="#C9C9C9" />
            <circle
              cx="16"
              cy="16"
              r="15.5"
              stroke="black"
              strokeOpacity="0.15"
              strokeDasharray="1 1"
            />
            <path
              d="M29.5 16C29.5 23.4558 23.4558 29.5 16 29.5C8.54416 29.5 2.5 23.4558 2.5 16C2.5 8.54416 8.54416 2.5 16 2.5C23.4558 2.5 29.5 8.54416 29.5 16Z"
              fill="#C9C9C9"
              stroke="#F8F8F8"
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
