<script setup lang="ts">
import BaseButton from './BaseButton.vue'
import BaseIcon from './BaseIcon.vue'
import type { NotificationCase, CaseID, NotificationWithStatus } from '@/types'

export type NotificationsListProps = {
  /** Типы уведомлений, индексированные по id */
  ixCases?: Record<string, NotificationCase>
  /** Список уведомлений */
  items?: NotificationWithStatus[]
}

const props = withDefaults(defineProps<NotificationsListProps>(), {
  ixCases: () => ({}),
  items: () => []
})

/** Эмиты */
const emits = defineEmits(['notificationClick'])

/** Получить CSS-классы иконки главной кнопки */
const getItemClass = (itemIndex: number, itemReadStatus: NotificationWithStatus['isRead']) => {
  return {
    'notifications-list__item': true,
    'notifications-list__item--first': itemIndex === 0,
    'notifications-list__item--last': itemIndex === props.items.length - 1,
    'notifications-list__item--read': itemReadStatus
  }
}

const getIconName = (caseID: CaseID) => {
  return props.ixCases[caseID].code
}

const getTitle = (caseID: CaseID) => {
  return props.ixCases[caseID].description
}

const getDescription = (item: NotificationWithStatus) => {
  return `${item.cat} (ID ${item.id})`
}

const toggleStatus = (itemID: NotificationWithStatus['id']) => {
  emits('notificationClick', itemID)
}

const getButtonText = (isRead: boolean) => {
  return isRead ? 'Прочитать' : 'Отметить непрочитанным'
}
</script>

<template>
  <TransitionGroup name="list" tag="ul" class="notifications-list">
    <li v-for="(item, index) in items" :key="item.id" :class="getItemClass(index, item.isRead)">
      <BaseIcon :icon-name="getIconName(item.case)" class="notifications-list__item-icon" />
      <div class="notifications-list__item-text-box">
        <h2 class="notifications-list__item-title">{{ getTitle(item.case) }}</h2>
        <p class="notifications-list__item-description">{{ getDescription(item) }}</p>
      </div>
      <BaseButton class="notifications-list__item-button" @button-click="toggleStatus(item.id)">
        {{ getButtonText(item.isRead) }}
      </BaseButton>
    </li>
  </TransitionGroup>
  <Transition>
    <p v-if="!props.items.length" class="loading-text">Загрузка...</p>
  </Transition>
</template>

<style scoped lang="scss">
.notifications-list {
  margin: 0;
  padding: 0;
  list-style-type: none;

  &__item {
    display: flex;
    column-gap: 16px;
    flex-direction: row;
    padding: 18px 27px 19px;
    border: 1px solid var(--color-border, #e4ebf4);
    border-top: none;
    background-color: #ffffff;

    &--first {
      border-top: 1px solid var(--color-border, #e4ebf4);
      border-radius: 15px 15px 0 0;
    }

    &--last {
      border-top: none;
      border-radius: 0 0 15px 15px;
    }

    &--read {
      background-color: var(--color-background, #fcfdfe);
    }
  }

  &__item-icon {
    width: 20px;
    height: 20px;
  }

  &__item-text-box {
    display: flex;
    flex-direction: column;
  }

  &__item-title {
    margin: 0;
    color: var(--color-heading, #2b3f57);
    font-size: 14px;
    font-weight: 700;
    line-height: calc(24 / 14);
  }

  &__item-description {
    margin: 0;
    color: var(--color-text, #8694a7);
    font-size: 12px;
    font-weight: 400;
    line-height: calc(16 / 12);
  }

  &__item-button {
    display: inline-flex;
    align-items: center;
    margin-left: auto;
    padding: 8px 24px;
    color: var(--color-text, #8694a7);
    border: 1px solid var(--color-border, #e4ebf4);
    border-radius: 15px;
    background: #ffffff;
    font-size: 14px;
    font-weight: 400;
    line-height: calc(24 / 14);

    &:hover {
      border: 1px solid var(--color-primary, #754eff);
    }
  }
}

.loading-text {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--color-text, #8694a7);
  font-size: 14px;
  font-weight: 600;
  line-height: calc(24 / 14);
}

.list-move,
.list-enter-active {
  transition: all 0.75s ease;
}

.list-leave-active {
  transition: all 0s ease;
}

.list-enter-from {
  transform: translateY(30px);
  opacity: 0;
}

.list-leave-to {
  opacity: 0;
}

.list-leave-active {
  position: absolute;
}
</style>
