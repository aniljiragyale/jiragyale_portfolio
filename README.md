# 🚀 Anil Jiragyale's Multi-Page Portfolio

A beautiful, modern, and fully functional multi-page portfolio website with working email functionality.

## 📋 Features

✨ **Beautiful Design**
- Modern dark theme with gradient accents
- Smooth animations and transitions
- Fully responsive (mobile, tablet, desktop)
- Professional typography and spacing

🔧 **Multi-Page Structure**
- **Home** - Hero section with quick links
- **About** - Full bio, skills, experience, and education
- **Projects** - Showcase of 6 featured projects with descriptions
- **Contact** - Contact form with working email integration

📧 **Working Email System**
- Contact form sends emails directly to your inbox
- No backend server required
- Built with EmailJS (free tier available)
- Form validation and error handling
- Success/error messages

📱 **Responsive Design**
- Mobile-first approach
- Hamburger menu for mobile navigation
- Optimized layouts for all screen sizes

⚡ **Performance**
- Single image for profile photo (optimized)
- Smooth scroll behavior
- Intersection observer for reveal animations
- Minimal external dependencies

---

## 🛠️ Setup Instructions

### 1. **Get Your EmailJS Credentials**

EmailJS allows you to send emails directly from your website without a backend!

1. Go to [emailjs.com](https://www.emailjs.com) and sign up (FREE)
2. In your dashboard, go to **Email Services**
3. Click **Add Service** and select your email provider (Gmail, Outlook, etc.)
4. Follow the verification steps
5. Create an **Email Template**:
   - Go to **Email Templates**
   - Create a new template with these variables:
     - `{{from_name}}` - Sender's name
     - `{{from_email}}` - Sender's email
     - `{{subject}}` - Email subject
     - `{{message}}` - Message body

6. Get your credentials:
   - **Service ID**: In Email Services section
   - **Template ID**: In Email Templates section
   - **Public Key**: In Account → API Keys

### 2. **Update script.js**

Replace the placeholder keys in `script.js` (line 40):

```javascript
emailjs.init("YOUR_PUBLIC_KEY_HERE");

// And update these in the emailjs.send() call:
const response = await emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', {
```

**Example:**
```javascript
emailjs.init("abc123def456ghi789");

const response = await emailjs.send('service_gmail_12345', 'template_contact_67890', {
```

### 3. **Test the Email Form**

1. Open `contact.html` in your browser
2. Fill out the contact form
3. Click "Send Message"
4. Check your email inbox!

---

## 📁 File Structure

```
Anil_Jiragyale_Portfolio/
├── index.html          # Home page
├── about.html          # About page
├── projects.html       # Projects showcase
├── contact.html        # Contact form
├── styles.css          # All styling
├── script.js           # JavaScript (navigation + email)
└── README.md           # This file
```

---

## 🎨 Customization Guide

### Change Colors
Edit the CSS variables in `styles.css`:
```css
:root {
  --bg:       #050d1a;      /* Background color */
  --accent:   #63b3ed;      /* Primary accent */
  --accent2:  #4fd1c5;      /* Secondary accent */
  --gold:     #f6ad55;      /* Accent gold */
}
```

### Update Profile Image
Replace the image URL in `index.html` and `about.html`:
```html
<img src="YOUR_IMAGE_URL" alt="Anil Jiragyale" class="photo-img">
```

Use a professional photo from:
- Your own image (upload to a service like Imgur or Cloudinary)
- Unsplash (like the current placeholder)
- GitHub profile picture

### Modify Content
- Edit text in HTML files directly
- Update links to your social profiles
- Add/remove projects
- Customize skill sections

### Add New Sections
1. Create a new `.html` file
2. Copy the nav and footer from any existing page
3. Add content in the middle
4. Update navigation links in all files

---

## 🚀 Deployment Options

### Option 1: **GitHub Pages** (Free)
1. Push to GitHub repository
2. Go to Settings → Pages
3. Select main branch
4. Visit `yourusername.github.io/Anil_Jiragyale_Portfolio`

### Option 2: **Vercel** (Free & Recommended)
1. Push to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Deploy automatically

### Option 3: **Netlify** (Free)
1. Push to GitHub
2. Go to [netlify.com](https://www.netlify.com)
3. Connect your repository
4. Deploy

### Option 4: **Web Hosting** (Paid)
- Namecheap
- Bluehost
- Hostinger
- etc.

---

## 📊 Features Breakdown

### Navigation
- Fixed header with responsive design
- Mobile hamburger menu
- Shrinks on scroll for better UX
- Smooth navigation between pages

### Home Page
- Hero section with profile image
- Key metrics
- Quick links to other pages
- Call-to-action buttons

### About Page
- Personal bio and introduction
- Skills grid (6 categories)
- Experience timeline
- Education and certifications

### Projects Page
- 6 featured projects
- Project images (hover effects)
- Technology stack tags
- Project links/badges
- CTA to contact section

### Contact Page
- Contact information cards
- Social media links
- **Working contact form**
- Form validation
- Success/error messages

---

## 🔐 Security & Best Practices

- ✅ Form validation on frontend and backend (EmailJS)
- ✅ No sensitive data stored locally
- ✅ Public key used (safe to expose)
- ✅ HTTPS recommended for deployment
- ✅ Rate limiting available on EmailJS free tier

---

## 🐛 Troubleshooting

### Emails not sending?
1. Check EmailJS Public Key in script.js
2. Verify Service ID and Template ID
3. Check browser console for errors (F12)
4. Verify email service is connected in EmailJS dashboard

### Images not loading?
- Use absolute URLs from image hosting services
- Ensure image URLs are accessible

### Styling not applied?
- Hard refresh browser (Ctrl+Shift+R)
- Check styles.css is in same directory
- Verify no CSS filename typos

### Navigation not working on mobile?
- Check if JavaScript file is loaded
- Verify no console errors
- Test in different mobile browsers

---

## 📱 Mobile Responsiveness

The portfolio is fully responsive:
- **Desktop**: Full layout with side-by-side sections
- **Tablet**: 2-column grid layouts
- **Mobile**: Single column with hamburger menu

Tested on:
- iPhone 12/13/14
- Samsung Galaxy
- iPad
- Chrome DevTools mobile simulation

---

## 📞 Contact & Support

**Need help?**
- Check the troubleshooting section above
- Review EmailJS documentation: https://www.emailjs.com/docs/
- Update content in HTML files directly
- Customize CSS for your brand colors

---

## 📄 License

This portfolio template is free to use and customize!

---

## 🎯 Next Steps

1. ✅ Set up EmailJS credentials
2. ✅ Update script.js with your keys
3. ✅ Replace profile image
4. ✅ Customize content and colors
5. ✅ Deploy to web hosting
6. ✅ Share with potential employers!

---

**Made with ❤️ by Anil Jiragyale**

Happy Coding! 🚀
