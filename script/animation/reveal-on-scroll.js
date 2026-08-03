export function revealElement(element, { delay = 0 } = {}) {
    if (!element) {
        return;
    }

    if (!element.classList.contains('reveal')) {
        element.classList.add('reveal');
    }

    window.requestAnimationFrame(() => {
        window.setTimeout(() => {
            element.classList.add('is-visible');
        }, delay);
    });
}

export function initRevealOnScroll(root = document, selector = 'section, article, .menu-card, .feature-card, .testimonial-card, .contact-card, .transaction-card, footer') {
    const elements = Array.from(root.querySelectorAll(selector)).filter((element) => !element.classList.contains('reveal-disabled'));

    if (!elements.length) {
        return;
    }

    elements.forEach((element) => {
        if (!element.classList.contains('reveal')) {
            element.classList.add('reveal');
        }
    });

    if (typeof IntersectionObserver === 'undefined') {
        elements.forEach((element) => element.classList.add('is-visible'));
        return;
    }

    const observer = new IntersectionObserver((entries, currentObserver) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                currentObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
    });

    elements.forEach((element) => observer.observe(element));
}
