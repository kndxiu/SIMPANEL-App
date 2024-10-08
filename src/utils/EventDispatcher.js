class SimEventDispatcher extends EventTarget {
  constructor(config) {
    super();
    this.config = config;
    this.previousSimVars = {};
  }

  checkEvents(simVars) {
    this.config.events.forEach((event) => {
      const { simvars, action } = event;

      const allConditionsMet = simvars.every((simvar) => {
        const { name, condition, value } = simvar;
        const currentVal = simVars[name];
        const prevVal = this.previousSimVars[name] || null;

        const conditionMetPreviously =
          prevVal !== null
            ? this.evaluateCondition(prevVal, condition, value)
            : false;
        const conditionMetCurrently = this.evaluateCondition(
          currentVal,
          condition,
          value
        );

        return !conditionMetPreviously && conditionMetCurrently;
      });

      if (allConditionsMet) {
        this.dispatchEvent(
          new CustomEvent(action.name, { detail: { simvars, action } })
        );
      }
    });

    this.previousSimVars = { ...simVars };
  }

  evaluateCondition(currentVal, condition, value) {
    switch (condition) {
      case ">":
        return currentVal > value;
      case "<":
        return currentVal < value;
      case "=":
        return currentVal === value;
      default:
        return false;
    }
  }
}

export default EventDispatcher;
