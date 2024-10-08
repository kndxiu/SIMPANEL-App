export default function SwitchH({
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
    updateControlState(simvar, state, simevent, novalue);
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
          <svg
            width="50"
            height="50"
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
          </svg>
        </div>
        <span
          className="text-neutral-200 uppercase whitespace-nowrap absolute left-1/2 bottom-1/2 -translate-x-1/2 translate-y-1/2 z-[15] pointer-events-none"
          style={{ fontSize: textSize }}
        >
          {name}
        </span>
      </div>
    </div>
  );
}
