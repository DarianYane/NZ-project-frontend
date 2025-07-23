document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get('mode');

    if (mode === 'opinion_only') {
        const prizePromptContainer = document.getElementById('prize-prompt-container');
        if (prizePromptContainer) {
            const prizeButton = document.createElement('button');
            prizeButton.id = 'claimPrizeButton';
            prizeButton.className = 'btn fw-bold mb-3';
            prizeButton.textContent = 'I changed my mind, I want the prize!';
            prizeButton.onclick = function() {
                window.location.href = APP_CONFIG.pages.login;
            };
            prizePromptContainer.appendChild(prizeButton);
        }
    }

    const recordButton = document.getElementById('recordButton');
    const recordingControls = document.getElementById('recordingControls');
    const recordingIndicator = document.getElementById('recordingIndicator');
    const timerDisplay = document.getElementById('timer');
    const audioPlayback = document.getElementById('audioPlayback');
    const stopButton = document.getElementById('stopButton');
    const deleteButton = document.getElementById('deleteButton');
    const nextButton = document.getElementById('nextButton');
    const opinionText = document.getElementById('opinionText');

    let mediaRecorder;
    let audioChunks = [];
    let timerInterval;
    let seconds = 0;

    recordButton.addEventListener('click', async () => {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                mediaRecorder = new MediaRecorder(stream);

                mediaRecorder.ondataavailable = event => {
                    audioChunks.push(event.data);
                };

                mediaRecorder.onstop = () => {
                    const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                    const audioUrl = URL.createObjectURL(audioBlob);
                    audioPlayback.src = audioUrl;
                    audioPlayback.style.display = 'block';
                    deleteButton.style.display = 'inline-block';
                    stopButton.style.display = 'none';
                    recordButton.style.display = 'none';

                    // Save audio to localStorage
                    const reader = new FileReader();
                    reader.onload = () => {
                        localStorage.setItem('audio', reader.result);
                    };
                    reader.readAsDataURL(audioBlob);
                };

                audioChunks = [];
                mediaRecorder.start();
                startTimer();

                recordButton.style.display = 'none';
                recordingControls.style.display = 'block';
                stopButton.style.display = 'inline-block';
                deleteButton.style.display = 'none';

            } catch (err) {
                console.error('Error accessing microphone:', err);
                alert('Could not access microphone. Please ensure you have given permission.');
            }
        }
    });

    stopButton.addEventListener('click', () => {
        mediaRecorder.stop();
        stopTimer();
    });

    deleteButton.addEventListener('click', () => {
        resetRecording();
    });

    function startTimer() {
        seconds = 0;
        timerInterval = setInterval(() => {
            seconds++;
            const minutes = Math.floor(seconds / 60).toString().padStart(2, '0');
            const secs = (seconds % 60).toString().padStart(2, '0');
            timerDisplay.textContent = `${minutes}:${secs}`;
        }, 1000);
    }

    function stopTimer() {
        clearInterval(timerInterval);
    }

    function resetRecording() {
        stopTimer();
        audioChunks = [];
        audioPlayback.src = '';
        audioPlayback.style.display = 'none';
        deleteButton.style.display = 'none';
        stopButton.style.display = 'inline-block';
        recordButton.style.display = 'flex';
        recordingControls.style.display = 'none';
        localStorage.removeItem('audio');
    }

    nextButton.addEventListener('click', () => {
        const opinionValue = opinionText.value;
        localStorage.setItem('opinion', opinionValue);
        
        // The audio is already saved to localStorage when recording stops.
        // If no audio was recorded, this will just proceed.
        
        window.location.href = `${APP_CONFIG.pages.uploadTicket}?mode=${mode || ''}`;
    });
});