const { exec } = require("child_process");

class BluetoothService {
  run(command) {
    return new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          reject(stderr || error.message);
          return;
        }

        resolve(stdout.trim());
      });
    });
  }

  async getStatus() {
    const output = await this.run(`bluetoothctl show`);

    return {
      powered: output.includes("Powered: yes"),
      discoverable: output.includes("Discoverable: yes"),
      pairable: output.includes("Pairable: yes"),
    };
  }

  async makeDiscoverable() {
    const output = this.run(`bluetoothctl pairable on`)
      .then((res) => {
        console.log("Bluetooth pairable:", res);
        return this.run(`bluetoothctl discoverable on`);
      })
      .then((res) => {
        console.log("Bluetooth discoverable:", res);
        return this.run(`bluetoothctl agent on`);
      })
      .catch((err) => {
        console.error("Error making Bluetooth discoverable:", err);
        throw new Error("Failed to make Bluetooth discoverable");
      });

    return { discoverable: true };
  }

  async makeUndiscoverable() {
    await this.run(`bluetoothctl discoverable off`);
    return { discoverable: false };
  }

  async scan() {
    await this.run(`timeout 8 bluetoothctl scan on`);

    const output = await this.run(`bluetoothctl devices`);

    return output
      .split("\n")
      .filter(Boolean)
      .map((line) => {
        const match = line.match(/^Device\s([A-F0-9:]+)\s(.+)$/i);

        if (!match) return null;

        return {
          mac: match[1],
          name: match[2],
        };
      })
      .filter(Boolean);
  }

  async pairedDevices() {
    const output = await this.run(`bluetoothctl devices Paired`);

    return output
      .split("\n")
      .filter(Boolean)
      .map((line) => {
        const match = line.match(/^Device\s([A-F0-9:]+)\s(.+)$/i);

        if (!match) return null;

        return {
          mac: match[1],
          name: match[2],
        };
      })
      .filter(Boolean);
  }

  async connect(mac) {
    await this.run(`bluetoothctl trust ${mac}`);

    const result = await this.run(`bluetoothctl connect ${mac}`);

    return {
      success: result.includes("Connection successful"),
      result,
    };
  }

  async disconnect(mac) {
    const result = await this.run(`bluetoothctl disconnect ${mac}`);

    return {
      success: true,
      result,
    };
  }

  async connectedDevices() {
    const output = await this.run(`bluetoothctl devices Connected`);

    return output
      .split("\n")
      .filter(Boolean)
      .map((line) => {
        const match = line.match(/^Device\s([A-F0-9:]+)\s(.+)$/i);

        if (!match) return null;

        return {
          mac: match[1],
          name: match[2],
        };
      })
      .filter(Boolean);
  }
}

module.exports = new BluetoothService();
