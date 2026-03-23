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

const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach((item) => {
  const button = item.querySelector(".faq-question");
  const answer = item.querySelector(".faq-answer");

  button.addEventListener("click", () => {
    const isOpen = item.classList.contains("active");

    faqItems.forEach((otherItem) => {
      const otherButton = otherItem.querySelector(".faq-question");
      const otherAnswer = otherItem.querySelector(".faq-answer");

      otherItem.classList.remove("active");
      otherButton.setAttribute("aria-expanded", "false");
      otherAnswer.style.maxHeight = null;
    });

    if (!isOpen) {
      item.classList.add("active");
      button.setAttribute("aria-expanded", "true");
      answer.style.maxHeight = answer.scrollHeight + "px";
    }
  });
});

const contactForm = document.getElementById("contactForm");
const messageInput = document.getElementById("message");
const messageCount = document.getElementById("messageCount");
const formStatus = document.getElementById("formStatus");
const formSubmitButton = document.getElementById("formSubmitButton");

const CONTACT_ENDPOINT = "";

function setFieldState(field, errorElement, message = "") {
  if (!field || !errorElement) return;

  field.classList.remove("input-invalid", "input-valid");

  if (message) {
    field.classList.add("input-invalid");
    errorElement.textContent = message;
  } else if (field.value.trim()) {
    field.classList.add("input-valid");
    errorElement.textContent = "";
  } else {
    errorElement.textContent = "";
  }
}

if (messageInput && messageCount) {
  const updateCount = () => {
    messageCount.textContent = `${messageInput.value.length} / 1000`;
  };

  updateCount();
  messageInput.addEventListener("input", updateCount);
}

if (contactForm) {
  const nameField = document.getElementById("name");
  const emailField = document.getElementById("email");
  const messageField = document.getElementById("message");
  const websiteField = document.getElementById("website");

  const nameError = document.getElementById("nameError");
  const emailError = document.getElementById("emailError");
  const messageError = document.getElementById("messageError");

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateForm = () => {
    let isValid = true;

    const name = nameField.value.trim();
    const email = emailField.value.trim();
    const message = messageField.value.trim();

    if (!name) {
      setFieldState(nameField, nameError, "Please enter your name.");
      isValid = false;
    } else {
      setFieldState(nameField, nameError, "");
    }

    if (!email) {
      setFieldState(emailField, emailError, "Please enter your email.");
      isValid = false;
    } else if (!emailPattern.test(email)) {
      setFieldState(emailField, emailError, "Please enter a valid email address.");
      isValid = false;
    } else {
      setFieldState(emailField, emailError, "");
    }

    if (!message) {
      setFieldState(messageField, messageError, "Please enter your message.");
      isValid = false;
    } else if (message.length > 1000) {
      setFieldState(messageField, messageError, "Your message is too long.");
      isValid = false;
    } else {
      setFieldState(messageField, messageError, "");
    }

    return isValid;
  };

  [nameField, emailField, messageField].forEach((field) => {
    field?.addEventListener("blur", validateForm);
    field?.addEventListener("input", () => {
      if (field === nameField) setFieldState(nameField, nameError, "");
      if (field === emailField) setFieldState(emailField, emailError, "");
      if (field === messageField) setFieldState(messageField, messageError, "");
    });
  });

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    formStatus.textContent = "";
    formStatus.className = "form-status";

    if (websiteField?.value.trim()) {
      formStatus.textContent = "Invalid submission.";
      formStatus.classList.add("error");
      return;
    }

    if (!validateForm()) {
      formStatus.textContent = "Please correct the highlighted fields.";
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
      if (formSubmitButton) {
        formSubmitButton.disabled = true;
        formSubmitButton.textContent = "Sending...";
      }

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

      [nameField, emailField, messageField].forEach((field) => {
        field.classList.remove("input-invalid", "input-valid");
      });

      [nameError, emailError, messageError].forEach((errorField) => {
        if (errorField) errorField.textContent = "";
      });

      if (messageCount) {
        messageCount.textContent = "0 / 1000";
      }

      formStatus.textContent = "Message sent successfully.";
      formStatus.classList.add("success");
    } catch (error) {
      formStatus.textContent =
        "Something went wrong. Please try again later.";
      formStatus.classList.add("error");
    } finally {
      if (formSubmitButton) {
        formSubmitButton.disabled = false;
        formSubmitButton.textContent = "Envoyer le message";
      }
    }
  });
}