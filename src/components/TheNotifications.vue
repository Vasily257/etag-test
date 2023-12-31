<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import NotificationsBar from './NotificationsBar.vue'
import NotificationsList from './NotificationsList.vue'
import { useNotificationsStore } from '@/stores/modules/notifications'

const store = useNotificationsStore()
const { items, ixCases, filterCaseID, filteredItems } = storeToRefs(store)
const { fetchCases, fetchItems, updateFilter, toggleNotificationStatus } = store

/** Есть ли хотя бы одно отображаемое уведомление */
const isItems = computed(() => {
  return Boolean(items.value.length)
})

/** Есть ли хотя бы одно отображаемое уведомление */
const isFilteredItems = computed(() => {
  return Boolean(filteredItems.value.length)
})

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
    <Transition>
      <NotificationsBar
        v-if="isItems && isFilteredItems"
        :filter-case-id="filterCaseID"
        :ix-cases="ixCases"
        @update-filter-case-id="updateFilter"
        @update-notification-list="updateNotificationList"
      />
    </Transition>
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
