const startBtn = document.getElementById("start");
const saveBtn = document.getElementById("save");
const noteField = document.getElementById("note");
const notesList = document.getElementById("notesList");

const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.continuous = true;
recognition.interimResults = true;
recognition.lang = 'en-US';

let isRecognizing = false;
let finalTranscript = '';

startBtn.addEventListener("click", () => {
  if (!isRecognizing) {
    finalTranscript = ''; // Clear previous transcript
    recognition.start();
    isRecognizing = true;
    startBtn.textContent = "🛑 Stop Listening";
  } else {
    recognition.stop();
    isRecognizing = false;
    startBtn.textContent = "🎙️ Start Listening";
  }
});

recognition.onresult = (event) => {
  let interimTranscript = '';
  for (let i = event.resultIndex; i < event.results.length; i++) {
    const transcript = event.results[i][0].transcript;
    if (event.results[i].isFinal) {
      finalTranscript += transcript + ' ';
    } else {
      interimTranscript += transcript;
    }
  }
  noteField.value = finalTranscript + interimTranscript;
};

// If it stops naturally (like from a pause), restart it automatically
recognition.onend = () => {
  if (isRecognizing) {
    recognition.start(); // Auto-restart to avoid missed speech
  } else {
    startBtn.textContent = "🎙️ Start Listening";
  }
};

saveBtn.addEventListener("click", async () => {
  const note = noteField.value.trim();
  if (note === "") return alert("Please speak something first.");
  try {
    await fetch("http://localhost:3000/add-note", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ note }),
    });
    noteField.value = "";
    finalTranscript = "";
    loadNotes();
  } catch (err) {
    console.error("Failed to save note:", err);
    alert("Could not save the note. Is your server running?");
  }
});

async function loadNotes() {
  try {
    const res = await fetch("http://localhost:3000/notes");
    const notes = await res.json();
    notesList.innerHTML = "";
    notes.forEach((n) => {
      const li = document.createElement("li");
      li.textContent = `${n.note} (${new Date(n.created_at).toLocaleString()})`;
      notesList.appendChild(li);
    });
  } catch (err) {
    console.error("Failed to fetch notes:", err);
    alert("Could not load notes. Is your server running?");
  }
}

window.onload = loadNotes;
