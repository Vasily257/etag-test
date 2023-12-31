/** Коды уведомлений */
export enum CaseID {
  All = 0,
  NewCat = 1,
  Cleaned = 2,
  NewLocation = 3,
  NotFound = 4
}

/** Вариант уведомления */
export type NotificationCase = {
  id: CaseID
  name: string
  description: string
  code: string
}

/** Уведомление */
export type Notification = {
  id: number
  case: CaseID
  cat: string
}

/** Уведомление со статусом прочтения */
export type NotificationWithStatus = Notification & { isRead: boolean }

export type IxNotificationStatuses = Record<string, '0' | '1'>
