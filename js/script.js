// Wait for the DOM to be fully loaded before executing JavaScript
document.addEventListener("DOMContentLoaded", function () {
  // Handle lazy loading of images
  const lazyImages = document.querySelectorAll(".lazy-load");

  const lazyLoad = (target) => {
    const io = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.classList.add("loaded");
          observer.disconnect();
        }
      });
    });

    io.observe(target);
  };

  lazyImages.forEach(lazyLoad);

  // Theme toggle functionality
  const themeToggle = document.querySelector(".theme-toggle");
  if (themeToggle) {
    const themeIcon = themeToggle.querySelector("i");
    let darkMode = true; // Start in dark mode

    themeToggle.addEventListener("click", function () {
      darkMode = !darkMode;
      if (darkMode) {
        document.body.classList.add("dark-mode");
        themeIcon.className = "fas fa-moon";
      } else {
        document.body.classList.remove("dark-mode");
        themeIcon.className = "fas fa-sun";
      }
    });
  }

  // Navigation bar scroll effect
  const navbar = document.querySelector(".navbar");

  // Get all sections that have an ID defined
  const sections = document.querySelectorAll("section[id]");

  // Get all nav links
  const navLinks = document.querySelectorAll(".navbar-nav .nav-link");

  // Function to set active nav item based on scroll position
  function setActiveNav() {
    // Get current scroll position
    const scrollPosition = window.scrollY + 150; // Add offset for better detection

    // Loop through sections to find which one is currently in view
    sections.forEach((section) => {
      const sectionId = section.getAttribute("id");
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      // Check if section is in viewport
      if (
        scrollPosition >= sectionTop &&
        scrollPosition < sectionTop + sectionHeight
      ) {
        // First remove all active classes
        navLinks.forEach((link) => link.classList.remove("active"));

        // Add active class to the corresponding link
        const currentLink = document.querySelector(
          `.navbar-nav .nav-link[href="#${sectionId}"]`
        );
        if (currentLink) {
          currentLink.classList.add("active");
        }
      }
    });

    // Special case for top of page (first 100 pixels)
    if (window.scrollY < 100) {
      navLinks.forEach((link) => link.classList.remove("active"));
      const homeLink = document.querySelector(
        '.navbar-nav .nav-link[href="#hero"]'
      );
      if (homeLink) {
        homeLink.classList.add("active");
      }
    }
  }

  // Add scroll event listener with debounce for better performance
  let isScrolling;
  window.addEventListener("scroll", function () {
    // Update navbar appearance
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }

    // Debounce scroll event for performance
    window.clearTimeout(isScrolling);
    isScrolling = setTimeout(function () {
      setActiveNav();
    }, 10);
  });

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const href = this.getAttribute("href");

      if (href === "#") return;

      const targetElement = document.querySelector(href);
      if (targetElement) {
        const navHeight = navbar.offsetHeight;
        const targetPosition = targetElement.offsetTop - navHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });

        // Update active nav item after scrolling
        setTimeout(setActiveNav, 100);
      }
    });
  });

  // Initialize active state on page load
  setActiveNav();

  // Form submission handling
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Basic form validation
      const formElements = contactForm.elements;
      let isValid = true;

      for (let i = 0; i < formElements.length; i++) {
        const element = formElements[i];

        if (element.tagName === "INPUT" || element.tagName === "TEXTAREA") {
          if (element.value.trim() === "") {
            isValid = false;
            element.classList.add("is-invalid");
          } else {
            element.classList.remove("is-invalid");
          }
        }
      }

      if (isValid) {
        // Show success message (in a real app, you would send the form data to a server)
        const formData = new FormData(contactForm);
        const formDataObj = {};

        formData.forEach((value, key) => {
          formDataObj[key] = value;
        });

        console.log("Form data:", formDataObj);
        alert("Thank you for your message! We will get back to you soon.");
        contactForm.reset();
      } else {
        alert("Please fill out all fields in the form.");
      }
    });
  }

  // Newsletter form submission
  const newsletterForm = document.querySelector(".newsletter-form");
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const emailInput = newsletterForm.querySelector('input[type="email"]');
      const email = emailInput.value.trim();

      if (email === "") {
        alert("Please enter your email address.");
        return;
      }

      // Email validation with regex
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        alert("Please enter a valid email address.");
        return;
      }

      // In a real application, you would send this to a server
      console.log("Newsletter subscription:", email);
      alert("Thank you for subscribing to our newsletter!");
      newsletterForm.reset();
    });
  }

  // Enhanced mobile navigation menu handling
  const navbarToggler = document.querySelector(".navbar-toggler");
  const navbarNav = document.querySelector("#navbarNav");
  const dropdownToggles = document.querySelectorAll(".dropdown-toggle");

  if (navbarToggler && navbarNav) {
    document.addEventListener("click", function (e) {
      // Close the menu when clicking outside of it
      if (
        navbarNav.classList.contains("show") &&
        !navbarNav.contains(e.target) &&
        !navbarToggler.contains(e.target)
      ) {
        navbarToggler.click();
      }
    });

    // Close the menu when clicking on a nav link on mobile
    const navLinks = document.querySelectorAll(
      ".navbar-nav .nav-link:not(.dropdown-toggle)"
    );
    navLinks.forEach((link) => {
      link.addEventListener("click", function () {
        if (navbarNav.classList.contains("show")) {
          navbarToggler.click();
        }
      });
    });

    // Improve dropdown behavior on mobile
    if (window.innerWidth < 992) {
      // For mobile: prevent immediate closing of dropdown menu when clicking dropdown items
      const dropdownItems = document.querySelectorAll(".dropdown-item");
      dropdownItems.forEach((item) => {
        item.addEventListener("click", function (e) {
          // Close the mobile menu after selecting an item
          if (navbarNav.classList.contains("show")) {
            setTimeout(() => {
              navbarToggler.click();
            }, 150);
          }
        });
      });
    }
  }

  // Improve dropdown handling for touch devices
  dropdownToggles.forEach((toggle) => {
    toggle.addEventListener("click", function (e) {
      if (window.innerWidth < 992) {
        e.preventDefault();
        const parent = this.parentElement;
        const dropdownMenu = parent.querySelector(".dropdown-menu");

        // Toggle open/closed state
        if (dropdownMenu.classList.contains("show")) {
          dropdownMenu.classList.remove("show");
        } else {
          // Close other open dropdowns first
          document.querySelectorAll(".dropdown-menu.show").forEach((menu) => {
            if (menu !== dropdownMenu) {
              menu.classList.remove("show");
            }
          });
          dropdownMenu.classList.add("show");
        }
      }
    });
  });

  // Handle window resize - adjust for desktop/mobile transitions
  let resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      // Close mobile menu on window resize
      if (navbarNav && navbarNav.classList.contains("show")) {
        navbarToggler.click();
      }

      // Reset any open dropdowns
      document.querySelectorAll(".dropdown-menu.show").forEach((menu) => {
        menu.classList.remove("show");
      });
    }, 250);
  });

  // Add touch event support
  let touchStartX = 0;
  let touchEndX = 0;

  // Detect swipe right to close mobile menu
  if (navbarNav) {
    navbarNav.addEventListener(
      "touchstart",
      (e) => {
        touchStartX = e.changedTouches[0].screenX;
      },
      false
    );

    navbarNav.addEventListener(
      "touchend",
      (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
      },
      false
    );
  }

  function handleSwipe() {
    if (touchEndX - touchStartX > 100 && navbarNav.classList.contains("show")) {
      // Swipe right detected - close menu
      navbarToggler.click();
    }
  }

  // Set the current year in the copyright text
  const copyrightYear = document.querySelector(".copyright p");
  if (copyrightYear) {
    const year = new Date().getFullYear();
    copyrightYear.innerHTML = `&copy; ${year} Dream Merchants. All Rights Reserved.`;
  }

  // Animate on scroll initialization
  const animateElements = document.querySelectorAll(".animate");

  function checkIfInView() {
    animateElements.forEach((element) => {
      const elementTop = element.getBoundingClientRect().top;
      const elementVisible = 150;

      if (elementTop < window.innerHeight - elementVisible) {
        element.classList.add("active");
      }
    });
  }

  window.addEventListener("scroll", checkIfInView);
  window.addEventListener("load", checkIfInView);

  // Fix iOS 100vh issue
  function setVh() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  }

  setVh();
  window.addEventListener("resize", setVh);
});
