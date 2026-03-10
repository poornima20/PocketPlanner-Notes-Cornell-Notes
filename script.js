const STORAGE_KEY = "fullmoon.pocketplanner.cornellnotes";

let notes = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
let currentIndex = 0;

const fields = {
  subject: document.getElementById("subject"),
  topic: document.getElementById("topic"),
  keypoints: document.getElementById("keypoints"),
  notes: document.getElementById("notes"),
  summary: document.getElementById("summary")
};

const indicator = document.getElementById("page-indicator");

function emptyNote() {
  return {
    subject: "",
    topic: "",
    keypoints: "",
    notes: "",
    summary: ""
  };
}

if (notes.length === 0) {
  notes.push(emptyNote());
}

function loadNote(index) {
  const note = notes[index];
  Object.keys(fields).forEach(k => fields[k].value = note[k]);
  indicator.textContent = `Note ${index + 1}`;
}

function saveCurrent() {
  Object.keys(fields).forEach(k => {
    notes[currentIndex][k] = fields[k].value;
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

Object.values(fields).forEach(el => {
  el.addEventListener("input", saveCurrent);
});

document.getElementById("next").onclick = () => {
  saveCurrent();
  if (currentIndex === notes.length - 1) {
    notes.push(emptyNote());
  }
  currentIndex++;
  loadNote(currentIndex);
};

document.getElementById("prev").onclick = () => {
  if (currentIndex === 0) return;
  saveCurrent();
  currentIndex--;
  loadNote(currentIndex);
};

loadNote(currentIndex);
