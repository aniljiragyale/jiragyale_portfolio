// ══════ NAVIGATION ══════
const navT = document.getElementById('navT');
const navL = document.getElementById('navL');

if (navT) {
  navT.addEventListener('click', () => navL.classList.toggle('open'));
  navL.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navL.classList.remove('open')));
}

// ══════ NAV SHRINK ON SCROLL ══════
window.addEventListener('scroll', () => {
  const nav = document.getElementById('nav');
  if (nav) {
    nav.style.padding = window.scrollY > 60 ? '.65rem 4rem' : '1.1rem 4rem';
  }
});

// ══════ REVEAL ANIMATIONS ══════
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('on');
  });
}, { threshold: 0.05 });

function revealInView(el) {
  const rect = el.getBoundingClientRect();
  const vh = window.innerHeight || document.documentElement.clientHeight;
  if (rect.top < vh * 0.95 && rect.bottom > 0) el.classList.add('on');
  revealObs.observe(el);
}

document.querySelectorAll('.rv').forEach(revealInView);
requestAnimationFrame(() => document.querySelectorAll('.rv').forEach(revealInView));

// ══════ EMAIL.JS CONFIGURATION ══════
// Initialize EmailJS with your public key
emailjs.init('EfFovMSVNZE-iwywJ');

// ══════ CONTACT FORM HANDLING ══════
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();
    const submitBtn = document.getElementById('submitBtn');
    const formMessage = document.getElementById('formMessage');

    // Validation
    if (!name || !email || !subject || !message) {
      showMessage('Please fill in all fields', 'error');
      return;
    }

    if (!isValidEmail(email)) {
      showMessage('Please enter a valid email address', 'error');
      return;
    }

    // Disable button and show loading state
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    try {
      // Send email via EmailJS
      const response = await emailjs.send('service_t7zf2hg', 'template_5xqoia9', {
        name,
        email,
        subject,
        message: `Subject: ${subject}\n\n${message}`,
        to_email: 'aniljiragyale07@gmail.com',
      });

      if (response.status === 200) {
        showMessage('✓ Message sent successfully! I\'ll get back to you soon.', 'success');
        contactForm.reset();
        
        // Reset button after 3 seconds
        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Send Message ✦';
        }, 3000);
      }
    } catch (error) {
      console.error('Error:', error);
      showMessage('✗ Failed to send message. Please try again or contact directly.', 'error');
      
      // Reset button
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Message ✦';
    }
  });
}

// ══════ HELPER FUNCTIONS ══════
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function showMessage(text, type) {
  const formMessage = document.getElementById('formMessage');
  if (!formMessage) return;

  formMessage.textContent = text;
  formMessage.className = `form-message ${type}`;
  
  // Auto-hide after 5 seconds
  setTimeout(() => {
    formMessage.className = 'form-message';
  }, 5000);
}

// ══════ CONSOLE GREETING ══════
console.log('%c🚀 Welcome to Anil Jiragyale\'s Portfolio!', 'font-size:16px;font-weight:bold;color:#63b3ed;');
console.log('%cLet\'s build something amazing together!', 'font-size:12px;color:#4fd1c5;');
