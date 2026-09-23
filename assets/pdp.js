(function () {
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector))
  const galleryData = JSON.parse(document.getElementById('pdp-gallery')?.textContent || '[]')
  const productTitle = document.querySelector('.title')?.firstChild?.textContent?.trim() || ''
  const arrow = (flip) =>
    `<svg viewBox="0 0 16 16" aria-hidden="true"><path d="${
      flip ? 'M10 3.5 5.5 8 10 12.5' : 'M6 3.5 10.5 8 6 12.5'
    }" /></svg>`

  let galleryIndex = 0
  let lightbox = null

  const renderGallery = () => {
    const current = galleryData[galleryIndex]
    if (!current) return
    $$('[data-gallery-main]').forEach((img) => {
      img.src = current.src
      img.alt = current.alt || ''
    })
    $$('[data-gallery-thumb]').forEach((thumb) => {
      thumb.classList.toggle('thumbActive', Number(thumb.dataset.galleryThumb) === galleryIndex)
    })
    $$('[data-gallery-count]').forEach((node) => {
      node.textContent = `Image ${galleryIndex + 1} of ${galleryData.length}`
    })
    if (lightbox) renderLightbox()
  }

  const setIndex = (index) => {
    galleryIndex = (index + galleryData.length) % galleryData.length
    renderGallery()
  }

  const renderLightbox = () => {
    const current = galleryData[galleryIndex]
    const many = galleryData.length > 1
    lightbox.innerHTML = `
      <button type="button" class="lightboxBackdrop" data-lb-close aria-label="Close image viewer"></button>
      <div class="lightboxDialog">
        <button type="button" class="lightboxClose" data-lb-close aria-label="Close">×</button>
        <div class="lightboxStage">
          ${many ? `<button type="button" class="lightboxNav lightboxPrev" data-lb-step="-1" aria-label="Previous image">${arrow(true)}</button>` : ''}
          <img src="${current.src}" alt="${current.alt || ''}" />
          ${many ? `<button type="button" class="lightboxNav lightboxNext" data-lb-step="1" aria-label="Next image">${arrow()}</button>` : ''}
        </div>
        <div class="lightboxSide">
          <div class="lightboxCount">Image ${galleryIndex + 1} of ${galleryData.length}</div>
          <div class="lightboxTitle">${current.title || productTitle}</div>
          ${current.description ? `<div class="lightboxDescription">${current.description}</div>` : ''}
          ${
            many
              ? `<div class="lightboxStrip">${galleryData
                  .map(
                    (image, i) =>
                      `<button type="button" class="lightboxThumb ${
                        i === galleryIndex ? 'lightboxThumbActive' : ''
                      }" data-lb-index="${i}" aria-label="View image ${i + 1}"><img src="${image.src}" alt="" /></button>`
                  )
                  .join('')}</div>`
              : ''
          }
        </div>
      </div>`
  }

  const openLightbox = () => {
    if (!galleryData.length) return
    lightbox = document.createElement('div')
    lightbox.className = 'lightbox'
    lightbox.setAttribute('role', 'dialog')
    lightbox.setAttribute('aria-modal', 'true')
    lightbox.setAttribute('aria-label', 'Product images')
    document.querySelector('.page').appendChild(lightbox)
    renderLightbox()
    lightbox.addEventListener('click', (event) => {
      const target = event.target.closest('button')
      if (!target) return
      if (target.hasAttribute('data-lb-close')) closeLightbox()
      if (target.dataset.lbStep) setIndex(galleryIndex + Number(target.dataset.lbStep))
      if (target.dataset.lbIndex) setIndex(Number(target.dataset.lbIndex))
    })
  }

  const closeLightbox = () => {
    lightbox?.remove()
    lightbox = null
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeLightbox()
      closeValidation()
    }
    if (!lightbox) return
    if (event.key === 'ArrowLeft') setIndex(galleryIndex - 1)
    if (event.key === 'ArrowRight') setIndex(galleryIndex + 1)
  })

  $$('[data-gallery-thumb]').forEach((thumb) =>
    thumb.addEventListener('click', () => setIndex(Number(thumb.dataset.galleryThumb)))
  )
  $$('[data-lightbox-open]').forEach((button) => button.addEventListener('click', openLightbox))

  $$('[data-see-more]').forEach((button) => {
    button.addEventListener('click', () => {
      const clamp = button.previousElementSibling
      const expanded = clamp.classList.toggle('clampExpanded')
      button.classList.toggle('seeMoreExpanded', expanded)
      button.querySelector('span').textContent = expanded ? 'See less' : 'See more'
    })
  })

  $$('[data-copy]').forEach((button) => {
    button.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(button.dataset.copy)
        button.textContent = 'Copied'
        setTimeout(() => {
          button.textContent = 'Copy'
        }, 1600)
      } catch (error) {
        console.error('Unable to copy catalog number', error)
      }
    })
  })

  $$('[data-scroll-to]').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault()
      const element = document.getElementById(link.dataset.scrollTo)
      if (!element) return
      const headerHeight = document.getElementById('fixed-header-wrapper')?.offsetHeight || 125
      element.style.scrollMarginTop = `${headerHeight}px`
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  })

  $$('.optionList').forEach((list) => {
    list.addEventListener('click', (event) => {
      const option = event.target.closest('.sizeOption')
      if (!option || option.disabled) return
      const value = option.dataset.value
      $$('.optionList').forEach((otherList) =>
        $$('.sizeOption', otherList).forEach((node) => {
          const selected = node.dataset.value === value
          node.classList.toggle('sizeOptionSelected', selected)
          node.setAttribute('aria-checked', String(selected))
        })
      )
      if (option.dataset.sku) {
        $$('[data-catalog]').forEach((node) => {
          node.textContent = option.dataset.sku
        })
        $$('[data-copy]').forEach((node) => {
          node.dataset.copy = option.dataset.sku
        })
      }
    })
  })

  let quantity = 1
  $$('[data-qty]').forEach((button) => {
    button.addEventListener('click', () => {
      quantity = Math.max(1, quantity + Number(button.dataset.qty))
      $$('[data-qty-value]').forEach((node) => {
        node.textContent = String(quantity)
      })
    })
  })

  const purchase = document.querySelector('.mobilePurchase')
  const toggle = document.querySelector('.mobileDrawerToggle')
  toggle?.addEventListener('click', () => {
    const open = purchase.classList.toggle('mobileOpen')
    toggle.setAttribute('aria-expanded', String(open))
    toggle.querySelector('.mobileSupportLabel').textContent = open
      ? 'Hide support options'
      : 'More support options'
  })

  const validation = document.getElementById('validation-modal')
  const closeValidation = () => validation?.setAttribute('hidden', '')
  $$('[data-validation-open]').forEach((chip) =>
    chip.addEventListener('click', () => validation?.removeAttribute('hidden'))
  )
  validation?.addEventListener('click', (event) => {
    if (event.target === validation || event.target.closest('[data-validation-close]')) {
      closeValidation()
    }
  })

  $$('[data-demo-action]').forEach((button) =>
    button.addEventListener('click', () => {
      const label = button.textContent
      button.textContent = 'Preview only'
      setTimeout(() => {
        button.textContent = label
      }, 1400)
    })
  )
})()
