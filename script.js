const menuToggle = document.getElementById("menuToggle");
const siteNav = document.getElementById("siteNav");
const siteHeader = document.querySelector(".site-header");
const revealElements = document.querySelectorAll(".reveal");

/* mobile menu */
if (menuToggle && siteNav) {
  menuToggle.addEventListener("click", () => {
    siteNav.classList.toggle("active");

    const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isExpanded));
  });
}

/* header effect on scroll */
function handleHeaderScroll() {
  if (!siteHeader) return;

  if (window.scrollY > 20) {
    siteHeader.classList.add("scrolled");
  } else {
    siteHeader.classList.remove("scrolled");
  }
}

window.addEventListener("scroll", handleHeaderScroll);
window.addEventListener("load", handleHeaderScroll);

/* fade-in on scroll */
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }
    });
  },
  {
    threshold: 0.15,
  }
);

revealElements.forEach((element) => {
  observer.observe(element);
});

const contactForm = document.getElementById("contactForm");
const messageInput = document.getElementById("message");
const messageCount = document.getElementById("messageCount");
const formStatus = document.getElementById("formStatus");

/*
  IMPORTANT:
  Replace this with your real backend / form endpoint later.
  Example:
  const CONTACT_ENDPOINT = "https://your-endpoint-here";
*/
const CONTACT_ENDPOINT = "";

if (messageInput && messageCount) {
  const updateCount = () => {
    messageCount.textContent = `${messageInput.value.length} / 1000`;
  };

  updateCount();
  messageInput.addEventListener("input", updateCount);
}

if (contactForm) {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.getElementById("name")?.value.trim() || "";
    const email = document.getElementById("email")?.value.trim() || "";
    const message = document.getElementById("message")?.value.trim() || "";
    const website = document.getElementById("website")?.value.trim() || "";

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    formStatus.textContent = "";
    formStatus.className = "form-status";

    if (website) {
      formStatus.textContent = "Invalid submission.";
      formStatus.classList.add("error");
      return;
    }

    if (!name || !email || !message) {
      formStatus.textContent = "Please fill in all required fields.";
      formStatus.classList.add("error");
      return;
    }

    if (!emailPattern.test(email)) {
      formStatus.textContent = "Please enter a valid email address.";
      formStatus.classList.add("error");
      return;
    }

    if (message.length > 1000) {
      formStatus.textContent = "Your message is too long.";
      formStatus.classList.add("error");
      return;
    }

    if (!CONTACT_ENDPOINT) {
      formStatus.textContent =
        "Form is ready, but the delivery endpoint is not connected yet.";
      formStatus.classList.add("error");
      return;
    }

    try {
      const formData = new FormData(contactForm);

      const response = await fetch(CONTACT_ENDPOINT, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Submission failed.");
      }

      contactForm.reset();
      if (messageCount) {
        messageCount.textContent = "0 / 1000";
      }

      formStatus.textContent = "Message sent successfully.";
      formStatus.classList.add("success");
    } catch (error) {
      formStatus.textContent =
        "Something went wrong. Please try again later.";
      formStatus.classList.add("error");
    }
  });
}