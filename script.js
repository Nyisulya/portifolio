document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Navigation Menu Toggle
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      navLinks.classList.toggle('active');
    });

    // Close mobile menu when a link is clicked
    const links = navLinks.querySelectorAll('a');
    links.forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navLinks.classList.remove('active');
      });
    });
  }

  // 2. Light / Dark Theme Toggle
  const themeToggle = document.getElementById('themeToggle');
  const body = document.body;
  
  if (themeToggle) {
    const themeIcon = themeToggle.querySelector('i');
    
    // Check user preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      body.setAttribute('data-theme', savedTheme);
      if (savedTheme === 'light' && themeIcon) {
        themeIcon.className = 'fa-solid fa-sun';
      }
    }

    themeToggle.addEventListener('click', () => {
      const currentTheme = body.getAttribute('data-theme');
      if (currentTheme === 'light') {
        body.removeAttribute('data-theme');
        if (themeIcon) themeIcon.className = 'fa-solid fa-moon';
        localStorage.setItem('theme', 'dark');
      } else {
        body.setAttribute('data-theme', 'light');
        if (themeIcon) themeIcon.className = 'fa-solid fa-sun';
        localStorage.setItem('theme', 'light');
      }
    });
  }

  // Active Navigation link highlighting based on current page
  const currentPath = window.location.pathname.split("/").pop();
  const navLinksList = document.querySelectorAll('.nav-links a');
  navLinksList.forEach(link => {
    link.classList.remove('active');
    const hrefAttr = link.getAttribute('href');
    if (currentPath === hrefAttr || (currentPath === '' && hrefAttr === 'index.html')) {
      link.classList.add('active');
    }
  });

  // 3. Project Filter Logic (Runs only on projects.html)
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (filterButtons.length > 0 && projectCards.length > 0) {
    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        const filterValue = button.getAttribute('data-filter');

        projectCards.forEach(card => {
          if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
            card.style.display = 'flex';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, 100);
          } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(10px)';
            setTimeout(() => {
              card.style.display = 'none';
            }, 200);
          }
        });
      });
    });
  }

  // 4. Interactive Terminal Simulation removed

  // 5. Contact Form Simulation and URL Plan Selection (Runs only on contact.html)
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');
  const subjectSelect = document.getElementById('subject');

  if (subjectSelect) {
    // Read query parameter and preselect option
    const urlParams = new URLSearchParams(window.location.search);
    const planParam = urlParams.get('plan');
    
    if (planParam) {
      if (planParam === 'basic') {
        subjectSelect.value = 'hosting_basic';
      } else if (planParam === 'business') {
        subjectSelect.value = 'hosting_business';
      } else if (planParam === 'custom') {
        subjectSelect.value = 'hosting_custom';
      }
    }
  }

  if (contactForm && formStatus) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Disable submit button during processing
      const submitBtn = contactForm.querySelector('.submit-btn');
      const originalBtnHTML = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Inatuma... <i class="fa-solid fa-spinner fa-spin"></i>';

      // Send actual AJAX request to FormSubmit
      fetch("https://formsubmit.co/ajax/info@nyisu.com", {
        method: "POST",
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: document.getElementById("name").value,
          email: document.getElementById("email").value,
          subject: document.getElementById("subject").value,
          message: document.getElementById("message").value
        })
      })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Tuma imefeli");
        }
      })
      .then(data => {
        formStatus.style.display = 'block';
        formStatus.className = 'form-status success';
        formStatus.innerText = 'Asante! Ujumbe wako umetumwa kwa ufanisi. Timu ya Nyisu Tech Solution itakujibu hivi punde.';
        contactForm.reset();
      })
      .catch(error => {
        formStatus.style.display = 'block';
        formStatus.className = 'form-status error';
        formStatus.innerText = 'Samahani, ujumbe haujatumwa. Tafadhali jaribu tena au wasiliana nasi moja kwa moja kwa barua pepe.';
      })
      .finally(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHTML;
        
        // Hide success/error message after 6 seconds
        setTimeout(() => {
          formStatus.style.display = 'none';
        }, 6000);
      });
    });
  }
});
