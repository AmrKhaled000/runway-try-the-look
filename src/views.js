const Product = require('./models/Product');

function esc(s) { return String(s == null ? '' : s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

const LOOK_KEYS = ['bndthK','XckgG6','rLfAhC','FKg67q','8KREEE','N3bfm9','A1B2C3','D4E5F6','G7H8I9'];

async function buildRunwayHtml() {
  const looks = await (require('./models/Look')).find().sort({ createdAt: 1 });
  const products = await Product.find();
  const pmap = Object.fromEntries(products.map(p => [p.id, p]));

  // actors
  let actors = '';
  looks.forEach((lk, i) => {
    actors += `<div class="rw__model" data-rw-model data-index="${i}" aria-hidden="true">
            <span class="rw__shadow" aria-hidden="true"></span>
            <div class="rw__figure" style="--rw-ar: 0.5625;"><div class="rw__art">
              <img src="${esc(lk.modelImage)}" srcset="${esc(lk.modelImage)} 640w, ${esc(lk.originalImage)} 1080w" sizes="(min-width: 1800px) 540px, (min-width: 750px) 420px, 320px" loading="eager" decoding="async" data-model-image alt="${esc(lk.name)}" width="1100" height="1956" draggable="false">
              <button type="button" class="rw__hit" data-rw-go="${i}" aria-label="Look ${i+1}: ${esc(lk.name)}" tabindex="-1"></button>
            </div></div>
          </div>`;
  });

  // heroes
  let heroes = '';
  looks.forEach((lk, i) => {
    let pins = '';
    (lk.pins || []).forEach((pin, pi) => {
      pins += `<button type="button" class="rw__pin" data-rw-pin="${pi+1}" data-tip="${esc(pin.product)}" style="left: ${pin.left}%; top: ${pin.top}%; --pi: ${pi+1};" aria-label="${pi+1}: ${esc(pin.product)}" tabindex="-1">
                          <span class="rw__pin-dot" aria-hidden="true">${pi+1}</span>
                        </button>`;
    });
    heroes += `<div class="rw__hero${i===0?' is-on':''}" data-rw-hero data-index="${i}" data-name="${esc(lk.name)}" data-label="Look ${i+1}: ${esc(lk.name)}" data-probe="${esc(lk.modelImage)}" >
            <div class="rw__morph">
              <span class="rw__shadow" aria-hidden="true"></span>
              <div class="rw__figure" style="--rw-ar: 0.5625;"><div class="rw__art">
                <img src="${esc(lk.modelImage)}" srcset="${esc(lk.modelImage)} 640w, ${esc(lk.originalImage)} 1080w" sizes="(min-width: 1800px) 540px, (min-width: 750px) 420px, 320px" loading="eager" decoding="async" data-model-image alt="${esc(lk.name)}" width="1100" height="1956" draggable="false">
                <button type="button" class="rw__zoom" data-rw-zoom aria-label="View look: ${esc(lk.name)}" tabindex="-1"></button><div class="rw__pins">${pins}</div></div></div>
            </div>
          </div>`;
  });

  // ticks
  let ticks = '';
  looks.forEach((lk, i) => {
    ticks += `<button type="button" class="rw__tick" data-rw-tick="${i}" aria-current="${i===0?'true':'false'}" aria-label="Look ${i+1}: ${esc(lk.name)}">
                  <span class="rw__tick-bar" aria-hidden="true"></span>
                  <span class="rw__tick-label" aria-hidden="true">${String(i+1).padStart(2,'0')}<span class="rw__tick-name">&nbsp;&nbsp;${esc(lk.name)}</span></span>
                </button>`;
  });

  // panels
  let panels = '';
  looks.forEach((lk, i) => {
    const key = LOOK_KEYS[i] || ('L' + i);
    let items = '';
    (lk.products || []).forEach((pid, idx) => {
      const p = pmap[pid];
      if (!p) return;
      const n = idx + 1;
      const imgH = p.image.includes('tshirt')?563 : p.image.includes('sweatshirt-plus')?610 : p.image.includes('sweatshirt')?581 : p.image.includes('hoodie-black')?536 : p.image.includes('hoodie')?555 : 400;
      items += `<li class="rw__item" data-rw-card="${n}" style="--i: ${n};" data-title="${esc(p.name)}">
                    <a class="rw__media" href="/products.html" target="_blank" rel="noopener noreferrer" tabindex="-1" aria-hidden="true"><img src="${esc(p.image)}" loading="lazy" decoding="async" alt="" width="400" height="${imgH}">
<span class="rw__num">${n}</span></a>
                    <div class="rw__info"><span class="rw__type">${esc(['tatum-5-orbit-copy','tatum-5-orbit','air-jordan-12-retro-copy'].includes(p.productId)?'Nikey | Password: 1':'Nike')}</span><a class="rw__name" href="/products.html" target="_blank" rel="noopener noreferrer">${esc(p.name)}</a>
                      <span class="rw__price"><span>$${p.price.toFixed(2)}</span></span></div>
                    <button type="button" class="rw__add" data-rw-add aria-expanded="false" aria-controls="Picker-${key}-${n}" aria-label="Add to bag: ${esc(p.name)}" data-added-label="Added to bag: ${esc(p.name)}">
                      <svg class="rw__i-plus" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" aria-hidden="true" focusable="false"><path d="M12 4v16M4 12h16"/></svg>
                      <svg class="rw__i-check" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M4.5 12.5l5 5L19.5 7"/></svg>
                      <svg class="rw__i-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true" focusable="false"><path d="M12 3a9 9 0 1 1-9 9"/></svg>
                    </button>
                    <div class="rw__picker" id="Picker-template--28035983671601__the_runway_wdM8BG-look_${key}-${n}" data-rw-picker hidden>
                      <div class="rw__picker-head">
                        <span class="rw__picker-thumb" aria-hidden="true"><img src="${esc(p.image)}" loading="lazy" decoding="async" alt="" width="160" height="${Math.round(imgH*0.4)}"></span>
                        <span class="rw__picker-meta"><span class="rw__picker-title">${esc(p.name)}</span><span class="rw__picker-price">$${p.price.toFixed(2)}</span></span>
                        <button type="button" class="rw__picker-close" data-rw-pick-close aria-label="Close"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true" focusable="false"><path d="M5 5l14 14M19 5L5 19"/></svg></button>
                      </div>
                      <fieldset class="rw__opt"><legend class="rw__opt-name">${p.sizes.length && p.sizes[0].length>2?'Size':'Shoe size'}</legend>
                        <div class="rw__opt-values">
                          ${p.sizes.map((s,si)=>`<label class="rw__pill"><input type="radio" name="Opt-${key}-${n}-1" value="${esc(s)}" data-rw-option="0" ${si===0?'checked':''}><span class="rw__pill-label">${esc(s)}</span></label>`).join('')}
                        </div>
                      </fieldset>
                      <button type="button" class="rw__confirm" data-rw-confirm><span data-rw-confirm-label data-add="Add to bag">Add to bag</span><span class="rw__sr"> — ${esc(p.name)}</span></button>
                      <script type="application/json" data-rw-variants='${JSON.stringify(p.variants)}'></script>
                    </div>
                  </li>`;
    });
    // type line: use product... we don't have vendor; default Nike
    panels += `<div class="rw__look-panel${i===0?' is-in':''}" data-rw-panel="${i}" ${i!==0?'hidden':''}>
            <div class="rw__mhead"><span class="rw__mhead-title">${esc(lk.name)}</span><span class="rw__label">3 pieces</span></div>
            <ul class="rw__items" role="list">${items}</ul>
            <div class="rw__bundle has-rule">
              <p class="rw__msg" data-rw-msg role="status" aria-live="polite"></p>
              <div class="rw__bundle-row"><div class="rw__bundle-copy"><span class="rw__bundle-title">Complete the look</span><span class="rw__bundle-note">Bundle all 3 and save 10%</span></div><div class="rw__bundle-price"><s>$547.00</s><strong>$492.30</strong></div></div>
              <button type="button" class="rw__cta" data-rw-all><span class="rw__cta-add">Add full look to bag</span><span class="rw__cta-m">Add full look — $492.30</span><span class="rw__cta-done">Full look in your bag</span><svg class="rw__i-arrow" width="22" height="12" viewBox="0 0 26 14" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M1 7h24M19 1l6 6-6 6"/></svg><svg class="rw__i-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true" focusable="false"><path d="M12 3a9 9 0 1 1-9 9"/></svg></button>
            </div>
            <template data-rw-pieces-text>3 pieces</template>
          </div>`;
  });

  // fix type line: vendor line from product not available in catalog item? use 'Nike'
  panels = panels.replace(/<span class="rw__type">Nike<\/span>/g, '<span class="rw__type">Nike</span>');

  const html = `<div class="rw__sticky">
  <div class="rw__grid">
    <div class="rw__left">
      <div class="rw__head">
        <div class="rw__intro"><h2 class="rw__title">Try the Look.</h2><p class="rw__sub">Six looks, styled head to toe. Tap a pin to see the piece.</p></div>
        <span class="rw__sr" aria-live="polite" aria-atomic="true" data-rw-live></span>
      </div>
      <div class="rw__stage" data-rw-stage tabindex="0" role="region" aria-roledescription="carousel" aria-label="Try the Look. — use arrow keys or swipe to change look">
        <div class="rw__actors" data-rw-actors>${actors}</div>
        <div class="rw__heroes" data-rw-heroes>${heroes}</div>
        <span class="rw__sweep" aria-hidden="true"></span>
        <span class="rw__cursor" data-rw-cursor aria-hidden="true"><span class="rw__cursor-in"><span class="rw__cursor-label rw__cursor-drag">Drag</span><span class="rw__cursor-label rw__cursor-view">View</span></span></span>
        <span class="rw__walk" aria-hidden="true"><span class="rw__walk-line"></span></span>
      </div>
      <div class="rw__controls">
        <button type="button" class="rw__icon" data-rw-prev aria-label="Previous look"><svg width="26" height="14" viewBox="0 0 26 14" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M25 7H1M7 1L1 7l6 6"/></svg></button>
        <div class="rw__ticks">${ticks}</div>
        <button type="button" class="rw__icon rw__auto" data-rw-auto aria-pressed="false" aria-label="Autoplay">
          <svg class="rw__i-play" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M7 4.5v15l12.5-7.5z"/></svg>
          <svg class="rw__i-pause" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M6.5 4.5h3.5v15H6.5zM14 4.5h3.5v15H14z"/></svg>
        </button>
        <button type="button" class="rw__icon" data-rw-next aria-label="Next look"><svg width="26" height="14" viewBox="0 0 26 14" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M1 7h24M19 1l6 6-6 6"/></svg></button>
      </div>
      <div class="rw__lb" data-rw-lb data-word="Look" role="region" aria-label="View look" aria-hidden="true">
        <div class="rw__lb-stage" data-rw-lb-stage></div>
        <div class="rw__lb-top">
          <p class="rw__lb-cap"><span class="rw__lb-kicker" data-rw-lb-kicker></span><span class="rw__lb-name" data-rw-lb-name></span></p>
          <button type="button" class="rw__lb-close" data-rw-zoom-close aria-label="Close"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true" focusable="false"><path d="M5 5l14 14M19 5L5 19"/></svg></button>
        </div>
        <p class="rw__lb-hint">Tap a dot to shop the piece</p>
      </div>
    </div>
    <aside class="rw__panel has-rule" aria-label="In this look">
      <div class="rw__panel-inner">
        <div class="rw__panel-head"><h3 class="rw__panel-title">In this look</h3><span class="rw__label" data-rw-pieces></span></div>
        ${panels}
      </div>
    </aside>
  </div>
  </div>`;
  return html;
}

module.exports = { buildRunwayHtml };