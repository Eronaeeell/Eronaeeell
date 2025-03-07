document.addEventListener("DOMContentLoaded", function () {
  // Get page elements
  const landingPage = document.getElementById("home-section");
  const walletPage = document.getElementById("wallet-section");
  const coursePage = document.getElementById("course-section");
  const coursesGridPage = document.getElementById("courses-grid-section");
  const earnPage = document.getElementById("earn-section");
  const smartContractCoursePage = document.getElementById(
    "smart-contract-course",
  );

  // Smart Contract DevOps course elements
  const startCourseBtn = document.getElementById("startCourseBtn");
  const goalPopup = document.getElementById("goalPopup");
  const stakingPopup = document.getElementById("stakingPopup");
  const closePopup = document.getElementById("closePopup");
  const closeStakingPopup = document.getElementById("closeStakingPopup");
  const decrementBtn = document.getElementById("decrementBtn");
  const incrementBtn = document.getElementById("incrementBtn");
  const counterInput = document.getElementById("counterInput");
  const confirmBtn = document.getElementById("confirmBtn");
  const stakeBtn = document.getElementById("stakeBtn");
  const stakingView = document.getElementById("stakingView");
  const successView = document.getElementById("successView");
  const startNowBtn = document.getElementById("startNowBtn");
  const stakingTitle = document.getElementById("stakingTitle");
  const claimButton = document.getElementById("claimStakeButton");
  const congratulationsOverlay = document.getElementById(
    "congratulationsOverlay",
  );
  
  const courseNames = [
    "Smart Contract Development",
    "Blockchain Fundamentals",
    "DeFi Principles",
    "Cryptocurrency Trading",
    "Web3 Development",
    "NFT Creation & Trading",
    "Crypto Security",
    "Tokenomics",
    "Blockchain Architecture",
  ];

  const pricingColumns = document.querySelectorAll(".pricing-column");
        const certificatesSection = document.querySelector(
          ".certificates-section",
        );
        const certificatesGrid = document.getElementById("certificatesGrid");
        const loadingIndicator = document.getElementById("loadingIndicator");
        const pdfCertificate = document.getElementById("pdfCertificate");
        const pdfCourseName = document.getElementById("pdfCourseName");
        const pdfDate = document.getElementById("pdfDate");
        const pdfId = document.getElementById("pdfId");

        let selectedCourseCount = 1;

        // Add click event listeners to pricing columns
        pricingColumns.forEach((column) => {
          column.addEventListener("click", function () {
            // Remove selected class from all columns
            pricingColumns.forEach((col) => col.classList.remove("selected"));

            // Add selected class to clicked column
            this.classList.add("selected");

            // Get number of courses from data attribute
            selectedCourseCount = parseInt(this.getAttribute("data-courses"));

            // Update certificates display
            updateCertificates(selectedCourseCount);

            // Scroll to certificates section
            certificatesSection.scrollIntoView({ behavior: "smooth" });
          });
        });

      // Function to create a certificate element
      function createCertificate(index) {
        const certificate = document.createElement("div");
        certificate.className = "certificate";
        certificate.setAttribute("data-index", index);

        const today = new Date();
        const formattedDate = `${today.getDate().toString().padStart(2, "0")}-${(today.getMonth() + 1).toString().padStart(2, "0")}-${today.getFullYear()}`;
        const certificateId = `CERT-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
        const courseName = courseNames[index % courseNames.length];

        certificate.innerHTML = `
          <h3 class="certificate-title">${courseName}</h3>
          <div class="certificate-logo">
            <span>Edu</span>Stake
          </div>
          <div class="certificate-footer">
            <span class="certificate-date">Issued: ${formattedDate}</span>
            <span class="certificate-id">${certificateId}</span>
          </div>
          <button class="download-button" aria-label="Download certificate" data-course="${courseName}" data-date="${formattedDate}" data-id="${certificateId}">
            <svg class="download-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
            </svg>
          </button>
        `;

        // Add event listener to download button
        const downloadButton = certificate.querySelector(".download-button");
        downloadButton.addEventListener("click", function (e) {
          e.stopPropagation();
          const courseName = this.getAttribute("data-course");
          const date = this.getAttribute("data-date");
          const id = this.getAttribute("data-id");
          generatePDF(courseName, date, id);
        });

        return certificate;
      }

      function updateCertificates(count) {
        // Clear existing certificates
        certificatesGrid.innerHTML = "";

        // Add new certificates
        for (let i = 0; i < count; i++) {
          const certificate = createCertificate(i);
          certificatesGrid.appendChild(certificate);

          // Stagger the animation for each certificate
          setTimeout(() => {
            certificate.classList.add("visible");
          }, i * 150);
        }

        // Make certificates section visible
        certificatesSection.classList.add("visible");
      }

      // Function to generate PDF certificate
      function generatePDF(courseName, date, id) {
        // Show loading indicator
        loadingIndicator.classList.add("visible");

        // Update PDF template with certificate details
        pdfCourseName.textContent = courseName;
        pdfDate.textContent = `Issued: ${date}`;
        pdfId.textContent = id;

        // Make PDF container visible for html2canvas
        pdfCertificate.style.display = "block";

        // Use jsPDF and html2canvas to create PDF
        const { jsPDF } = window.jspdf;

        // Wait a moment for the PDF container to be visible
        setTimeout(() => {
          const pdfContent = document.getElementById("pdfContent");

          html2canvas(pdfContent, {
            scale: 2,
            useCORS: true,
            logging: false,
          }).then((canvas) => {
            // Create PDF
            const pdf = new jsPDF("p", "pt", "a4");
            const imgData = canvas.toDataURL("image/jpeg", 1.0);
            const imgWidth = 595; // A4 width in points
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            pdf.addImage(imgData, "JPEG", 0, 0, imgWidth, imgHeight);

            // Download PDF
            pdf.save(`${courseName.replace(/\s+/g, "_")}_Certificate.pdf`);

            // Hide PDF container and loading indicator
            pdfCertificate.style.display = "none";
            loadingIndicator.classList.remove("visible");
          });
        }, 100);
      }
      
      // Check if element is in viewport
      function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
          rect.top >= 0 &&
          rect.left >= 0 &&
          rect.bottom <=
            (window.innerHeight || document.documentElement.clientHeight) &&
          rect.right <=
            (window.innerWidth || document.documentElement.clientWidth)
        );
      }

      // Handle scroll events to show certificates section
      window.addEventListener("scroll", function () {
        if (
          isInViewport(certificatesSection) &&
          !certificatesSection.classList.contains("visible")
        ) {
          certificatesSection.classList.add("visible");
          updateCertificates(selectedCourseCount);
        }
      });

        // Initialize with 1 certificate (default)
      updateCertificates(1);

  // Select ETH icons
  const ethIcons = document.querySelectorAll(".eth-icon");

  // Function to handle click and keyboard events
  function handleEthClaim(event) {
    event.stopPropagation(); // Prevent parent clicks
    const ethAmount = this.getAttribute("data-eth");

    // Directly call your existing function
    withdrawETHToUser(ethAmount);
  }

  // Attach event listeners to icons
  ethIcons.forEach((icon) => {
    icon.addEventListener("click", handleEthClaim);

    // Make the icon focusable & keyboard-accessible
    icon.setAttribute("tabindex", "0");

    // Allow "Enter" and "Space" to act like a button click
    icon.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        this.click();
      }
    });
  });

  if (claimButton) {
    claimButton.addEventListener("click", function () {
      console.log("Claim button clicked!");
      sendETHtoUser(); // Ensure this function exists
    });
  }

  // Initialize counter
  let count = 0;

  // Global function to show sections
  window.showSection = function (sectionId) {
    console.log("Attempting to show section:", sectionId);

    // Ensure section exists
    const targetSection = document.getElementById(sectionId);
    if (!targetSection) {
      console.error("Section not found:", sectionId);
      return;
    }

    // Hide all sections
    document
      .querySelectorAll(
        ".landing-container, .course-container, .wallet-container, .courses-grid-container, .earn-container",
      )
      .forEach((section) => {
        section.classList.add("hidden");
      });

    // Show the requested section
    targetSection.classList.remove("hidden");
    console.log("Section displayed:", sectionId, targetSection.classList);

    // Check if section is visible
    setTimeout(() => {
      const computedStyle = window.getComputedStyle(targetSection);
      console.log(
        "Earn section display:",
        computedStyle.display,
        computedStyle.visibility,
      );
    }, 100);

    // If it's the earn section, initialize the timeline
    if (sectionId === "earn-section") {
      initializeEarnTimeline();
    }

    // Scroll to top when switching views
    window.scrollTo(0, 0);

    // Update URL hash
    window.location.hash = sectionId;
  };

  // Function to show wallet page
  function showWalletPage() {
    showSection("wallet-section");
  }

  // Function to show landing page
  function showLandingPage() {
    showSection("home-section");
  }

  // Function to show course page
  function showCoursePage() {
    showSection("course-section");
  }

  // Function to show smart contract course page
  function showSmartContractCoursePage() {
    showSection("smart-contract-course");
  }

  // Function to handle "Go to Course" button
  function handleGoToCourse() {
    showSmartContractCoursePage();
  }

  // Add event listeners for navigation buttons on home page
  const getStartedBtn = document.querySelector(".cta-button.primary");
  if (getStartedBtn) {
    getStartedBtn.addEventListener("click", function () {
      showSection("wallet-section");
    });
  }

  const viewCourseBtn = document.querySelector(".cta-button.secondary");
  if (viewCourseBtn) {
    viewCourseBtn.addEventListener("click", function () {
      showSection("courses-grid-section");
    });
  }

  // Dev Purpose button - show congratulations overlay
  const devPurposeBtn = document.getElementById("devPurposeBtn");
  if (devPurposeBtn) {
    devPurposeBtn.addEventListener("click", function () {
      if (congratulationsOverlay) {
        congratulationsOverlay.classList.remove("hidden");
      }
    });
  }

  // Close modal when clicking the close button
  const closeOverlayBtn = document.querySelector(".close-overlay");
  if (closeOverlayBtn) {
    closeOverlayBtn.addEventListener("click", function () {
      if (congratulationsOverlay) {
        congratulationsOverlay.classList.add("hidden");
      }
    });
  }

  // Add event listeners for navigation links
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", function (e) {
      const sectionId = this.getAttribute("onclick").match(/'([^']+)'/)[1];
      // The onclick attribute already calls showSection, but we'll prevent default just in case
      e.preventDefault(sectionId);
    });
  });

  document.querySelectorAll(".footer-link").forEach((link) => {
    link.addEventListener("click", function (e) {
      // The onclick attribute already calls showSection, but we'll prevent default just in case
      e.preventDefault();
    });
  });

  // Add event listeners for course cards
  document.querySelectorAll(".course-button").forEach((button) => {
    button.addEventListener("click", function (e) {
      // If it's not an anchor tag, prevent default
      if (this.tagName !== "A") {
        e.preventDefault();
      }
      // The Smart Contract Dev course button has an onclick attribute that calls showSection
    });
  });

  // Add event listener for "Go to Course" button
  const goToCourseBtn = document.getElementById("go-to-course-btn");
  if (goToCourseBtn) {
    goToCourseBtn.addEventListener("click", handleGoToCourse);
  }

  // Add event listeners for back buttons
  document.querySelectorAll(".back-button").forEach((button) => {
    // The onclick attribute already calls showSection
  });

  // Goal setting popup functionality
  if (startCourseBtn) {
    startCourseBtn.addEventListener("click", function () {
      if (goalPopup) {
        goalPopup.classList.add("show");
        document.body.classList.add("blur-background");
        // Set focus to the first interactive element in the popup
        if (closePopup) closePopup.focus();
      }
    });
  }

  // Close popup
  if (closePopup) {
    closePopup.addEventListener("click", function () {
      goalPopup.classList.remove("show");
      document.body.classList.remove("blur-background");
      // Return focus to the button that opened the popup
      if (startCourseBtn) startCourseBtn.focus();
    });
  }

  // Increment counter
  if (incrementBtn) {
    incrementBtn.addEventListener("click", function () {
      count++;
      if (counterInput) counterInput.value = count;
    });
  }

  // Decrement counter (don't go below 0)
  if (decrementBtn) {
    decrementBtn.addEventListener("click", function () {
      if (count > 0) {
        count--;
        if (counterInput) counterInput.value = count;
      }
    });
  }

  // Handle direct input
  if (counterInput) {
    counterInput.addEventListener("input", function () {
      // Get the input value and convert to number
      let inputValue = parseInt(counterInput.value);

      // Validate input
      if (isNaN(inputValue) || inputValue < 0) {
        // Reset to 0 if invalid
        inputValue = 0;
      }

      // Update counter and input value
      count = inputValue;
      counterInput.value = count;
    });

    // Prevent non-numeric input
    counterInput.addEventListener("keydown", function (event) {
      // Allow: backspace, delete, tab, escape, enter, and numbers
      if (
        event.key === "Backspace" ||
        event.key === "Delete" ||
        event.key === "Tab" ||
        event.key === "Escape" ||
        event.key === "Enter" ||
        (event.key >= "0" && event.key <= "9")
      ) {
        // Allow the key
        return;
      }

      // Prevent the key press if not a number
      event.preventDefault();
    });
  }

  // Confirm button shows the staking popup
  if (confirmBtn) {
    confirmBtn.addEventListener("click", function () {
      // Update count from input value before confirming
      if (counterInput) count = parseInt(counterInput.value) || 0;

      // Hide goal popup
      if (goalPopup) goalPopup.classList.remove("show");

      // Reset staking title to initial state
      if (stakingTitle)
        stakingTitle.textContent = "Click below and stake 0.01 ETH";

      // Show staking popup
      if (stakingPopup) {
        stakingPopup.classList.add("show");
        if (closeStakingPopup) closeStakingPopup.focus();
      }

      // Reset staking view (in case user has gone through the flow before)
      if (stakingView) stakingView.style.display = "block";
      if (successView) successView.style.display = "none";

      // Log goal setting
      console.log(`Goal set: Complete course in ${count} days`);
    });
  }

  // Close staking popup
  if (closeStakingPopup) {
    closeStakingPopup.addEventListener("click", function () {
      if (stakingPopup) stakingPopup.classList.remove("show");
      document.body.classList.remove("blur-background");
      if (startCourseBtn) startCourseBtn.focus();
    });
  }

  // Stake button action
if (stakeBtn) {
  stakeBtn.addEventListener("click", async function () {
      console.log("User initiated staking of 0.01 ETH");

      // Call sendETH() and wait for it to complete
      await sendETH();
  });
}

  // Start Now button action
  if (startNowBtn) {
    startNowBtn.addEventListener("click", function () {
      console.log("User starting the course after successful staking");

      // Close the popup
      if (stakingPopup) stakingPopup.classList.remove("show");
      document.body.classList.remove("blur-background");

      // Here you would redirect to the course or show course content
      // For now, we'll just focus back on the start course button
      if (startCourseBtn) {
        startCourseBtn.focus();

        // Optional: You could add a visual indication that the course is now unlocked
        startCourseBtn.textContent = "Continue Course";
        startCourseBtn.classList.add("course-unlocked");
      }
    });
  }

  // Close popups when clicking outside
  window.addEventListener("click", function (event) {
    if (event.target === goalPopup) {
      goalPopup.classList.remove("show");
      document.body.classList.remove("blur-background");
      if (startCourseBtn) startCourseBtn.focus();
    }

    if (event.target === stakingPopup) {
      stakingPopup.classList.remove("show");
      document.body.classList.remove("blur-background");
      if (startCourseBtn) startCourseBtn.focus();
    }
  });

  // Handle keyboard accessibility
  if (goalPopup) {
    goalPopup.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        goalPopup.classList.remove("show");
        document.body.classList.remove("blur-background");
        if (startCourseBtn) startCourseBtn.focus();
      }
    });
  }

  if (stakingPopup) {
    stakingPopup.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        stakingPopup.classList.remove("show");
        document.body.classList.remove("blur-background");
        if (startCourseBtn) startCourseBtn.focus();
      }
    });
  }

  // Debug log to verify all elements are found
  console.log({
    landingPage: !!landingPage,
    walletPage: !!walletPage,
    coursePage: !!coursePage,
    coursesGridPage: !!coursesGridPage,
    earnPage: !!earnPage,
    smartContractCoursePage: !!smartContractCoursePage,
    startCourseBtn: !!startCourseBtn,
    goalPopup: !!goalPopup,
    stakingPopup: !!stakingPopup,
    closePopup: !!closePopup,
    closeStakingPopup: !!closeStakingPopup,
    decrementBtn: !!decrementBtn,
    incrementBtn: !!incrementBtn,
    counterInput: !!counterInput,
    confirmBtn: !!confirmBtn,
    stakeBtn: !!stakeBtn,
    stakingView: !!stakingView,
    successView: !!successView,
    startNowBtn: !!startNowBtn,
    stakingTitle: !!stakingTitle,
    congratulationsOverlay: !!congratulationsOverlay,
  });
});

// Course progress tracking
const courseData = {
  totalModules: 5,
  totalLessons: 24,
  completedLessons: 0,
  modules: [
    {
      id: 1,
      name: "Introduction to Smart Contracts",
      lessons: 4,
      completed: 0,
      unlocked: true,
    },
    {
      id: 2,
      name: "Solidity Programming",
      lessons: 5,
      completed: 0,
      unlocked: false,
    },
    {
      id: 3,
      name: "Testing Smart Contracts",
      lessons: 5,
      completed: 0,
      unlocked: false,
    },
    {
      id: 4,
      name: "Deployment Strategies",
      lessons: 5,
      completed: 0,
      unlocked: false,
    },
    {
      id: 5,
      name: "Security Best Practices",
      lessons: 5,
      completed: 0,
      unlocked: false,
    },
  ],
  currentModule: 1,
  currentLesson: "1.1",
};

// Update progress bar
function updateProgress() {
  const progressPercentage =
    (courseData.completedLessons / courseData.totalLessons) * 100;
  document.querySelector(".learningprogress-fill").style.width =
    `${progressPercentage}%`;
  document.querySelector(".learningprogress-text").textContent =
    `${Math.round(progressPercentage)}% Complete`;
}

// Check if module is complete
function checkModuleCompletion(moduleId) {
  const module = courseData.modules.find((m) => m.id === moduleId);
  if (module.completed === module.lessons) {
    // Module is complete, unlock next module if exists
    const nextModule = courseData.modules.find((m) => m.id === moduleId + 1);
    if (nextModule) {
      nextModule.unlocked = true;

      // Update UI to show next module as unlocked
      const nextModuleElement = document.querySelector(
        `.module-item[data-module="${moduleId + 1}"]`,
      );
      nextModuleElement.classList.remove("locked");
      nextModuleElement.querySelector(".module-status").textContent =
        "Available";

      // Show notification
      alert(
        `Congratulations! You've completed Module ${moduleId} and unlocked Module ${moduleId + 1}: ${nextModule.name}`,
      );
    } else {
      // Course complete
      alert("Congratulations! You've completed the entire course!");
    }
  }
}

// Module expansion toggle
const moduleButtons = document.querySelectorAll(".module-button");
moduleButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const moduleItem = button.closest(".module-item");
    const moduleId = parseInt(moduleItem.dataset.module);
    const module = courseData.modules.find((m) => m.id === moduleId);

    // Only toggle if module is unlocked
    if (module.unlocked) {
      const isExpanded = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", !isExpanded);
      const lessonList = button.nextElementSibling;
      if (lessonList && lessonList.classList.contains("lesson-list")) {
        lessonList.style.display = isExpanded ? "none" : "block";
      }
    } else {
      alert(
        `Module ${moduleId} is locked. Complete the previous module to unlock it.`,
      );
    }
  });
});

// Lesson click handler
const lessonLinks = document.querySelectorAll(".lesson-link");
lessonLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();

    const lessonItem = link.closest(".lesson-item");
    const moduleItem = link.closest(".module-item");
    const lessonId = lessonItem.dataset.lesson;
    const moduleId = parseInt(moduleItem.dataset.module);
    const module = courseData.modules.find((m) => m.id === moduleId);

    // Only allow navigation if module is unlocked
    if (module.unlocked) {
      // Update current lesson
      document
        .querySelector(".lesson-item.current")
        .classList.remove("current");
      lessonItem.classList.add("current");
      courseData.currentLesson = lessonId;

      // Update lesson content (in a real app, this would load content from a database)
      const lessonName = link.querySelector(".lesson-name").textContent;
      document.querySelector(".lesson-title").textContent = lessonName;

      // Reset lesson content based on lesson ID
      loadLessonContent(lessonId);

      // Reset next button state
      const nextLessonBtn = document.getElementById("nextLessonBtn");
      nextLessonBtn.disabled = true;
      nextLessonBtn.classList.remove("enabled");
    } else {
      alert(
        `Module ${moduleId} is locked. Complete the previous module to unlock it.`,
      );
    }
  });
});

// Load lesson content based on lesson ID
function loadLessonContent(lessonId) {
  // In a real application, this would fetch content from a server
  // For this demo, we'll use a simple switch statement
  let content = "";

  // Show or hide Dev Purpose button based on lesson
  const devPurposeBtn = document.getElementById("devPurposeBtn");
  if (lessonId === "2.3") {
    devPurposeBtn.style.display = "inline-block"; // Make button visible for testing
  } else {
    devPurposeBtn.style.display = "none";
  }

  switch (lessonId) {
    case "1.1":
      content = `
          <p class="lesson-text">
            Smart contracts are self-executing contracts with the terms of the agreement directly written into code. They run on blockchain networks, primarily Ethereum, and automatically execute when predetermined conditions are met.
          </p>

          <h3 class="section-title">Key Characteristics</h3>
          <ul class="lesson-list-items">
            <li>Immutable: Once deployed, they cannot be changed</li>
            <li>Transparent: All transactions are visible on the blockchain</li>
            <li>Trustless: No need for intermediaries</li>
            <li>Deterministic: Same input always produces the same output</li>
          </ul>

          <h3 class="section-title">Use Cases</h3>
          <p class="lesson-text">
            Smart contracts are used in various applications including:
          </p>
          <ul class="lesson-list-items">
            <li>Decentralized Finance (DeFi)</li>
            <li>Supply Chain Management</li>
            <li>Digital Identity Verification</li>
            <li>Voting Systems</li>
            <li>Tokenization of Assets</li>
          </ul>

          <div class="lesson-video">
            <div class="video-placeholder">
              <div class="play-button">
                <i class="ti ti-player-play"></i>
              </div>
              <span class="video-text">Introduction to Smart Contracts Video</span>
            </div>
          </div>

          <div class="lesson-quiz">
            <h3 class="quiz-title">Quick Check</h3>
            <div class="quiz-question">
              <p class="question-text">What is the primary blockchain platform for smart contracts?</p>
              <div class="quiz-options">
                <label class="quiz-option">
                  <input type="radio" name="question1" value="bitcoin">
                  <span class="option-text">Bitcoin</span>
                </label>
                <label class="quiz-option">
                  <input type="radio" name="question1" value="ethereum">
                  <span class="option-text">Ethereum</span>
                </label>
                <label class="quiz-option">
                  <input type="radio" name="question1" value="ripple">
                  <span class="option-text">Ripple</span>
                </label>
              </div>
            </div>
            <button class="quiz-submit">Check Answer</button>
          </div>
        `;
      break;

    case "1.2":
      content = `
          <p class="lesson-text">
            Ethereum is a decentralized blockchain platform that enables the creation and execution of smart contracts. Understanding Ethereum's core concepts is essential for smart contract development.
          </p>

          <h3 class="section-title">Key Concepts</h3>
          <ul class="lesson-list-items">
            <li>Blockchain: A distributed ledger that records all transactions</li>
            <li>Ethereum Virtual Machine (EVM): The runtime environment for smart contracts</li>
            <li>Gas: The computational cost of executing operations on the Ethereum network</li>
            <li>Accounts: External accounts (controlled by users) and contract accounts</li>
            <li>Transactions: Operations that change the state of the blockchain</li>
          </ul>

          <h3 class="section-title">Ethereum Network Types</h3>
          <p class="lesson-text">
            Ethereum has several networks for different purposes:
          </p>
          <ul class="lesson-list-items">
            <li>Mainnet: The primary Ethereum blockchain where real transactions occur</li>
            <li>Testnets (Ropsten, Rinkeby, Goerli, etc.): For testing without using real ETH</li>
            <li>Local networks: For development and testing on your machine</li>
          </ul>

          <div class="lesson-video">
            <div class="video-placeholder">
              <div class="play-button">
                <i class="ti ti-player-play"></i>
              </div>
              <span class="video-text">Ethereum Basics Video</span>
            </div>
          </div>

          <div class="lesson-quiz">
            <h3 class="quiz-title">Quick Check</h3>
            <div class="quiz-question">
              <p class="question-text">What is the runtime environment for Ethereum smart contracts?</p>
              <div class="quiz-options">
                <label class="quiz-option">
                  <input type="radio" name="question1" value="nodejs">
                  <span class="option-text">Node.js</span>
                </label>
                <label class="quiz-option">
                  <input type="radio" name="question1" value="evm">
                  <span class="option-text">Ethereum Virtual Machine (EVM)</span>
                </label>
                <label class="quiz-option">
                  <input type="radio" name="question1" value="docker">
                  <span class="option-text">Docker Container</span>
                </label>
              </div>
            </div>
            <button class="quiz-submit">Check Answer</button>
          </div>
        `;
      break;

    case "1.3":
      content = `
          <p class="lesson-text">
            Before you can start developing smart contracts, you need to set up your development environment. This lesson covers the essential tools and frameworks you'll need.
          </p>

          <h3 class="section-title">Development Tools</h3>
          <ul class="lesson-list-items">
            <li>Node.js and npm: For package management and running JavaScript tools</li>
            <li>Truffle or Hardhat: Development frameworks for Ethereum</li>
            <li>Ganache: Local Ethereum blockchain for development</li>
            <li>MetaMask: Browser extension for interacting with Ethereum</li>
            <li>Solidity: The primary programming language for Ethereum smart contracts</li>
            <li>Code editor: VSCode with Solidity extensions is recommended</li>
          </ul>

          <h3 class="section-title">Installation Steps</h3>
          <p class="lesson-text">
            Follow these steps to set up your environment:
          </p>
          <ol class="lesson-list-items">
            <li>Install Node.js and npm from the official website</li>
            <li>Install Truffle globally: <code>npm install -g truffle</code></li>
            <li>Install Ganache for your local blockchain</li>
            <li>Set up MetaMask in your browser</li>
            <li>Configure your code editor with Solidity plugins</li>
          </ol>

          <div class="lesson-video">
            <div class="video-placeholder">
              <div class="play-button">
                <i class="ti ti-player-play"></i>
              </div>
              <span class="video-text">Environment Setup Tutorial</span>
            </div>
          </div>

          <div class="lesson-quiz">
            <h3 class="quiz-title">Quick Check</h3>
            <div class="quiz-question">
              <p class="question-text">Which tool provides a local Ethereum blockchain for development?</p>
              <div class="quiz-options">
                <label class="quiz-option">
                  <input type="radio" name="question1" value="truffle">
                  <span class="option-text">Truffle</span>
                </label>
                <label class="quiz-option">
                  <input type="radio" name="question1" value="ganache">
                  <span class="option-text">Ganache</span>
                </label>
                <label class="quiz-option">
                  <input type="radio" name="question1" value="metamask">
                  <span class="option-text">MetaMask</span>
                </label>
              </div>
            </div>
            <button class="quiz-submit">Check Answer</button>
          </div>
        `;
      break;

    case "1.4":
      content = `
          <p class="lesson-text">
            This assessment will test your understanding of the key concepts covered in Module 1: Introduction to Smart Contracts.
          </p>

          <h3 class="section-title">Module 1 Assessment</h3>
          <div class="assessment-container">
            <div class="quiz-question">
              <p class="question-text">1. What makes smart contracts "trustless"?</p>
              <div class="quiz-options">
                <label class="quiz-option">
                  <input type="radio" name="q1" value="a">
                  <span class="option-text">They are written in a trusted programming language</span>
                </label>
                <label class="quiz-option">
                  <input type="radio" name="q1" value="b">
                  <span class="option-text">They eliminate the need for intermediaries through code-enforced agreements</span>
                </label>
                <label class="quiz-option">
                  <input type="radio" name="q1" value="c">
                  <span class="option-text">They are verified by trusted authorities</span>
                </label>
              </div>
            </div>

            <div class="quiz-question">
              <p class="question-text">2. Which of the following is NOT a characteristic of smart contracts?</p>
              <div class="quiz-options">
                <label class="quiz-option">
                  <input type="radio" name="q2" value="a">
                  <span class="option-text">Immutability</span>
                </label>
                <label class="quiz-option">
                  <input type="radio" name="q2" value="b">
                  <span class="option-text">Centralized control</span>
                </label>
                <label class="quiz-option">
                  <input type="radio" name="q2" value="c">
                  <span class="option-text">Transparency</span>
                </label>
              </div>
            </div>

            <div class="quiz-question">
              <p class="question-text">3. What is the primary programming language for Ethereum smart contracts?</p>
              <div class="quiz-options">
                <label class="quiz-option">
                  <input type="radio" name="q3" value="a">
                  <span class="option-text">JavaScript</span>
                </label>
                <label class="quiz-option">
                  <input type="radio" name="q3" value="b">
                  <span class="option-text">Python</span>
                </label>
                <label class="quiz-option">
                  <input type="radio" name="q3" value="c">
                  <span class="option-text">Solidity</span>
                </label>
              </div>
            </div>

            <div class="quiz-question">
              <p class="question-text">4. Which tool would you use to interact with Ethereum from your browser?</p>
              <div class="quiz-options">
                <label class="quiz-option">
                  <input type="radio" name="q4" value="a">
                  <span class="option-text">Ganache</span>
                </label>
                <label class="quiz-option">
                  <input type="radio" name="q4" value="b">
                  <span class="option-text">MetaMask</span>
                </label>
                <label class="quiz-option">
                  <input type="radio" name="q4" value="c">
                  <span class="option-text">Truffle</span>
                </label>
              </div>
            </div>

            <button class="assessment-submit" id="moduleAssessmentBtn">Submit Assessment</button>
          </div>
        `;
      break;

    case "2.1":
      content = `
          <p class="lesson-text">
            Solidity is the primary programming language for Ethereum smart contracts. This lesson covers the basic syntax and structure of Solidity contracts.
          </p>

          <h3 class="section-title">Solidity Basics</h3>
          <p class="lesson-text">
            A simple Solidity contract has the following structure:
          </p>
          <pre class="code-block">
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleStorage {
  uint256 private storedData;

  function set(uint256 x) public {
      storedData = x;
  }

  function get() public view returns (uint256) {
      return storedData;
  }
}
          </pre>

          <h3 class="section-title">Key Components</h3>
          <ul class="lesson-list-items">
            <li><strong>Pragma directive:</strong> Specifies the compiler version</li>
            <li><strong>Contract declaration:</strong> Similar to a class in object-oriented programming</li>
            <li><strong>State variables:</strong> Stored permanently in contract storage</li>
            <li><strong>Functions:</strong> Executable units of code</li>
            <li><strong>Visibility modifiers:</strong> public, private, internal, external</li>
            <li><strong>View/Pure functions:</strong> Don't modify state</li>
          </ul>

          <div class="lesson-quiz">
            <h3 class="quiz-title">Quick Check</h3>
            <div class="quiz-question">
              <p class="question-text">What does the "view" keyword indicate in a Solidity function?</p>
              <div class="quiz-options">
                <label class="quiz-option">
                  <input type="radio" name="question1" value="a">
                  <span class="option-text">The function can only be viewed by the contract owner</span>
                </label>
                <label class="quiz-option">
                  <input type="radio" name="question1" value="b">
                  <span class="option-text">The function doesn't modify state</span>
                </label>
                <label class="quiz-option">
                  <input type="radio" name="question1" value="c">
                  <span class="option-text">The function returns a value</span>
                </label>
              </div>
            </div>
            <button class="quiz-submit">Check Answer</button>
          </div>
        `;
      break;

    case "2.3":
      content = `
          <p class="lesson-text">
            Functions and modifiers are essential components of Solidity smart contracts. They define the behavior and access control of your contract.
          </p>

          <h3 class="section-title">Functions in Solidity</h3>
          <p class="lesson-text">
            Functions are the executable units of code in a smart contract. They can:
          </p>
          <ul class="lesson-list-items">
            <li>Modify the contract's state</li>
            <li>Return values to the caller</li>
            <li>Call other functions within the same contract or external contracts</li>
            <li>Emit events</li>
          </ul>

          <h3 class="section-title">Function Visibility</h3>
          <p class="lesson-text">
            Solidity provides four types of visibility for functions:
          </p>
          <ul class="lesson-list-items">
            <li><strong>public:</strong> Can be called internally and externally</li>
            <li><strong>private:</strong> Can only be called from within the current contract</li>
            <li><strong>internal:</strong> Can be called from the current contract and derived contracts</li>
            <li><strong>external:</strong> Can only be called from outside the contract</li>
          </ul>

          <h3 class="section-title">Function Modifiers</h3>
          <p class="lesson-text">
            Modifiers are reusable code that can change the behavior of functions:
          </p>
          <pre class="code-block">
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AccessControl {
  address public owner;

  constructor() {
      owner = msg.sender;
  }

  modifier onlyOwner() {
      require(msg.sender == owner, "Not the owner");
      _;  // The underscore represents where the function code is inserted
  }

  function changeOwner(address newOwner) public onlyOwner {
      owner = newOwner;
  }
}
          </pre>

          <p class="lesson-text">
            In the example above, the <code>onlyOwner</code> modifier ensures that only the contract owner can call the <code>changeOwner</code> function.
          </p>

          <div class="lesson-quiz">
            <h3 class="quiz-title">Quick Check</h3>
            <div class="quiz-question">
              <p class="question-text">What does the underscore (_) represent in a modifier?</p>
              <div class="quiz-options">
                <label class="quiz-option">
                  <input type="radio" name="question1" value="a">
                  <span class="option-text">It's a placeholder for the function name</span>
                </label>
                <label class="quiz-option">
                  <input type="radio" name="question1" value="b">
                  <span class="option-text">It's where the function code is inserted</span>
                </label>
                <label class="quiz-option">
                  <input type="radio" name="question1" value="c">
                  <span class="option-text">It's a special character that terminates the modifier</span>
                </label>
              </div>
            </div>
            <button class="quiz-submit">Check Answer</button>
          </div>
        `;
      break;

    // Add more lesson content cases as needed

    default:
      content = `
          <p class="lesson-text">
            This lesson content is being developed. Please check back later.
          </p>
        `;
  }

  document.querySelector(".lesson-body").innerHTML = content;

  // Reattach quiz event listener
  const quizSubmit = document.querySelector(".quiz-submit");
  if (quizSubmit) {
    quizSubmit.addEventListener("click", handleQuizSubmission);
  }

  // Attach module assessment event listener if present
  const moduleAssessmentBtn = document.getElementById("moduleAssessmentBtn");
  if (moduleAssessmentBtn) {
    moduleAssessmentBtn.addEventListener("click", handleModuleAssessment);
  }
}

// Handle quiz submission
function handleQuizSubmission() {
  const lessonId = document.querySelector(".lesson-item.current").dataset
    .lesson;
  let correctAnswer = "";

  // Determine correct answer based on lesson
  switch (lessonId) {
    case "1.1":
      correctAnswer = "ethereum";
      break;
    case "1.2":
      correctAnswer = "evm";
      break;
    case "1.3":
      correctAnswer = "ganache";
      break;
    case "2.1":
      correctAnswer = "b";
      break;
    // Add more cases as needed
    default:
      correctAnswer = "";
  }

  const selectedOption = document.querySelector(
    'input[name="question1"]:checked',
  );
  if (selectedOption && selectedOption.value === correctAnswer) {
    // Show success message
    const successMessage = document.createElement("div");
    successMessage.className = "quiz-success";
    successMessage.textContent =
      "Correct! You can now proceed to the next lesson.";

    // Replace submit button with success message
    this.parentNode.replaceChild(successMessage, this);

    // Enable next lesson button
    const nextLessonBtn = document.getElementById("nextLessonBtn");
    nextLessonBtn.disabled = false;
    nextLessonBtn.classList.add("enabled");

    // Add a visual indicator to the quiz section
    document.querySelector(".lesson-quiz").classList.add("completed");
  } else {
    alert("Incorrect. Try again!");
  }
}

// Handle module assessment submission
function handleModuleAssessment() {
  const moduleId = parseInt(
    document.querySelector(".module-item.current").dataset.module,
  );

  // Check if all questions are answered
  const questions = document.querySelectorAll(
    ".assessment-container .quiz-question",
  );
  let allAnswered = true;

  questions.forEach((question) => {
    const name = question.querySelector("input").name;
    if (!document.querySelector(`input[name="${name}"]:checked`)) {
      allAnswered = false;
    }
  });

  if (!allAnswered) {
    alert("Please answer all questions before submitting.");
    return;
  }

  // In a real app, you would validate the answers here
  // For this demo, we'll just mark the module as complete

  // Mark module as complete
  const module = courseData.modules.find((m) => m.id === moduleId);
  module.completed = module.lessons;

  // Update UI
  const moduleElement = document.querySelector(
    `.module-item[data-module="${moduleId}"]`,
  );
  moduleElement.classList.add("completed");
  moduleElement.querySelector(".module-status").textContent = "Completed";

  // Update course progress
  courseData.completedLessons +=
    module.lessons -
    courseData.modules.find((m) => m.id === moduleId).completed;
  updateProgress();

  // Check if next module should be unlocked
  checkModuleCompletion(moduleId);

  // Show success message
  const successMessage = document.createElement("div");
  successMessage.className = "assessment-success";
  successMessage.innerHTML = `
      <h3>Congratulations!</h3>
      <p>You have successfully completed Module ${moduleId}: ${module.name}</p>
      <button class="continue-btn" id="continueBtn">Continue to Next Module</button>
    `;

  // Replace assessment with success message
  document.querySelector(".assessment-container").innerHTML = "";
  document.querySelector(".assessment-container").appendChild(successMessage);

  // Add event listener to continue button
  document.getElementById("continueBtn").addEventListener("click", () => {
    // Navigate to first lesson of next module
    if (moduleId < courseData.totalModules) {
      const nextModuleElement = document.querySelector(
        `.module-item[data-module="${moduleId + 1}"]`,
      );
      const firstLessonElement =
        nextModuleElement.querySelector(".lesson-item");

      // Update current module and lesson
      document
        .querySelector(".module-item.current")
        .classList.remove("current");
      document
        .querySelector(".lesson-item.current")
        .classList.remove("current");

      nextModuleElement.classList.add("current");
      firstLessonElement.classList.add("current");

      // Expand next module
      nextModuleElement
        .querySelector(".module-button")
        .setAttribute("aria-expanded", "true");
      nextModuleElement.querySelector(".lesson-list").style.display = "block";

      // Update current module and lesson in data
      courseData.currentModule = moduleId + 1;
      courseData.currentLesson = firstLessonElement.dataset.lesson;

      // Load first lesson of next module
      const lessonName =
        firstLessonElement.querySelector(".lesson-name").textContent;
      document.querySelector(".lesson-title").textContent = lessonName;
      loadLessonContent(firstLessonElement.dataset.lesson);
    }
  });
}

// Next lesson navigation
const nextLessonBtn = document.getElementById("nextLessonBtn");
if (nextLessonBtn) {
  nextLessonBtn.addEventListener("click", function () {
    const currentLesson = document.querySelector(".lesson-item.current");
    if (currentLesson) {
      const nextLesson = currentLesson.nextElementSibling;
      if (nextLesson) {
        currentLesson.classList.remove("current");
        nextLesson.classList.add("current");
        courseData.currentLesson = nextLesson.dataset.lesson;
        nextLessonBtn.disabled = true;
        nextLessonBtn.classList.remove("enabled");
        console.log("Moved to next lesson: ", nextLesson.dataset.lesson);
      } else {
        checkModuleCompletion(
          parseInt(currentLesson.closest(".module-item").dataset.module),
        );
      }
    }
  });
}

// Mark complete functionality
const markCompleteBtn = document.getElementById("markCompleteBtn");
if (markCompleteBtn) {
  markCompleteBtn.addEventListener("click", function () {
    const currentLesson = document.querySelector(".lesson-item.current");
    if (currentLesson) {
      currentLesson.classList.add("completed");
      courseData.completedLessons += 1;
      updateProgress();
      nextLessonBtn.disabled = false;
      nextLessonBtn.classList.add("enabled");
      console.log("Lesson marked as complete.");
    }
  });
}

// Initialize quiz handlers
const quizSubmit = document.querySelector(".quiz-submit");
if (quizSubmit) {
  quizSubmit.addEventListener("click", handleQuizSubmission);
}

// Initialize Earn Timeline functionality
function initializeEarnTimeline() {
  console.log("Initializing earn timeline");
  const timelineItems = document.querySelectorAll(".timeline-item");
  const progressBar = document.getElementById("main-progress-bar");
  const courseItems = document.querySelectorAll(".course-item");
  const courseListSection = document.getElementById("courseListSection");

  // Initialize the first level as active
  if (timelineItems.length > 0) {
    timelineItems[0].classList.add("active");
    timelineItems[0].setAttribute("aria-pressed", "true");
  }

  // Initialize course list to show only level 1 courses
  updateCourseList(1);

  // Add click event listeners to each timeline item
  timelineItems.forEach((item) => {
    item.addEventListener("click", function () {
      const level = parseInt(this.getAttribute("data-level"));
      updateTimeline(level);
      updateCourseList(level);

      // Scroll to course list section
      setTimeout(() => {
        if (courseListSection) {
          courseListSection.scrollIntoView({ behavior: "smooth" });
        }
      }, 300);
    });

    // Add keyboard support for accessibility
    item.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        const level = parseInt(this.getAttribute("data-level"));
        updateTimeline(level);
        updateCourseList(level);

        // Scroll to course list section
        setTimeout(() => {
          if (courseListSection) {
            courseListSection.scrollIntoView({ behavior: "smooth" });
          }
        }, 300);
      }
    });
  });

  // Add click event listeners to ETH icons for reward popup
  const ethIcons = document.querySelectorAll(".eth-icon");
  ethIcons.forEach((icon) => {
    icon.addEventListener("click", function (e) {
      e.stopPropagation(); // Prevent triggering the timeline item click

      const ethAmount = this.getAttribute("data-eth");
      const parentItem = this.closest(".timeline-item");
      const level = parseInt(parentItem.getAttribute("data-level"));
      const courseText = parentItem.querySelector(".course-count").textContent;

      // Alert for now since we don't have the reward modal implemented
      alert(`You can claim ${ethAmount} ETH for completing ${courseText}.`);

      // For accessibility
      announceChange(
        `Reward popup opened. You can claim ${ethAmount} ETH for completing ${courseText}.`,
      );
    });

    // Make ETH icons focusable
    icon.setAttribute("tabindex", "0");

    // Add keyboard support for ETH icons
    icon.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        this.click(); // Trigger the click event
      }
    });
  });

  // Add click event listeners to view certificate buttons
  

  // Function to update the course list based on selected level
  function updateCourseList(level) {
    // Hide all course items first
    courseItems.forEach((item) => {
      item.classList.remove("visible");
    });

    // Show courses for the selected level and below
    courseItems.forEach((item) => {
      const courseLevel = parseInt(item.getAttribute("data-course-level"));
      if (courseLevel <= level) {
        item.classList.add("visible");
      }
    });

    // Update section title
    const sectionTitle = document.querySelector(".section-title");
    if (sectionTitle) {
      const levelCourseText = getLevelCourseText(level);
      sectionTitle.textContent = `Completed Courses (${levelCourseText})`;
    }

    // Announce for screen readers
    announceChange(
      `Showing ${getLevelCourseText(level)} that you have completed.`,
    );
  }

  // Function to update the timeline based on the selected level
  function updateTimeline(selectedLevel) {
    // Calculate progress percentage based on selected level
    if (progressBar && timelineItems.length > 1) {
      const progressPercentage =
        ((selectedLevel - 1) / (timelineItems.length - 1)) * 100;
      progressBar.style.width = `${progressPercentage}%`;
    }

    timelineItems.forEach((item) => {
      const itemLevel = parseInt(item.getAttribute("data-level"));

      // Reset all items
      item.classList.remove("active", "completed");
      item.setAttribute("aria-pressed", "false");

      // Mark items as completed or active based on the selected level
      if (itemLevel < selectedLevel) {
        item.classList.add("completed");
      } else if (itemLevel === selectedLevel) {
        item.classList.add("active");
        item.setAttribute("aria-pressed", "true");
      }
    });

    // Announce the level change for screen readers
    announceChange(
      `Level ${selectedLevel} selected. You've completed ${getLevelCourseText(
        selectedLevel,
      )}.`,
    );
  }

  // Helper function to get the course text for a level
  function getLevelCourseText(level) {
    const courseTexts = ["1 Course", "3 Courses", "6 Courses", "9 Courses"];
    return level > 0 && level <= courseTexts.length
      ? courseTexts[level - 1]
      : "Courses";
  }

  // Accessibility: Announce changes to screen readers
  function announceChange(message) {
    const announcer = document.createElement("div");
    announcer.setAttribute("aria-live", "polite");
    announcer.setAttribute("class", "sr-only");
    announcer.textContent = message;
    document.body.appendChild(announcer);

    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcer);
    }, 3000);
  }
}

// Initialize the page
document.addEventListener("DOMContentLoaded", function () {
  // Check if URL has a hash to determine which view to show initially
  if (window.location.hash === "#course") {
    showSection("course-section");
  } else if (window.location.hash === "#earn") {
    showSection("earn-section");
  } else if (window.location.hash === "#wallet") {
    showSection("wallet-section");
  } else if (window.location.hash === "#courses") {
    showSection("courses-grid-section");
  } else if (window.location.hash === "#smart-contract") {
    showSection("smart-contract-course");
  }
});
