<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import NotificationsBar from './NotificationsBar.vue'
import NotificationsList from './NotificationsList.vue'
import { useNotificationsStore } from '@/stores/modules/notifications'
import { CaseID, type NotificationCase } from '@/types'

const store = useNotificationsStore()
const { cases, ixCases, filterCaseID, filteredItems } = storeToRefs(store)
const { fetchCases, fetchItems, updateFilter, toggleNotificationStatus } = store

/** Описания типов уведомлений */
const caseDescriptions = computed(() => {
  return cases.value.map((caseItem) => caseItem.description)
})

/** Обновить фильтр уведомлений */
const updateNotificationFilter = (caseDescription: NotificationCase['description']) => {
  const currentCase = cases.value.find((itemCase) => itemCase.description === caseDescription)

  updateFilter(currentCase?.id || 0)
}

/** Убрать фильтрацию уведомлений */
const clearFilter = () => {
  updateFilter(CaseID.All)
}

/** Обновить список уведомлений */
const updateNotificationList = async () => {
  await fetchItems()
}

onMounted(async () => {
  await fetchCases()
  await fetchItems()
})
</script>

<template>
  <div class="notifications">
    <NotificationsBar
      :dropdown-options="caseDescriptions"
      :filter-case-id="filterCaseID"
      @update-filter="updateNotificationFilter"
      @clear-filter="clearFilter"
      @update-notification-list="updateNotificationList"
    />
    <NotificationsList
      :ix-cases="ixCases"
      :items="filteredItems"
      @notification-click="toggleNotificationStatus"
    />
  </div>
</template>

<style scoped lang="scss">
.notifications {
  display: flex;
  row-gap: 20px;
  flex-direction: column;
  max-width: 1376px;
  padding: 16px 0;
}
</style>
