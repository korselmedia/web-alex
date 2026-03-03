document.addEventListener('DOMContentLoaded', () => {

    // --- Interaction States ---
    let userHasInteracted = false;
    const setInteraction = () => {
        if (userHasInteracted) return;
        userHasInteracted = true;
    };
    document.addEventListener('mousedown', setInteraction);
    document.addEventListener('touchstart', setInteraction);
    document.addEventListener('keydown', setInteraction);

    // --- Dynamic Copyright ---
    const copyright = document.querySelector('.copyright');
    if (copyright) {
        copyright.innerHTML = `&copy; ${new Date().getFullYear()} ALEX BALTAR. ALL RIGHTS RESERVED.`;
    }

    // --- Artist Cards Interaction ---
    const artistCards = document.querySelectorAll('.artist-card');

    artistCards.forEach(card => {
        const vimeoId = card.getAttribute('data-vimeo-id');
        const vimeoWrapper = card.querySelector('.vimeo-wrapper');
        let player = null;

        if (vimeoId && vimeoWrapper) {
            // Initial state: Static Thumbnail
            vimeoWrapper.style.backgroundImage = `url(https://vumbnail.com/${vimeoId}.jpg)`;
            vimeoWrapper.style.backgroundSize = 'cover';
            vimeoWrapper.style.backgroundPosition = 'center';

            card.addEventListener('mouseenter', () => {
                if (!userHasInteracted) {
                    card.classList.add('scaling');
                    return;
                }

                if (!player) {
                    // Initialize player on first hover AFTER interaction
                    player = new Vimeo.Player(vimeoWrapper, {
                        id: vimeoId,
                        background: true, // No UI, auto-muted
                        autoplay: true,
                        loop: true,
                        responsive: true,
                        quality: '540p'
                    });

                    player.on('loaded', () => {
                        const iframe = vimeoWrapper.querySelector('iframe');
                        if (iframe) iframe.style.opacity = '1';
                    });
                } else {
                    player.play();
                }
            });

            card.addEventListener('mouseleave', () => {
                card.classList.remove('scaling');
                if (player) {
                    player.pause();
                }
            });

            card.addEventListener('click', () => {
                // Click to unmute/mute inside the card
                if (player) {
                    player.getMuted().then(muted => {
                        player.setMuted(!muted);
                    });
                }
            });
        }
    });

    // --- Service Item Link Handling ---
    document.querySelectorAll('.service-item').forEach(item => {
        item.style.cursor = 'pointer';
        item.addEventListener('click', () => {
            const target = item.getAttribute('data-target');
            if (target) {
                document.querySelector(target).scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // --- Navigation ---
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            document.querySelector(targetId).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // --- Intersection Observer for Reveal Animations ---
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

    // --- Navbar transparency on scroll ---
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

    // --- Cookie Banner Logic ---
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
