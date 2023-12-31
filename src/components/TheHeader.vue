<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useNotificationsStore } from '@/stores/modules/notifications'
import pluralize from '@/utils/pluralize'

const store = useNotificationsStore()
const { filteredItems } = storeToRefs(store)

/** Есть ли хотя бы одно отображаемое уведомление */
const isItems = computed(() => {
  return Boolean(filteredItems.value.length)
})

/** Подобрать правильную форму для слова "изменения" */
const pluralizeChangeWord = (count: number) => {
  return pluralize(count, ['изменение', 'изменения', 'изменений'])
}
</script>

<template>
  <header class="header">
    <h1 class="header__title">Уведомления</h1>
    <p v-if="isItems" class="header__description">
      Показано {{ pluralizeChangeWord(filteredItems.length) }}
    </p>
  </header>
</template>

<style scoped lang="scss">
.header {
  display: flex;
  row-gap: 4px;
  flex-direction: column;
  max-width: 1376px;
  padding: 20px 0;

  &__title {
    margin: 0;
    letter-spacing: -2.2px;
    color: var(--color-heading, #2b3f57);
    font-size: 30px;
    font-weight: 800;
    line-height: 1.2;
  }

  &__description {
    margin: 0;
    color: var(--color-text, #8694a7);
    font-size: 12px;
    font-weight: 400;
    line-height: calc(16 / 12);
  }
}
</style>
@/stores/modules/notifications
