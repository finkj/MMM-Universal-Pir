# **MMM-Universal-Pir**

A module for **MagicMirror²** using a PIR Sensor for disabling/enabling Screen Output.

You can put your own commands in `config.js` for controlling the sensor and the screen, here an example:

```js
  {
    module: "MMM-Universal-Pir",
    position: "top_right",
    config: {
      gpioCommand: "gpiomon -r -b gpiochip0 23",
      onCommand: "wlr-randr --output HDMI-A-1 --on",
      offCommand: "wlr-randr --output HDMI-A-1 --off",
      deactivateDelay: 60 * 1000,
    }
  },
```

- `gpioCommand` uses `gpiomon` (which should be installed on a pi) and the sensor is connected on pin 23
- `onCommand` uses `wlr-randr`
- `offCommand` uses `wlr-randr`
