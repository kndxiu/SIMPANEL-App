export default function SwitchB({
  size,
  state,
  name,
  labels,
  simvar,
  simevent,
  updateControlState,
  novalue,
  textSize,
}) {
  const onChange = () => {
    const newState = state === 0 ? 1 : 0;
    if (novalue) {
      updateControlState(simvar, newState, simevent[newState], novalue);
    } else {
      updateControlState(simvar, newState, simevent, novalue);
    }
  };

  return (
    <div className="flex flex-col gap-1 items-center">
      <span
        className="text-neutral-200 uppercase whitespace-nowrap"
        style={{ fontSize: textSize }}
      >
        {name}
      </span>

      <div className="flex flex-col items-center">
        <span
          className="text-neutral-200 uppercase whitespace-nowrap"
          style={{ fontSize: textSize }}
        >
          {labels[0]}
        </span>

        <div
          className="flex z-[11] cursor-pointer"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            alignItems: `${state === 0 ? "start" : "end"}`,
          }}
          onClick={onChange}
        >
          {state === 0 ? (
            <svg
              width={size}
              viewBox="0 0 50 61"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="50" height="50" rx="25" fill="#0A0A0A" />
              <rect
                x="0.5"
                y="0.5"
                width="49"
                height="49"
                rx="24.5"
                stroke="#F6F6F6"
                strokeOpacity="0.25"
              />
              <path
                d="M32 59C32 59.5523 31.5523 60 31 60L19 60C18.4477 60 18 59.5523 18 59L18 46.631C18 46.2635 18.0289 45.8965 18.0866 45.5336L21.0533 26.8432C21.1304 26.3575 21.5492 26 22.0409 26L27.9591 26C28.4509 26 28.8696 26.3575 28.9467 26.8432L31.9134 45.5336C31.9711 45.8965 32 46.2635 32 46.631L32 59Z"
                fill="#A4A4A4"
                stroke="#545454"
                strokeWidth="2"
              />
              <path d="M20 57H30" stroke="#545454" strokeWidth="2" />
              <path d="M20 53H30" stroke="#545454" strokeWidth="2" />
              <path d="M20 49H30" stroke="#545454" strokeWidth="2" />
            </svg>
          ) : (
            <svg
              width={size}
              viewBox="0 0 50 61"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect y="11" width="50" height="50" rx="25" fill="#0A0A0A" />
              <rect
                x="0.5"
                y="11.5"
                width="49"
                height="49"
                rx="24.5"
                stroke="#F6F6F6"
                strokeOpacity="0.25"
              />
              <path
                d="M17.9992 1.99991C17.9992 1.44766 18.4469 1 18.9992 1H30.9993C31.5516 1 31.9993 1.44772 31.9993 2V14.369C31.9993 14.7365 31.9704 15.1034 31.9128 15.4664L28.9461 34.1568C28.869 34.6424 28.4502 35 27.9584 35H22.0402C21.5484 35 21.1296 34.6425 21.0525 34.1568L18.0847 15.4669C18.027 15.1036 17.9981 14.7364 17.9981 14.3685L17.9992 1.99991Z"
                fill="#A4A4A4"
                stroke="#545454"
                strokeWidth="2"
              />
              <path d="M20 12H30" stroke="#545454" strokeWidth="2" />
              <path d="M20 8H30" stroke="#545454" strokeWidth="2" />
              <path d="M20 4H30" stroke="#545454" strokeWidth="2" />
            </svg>
          )}
        </div>
        <span
          className="text-neutral-200 uppercase whitespace-nowrap"
          style={{ fontSize: textSize }}
        >
          {labels[1]}
        </span>
      </div>
    </div>
  );
}
