export default function SwitchE({
  size,
  state,
  name,
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
      <div className="flex relative">
        <div
          className="flex z-[11] cursor-pointer"
          style={{
            width: `${size}px`,
            height: `${size}px`,
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
              <rect width="50" height="50" rx="8" fill="#0A0A0A" />
              <rect
                x="0.5"
                y="0.5"
                width="49"
                height="49"
                rx="7.5"
                stroke="#F6F6F6"
                strokeOpacity="0.25"
              />
              <rect x="8" y="8" width="34" height="11" rx="2" fill="#5A5A5A" />
              <rect x="8" y="11" width="34" height="1" fill="#2E2E2E" />
              <rect x="8" y="15" width="34" height="1" fill="#2E2E2E" />
            </svg>
          ) : (
            <svg
              width={size}
              viewBox="0 0 50 50"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="50" height="50" rx="8" fill="#0A0A0A" />
              <rect
                x="0.5"
                y="0.5"
                width="49"
                height="49"
                rx="7.5"
                stroke="#F6F6F6"
                strokeOpacity="0.25"
              />
              <rect x="8" y="8" width="34" height="11" rx="2" fill="#63B85B" />
              <rect x="8" y="11" width="34" height="1" fill="#2E2E2E" />
              <rect x="8" y="15" width="34" height="1" fill="#2E2E2E" />
            </svg>
          )}
        </div>
        <span
          className="text-neutral-200 uppercase whitespace-nowrap absolute left-1/2 bottom-[30%] -translate-x-1/2 translate-y-1/2 z-[15] pointer-events-none"
          style={{ fontSize: textSize }}
        >
          {name}
        </span>
      </div>
    </div>
  );
}
