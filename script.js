document.addEventListener('DOMContentLoaded', () => {

    // --- Interaction States ---
    let userHasInteracted = false;
    const setInteraction = () => {
        if (userHasInteracted) return;
        userHasInteracted = true;
        console.log("User interacted - Hover videos enabled");
        // We don't remove listeners to capture all first-time interactions correctly
    };
    document.addEventListener('click', setInteraction);
    document.addEventListener('touchstart', setInteraction);
    document.addEventListener('keydown', setInteraction);

    // --- Dynamic Copyright ---
    const copyright = document.querySelector('.copyright');
    if (copyright) {
        copyright.innerHTML = `&copy; ${new Date().getFullYear()} ALEX BALTAR. ALL RIGHTS RESERVED.`;
    }

    // --- Video Modal Logic ---
    const modal = document.getElementById('video-modal');
    const modalContainer = document.getElementById('modal-video-container');
    const modalClose = modal.querySelector('.modal-close');
    const modalOverlay = modal.querySelector('.modal-overlay');

    const openModal = (vimeoId) => {
        const iframe = document.createElement('iframe');
        // Player completo con controles y sonido
        iframe.src = `https://player.vimeo.com/video/${vimeoId}?autoplay=1&muted=0&controls=1`;
        iframe.allow = "autoplay; fullscreen; picture-in-picture";
        iframe.allowFullscreen = true;

        modalContainer.innerHTML = '';
        modalContainer.appendChild(iframe);
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        modal.classList.remove('active');
        modalContainer.innerHTML = '';
        document.body.style.overflow = '';
    };

    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modalOverlay) modalOverlay.addEventListener('click', closeModal);
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
    });

    // --- Artist Cards Interaction ---
    const artistCards = document.querySelectorAll('.artist-card');

    artistCards.forEach(card => {
        const vimeoId = card.getAttribute('data-vimeo-id');
        const vimeoWrapper = card.querySelector('.vimeo-wrapper');
        let hoverIframe = null;

        if (vimeoId && vimeoWrapper) {
            // Estado inicial: Thumbnail estático
            vimeoWrapper.style.backgroundImage = `url(https://vumbnail.com/${vimeoId}.jpg)`;
            vimeoWrapper.style.backgroundSize = 'cover';
            vimeoWrapper.style.backgroundPosition = 'center';

            card.addEventListener('mouseenter', () => {
                if (!userHasInteracted) {
                    // Zoom sutil si aún no interactuó (autoplay policy protection)
                    card.classList.add('scaling');
                    return;
                }

                // Cargar vídeo en el hover si ya interactuó
                if (!hoverIframe) {
                    hoverIframe = document.createElement('iframe');
                    // Parámetros de fondo: sin controles, loop, autoplay, muted
                    hoverIframe.src = `https://player.vimeo.com/video/${vimeoId}?background=1&autoplay=1&muted=1&loop=1&byline=0&title=0&controls=0&quality=540p`;
                    hoverIframe.style.width = '100%';
                    hoverIframe.style.height = '100%';
                    hoverIframe.style.border = 'none';
                    hoverIframe.style.opacity = '0';
                    hoverIframe.style.transition = 'opacity 0.4s ease';
                    hoverIframe.style.pointerEvents = 'none'; // No interfiere con el hover del card

                    vimeoWrapper.appendChild(hoverIframe);

                    hoverIframe.onload = () => {
                        hoverIframe.style.opacity = '0.6';
                    };
                }
            });

            card.addEventListener('mouseleave', () => {
                card.classList.remove('scaling');
                if (hoverIframe) {
                    hoverIframe.remove();
                    hoverIframe = null;
                }
            });

            card.addEventListener('click', () => {
                openModal(vimeoId);
            });
        }
    });

    // --- Service Item Link Handling ---
    document.querySelectorAll('.service-item').forEach(item => {
        item.addEventListener('click', () => {
            const target = item.getAttribute('data-target');
            if (target) {
                const targetEl = document.querySelector(target);
                if (targetEl) targetEl.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // --- Navigation Smooth Scroll ---
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetEl = document.querySelector(href);
                if (targetEl) targetEl.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // --- Intersection Observer para Animaciones ---
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

    // --- Navbar Scroll Logic ---
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

    // --- Cookie Banner ---
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
