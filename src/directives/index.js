// src/directives/index.js
import focus from './focus'
import clickOutside from './click-outside'
import tooltip from './tooltip'

export function registerDirectives(app) {
    app.directive('focus', focus)
    app.directive('click-outside', clickOutside)
    app.directive('tooltip', tooltip)
}
