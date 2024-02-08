import { mount, VueWrapper } from '@vue/test-utils'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import { createTestingPinia } from '@pinia/testing'
import { useNotificationsStore } from '@/stores/modules/notifications'

import TheHeader from '../TheHeader.vue'

let wrapper: VueWrapper

describe('TheHeader.vue', () => {
  beforeEach(async () => {
    wrapper = mount(TheHeader, {
      global: {
        plugins: [
          createTestingPinia({
            fakeApp: true,
            createSpy: vi.fn
          })
        ]
      }
    })

    await wrapper.vm.$nextTick()
  })

  test('h1 renders properly', () => {
    expect(wrapper.find('h1').exists()).toBe(true)
  })

  test('h1 contains text', () => {
    expect(wrapper.find('h1').text()).toBeTruthy()
  })

  test('description does not render initially', async () => {
    expect(wrapper.find('.header__description').exists()).toBe(false)
  })

  test('notification count displays correctly in the description', async () => {
    const store = useNotificationsStore()

    const mockNotificationsIndexedByID = {
      '0': { id: 0, case: 0, cat: 'test', isRead: false },
      '1': { id: 1, case: 0, cat: 'test', isRead: false },
      '2': { id: 2, case: 0, cat: 'test', isRead: false },
      '3': { id: 3, case: 0, cat: 'test', isRead: false }
    }

    const verificationText = `Показано ${
      Object.keys(mockNotificationsIndexedByID).length
    } изменения`

    // Добавить мок-данные
    store.$patch({ notificationsByID: mockNotificationsIndexedByID })

    // Запустить перерендер
    await wrapper.vm.$nextTick()

    // Проверить, что корректно количество уведомлений отображается 
    expect(wrapper.find('.header__description').text()).toEqual(
      verificationText
    )
  })
})
