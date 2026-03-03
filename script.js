document.addEventListener('DOMContentLoaded', () => {

    // --- Performance-optimized Video Lazy Loading ---
    const artistCards = document.querySelectorAll('.artist-card');

    artistCards.forEach(card => {
        const vimeoId = card.getAttribute('data-vimeo-id');
        const vimeoWrapper = card.querySelector('.vimeo-wrapper');
        let player = null;

        const initPlayer = () => {
            if (player || !vimeoId || !vimeoWrapper) return;

            player = new Vimeo.Player(vimeoWrapper, {
                id: vimeoId,
                background: true,
                autoplay: false,
                loop: true,
                muted: true,
                responsive: true
            });

            // Auto-play when initialized (since it's triggered by interaction)
            player.play();
        };

        card.addEventListener('mouseenter', () => {
            if (!player) {
                initPlayer();
            } else {
                player.play();
            }
        });

        card.addEventListener('mouseleave', () => {
            if (player) {
                player.pause();
                player.setMuted(true);
            }
        });

        card.addEventListener('click', (e) => {
            if (!player) {
                initPlayer();
            } else {
                player.getMuted().then(muted => {
                    player.setMuted(!muted);
                });
            }
        });
    });

    // --- Optimized Parallax for Mobile & Desktop ---
    const parallaxDividers = document.querySelectorAll('.parallax-divider');
    const isMobile = window.innerWidth <= 768;

    const updateParallax = () => {
        const scrolled = window.scrollY;

        parallaxDividers.forEach(divider => {
            const rect = divider.getBoundingClientRect();
            const offsetTop = rect.top + scrolled;

            // Check if element is in viewport
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const speed = 0.4;
                const yPos = (scrolled - offsetTop) * speed;

                // On mobile we use transform for better performance than background-position
                if (isMobile) {
                    divider.style.backgroundPosition = `center ${yPos}px`;
                } else {
                    // Desktop can use background-attachment: fixed or manual position
                    divider.style.backgroundPosition = `center ${yPos}px`;
                }
            }
        });
    };

    window.addEventListener('scroll', () => {
        requestAnimationFrame(updateParallax);
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
