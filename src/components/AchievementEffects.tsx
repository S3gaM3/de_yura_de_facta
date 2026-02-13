import { useEffect } from 'react'
type AchievementEffectsProps = {
  rewards: Set<string>
  zone: 'main' | 'secret'
}

/** Применяет к body темы и эффекты по наградам (только для текущей зоны) */
export function AchievementEffects({ rewards, zone }: AchievementEffectsProps) {
  useEffect(() => {
    const root = document.documentElement
    const body = document.body

    // Сброс классов/атрибутов эффектов
    root.removeAttribute('data-achievement-theme')
    body.classList.remove(
      'effect-hearts-more',
      'effect-sparkle',
      'effect-glow-cards',
      'effect-stars-bg',
      'effect-rainbow-hearts'
    )

    // Темы (последняя выигрывает — можно сделать приоритет)
    if (rewards.has('theme_gold') && zone === 'main') {
      root.setAttribute('data-achievement-theme', 'gold')
    } else if (rewards.has('theme_soft') && zone === 'main') {
      root.setAttribute('data-achievement-theme', 'soft')
    } else if (rewards.has('theme_cool') && zone === 'main') {
      root.setAttribute('data-achievement-theme', 'cool')
    } else if (rewards.has('theme_cool') && zone === 'secret') {
      root.setAttribute('data-achievement-theme', 'cool')
    }

    // Анимации/эффекты для основной зоны
    if (zone === 'main') {
      if (rewards.has('hearts_more')) body.classList.add('effect-hearts-more')
      if (rewards.has('sparkle')) body.classList.add('effect-sparkle')
      if (rewards.has('glow_cards')) body.classList.add('effect-glow-cards')
      if (rewards.has('rainbow_hearts')) body.classList.add('effect-rainbow-hearts')
    }

    // Для секрета — звёзды
    if (zone === 'secret' && rewards.has('stars_bg')) {
      body.classList.add('effect-stars-bg')
    }

    return () => {
      root.removeAttribute('data-achievement-theme')
      body.classList.remove(
        'effect-hearts-more',
        'effect-sparkle',
        'effect-glow-cards',
        'effect-stars-bg',
        'effect-rainbow-hearts'
      )
    }
  }, [rewards, zone])

  return null
}
