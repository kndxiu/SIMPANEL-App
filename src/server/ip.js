import os from "os";

class IP {
  constructor(ip) {
    this.ip = ip;
  }

  static getLocalIp() {
    const interfaces = os.networkInterfaces();
    let localIp = "";

    for (const iface in interfaces) {
      for (const alias of interfaces[iface]) {
        if (alias.family === "IPv4" && !alias.internal) {
          localIp = alias.address;
        }
      }
    }

    if (!localIp) {
      throw new Error("Local IP address not found.");
    }

    return localIp;
  }

  static encode(ip) {
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
  }

  static decode(shortCode) {
    if (!/^[+-]?[0-9A-Z]{6}$/.test(shortCode)) {
      throw new Error("Invalid short code format.");
    }

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
  }

  toEncoded() {
    return IP.encode(this.ip);
  }

  toDecoded() {
    return IP.decode(this.toEncoded());
  }
}

export default IP;
