# 📧 Email Setup Guide - Quick Start

## ⚡ 3-Minute Email Setup

### Step 1: Create EmailJS Account
1. Go to **https://www.emailjs.com**
2. Click **Sign Up Free**
3. Enter your email and password
4. Verify your email

### Step 2: Add Email Service
1. In dashboard, click **Email Services** (left menu)
2. Click **Add Service**
3. Select your email provider (Gmail recommended):
   - For Gmail: Click "Gmail"
   - Authorize the connection
   - Save Service ID (looks like: `service_xxxxxxxxx`)

### Step 3: Create Email Template
1. Click **Email Templates** (left menu)
2. Click **Create New Template**
3. Fill template with this code:

```
Subject: New Message from {{from_name}}

From: {{from_email}}
Subject: {{subject}}

Message:
{{message}}

---
This email was sent from your portfolio website.
```

4. Save Template ID (looks like: `template_xxxxxxxxx`)

### Step 4: Get Public Key
1. Click **Account** (top right)
2. Click **API Keys**
3. Copy your **Public Key** (looks like: `abc123def456ghi789`)

### Step 5: Update Your Portfolio
Open `script.js` and find line 40:

**BEFORE:**
```javascript
emailjs.init("YOUR_PUBLIC_KEY_HERE");

const response = await emailjs.send('service_id', 'template_id', {
```

**AFTER (Example):**
```javascript
emailjs.init("abc123def456ghi789jkl012");

const response = await emailjs.send('service_gmail_1234567', 'template_contact_9876543', {
```

Replace:
- `abc123def456ghi789jkl012` → Your Public Key
- `service_gmail_1234567` → Your Service ID
- `template_contact_9876543` → Your Template ID

### Step 6: Test It!
1. Open `contact.html` in your browser
2. Fill out the form
3. Click "Send Message"
4. ✅ Check your email inbox!

---

## 🎯 What to Expect

✅ **Free Tier Includes:**
- 200 emails/month
- Unlimited templates
- Multiple email services
- Form validation

📊 **Email Status:**
- Success message appears in green
- Email arrives within 1-2 minutes
- Sender info shows on email

---

## 💡 Pro Tips

1. **Test First**: Send yourself a test email before going live
2. **Save IDs**: Keep your IDs safe, don't share publicly
3. **Monitor Usage**: Check EmailJS dashboard to see sent emails
4. **Upgrade Later**: Paid plans available for more emails/month

---

## ❌ Troubleshooting

**"Failed to send message"?**
- Check Public Key is correct
- Verify Service ID exists
- Confirm Template ID matches
- Open browser console (F12) for error details

**"Form stuck on Sending"?**
- Refresh the page
- Check internet connection
- Verify EmailJS account is active

**Email goes to spam?**
- Add reply-to address in template
- EmailJS uses Gmail servers (usually trusted)
- Whitelist your domain in email client

---

## 🚀 You're All Set!

Your portfolio now has **fully working email functionality**! 

Users can fill the contact form and you'll receive emails directly.

**Questions?** Check EmailJS docs: https://www.emailjs.com/docs/

---

Good luck with your portfolio! 🎉
