var bespoke = require('bespoke'),
    bullets = require('bespoke-bullets'),
    classes = require('bespoke-classes'),
    extern = require('bespoke-extern'),
    fitText = require('./bespoke-fit-text'),
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
  fitText(),
  extern(bespoke)
])
