/**
 * Получить множественную форму слова
 * @param count числительное для слова
 * @param words варианты слов, например: ['коментарий', 'коментария', 'комментариев']
 * @return числительное и подходящая форма слова
 */
const pluralize = (count: number, words: string[]) => {
  const cases = [2, 0, 1, 1, 1, 2]

  const index = count % 100 > 4 && count % 100 < 20 ? 2 : cases[Math.min(count % 10, 5)]

  return `${count} ${words[index]}`
}

export default pluralize
