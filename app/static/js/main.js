/**
 * HealthTracker - Main JavaScript File
 */

document.addEventListener("DOMContentLoaded", function () {
  // Initialize Dark Mode from localStorage
  initializeTheme();

  // Flash messages auto-close
  initializeFlashMessages();

  // Form validation
  initializeFormValidation();

  // Responsive navigation
  initializeResponsiveNavigation();

  // Smooth scroll for anchor links
  initializeSmoothScroll();

  // Initialize tooltips
  initializeTooltips();

  // Add a theme toggle button to the page if it doesn't exist
  addThemeToggleButton();
});

/**
 * Add theme toggle button to the page
 */
function addThemeToggleButton() {
  // Don't add theme toggle on login, register, and landing pages
  const currentPath = window.location.pathname;
  if (
    currentPath === "/" ||
    currentPath.includes("/login") ||
    currentPath.includes("/register")
  ) {
    return;
  }

  // Check if the button already exists
  if (document.getElementById("theme-toggle")) {
    // If the button exists, make sure it has the correct event listener
    const existingButton = document.getElementById("theme-toggle");

    // Remove any existing event listeners by cloning and replacing the element
    const newButton = existingButton.cloneNode(true);
    existingButton.parentNode.replaceChild(newButton, existingButton);

    // Add the correct event listener
    newButton.addEventListener("click", function () {
      const isDarkMode = document.body.classList.contains("dark-mode");
      toggleDarkMode(!isDarkMode);
    });

    // Update the icon
    const isDarkMode = document.body.classList.contains("dark-mode");
    updateThemeToggleIcon(newButton, isDarkMode);

    return;
  }

  const themeToggle = document.createElement("button");
  themeToggle.id = "theme-toggle";
  themeToggle.className = "theme-toggle";
  themeToggle.setAttribute("aria-label", "Toggle dark mode");

  // Set initial icon based on current theme
  const isDarkMode = document.body.classList.contains("dark-mode");
  updateThemeToggleIcon(themeToggle, isDarkMode);

  // Add event listener
  themeToggle.addEventListener("click", function () {
    const isDarkMode = document.body.classList.contains("dark-mode");
    toggleDarkMode(!isDarkMode);
  });

  document.body.appendChild(themeToggle);
}

/**
 * Toggle dark mode
 */
function toggleDarkMode(enableDark) {
  if (enableDark) {
    document.body.classList.add("dark-mode");
    document.documentElement.classList.add("dark");
    localStorage.setItem("theme", "dark");
  } else {
    document.body.classList.remove("dark-mode");
    document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", "light");
  }

  // Update all theme toggle buttons
  const themeToggles = document.querySelectorAll(
    ".theme-toggle, #theme-toggle"
  );
  themeToggles.forEach((toggle) => updateThemeToggleIcon(toggle, enableDark));

  // Update settings panel buttons if they exist
  const lightButton = document.getElementById("theme-light");
  const darkButton = document.getElementById("theme-dark");

  if (lightButton && darkButton) {
    if (enableDark) {
      darkButton.classList.add("bg-primary-green", "text-white");
      darkButton.classList.remove("bg-white", "text-gray-800");
      lightButton.classList.remove("bg-primary-green", "text-white");
      lightButton.classList.add("bg-white", "text-gray-800");
    } else {
      lightButton.classList.add("bg-primary-green", "text-white");
      lightButton.classList.remove("bg-white", "text-gray-800");
      darkButton.classList.remove("bg-primary-green", "text-white");
      darkButton.classList.add("bg-white", "text-gray-800");
    }
  }
}

/**
 * Update theme toggle button icon
 */
function updateThemeToggleIcon(toggleButton, isDarkMode) {
  if (!toggleButton) return;

  toggleButton.innerHTML = isDarkMode
    ? '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>'
    : '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>';
}

/**
 * Initialize theme preferences from localStorage
 */
function initializeTheme() {
  // Force light theme on landing, login, and register pages
  const currentPath = window.location.pathname;
  if (
    currentPath === "/" ||
    currentPath.includes("/login") ||
    currentPath.includes("/register")
  ) {
    document.body.classList.remove("dark-mode");
    document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", "light");
    return;
  }

  const storedTheme = localStorage.getItem("theme");
  if (storedTheme === "dark") {
    document.body.classList.add("dark-mode");
    document.documentElement.classList.add("dark");
  }

  // Load the stored health goals if available
  loadHealthGoals();
}

/**
 * Load health goals from localStorage
 */
function loadHealthGoals() {
  const storedGoals = localStorage.getItem("healthGoals");
  if (!storedGoals) return;

  try {
    const goals = JSON.parse(storedGoals);

    // If we're on dashboard, update charts
    if (window.updateChartsWithGoals) {
      window.updateChartsWithGoals(goals);
    } else {
      // Store goals in a global variable for later use
      window.healthGoals = goals;
    }

    // Update any goal displays on the page
    updateGoalDisplays(goals);
  } catch (e) {
    console.error("Error loading health goals:", e);
  }
}

/**
 * Update any goal displays on the page
 */
function updateGoalDisplays(goals) {
  // Update goal text displays if they exist
  const sleepGoalEl = document.getElementById("sleep-goal");
  const waterGoalEl = document.getElementById("water-goal");
  const stepsGoalEl = document.getElementById("steps-goal");
  const caloriesGoalEl = document.getElementById("calories-goal");

  if (sleepGoalEl && goals.sleep)
    sleepGoalEl.textContent = goals.sleep + " hours";
  if (waterGoalEl && goals.water)
    waterGoalEl.textContent = goals.water + " liters";
  if (stepsGoalEl && goals.steps) stepsGoalEl.textContent = goals.steps;
  if (caloriesGoalEl && goals.calories)
    caloriesGoalEl.textContent = goals.calories;
}

/**
 * Initialize flash messages with auto-close
 */
function initializeFlashMessages() {
  const flashMessages = document.querySelectorAll(".bg-red-100, .bg-green-100");

  flashMessages.forEach((message) => {
    // Add close button
    const closeButton = document.createElement("span");
    closeButton.innerHTML = "&times;";
    closeButton.classList.add(
      "absolute",
      "top-0",
      "right-0",
      "px-4",
      "py-3",
      "cursor-pointer"
    );
    closeButton.addEventListener("click", function () {
      message.remove();
    });
    message.appendChild(closeButton);

    // Auto-close after 5 seconds
    setTimeout(() => {
      message.style.opacity = "0";
      message.style.transition = "opacity 1s";

      setTimeout(() => {
        message.remove();
      }, 1000);
    }, 5000);
  });
}

/**
 * Initialize form validation
 */
function initializeFormValidation() {
  const forms = document.querySelectorAll("form");

  forms.forEach((form) => {
    form.addEventListener("submit", function (event) {
      const requiredInputs = form.querySelectorAll("[required]");
      let isValid = true;

      requiredInputs.forEach((input) => {
        if (!input.value.trim()) {
          isValid = false;
          input.classList.add("border-red-500");

          // Add error message if it doesn't exist
          const errorId = `${input.id}-error`;
          if (!document.getElementById(errorId)) {
            const errorMsg = document.createElement("p");
            errorMsg.id = errorId;
            errorMsg.classList.add("text-red-500", "text-xs", "mt-1");
            errorMsg.textContent = "This field is required";
            input.parentNode.appendChild(errorMsg);
          }
        } else {
          input.classList.remove("border-red-500");

          // Remove error message if it exists
          const errorMsg = document.getElementById(`${input.id}-error`);
          if (errorMsg) {
            errorMsg.remove();
          }
        }
      });

      if (!isValid) {
        event.preventDefault();
      }
    });

    // Real-time validation on input
    const inputs = form.querySelectorAll("input, textarea, select");
    inputs.forEach((input) => {
      input.addEventListener("blur", function () {
        if (this.hasAttribute("required") && !this.value.trim()) {
          this.classList.add("border-red-500");

          // Add error message if it doesn't exist
          const errorId = `${this.id}-error`;
          if (!document.getElementById(errorId)) {
            const errorMsg = document.createElement("p");
            errorMsg.id = errorId;
            errorMsg.classList.add("text-red-500", "text-xs", "mt-1");
            errorMsg.textContent = "This field is required";
            this.parentNode.appendChild(errorMsg);
          }
        } else {
          this.classList.remove("border-red-500");

          // Remove error message if it exists
          const errorMsg = document.getElementById(`${this.id}-error`);
          if (errorMsg) {
            errorMsg.remove();
          }
        }
      });
    });
  });
}

/**
 * Initialize responsive navigation
 */
function initializeResponsiveNavigation() {
  const navToggle = document.getElementById("nav-toggle");
  const navMenu = document.getElementById("nav-menu");

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", function () {
      navMenu.classList.toggle("hidden");
    });
  }

  // Settings panel toggle (if present)
  const settingsButton = document.getElementById("sidebar-settings");
  if (settingsButton) {
    settingsButton.addEventListener("click", function (e) {
      e.preventDefault();

      // Check if settings panel already exists
      let settingsPanel = document.getElementById("settings-panel");

      if (settingsPanel) {
        // Toggle visibility
        settingsPanel.classList.toggle("hidden");
      } else {
        // Create settings panel
        settingsPanel = document.createElement("div");
        settingsPanel.id = "settings-panel";
        settingsPanel.className =
          "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50";

        // Load stored goals if available
        const storedGoals = localStorage.getItem("healthGoals");
        let goals = {
          steps: 10000,
          sleep: 8,
          water: 2.5,
          calories: 2000,
        };

        if (storedGoals) {
          try {
            goals = { ...goals, ...JSON.parse(storedGoals) };
          } catch (e) {
            console.error("Error parsing stored goals:", e);
          }
        }

        const isDarkMode = document.body.classList.contains("dark-mode");

        // Panel content
        settingsPanel.innerHTML = `
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-xl font-bold text-gray-800 dark:text-white">Settings</h3>
              <button id="close-settings" class="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Theme</label>
                <div class="flex gap-2">
                  <button id="theme-light" class="px-4 py-2 border rounded-md ${
                    !isDarkMode
                      ? "bg-primary-green text-white"
                      : "bg-white text-gray-800 dark:bg-gray-600 dark:text-white"
                  }">Light</button>
                  <button id="theme-dark" class="px-4 py-2 border rounded-md ${
                    isDarkMode
                      ? "bg-primary-green text-white"
                      : "bg-white text-gray-800 dark:bg-gray-600 dark:text-white"
                  }">Dark</button>
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Daily Goals</label>
                <div class="space-y-2">
                  <div>
                    <label class="text-sm text-gray-600 dark:text-gray-400">Steps</label>
                    <input type="number" id="goal-steps" class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm dark:bg-gray-700 dark:text-white" value="${
                      goals.steps
                    }">
                  </div>
                  <div>
                    <label class="text-sm text-gray-600 dark:text-gray-400">Sleep (hours)</label>
                    <input type="number" id="goal-sleep" class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm dark:bg-gray-700 dark:text-white" value="${
                      goals.sleep
                    }">
                  </div>
                  <div>
                    <label class="text-sm text-gray-600 dark:text-gray-400">Water (liters)</label>
                    <input type="number" id="goal-water" class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm dark:bg-gray-700 dark:text-white" value="${
                      goals.water
                    }" step="0.1">
                  </div>
                  <div>
                    <label class="text-sm text-gray-600 dark:text-gray-400">Calories</label>
                    <input type="number" id="goal-calories" class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm dark:bg-gray-700 dark:text-white" value="${
                      goals.calories
                    }">
                  </div>
                </div>
              </div>
            </div>
            
            <div class="mt-6 flex justify-end gap-3">
              <button id="save-settings" class="bg-primary-green hover:bg-dark-green text-white px-4 py-2 rounded-md">Save Settings</button>
            </div>
          </div>
        `;

        document.body.appendChild(settingsPanel);

        // Close button handler
        document
          .getElementById("close-settings")
          .addEventListener("click", function () {
            settingsPanel.remove();
          });

        // Theme toggle handlers
        document
          .getElementById("theme-light")
          .addEventListener("click", function () {
            toggleDarkMode(false);
          });

        document
          .getElementById("theme-dark")
          .addEventListener("click", function () {
            toggleDarkMode(true);
          });

        // Save settings handler
        document
          .getElementById("save-settings")
          .addEventListener("click", function () {
            // Save goals to localStorage
            const goals = {
              steps: document.getElementById("goal-steps").value,
              sleep: document.getElementById("goal-sleep").value,
              water: document.getElementById("goal-water").value,
              calories: document.getElementById("goal-calories").value,
            };

            localStorage.setItem("healthGoals", JSON.stringify(goals));

            // Update any existing charts immediately
            if (window.updateChartsWithGoals) {
              window.updateChartsWithGoals(goals);
            } else {
              // Store for later use
              window.healthGoals = goals;
            }

            // Update goal displays
            updateGoalDisplays(goals);

            // Provide feedback
            const feedback = document.createElement("div");
            feedback.className =
              "mt-2 p-2 bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100 rounded-md text-center";
            feedback.textContent = "Settings saved!";
            document
              .querySelector("#settings-panel .mt-6")
              .appendChild(feedback);

            // Close after delay
            setTimeout(() => {
              settingsPanel.remove();

              // Reload the page to ensure charts are updated with new goals
              window.location.reload();
            }, 1500);
          });
      }
    });
  }
}

/**
 * Initialize smooth scrolling for anchor links
 */
function initializeSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");

      // Skip if it's not an anchor link or if it's an empty anchor
      if (targetId === "#" || targetId.length <= 1) return;

      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        e.preventDefault();

        // Calculate offset (accounting for fixed header if present)
        const headerHeight = document.querySelector("nav")
          ? document.querySelector("nav").offsetHeight
          : 0;
        const targetPosition =
          targetElement.getBoundingClientRect().top +
          window.pageYOffset -
          headerHeight -
          20;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    });
  });

  // Add active class to nav items when scrolling
  window.addEventListener("scroll", function () {
    const sections = document.querySelectorAll("section[id]");
    let scrollPosition = window.pageYOffset + 100;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute("id");

      if (
        scrollPosition >= sectionTop &&
        scrollPosition < sectionTop + sectionHeight
      ) {
        document.querySelectorAll("nav a").forEach((link) => {
          link.classList.remove("text-green-200");
          if (link.getAttribute("href") === "#" + sectionId) {
            link.classList.add("text-green-200");
          }
        });
      }
    });
  });
}

/**
 * Initialize tooltips
 */
function initializeTooltips() {
  const tooltipTriggers = document.querySelectorAll("[data-tooltip]");

  tooltipTriggers.forEach((trigger) => {
    // Create tooltip element
    const tooltip = document.createElement("div");
    tooltip.className =
      "absolute z-50 bg-gray-800 text-white px-2 py-1 rounded text-xs invisible opacity-0 transition-opacity pointer-events-none";
    tooltip.textContent = trigger.getAttribute("data-tooltip");

    // Position tooltip
    tooltip.style.bottom = "calc(100% + 5px)";
    tooltip.style.left = "50%";
    tooltip.style.transform = "translateX(-50%)";

    // Add tooltip to DOM
    trigger.classList.add("relative");
    trigger.appendChild(tooltip);

    // Show tooltip on hover
    trigger.addEventListener("mouseenter", () => {
      tooltip.classList.remove("invisible", "opacity-0");
      tooltip.classList.add("visible", "opacity-100");
    });

    // Hide tooltip when mouse leaves
    trigger.addEventListener("mouseleave", () => {
      tooltip.classList.remove("visible", "opacity-100");
      tooltip.classList.add("invisible", "opacity-0");
    });
  });
}
