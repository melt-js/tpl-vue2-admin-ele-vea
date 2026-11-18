/**
 * Cross-browser helpers for the Fullscreen API.
 *
 * The standard API is used first, then the WebKit / Mozilla / Trident
 * prefixed variants, so the screenfull button keeps working in older
 * Safari / Edge (Legacy) builds.
 */

const REQUEST_METHODS = [
  'requestFullscreen',
  'webkitRequestFullscreen',
  'webkitRequestFullScreen',
  'mozRequestFullScreen',
  'msRequestFullscreen'
]

const EXIT_METHODS = [
  'exitFullscreen',
  'webkitExitFullscreen',
  'webkitCancelFullScreen',
  'mozCancelFullScreen',
  'msExitFullscreen'
]

const FULLSCREEN_ELEMENT_KEYS = [
  'fullscreenElement',
  'webkitFullscreenElement',
  'mozFullScreenElement',
  'msFullscreenElement'
]

const FULLSCREEN_ENABLED_KEYS = [
  'fullscreenEnabled',
  'webkitFullscreenEnabled',
  'mozFullScreenEnabled',
  'msFullscreenEnabled'
]

function findMethod(target, methods) {
  return methods.find(method => target && typeof target[method] === 'function')
}

/**
 * Whether the current browser (and browsing context) allows fullscreen.
 * `fullscreenEnabled` is `false` inside an iframe without `allowfullscreen`.
 *
 * @returns {boolean}
 */
export function isFullscreenSupported() {
  if (typeof document === 'undefined') return false

  const enabledKey = FULLSCREEN_ENABLED_KEYS.find(key => document[key] !== undefined)
  if (enabledKey) return !!document[enabledKey]

  // Very old implementations expose the methods without the enabled flag.
  return !!findMethod(document.documentElement, REQUEST_METHODS)
}

/**
 * The element currently displayed in fullscreen, if any.
 *
 * @returns {Element|null}
 */
export function getFullscreenElement() {
  if (typeof document === 'undefined') return null

  const key = FULLSCREEN_ELEMENT_KEYS.find(name => !!document[name])
  return key ? document[key] : null
}

/**
 * Request fullscreen for an element.
 *
 * @param {Element} element
 * @returns {Promise<void>}
 */
export function requestFullscreen(element) {
  if (!element || element.nodeType !== 1) {
    return Promise.reject(new Error('[Screenfull] A valid target element is required'))
  }

  const method = findMethod(element, REQUEST_METHODS)
  if (!method) {
    return Promise.reject(new Error('[Screenfull] The Fullscreen API is not supported'))
  }

  try {
    const result = element[method]()
    return result && typeof result.then === 'function' ? result : Promise.resolve()
  } catch (error) {
    return Promise.reject(error)
  }
}

/**
 * Leave fullscreen mode.
 *
 * @returns {Promise<void>}
 */
export function exitFullscreen() {
  if (typeof document === 'undefined') {
    return Promise.reject(new Error('[Screenfull] The Fullscreen API is not supported'))
  }

  const method = findMethod(document, EXIT_METHODS)
  if (!method) {
    return Promise.reject(new Error('[Screenfull] The Fullscreen API is not supported'))
  }

  try {
    const result = document[method]()
    return result && typeof result.then === 'function' ? result : Promise.resolve()
  } catch (error) {
    return Promise.reject(error)
  }
}

/**
 * Events fired by the different browser implementations.
 *
 * @type {string[]}
 */
export const FULLSCREEN_CHANGE_EVENTS = [
  'fullscreenchange',
  'webkitfullscreenchange',
  'mozfullscreenchange',
  'MSFullscreenChange'
]
