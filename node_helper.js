// Magic Mirror Module MMM-PIR-Fedora

const NodeHelper = require("node_helper");
const spawn = require("child_process").spawn;
const exec = require("child_process").exec;

module.exports = NodeHelper.create({
  start() {
    this.started = false;
    this.activated = true;
    this.errored = false;
  },

  getDataPIR() {
    const prc = spawn("sh", [
      "-c",
      `sudo gpiomon -r -b gpiochip0 ${this.config.sensorPin}`,
    ]);

    this.sendSocketNotification("STARTED", true);
    this.started = true;

    prc.stderr.on("data", (data) => {
      console.error(`stderr: ${data}`);
    });

    prc.on("close", (code) => {
      console.log(`child process exited with code ${code}`);
    });

    prc.stdout.on("data", (data) => {
      this.sendSocketNotification("USER_PRESENCE", true);
      this.resetTimeout();
      if (this.activated == false) {
        this.activateMonitor();
      }
    });
  },

  activateMonitor() {
    if (this.errored) return;
    this.sendSocketNotification("POWER_ON", true);
    this.activated = true;

    exec(
      "xrandr --output " +
        this.config.hdmiPort +
        " --rotate " +
        this.config.rotation +
        " --auto",
      null
    );
  },
  // xrandr --output HDMI-1 --rotate normal --auto

  deactivateMonitor() {
    if (this.errored) return;
    this.sendSocketNotification("POWER_OFF", true);
    this.activated = false;

    exec("xrandr --output " + this.config.hdmiPort + " --off", null);
  },
  // xrandr --output HDMI-1 --off

  resetTimeout() {
    clearTimeout(this.timeout);

    this.timeout = setTimeout(() => {
      this.deactivateMonitor();
    }, this.config.deactivateDelay);
  },

  socketNotificationReceived(notification, payload) {
    if (notification === "CONFIG" && this.started == false) {
      this.config = payload;
      this.activateMonitor();

      this.getDataPIR();
      this.resetTimeout();
    } else if (notification === "ERROR") {
      this.errored = true;
    } else if (notification === "NOERROR") {
      this.errored = false;
    }
  },
});
