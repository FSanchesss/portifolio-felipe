/* =============================================
   FELIPE SANCHES — PORTFOLIO JS
   ============================================= */

// ----- Navbar scroll state -----
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// ----- Mobile menu -----
const menuBtn  = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');
menuBtn.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('open');
    menuBtn.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
});
// Close on nav link click
mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        menuBtn.classList.remove('open');
        document.body.style.overflow = '';
    });
});

// ----- Works filter -----
const filterBtns = document.querySelectorAll('.filter-btn');
const workCards  = document.querySelectorAll('.work-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;
        workCards.forEach(card => {
            const match = filter === 'all' || card.dataset.category.split(' ').includes(filter);
            card.style.display = match ? 'block' : 'none';
            if (match) {
                card.style.animation = 'none';
                card.offsetHeight; // reflow
                card.style.animation = 'fadeInUp .4s ease forwards';
            }
        });
    });
});

// ----- Simple fade-in on scroll -----
const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -40px 0px' };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.work-card, .service-block, .about-card, .tools-section, .about-photo').forEach(el => {
    el.classList.add('fade-up');
    observer.observe(el);
});

// CSS for animations injected via JS
const style = document.createElement('style');
style.textContent = `
    .fade-up {
        opacity: 0;
        transform: translateY(28px);
        transition: opacity .6s ease, transform .6s ease;
    }
    .fade-up.in-view {
        opacity: 1;
        transform: translateY(0);
    }
    @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(16px); }
        to   { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(style);

// ----- Contact form -----
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = contactForm.querySelector('.btn-form-submit');
        const original = btn.textContent;

        // Validação básica
        const name  = contactForm.querySelector('[name=name]').value.trim();
        const email = contactForm.querySelector('[name=email]').value.trim();
        if (!name || !email) {
            btn.textContent = 'Fill in Name & Email';
            btn.style.background = '#ef4444';
            btn.style.color = '#fff';
            setTimeout(() => { btn.textContent = original; btn.style.background = ''; btn.style.color = ''; }, 2500);
            return;
        }

        btn.textContent = 'Sending...';
        btn.disabled = true;

        try {
            const res = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify(Object.fromEntries(new FormData(contactForm)))
            });
            const json = await res.json();

            if (res.ok && json.success) {
                btn.textContent = 'Message sent ✓';
                btn.style.background = '#22c55e';
                btn.style.color = '#fff';
                contactForm.reset();
                setTimeout(() => { btn.textContent = original; btn.style.background = ''; btn.style.color = ''; btn.disabled = false; }, 4000);
            } else {
                throw new Error(json.message || 'Error');
            }
        } catch (err) {
            btn.textContent = 'Error — try again';
            btn.style.background = '#ef4444';
            btn.style.color = '#fff';
            btn.disabled = false;
            setTimeout(() => { btn.textContent = original; btn.style.background = ''; btn.style.color = ''; }, 3000);
        }
    });
}

// ----- Open Project page -----
document.querySelectorAll('.js-open-project').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const card = btn.closest('.work-card');
        const data = {
            title:    card.dataset.title    || '',
            category: card.dataset.badge    || '',
            desc:     card.dataset.desc     || '',
            client:   card.dataset.client   || '',
            services: card.dataset.services || '',
            industry: card.dataset.industry || '',
            country:  card.dataset.country  || '',
            img:      card.dataset.img      || '',
            link:     card.dataset.link     || '',
            videos:   card.dataset.videos   ? JSON.parse(card.dataset.videos)  : [],
            gallery:  card.dataset.gallery  ? JSON.parse(card.dataset.gallery) : [],
        };
        localStorage.setItem('currentProject', JSON.stringify(data));
        window.location.href = 'project.html';
    });
});