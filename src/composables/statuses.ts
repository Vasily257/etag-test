import type { NotificationWithStatus, IxNotificationStatuses } from '@/types'

/** Хук для управления статусами уведомлений */
export function useNotificationStatuses() {
  /** Ключ статусов уведомлений в локальном хранилище */
  const NOTIFICATION_STATUSES_KEY = 'notificationStatuses'

  /**
   * Установить начальные статусы прочтения в localStorage
   * @param items уведомления
   */
  const setInitialStatuses = (items: NotificationWithStatus[]) => {
    const ixStatuses: IxNotificationStatuses = {}

    const savedStatuses = localStorage.getItem(NOTIFICATION_STATUSES_KEY)

    if (!savedStatuses) {
      items.forEach((item) => {
        ixStatuses[item.id] = '0'
      })

      localStorage.setItem(NOTIFICATION_STATUSES_KEY, JSON.stringify(ixStatuses))
    }
  }

  /**
   * Установить статус уведомления в localStorage
   * @param itemId id уведомления
   */
  const setStatus = (
    itemId: NotificationWithStatus['id'],
    status: NotificationWithStatus['isRead']
  ) => {
    const convertedStatus = status ? '1' : '0'

    const savedStatuses = localStorage.getItem(NOTIFICATION_STATUSES_KEY)

    if (savedStatuses) {
      const ixStatuses: IxNotificationStatuses = JSON.parse(savedStatuses)

      localStorage.setItem(
        NOTIFICATION_STATUSES_KEY,
        JSON.stringify({ ...ixStatuses, [itemId]: convertedStatus })
      )
    }
  }

  /**
   * Получить статус уведомления из localStorage
   * @param itemId id уведомления
   */
  const getStatus = (itemId: NotificationWithStatus['id']) => {
    let status = false

    const savedStatuses = localStorage.getItem(NOTIFICATION_STATUSES_KEY)

    if (savedStatuses) {
      const ixStatuses: IxNotificationStatuses = JSON.parse(savedStatuses)

      if (ixStatuses[itemId] === '1') {
        status = true
      }
    }

    return status
  }

  return { setInitialStatuses, setStatus, getStatus }
}
