import { useState } from "react";

export default function KnobC({
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
              d="M12.9121 1.34062C14.5827 -0.446871 17.4173 -0.446872 19.0879 1.34061L19.8444 2.14995C20.6776 3.04147 21.8555 3.52937 23.0751 3.48816L24.1822 3.45074C26.6275 3.3681 28.6319 5.37251 28.5493 7.81776L28.5118 8.92492C28.4706 10.1445 28.9585 11.3224 29.85 12.1556L30.6594 12.9121C32.4469 14.5827 32.4469 17.4173 30.6594 19.0879L29.85 19.8444C28.9585 20.6776 28.4706 21.8555 28.5118 23.0751L28.5493 24.1822C28.6319 26.6275 26.6275 28.6319 24.1822 28.5493L23.0751 28.5118C21.8555 28.4706 20.6776 28.9585 19.8444 29.85L19.0879 30.6594C17.4173 32.4469 14.5827 32.4469 12.9121 30.6594L12.1556 29.85C11.3224 28.9585 10.1445 28.4706 8.92492 28.5118L7.81776 28.5493C5.37251 28.6319 3.3681 26.6275 3.45074 24.1822L3.48816 23.0751C3.52937 21.8555 3.04148 20.6776 2.14995 19.8444L1.34062 19.0879C-0.446871 17.4173 -0.446872 14.5827 1.34061 12.9121L2.14995 12.1556C3.04147 11.3224 3.52937 10.1445 3.48816 8.92492L3.45074 7.81776C3.3681 5.37251 5.37251 3.3681 7.81776 3.45074L8.92492 3.48816C10.1445 3.52937 11.3224 3.04148 12.1556 2.14995L12.9121 1.34062Z"
              fill="#CECECE"
            />
            <circle cx="16" cy="16" r="13" fill="#707070" />
          </svg>
        </div>

        <div
          className="absolute -top-4 left-1/2 -translate-x-1/2 text-amber-200 text-xs bg-neutral-900 p-1 text-center rounded border border-neutral-200/50"
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
