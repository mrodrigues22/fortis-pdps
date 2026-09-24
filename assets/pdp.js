(function () {
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector))
  const galleryData = JSON.parse(document.getElementById('pdp-gallery')?.textContent || '[]')
  const productTitle = document.querySelector('.title')?.firstChild?.textContent?.trim() || ''
  const imageAlt = (image, i) =>
    image.alt?.trim() || image.title?.trim() || `${productTitle}, image ${i + 1}`
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
      img.alt = imageAlt(current, galleryIndex)
    })
    $$('[data-gallery-thumb]').forEach((thumb) => {
      thumb.classList.toggle('thumbActive', Number(thumb.dataset.galleryThumb) === galleryIndex)
    })
    $$('[data-gallery-count]').forEach((node) => {
      node.textContent = `Image ${galleryIndex + 1} of ${galleryData.length}`
    })
    resetZoom()
    if (lightbox) renderLightbox()
  }

  const MAX_ZOOM = 8
  const WHEEL_SENSITIVITY = 0.002
  const DOUBLE_CLICK_ZOOM = 1.7
  const zoomMedia = document.querySelector('[data-zoom-media]')
  const zoomImage = document.querySelector('[data-zoom-image]')
  const zoom = { scale: 1, tx: 0, ty: 0, gesture: null, pointers: new Map() }
  const clampZoom = (value) => Math.min(MAX_ZOOM, Math.max(1, value))

  const renderZoom = () => {
    if (!zoomMedia || !zoomImage) return
    zoom.tx = Math.min(0, Math.max(zoomMedia.clientWidth * (1 - zoom.scale), zoom.tx))
    zoom.ty = Math.min(0, Math.max(zoomMedia.clientHeight * (1 - zoom.scale), zoom.ty))
    zoomImage.style.transform =
      zoom.scale > 1 ? `translate(${zoom.tx}px, ${zoom.ty}px) scale(${zoom.scale})` : ''
    zoomImage.style.touchAction = zoom.scale > 1 ? 'none' : 'pan-y'
    zoomImage.style.cursor = zoom.scale > 1 ? 'grab' : ''
  }

  function resetZoom() {
    zoom.scale = 1
    zoom.pointers.clear()
    zoom.gesture = null
    renderZoom()
  }

  const localPoint = (event) => {
    const rect = zoomMedia.getBoundingClientRect()
    return {
      x: event.clientX - rect.left - zoomMedia.clientLeft,
      y: event.clientY - rect.top - zoomMedia.clientTop,
    }
  }

  const transformAround = (nextScale, from, anchor, target) => {
    zoom.scale = clampZoom(nextScale)
    zoom.tx = target.x - (anchor.x - from.tx) * (zoom.scale / from.scale)
    zoom.ty = target.y - (anchor.y - from.ty) * (zoom.scale / from.scale)
    renderZoom()
  }

  const gesturePoint = () => {
    const points = Array.from(zoom.pointers.values())
    return {
      x: points.reduce((sum, point) => sum + point.x, 0) / points.length,
      y: points.reduce((sum, point) => sum + point.y, 0) / points.length,
      distance:
        points.length > 1 ? Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y) : 0,
    }
  }

  const startGesture = () => {
    zoom.gesture = zoom.pointers.size
      ? { scale: zoom.scale, tx: zoom.tx, ty: zoom.ty, ...gesturePoint() }
      : null
  }

  const endPointer = (event) => {
    if (!zoom.pointers.delete(event.pointerId)) return
    startGesture()
  }

  if (zoomMedia && zoomImage) {
    zoomImage.style.transformOrigin = '0 0'
    zoomImage.style.userSelect = 'none'
    renderZoom()

    zoomMedia.addEventListener(
      'wheel',
      (event) => {
        const delta = event.deltaY * (event.deltaMode === 1 ? 16 : 1)
        const nextScale = clampZoom(zoom.scale * Math.exp(-delta * WHEEL_SENSITIVITY))
        if (nextScale === zoom.scale) return
        event.preventDefault()
        const point = localPoint(event)
        transformAround(nextScale, zoom, point, point)
      },
      { passive: false }
    )
    zoomImage.addEventListener('dblclick', (event) => {
      const point = localPoint(event)
      transformAround(zoom.scale * DOUBLE_CLICK_ZOOM, zoom, point, point)
    })
    zoomImage.addEventListener('pointerdown', (event) => {
      if (event.pointerType === 'mouse' && event.button !== 0) return
      zoom.pointers.set(event.pointerId, localPoint(event))
      if (event.pointerType === 'mouse') zoomImage.setPointerCapture(event.pointerId)
      startGesture()
    })
    zoomImage.addEventListener('pointermove', (event) => {
      const gesture = zoom.gesture
      if (!gesture || !zoom.pointers.has(event.pointerId)) return
      zoom.pointers.set(event.pointerId, localPoint(event))
      if (zoom.pointers.size < 2 && zoom.scale === 1) return
      const current = gesturePoint()
      const nextScale =
        zoom.pointers.size > 1 && gesture.distance
          ? gesture.scale * (current.distance / gesture.distance)
          : gesture.scale
      transformAround(nextScale, gesture, gesture, current)
    })
    zoomImage.addEventListener('pointerup', endPointer)
    zoomImage.addEventListener('pointercancel', endPointer)
    window.addEventListener('resize', renderZoom)
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
          <img src="${current.src}" alt="${imageAlt(current, galleryIndex)}" />
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
                      }" data-lb-index="${i}" aria-label="View image ${i + 1}"><img src="${image.src}" alt="${imageAlt(image, i)}" /></button>`
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

  const mobileSizePicker = document.querySelector('[data-mobile-size-picker]')
  const mobileSizeTrigger = mobileSizePicker?.querySelector('.mobileSizeTrigger')
  const mobileSizeOptions = mobileSizePicker?.querySelector('.mobileSizeOptions')

  const setMobileSizeOpen = (open) => {
    if (!mobileSizePicker) return
    mobileSizeOptions.hidden = !open
    mobileSizeTrigger.classList.toggle('mobileSizeTriggerOpen', open)
    mobileSizeTrigger.setAttribute('aria-expanded', String(open))
  }

  const selectVariant = (value) => {
    $$('.sizeOption').forEach((node) => {
      const selected = node.dataset.value === value
      node.classList.toggle('sizeOptionSelected', selected)
      node.setAttribute('aria-checked', String(selected))
    })
    let selectedOption = null
    $$('.mobileSizeOption').forEach((node) => {
      const selected = node.dataset.value === value
      node.classList.toggle('mobileSizeOptionSelected', selected)
      node.setAttribute('aria-selected', String(selected))
      if (selected) selectedOption = node
    })
    if (selectedOption) {
      mobileSizePicker.querySelector('.mobileSizeSelected').innerHTML = selectedOption.innerHTML
    }
    const sku = document.querySelector(`.sizeOption[data-value="${CSS.escape(value)}"]`)?.dataset.sku
    if (sku) {
      $$('[data-catalog]').forEach((node) => {
        node.textContent = sku
      })
      $$('[data-copy]').forEach((node) => {
        node.dataset.copy = sku
      })
    }
  }

  $$('.optionList').forEach((list) => {
    list.addEventListener('click', (event) => {
      const option = event.target.closest('.sizeOption')
      if (!option || option.disabled) return
      selectVariant(option.dataset.value)
    })
  })

  mobileSizeTrigger?.addEventListener('click', () => setMobileSizeOpen(mobileSizeOptions.hidden))
  mobileSizeOptions?.addEventListener('click', (event) => {
    const option = event.target.closest('.mobileSizeOption')
    if (!option || option.disabled) return
    selectVariant(option.dataset.value)
    setMobileSizeOpen(false)
  })
  document.addEventListener('pointerdown', (event) => {
    if (mobileSizePicker && !mobileSizePicker.contains(event.target)) setMobileSizeOpen(false)
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
})()
