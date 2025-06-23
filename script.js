document.addEventListener('DOMContentLoaded', () => {
  const recordButton = document.getElementById('recordButton');
  const transcriptArea = document.getElementById('transcript');
  const statusDiv = document.getElementById('status');
  const clearButton = document.getElementById('clearButton');
  const wordCountButton = document.getElementById('wordCountButton');
  const wordCountDisplay = document.getElementById('wordCountDisplay');

  let mediaRecorder;
  let socket;
  let finalTranscript = '';
  let isRecording = false;

  const DEEPGRAM_API_KEY = '29b8d67376d6a9af64d15cf2fbb0169c1f0a5493';
  const deepgramUrl = `wss://api.deepgram.com/v1/listen?punctuate=true`;

  async function startRecording() {
    try {
      statusDiv.textContent = 'Waiting for mic permission...';
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      statusDiv.textContent = 'Connecting to Deepgram...';

      socket = new WebSocket(deepgramUrl, ['token', DEEPGRAM_API_KEY]);

      socket.onopen = () => {
        statusDiv.textContent = 'Listening... Speak now!';
        recordButton.classList.add('recording');

        mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm;codecs=opus' });
        mediaRecorder.start(250);

        mediaRecorder.addEventListener('dataavailable', (e) => {
          if (e.data.size > 0 && socket.readyState === WebSocket.OPEN) {
            socket.send(e.data);
          }
        });

        isRecording = true;
        recordButton.textContent = 'Stop Listening';
        finalTranscript = '';
        transcriptArea.value = '';
        wordCountDisplay.textContent = '';
      };

      socket.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.channel && msg.channel.alternatives && msg.channel.alternatives.length > 0) {
          const transcript = msg.channel.alternatives[0].transcript;
          if (msg.is_final) {
            finalTranscript += transcript + ' ';
            transcriptArea.value = finalTranscript;
          } else {
            transcriptArea.value = finalTranscript + transcript;
          }
        }
      };

      socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        statusDiv.textContent = 'WebSocket error. Check console.';
      };

      socket.onclose = () => {
        statusDiv.textContent = 'Connection closed.';
        recordButton.classList.remove('recording');
        isRecording = false;
        recordButton.textContent = 'Start Listening';
        if (mediaRecorder && mediaRecorder.state !== 'inactive') {
          mediaRecorder.stop();
        }
      };

    } catch (error) {
      console.error('Error accessing mic:', error);
      statusDiv.textContent = 'Mic access denied or error.';
    }
  }

  function stopRecording() {
    if (socket) socket.close();
    if (mediaRecorder && mediaRecorder.state !== 'inactive') mediaRecorder.stop();
    statusDiv.textContent = 'Stopped.';
    recordButton.classList.remove('recording');
    isRecording = false;
    recordButton.textContent = 'Start Listening';
  }

  recordButton.addEventListener('click', () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  });

  clearButton.addEventListener('click', () => {
    finalTranscript = '';
    transcriptArea.value = '';
    wordCountDisplay.textContent = '';
    statusDiv.textContent = 'Cleared transcript.';
  });

  wordCountButton.addEventListener('click', () => {
    const text = transcriptArea.value.trim();
    if (!text) {
      wordCountDisplay.textContent = 'No words to count.';
      return;
    }
    const wordCount = text.split(/\s+/).filter(Boolean).length;
    wordCountDisplay.textContent = `Word Count: ${wordCount}`;
  });
});
