document.addEventListener('DOMContentLoaded', () => {

    // --- Vimeo Player Initialization (Immediate for Previews) ---
    const artistCards = document.querySelectorAll('.artist-card');

    artistCards.forEach(card => {
        const vimeoId = card.getAttribute('data-vimeo-id');
        const vimeoWrapper = card.querySelector('.vimeo-wrapper');

        if (vimeoId && vimeoWrapper) {
            const player = new Vimeo.Player(vimeoWrapper, {
                id: vimeoId,
                background: true,
                autoplay: true,
                loop: true,
                muted: true,
                responsive: true
            });

            card.addEventListener('mouseenter', () => {
                player.play();
            });

            card.addEventListener('mouseleave', () => {
                player.pause();
                player.setMuted(true); // Reset to muted when leaving
            });

            card.addEventListener('click', () => {
                // Toggle mute/unmute on click
                player.getMuted().then(muted => {
                    player.setMuted(!muted);
                });
            });
        }
    });

    // --- Navigation & UI ---
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            document.querySelector(targetId).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    const elementsToAnimate = document.querySelectorAll('.artist-card, .service-item, .gallery-item, .section-title, .service-icon, .hero-tagline, .hero h1, .hero-description, .contact-btn, .footer-logo');

    elementsToAnimate.forEach((el, index) => {
        el.classList.add('animate-element');
        el.style.transitionDelay = `${(index % 4) * 0.1}s`;
        observer.observe(el);
    });

    const nav = document.querySelector('nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.style.background = 'rgba(10, 10, 10, 0.95)';
            nav.style.padding = '1rem 5%';
        } else {
            nav.style.background = 'linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)';
            nav.style.padding = '2rem 5%';
        }
    });

    const cookieBanner = document.getElementById('cookie-banner');
    const acceptCookiesBtn = document.getElementById('accept-cookies');

    if (cookieBanner && !localStorage.getItem('cookiesAccepted')) {
        setTimeout(() => {
            cookieBanner.classList.add('show');
        }, 1000);
    }

    if (acceptCookiesBtn) {
        acceptCookiesBtn.addEventListener('click', () => {
            localStorage.setItem('cookiesAccepted', 'true');
            cookieBanner.classList.remove('show');
        });
    }

});
