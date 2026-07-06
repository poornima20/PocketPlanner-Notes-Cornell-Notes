/* =========================
   CORNELL NOTES STORAGE
========================= */

const STORAGE_KEY = "fullmoon.pocketplanner.cornellnotes";

let notes = [];
let currentIndex = 0;

/* =========================
   ELEMENTS
========================= */

const fields = {
  subject: document.getElementById("subject"),

  topic: document.getElementById("topic"),

  keypoints: document.getElementById("keypoints"),

  notes: document.getElementById("notes"),

  summary: document.getElementById("summary"),
};

const indicator = document.getElementById("page-indicator");

/* =========================
   EMPTY NOTE
========================= */

function emptyNote() {
  return {
    subject: "",
    topic: "",
    keypoints: "",
    notes: "",
    summary: "",
  };
}

/* =========================
   LOAD STORAGE
========================= */

function loadStorage() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));

    notes = stored?.data || [];
  } catch {
    notes = [];
  }

  if (notes.length === 0) {
    notes.push(emptyNote());
  }
}

/* =========================
   SAVE STORAGE
========================= */

function saveStorage() {
  localStorage.setItem(
    STORAGE_KEY,

    JSON.stringify({
      data: notes,

      updatedAt: Date.now(),
    }),
  );

  // dashboard firestore sync

  window.parent.postMessage(
    {
      type: "POCKET_PLANNER_UPDATED",

      key: STORAGE_KEY,

      updatedAt: Date.now(),
    },

    "*",
  );
}

/* =========================
   LOAD NOTE
========================= */

function loadNote(index) {
  const note = notes[index];

  Object.keys(fields).forEach((key) => {
    fields[key].value = note[key] || "";
  });

  indicator.textContent = `Note ${index + 1}`;
}

/* =========================
   SAVE CURRENT NOTE
========================= */

function saveCurrent() {
  Object.keys(fields).forEach((key) => {
    notes[currentIndex][key] = fields[key].value;
  });

  saveStorage();
}

/* =========================
   INPUT SAVE
========================= */

Object.values(fields).forEach((el) => {
  el.addEventListener("input", saveCurrent);
});

/* =========================
   NEXT NOTE
========================= */

document.getElementById("next").onclick = () => {
  saveCurrent();

  if (currentIndex === notes.length - 1) {
    notes.push(emptyNote());
  }

  currentIndex++;

  loadNote(currentIndex);
};

/* =========================
   PREVIOUS NOTE
========================= */

document.getElementById("prev").onclick = () => {
  if (currentIndex === 0) return;

  saveCurrent();

  currentIndex--;

  loadNote(currentIndex);
};

/* =========================
   INIT
========================= */

loadStorage();

loadNote(currentIndex);
