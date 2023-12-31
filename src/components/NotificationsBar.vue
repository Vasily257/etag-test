<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import BaseButton from './BaseButton.vue'
import BaseDropdown from './BaseDropdown.vue'
import BaseIcon from './BaseIcon.vue'
import type { NotificationCase } from '@/types'
import { CaseID } from '@/types'

export type NotificationsBarProps = {
  /** ID типа уведомлений в фильтре */
  filterCaseId?: NotificationCase['id']
  /** Опции выпадающего списка */
  dropdownOptions?: string[]
}

const props = withDefaults(defineProps<NotificationsBarProps>(), {
  filterCaseId: CaseID.All,
  dropdownOptions: () => []
})

/** Эмиты */
const emits = defineEmits(['updateFilter', 'clearFilter', 'updateNotificationList'])

/** Текст неактивного фильтра */
const NO_FILTER = 'Тип уведомления'

/** Текущий фильтр */
const currentFilter = ref(NO_FILTER)

/** Активен ли фильтр */
const isActiveFilter = computed(() => {
  return props.filterCaseId !== CaseID.All
})

/** Обновить список уведомлений */
const updateNotificationList = () => {
  emits('updateNotificationList')
}

/** Очистить фильтр */
const clearFilter = () => {
  emits('clearFilter')
  currentFilter.value = NO_FILTER
}

// Обновить фильтр, если его значение поменялось внутри выпадающего меню
watch(
  currentFilter,
  () => {
    emits('updateFilter', currentFilter.value)
  },
  { immediate: true }
)
</script>

<template>
  <div class="notifications-bar">
    <BaseDropdown
      id="notifications-bar-dropdown"
      v-model="currentFilter"
      :options="dropdownOptions"
      is-filter
      :is-active-filter="isActiveFilter"
      variant="regular"
      class="notifications-bar__dropdown"
    />
    <BaseButton
      v-if="filterCaseId !== CaseID.All"
      class="notifications-bar__reset-button"
      @button-click="clearFilter"
    >
      Сбросить
    </BaseButton>
    <BaseButton
      aria-label="Обновить список"
      class="notifications-bar__update-button"
      @button-click="updateNotificationList"
    >
      <BaseIcon icon-name="update" />
    </BaseButton>
  </div>
</template>

<style scoped lang="scss">
.notifications-bar {
  display: flex;
  column-gap: 8px;
  flex-direction: row;

  &__dropdown {
    max-width: 360px;
  }

  &__reset-button {
    color: var(--color-text, #8694a7);
    font-size: 12px;
    font-weight: 400;
    line-height: calc(16 / 12);
  }

  &__update-button {
    margin-left: auto;
  }
}
</style>
