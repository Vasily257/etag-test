<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import BaseButton from './BaseButton.vue'
import BaseDropdown from './BaseDropdown.vue'
import BaseIcon from './BaseIcon.vue'
import type { NotificationCase } from '@/types'
import { CaseID } from '@/types'

/** Типы пропсов */
export type NotificationsBarProps = {
  /** ID типа уведомлений в фильтре */
  filterCaseId: NotificationCase['id']
  /** Типы уведомлений, индексированные по id */
  ixCases?: Record<string, NotificationCase>
}

/** Пропсы со значениями по умолчанию */
const props = withDefaults(defineProps<NotificationsBarProps>(), {
  ixCases: () => ({})
})

/** Эмиты */
const emits = defineEmits(['updateFilterCaseId', 'updateNotificationList'])

/** Текст неактивного фильтра */
const NO_FILTER = 'Тип уведомления'

/** Текст в фильтре */
const filterText = ref(NO_FILTER)

const cases = computed(() => {
  return Object.values(props.ixCases) || []
})

/** Описания типов уведомлений */
const caseDescriptions = computed(() => {
  return cases.value.map((caseItem) => caseItem.description)
})

/** Активен ли фильтр */
const isActiveFilter = computed(() => {
  return props.filterCaseId !== CaseID.All
})

/** Новое значение фильтра */
const newFilterCaseId = computed(() => {
  let newFilterCaseId = CaseID.All

  const currentCase = cases.value.find((itemCase) => itemCase.description === filterText.value)

  if (currentCase?.id) {
    newFilterCaseId = currentCase.id
  }

  return newFilterCaseId
})

/** Обновить список уведомлений */
const updateNotificationList = () => {
  emits('updateNotificationList')
}

/** Очистить фильтр */
const clearFilter = () => {
  emits('updateFilterCaseId', CaseID.All)
}

// Поменять текст в фильтре, если изменился ID фильтра
watch(
  props,
  () => {
    if (props.filterCaseId === CaseID.All) {
      filterText.value = NO_FILTER
    } else {
      filterText.value = props.ixCases[props.filterCaseId]?.description || ''
    }
  },
  {
    immediate: true
  }
)

// Обновить фильтр, если его значение поменялось внутри выпадающего меню
watch(filterText, () => {
  emits('updateFilterCaseId', newFilterCaseId.value)
})
</script>

<template>
  <div class="notifications-bar">
    <BaseDropdown
      id="notifications-bar-dropdown"
      v-model="filterText"
      :options="caseDescriptions"
      is-filter
      :is-active-filter="isActiveFilter"
      variant="regular"
      class="notifications-bar__dropdown"
    />
    <BaseButton
      v-if="filterCaseId !== CaseID.All"
      class="notifications-bar__reset-button"
      @click="clearFilter"
    >
      Сбросить
    </BaseButton>
    <BaseButton
      aria-label="Обновить список"
      class="notifications-bar__update-button"
      @click="updateNotificationList"
    >
      <BaseIcon icon-name="update" class="notifications-bar__update-button-icon" />
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

  &__update-button-icon {
    width: 24px;
    height: 24px;
  }
}
</style>
