export default function SwitchC({
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
              viewBox="0 0 50 50"
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
              <rect x="20" y="5" width="10" height="20" rx="2" fill="#7A7A7A" />
              <rect
                x="6"
                y="1"
                width="38"
                height="10"
                rx="1"
                fill="#A4A4A4"
                stroke="#545454"
                strokeWidth="2"
              />
            </svg>
          ) : (
            <svg
              width={size}
              viewBox="0 0 50 50"
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
              <rect x="20" y="5" width="10" height="20" rx="2" fill="#7A7A7A" />
              <rect
                x="6"
                y="1"
                width="38"
                height="10"
                rx="1"
                fill="#A4A4A4"
                stroke="#545454"
                strokeWidth="2"
              />
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
