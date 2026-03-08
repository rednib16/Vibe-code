/* ============================================================
   FLOWER LAB — JavaScript
   ============================================================ */

// ---- Sticky Header Shadow ----
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 10);
});

// ---- Mobile Nav Toggle ----
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');

hamburger.addEventListener('click', () => {
  mobileNav.classList.toggle('open');
});

// Close mobile nav when clicking outside
document.addEventListener('click', (e) => {
  if (!header.contains(e.target)) {
    mobileNav.classList.remove('open');
  }
});

function closeMobileNav() {
  mobileNav.classList.remove('open');
}

// ---- Smooth Scroll for anchor links ----
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ---- Contact Form ----
const form = document.getElementById('contactForm');
const successMsg = document.getElementById('formSuccess');
const errorMsg = document.getElementById('formError');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Clear previous messages
  successMsg.style.display = 'none';
  errorMsg.style.display = 'none';

  // Basic validation
  const required = form.querySelectorAll('[required]');
  let valid = true;
  required.forEach(field => {
    field.classList.remove('error');
    if (!field.value.trim()) {
      field.classList.add('error');
      valid = false;
    }
  });

  if (!valid) return;

  // Collect form data
  const data = {
    name:     form.name.value.trim(),
    phone:    form.phone.value.trim(),
    email:    form.email.value.trim(),
    occasion: form.occasion.value,
    date:     form.date.value,
    message:  form.message.value.trim(),
    submitted_at: new Date().toISOString(),
  };

  // Submit button loading state
  const submitBtn = form.querySelector('[type="submit"]');
  const originalText = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending…';

  try {
    /*
     * OPTION A — Formspree (free, no backend needed)
     * Replace YOUR_FORM_ID below after signing up at https://formspree.io
     *
     * const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
     *   method: 'POST',
     *   headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
     *   body: JSON.stringify(data),
     * });
     * if (!response.ok) throw new Error('Submit failed');
     *
     * OPTION B — WhatsApp fallback (always works, no backend needed)
     * Uncomment lines below and remove Formspree code above.
     */

    // WhatsApp fallback — opens chat with pre-filled message
    const waText = encodeURIComponent(
      `Hi Flower Lab! New enquiry from your website:\n\n` +
      `Name: ${data.name}\n` +
      `Phone: ${data.phone}\n` +
      `Email: ${data.email || 'Not provided'}\n` +
      `Occasion: ${data.occasion}\n` +
      `Date: ${data.date || 'Not specified'}\n\n` +
      `Message: ${data.message}`
    );
    window.open(`https://wa.me/27824541918?text=${waText}`, '_blank');

    form.reset();
    successMsg.style.display = 'block';
    successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

  } catch (err) {
    console.error('Form error:', err);
    errorMsg.style.display = 'block';
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
  }
});

// ---- Intersection Observer for fade-in animations ----
const observerOptions = {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px',
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Add fade-in class to animatable elements
const animatables = document.querySelectorAll(
  '.service-card, .gallery-item, .about-content, .about-image, .contact-info, .contact-form-wrapper, .highlight'
);
animatables.forEach(el => {
  el.classList.add('fade-in');
  observer.observe(el);
});

// Inject fade-in CSS
const style = document.createElement('style');
style.textContent = `
  .fade-in {
    opacity: 0;
    transform: translateY(24px);
    transition: opacity 0.6s ease, transform 0.6s ease;
  }
  .fade-in.visible {
    opacity: 1;
    transform: translateY(0);
  }
  .service-card:nth-child(2) { transition-delay: 0.1s; }
  .service-card:nth-child(3) { transition-delay: 0.2s; }
  .gallery-item:nth-child(2) { transition-delay: 0.1s; }
  .gallery-item:nth-child(3) { transition-delay: 0.15s; }
  .gallery-item:nth-child(4) { transition-delay: 0.2s; }
  .gallery-item:nth-child(5) { transition-delay: 0.25s; }
  .gallery-item:nth-child(6) { transition-delay: 0.3s; }
`;
document.head.appendChild(style);
