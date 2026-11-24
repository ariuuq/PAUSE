const $ = (selector) => document.querySelector(selector);

const menuToggle = $("#menuToggle");
const mainNav = $("#mainNav");
menuToggle.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});
mainNav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
  mainNav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
}));

// Emotional check-in
const moodMessages = {
  Calm: "Let yourself enjoy this moment. You don't have to rush it.",
  Happy: "Make room for this feeling. You deserve good moments, too.",
  Anxious: "You don't have to solve everything at once. Start with one small thing.",
  Tired: "Rest is a valid need, not something you have to earn.",
  Frustrated: "Your feelings can be real without defining your whole day.",
  "Not sure": "It's okay not to have a name for everything you're feeling."
};
$("#moodGrid").addEventListener("click", (event) => {
  const button = event.target.closest(".mood-card");
  if (!button) return;
  document.querySelectorAll(".mood-card").forEach(card => card.classList.remove("selected"));
  button.classList.add("selected");
  const mood = button.dataset.mood;
  $("#moodFeedback").textContent = moodMessages[mood];
  localStorage.setItem("pauseMood", mood);
});

// Breathing exercise: short guided cycle, no forced breath holds.
let breathingTimer = null;
let breathingRunning = false;
const breathOrb = $("#breathOrb");
const breathText = $("#breathText");
const breathButton = $("#breathButton");
function stopBreathing() {
  clearTimeout(breathingTimer);
  breathingRunning = false;
  breathOrb.className = "breath-orb";
  breathText.textContent = "Ready?";
  breathButton.innerHTML = "Start breathing <span>↗</span>";
}
function runBreathingStep(step) {
  if (!breathingRunning) return;
  if (step === 0) {
    breathText.textContent = "Breathe in";
    breathOrb.className = "breath-orb inhale";
    breathingTimer = setTimeout(() => runBreathingStep(1), 4000);
  } else {
    breathText.textContent = "Breathe out";
    breathOrb.className = "breath-orb exhale";
    breathingTimer = setTimeout(() => runBreathingStep(0), 5000);
  }
}
breathButton.addEventListener("click", () => {
  if (breathingRunning) {
    stopBreathing();
    return;
  }
  breathingRunning = true;
  breathButton.textContent = "Stop exercise";
  runBreathingStep(0);
});

// Grounding prompt
const groundingPrompts = [
  "Look around slowly. Name 5 things you can see.",
  "Notice 4 things you can physically feel.",
  "Listen for 3 sounds around you.",
  "Notice 2 things you can smell, or two scents you remember.",
  "Notice 1 thing you can taste, or take a sip of water if you have some."
];
let groundingIndex = -1;
$("#groundButton").addEventListener("click", () => {
  groundingIndex = (groundingIndex + 1) % groundingPrompts.length;
  const button = $("#groundButton");
  button.innerHTML = groundingPrompts[groundingIndex] + " →";
  if (groundingIndex === groundingPrompts.length - 1) {
    setTimeout(() => {
      button.innerHTML = "Start grounding <span>↗</span>";
      groundingIndex = -1;
    }, 3500);
  }
});

// Journal stored only in this browser/device for this demo.
const journalEntry = $("#journalEntry");
const savedEntry = $("#savedEntry");
const previousEntry = localStorage.getItem("pauseJournal");
if (previousEntry) {
  savedEntry.textContent = "Last saved note: " + previousEntry;
}
$("#saveEntry").addEventListener("click", () => {
  const value = journalEntry.value.trim();
  if (!value) {
    showToast("Write a few words before saving.");
    journalEntry.focus();
    return;
  }
  localStorage.setItem("pauseJournal", value);
  savedEntry.textContent = "Last saved note: " + value;
  $("#saveStatus").textContent = "Saved on this device.";
  showToast("Your note has been saved on this device.");
});

// Demo nickname modal — not real authentication.
const loginModal = $("#loginModal");
function openModal() {
  loginModal.classList.add("open");
  loginModal.setAttribute("aria-hidden", "false");
  $("#nickname").focus();
}
function closeModal() {
  loginModal.classList.remove("open");
  loginModal.setAttribute("aria-hidden", "true");
}
$("#openLogin").addEventListener("click", openModal);
$("#closeLogin").addEventListener("click", closeModal);
loginModal.addEventListener("click", (event) => {
  if (event.target === loginModal) closeModal();
});
$("#saveNickname").addEventListener("click", () => {
  const nickname = $("#nickname").value.trim();
  if (!nickname) {
    showToast("Add a nickname to continue.");
    return;
  }
  localStorage.setItem("pauseNickname", nickname);
  closeModal();
  showToast("Welcome to your space, " + nickname + ".");
});
const savedNickname = localStorage.getItem("pauseNickname");
if (savedNickname) {
  $("#openLogin").textContent = "Hi, " + savedNickname + " ↗";
}

// Small accessible toast message
let toastTimeout;
function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove("show"), 2600);
}
