/**
 * Only Persians - Admin Panel JavaScript
 * Handles login, cat management, contact info editing, and settings.
 * All data persisted in localStorage — no server required.
 */

// ── Auth ──────────────────────────────────────────────────────────────────────
function doLogin() {
    const user = document.getElementById('loginUser').value.trim();
    const pass = document.getElementById('loginPass').value;
    const admin = PP.getAdmin();
    if (user === admin.username && pass === admin.password) {
        sessionStorage.setItem('pp_auth', '1');
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('adminScreen').style.display = 'block';
        initAdmin();
    } else {
        document.getElementById('loginError').style.display = 'block';
    }
}

function doLogout() {
    sessionStorage.removeItem('pp_auth');
    document.getElementById('adminScreen').style.display = 'none';
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('loginUser').value = '';
    document.getElementById('loginPass').value = '';
}

// Allow Enter key on login
document.addEventListener('DOMContentLoaded', function () {
    const passInput = document.getElementById('loginPass');
    if (passInput) {
        passInput.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') doLogin();
        });
    }
    const userInput = document.getElementById('loginUser');
    if (userInput) {
        userInput.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') doLogin();
        });
    }

    // Auto-login if session still active
    if (sessionStorage.getItem('pp_auth') === '1') {
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('adminScreen').style.display = 'block';
        initAdmin();
    }
});

// ── Init Admin ────────────────────────────────────────────────────────────────
function initAdmin() {
    updateDashStats();
    renderDashTable();
    renderCatsTable();
    loadContactForm();
    loadSettingsForm();
}

// ── Section Navigation ────────────────────────────────────────────────────────
function showSection(name, clickedLink) {
    // Hide all sections
    document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
    // Show target
    document.getElementById('sec-' + name).classList.add('active');
    // Update nav active state
    document.querySelectorAll('.admin-nav a').forEach(a => a.classList.remove('active'));
    if (clickedLink) clickedLink.classList.add('active');
    // Update topbar title
    const titles = { dashboard: 'Dashboard', cats: 'Manage Cats', contact: 'Contact & Info', settings: 'Settings' };
    document.getElementById('sectionTitle').textContent = titles[name] || name;
    return false;
}

// ── Dashboard Stats ───────────────────────────────────────────────────────────
function updateDashStats() {
    const cats = PP.getCats();
    document.getElementById('statTotal').textContent    = cats.length;
    document.getElementById('statAvail').textContent    = cats.filter(c => c.available).length;
    document.getElementById('statReserved').textContent = cats.filter(c => !c.available).length;
    document.getElementById('statImgs').textContent     = cats.filter(c => (c.images && c.images.length > 0) || c.imgFile || c.imgData).length;
}

// ── Dashboard Table ───────────────────────────────────────────────────────────
function renderDashTable() {
    const cats = PP.getCats();
    const container = document.getElementById('dashCatTable');
    if (!cats.length) { container.innerHTML = '<p style="color:#888;padding:20px;">No cats added yet.</p>'; return; }
    container.innerHTML = `
    <table class="table">
        <thead><tr><th>Photo</th><th>Name</th><th>Breed</th><th>Price</th><th>Status</th><th>Photos</th></tr></thead>
        <tbody>
            ${cats.map(cat => {
                const imgSrc = getPrimaryImgSrc(cat);
                const photoCount = (cat.images && cat.images.length) ? cat.images.length + ' &#128247;' : (cat.imgFile || cat.imgData ? '1 &#128247;' : '<span style="color:#aaa;">None</span>');
                return `<tr>
                <td>${imgSrc ? `<img src="${imgSrc}" alt="${cat.name}" onerror="this.src='../images/cat-luna.jpg'">` : '<div style="width:50px;height:50px;background:#f0e8dc;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:1.4rem;">&#128008;</div>'}</td>
                <td><strong>${cat.name}</strong></td>
                <td>${cat.breed}</td>
                <td>${cat.price || '—'}</td>
                <td><span class="badge ${cat.available ? 'badge-success' : 'badge-warning'}">${cat.available ? 'Available' : 'Reserved'}</span></td>
                <td>${photoCount}</td>
            </tr>`;
            }).join('')}
        </tbody>
    </table>`;
}

// ── Cats Table ────────────────────────────────────────────────────────────────
function renderCatsTable() {
    const cats = PP.getCats();
    const container = document.getElementById('catsTableContainer');
    if (!cats.length) {
        container.innerHTML = '<p style="color:#888;text-align:center;padding:30px;">No cats added yet. Click "+ Add New Cat" to get started.</p>';
        return;
    }
    container.innerHTML = `
    <table class="table">
        <thead>
            <tr><th>Photo</th><th>Name</th><th>Breed</th><th>Age</th><th>Price</th><th>Status</th><th>Photos</th><th>Actions</th></tr>
        </thead>
        <tbody>
            ${cats.map(cat => {
                const imgSrc = getPrimaryImgSrc(cat);
                const photoCount = (cat.images && cat.images.length) ? cat.images.length + ' &#128247;' : (cat.imgFile || cat.imgData ? '1 &#128247;' : '<span style="color:#aaa;">0</span>');
                return `<tr>
                <td>${imgSrc ? `<img src="${imgSrc}" alt="${cat.name}" onerror="this.src='../images/cat-luna.jpg'">` : '<div style="width:50px;height:50px;background:#f0e8dc;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:1.4rem;">&#128008;</div>'}</td>
                <td><strong>${cat.name}</strong></td>
                <td>${cat.breed}</td>
                <td>${cat.age || '—'}</td>
                <td>${cat.price || '—'}</td>
                <td><span class="badge ${cat.available ? 'badge-success' : 'badge-warning'}">${cat.available ? 'Available' : 'Reserved'}</span></td>
                <td>${photoCount}</td>
                <td style="white-space:nowrap;">
                    <button class="btn-edit" onclick="openCatModal(${cat.id})">&#9998; Edit</button>
                    <button class="btn-del" onclick="deleteCat(${cat.id})">&#128465; Delete</button>
                </td>
            </tr>`;
            }).join('')}
        </tbody>
    </table>`;
}

// ── Cat Modal — Multi-Image Support ──────────────────────────────────────────
let _editingCatId = null;
let _catImages    = []; // Array of { dataUrl, filename, isServerFile }

function openCatModal(id) {
    _editingCatId = id || null;
    _catImages    = [];

    // Reset form fields
    ['cat-id','cat-name','cat-breed','cat-color','cat-age','cat-price','cat-desc','cat-imgFile'].forEach(fid => {
        const el = document.getElementById(fid);
        if (el) el.value = '';
    });
    document.getElementById('cat-gender').value = 'Female';
    document.getElementById('cat-vaccinated').checked   = false;
    document.getElementById('cat-microchipped').checked = false;
    document.getElementById('cat-available').checked    = true;
    document.getElementById('catImgInput').value = '';
    document.getElementById('catAlert').style.display = 'none';

    if (id) {
        document.getElementById('modalTitle').textContent = 'Edit Cat';
        const cat = PP.getCats().find(c => c.id === id);
        if (cat) {
            document.getElementById('cat-id').value           = cat.id;
            document.getElementById('cat-name').value         = cat.name;
            document.getElementById('cat-breed').value        = cat.breed;
            document.getElementById('cat-color').value        = cat.color || '';
            document.getElementById('cat-gender').value       = cat.gender || 'Female';
            document.getElementById('cat-age').value          = cat.age || '';
            document.getElementById('cat-price').value        = cat.price || '';
            document.getElementById('cat-desc').value         = cat.description || '';
            document.getElementById('cat-imgFile').value      = cat.imgFile || '';
            document.getElementById('cat-vaccinated').checked  = !!cat.vaccinated;
            document.getElementById('cat-microchipped').checked = !!cat.microchipped;
            document.getElementById('cat-available').checked   = !!cat.available;
            // Load existing images into _catImages
            if (cat.images && cat.images.length) {
                cat.images.forEach(img => {
                    _catImages.push({ dataUrl: img.dataUrl || null, filename: img.filename || img, isServerFile: !img.dataUrl });
                });
            } else if (cat.imgData) {
                _catImages.push({ dataUrl: cat.imgData, filename: cat.imgFile || 'photo.jpg', isServerFile: false });
            } else if (cat.imgFile) {
                _catImages.push({ dataUrl: null, filename: cat.imgFile, isServerFile: true });
            }
        }
    } else {
        document.getElementById('modalTitle').textContent = 'Add New Cat';
    }

    renderImgGallery();
    document.getElementById('catModal').classList.add('open');

    // Attach drag-and-drop to drop zone
    const dz = document.getElementById('dropZone');
    if (dz && !dz._dzReady) {
        dz._dzReady = true;
        dz.addEventListener('dragover', e => { e.preventDefault(); dz.classList.add('drag-over'); });
        dz.addEventListener('dragleave', () => dz.classList.remove('drag-over'));
        dz.addEventListener('drop', e => { e.preventDefault(); dz.classList.remove('drag-over'); handleImgFiles(e.dataTransfer.files); });
    }
}

function closeCatModal() {
    document.getElementById('catModal').classList.remove('open');
    _editingCatId = null;
    _catImages    = [];
}

// ── Multi-Image File Handler ──────────────────────────────────────────────────
function handleImgFiles(files) {
    if (!files || !files.length) return;
    const maxImages = 10;
    const remaining = maxImages - _catImages.length;
    if (remaining <= 0) { alert('Maximum ' + maxImages + ' images per cat reached.'); return; }
    const toProcess = Math.min(files.length, remaining);
    let processed = 0;
    for (let i = 0; i < toProcess; i++) {
        const file = files[i];
        if (!file.type.startsWith('image/')) continue;
        if (file.size > 5 * 1024 * 1024) { alert(file.name + ' exceeds 5 MB and was skipped.'); continue; }
        const reader = new FileReader();
        reader.onload = function (e) {
            _catImages.push({ dataUrl: e.target.result, filename: file.name, isServerFile: false });
            processed++;
            if (processed === toProcess) renderImgGallery();
        };
        reader.readAsDataURL(file);
    }
    // Reset input so same files can be re-selected
    document.getElementById('catImgInput').value = '';
}

// ── Render Thumbnail Gallery ──────────────────────────────────────────────────
function renderImgGallery() {
    const grid = document.getElementById('imgGalleryGrid');
    const info = document.getElementById('imgCountInfo');
    if (!_catImages.length) {
        grid.innerHTML = '';
        info.textContent = 'No images added yet.';
        return;
    }
    let html = '';
    _catImages.forEach((img, idx) => {
        const src = img.dataUrl ? img.dataUrl : '../images/' + img.filename;
        const isPrimary = idx === 0;
        html += `<div class="img-thumb${isPrimary ? ' is-primary' : ''}" id="thumb-${idx}">`;
        html += `<img src="${src}" alt="Cat photo ${idx + 1}" onerror="this.src='../images/logo-icon.png'">`;
        if (isPrimary) html += '<span class="primary-tag">Primary</span>';
        html += '<div class="img-thumb-actions">';
        if (!isPrimary) html += `<button class="t-btn primary" onclick="setImgPrimary(${idx})">&#9733; Primary</button>`;
        html += `<button class="t-btn remove" onclick="removeImg(${idx})">&#10005;</button>`;
        html += '</div></div>';
    });
    grid.innerHTML = html;
    const count = _catImages.length;
    info.textContent = count + ' image' + (count !== 1 ? 's' : '') + ' added' + (count < 10 ? ' (' + (10 - count) + ' more allowed)' : ' — maximum reached');
}

function setImgPrimary(idx) {
    if (idx === 0) return;
    const img = _catImages.splice(idx, 1)[0];
    _catImages.unshift(img);
    renderImgGallery();
}

function removeImg(idx) {
    _catImages.splice(idx, 1);
    renderImgGallery();
}

// ── Save Cat ──────────────────────────────────────────────────────────────────
function saveCat() {
    const name  = document.getElementById('cat-name').value.trim();
    const breed = document.getElementById('cat-breed').value.trim();
    if (!name || !breed) { alert('Please enter at least the cat name and breed.'); return; }

    // Build images array
    const imagesArr = _catImages.map(img => ({ dataUrl: img.dataUrl || null, filename: img.filename }));
    const primaryImg = imagesArr.length ? imagesArr[0] : null;

    const catData = {
        id:           _editingCatId || null,
        name:         name,
        breed:        breed,
        color:        document.getElementById('cat-color').value.trim(),
        gender:       document.getElementById('cat-gender').value,
        age:          document.getElementById('cat-age').value.trim(),
        price:        document.getElementById('cat-price').value.trim(),
        description:  document.getElementById('cat-desc').value.trim(),
        vaccinated:   document.getElementById('cat-vaccinated').checked,
        microchipped: document.getElementById('cat-microchipped').checked,
        available:    document.getElementById('cat-available').checked,
        imgFile:      document.getElementById('cat-imgFile').value.trim() || (primaryImg ? primaryImg.filename : ''),
        imgData:      primaryImg ? primaryImg.dataUrl : null,
        images:       imagesArr
    };

    if (_editingCatId) { PP.updateCat(catData); } else { PP.addCat(catData); }

    const alertEl = document.getElementById('catAlert');
    alertEl.style.display = 'block';
    setTimeout(() => { alertEl.style.display = 'none'; closeCatModal(); }, 1200);

    updateDashStats();
    renderDashTable();
    renderCatsTable();
}

function deleteCat(id) {
    if (!confirm('Are you sure you want to delete this cat?')) return;
    PP.deleteCat(id);
    updateDashStats();
    renderDashTable();
    renderCatsTable();
}

// ── Helper: get primary image src for a cat ───────────────────────────────────
function getPrimaryImgSrc(cat) {
    if (cat.images && cat.images.length) {
        const first = cat.images[0];
        if (first.dataUrl) return first.dataUrl;
        if (first.filename) return '../images/' + first.filename;
    }
    if (cat.imgData) return cat.imgData;
    if (cat.imgFile) return '../images/' + cat.imgFile;
    return null;
}

// ── Hero Image Preview ────────────────────────────────────────────────────────
function previewHeroImg(input) {
    if (!input.files || !input.files[0]) return;
    const reader = new FileReader();
    reader.onload = function (e) {
        const prev = document.getElementById('heroImgPreview');
        prev.src = e.target.result;
        prev.style.display = 'block';
    };
    reader.readAsDataURL(input.files[0]);
}

// ── Contact Info Form ─────────────────────────────────────────────────────────
function loadContactForm() {
    const c = PP.getContact();
    document.getElementById('ci-phone').value        = c.phone        || '';
    document.getElementById('ci-email').value        = c.email        || '';
    document.getElementById('ci-address').value      = c.address      || '';
    document.getElementById('ci-hoursWeekday').value = c.hoursWeekday || '';
    document.getElementById('ci-hoursSat').value     = c.hoursSat     || '';
    document.getElementById('ci-hoursSun').value     = c.hoursSun     || '';
    document.getElementById('ci-facebook').value     = c.facebook     || '';
    document.getElementById('ci-instagram').value    = c.instagram    || '';
    document.getElementById('ci-whatsapp').value     = c.whatsapp     || '';
    document.getElementById('ci-googleForm').value   = c.googleForm   || '';
    document.getElementById('ci-heroImg').value      = c.heroImg      || 'hero-bg.jpg';
}

function saveContactInfo() {
    const contact = {
        phone:        document.getElementById('ci-phone').value.trim(),
        email:        document.getElementById('ci-email').value.trim(),
        address:      document.getElementById('ci-address').value.trim(),
        hoursWeekday: document.getElementById('ci-hoursWeekday').value.trim(),
        hoursSat:     document.getElementById('ci-hoursSat').value.trim(),
        hoursSun:     document.getElementById('ci-hoursSun').value.trim(),
        facebook:     document.getElementById('ci-facebook').value.trim(),
        instagram:    document.getElementById('ci-instagram').value.trim(),
        whatsapp:     document.getElementById('ci-whatsapp').value.trim(),
        googleForm:   document.getElementById('ci-googleForm').value.trim(),
        heroImg:      document.getElementById('ci-heroImg').value.trim()
    };
    PP.saveContact(contact);
    const alert = document.getElementById('contactAlert');
    alert.style.display = 'block';
    setTimeout(() => { alert.style.display = 'none'; }, 2500);
}

// ── Settings Form ─────────────────────────────────────────────────────────────
function loadSettingsForm() {
    const s = PP.getSettings();
    document.getElementById('set-siteName').value = s.siteName || 'Only Persians';
    document.getElementById('set-tagline').value  = s.tagline  || 'Lovingly Raised Persian Cats';
    document.getElementById('set-families').value = s.families || '50+';
    document.getElementById('set-years').value    = s.years    || '8+';
}

function saveSiteSettings() {
    const settings = {
        siteName: document.getElementById('set-siteName').value.trim(),
        tagline:  document.getElementById('set-tagline').value.trim(),
        families: document.getElementById('set-families').value.trim(),
        years:    document.getElementById('set-years').value.trim()
    };
    PP.saveSettings(settings);
    const alert = document.getElementById('settingsAlert');
    alert.style.display = 'block';
    setTimeout(() => { alert.style.display = 'none'; }, 2500);
}

function changePassword() {
    const current  = document.getElementById('set-currentPass').value;
    const newPass  = document.getElementById('set-newPass').value;
    const confirm  = document.getElementById('set-confirmPass').value;
    const admin    = PP.getAdmin();

    if (current !== admin.password) {
        alert('Current password is incorrect.'); return;
    }
    if (!newPass || newPass.length < 6) {
        alert('New password must be at least 6 characters.'); return;
    }
    if (newPass !== confirm) {
        alert('New passwords do not match.'); return;
    }

    PP.saveAdmin({ username: admin.username, password: newPass });
    document.getElementById('set-currentPass').value = '';
    document.getElementById('set-newPass').value     = '';
    document.getElementById('set-confirmPass').value = '';

    const alert = document.getElementById('settingsAlert');
    alert.style.display = 'block';
    setTimeout(() => { alert.style.display = 'none'; }, 2500);
}

// ── Reset All Data ────────────────────────────────────────────────────────────
function resetAllData() {
    if (!confirm('This will reset ALL cats and contact info to defaults. Are you sure?')) return;
    PP.resetAll();
    initAdmin();
    alert('All data has been reset to defaults.');
}
