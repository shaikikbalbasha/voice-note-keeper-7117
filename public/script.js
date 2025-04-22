const startBtn = document.getElementById("start");
const saveBtn = document.getElementById("save");
const noteField = document.getElementById("note");
const notesList = document.getElementById("notesList");

// SpeechRecognition setup
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.continuous = true;  // Keep listening for continuous speech
recognition.interimResults = true;  // Show interim results (while still listening)
recognition.lang = 'en-US';

let isRecognizing = false;  // Initial state, recognition is not running
let finalTranscript = '';   // Variable to store the final transcript

// Event listener for start/stop button
startBtn.addEventListener("click", () => {
  if (!isRecognizing) {
    finalTranscript = ''; // Clear previous transcript
    recognition.start();  // Start listening
    isRecognizing = true;  // Set to true when recognizing
    startBtn.textContent = "🛑 Stop Listening";  // Change button text
  } else {
    recognition.stop();  // Stop listening
    isRecognizing = false;  // Set to false when stopped
    startBtn.textContent = "🎙️ Start Listening";  // Reset button text
  }
});

// Handle the result from speech recognition
recognition.onresult = (event) => {
  let interimTranscript = '';  // Variable to store interim results
  for (let i = event.resultIndex; i < event.results.length; i++) {
    const transcript = event.results[i][0].transcript;
    if (event.results[i].isFinal) {
      finalTranscript += transcript + ' ';  // Add final result to the final transcript
    } else {
      interimTranscript += transcript;  // Add interim result
    }
  }
  noteField.value = finalTranscript + interimTranscript;  // Display transcript in the text area
};

// Restart recognition if it stops (e.g., after a pause)
recognition.onend = () => {
  console.log("Speech recognition ended");  // Log when recognition ends
  if (isRecognizing) {
    recognition.start();  // Auto-restart if still recognizing
  } else {
    startBtn.textContent = "🎙️ Start Listening";  // Reset button text when stopped
  }
};

// Event listener for saving the note
saveBtn.addEventListener("click", async () => {
  const note = noteField.value.trim();  // Get the note from the text area
  if (note === "") return alert("Please speak something first.");  // Prevent saving if empty

  try {
    // Updated fetch URL with your actual IP address
    await fetch("http://10.2.18.245:3000/add-note", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ note }),  // Send the note as JSON
    });
    noteField.value = "";  // Clear the text area after saving
    finalTranscript = "";  // Clear the final transcript
    loadNotes();  // Reload the notes from the server
  } catch (err) {
    console.error("Failed to save note:", err);  // Log any errors
    alert("Could not save the note. Is your server running?");
  }
});

// Function to load notes from the server
async function loadNotes() {
  try {
    // Updated fetch URL with your actual IP address
    const res = await fetch("http://10.2.18.245:3000/notes");
    const notes = await res.json();
    notesList.innerHTML = "";  // Clear existing notes
    notes.forEach((n) => {
      const li = document.createElement("li");
      li.textContent = `${n.note} (${new Date(n.created_at).toLocaleString()})`;  // Format note with timestamp
      notesList.appendChild(li);
    });
  } catch (err) {
    console.error("Failed to fetch notes:", err);  // Log any errors
    alert("Could not load notes. Is your server running?");
  }
}

// Load notes when the page loads
window.onload = loadNotes;
