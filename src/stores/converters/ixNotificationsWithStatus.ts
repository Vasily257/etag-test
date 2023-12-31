import type { Notification, NotificationWithStatus } from '@/types'
import { useNotificationStatuses } from '@/composables/statuses'

const { getStatus } = useNotificationStatuses()

/**
 * Получить индексированный список уведомлений, расширенных статусом прочтения
 * @param items список уведомлений
 */
const getIxNotificationsWithStatus = (items: Notification[]) => {
  const ixItemsWithStatus: Record<string, NotificationWithStatus> = {}

  const itemsWithStatus = items.map((item) => ({ ...item, isRead: getStatus(item.id) }))

  itemsWithStatus.forEach((item) => {
    ixItemsWithStatus[item.id] = item
  })

  return ixItemsWithStatus
}

export { getIxNotificationsWithStatus }
