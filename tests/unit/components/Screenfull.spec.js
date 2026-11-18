import { shallowMount } from '@vue/test-utils'
import Screenfull from '@/components/Screenfull/index.vue'

const tooltipStub = {
  template: '<div class="tooltip-stub"><slot /></div>'
}

function flushPromises() {
  return new Promise(resolve => setTimeout(resolve, 0))
}

function setFullscreenElement(element) {
  Object.defineProperty(document, 'fullscreenElement', {
    configurable: true,
    writable: true,
    value: element
  })
}

function mountScreenfull(options = {}) {
  return shallowMount(Screenfull, {
    stubs: { 'el-tooltip': tooltipStub },
    mocks: {
      $message: { warning: jest.fn() }
    },
    ...options
  })
}

describe('Screenfull.vue', () => {
  beforeEach(() => {
    Object.defineProperty(document, 'fullscreenEnabled', {
      configurable: true,
      writable: true,
      value: true
    })
    document.documentElement.requestFullscreen = jest.fn(() => {
      setFullscreenElement(document.documentElement)
      document.dispatchEvent(new Event('fullscreenchange'))
      return Promise.resolve()
    })
    document.exitFullscreen = jest.fn(() => {
      setFullscreenElement(null)
      document.dispatchEvent(new Event('fullscreenchange'))
      return Promise.resolve()
    })
  })

  afterEach(() => {
    delete document.fullscreenEnabled
    delete document.fullscreenElement
    delete document.documentElement.requestFullscreen
    delete document.exitFullscreen
  })

  it('enters and exits fullscreen when clicked', async() => {
    const wrapper = mountScreenfull()
    const button = wrapper.find('button')

    expect(button.attributes('aria-pressed')).toBe('false')

    button.trigger('click')
    await flushPromises()

    expect(document.documentElement.requestFullscreen).toHaveBeenCalledTimes(1)
    expect(wrapper.vm.isFullscreen).toBe(true)
    expect(wrapper.find('button').classes()).toContain('is-fullscreen')
    expect(wrapper.find('button').attributes('aria-pressed')).toBe('true')
    expect(wrapper.emitted('change')[0]).toEqual([true])

    wrapper.find('button').trigger('click')
    await flushPromises()

    expect(document.exitFullscreen).toHaveBeenCalledTimes(1)
    expect(wrapper.vm.isFullscreen).toBe(false)
    expect(wrapper.find('button').classes()).not.toContain('is-fullscreen')
    expect(wrapper.emitted('change')[1]).toEqual([false])

    wrapper.destroy()
  })

  it('can fullscreen a specific page element', async() => {
    const target = document.createElement('div')
    target.id = 'fullscreen-target'
    target.requestFullscreen = jest.fn(() => Promise.resolve())
    document.body.appendChild(target)

    const wrapper = mountScreenfull({
      propsData: { target: '#fullscreen-target' }
    })

    wrapper.find('button').trigger('click')
    await flushPromises()

    expect(target.requestFullscreen).toHaveBeenCalledTimes(1)

    wrapper.destroy()
    target.remove()
  })

  it('shows a warning when fullscreen is not supported', async() => {
    delete document.fullscreenEnabled
    delete document.documentElement.requestFullscreen

    const warning = jest.fn()
    const $message = { warning }
    const wrapper = mountScreenfull({
      mocks: { $message }
    })

    wrapper.find('button').trigger('click')
    await flushPromises()

    expect(wrapper.vm.isSupported).toBe(false)
    expect(warning).toHaveBeenCalledWith('Fullscreen is not supported by this browser')
    expect(wrapper.emitted('error')[0]).toEqual(['Fullscreen is not supported by this browser'])

    wrapper.destroy()
  })
})
