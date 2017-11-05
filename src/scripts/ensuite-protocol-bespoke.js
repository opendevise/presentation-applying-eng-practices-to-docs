module.exports = () => {
  const info = Array.from(document.querySelectorAll('head meta[name]')).reduce((accum, meta) => {
    accum[meta.getAttribute('name')] = meta.getAttribute('content')
    return accum
  }, {})

  return (deck) => {
    const steps = deck.slides.map((slide, slideIdx) => {
      // TODO node selector should be an option of this plugin
      const notes = Array.from(slide.querySelectorAll('aside[role="note"] p, aside[role="note"] li'))
        .map((note) => note.innerHTML)
        .join('')

      if (slide.bullets && slide.bullets.length > 0) {
        return slide.bullets.map((b, bulletIdx) => {
          return {
            cursor: String(slideIdx) + '.' + String(bulletIdx),
            states: [],
            notes
          }
        })
      }

      return {
        cursor: String(slideIdx),
        states: [],
        notes,
        slideLineno: Number(slide.dataset.slideLineno),
        notesLineno: Number(slide.dataset.notesLineno)
      }
    })

    const details = {
      title: document.title || '',
      authors: info.author || '',
      description: info.description || '',
      vendor: 'bespoke.js',
      steps,
      ratios: ['16/9'],
      themes: ['default']
    }

    window.addEventListener('message', ({ source, data: { command, commandArgs } }) => {
      switch (command) {
        case 'get-slide-deck-details':
          source.postMessage({ event: 'slide-deck-details', eventData: { details } }, '*')
          break

        case 'go-to-step':
          const { cursor } = commandArgs
          const [slideIdx, subslideIdx] = cursor.split('.')
          deck.slide(Number(slideIdx))
          deck.activateBullet(Number(slideIdx), Number(subslideIdx))
          break

        case 'toggle-slide-deck-state':
          const { enabled } = commandArgs
          document.body.classList.toggle('toggle-state', enabled)

          if (enabled && deck.playSound) {
            deck.playSound()
          }

          if (!enabled && deck.stopSound) {
            deck.stopSound()
          }

          break

        default:
          console.debug(`unknown protocol command ${command} with args`, commandArgs)
      }
    })
  }
}
