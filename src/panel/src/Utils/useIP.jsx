import { useState, useEffect } from "react";

const useIP = (encodedIp) => {
  const [decodedIp, setDecodedIp] = useState("");

  useEffect(() => {
    const decode = (shortCode) => {
      const isNegative = shortCode.startsWith("-");
      const base36Code = isNegative ? shortCode.slice(1) : shortCode;

      const number = parseInt(base36Code, 36);
      const finalNumber = isNegative ? -number : number;

      return [
        (finalNumber >>> 24) & 0xff,
        (finalNumber >>> 16) & 0xff,
        (finalNumber >>> 8) & 0xff,
        finalNumber & 0xff,
      ].join(".");
    };

    const decoded = decode(encodedIp);
    setDecodedIp(decoded);
  }, [encodedIp]);

  const encode = (ip) => {
    if (!/^(\d{1,3}\.){3}\d{1,3}$/.test(ip)) {
      throw new Error("Invalid IP address format.");
    }

    const octets = ip.split(".").map(Number);
    let number = 0;

    for (let i = 0; i < 4; i++) {
      number = (number << 8) + octets[i];
    }

    if (number < 0) {
      return "-" + Math.abs(number).toString(36).toUpperCase().padStart(6, "0");
    }

    return number.toString(36).toUpperCase().padStart(6, "0");
  };

  return { decodedIp, encode };
};

export default useIP;
