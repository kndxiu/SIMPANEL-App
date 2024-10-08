import KnobA from "./Controls/Knobs/KnobA";
import KnobB from "./Controls/Knobs/KnobB";
import KnobC from "./Controls/Knobs/KnobC";
import SliderA from "./Controls/Sliders/SliderA";
import SliderB from "./Controls/Sliders/SliderB";
import SwitchA from "./Controls/Switches/SwitchA";
import SwitchB from "./Controls/Switches/SwitchB";
import SwitchC from "./Controls/Switches/SwitchC";
import SwitchD from "./Controls/Switches/SwitchD";
import SwitchE from "./Controls/Switches/SwitchE";
import SwitchG from "./Controls/Switches/SwitchG";
import SwitchH from "./Controls/Switches/SwitchH";

const switches = {
  "sw-a": SwitchA,
  "sw-b": SwitchB,
  "sw-c": SwitchC,
  "sw-d": SwitchD,
  "sw-e": SwitchE,
  "sw-g": SwitchG,
  "sw-h": SwitchH,
};

const sliders = {
  "sl-a": SliderA,
  "sl-b": SliderB,
};

const knobs = {
  "kn-a": KnobA,
  "kn-b": KnobB,
  "kn-c": KnobC,
};

const ControlList = {
  ...switches,
  ...sliders,
  ...knobs,
};

export default ControlList;
