import { mkdirSync, writeFileSync } from 'node:fs'

import { products } from './data.mjs'
import { MAX_HERO_FACTS, getPdpBrandConfig, resolveBrandKey } from './src/pdpBrandConfig.ts'
import { getPdpBrandContent } from './src/pdpBrandContent.ts'
import { buildFacts, findProperty, getPropertyValues } from './src/pdpProperties.ts'
import { getSpecGroups } from './src/pdpSpecGroups.ts'

const SITE = 'https://www.fortislife.com'

const esc = (value) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

const siteHref = (href) => (href?.startsWith('/') ? `${SITE}${href}` : href)

const assetHref = (path) => {
  if (path?.startsWith('/pdp/services/')) return `../assets/img/services/${path.split('/').pop()}`
  if (path?.startsWith('/pdp/resources/')) return `../assets/img/resources/${path.split('/').pop()}`
  return path
}

const productHref = (data) => `${SITE}/product/${data.productCode}`

const toProperties = (map) =>
  Object.entries(map).map(([fqn, [name, value]]) => ({
    attributeFQN: fqn,
    attributeDetail: { name },
    values: [{ value, stringValue: value }],
  }))

const Arrow = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M6 3.5 10.5 8 6 12.5" /></svg>'
const CheckIcon =
  '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 8.5 6.5 11.5 12.5 5" /></svg>'
const DocIcon =
  '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" /><path d="M14 3v5h5" /></svg>'
const TruckIcon =
  '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h11v9H3z" /><path d="M14 9h4l3 3v3h-7z" /><circle cx="7" cy="17.5" r="1.8" /><circle cx="17" cy="17.5" r="1.8" /></svg>'
const ChatIcon =
  '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h14a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H10l-4 4v-4H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z" /><path d="M9 9h.01M12 9h.01M15 9h.01" /></svg>'
const GlobeIcon =
  '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 2.7 3.5 5.7 3.5 9s-1 6.3-3.5 9c-2.5-2.7-3.5-5.7-3.5-9s1-6.3 3.5-9z" /></svg>'
const SUPPORT_ICONS = { truck: TruckIcon, chat: ChatIcon, globe: GlobeIcon }

const logo = (brand, white = false) =>
  `../assets/img/logos/${brand}-logo${white ? '-white' : ''}.png`

const renderPage = (data) => {
  const brandKey = resolveBrandKey(data.brand)
  const brandConfig = getPdpBrandConfig(brandKey)
  const brandContent = getPdpBrandContent(brandKey)
  const product = { properties: toProperties(data.properties) }
  const prop = (fqn) => getPropertyValues(findProperty(product, fqn))
  const catalogNumber = data.catalogNumber
  const heroTitle = data.title
  const heroFacts = buildFacts(product, brandConfig.heroFacts, MAX_HERO_FACTS - 1)
  const priceVisible = data.skuStatusText === 'CustomCTA' ? Boolean(data.showPrices) : true
  const showAddToCart = data.skuStatusText === 'Active'

  const chips = []
  if (data.validationText) chips.push({ label: 'Validated: See How >', variant: 'primary', validation: true })
  const categoryLabel = prop('tenant~web-category-list')[0]
  if (categoryLabel) chips.push({ label: categoryLabel, variant: 'outline' })

  const documents = data.documents ?? []
  const hasDocuments = documents.length > 0
  const hasCitations =
    Boolean(data.citations?.length) && data.productType === 'Antibody-Configurable'
  const currentLot = prop('tenant~current-lot-variant')[0]

  const seenSpecLabels = new Set()
  const hasContentsVariant = prop('tenant~contents-variant').length > 0
  const specGroups = getSpecGroups(brandKey).map((group) => {
    const rows = []
    for (const config of group.rows) {
      if (config.fqn === 'tenant~contents' && hasContentsVariant) continue
      const property = findProperty(product, config.fqn)
      const values = getPropertyValues(property)
      const value = values.join(', ')
      if (!value) continue
      const label =
        config.labelOverride ||
        brandConfig.specLabelOverrides[config.fqn] ||
        property?.attributeDetail?.name ||
        ''
      if (!label || seenSpecLabels.has(label)) continue
      seenSpecLabels.add(label)
      const items = config.separator ? values.flatMap((entry) => entry.split(config.separator)) : values
      rows.push({
        key: config.fqn,
        label,
        value,
        items: items.map((item) => item.trim()).filter(Boolean),
        config,
      })
    }
    return { ...group, resolvedRows: rows }
  })
  const hasSpecs = specGroups.some((group) => group.resolvedRows.length > 0)

  const applicationText = prop('tenant~application-text')[0]
  const dilutionRows = data.dilutionRows ?? []
  const hasApplications = Boolean(applicationText) || dilutionRows.length > 0
  const productionText = prop('tenant~production-epitope')[0] || prop('tenant~prodprocedures-1')[0]

  const supportRows = brandContent.supportRows
    .map(
      (row) => `
      <a class="supportRow" href="${esc(siteHref(row.href))}">
        <span class="supportIcon">${SUPPORT_ICONS[row.icon]}</span>
        <span>
          <span class="supportTitle">${esc(row.title)}</span>
          <span class="supportSub">${esc(row.subtitle)}</span>
        </span>
        <span class="supportArrow">${Arrow}</span>
      </a>`
    )
    .join('')

  const selected = data.variants[0]?.value
  const variantPicker = data.variants.length
    ? `
      <div class="optionPicker">
        <div class="optionList" role="radiogroup">
          ${data.variants
            .map(
              (option) => `
          <button type="button" role="radio" aria-checked="${option.value === selected}" data-value="${esc(option.value)}" data-sku="${esc(option.sku)}" class="sizeOption ${option.value === selected ? 'sizeOptionSelected' : ''}">
            <span class="optionRadio" aria-hidden="true"></span>
            <span class="sizeMain">${esc(option.label)}</span>
            ${option.sku ? `<span class="sizeSku">${esc(option.sku)}</span>` : ''}
            ${priceVisible && option.price ? `<span class="sizePrice">${esc(option.price)}</span>` : ''}
          </button>`
            )
            .join('')}
        </div>
      </div>`
    : ''

  const qtyControl = (className) => `
          <div class="${className}">
            <button type="button" data-qty="-1" aria-label="Decrease quantity">−</button>
            <span data-qty-value>1</span>
            <button type="button" data-qty="1" aria-label="Increase quantity">+</button>
          </div>`

  const buyPanel = `
    <div class="buyPanel">
      ${variantPicker}
      <div style="margin-top: 14px">
        ${
          data.inventoryMessage
            ? `<div class="inventory-message">${TruckIcon}<span>${esc(data.inventoryMessage)}</span></div>`
            : ''
        }
      </div>
      ${
        data.skuStatusText === 'CustomCTA'
          ? `<a href="${esc(siteHref(data.ctaHref))}" class="buyBtn custom-CTA-button" style="margin-top: 12px; width: 100%">${esc(data.customCTALabel)}</a>`
          : ''
      }
      ${
        showAddToCart
          ? `<div class="buyRow buyRowActive">
          <button type="button" class="buyBtn add-to-cart-button">Add to Cart</button>
          ${qtyControl('qty')}
        </div>`
          : ''
      }
      ${brandContent.secondaryCtas
        .map(
          (cta) =>
            `<a href="${esc(siteHref(cta.href))}" class="${cta.variant === 'filled' ? 'sampleBtn' : 'bulkBtn'}">${esc(cta.label)}</a>`
        )
        .join('')}
    </div>`

  const gallery = data.gallery
  const hasImages = gallery.length > 0
  const mainSrc = hasImages ? gallery[0].src : logo(data.brand)
  const galleryHtml = `
      <div class="mediaMain${hasImages ? ' mediaZoomable' : ''}"${hasImages ? ' data-zoom-media' : ''}>
        <img data-gallery-main${hasImages ? ' data-zoom-image draggable="false"' : ''} src="${esc(mainSrc)}" alt="${esc(hasImages ? gallery[0].alt : '')}" />
        ${hasImages && gallery[0].description ? '<button type="button" class="mediaInfoDot" data-lightbox-open aria-label="View image details">i</button>' : ''}
        ${
          hasImages
            ? `<button type="button" class="zoom" data-zoom-toggle aria-label="Zoom in" aria-pressed="false">
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /><path data-zoom-icon d="M8 11h6M11 8v6" /></svg>
        </button>`
            : ''
        }
      </div>
      ${
        gallery.length > 1
          ? `<div class="thumbRow">${gallery
              .map(
                (image, i) =>
                  `<button type="button" class="thumb ${i === 0 ? 'thumbActive' : ''}" data-gallery-thumb="${i}" aria-label="View image ${i + 1}"><img src="${esc(image.src)}" alt="${esc(image.alt)}" /></button>`
              )
              .join('')}</div>`
          : ''
      }
      ${
        hasImages
          ? `<div class="galleryMeta">
          <span data-gallery-count>Image 1 of ${gallery.length}</span>
          <button type="button" class="detail" data-lightbox-open><span class="dot">i</span><span>View details</span></button>
        </div>`
          : ''
      }`

  const mediaCardInner = `
      <div class="mediaTop">
        ${galleryHtml}
        <div class="mediaCodeRow">
          <span class="mediaSku" data-catalog>${esc(catalogNumber)}</span>
          <button type="button" class="copyChip" data-copy="${esc(catalogNumber)}">Copy</button>
        </div>
        ${
          hasDocuments || hasCitations
            ? `<div class="mediaLinkRow">
          ${
            hasDocuments
              ? `<a href="#document-section" data-scroll-to="document-section">${DocIcon}<span>${
                  brandConfig.documentsLinkWithCode ? `Documents (${esc(catalogNumber)})` : 'Product Documents'
                }</span></a>`
              : ''
          }
          ${
            hasCitations
              ? `<a href="#citation-document-section" data-scroll-to="citation-document-section">${DocIcon}<span>Citations (${data.citations.length})</span></a>`
              : ''
          }
        </div>`
            : ''
        }
      </div>
      ${buyPanel}
      <div class="supportPanel">${supportRows}</div>`

  const brandCardContent = brandContent.brandCard
  const brandCardInner = brandCardContent
    ? `
      ${brandCardContent.stars ? '<p class="stars" aria-hidden="true">★★★★★</p>' : ''}
      ${
        brandConfig.brandCardLogoVariant === 'fortisPlusBrand'
          ? `<div class="brandLogosRow"><img class="brandLogoFortis" src="${logo('fortis', true)}" alt="Fortis" /><img class="brandLogoBrand" src="${logo(data.brand, true)}" alt="${esc(data.brandName)}" /></div>`
          : ''
      }
      ${
        brandConfig.brandCardLogoVariant === 'brandOnly'
          ? `<img class="brandLogoSolo" src="${logo(data.brand, true)}" alt="${esc(data.brandName)}" />`
          : ''
      }
      ${brandCardContent.benefits
        .map(
          (benefit) =>
            `<div class="benefit"><span class="check">${CheckIcon}</span><span>${esc(benefit)}</span></div>`
        )
        .join('')}`
    : ''
  const brandCard = brandCardContent
    ? brandCardContent.href
      ? `<a class="brandCard" href="${esc(brandCardContent.href)}">${brandCardInner}</a>`
      : `<div class="brandCard">${brandCardInner}</div>`
    : ''

  const sectionNodes = {
    description: data.shortDescription
      ? `
      <section class="description">
        <h2 class="heading">Product Description</h2>
        <div class="clamp">${data.shortDescription}</div>
        <button type="button" class="seeMore" data-see-more><span>See more</span>${Arrow}</button>
      </section>`
      : '',
    pairing: data.pairing?.length
      ? `
      <section class="section">
        <h2 class="heading">Pairing</h2>
        <div class="pairingTrack">
          ${data.pairing
            .map(
              (item) =>
                `<a class="pairingCard" href="${productHref(item)}"><span><strong>${esc(item.productCode)}</strong> ${esc(item.title)}</span>${Arrow}</a>`
            )
            .join('')}
        </div>
      </section>`
      : '',
    specs: hasSpecs
      ? `
      <section class="section">
        <h2 class="heading">Specifications</h2>
        <div class="specTable">
          ${specGroups
            .map((group) =>
              group.resolvedRows.length === 0
                ? ''
                : `<div>
            ${group.label ? `<div class="specGroup">${esc(group.label)}</div>` : ''}
            ${group.resolvedRows
              .map((row) => {
                let value
                if (row.config.render === 'link' && row.config.href) {
                  const href = siteHref(row.config.href(row.value))
                  value = `<a class="specLink" href="${esc(href)}" target="_blank" rel="noreferrer"><span>${esc(row.value)}</span>${Arrow}</a>`
                } else if (row.config.render === 'list') {
                  value = `<div class="specValue specRowAlt"><ul class="specList">${row.items
                    .map((item) => `<li>${esc(item)}</li>`)
                    .join('')}</ul></div>`
                } else if (row.config.render === 'html') {
                  value = `<div class="specValue specRowAlt">${row.value}</div>`
                } else {
                  value = `<div class="specValue">${esc(row.value)}</div>`
                }
                return `<div class="specRow"><span class="specLabel">${esc(row.label)}</span>${value}</div>`
              })
              .join('')}
          </div>`
            )
            .join('')}
        </div>
      </section>`
      : '',
    production: productionText
      ? `
      <section class="section">
        <h2 class="heading">${esc(brandConfig.productionHeading)}</h2>
        <p class="copy">${productionText}</p>
      </section>`
      : '',
    applications: hasApplications
      ? `
      <section class="section">
        <h2 class="heading">Applications</h2>
        ${applicationText ? `<p class="copy">${applicationText}</p>` : ''}
        ${
          dilutionRows.length
            ? `<div class="applicationTable">${dilutionRows
                .map(
                  (row) =>
                    `<div class="applicationRow"><span class="applicationLabel">${esc(row.Application)}</span><span class="applicationValue">${esc(row.ApplicationDilutionRange)}</span></div>`
                )
                .join('')}</div>`
            : ''
        }
      </section>`
      : '',
    documents: hasDocuments
      ? `
      <section class="documents" id="document-section">
        <h2 class="heading">Documents</h2>
        ${documents
          .map((doc) => {
            const lotLabel = doc.lot ? `${doc.lot}${doc.lot === currentLot ? ' (current lot)' : ''}` : null
            return `<a class="documentLink" href="${esc(doc.href)}"${doc.href === '#' ? '' : ' target="_blank" rel="noreferrer"'}>
          <div class="documentRow">
            <span class="docIcon">${DocIcon}</span>
            <span>
              <span class="docTitle">${doc.assettype === 'Datasheet' ? 'Product Datasheet' : 'Safety Data Sheet'}</span>
              <span class="docSub">PDF · ${esc(catalogNumber)}${lotLabel ? ` · Lot ${esc(lotLabel)}` : ''}</span>
            </span>
            <span class="docAction"><span>Open</span>${Arrow}</span>
          </div>
        </a>`
          })
          .join('')}
      </section>`
      : '',
    citations: hasCitations
      ? `
      <section class="citations" id="citation-document-section">
        <h2 class="heading">Citations / Publications</h2>
        <div class="citationTrack">
          <div class="cite-list">
            ${data.citations
              .map(
                (citation, i) => `
            <article class="cite-item">
              <span class="cite-num">${String(i + 1).padStart(2, '0')}</span>
              <div>
                <h3 class="cite-title">${esc(citation.title)}</h3>
                <p class="cite-meta">${esc(citation.meta)}</p>
                <p class="cite-abstract">${esc(citation.abstract)}</p>
                <div class="cite-tags">${citation.tags.map((tag) => `<span>${esc(tag)}</span>`).join('')}</div>
                <a class="cite-link" href="https://pubmed.ncbi.nlm.nih.gov/?term=${encodeURIComponent(citation.title)}" target="_blank" rel="noreferrer">Read Publication ${Arrow}</a>
              </div>
            </article>`
              )
              .join('')}
          </div>
        </div>
      </section>`
      : '',
    publicationCta: brandContent.publicationCta
      ? `
      <section class="publicationCta">
        <span class="ctaCopy">
          <strong>${esc(brandContent.publicationCta.title)}</strong>
          <span>${esc(brandContent.publicationCta.copy)}</span>
        </span>
        <a class="ctaLink" href="${esc(siteHref(brandContent.publicationCta.href))}"><span>${esc(brandContent.publicationCta.ctaLabel)}</span>${Arrow}</a>
      </section>`
      : '',
    related: data.related?.length
      ? `
      <section class="section">
        <h2 class="heading">Related Products</h2>
        <div class="relatedGrid">
          ${data.related
            .map(
              (item) => `
          <article class="relatedCard">
            <div>
              ${brandConfig.relatedCardVariant === 'branded' && item.brand ? `<div class="relatedBrand">${esc(item.brand)}</div>` : ''}
              <h3>${esc(item.title)}</h3>
              <div class="relatedSku">${esc(item.productCode)}</div>
            </div>
            <a href="${productHref(item)}"><span>${esc(brandContent.relatedCtaLabel)}</span>${Arrow}</a>
          </article>`
            )
            .join('')}
        </div>
      </section>`
      : '',
    services: brandContent.services.length
      ? `
      <section class="section">
        <h2 class="heading">Services</h2>
        <div class="servicesGrid">
          ${brandContent.services
            .map(
              (service) => `
          <a class="serviceCard" href="${esc(siteHref(service.href))}">
            <div class="formatTitle">${esc(service.title)}</div>
            <p>${esc(service.copy)}</p>
            <span class="formatLink"><span>${esc(service.ctaLabel)}</span>${Arrow}</span>
            ${service.art ? `<span class="antibodyArt" aria-hidden="true"><img src="${esc(assetHref(service.art))}" alt="" /></span>` : ''}
          </a>`
            )
            .join('')}
        </div>
      </section>`
      : '',
    resources: brandContent.resources.length
      ? `
      <section class="section">
        <h2 class="heading">Resources</h2>
        <div class="resourcesGrid">
          ${brandContent.resources
            .map(
              (resource) => `
          <article class="resourceCard">
            <img class="resourceIcon" src="${esc(assetHref(resource.icon))}" alt="" />
            <h3>${esc(resource.title)}</h3>
            <a href="${esc(siteHref(resource.href))}"><span>${esc(resource.ctaLabel)}</span>${Arrow}</a>
          </article>`
            )
            .join('')}
        </div>
      </section>`
      : '',
  }

  const breadcrumbs = `
      <nav class="breadcrumbs" aria-label="Breadcrumb">
        ${data.breadcrumbs
          .map(
            (crumb) =>
              `<span><a href="${esc(siteHref(crumb.link))}">${esc(crumb.text)}</a><span aria-hidden="true"> / </span></span>`
          )
          .join('')}
        <span aria-current="page">${esc(heroTitle)}</span>
      </nav>`

  const heroFactsHtml = `
      <div class="heroFacts">
        <div class="heroFact"><span>Catalog #</span><strong data-catalog>${esc(catalogNumber)}</strong></div>
        ${heroFacts
          .map((fact) => `<div class="heroFact"><span>${esc(fact.label)}</span><strong>${esc(fact.value)}</strong></div>`)
          .join('')}
      </div>`

  const chipsHtml = chips.length
    ? `<div class="chips">${chips
        .map((chip) =>
          chip.validation
            ? `<button type="button" class="chip ${chip.variant === 'primary' ? 'chipPrimary' : 'chipOutline'}" data-validation-open>${esc(chip.label)}</button>`
            : `<span class="chip ${chip.variant === 'primary' ? 'chipPrimary' : 'chipOutline'}">${esc(chip.label)}</span>`
        )
        .join('')}</div>`
    : ''

  const mobileCta = showAddToCart
    ? `<button type="button" class="mobileCartBtn">Add to Cart</button>${qtyControl('mobileFixedQty')}`
    : data.skuStatusText === 'CustomCTA'
      ? `<a href="${esc(siteHref(data.ctaHref))}" class="mobileCartBtn">${esc(data.customCTALabel)}</a>`
      : ''

  const validationModal = data.validationText
    ? `
    <div class="validation-modal" id="validation-modal" hidden>
      <div class="validation-box" role="dialog" aria-modal="true" aria-label="Validation details">
        <div class="validation-head"><span>${esc(heroTitle)}</span><button type="button" data-validation-close aria-label="close">×</button></div>
        <div>${data.validationText}</div>
        <a class="validation-more" href="${SITE}/antibody-validation">Learn more about the validation performed ›</a>
      </div>
    </div>`
    : ''

  const body = `
  <div class="page" data-brand="${brandKey}">
    <div class="container">
      ${breadcrumbs}
      <div class="heroGrid">
        <div class="heroCopy">
          <div class="eyebrow">${esc(data.brandName)}</div>
          <div class="titleLine"><h1 class="title">${esc(heroTitle)}</h1></div>
          ${chipsHtml}
          ${heroFactsHtml}
          <div class="mobileGalleryMount"><div class="mediaCard">${mediaCardInner}</div></div>
          ${brandConfig.leftSections.map((id) => sectionNodes[id]).join('')}
        </div>
        <aside class="rail">
          <div class="mediaCard">${mediaCardInner}</div>
          ${brandCard}
        </aside>
      </div>
      ${brandConfig.belowSections.map((id) => sectionNodes[id]).join('')}
    </div>

    <div class="mobilePurchase">
      <div class="mobileDrawer">
        <div class="mobileDrawerScroll">
          <div class="mobileSupportWrap"><div class="supportPanel">${supportRows}</div></div>
          <div class="mobileBrandWrap">${brandCard}</div>
        </div>
      </div>
      <div class="mobileBar mobileBarActive">
        <button type="button" class="mobileDrawerToggle" aria-expanded="false">
          <span class="mobileSupportLabel">More support options</span>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 15l6-6 6 6" /></svg>
        </button>
        ${mobileCta}
      </div>
    </div>
    ${validationModal}
  </div>`

  return shell({
    slug: data.slug,
    title: `${data.brandName} ${heroTitle} (${catalogNumber})`,
    description: `${data.brandName} ${heroTitle}`,
    body,
    gallery,
  })
}

const header = (slug, prefix) => `
  <header class="site-header" id="fixed-header-wrapper">
    <div class="site-header-inner">
      <a class="site-logo" href="${prefix}"><img src="${prefix}assets/img/logos/fortis-logo.png" alt="Fortis Life Sciences" /></a>
      <nav class="site-nav"><span>Products</span><span>Services</span><span>Learning Center</span><span>About Fortis</span></nav>
      <div class="site-tools">
        <div class="site-search"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>Search</div>
        <span class="site-icon"><svg viewBox="0 0 24 24"><path d="M3 4h2l2.4 11.2a1 1 0 0 0 1 .8h8.9a1 1 0 0 0 1-.8L20 8H6.2" /><circle cx="9" cy="20" r="1.3" /><circle cx="17" cy="20" r="1.3" /></svg></span>
        <span class="site-icon"><svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" /><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" /></svg></span>
        <a class="site-contact" href="${SITE}/contact-us">Contact</a>
      </div>
    </div>
  </header>`

const footerColumn = (title, links) =>
  `<div><h4>${title}</h4>${links.map((link) => `<a href="${SITE}">${link}</a>`).join('')}</div>`

const footer = (prefix) => `
  <footer class="site-footer">
    <div class="site-footer-inner">
      <img class="site-footer-logo" src="${prefix}assets/img/logos/fortis-logo-white.png" alt="Fortis Life Sciences" />
      <div class="site-footer-grid">
        <div>
          <a href="mailto:info@fortislife.com">info@fortislife.com</a>
          <a href="tel:18003389579">1.800.338.9579</a>
        </div>
        ${footerColumn('About Fortis', ['Latest News &amp; Developments', 'The Fortis Difference', 'Quality Standards', 'Distributors', 'Careers', 'Contact Us'])}
        ${footerColumn('Products', ['Antibodies &amp; Antigens', 'Assays &amp; Kits', 'Bulk &amp; OEM', 'Lateral Flow Reagents', 'Nanoparticles', 'VHH Libraries'])}
        ${footerColumn('Services', ['Antibody Services', 'Diagnostics Services', 'Viral Vector Services'])}
      </div>
      <div class="site-footer-bottom">
        <nav><span>Privacy Policy</span><span>Site Use Terms</span><span>Sales Terms and Conditions</span></nav>
        <span>Copyright © 2026 Fortis Life Science, LLC. All Rights Reserved.</span>
      </div>
    </div>
  </footer>`

const shell = ({ slug, title, description, body, gallery, prefix = '../' }) => `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="robots" content="noindex" />
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="${prefix}assets/site.css" />
  ${gallery ? `<link rel="stylesheet" href="${prefix}assets/pdp.css" />` : ''}
</head>
<body>
  ${header(slug, prefix)}
  ${body}
  ${footer(prefix)}
  ${
    gallery
      ? `<script type="application/json" id="pdp-gallery">${JSON.stringify(gallery).replace(/</g, '\\u003c')}</script>
  <script src="${prefix}assets/pdp.js"></script>`
      : ''
  }
</body>
</html>
`

const indexPage = () =>
  shell({
    slug: null,
    prefix: './',
    title: 'Fortis Product Pages',
    description: 'Product detail pages for Arista, Bethyl and AbCore.',
    gallery: null,
    body: `
  <main class="index">
    <style>
      .index { width: min(1152px, calc(100% - 32px)); margin: 0 auto; padding: 56px 0 24px; }
      .index-eyebrow { font-size: 12px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; color: #30299a; }
      .index h1 { margin: 10px 0 8px; font-size: 34px; letter-spacing: -0.6px; line-height: 1.2; }
      .index > p { margin: 0; color: #5c5a70; max-width: 640px; line-height: 1.6; }
      .index-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 20px; margin-top: 36px; }
      .index-card { display: flex; flex-direction: column; gap: 14px; padding: 24px; border: 1px solid #eaeaf1; border-radius: 18px; color: inherit; text-decoration: none; transition: border-color .18s, box-shadow .18s; }
      .index-card:hover { border-color: #30299a; box-shadow: 0 18px 42px -34px rgba(36, 30, 122, .5); }
      .index-card img { height: 40px; width: auto; align-self: flex-start; }
      .index-card strong { font-size: 16px; line-height: 1.4; }
      .index-card span { color: #5c5a70; font-size: 13px; }
      .index-card em { margin-top: auto; font-style: normal; color: #30299a; font-weight: 700; font-size: 14px; }
      @media (max-width: 760px) { .index-grid { grid-template-columns: 1fr; } .index h1 { font-size: 26px; } }
    </style>
    <div class="index-eyebrow">Fortis Life Sciences</div>
    <h1>Product Detail Page Redesign</h1>
    <p>One example product per brand, rendered with the same layout, styles and brand rules as the redesigned product page in the storefront.</p>
    <div class="index-grid">
      ${Object.values(products)
        .map(
          (item) => `
      <a class="index-card" href="./${item.slug}/">
        <img src="./assets/img/logos/${item.brand}-logo.png" alt="${esc(item.brandName)}" />
        <strong>${esc(item.title)}</strong>
        <span>${esc(item.catalogNumber)}</span>
        <em>View product ›</em>
      </a>`
        )
        .join('')}
    </div>
  </main>`,
  })

for (const item of Object.values(products)) {
  mkdirSync(item.slug, { recursive: true })
  writeFileSync(`${item.slug}/index.html`, renderPage(item))
}
writeFileSync('index.html', indexPage())
console.log('Built', Object.keys(products).join(', '))
