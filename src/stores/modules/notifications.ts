import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { getNotificationCases, getNotificationItems } from '@/api'
import { getIxCases, getIxNotificationsWithStatus } from '../converters'
import { CaseID, type NotificationCase, type NotificationWithStatus } from '@/types'
import { useNotificationStatuses } from '@/composables/statuses'

import casesJSON from '../../../database/cases.json'
import listJSON from '../../../database/list.json'

const { setStatus } = useNotificationStatuses()

export const useNotificationsStore = defineStore('notifications', () => {
  /** Ключ фильтра в локальном хранилище */
  const FILTER_CASE_ID_KEY = 'filterCaseID'

  /** Фильтр, сохраненный в локальном хранилище */
  const savedFilterCaseID = Number(localStorage.getItem(FILTER_CASE_ID_KEY))

  /** Типы уведомлений, индексированные по id */
  const notificationCasesByID = ref<Record<string, NotificationCase>>({})

  /** Уведомления, индексированные по id  */
  const notificationsByID = ref<Record<string, NotificationWithStatus>>({})

  /** ID типа уведомления, выбранного в фильтре */
  const filterCaseID = ref(savedFilterCaseID || CaseID.All)

  /** Неиндексированные уведомления */
  const notifications = computed(() => Object.values(notificationsByID.value))

  /** Уведомления, отфильтрованные по типу */
  const notificationsFilteredByCase = computed(() => {
    let filteredItems: NotificationWithStatus[] = []

    if (filterCaseID.value === CaseID.All) {
      filteredItems = notifications.value
    } else {
      filteredItems = notifications.value.filter((item) => item.case === filterCaseID.value)
    }

    return filteredItems
  })

  /** Получить типы уведомлений с сервера */
  const loadNotificationCases = async () => {
    try {
      const { data } = await getNotificationCases()

      if (data?.length > 0) {
        notificationCasesByID.value = { ...getIxCases(data) }
      }
    } catch (error) {
      console.log(error)

      // На случай, если в браузере включен CORS
      notificationCasesByID.value = { ...getIxCases(casesJSON) }
    }
  }

  /** Получить список уведомлений с сервера */
  const loadNotifications = async () => {
    try {
      const { data } = await getNotificationItems()

      if (data?.length > 0) {
        notificationsByID.value = { ...getIxNotificationsWithStatus(data) }
      }
    } catch (error) {
      console.log(error)

      // На случай, если в браузере включен CORS
      notificationsByID.value = { ...getIxNotificationsWithStatus(listJSON) }
    }
  }

  /** Очистить список уведомлений */
  const clearNotifications = () => {
    notificationsByID.value = {}
  }

  /** Сохранить фильтр в локальном хранилище */
  const saveFilterCaseIDToLocalStorage = (caseID: CaseID) => {
    localStorage.setItem(FILTER_CASE_ID_KEY, String(caseID))
  }

  /** Обновить фильтр */
  const setFilterCaseID = (caseID: CaseID) => {
    filterCaseID.value = caseID

    saveFilterCaseIDToLocalStorage(caseID)
  }

  /** Переключить статус прочтения уведомления */
  const toggleNotificationReadStatus = (notificationID: NotificationWithStatus['id']) => {
    const newStatus = !notificationsByID.value[notificationID].isRead

    notificationsByID.value[notificationID].isRead = newStatus

    setStatus(notificationID, newStatus)
  }

  return {
    notificationCasesByID,
    notifications,
    filterCaseID,
    notificationsFilteredByCase,
    loadNotificationCases,
    loadNotifications,
    clearNotifications,
    setFilterCaseID,
    toggleNotificationReadStatus
  }
})
