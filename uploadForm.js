// Wait for the DOM content to be fully loaded
document.addEventListener('DOMContentLoaded', function () {
    // Parse URL parameters to determine the operating mode
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get('mode');

    // If the mode is 'opinion_only', hide the discount-related fields
    if (mode === 'opinion_only') {
        const ticketImageUploadGroup = document.getElementById('ticketImageUploadGroup');
        if (ticketImageUploadGroup) {
            ticketImageUploadGroup.style.display = 'none';
        }

        // Hide the ticket number field and make it not required
        const ticketNumberInput = document.getElementById('ticketNumber');
        if (ticketNumberInput) {
            const ticketNumberGroup = ticketNumberInput.closest('.mb-3');
            if (ticketNumberGroup) {
                ticketNumberGroup.style.display = 'none';
            }
            ticketNumberInput.required = false;
        }

        // Create and add the "I want the prize" button
        const prizePromptContainer = document.getElementById('prize-prompt-container');
        if (prizePromptContainer) {
            const prizeButton = document.createElement('button');
            prizeButton.id = 'claimPrizeButton';
            prizeButton.className = 'btn fw-bold mb-3';
            prizeButton.textContent = 'I changed my mind, I want the prize!';
            prizeButton.onclick = function() {
                // Redirect to the full form by removing the 'mode' parameter
                const newUrl = window.location.pathname;
                window.location.href = newUrl;
            };
            prizePromptContainer.appendChild(prizeButton);
        }
    }

    // Set the current date and time in the hidden field
    const now = new Date();
    const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);
    const timestampInput = document.getElementById('timestamp');
    if (timestampInput) {
        timestampInput.value = localDateTime;
    }
});

// Get the user's geolocation
function getCurrentLocation() {
    return new Promise((resolve) => {
        if (!navigator.geolocation) {
            // Resolve with default location if geolocation is not supported
            resolve({ lat: -38.0055, lng: -57.5426, accuracy: null, note: 'Geolocation not supported' });
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    accuracy: position.coords.accuracy
                });
            },
            () => {
                // Resolve with default location in case of an error
                resolve({ lat: -38.0055, lng: -57.5426, accuracy: null, note: 'Default location' });
            },
            { timeout: 10000, enableHighAccuracy: true }
        );
    });
}

// Check the status of the backend server
async function checkServerStatus() {
    const resultDiv = document.getElementById('resultDiv');
    resultDiv.className = 'alert alert-info';
    resultDiv.textContent = 'Checking server status...';

    try {
        const response = await fetch('http://localhost:8000/health');
        if (response.ok) {
            const data = await response.json();
            resultDiv.className = 'alert alert-success';
            resultDiv.textContent = `✅ Server is running correctly\nStatus: ${data.status}`;
        } else {
            throw new Error(`HTTP ${response.status}`);
        }
    } catch (error) {
        resultDiv.className = 'alert alert-danger';
        resultDiv.textContent = `❌ Error connecting to the server: ${error.message}`;
    }
}

// Fill the form with test data
function fillTestData() {
    document.getElementById('customer_name').value = 'John Doe';
    document.getElementById('customer_email').value = 'john.doe@example.com';
    document.getElementById('ticketNumber').value = 'TICKET-12345';
    document.getElementById('opinionText').value = 'Excellent service!';
}

// Show information about the selected audio file
function showFileInfo() {
    const fileInput = document.getElementById('audioFile');
    const fileInfo = document.getElementById('audioFileInfo');
    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        fileInfo.style.display = 'block';
        fileInfo.innerHTML = `Name: ${file.name}, Size: ${(file.size / 1024 / 1024).toFixed(2)} MB`;
    } else {
        fileInfo.style.display = 'none';
    }
}

// Show information and a preview of the selected image
function showImageInfo() {
    const imageInput = document.getElementById('ticketImage');
    const imageInfo = document.getElementById('ticketImageInfo');
    const imagePreview = document.getElementById('ticketImagePreview');
    if (imageInput.files.length > 0) {
        const file = imageInput.files[0];
        imageInfo.style.display = 'block';
        imageInfo.innerHTML = `Name: ${file.name}, Size: ${(file.size / 1024 / 1024).toFixed(2)} MB`;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            imagePreview.src = e.target.result;
            imagePreview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    } else {
        imageInfo.style.display = 'none';
        imagePreview.style.display = 'none';
    }
}

// Upload files and metadata to the server
async function uploadFiles(audioFile, ticketImage, metadata) {
    const formData = new FormData();
    formData.append('audio', audioFile);
    if (ticketImage) {
        formData.append('ticket_image', ticketImage);
    }

    // Append metadata to the FormData
    for (const key in metadata) {
        if (key === 'geolocation') {
            formData.append(key, JSON.stringify(metadata[key]));
        } else {
            formData.append(key, metadata[key]);
        }
    }

    const response = await fetch('http://localhost:8000/api/upload-audio', {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Server error: ${response.status}`);
    }
    return response.json();
}

// Handle the form submission
document.getElementById('opinionForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitButton = document.getElementById('submitButton');
    const resultDiv = document.getElementById('resultDiv');
    submitButton.disabled = true;
    submitButton.textContent = 'Submitting...';
    resultDiv.className = 'alert alert-info';
    resultDiv.textContent = 'Processing...';

    try {
        const audioFile = document.getElementById('audioFile').files[0];
        if (!audioFile) throw new Error('Audio file is required.');

        const ticketImage = document.getElementById('ticketImage').files[0];
        const geolocation = await getCurrentLocation();

        const metadata = {
            customer_name: document.getElementById('customer_name').value,
            customer_email: document.getElementById('customer_email').value,
            business_name: document.getElementById('business_name').value,
            ticket_number: document.getElementById('ticketNumber').value,
            timestamp: document.getElementById('timestamp').value,
            opinion_text: document.getElementById('opinionText').value,
            geolocation: geolocation,
        };

        const result = await uploadFiles(audioFile, ticketImage, metadata);
        resultDiv.className = 'alert alert-success';
        resultDiv.innerHTML = `✅ Opinion submitted successfully!<br><pre>${JSON.stringify(result, null, 2)}</pre>`;
    } catch (error) {
        resultDiv.className = 'alert alert-danger';
        resultDiv.textContent = `❌ Error: ${error.message}`;
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'Submit Opinion';
    }
});
