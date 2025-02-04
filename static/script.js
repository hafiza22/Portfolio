document.addEventListener("DOMContentLoaded", function() {
    // Hide loader when page is loaded
    const loader = document.getElementById('loader');
    if (loader) {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        }, 500);
    }

    // Elements object
    const elements = {
        header: document.getElementById('sticky-header'),
        home: document.getElementById('home'),
        progressBars: document.querySelectorAll(".progress-bar"),
        sections: document.querySelectorAll("section"),
        navLinks: document.querySelectorAll(".nav-link"),
        scrollTopBtn: document.getElementById('scrollToTop'),
        contactForm: document.getElementById('contact-form')
    };

    // Progress bar observer
    const progressObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.width = entry.target.dataset.width;
                entry.target.style.opacity = "1";
            }
        });
    }, { threshold: 0.5 });

    // Navigation observer
    const navObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                elements.navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute("href") === `#${id}`);
                });
            }
        });
    }, { threshold: 0.5 });

    // Initialize observers
    if (elements.progressBars) {
        elements.progressBars.forEach(bar => {
            bar.style.width = "0";
            bar.style.opacity = "0";
            bar.style.transition = "width 1s ease-out, opacity 0.5s ease-in";
            progressObserver.observe(bar);
        });
    }

    elements.sections.forEach(section => navObserver.observe(section));

    // Scroll handler
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        if (elements.header) {
            elements.header.classList.toggle('scrolled', currentScroll > 50);
        }
        if (elements.scrollTopBtn) {
            elements.scrollTopBtn.style.opacity = currentScroll > 300 ? '1' : '0';
        }
    });

    // Scroll to top button
    if (elements.scrollTopBtn) {
        elements.scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Contact form handler
    if (elements.contactForm) {
        elements.contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitButton = this.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.innerHTML;
            
            try {
                // Show loading state
                submitButton.disabled = true;
                submitButton.innerHTML = `
                    <svg class="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                `;

                const response = await fetch(this.action, {
                    method: 'POST',
                    body: new FormData(this),
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (!response.ok) throw new Error('Network response was not ok');

                // Success handling
                this.reset();
                submitButton.innerHTML = 'Message Sent!';
                setTimeout(() => {
                    submitButton.disabled = false;
                    submitButton.innerHTML = originalButtonText;
                }, 3000);

            } catch (error) {
                console.error('Error:', error);
                submitButton.innerHTML = 'Error Sending Message';
                setTimeout(() => {
                    submitButton.disabled = false;
                    submitButton.innerHTML = originalButtonText;
                }, 3000);
            }
        });
    }

    // Smooth scroll for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerOffset = 80; // Adjust this value based on your header height
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Contact section animation
    const contactObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const containers = entry.target.querySelectorAll('.contact-info-container, .contact-form-container');
                containers.forEach(container => {
                    container.style.animationPlayState = 'running';
                });
                contactObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    const contactSection = document.querySelector('#contact .grid');
    if (contactSection) {
        contactObserver.observe(contactSection);
    }
});
