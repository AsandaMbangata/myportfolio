document.addEventListener('DOMContentLoaded', function () {
  emailjs.init('tSHYS3wE0VSa30mfJ');

  const contactForm = document.getElementById('contactForm');

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

    // Remove loading class from body to enable pointer events on chat icon
    document.body.classList.remove('loading');

    try {
      console.log('Sending email with EmailJS:', formObject);
      // Send email using EmailJS
      await emailjs.send('service_r4jj4jf', 'template_1e0pnhi', formObject);
      console.log('Email sent successfully');

      // Show success message
      showNotification('Message sent successfully!', 'success');
      contactForm.reset();

      // Remove any error states
      contactForm.querySelectorAll('.error').forEach(el => {
        el.classList.remove('error');
      });

    } catch (error) {
      console.error('EmailJS send error:', error);
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

  // Removed simulateFormSubmission function as EmailJS is now used for sending emails

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
    highlightActiveSection(); // Ensure this function is defined elsewhere if needed
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
    const navMenu = document.getElementById('nav-menu'); // Assuming navMenu is defined globally or elsewhere
    const hamburger = document.getElementById('hamburger'); // Assuming hamburger is defined globally or elsewhere

    if (navMenu && hamburger && e.key === 'Escape' && navMenu.classList.contains('active')) {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');

      const spans = hamburger.querySelectorAll('span');
      if (spans[0]) spans[0].style.transform = 'none';
      if (spans[1]) spans[1].style.opacity = '1';
      if (spans[2]) spans[2].style.transform = 'none';
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
    const navbar = document.getElementById('navbar'); // Assuming navbar is defined globally or elsewhere

    // Navbar background update
    if (navbar) {
      if (window.scrollY > 50) {
        navbar.style.background = 'rgba(0, 0, 0, 0.98)';
        navbar.style.backdropFilter = 'blur(15px)';
      } else {
        navbar.style.background = 'rgba(0, 0, 0, 0.95)';
        navbar.style.backdropFilter = 'blur(10px)';
      }
    }

    // Active section highlighting
    highlightActiveSection(); // Ensure this function is defined elsewhere if needed
  }, 16)); // ~60fps

  // AsandaBot Chatbot Logic
  const asandaAnswers = [
    {
      keywords: ["who is asanda", "about asanda", "background", "bio"],
      answer: `Hello! I'm Asanda Mbangata, a Software Developer and AI Associate with a solid foundation in full-stack development, backend integration, and database management. I'm proficient in Java, SQL, JavaScript, and Spring Boot, and passionate about creating reliable, user-friendly software solutions.`
    },
    {
      keywords: ["project", "work", "portfolio"],
      answer: `<b>Here are some projects I've worked on:</b><ul>
        <li><b>Student Enrollment System</b>: Developed the database using SQL and Java, collaborating in a team.</li>
        <li><b>Event Management Website</b>: Contributed to both front-end and back-end development.</li>
        <li><b>Animal Shelter Application (Capstone)</b>: Worked on backend with Spring Boot, front-end with Swing, and implemented authentication.</li>
        <li><b>Timesheet Management Desktop App</b>: Designed UI with Figma, developed with JavaFX and Spring Boot.</li>
      </ul>`
    },
    {
      keywords: ["contact", "email", "phone", "reach", "get in touch"],
      answer: `You can contact me at <b>mbangataa9@gmail.com</b> or call <b>078 246 6622</b>. You can also use the contact form on this site or connect via <a href="https://github.com/AsandaMbangata" target="_blank">GitHub</a> or <a href="https://www.linkedin.com/in/asanda-mbangata-2b0890232/" target="_blank">LinkedIn</a>.`
    },
    {
      keywords: ["skill", "technology", "tech stack", "tools", "languages"],
      answer: `<b>My skills include:</b><ul>
        <li>Programming: Java, JavaScript, HTML & CSS, Python</li>
        <li>Frameworks/Databases: Spring Boot, PostgreSQL, SQL, Laravel</li>
      </ul>`
    },
    {
      keywords: ["certificate", "certification", "course"],
      answer: `<b>Some of my certificates:</b><ul>
        <li>Introduction to Software Engineering (IBM via Coursera)</li>
        <li>Generative AI: Introduction and Applications (IBM via Coursera)</li>
        <li>Introduction to Git and GitHub (Google via Coursera)</li>
        <li>Emotional Intelligence (Arizona State University via Coursera)</li>
        <li>Professional Voice: Confidence & Impact (University of London via Coursera)</li>
        <li>Time Management for Productivity (UC Irvine via Coursera)</li>
      </ul>`
    }
  ];

  function asandaBotGetAnswer(input) {
    const text = input.toLowerCase();
    for (const item of asandaAnswers) {
      if (item.keywords.some(k => text.includes(k))) {
        return item.answer;
      }
    }
    return `Sorry, I don't have information about that. Please ask about Asanda's background, skills, projects, or how to contact them.`;
  }

  // Chatbot UI logic
  const widget = document.getElementById('asandabot-widget');
  const toggleBtn = document.getElementById('asandabot-toggle');
  const closeBtn = document.getElementById('asandabot-close');
  const messages = document.getElementById('asandabot-messages');
  const form = document.getElementById('asandabot-form');
  const input = document.getElementById('asandabot-input');

  if (toggleBtn) { // Check if elements exist before adding event listeners
    toggleBtn.onclick = () => {
      if (widget) widget.style.display = 'flex';
      if (toggleBtn) toggleBtn.style.display = 'none';
      if (input) input.focus();
    };
  }
  if (closeBtn) {
    closeBtn.onclick = () => {
      if (widget) widget.style.display = 'none';
      if (toggleBtn) toggleBtn.style.display = 'flex';
    };
  }
  if (form) {
    form.onsubmit = (e) => {
      e.preventDefault();
      const userMsg = input.value.trim();
      if (!userMsg) return;
      addMessage(userMsg, 'user');
      setTimeout(() => {
        const botMsg = asandaBotGetAnswer(userMsg);
        addMessage(botMsg, 'bot');
      }, 500);
      input.value = '';
    };
  }

  function addMessage(text, sender) {
    if (!messages) return; // Ensure messages element exists
    const msgDiv = document.createElement('div');
    msgDiv.className = `asandabot-message asandabot-${sender}`;
    const bubble = document.createElement('div');
    bubble.className = 'asandabot-bubble';
    bubble.innerHTML = text;
    msgDiv.appendChild(bubble);
    messages.appendChild(msgDiv);
    messages.scrollTop = messages.scrollHeight;
  }

  // Greet on open
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      if (messages) messages.innerHTML = '';
      addMessage("Hi, I'm AsandaBot! Ask me about Asanda's background, skills, projects, or how to contact them.", 'bot');
    });
  }
});

// Placeholder for highlightActiveSection if not defined elsewhere
function highlightActiveSection() {
  // Implement your logic for highlighting the active section here
  // For example, based on scroll position and section IDs
}