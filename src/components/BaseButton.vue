<script setup lang="ts">
/** Типы пропсов */
interface Props {
  /** Тип кнопки */
  type?: 'submit' | 'button' | 'reset'
}

/** Пропсы со значениями по умолчанию */
withDefaults(defineProps<Props>(), {
  type: 'button'
})

/** Эмиты */
const emits = defineEmits(['buttonClick'])
</script>

<template>
  <button :type="type" class="button" @click.prevent="emits('buttonClick')">
    <slot>Нажать</slot>
  </button>
</template>

<style lang="scss" scoped>
.button {
  display: inline-flex;
  justify-content: space-between;
  align-items: center;
  gap: 4px;
  box-sizing: border-box;
  width: fit-content;
  min-height: 32px;
  padding: 0 15px;
  cursor: pointer;
  text-align: center;
  text-transform: inherit;
  color: #545454;
  border-width: 1px;
  border-style: solid;
  border-color: transparent;
  border-radius: 4px;
  background-color: #ffffff;
  font: inherit;
  font-size: inherit;
  font-weight: inherit;
  line-height: inherit;

  &:hover {
    background-color: #ffffff;
  }

  &:focus {
    outline: none;
  }

  &:focus-visible {
    outline: 2px solid #2f80ed;
    outline-offset: 2px;
  }
}
</style>
