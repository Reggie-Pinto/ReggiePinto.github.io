/**
 * Only Persians - Public Pages JavaScript
 * Renders dynamic content (cats, contact info) from localStorage data.
 * Supports multi-image carousel on cat cards.
 */

document.addEventListener('DOMContentLoaded', function () {

    // ── Year ──────────────────────────────────────────────────────────────────
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // ── Mobile Nav Toggle ─────────────────────────────────────────────────────
    const navToggle = document.getElementById('navToggle');
    const navMenu   = document.getElementById('navMenu');
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function () { navMenu.classList.toggle('open'); });
    }

    // ── Load Contact Info ─────────────────────────────────────────────────────
    loadContactInfo();

    // ── Render Featured Cats (Home Page) ──────────────────────────────────────
    const featuredGrid = document.getElementById('featuredCatsGrid');
    if (featuredGrid) {
        renderFeaturedCats(featuredGrid);
    }

    // ── Render All Cats (Gallery Page) ────────────────────────────────────────
    const allCatsGrid = document.getElementById('allCatsGrid');
    if (allCatsGrid) {
        renderAllCats(allCatsGrid);
    }

    // ── Load Site Settings ────────────────────────────────────────────────────
    loadSiteSettings();
});

// ─────────────────────────────────────────────────────────────────────────────
// Contact Info
// ─────────────────────────────────────────────────────────────────────────────
function loadContactInfo() {
    var c = PP.getContact();

    // Footer
    setInnerText('footerPhone',   '\uD83D\uDCDE ' + c.phone);
    setInnerText('footerEmail',   '\u2709\uFE0F ' + c.email);
    setInnerText('footerAddress', '\uD83D\uDCCD ' + c.address);
    setHref('footerFb', c.facebook);
    setHref('footerIg', c.instagram);
    setHref('footerWa', c.whatsapp);

    // Contact page
    setInnerText('contactPhone',   c.phone);
    setInnerText('contactEmail',   c.email);
    setInnerText('contactAddress', c.address);
    setInnerText('hoursWeekday',   c.hoursWeekday);
    setInnerText('hoursSat',       c.hoursSat);
    setInnerText('hoursSun',       c.hoursSun);
    setHref('socialFb', c.facebook);
    setHref('socialIg', c.instagram);
    setHref('socialWa', c.whatsapp);
    setInnerText('directPhone', c.phone);
    setInnerText('directEmail', c.email);

    // Hero image
    var heroBg = document.getElementById('heroBgImg');
    if (heroBg && c.heroImg) {
        heroBg.src = 'images/' + c.heroImg;
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Site Settings
// ─────────────────────────────────────────────────────────────────────────────
function loadSiteSettings() {
    var s = PP.getSettings();
    setInnerText('statFamilies', s.families || '50+');
    setInnerText('statYears',    s.years    || '8+');
}

// ─────────────────────────────────────────────────────────────────────────────
// Cat Card HTML builder — supports multi-image carousel
// ─────────────────────────────────────────────────────────────────────────────
function buildCatCard(cat, prefix) {
    prefix = prefix || '';
    var allImgs = PP.catAllImgs(cat, prefix);
    var badge   = cat.available
        ? '<span class="badge-available">Available</span>'
        : '<span class="badge-unavailable">Reserved</span>';
    var inquire = cat.available
        ? '<a href="' + prefix + 'contact.html" class="btn btn-primary btn-sm" onclick="event.stopPropagation()">Inquire Now</a>'
        : '<span class="btn btn-sm" style="background:#e0d0c0;color:#8B6355;cursor:default;">Reserved</span>';

    // Build image section: carousel if multiple images, single img otherwise
    var imgSection = '';
    if (allImgs.length > 1) {
        var uid = 'carousel_' + (cat.id || Math.random().toString(36).substr(2, 5));
        var slides = allImgs.map(function (src, i) {
            return '<div class="carousel-slide' + (i === 0 ? ' active' : '') + '">' +
                   '<img src="' + src + '" alt="' + cat.name + ' photo ' + (i + 1) + '" loading="lazy" onerror="this.src=\'' + prefix + 'images/cat-luna.jpg\'">' +
                   '</div>';
        }).join('');
        var dots = allImgs.map(function (_, i) {
            return '<span class="carousel-dot' + (i === 0 ? ' active' : '') + '" onclick="carouselGo(\'' + uid + '\',' + i + ')"></span>';
        }).join('');
        imgSection = '<div class="cat-card-img carousel" id="' + uid + '">' +
            slides +
            '<div class="cat-card-badge">' + badge + '</div>' +
            '<button class="carousel-prev" onclick="carouselStep(\'' + uid + '\',-1)" aria-label="Previous">&#8249;</button>' +
            '<button class="carousel-next" onclick="carouselStep(\'' + uid + '\',1)" aria-label="Next">&#8250;</button>' +
            '<div class="carousel-dots">' + dots + '</div>' +
            '</div>';
    } else {
        imgSection = '<div class="cat-card-img">' +
            '<img src="' + allImgs[0] + '" alt="' + cat.name + '" loading="lazy" onerror="this.src=\'' + prefix + 'images/cat-luna.jpg\'">' +
            '<div class="cat-card-badge">' + badge + '</div>' +
            '</div>';
    }

    return '<div class="cat-card" data-status="' + (cat.available ? 'available' : 'reserved') + '" data-catid="' + cat.id + '" onclick="openCatLightbox(\'' + cat.id + '\')" style="cursor:pointer;">' +
        imgSection +
        '<div class="cat-card-body">' +
            '<div class="cat-card-name">' + cat.name + '</div>' +
            '<div class="cat-card-meta">' + cat.breed + (cat.color ? ' &bull; ' + cat.color : '') + '</div>' +
            '<div class="cat-card-meta">' + (cat.gender || '') + (cat.age ? ' &bull; Age: ' + cat.age : '') + '</div>' +
            (cat.description ? '<div class="cat-card-meta" style="font-size:0.88rem;margin-top:6px;">' + cat.description + '</div>' : '') +
            '<div class="cat-card-price">' + (cat.price || 'Price on Request') + '</div>' +
            '<div class="cat-card-footer">' + inquire + '</div>' +
        '</div>' +
    '</div>';
}

// ─────────────────────────────────────────────────────────────────────────────
// Carousel Controls
// ─────────────────────────────────────────────────────────────────────────────
function carouselGo(uid, idx) {
    var el = document.getElementById(uid);
    if (!el) return;
    var slides = el.querySelectorAll('.carousel-slide');
    var dots   = el.querySelectorAll('.carousel-dot');
    slides.forEach(function (s, i) { s.classList.toggle('active', i === idx); });
    dots.forEach(function (d, i)   { d.classList.toggle('active', i === idx); });
    el._carouselIdx = idx;
}

function carouselStep(uid, dir) {
    var el = document.getElementById(uid);
    if (!el) return;
    var slides = el.querySelectorAll('.carousel-slide');
    var idx = (el._carouselIdx || 0) + dir;
    if (idx < 0) idx = slides.length - 1;
    if (idx >= slides.length) idx = 0;
    carouselGo(uid, idx);
}

// ─────────────────────────────────────────────────────────────────────────────
// Render Featured Cats (first 3 on home page)
// ─────────────────────────────────────────────────────────────────────────────
function renderFeaturedCats(container) {
    var cats = PP.getCats().slice(0, 3);
    container.innerHTML = cats.map(function (cat) { return buildCatCard(cat); }).join('');
}

// ─────────────────────────────────────────────────────────────────────────────
// Render All Cats (gallery page)
// ─────────────────────────────────────────────────────────────────────────────
function renderAllCats(container) {
    var cats = PP.getCats();
    container.innerHTML = cats.map(function (cat) { return buildCatCard(cat); }).join('');
}



// ─────────────────────────────────────────────────────────────────────────────
// Utility helpers
// ─────────────────────────────────────────────────────────────────────────────
function setInnerText(id, text) {
    var el = document.getElementById(id);
    if (el) el.textContent = text;
}

function setHref(id, href) {
    var el = document.getElementById(id);
    if (el && href && href !== '#') el.href = href;
}

// =============================================================================
// CAT DETAIL LIGHTBOX — opens when user clicks a cat card
// Shows ALL uploaded photos with carousel + thumbnail strip + cat info
// =============================================================================

var _lbIdx   = 0;   // current slide index
var _lbImgs  = [];  // all image sources for current cat

/**
 * Open the lightbox for a given cat ID.
 * Called from data-catid attribute on each cat card.
 */
function openCatLightbox(catId) {
    var cats = PP.getCats();
    var cat  = null;
    for (var i = 0; i < cats.length; i++) {
        if (String(cats[i].id) === String(catId)) { cat = cats[i]; break; }
    }
    if (!cat) return;

    _lbImgs = PP.catAllImgs(cat);
    _lbIdx  = 0;

    // ── Slides ────────────────────────────────────────────────────────────────
    var slidesEl = document.getElementById('lbSlides');
    if (slidesEl) {
        slidesEl.innerHTML = _lbImgs.map(function (src, i) {
            return '<div class="lb-slide' + (i === 0 ? ' active' : '') + '">' +
                   '<img src="' + src + '" alt="' + cat.name + ' photo ' + (i + 1) + '" ' +
                   'onerror="this.src=\'images/cat-luna.jpg\'">' +
                   '</div>';
        }).join('');
    }

    // ── Dots ──────────────────────────────────────────────────────────────────
    var dotsEl = document.getElementById('lbDots');
    if (dotsEl) {
        if (_lbImgs.length > 1) {
            dotsEl.innerHTML = _lbImgs.map(function (_, i) {
                return '<span class="lb-dot' + (i === 0 ? ' active' : '') + '" onclick="lbGo(' + i + ')"></span>';
            }).join('');
            dotsEl.style.display = 'flex';
        } else {
            dotsEl.innerHTML = '';
            dotsEl.style.display = 'none';
        }
    }

    // ── Counter ───────────────────────────────────────────────────────────────
    var counterEl = document.getElementById('lbCounter');
    if (counterEl) {
        counterEl.textContent = _lbImgs.length > 1 ? '1 / ' + _lbImgs.length : '';
    }

    // ── Prev / Next arrows ────────────────────────────────────────────────────
    var prevBtn = document.getElementById('lbPrev');
    var nextBtn = document.getElementById('lbNext');
    if (prevBtn) prevBtn.style.display = _lbImgs.length > 1 ? 'flex' : 'none';
    if (nextBtn) nextBtn.style.display = _lbImgs.length > 1 ? 'flex' : 'none';

    // ── Thumbnail strip ───────────────────────────────────────────────────────
    var thumbsEl = document.getElementById('lbThumbs');
    if (thumbsEl) {
        if (_lbImgs.length > 1) {
            thumbsEl.innerHTML = _lbImgs.map(function (src, i) {
                return '<img src="' + src + '" class="lb-thumb' + (i === 0 ? ' active' : '') + '" ' +
                       'onclick="lbGo(' + i + ')" alt="Thumbnail ' + (i + 1) + '" ' +
                       'onerror="this.src=\'images/cat-luna.jpg\'">';
            }).join('');
            thumbsEl.style.display = 'flex';
        } else {
            thumbsEl.innerHTML = '';
            thumbsEl.style.display = 'none';
        }
    }

    // ── Badge ─────────────────────────────────────────────────────────────────
    var badgeEl = document.getElementById('lbBadge');
    if (badgeEl) {
        badgeEl.textContent  = cat.available ? 'Available' : 'Reserved';
        badgeEl.className    = 'lb-badge ' + (cat.available ? 'badge-available' : 'badge-unavailable');
    }

    // ── Name ──────────────────────────────────────────────────────────────────
    var nameEl = document.getElementById('lbName');
    if (nameEl) nameEl.textContent = cat.name;

    // ── Meta table ────────────────────────────────────────────────────────────
    var metaEl = document.getElementById('lbMetaTable');
    if (metaEl) {
        var rows = [];
        if (cat.breed)  rows.push('<tr><th>Breed</th><td>' + cat.breed + '</td></tr>');
        if (cat.color)  rows.push('<tr><th>Colour</th><td>' + cat.color + '</td></tr>');
        if (cat.gender) rows.push('<tr><th>Gender</th><td>' + cat.gender + '</td></tr>');
        if (cat.age)    rows.push('<tr><th>Age</th><td>' + cat.age + '</td></tr>');
        if (cat.vaccinated !== undefined) rows.push('<tr><th>Vaccinated</th><td>' + (cat.vaccinated ? 'Yes' : 'No') + '</td></tr>');
        if (cat.microchipped !== undefined) rows.push('<tr><th>Microchipped</th><td>' + (cat.microchipped ? 'Yes' : 'No') + '</td></tr>');
        metaEl.innerHTML = rows.join('');
    }

    // ── Description ───────────────────────────────────────────────────────────
    var descEl = document.getElementById('lbDesc');
    if (descEl) {
        descEl.textContent = cat.description || '';
        descEl.style.display = cat.description ? '' : 'none';
    }

    // ── Price ─────────────────────────────────────────────────────────────────
    var priceEl = document.getElementById('lbPrice');
    if (priceEl) priceEl.textContent = cat.price || 'Price on Request';

    // ── Inquire button ────────────────────────────────────────────────────────
    var inquireBtn = document.getElementById('lbInquire');
    if (inquireBtn) {
        if (cat.available) {
            inquireBtn.style.display = '';
        } else {
            inquireBtn.style.display = 'none';
        }
    }

    // ── Show overlay ──────────────────────────────────────────────────────────
    var overlay = document.getElementById('catLightbox');
    if (overlay) {
        overlay.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
}

/** Navigate to a specific slide index */
function lbGo(idx) {
    if (idx < 0) idx = _lbImgs.length - 1;
    if (idx >= _lbImgs.length) idx = 0;
    _lbIdx = idx;

    // Slides
    var slides = document.querySelectorAll('.lb-slide');
    slides.forEach(function (s, i) { s.classList.toggle('active', i === idx); });

    // Dots
    var dots = document.querySelectorAll('.lb-dot');
    dots.forEach(function (d, i) { d.classList.toggle('active', i === idx); });

    // Thumbnails
    var thumbs = document.querySelectorAll('.lb-thumb');
    thumbs.forEach(function (t, i) { t.classList.toggle('active', i === idx); });

    // Counter
    var counterEl = document.getElementById('lbCounter');
    if (counterEl && _lbImgs.length > 1) {
        counterEl.textContent = (idx + 1) + ' / ' + _lbImgs.length;
    }
}

/** Step forward or backward */
function lbStep(dir) {
    lbGo(_lbIdx + dir);
}

/** Close when clicking the backdrop (outside the box) */
function closeLightbox(event) {
    if (event.target === document.getElementById('catLightbox')) {
        closeLightboxBtn();
    }
}

/** Close the lightbox */
function closeLightboxBtn() {
    var overlay = document.getElementById('catLightbox');
    if (overlay) {
        overlay.classList.remove('open');
        document.body.style.overflow = '';
    }
}

// Close on Escape key
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeLightboxBtn();
});
