import { useState, useEffect, useRef } from "react";
import useFavicon from "./Utils/useFavicon";
import useIP from "./Utils/useIP";
import ControlList from "./ControlList";

export default function ControlPanel() {
  useFavicon();

  const [isStarted, setIsStarted] = useState(false);
  const [ws, setWs] = useState(null);
  const [isLocked, setIsLocked] = useState(false);
  const [lastMessage, setLastMessage] = useState(null);
  const [config, setConfig] = useState("");
  const timeoutRef = useRef(null);

  const [controlStates, setControlStates] = useState({});

  const handleSendSimevent = (simeventId, simeventValue = null) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      const message = {
        type: "client",
        simevent: simeventId,
        value: parseInt(simeventValue) || null,
      };
      ws.send(JSON.stringify(message));
    }
  };

  const handleSendSimvar = (simvarName, simvarValue) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      const message = {
        type: "client",
        simvar: simvarName,
        value: parseInt(simvarValue),
      };
      ws.send(JSON.stringify(message));
    }
  };

  const lockUpdates = (duration) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setIsLocked(true);
    timeoutRef.current = setTimeout(() => {
      setIsLocked(false);
    }, duration);
  };

  const updateControlState = (
    simvar,
    newState,
    simevent,
    novalue = false,
    multiplyFactor = 1
  ) => {
    lockUpdates(500);
    setControlStates((prevStates) => ({
      ...prevStates,
      [simvar]: newState,
    }));

    if (ws) {
      if (simevent) {
        if (!novalue) handleSendSimevent(simevent, newState * multiplyFactor);
        else handleSendSimevent(simevent);
      } else handleSendSimvar(simvar, newState * multiplyFactor);
    }
  };

  const handleStart = () => {
    try {
      const socket = new WebSocket(`ws://${window.location.hostname}:8056`);

      socket.onopen = () => {
        console.log("Connected to WebSocket server");
        setIsStarted(true);
        setWs(socket);
      };

      socket.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      socket.onmessage = (message) => {
        const msg = JSON.parse(JSON.parse(message.data));
        setLastMessage(msg);
      };

      socket.onclose = () => {
        console.log("WebSocket connection closed");
        setIsStarted(false);
      };
    } catch (error) {
      console.error("Error connecting to WebSocket:", error);
    }

    setIsStarted(true);
  };

  useEffect(() => {
    if (lastMessage && lastMessage.type === "aircraft" && !isLocked) {
      Object.entries(lastMessage.data).forEach(([simvar, value]) => {
        setControlStates((prevStates) => ({
          ...prevStates,
          [simvar.replaceAll("_", " ")]: value,
        }));
      });
    }
    if (lastMessage && lastMessage.type === "cfg") {
      setConfig(lastMessage.data);
    }
  }, [lastMessage, isLocked]);

  useEffect(() => {
    if (config) {
      const initialStates = {};
      config.panels.forEach((panel) => {
        panel.controls.forEach((control) => {
          if (control.simvar) initialStates[control.simvar] = 0;
        });
      });
      setControlStates(initialStates);
    }
  }, [config]);

  const { encode } = useIP(window.location.hostname);

  return (
    <div
      className="panel h-screen w-full bg-neutral-900 p-2 max-h-screen overflow-x-hidden"
      style={{
        backgroundColor: isStarted ? config.bg : null,
        overflowY: !isLocked ? "auto" : "hidden",
      }}
    >
      {!isStarted ? (
        <div className="h-full w-full flex justify-center items-center">
          <div className="flex flex-col gap-y-2">
            <h1 className="text-2xl text-neutral-200 font-semibold">
              Take control
            </h1>
            <div className="flex gap-x-2">
              <input
                type="text"
                value={encode(window.location.hostname)}
                readOnly
                placeholder="Enter room code"
                className="border p-2 border-neutral-700 bg-neutral-800 rounded outline-none text-neutral-50"
              />
              <span
                className="bg-sky-400 text-neutral-50 py-2 px-4 rounded cursor-pointer"
                onClick={handleStart}
              >
                Start
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex gap-2 flex-wrap relative">
          {config &&
            config.panels.map((panel, panelIndex) => (
              <fieldset
                key={panelIndex}
                className="w-fit h-fit border border-neutral-50/25 p-2"
              >
                <legend
                  className="text-neutral-200"
                  align="center"
                  style={{
                    fontSize: `${config.textSize * 1.25}px`,
                  }}
                >
                  {panel.name}
                </legend>
                <div
                  className="gap-2"
                  style={{
                    display: "grid",
                    gridTemplateColumns: `repeat(${panel.cols}, minmax(0, 1fr))`,
                  }}
                >
                  {panel.controls.map((control, controlIndex) => {
                    const ControlComponent = ControlList[control.type];

                    return (
                      <ControlComponent
                        key={controlIndex}
                        size={config.controlSize}
                        textSize={config.textSize}
                        state={controlStates[control.simvar]}
                        updateControlState={updateControlState}
                        {...control}
                      />
                    );
                  })}
                </div>
              </fieldset>
            ))}
        </div>
      )}
    </div>
  );
}
