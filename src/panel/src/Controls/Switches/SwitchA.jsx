export default function SwitchA({
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
        style={{
          fontSize: `${textSize}px`,
        }}
      >
        {name}
      </span>

      <div className="flex flex-col items-center">
        <span
          className="text-neutral-200 uppercase whitespace-nowrap"
          style={{
            fontSize: `${textSize}px`,
          }}
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
                d="M31.2667 53.1263C31.6083 56.8154 28.7049 60 25 60C21.295 60 18.3917 56.8154 18.7333 53.1263L21.161 26.9078C21.2086 26.3934 21.6401 26 22.1567 26L27.8433 26C28.3599 26 28.7914 26.3934 28.839 26.9078L31.2667 53.1263Z"
                fill="#A4A4A4"
                stroke="#545454"
                strokeWidth="2"
              />
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
                d="M18.7333 7.87373C18.3917 4.18457 21.2951 1 25 1C28.7049 1 31.6083 4.18456 31.2667 7.87373L28.839 34.0922C28.7914 34.6066 28.3599 35 27.8433 35H22.1567C21.6401 35 21.2086 34.6066 21.161 34.0922L18.7333 7.87373Z"
                fill="#A4A4A4"
                stroke="#545454"
                strokeWidth="2"
              />
            </svg>
          )}
        </div>
        <span
          className="text-neutral-200 uppercase whitespace-nowrap"
          style={{
            fontSize: `${textSize}px`,
          }}
        >
          {labels[1]}
        </span>
      </div>
    </div>
  );
}
