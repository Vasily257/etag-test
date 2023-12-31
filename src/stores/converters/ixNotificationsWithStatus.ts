import type { Notification, NotificationWithStatus } from '@/types'

/**
 * Получить индексированный список уведомлений, расширенных статусом прочтения
 * @param items список уведомлений
 */
const getIxNotificationsWithStatus = (items: Notification[]) => {
  const ixItemsWithStatus: Record<string, NotificationWithStatus> = {}

  const itemsWithStatus = items.map((item) => ({ ...item, isRead: false }))

  itemsWithStatus.forEach((item) => {
    ixItemsWithStatus[item.id] = item
  })

  return ixItemsWithStatus
}

export { getIxNotificationsWithStatus }
