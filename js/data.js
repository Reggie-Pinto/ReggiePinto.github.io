/**
 * Only Persians - Data Layer
 * All data is persisted in localStorage. No server required.
 * Each cat now supports multiple images via the `images` array.
 */

const PP = (function () {

    const KEYS = {
        cats:     'pp_cats',
        contact:  'pp_contact',
        settings: 'pp_settings',
        admin:    'pp_admin'
    };

    // ── Default Data ──────────────────────────────────────────────────────────

    const DEFAULT_CATS = [
        {
            id: 1,
            name: 'White Tip',
            breed: 'Silver & White Tabby Persian',
            color: 'Silver & White',
            gender: 'Male',
            age: '3 Months',
            price: '\u20b95,000',
            description: 'White Tip is a striking silver and white Tabby Persian. He is playful, curious, and loves interactive toys. He loves to play hide & seek. Will run continuously for hours on a stretch. Is playful and attached more to his twin sister.',
            vaccinated: true,
            microchipped: false,
            available: true,
            imgFile: 'cat-whitetip-1.png',
            images: [
                { dataUrl: null, filename: 'cat-whitetip-1.png' },
                { dataUrl: null, filename: 'cat-whitetip-2.jpg' }
            ]
        },
        {
            id: 2,
            name: 'Ivy',
            breed: 'Dark & Light Grey Persian',
            color: 'Dark Grey & Light Silver',
            gender: 'Female',
            age: '3 Months',
            price: '\u20b95,000',
            description: 'Ivy is a beautiful Dark grey face Persian kitten with deep blue eyes. She is calm, loving, and very affectionate. She is the smartest and the quickest in the group. She is playful, smart and loves being among humans.',
            vaccinated: true,
            microchipped: false,
            available: true,
            imgFile: 'cat-jasper.png',
            images: [
                { dataUrl: null, filename: 'cat-jasper.png' }
            ]
        },
        {
            id: 3,
            name: 'Jasper',
            breed: 'Dark Grey Persian',
            color: 'Dark Grey',
            gender: 'Male',
            age: '3 Months',
            price: '\u20b97,000',
            description: 'Jasper is a handsome pure dark grey Persian with warm amber eyes. He is sociable, playful, and very smart. He likes to be with his care taker wherever they go. He can be trained to do tricks.',
            vaccinated: true,
            microchipped: false,
            available: true,
            imgFile: 'cat-jasper.png',
            images: [
                { dataUrl: null, filename: 'cat-jasper.png' }
            ]
        },
        {
            id: 4,
            name: 'Lola',
            breed: 'Silver & White Tabby Persian',
            color: 'Silver, White & Peach',
            gender: 'Female',
            age: '3 Months',
            price: '\u20b95,000',
            description: 'Lola is a very affectionate kitten. She is very playful, active, agile and naughty. She is also very loving and cuddly. She loves to stay close to her care givers. She has a unique peach face color pattern while her rest body is silver and white tabby & tuxedo pattern. She is a gentle girl.',
            vaccinated: true,
            microchipped: false,
            available: true,
            imgFile: 'cat-lola.png',
            images: [
                { dataUrl: null, filename: 'cat-lola.png' }
            ]
        }
    ];

    const DEFAULT_CONTACT = {
        phone:        '+91 8657388340',
        email:        'opersians@gmail.com',
        address:      'B104 Charnamrut Chs Ltd, Near Suraj Water Park, Above Tandoor Tawa Restaurant, Ghodbunder Road, Thane West - 400615',
        hoursWeekday: 'Monday \u2013 Friday: 10:00 AM \u2013 07:00 PM',
        hoursSat:     'Saturday: 10:00 AM \u2013 07:00 PM',
        hoursSun:     'Sunday: By Appointment Only',
        facebook:     '#',
        instagram:    '#',
        whatsapp:     'https://wa.me/918657388340',
        googleForm:   '#',
        heroImg:      'hero-bg.jpg'
    };

    const DEFAULT_SETTINGS = {
        siteName: 'Only Persians',
        tagline:  'Lovingly Raised Persian Cats',
        families: '50+',
        years:    '8+'
    };

    const DEFAULT_ADMIN = {
        username: 'admin',
        password: 'admin123'
    };

    // ── Helpers ───────────────────────────────────────────────────────────────

    function load(key, fallback) {
        try {
            const raw = localStorage.getItem(key);
            return raw ? JSON.parse(raw) : fallback;
        } catch (e) {
            return fallback;
        }
    }

    function save(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    function nextId(cats) {
        return cats.length ? Math.max(...cats.map(c => c.id)) + 1 : 1;
    }

    // ── Public API ────────────────────────────────────────────────────────────

    // --- Cats ---
    function getCats()    { return load(KEYS.cats, DEFAULT_CATS); }
    function saveCats(c)  { save(KEYS.cats, c); }

    function addCat(cat) {
        const cats = getCats();
        cat.id = nextId(cats);
        if (!cat.images) cat.images = [];
        cats.push(cat);
        saveCats(cats);
        return cat;
    }

    function updateCat(updated) {
        const cats = getCats().map(c => {
            if (c.id !== updated.id) return c;
            // Replace images array entirely with the new one from admin
            return { ...c, ...updated, images: updated.images || c.images || [] };
        });
        saveCats(cats);
    }

    function deleteCat(id) {
        saveCats(getCats().filter(c => c.id !== id));
    }

    function deleteCatImage(catId, imageIndex) {
        const cats = getCats().map(c => {
            if (c.id !== catId) return c;
            const images = [...(c.images || [])];
            images.splice(imageIndex, 1);
            return { ...c, images };
        });
        saveCats(cats);
    }

    function setPrimaryImage(catId, imageIndex) {
        const cats = getCats().map(c => {
            if (c.id !== catId) return c;
            const images = [...(c.images || [])];
            if (imageIndex === -1) {
                // Primary is imgFile — no change needed
                return c;
            }
            // Swap selected image to front of images array
            const [selected] = images.splice(imageIndex, 1);
            images.unshift(selected);
            return { ...c, images };
        });
        saveCats(cats);
    }

    // --- Contact ---
    function getContact()      { return load(KEYS.contact, DEFAULT_CONTACT); }
    function saveContact(c)    { save(KEYS.contact, c); }

    // --- Settings ---
    function getSettings()     { return load(KEYS.settings, DEFAULT_SETTINGS); }
    function saveSettings(s)   { save(KEYS.settings, s); }

    // --- Admin ---
    function getAdmin()        { return load(KEYS.admin, DEFAULT_ADMIN); }
    function saveAdmin(a)      { save(KEYS.admin, a); }

    // --- Reset ---
    function resetAll() {
        Object.values(KEYS).forEach(k => localStorage.removeItem(k));
    }

    // ── Image Source Resolver ─────────────────────────────────────────────────
    /**
     * Returns the primary image src for a cat.
     * Priority: first item in images[] → imgFile → fallback
     * @param {object} cat
     * @param {string} prefix  path prefix (e.g. '' for root, '../' from admin/)
     */
    function catImgSrc(cat, prefix) {
        prefix = prefix || '';
        // If images array has entries, first one is primary
        if (cat.images && cat.images.length > 0) {
            const first = cat.images[0];
            // New format: { dataUrl, filename }
            if (first && typeof first === 'object') {
                if (first.dataUrl) return first.dataUrl;
                if (first.filename) return prefix + 'images/' + first.filename;
            }
            // Legacy format: plain string
            if (typeof first === 'string') {
                if (first.startsWith('data:')) return first;
                return prefix + 'images/' + first;
            }
        }
        // Fall back to legacy imgData (base64)
        if (cat.imgData) return cat.imgData;
        // Fall back to legacy imgFile
        if (cat.imgFile) return prefix + 'images/' + cat.imgFile;
        return prefix + 'images/cat-luna.jpg';
    }

    /**
     * Returns all image sources for a cat (primary + extras).
     */
    function catAllImgs(cat, prefix) {
        prefix = prefix || '';
        const srcs = [];

        // images[] first — supports both {dataUrl,filename} objects and plain strings
        if (cat.images && cat.images.length > 0) {
            cat.images.forEach(img => {
                if (img && typeof img === 'object') {
                    if (img.dataUrl) srcs.push(img.dataUrl);
                    else if (img.filename) srcs.push(prefix + 'images/' + img.filename);
                } else if (typeof img === 'string') {
                    srcs.push(img.startsWith('data:') ? img : prefix + 'images/' + img);
                }
            });
        }

        // imgData (legacy base64)
        if (cat.imgData && !srcs.includes(cat.imgData)) srcs.push(cat.imgData);

        // imgFile as fallback / additional
        if (cat.imgFile) {
            const src = prefix + 'images/' + cat.imgFile;
            if (!srcs.includes(src)) srcs.push(src);
        }

        if (srcs.length === 0) srcs.push(prefix + 'images/cat-luna.jpg');
        return srcs;
    }

    return {
        getCats, saveCats, addCat, updateCat, deleteCat,
        deleteCatImage, setPrimaryImage,
        getContact, saveContact,
        getSettings, saveSettings,
        getAdmin, saveAdmin,
        resetAll,
        catImgSrc, catAllImgs
    };

})();
