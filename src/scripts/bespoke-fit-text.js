// IMPORTANT we must defer until load event so all web fonts have a chance to load
// if we used webfontloader (or something equivalent) we could invoke this sooner
//
// IMPORTANT this plugin expects the following CSS to be in place:
// .line {
//   display: block;
//   width: fit-content;
//   white-space: nowrap;
// }
module.exports = () => {
  return (deck) => {
    function fitText () {
      Array.from(deck.parent.querySelectorAll('h2.fit, ul.fit')).forEach((container) => {
        // NOTE no need to worry about scaling the getBoundingClientRect() dimensions since we're working in ratios
        const containerW = container.getBoundingClientRect().width,
          lines = container.querySelectorAll('.line'),
          result = Array.from(lines).map((line, pos) => {
          let actualW = line.getBoundingClientRect().width
          const currentS = parseFloat(window.getComputedStyle(line).fontSize),
            adjustedS = (containerW / actualW) * currentS
          if (currentS !== adjustedS) {
            line.style.fontSize = adjustedS + 'px'
            actualW = line.getBoundingClientRect().width
          }
          // NOTE fine-tune using word or letter spacing
          if (actualW !== containerW) {
            const remainder = containerW - actualW,
              text = line.textContent,
              numWords = text.split(' ').length
            if (numWords > 1) {
              // FIXME what if it already has word spacing? need to add not assign
              line.style.wordSpacing = remainder / (numWords - 1) + 'px'
            }
            else {
              // FIXME what if it already has letter spacing? need to add not assign
              line.style.letterSpacing = remainder / [...text].length + 'px'
            }
          }
          return { fontSize: adjustedS, position: pos }
        })
        result.sort((a, b) => b.fontSize >= a.fontSize)
        result.forEach((lineInfo, idx) => { lines[lineInfo.position].classList.add('prominence-' + (idx + 1)) })
      })
      window.removeEventListener('load', fitText)
    }
    window.addEventListener('load', fitText)
  }
}
