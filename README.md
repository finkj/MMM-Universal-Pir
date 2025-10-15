# **MMM-Universal-Pir**

A module for **MagicMirror²** using a PIR Sensor for disabling/enabling Screen Output.

## Installation

Assuming `~/MagicMirror` is the directory where you installed MagicMirror².

### Clone and install

```bash
cd ~/MagicMirror/modules
git clone https://gitlab.com/khassel/MMM-Universal-Pir.git
```

### Update your config.js file

You can put your own commands in `config.js` for controlling the sensor and the screen, here an example:

```js
  {
    module: "MMM-Universal-Pir",
    position: "top_right",
    config: {
      gpioCommand: "gpiomon -e rising -c 0 23",
      onCommand: "wlr-randr --output HDMI-A-1 --on",
      offCommand: "wlr-randr --output HDMI-A-1 --off",
      deactivateDelay: 60 * 1000,
    }
  },
```

> ⚠️ `gpiomon` exists in several versions, the above example `gpiomon -e rising -c 0 23` must be used in newer versions v2 of `gpiomon` which is installed on debian `trixie`. Older systems are using `gpiomon` v1, this version is installed on debian `bookworm`. Here you have to use the old syntax `gpiomon -r -b gpiochip0 23`. You can check your version with `gpiomon -v`.


- `gpioCommand` uses `gpiomon` (which should be installed on a pi) and the sensor is connected on pin 23
- `onCommand` uses `wlr-randr`
- `offCommand` uses `wlr-randr`

The above commands are defaults and they maybe not work out of the box in your setup.
[Harm](https://gitlab.com/htilburgs) provided his commands tested on a current Raspberry Pi OS
(here the additional env variable `WAYLAND_DISPLAY` is needed):

```js
onCommand: "WAYLAND_DISPLAY='wayland-1' wlr-randr --output HDMI-A-1 --on",
offCommand: "WAYLAND_DISPLAY='wayland-1' wlr-randr --output HDMI-A-1 --off",
```

Another example with screen rotation:

```js
onCommand: "WAYLAND_DISPLAY='wayland-1' wlr-randr --output HDMI-A-1 --on --transform 270 --mode='1920x1080'"
```

## Updating the module

Assuming `~/MagicMirror` is the directory where you installed MagicMirror².

```bash
cd ~/MagicMirror/modules/MMM-Universal-Pir
git pull
```

## Troubleshooting

Please test the used commands first outside of MagicMirror². If they not work from a terminal it makes no sense to use them inside this module.

So the `offCommand` should disable the screen and the `onCommand` should enable it again.

The `gpioCommand` should wait for events and produce some output if the PIR sensor is touched.

## Container setup

If you see an error message on the screen `gpioCommand exited with error!` you should examine the container logs. If you see a `permission denied` error message like

```bash
[ERROR] stderr: gpiomon: error waiting for events: Permission denied
```

the container maybe lacks the gpio group. You can find the gpio group on the host by executing `cat /etc/group | grep gpio`. Add the number found in the output (here 986) to your `compose.yaml` in a `group_add` section:

```yaml
services:
  magicmirror:
    container_name: mm
    ...
    group_add:
      - 986
```

You must restart the container for the changes to take effect.