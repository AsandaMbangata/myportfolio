// DOM Elements
const navbar = document.querySelector('.navbar');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const contactForm = document.getElementById('contactForm');
const skillProgressBars = document.querySelectorAll('.skill-progress');

// Mobile Navigation Toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    
    // Animate hamburger menu
    const spans = hamburger.querySelectorAll('span');
    if (hamburger.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
    } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
});

// Close mobile menu when clicking on nav links
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        
        // Reset hamburger animation
        const spans = hamburger.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    });
});

// Smooth Scrolling for Navigation Links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
            
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar Background on Scroll
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(0, 0, 0, 0.98)';
        navbar.style.backdropFilter = 'blur(15px)';
    } else {
        navbar.style.background = 'rgba(0, 0, 0, 0.95)';
        navbar.style.backdropFilter = 'blur(10px)';
    }
});

// Active Navigation Link Highlighting
function highlightActiveSection() {
    const sections = document.querySelectorAll('.section');
    const scrollPos = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        const correspondingLink = document.querySelector(`a[href="#${sectionId}"]`);
        
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            if (correspondingLink) {
                correspondingLink.classList.add('active');
            }
        }
    });
}

window.addEventListener('scroll', highlightActiveSection);

// Intersection Observer for Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            
            // Animate skill progress bars when skills section is visible
            if (entry.target.id === 'skills') {
                animateSkillBars();
            }
        }
    });
}, observerOptions);

// Observe sections for animations
document.querySelectorAll('.section').forEach(section => {
    section.classList.add('fade-in');
    observer.observe(section);
});

// Animate Skill Progress Bars
function animateSkillBars() {
    skillProgressBars.forEach((bar, index) => {
        const progress = bar.getAttribute('data-progress');
        setTimeout(() => {
            bar.style.width = progress + '%';
        }, index * 200); // Stagger animation
    });
}

// Contact Form Handling
contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const formObject = {};
    
    // Convert FormData to object
    formData.forEach((value, key) => {
        formObject[key] = value;
    });
    
    // Validate form
    if (!validateForm(formObject)) {
        return;
    }
    
    // Add loading state
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    contactForm.classList.add('loading');
    
    try {
        // Simulate form submission
        await simulateFormSubmission(formObject);
        
        // Show success message
        showNotification('Message sent successfully!', 'success');
        contactForm.reset();
        
        // Remove any error states
        contactForm.querySelectorAll('.error').forEach(el => {
            el.classList.remove('error');
        });
        
    } catch (error) {
        showNotification('Failed to send message. Please try again.', 'error');
    } finally {
        // Reset button state
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        contactForm.classList.remove('loading');
    }
});

// Form Validation
function validateForm(formData) {
    let isValid = true;
    
    // Clear previous error states
    contactForm.querySelectorAll('.error').forEach(el => {
        el.classList.remove('error');
    });
    
    // Validate name
    if (!formData.name || formData.name.trim().length < 2) {
        markFieldAsError('name');
        isValid = false;
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
        markFieldAsError('email');
        isValid = false;
    }
    
    // Validate message
    if (!formData.message || formData.message.trim().length < 10) {
        markFieldAsError('message');
        isValid = false;
    }
    
    if (!isValid) {
        showNotification('Please fill in all fields correctly.', 'error');
    }
    
    return isValid;
}

// Mark form field as error
function markFieldAsError(fieldName) {
    const field = document.getElementById(fieldName);
    if (field) {
        field.classList.add('error');
        
        // Remove error state after user starts typing
        field.addEventListener('input', () => {
            field.classList.remove('error');
        }, { once: true });
    }
}

// Simulate form submission
function simulateFormSubmission(formData) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simulate success/failure (you would replace this with actual API call)
            if (Math.random() > 0.1) { // 90% success rate
                resolve();
            } else {
                reject(new Error('Submission failed'));
            }
        }, 2000);
    });
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Add notification styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background-color: ${type === 'success' ? 'var(--success-color)' : 'var(--error-color)'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: var(--border-radius);
        box-shadow: var(--shadow-lg);
        z-index: 9999;
        transform: translateX(100%);
        transition: var(--transition);
        max-width: 300px;
    `;
    
    notification.querySelector('.notification-content').style.cssText = `
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
    `;
    
    notification.querySelector('.notification-close').style.cssText = `
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        font-size: 1rem;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 300);
    }, 5000);
}

// Parallax Effect for Hero Section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const aboutSection = document.getElementById('about');
    
    if (aboutSection) {
        const rate = scrolled * -0.5;
        aboutSection.style.transform = `translateY(${rate}px)`;
    }
});

// Initialize Page
document.addEventListener('DOMContentLoaded', () => {
    // Add initial animations
    setTimeout(() => {
        const heroElements = document.querySelectorAll('#about .fade-in');
        heroElements.forEach((element, index) => {
            setTimeout(() => {
                element.classList.add('visible');
            }, index * 200);
        });
    }, 500);
    
    // Initialize any other page elements
    highlightActiveSection();
});

// Project Card Interactions
document.addEventListener('DOMContentLoaded', () => {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) rotateX(5deg)';
            card.style.boxShadow = '0 20px 40px rgba(255, 0, 79, 0.2)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) rotateX(0)';
            card.style.boxShadow = 'var(--shadow-lg)';
        });
    });
});

// Certificate Card Interactions
document.addEventListener('DOMContentLoaded', () => {
    const certificateCards = document.querySelectorAll('.certificate-card');
    
    certificateCards.forEach(card => {
        card.addEventListener('click', () => {
            card.style.transform = 'scale(0.98)';
            setTimeout(() => {
                card.style.transform = 'scale(1)';
            }, 150);
        });
    });
});

// Keyboard Navigation Support
document.addEventListener('keydown', (e) => {
    // ESC key closes mobile menu
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        
        const spans = hamburger.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
});

// Performance Optimization: Throttled Scroll Events
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Replace direct scroll event listeners with throttled versions
window.addEventListener('scroll', throttle(() => {
    // Navbar background update
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(0, 0, 0, 0.98)';
        navbar.style.backdropFilter = 'blur(15px)';
    } else {
        navbar.style.background = 'rgba(0, 0, 0, 0.95)';
        navbar.style.backdropFilter = 'blur(10px)';
    }
    
    // Active section highlighting
    highlightActiveSection();
}, 16)); // ~60fps
