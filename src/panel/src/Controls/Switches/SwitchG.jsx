export default function SwitchG({
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
            height: `${size * 4}px`,
            alignItems: `${state === 0 ? "end" : "start"}`,
          }}
          onClick={onChange}
        >
          {state === 0 ? (
            <svg
              width={size}
              viewBox="0 0 50 212"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="2"
                y="14"
                width="46"
                height="196"
                rx="2"
                fill="#353535"
                stroke="#595959"
                strokeWidth="4"
              />
              <rect
                x="14"
                y="17"
                width="22"
                height="95"
                rx="11"
                fill="#0C0C0C"
              />
              <g filter="url(#filter0_d_1943_230)">
                <rect
                  x="7"
                  y="4"
                  width="17"
                  height="50"
                  rx="4"
                  fill="url(#paint0_linear_1943_230)"
                />
              </g>
              <g filter="url(#filter1_d_1943_230)">
                <rect
                  x="26"
                  y="4"
                  width="17"
                  height="50"
                  rx="4"
                  fill="url(#paint1_linear_1943_230)"
                />
              </g>
              <defs>
                <filter
                  id="filter0_d_1943_230"
                  x="3"
                  y="0"
                  width="25"
                  height="58"
                  filterUnits="userSpaceOnUse"
                  colorInterpolationFilters="sRGB"
                >
                  <feFlood floodOpacity="0" result="BackgroundImageFix" />
                  <feColorMatrix
                    in="SourceAlpha"
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha"
                  />
                  <feOffset />
                  <feGaussianBlur stdDeviation="2" />
                  <feComposite in2="hardAlpha" operator="out" />
                  <feColorMatrix
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                  />
                  <feBlend
                    mode="normal"
                    in2="BackgroundImageFix"
                    result="effect1_dropShadow_1943_230"
                  />
                  <feBlend
                    mode="normal"
                    in="SourceGraphic"
                    in2="effect1_dropShadow_1943_230"
                    result="shape"
                  />
                </filter>
                <filter
                  id="filter1_d_1943_230"
                  x="22"
                  y="0"
                  width="25"
                  height="58"
                  filterUnits="userSpaceOnUse"
                  colorInterpolationFilters="sRGB"
                >
                  <feFlood floodOpacity="0" result="BackgroundImageFix" />
                  <feColorMatrix
                    in="SourceAlpha"
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha"
                  />
                  <feOffset />
                  <feGaussianBlur stdDeviation="2" />
                  <feComposite in2="hardAlpha" operator="out" />
                  <feColorMatrix
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                  />
                  <feBlend
                    mode="normal"
                    in2="BackgroundImageFix"
                    result="effect1_dropShadow_1943_230"
                  />
                  <feBlend
                    mode="normal"
                    in="SourceGraphic"
                    in2="effect1_dropShadow_1943_230"
                    result="shape"
                  />
                </filter>
                <linearGradient
                  id="paint0_linear_1943_230"
                  x1="15.5"
                  y1="4"
                  x2="15.5"
                  y2="54"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#282828" />
                  <stop offset="0.35" stopColor="#363636" />
                  <stop offset="0.5" stopColor="#393939" />
                  <stop offset="0.65" stopColor="#363636" />
                  <stop offset="1" stopColor="#282828" />
                </linearGradient>
                <linearGradient
                  id="paint1_linear_1943_230"
                  x1="34.5"
                  y1="4"
                  x2="34.5"
                  y2="54"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#282828" />
                  <stop offset="0.35" stopColor="#363636" />
                  <stop offset="0.5" stopColor="#393939" />
                  <stop offset="0.65" stopColor="#363636" />
                  <stop offset="1" stopColor="#282828" />
                </linearGradient>
              </defs>
            </svg>
          ) : (
            <svg
              width={size}
              viewBox="0 0 50 212"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="2"
                y="2"
                width="46"
                height="196"
                rx="2"
                fill="#353535"
                stroke="#595959"
                strokeWidth="4"
              />
              <rect
                x="14"
                y="100"
                width="22"
                height="95"
                rx="11"
                fill="#0C0C0C"
              />
              <g filter="url(#filter0_d_1943_234)">
                <rect
                  x="7"
                  y="158"
                  width="17"
                  height="50"
                  rx="4"
                  fill="url(#paint0_linear_1943_234)"
                />
              </g>
              <g filter="url(#filter1_d_1943_234)">
                <rect
                  x="26"
                  y="158"
                  width="17"
                  height="50"
                  rx="4"
                  fill="url(#paint1_linear_1943_234)"
                />
              </g>
              <defs>
                <filter
                  id="filter0_d_1943_234"
                  x="3"
                  y="154"
                  width="25"
                  height="58"
                  filterUnits="userSpaceOnUse"
                  colorInterpolationFilters="sRGB"
                >
                  <feFlood floodOpacity="0" result="BackgroundImageFix" />
                  <feColorMatrix
                    in="SourceAlpha"
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha"
                  />
                  <feOffset />
                  <feGaussianBlur stdDeviation="2" />
                  <feComposite in2="hardAlpha" operator="out" />
                  <feColorMatrix
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                  />
                  <feBlend
                    mode="normal"
                    in2="BackgroundImageFix"
                    result="effect1_dropShadow_1943_234"
                  />
                  <feBlend
                    mode="normal"
                    in="SourceGraphic"
                    in2="effect1_dropShadow_1943_234"
                    result="shape"
                  />
                </filter>
                <filter
                  id="filter1_d_1943_234"
                  x="22"
                  y="154"
                  width="25"
                  height="58"
                  filterUnits="userSpaceOnUse"
                  colorInterpolationFilters="sRGB"
                >
                  <feFlood floodOpacity="0" result="BackgroundImageFix" />
                  <feColorMatrix
                    in="SourceAlpha"
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha"
                  />
                  <feOffset />
                  <feGaussianBlur stdDeviation="2" />
                  <feComposite in2="hardAlpha" operator="out" />
                  <feColorMatrix
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                  />
                  <feBlend
                    mode="normal"
                    in2="BackgroundImageFix"
                    result="effect1_dropShadow_1943_234"
                  />
                  <feBlend
                    mode="normal"
                    in="SourceGraphic"
                    in2="effect1_dropShadow_1943_234"
                    result="shape"
                  />
                </filter>
                <linearGradient
                  id="paint0_linear_1943_234"
                  x1="15.5"
                  y1="158"
                  x2="15.5"
                  y2="208"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#282828" />
                  <stop offset="0.35" stopColor="#363636" />
                  <stop offset="0.5" stopColor="#393939" />
                  <stop offset="0.65" stopColor="#363636" />
                  <stop offset="1" stopColor="#282828" />
                </linearGradient>
                <linearGradient
                  id="paint1_linear_1943_234"
                  x1="34.5"
                  y1="158"
                  x2="34.5"
                  y2="208"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#282828" />
                  <stop offset="0.35" stopColor="#363636" />
                  <stop offset="0.5" stopColor="#393939" />
                  <stop offset="0.65" stopColor="#363636" />
                  <stop offset="1" stopColor="#282828" />
                </linearGradient>
              </defs>
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
