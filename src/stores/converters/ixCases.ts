import type { NotificationCase } from '@/types'

/**
 * Получить индексированный список типов уведомлений
 * @param cases список типов уведомлений
 */
const getIxCases = (cases: NotificationCase[]) => {
  const ixCases: Record<string, NotificationCase> = {}

  cases.forEach((caseItem) => {
    ixCases[caseItem.id] = caseItem
  })

  return ixCases
}

export { getIxCases }
