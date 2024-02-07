<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import NotificationsBar from './NotificationsBar.vue'
import NotificationsList from './NotificationsList.vue'
import { useNotificationsStore } from '@/stores/modules/notifications'
import { useNotificationStatuses } from '@/composables/statuses'

const store = useNotificationsStore()
const { ixCases, items, filterCaseID, filteredItems } = storeToRefs(store)
const { fetchCases, fetchItems, clearItems, updateFilter, toggleNotificationStatus } = store

const { setInitialStatuses } = useNotificationStatuses()

/** Время для имитации ответа от сервера */
const SERVER_RESPONSE_DELAY = 300

/** Есть ли хотя бы одно отображаемое отфильтрованное уведомление */
const isFilteredItems = computed(() => {
  return Boolean(filteredItems.value.length)
})

/** Обновить список уведомлений */
const updateNotificationList = async () => {
  clearItems()

  setTimeout(async () => {
    await fetchItems()
  }, SERVER_RESPONSE_DELAY)
}

onMounted(() => {
  setTimeout(async () => {
    await fetchCases()
    await fetchItems()
  }, SERVER_RESPONSE_DELAY)
})

watch(items, () => {
  setInitialStatuses(items.value)
})
</script>

<template>
  <div class="notifications">
    <Transition>
      <NotificationsBar
        v-if="isFilteredItems"
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
