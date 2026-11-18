import {
  exitFullscreen,
  getFullscreenElement,
  isFullscreenSupported,
  requestFullscreen
} from '@/utils/fullscreen'

function define(target, name, value) {
  Object.defineProperty(target, name, {
    configurable: true,
    writable: true,
    value
  })
}

describe('fullscreen utils', () => {
  afterEach(() => {
    delete document.fullscreenEnabled
    delete document.webkitFullscreenEnabled
    delete document.fullscreenElement
    delete document.webkitFullscreenElement
    delete document.documentElement.requestFullscreen
    delete document.documentElement.webkitRequestFullscreen
    delete document.exitFullscreen
    delete document.webkitExitFullscreen
  })

  it('detects support from the standard or prefixed flag', () => {
    expect(isFullscreenSupported()).toBe(false)

    define(document, 'fullscreenEnabled', true)
    expect(isFullscreenSupported()).toBe(true)

    delete document.fullscreenEnabled
    define(document, 'webkitFullscreenEnabled', true)
    expect(isFullscreenSupported()).toBe(true)
  })

  it('falls back to the request method when no enabled flag exists', () => {
    define(document.documentElement, 'requestFullscreen', jest.fn())

    expect(isFullscreenSupported()).toBe(true)
  })

  it('returns the active fullscreen element across prefixes', () => {
    expect(getFullscreenElement()).toBe(null)

    define(document, 'webkitFullscreenElement', document.body)
    expect(getFullscreenElement()).toBe(document.body)

    define(document, 'fullscreenElement', document.documentElement)
    expect(getFullscreenElement()).toBe(document.documentElement)
  })

  it('requests fullscreen with the standard API', async() => {
    const element = document.createElement('div')
    const request = jest.fn(() => Promise.resolve())
    define(element, 'requestFullscreen', request)

    await expect(requestFullscreen(element)).resolves.toBeUndefined()
    expect(request).toHaveBeenCalledTimes(1)
  })

  it('requests fullscreen with a prefixed API when needed', async() => {
    const element = document.createElement('div')
    const request = jest.fn()
    define(element, 'webkitRequestFullscreen', request)

    await expect(requestFullscreen(element)).resolves.toBeUndefined()
    expect(request).toHaveBeenCalledTimes(1)
  })

  it('rejects when the target cannot enter fullscreen', async() => {
    await expect(requestFullscreen(document.createElement('div'))).rejects.toThrow('not supported')
    await expect(requestFullscreen(null)).rejects.toThrow('valid target element')
  })

  it('exits fullscreen with the standard or prefixed API', async() => {
    const exit = jest.fn(() => Promise.resolve())
    define(document, 'exitFullscreen', exit)
    await exitFullscreen()
    expect(exit).toHaveBeenCalledTimes(1)

    delete document.exitFullscreen
    const webkitExit = jest.fn()
    define(document, 'webkitExitFullscreen', webkitExit)
    await exitFullscreen()
    expect(webkitExit).toHaveBeenCalledTimes(1)
  })
})
