<template>
  <div class="notifications">
    <Transition>
      <NotificationsBar
        v-if="hasVisibleFilteredNotifications"
        :filter-case-id="filterCaseID"
        :ix-cases="notificationCasesByID"
        @update-filter-case-id="setFilterCaseID"
        @update-notification-list="refreshNotificationsList"
      />
    </Transition>
    <NotificationsList
      :ix-cases="notificationCasesByID"
      :items="notificationsFilteredByCase"
      @notification-click="toggleNotificationReadStatus"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import NotificationsBar from './NotificationsBar.vue'
import NotificationsList from './NotificationsList.vue'
import { useNotificationsStore } from '@/stores/modules/notifications'
import { useNotificationStatuses } from '@/composables/statuses'

const store = useNotificationsStore()

const {
  notifications,
  filterCaseID,
  notificationCasesByID,
  notificationsFilteredByCase
} = storeToRefs(store)

const {
  clearNotifications,
  loadNotifications,
  loadNotificationCases,
  setFilterCaseID,
  toggleNotificationReadStatus
} = store

const { setInitialStatuses } = useNotificationStatuses()

/** Время для имитации ответа от сервера */
const SERVER_RESPONSE_DELAY = 300

/** Есть ли хотя бы одно отображаемое отфильтрованное уведомление */
const hasVisibleFilteredNotifications = computed(() => {
  return Boolean(notifications.value.length)
})

/** Обновить список уведомлений */
const refreshNotificationsList = async () => {
  clearNotifications()

  setTimeout(async () => {
    await loadNotifications()
  }, SERVER_RESPONSE_DELAY)
}

onMounted(() => {
  setTimeout(async () => {
    await loadNotificationCases()
    await loadNotifications()
  }, SERVER_RESPONSE_DELAY)
})

watch(notifications, () => {
  setInitialStatuses(notifications.value)
})
</script>

<style scoped lang="scss">
.notifications {
  display: flex;
  row-gap: 20px;
  flex-direction: column;
  max-width: 1376px;
  padding: 16px 0;
}
</style>
