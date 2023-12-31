<script setup lang="ts">
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import NotificationsBar from './NotificationsBar.vue'
import NotificationsList from './NotificationsList.vue'
import { useNotificationsStore } from '@/stores/modules/notifications'

const store = useNotificationsStore()
const { ixCases, filterCaseID, filteredItems } = storeToRefs(store)
const { fetchCases, fetchItems, updateFilter, toggleNotificationStatus } = store

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
      :filter-case-id="filterCaseID"
      :ix-cases="ixCases"
      @update-filter-case-id="updateFilter"
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
