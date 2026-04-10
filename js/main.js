/* ============================================
   MONROE CAR WASH - Main JavaScript
============================================ */

document.addEventListener('DOMContentLoaded', function () {

  // ---- NAVBAR SCROLL ----
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    });
  }

  // ---- MOBILE NAV TOGGLE ----
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const spans = navToggle.querySelectorAll('span');
      if (navLinks.classList.contains('open')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
      }
    });
    // Close on link click
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navLinks.classList.remove('open');
        const spans = navToggle.querySelectorAll('span');
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
      });
    });
  }

  // ---- ACTIVE NAV LINK ----
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  // ---- SCROLL ANIMATIONS ----
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

  // ---- FAQ ACCORDION ----
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (question && answer) {
      question.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        // Close all
        faqItems.forEach(i => {
          i.classList.remove('open');
          const a = i.querySelector('.faq-answer');
          if (a) a.style.maxHeight = null;
        });
        // Open clicked if was closed
        if (!isOpen) {
          item.classList.add('open');
          answer.style.maxHeight = answer.scrollHeight + 40 + 'px';
        }
      });
    }
  });

  // ---- FAQ CATEGORY TABS ----
  const catBtns = document.querySelectorAll('.faq-cat-btn');
  const faqGroups = document.querySelectorAll('.faq-group');
  catBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      catBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const target = btn.dataset.cat;
      faqGroups.forEach(g => {
        g.classList.toggle('active', g.dataset.cat === target);
      });
    });
  });

  // ---- WASH OPTION SELECTOR (hero) ----
  document.querySelectorAll('.wash-option').forEach(opt => {
    opt.addEventListener('click', () => {
      document.querySelectorAll('.wash-option').forEach(o => o.classList.remove('active'));
      opt.classList.add('active');
    });
  });

  // ---- CONTACT FORM ----
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const get = (name) => {
        const el = contactForm.querySelector(`[name="${name}"]`);
        return el ? el.value.trim() || 'N/A' : 'N/A';
      };

      const firstName = get('First Name');
      const lastName  = get('Last Name');
      const phone     = get('Phone Number');
      const email     = get('email');
      const make      = get('Vehicle Make');
      const model     = get('Vehicle Model');
      const service   = get('Service Interested In');
      const message   = get('Message');

      const subject = encodeURIComponent('New Message from Monroe Car Wash Website');

      const body = encodeURIComponent(
`Hello Monroe Car Wash Team,

You have received a new message from your website contact form.

──────────────────────────────
  CUSTOMER DETAILS
──────────────────────────────
  Name         : ${firstName} ${lastName}
  Phone        : ${phone}
  Email        : ${email}
  Vehicle      : ${make} ${model}
  Service      : ${service}

──────────────────────────────
  MESSAGE
──────────────────────────────
${message}

──────────────────────────────
Sent from: monroecarwash.com Contact Form`
      );

      window.location.href = `mailto:asharqasmani@gmail.com?subject=${subject}&body=${body}`;

      const btn = contactForm.querySelector('.form-submit');
      btn.textContent = '✓ Opening Email Client…';
      btn.style.background = '#22c55e';
      setTimeout(() => {
        btn.textContent = 'Send Message →';
        btn.style.background = '';
        contactForm.reset();
      }, 3000);
    });
  }

  // ---- NEWSLETTER FORM ----
  document.querySelectorAll('.footer-newsletter').forEach(form => {
    const btn = form.querySelector('button');
    if (btn) {
      btn.addEventListener('click', () => {
        const input = form.querySelector('input');
        if (input && input.value) {
          btn.textContent = 'Subscribed!';
          setTimeout(() => {
            btn.textContent = 'Subscribe';
            input.value = '';
          }, 2500);
        }
      });
    }
  });

  // ---- SMOOTH COUNTER ANIMATION ----
  function animateCounter(el, target, duration = 1500) {
    let start = 0;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      el.textContent = Math.floor(progress * target).toLocaleString();
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.count);
        if (target) animateCounter(el, target);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));
});
