# ng-interactivebuttons
Directives for different kinds of buttons

## Preparation
- compass(for sass)
- nodejs/npm

## How to 
1. npm install && bower install
2. grunt serve (will run a server and watch on changes)

## Guide
- needed files:
  -  require js files in `src/`
  -  src/interacticebutton.html
  -  src/\_interactivebutton.scss
  main.scss only shows how to import scss files

- setup controller, see `src/ctrl.js` for example
  - behavior callbacks: functions which handle behavior,
    assign them at view, functions should fire these events:
      - LOADING
      - DONE
      - FAILED

- setup controller level view, depend on which button behavior
  see index.html for reference
  * default
  ```<default-button
    name="default"
    normal-text="Normal Status"
    loading-text="&nbsp;"
    error-text="Error Status"
    on-click="onDefaultClick(name)" 
  ></default-button>
  ```

  * disable
  ```<disable-button
    name="disable"
    normal-text="Normal Status"
    loading-text="&nbsp;"
    disable-text="Disable Status"
    error-text="Error Status"
    is-disable=false
    on-click="onDisableClick(name, isDisable)" 
  ></disable-button>
  ```

  * toggle
  ```<toggle-button
    name="toggle"
    normal-text="On Status"
    loading-text="&nbsp;"
    off-text="Off Status"
    error-text="Error Status"
    is-off=false
    on-click="onToggleClick(name, isOn)" 
  ></toggle-button>
  ```
