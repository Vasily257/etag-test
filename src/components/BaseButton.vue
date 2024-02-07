<template>
  <button :type="type" :class="buttonClasses">
    <slot>Нажать</slot>
  </button>
</template>

<script setup lang="ts">
import { withDefaults, computed, type ButtonHTMLAttributes } from 'vue'

/** Типы пропсов */
interface Props {
  /** Тип кнопки */
  type?: ButtonHTMLAttributes['type']
  /** Вариант оформления */
  variant?: 'none' | 'regular'
}

/** Задать пропсы */
const props = withDefaults(defineProps<Props>(), {
  type: 'button',
  variant: 'none'
})

/** Классы кнопки */
const buttonClasses = computed(() => ({
  'button': true,
  'button--regular': props.variant === 'regular'
}))
</script>

<style lang="scss" scoped>
.button {
  position: relative;
  display: inline-flex;
  overflow: hidden;
  align-items: center;
  box-sizing: border-box;
  cursor: pointer;
  user-select: none;
  text-align: center;
  vertical-align: bottom;
  color: inherit;
  border: 1px solid transparent;
  background-color: transparent;

  &:hover {
    background-color: transparent;
  }

  &:focus {
    outline: none;
  }

  &:focus-visible {
    outline: 2px solid #2f80ed;
    outline-offset: 2px;
  }

  &--regular {
    min-height: 32px;
    padding: 8px 24px;
    color: var(--color-text, #8694a7);
    border: 1px solid var(--color-border, #e4ebf4);
    border-radius: 15px;
    background-color: #ffffff;
    font-size: 14px;
    font-weight: 400;
    line-height: calc(24 / 14);

    &:hover {
      border: 1px solid var(--color-primary, #754eff);
      background-color: #ffffff;
    }
  }
}
</style>
