# Only Persians — Static Website

A fully static Persian cats website built with HTML5, CSS3, and vanilla JavaScript.
**No server, no database, no Java required.** Works on any web host including GoDaddy shared hosting.

---

## Deploying to GoDaddy Shared Hosting

### Step 1 — Upload Files via cPanel File Manager

1. Log into your GoDaddy account → **My Products** → **Web Hosting** → **Manage**
2. Open **cPanel** → **File Manager**
3. Navigate to the `public_html` folder (this is your website root)
4. Click **Upload** and upload the ZIP file, then **Extract** it
5. Make sure all files are directly inside `public_html/` (not in a subfolder)

### Step 2 — Verify File Structure

Your `public_html/` should look like this:
```
public_html/
├── index.html          ← Home page
├── gallery.html        ← Our Cats page
├── about.html          ← About page
├── contact.html        ← Contact page
├── 404.html            ← Error page
├── .htaccess           ← Server configuration
├── css/
│   └── style.css
├── js/
│   ├── data.js
│   ├── main.js
│   └── admin.js
├── images/
│   ├── hero-bg.jpg
│   ├── cat-luna.jpg
│   ├── cat-leo.jpg
│   ├── cat-bella.jpg
│   ├── cat-cleo.jpg
│   ├── cat-max.jpg
│   ├── cat-pearl.jpg
│   ├── cat-oliver.jpg
│   ├── about-breeder.jpg
│   └── logo-icon.png
└── admin/
    └── index.html      ← Admin panel
```

### Step 3 — Access Your Website

- **Website:** `https://yourdomain.com`
- **Admin Panel:** `https://yourdomain.com/admin/`

---

## Admin Panel

### Default Login Credentials
- **Username:** `admin`
- **Password:** `admin123`

> ⚠️ **Change your password immediately** after first login via Admin → Settings → Change Password.

### What the Admin Can Do

| Feature | Description |
|---------|-------------|
| **Add / Edit / Delete Cats** | Full cat management with photo upload, breed, age, price, availability |
| **Upload Cat Photos** | Drag-and-drop photo upload stored as base64 in browser localStorage |
| **Update Contact Info** | Phone, email, address, business hours |
| **Update Social Links** | Facebook, Instagram, WhatsApp URLs |
| **Set Google Form URL** | The inquiry form button redirects customers to your Google Form |
| **Change Hero Image** | Upload or specify hero banner image filename |
| **Change Password** | Update admin password securely |
| **Site Settings** | Site name, tagline, stats (families count, years) |

### Setting Up the Google Form

1. Go to [Google Forms](https://forms.google.com) and create your inquiry form
2. Click **Send** → **Link** icon → copy the short URL ('<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3766.5674331466075!2d72.96742177427316!3d19.257674946245917!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7bbd0c8a944a7%3A0x71112b28fa7cef85!2sOnly%20Persian&#39;s!5e0!3m2!1sen!2sin!4v1779554155910!5m2!1sen!2sin" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`)
3. In Admin Panel → **Contact & Info** → paste the URL in **Google Form URL** field
4. Click **Save All Contact Information**
5. Customers clicking "Open Inquiry Form" on the Contact page will now be redirected to your form

---

## How Data is Stored

All data (cats, contact info, settings) is stored in the visitor's **browser localStorage**.
This means:
- Admin changes are saved in the admin's browser
- Changes are visible immediately on the website when viewed in the **same browser**
- For a shared/multi-device setup, use the **Export/Import** feature or manually update `js/data.js`

### Making Changes Permanent for All Visitors

To make cat data visible to all visitors (not just your browser), edit `js/data.js`:
1. Open `js/data.js` in a text editor
2. Update the `DEFAULT_CATS` array with your actual cat data
3. Re-upload the file to GoDaddy via cPanel File Manager

---

## Adding New Cat Images

1. Upload the image file to the `images/` folder via cPanel File Manager
2. In Admin Panel → **Manage Cats** → **Edit Cat**
3. Enter the filename (e.g. `my-cat.jpg`) in the **Image Filename** field
4. Click **Save Cat**

---

## Enabling HTTPS (SSL)

1. In GoDaddy cPanel → **SSL/TLS** → enable free SSL
2. Once enabled, open `.htaccess` and uncomment the HTTPS redirect section

---

## Tech Stack

- **HTML5** — Semantic markup
- **CSS3** — Custom properties, Flexbox, Grid, responsive design
- **Vanilla JavaScript** — No frameworks, no dependencies
- **localStorage** — Client-side data persistence
- **Google Fonts** — Playfair Display + Lato

---

## Support

For any issues, contact your web developer or refer to GoDaddy's support documentation.
