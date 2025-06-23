# Speech Recognition Vibes

A simple real-time speech-to-text web app using the Deepgram API. Speak into your mic, and your words show up live on screen.

##  How to Run

1. **Clone the repo:**
   ```bash
   git clone https://github.com/TenetiSrujana/Speech-to-Text
   cd Speech-to-Text
   
2. **Add your Deepgram API key:**
Open script.js and replace this line with your actual key: const DEEPGRAM_API_KEY = 'your-api-key-here';

3. **Open the app:**
Just open index.html in any modern browser. No server needed.

4. **Project Structure:**
Speech-to-Text
├── index.html      ( main web page )
├── style.css       ( Styles for the page )
├── script.js       ( Logic for speech recognition using Deepgram )
└── README.md       ( This file )

5. **Image Preview:** <img width="1470" alt="Screenshot 2025-06-23 at 8 58 40 AM" src="https://github.com/user-attachments/assets/7e7d2b8c-16a8-452c-9cf3-a5782b61caf8" />

**Notes:** 
. This project uses Deepgram's WebSocket API for real-time transcription.
. Mic access is required for speech-to-text to work.
. Works best in Google Chrome.

---
