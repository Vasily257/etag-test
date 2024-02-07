import { describe, expect, test } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseButton from '../BaseButton.vue'

describe('BaseButton.vue', () => {
  test('should render default slot', () => {
    const wrapper = mount(BaseButton, {
      slots: {
        default: 'Custom text'
      }
    })

    expect(wrapper.html()).toContain('Custom text')
  })

  test('matches snapshot', () => {
    const wrapper = mount(BaseButton)

    expect(wrapper.html()).toMatchSnapshot()
  })
})
