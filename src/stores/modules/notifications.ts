import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { getNotificationCases, getNotificationItems } from '@/api'
import { getIxCases, getIxNotificationsWithStatus } from '../converters'
import { CaseID, type NotificationCase, type NotificationWithStatus } from '@/types'

import casesJSON from '../../../database/cases.json'
import listJSON from '../../../database/list.json'

export const useNotificationsStore = defineStore('notifications', () => {
  /** Типы уведомлений, индексированные по id */
  const ixCases = ref<Record<string, NotificationCase>>({})

  /** Уведомления, индексированные по id  */
  const ixItems = ref<Record<string, NotificationWithStatus>>({})

  /** ID типа уведомления, выбранного в фильтре */
  const filterCaseID = ref(CaseID.All)

  /** Неиндексированные типы уведомлений */
  const cases = computed(() => Object.values(ixCases.value))

  /** Уведомления, отфильтрованные по типу */
  const filteredItems = computed(() => {
    let filteredItems: NotificationWithStatus[] = []

    const items = Object.values(ixItems.value)

    if (filterCaseID.value === CaseID.All) {
      filteredItems = items
    } else {
      filteredItems = items.filter((item) => item.case === filterCaseID.value)
    }

    return filteredItems
  })

  /** Получить типы уведомлений с сервера */
  const fetchCases = async () => {
    try {
      const { data } = await getNotificationCases()

      if (data?.length > 0) {
        ixCases.value = { ...getIxCases(data) }
      }
    } catch (error) {
      console.log(error)

      // На случай, если в браузере включен CORS
      ixCases.value = { ...getIxCases(casesJSON) }
    }
  }

  /** Получить список уведомлений с сервера */
  const fetchItems = async () => {
    try {
      const { data } = await getNotificationItems()

      if (data?.length > 0) {
        ixItems.value = { ...getIxNotificationsWithStatus(data) }
      }
    } catch (error) {
      console.log(error)

      // На случай, если в браузере включен CORS
      ixItems.value = { ...getIxNotificationsWithStatus(listJSON) }
    }
  }

  /** Обновить фильтр */
  const updateFilter = (caseID: CaseID) => {
    filterCaseID.value = caseID
  }

  /** Переключить статус прочтения уведомления */
  const toggleNotificationStatus = (notificationID: NotificationWithStatus['id']) => {
    ixItems.value[notificationID].isRead = !ixItems.value[notificationID].isRead
  }

  return {
    cases,
    ixCases,
    ixItems,
    filterCaseID,
    filteredItems,
    fetchCases,
    fetchItems,
    updateFilter,
    toggleNotificationStatus
  }
})
