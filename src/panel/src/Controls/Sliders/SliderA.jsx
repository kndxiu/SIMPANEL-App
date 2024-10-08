export default function SliderA({
  size,
  state,
  min,
  max,
  step,
  name,
  arrows = false,
  labelSide,
  labels,
  direction = "N",
  simvar,
  simevent,
  multiplyFactor = 1,
  updateControlState,
  textSize,
}) {
  const onChange = (event) => {
    const newValue = event.target.value;
    if (Array.isArray(simevent))
      updateControlState(simvar, newValue, simevent[0], false, multiplyFactor);
    else updateControlState(simvar, newValue, simevent, false, multiplyFactor);
  };

  const handleClick = () => {
    if (Array.isArray(simevent))
      updateControlState(simvar, state, simevent[1], true);
  };

  const getRotation = () => {
    switch (direction) {
      case "N":
        return "translate(-50%, -50%) rotate(270deg)";
      case "S":
        return "translate(-50%, -50%) rotate(90deg)";
      default:
        return "translate(-50%, -50%) rotate(270deg)";
    }
  };

  const getPosition = (currentVal) => {
    let position = ((currentVal - min) / (max - min)) * size * 4;

    return direction === "N" ? size * 4 - position : position;
  };

  return (
    <div
      className="flex flex-col gap-1"
      style={{
        alignItems: labelSide === "L" ? "end" : "start",
      }}
    >
      <span
        className="text-neutral-200 uppercase whitespace-nowrap text-center"
        style={{
          minWidth: `${size}px`,
          fontSize: `${textSize}px`,
        }}
      >
        {name}
      </span>
      <div className="flex">
        {labelSide === "L" && labels.length > 0 && (
          <div
            className="h-full relative text-neutral-200 uppercase flex flex-col items-end w-auto"
            style={{
              fontSize: `${textSize}px`,
            }}
          >
            {labels.map((label, index) => (
              <div key={index}>
                <span className="whitespace-nowrap invisible flex items-center">
                  {label.text}
                  {arrows && (
                    <svg
                      className="rotate-90 ml-[2px] mr-[2px]"
                      xmlns="http://www.w3.org/2000/svg"
                      width="8"
                      height="8"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M13.73 4a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                    </svg>
                  )}
                </span>
                <span
                  className="absolute -translate-y-1/2 whitespace-nowrap flex items-center"
                  style={{
                    top: getPosition(label.at),
                  }}
                >
                  {label.text}
                  {arrows && (
                    <svg
                      className="rotate-90 ml-[2px]"
                      xmlns="http://www.w3.org/2000/svg"
                      width="8"
                      height="8"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M13.73 4a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                    </svg>
                  )}
                </span>
              </div>
            ))}
          </div>
        )}
        <div
          className="flex relative"
          style={{
            width: `${size}px`,
            height: `${size * 4}px`,
          }}
        >
          <svg
            width={size}
            viewBox="0 0 50 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 2C0 0.895429 0.89543 0 2 0H48C49.1046 0 50 0.89543 50 2V198C50 199.105 49.1046 200 48 200H2C0.895432 200 0 199.105 0 198V2Z"
              fill="#496976"
            />
            <rect x="10" width="28" height="200" fill="#30444D" />
          </svg>

          <svg
            onClick={handleClick}
            style={{
              top: getPosition(state || 0),
            }}
            className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
            height={size * 0.8}
            viewBox="0 0 54 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="2"
              y="2"
              width="49.9984"
              height="36"
              fill="url(#paint0_linear_2034_210)"
            />
            <rect
              x="2"
              y="2"
              width="49.9984"
              height="36"
              fill="url(#paint1_linear_2034_210)"
              fillOpacity="0.5"
            />
            <rect
              width="5"
              height="40"
              rx="2.5"
              fill="url(#paint2_linear_2034_210)"
            />
            <rect
              x="49"
              width="5"
              height="40"
              rx="2.5"
              fill="url(#paint3_linear_2034_210)"
            />
            <defs>
              <linearGradient
                id="paint0_linear_2034_210"
                x1="26.9992"
                y1="2"
                x2="26.9992"
                y2="38"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#0A0A0A" />
                <stop offset="0.35" stopColor="#1A1A1A" />
                <stop offset="0.5" stopColor="#2A2A2A" />
                <stop offset="0.65" stopColor="#1A1A1A" />
                <stop offset="1" stopColor="#0A0A0A" />
              </linearGradient>
              <linearGradient
                id="paint1_linear_2034_210"
                x1="2"
                y1="19.5485"
                x2="52"
                y2="19.5485"
                gradientUnits="userSpaceOnUse"
              >
                <stop />
                <stop offset="0.25" stopOpacity="0" />
                <stop offset="0.75" stopOpacity="0" />
                <stop offset="1" />
              </linearGradient>
              <linearGradient
                id="paint2_linear_2034_210"
                x1="2.5"
                y1="0"
                x2="2.5"
                y2="40"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#0A0A0A" />
                <stop offset="0.35" stopColor="#1A1A1A" />
                <stop offset="0.5" stopColor="#2A2A2A" />
                <stop offset="0.65" stopColor="#1A1A1A" />
                <stop offset="1" stopColor="#0A0A0A" />
              </linearGradient>
              <linearGradient
                id="paint3_linear_2034_210"
                x1="51.5"
                y1="0"
                x2="51.5"
                y2="40"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#0A0A0A" />
                <stop offset="0.35" stopColor="#1A1A1A" />
                <stop offset="0.5" stopColor="#2A2A2A" />
                <stop offset="0.65" stopColor="#1A1A1A" />
                <stop offset="1" stopColor="#0A0A0A" />
              </linearGradient>
            </defs>
          </svg>

          <input
            className="absolute top-1/2 left-1/2 opacity-0 z-[15]"
            type="range"
            value={state || 0}
            min={min}
            max={max}
            step={step}
            style={{
              width: `${size * 4}px`,
              height: `${size}px`,
              transform: getRotation(),
            }}
            onTouchStart={onChange}
            onChange={onChange}
          />
        </div>
        {labelSide === "R" && labels.length > 0 && (
          <div
            className="h-full relative text-neutral-200 uppercase flex flex-col items-start w-auto"
            style={{
              fontSize: `${textSize}px`,
            }}
          >
            {labels.map((label, index) => (
              <div key={index}>
                <span className="whitespace-nowrap invisible flex items-center">
                  {label.text}
                  {arrows && (
                    <svg
                      className="rotate-90 ml-[2px] mr-[2px]"
                      xmlns="http://www.w3.org/2000/svg"
                      width="8"
                      height="8"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M13.73 4a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                    </svg>
                  )}
                </span>
                <span
                  className="absolute -translate-y-1/2 whitespace-nowrap flex items-center"
                  style={{
                    top: getPosition(label.at),
                  }}
                >
                  {arrows && (
                    <svg
                      className="mr-[2px] -rotate-90"
                      xmlns="http://www.w3.org/2000/svg"
                      width="8"
                      height="8"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M13.73 4a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                    </svg>
                  )}
                  {label.text}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
