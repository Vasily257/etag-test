<script setup lang="ts">
import { ref, computed, watchEffect, onBeforeUnmount } from 'vue'
import BaseIcon from './BaseIcon.vue'
import BaseButton from './BaseButton.vue'

/** Типы пропсов */
interface Props {
  /** ID поля */
  id: string
  /** Имя поля */
  name?: string
  /** Значение поля */
  modelValue: string
  /** Текст ошибки */
  errorText?: string
  /** Показать ли ошибки */
  isErrorShown?: boolean
  /** Замещающий текст */
  placeholder?: string
  /** Обязательно ли заполнять поле */
  isRequired?: boolean
  /** Значения внутри выпадающего меню */
  options: string[]
  /** Яляется ли выпадающее меню фильтром */
  isFilter: boolean
  /** Активен ли фильтр */
  isActiveFilter: boolean
  /** Внешние CSS-классы для главной кнопки */
  variant: 'regular' | 'outlined'
}

/** Пропсы со значениями по умолчанию */
const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  errorText: '',
  isErrorShown: false,
  isRequired: false,
  options: () => [],
  isFilter: false,
  isActiveFilter: false,
  variant: 'regular'
})

/** Эмиты */
const emits = defineEmits(['update:modelValue', 'principalButtonFocusIn'])

/** Открыто ли выпадающее меню */
const isMenuOpened = ref(false)

/** Элемент главной кнопки */
const principalMenu = ref<HTMLButtonElement | null>(null)

/** Элементы выпадающего меню */
const menuItems = ref<HTMLUListElement[]>([])

/** Кнопки выпадающего меню */
const menuItemButtons = ref<HTMLButtonElement[]>([])

/** CSS-классы для главной кнопки */
const principalButtonClass = computed(() => {
  return [
    'dropdown__principal-button',
    `dropdown__principal-button--variant--${props.variant}`,
    {
      'dropdown__principal-button--opened': isMenuOpened.value,
      'dropdown__principal-button--active': props.isActiveFilter,
      'dropdown__principal-button--placeholder': props.modelValue === props.placeholder,
      'dropdown__principal-button--error': props.isErrorShown
    }
  ]
})

/** CSS-классы иконки главной кнопки */
const principalButtonIconClass = computed(() => {
  return {
    'dropdown__principal-button-icon': true,
    'dropdown__principal-button-icon--rotated-by-half': isMenuOpened.value,
    'dropdown__principal-button-icon--active': props.isActiveFilter
  }
})

/**
 * Является ли опция выбранной
 * @param menuOption опция в меню
 */
const isSelectedOption = (menuOption: string) => {
  return menuOption === props.modelValue
}

/**
 * Получить класс кнопки меню
 * @param index индекс кнопки (элемента меню)
 */
const getItemButtonClass = (index: number, option: string) => {
  return {
    'dropdown__item-button': true,
    'dropdown__item-button--first': index === 0,
    'dropdown__item-button--last': index === props.options.length - 1,
    'dropdown__item-button--bold': props.isFilter && isSelectedOption(option)
  }
}

/**
 * Обработать фокусировку на главной кнопке
 * @param event событие фокуса
 */
const handlePrincipalButtonFocusIn = (event: FocusEvent) => {
  if (props.isErrorShown) {
    emits('principalButtonFocusIn', event)
  }
}

/** Открыть выпадающее меню */
const openMenu = () => {
  isMenuOpened.value = true

  // При открытии меню фокус перемещается на первую кнопку меню (см. watchEffect)
}

/** Закрыть выпадающее меню */
const closeMenu = () => {
  isMenuOpened.value = false

  // Очистить глобальный слушатель клика вне меню
  document.removeEventListener('click', closeMenuOnOutsideClick)
}

/** Сфокусироваться на первой кнопке меню */
const focusFirstMenuButton = () => {
  menuItemButtons.value[0]?.focus()
}

/** Обработать нажатие по главной кнопке */
const handlePrincipalButtonClick = () => {
  if (isMenuOpened.value) {
    closeMenu()
  } else {
    openMenu()
  }
}

/**
 * Обработать клик по кнопке меню
 * @param event событие мыши
 */
const handleMenuButtonClick = (event: Event) => {
  if (event.target instanceof HTMLButtonElement) {
    const buttonElement = event.target

    // Обновить значение внутри главной кнопки
    if (buttonElement?.textContent) {
      emits('update:modelValue', buttonElement.textContent.trim())
    }
  }

  closeMenu()

  if (principalMenu.value) {
    principalMenu.value.focus()
  }
}

/**
 * Обработать нажатие клавиши на кнопке выпадающего меню
 * @param event событие клавиатуры
 */
const handleMenuButtonKeyInput = (event: KeyboardEvent) => {
  if (event.target instanceof HTMLButtonElement) {
    const currentButton = event.target
    const currentButtonIndex = menuItemButtons.value.indexOf(currentButton)
    const lastIndex = menuItemButtons.value.length - 1

    // Если нажата стрелка «Вверх»
    if (event.key === 'ArrowUp') {
      // Отключить прокрутку страницы
      event.preventDefault()

      if (currentButtonIndex > 0 && currentButtonIndex <= lastIndex) {
        menuItemButtons.value[currentButtonIndex - 1].focus()
      }

      if (currentButtonIndex === 0) {
        menuItemButtons.value[lastIndex].focus()
      }
    }

    // Если нажата стрелка «Вниз»
    if (event.key === 'ArrowDown') {
      // Отключить прокрутку страницы
      event.preventDefault()

      if (currentButtonIndex >= 0 && currentButtonIndex < lastIndex) {
        menuItemButtons.value[currentButtonIndex + 1].focus()
      }

      if (currentButtonIndex === lastIndex) {
        menuItemButtons.value[0].focus()
      }
    }

    // Если нажата клавиша Escape
    if (event.key === 'Escape') {
      closeMenu()

      if (principalMenu.value) {
        principalMenu.value.focus()
      }
    }

    // Если нажата клавиша Tab
    if (event.key === 'Tab') {
      closeMenu()
    }
  }
}

// Переместить фокус на первую кнопку, когда откроется меню
watchEffect(() => {
  if (isMenuOpened.value) {
    // Очистить старый список кнопок
    menuItemButtons.value = []

    // Получить новый список кнопок
    menuItems.value.forEach((menuItem) => {
      const menuItemButton = menuItem.querySelector('button')

      if (menuItemButton) {
        menuItemButtons.value.push(menuItemButton)
      }
    })

    focusFirstMenuButton()

    // Добавить обработчик с нулевой задержкой, чтобы он не сразу сработал
    setTimeout(() => {
      document.addEventListener('click', closeMenuOnOutsideClick)
    })
  }
})

/** Закрыть меню при клике вне меню */
const closeMenuOnOutsideClick = (event: Event) => {
  const isMenuButton =
    event.target instanceof HTMLButtonElement && menuItemButtons.value.includes(event.target)

  if (!isMenuButton) {
    closeMenu()
  }
}

onBeforeUnmount(() => {
  document.removeEventListener('click', closeMenuOnOutsideClick)
})
</script>

<template>
  <div class="dropdown">
    <!-- Главная кнопка -->
    <input
      :id="id"
      ref="principalMenu"
      :name="name"
      :value="modelValue"
      type="button"
      :required="isRequired"
      :class="principalButtonClass"
      :aria-haspopup="true"
      :aria-expanded="isMenuOpened"
      @focusin="handlePrincipalButtonFocusIn"
      @click="handlePrincipalButtonClick"
      @keyup.down="openMenu"
    />
    <BaseIcon icon-name="arrowdown" :class="principalButtonIconClass" />
    <span v-if="props.isErrorShown" class="dropdown__error-text">{{ errorText }}</span>

    <!-- Скрытое выпадающее меню -->
    <Transition>
      <ul v-if="isMenuOpened" role="menu" :aria-labelledby="id" class="dropdown__menu">
        <li
          v-for="(option, index) in options"
          :key="index"
          ref="menuItems"
          class="dropdown__menu-item"
        >
          <BaseButton
            :class="getItemButtonClass(index, option)"
            tabindex="-1"
            role="menuitem"
            @click="handleMenuButtonClick"
            @keyup.up="handleMenuButtonKeyInput"
            @keyup.down="handleMenuButtonKeyInput"
            @keyup.esc="handleMenuButtonKeyInput"
            @keydown.tab="handleMenuButtonKeyInput"
            @mouseenter="$event.target.focus()"
          >
            {{ option }}
            <BaseIcon v-if="isSelectedOption(option)" icon-name="check-mark" />
          </BaseButton>
        </li>
      </ul>
    </Transition>
  </div>
</template>

<style lang="scss" scoped>
.dropdown {
  position: relative;
  display: flex;
  align-items: center;
  flex-grow: 1;
  width: 100%;
  text-transform: inherit;
  font-size: inherit;
  font-weight: inherit;

  &__principal-button {
    position: relative;
    z-index: 1;
    width: 100%;
    min-height: inherit;
    padding: 0 8px;
    cursor: pointer;
    text-align: left;
    text-transform: inherit;
    color: #545454;
    border-width: 1px;
    border-style: solid;
    border-color: #dddddd;
    border-radius: 4px;
    background-color: transparent;
    font-family: inherit;
    font-size: inherit;
    font-weight: inherit;
    line-height: 1;

    &:hover {
      border-color: var(--color-primary, #754eff);
    }

    &:focus {
      outline: none;
    }

    &:focus-visible {
      border-color: var(--color-primary, #754eff);
      caret-color: var(--color-primary, #754eff);
    }

    &--variant--regular {
      width: 100%;
      padding: 11px 20px;
      color: var(--color-text, #8694a7);
      border-color: var(--color-border, #e4ebf4);
      border-radius: 15px;
      font-size: 14px;
      font-weight: 400;
      line-height: calc(24 / 14);
    }

    &--opened {
      border-color: var(--color-primary, #754eff);
    }

    &--active {
      color: var(--color-primary, #754eff);
      border-color: var(--color-primary, #754eff);
    }

    &--placeholder {
      color: #a9a9a9;
    }

    &--error {
      color: #eb5757;
      border-color: #eb5757;

      &:hover {
        border-color: #eb5757;
      }

      &:focus-visible {
        border-color: #eb5757;
        caret-color: #eb5757;
      }
    }
  }

  &__error-text {
    position: absolute;
    top: 100%;
    right: 0;
    color: #eb5757;
    font-size: 10px;
    line-height: 1.6;
  }

  &__principal-button-icon {
    position: absolute;
    top: 50%;
    right: 8px;
    transition: transform 0.25s;
    transform: translate(0, -50%);

    stroke: var(--color-border);

    &--rotated-by-half {
      transform: translate(0, -50%) rotate(180deg);
    }

    &--active {
      stroke: var(--color-primary, #754eff);
    }
  }

  &__menu {
    position: absolute;
    top: calc(100% + 8px);
    left: 0;
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    width: 100%;
    margin: 0;
    padding: 0;
    list-style-type: none;
    border: 1px solid var(--color-border, #e4ebf4);
    border-radius: 15px;
    background-color: #ffffff;
    box-shadow: 0 10px 20px 0 rgba(186, 197, 211, 0.15);
    font-weight: 400;
  }

  &__menu-item {
    width: 100%;
  }

  &__item-button {
    width: 100%;
    padding: 14px 36px;
    color: var(--color-heading, #2b3f57);
    border: none;
    border-radius: 0;
    font-size: 14px;
    font-weight: 400;
    line-height: calc(20 / 14);

    &:focus {
      border-color: transparent;
      outline: none;
      background-color: var(--color-background, #fcfdfe);
    }

    &--first {
      border-top-left-radius: 15px;
      border-top-right-radius: 15px;
    }

    &--last {
      border-bottom-right-radius: 15px;
      border-bottom-left-radius: 15px;
    }

    &--bold {
      font-weight: 700;
    }
  }
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.25s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
