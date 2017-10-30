var bespoke = require('bespoke'),
    bullets = require('bespoke-bullets'),
    classes = require('bespoke-classes'),
    extern = require('bespoke-extern'),
    hash = require('bespoke-hash'),
    multimedia = require('bespoke-multimedia'),
    nav = require('bespoke-nav'),
    overview = require('bespoke-overview'),
    scale = require('bespoke-scale')

bespoke.from({ parent: 'article.deck', slides: 'section' }, [
  classes(),
  scale('transform'),
  nav(),
  overview(),
  bullets('.build, .build-items > *:not(.build-items)'),
  hash(),
  multimedia(),
  (deck) => {
    // IMPORTANT we must defer until load event so all web fonts have a chance to load
    // if we used webfontloader (or something equivalent) we could invoke this sooner
    // IMPORTANT this plugin expects the following CSS to be in place:
    // .line {
    //   display: block;
    //   width: fit-content;
    //   white-space: nowrap;
    // }
    window.addEventListener('load', function fitText () {
      Array.prototype.forEach.call(deck.parent.querySelectorAll('h2.fit, ul.fit'), (container) => {
        // NOTE no need to worry about scaling the getBoundingClientRect() dimensions since we're working in ratios
        var availableW = container.getBoundingClientRect().width,
            lines = container.querySelectorAll('.line'),
            result
        (result = Array.prototype.map.call(lines, (line, pos) => {
          var actualW = line.getBoundingClientRect().width,
              currentS = parseFloat(window.getComputedStyle(line).fontSize),
              adjustedS = (availableW / actualW) * currentS
          if (currentS !== adjustedS) {
            line.style.fontSize = adjustedS + 'px'
            actualW = line.getBoundingClientRect().width
          }
          // fine-tune using word or letter spacing
          // FIXME what if it already has letter and word spacing?
          if (actualW !== availableW) {
            var remainder = availableW - actualW,
                text = line.textContent,
                numWords = text.split(' ').length
            if (numWords > 1) {
              line.style.wordSpacing = remainder / (numWords - 1) + 'px'
            }
            else {
              line.style.letterSpacing = remainder / [...text].length + 'px'
            }
          }
          return { fontSize: adjustedS, position: pos }
        })).sort((a, b) => b.fontSize >= a.fontSize)
        result.forEach((lineInfo, idx) => { lines[lineInfo.position].classList.add('prominence-' + (idx + 1)) })
      })
      window.removeEventListener('load', fitText)
    })
  },
  extern(bespoke),
])
