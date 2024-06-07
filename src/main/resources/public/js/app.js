import {Chat} from './chat.js';
import {PeerConnection} from "./peer-connection.js";

const peerConnection = new PeerConnection({
    onLocalMedia: stream => document.getElementById("localVideo").srcObject = stream,
    onRemoteMedia: stream => document.getElementById("remoteVideo").srcObject = stream,
    onChatMessage: message => chat.addRemoteMessage(message),
    onStateChange: state => {
        document.body.dataset.state = state;
        chat.updateUi(state);
    }
});

let chat = new Chat(peerConnection);

document.getElementById("startPairing").addEventListener("click", async () => {
    peerConnection.setState("CONNECTING");
    peerConnection.sdpExchange.send(JSON.stringify({name: "PAIRING_START"}))
});

document.getElementById("abortPairing").addEventListener("click", () => {
    peerConnection.sdpExchange.send(JSON.stringify({name: "PAIRING_ABORT"}))
    peerConnection.disconnect("LOCAL");
})

document.getElementById("leavePairing").addEventListener("click", () => {
    peerConnection.sendBye();
});
// Add event listener for toggleCamera button
// Add event listener for toggleCamera button
const localVideo = document.getElementById('localVideo');
const toggleCameraButton = document.getElementById('toggleCamera');

let stream;

// Function to start the camera
async function startCamera() {
    try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        localVideo.srcObject = stream;
    } catch (error) {
        console.error('Error accessing camera:', error);
    }
}

// Function to stop the camera
function stopCamera() {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        localVideo.srcObject = null;
    }
}

// Variable to track camera state
let cameraOn = false;

// Event listener for the toggle camera button
toggleCameraButton.addEventListener('click', () => {
    if (cameraOn) {
        stopCamera();
        toggleCameraButton.textContent = 'Turn Camera On';
    } else {
        startCamera();
        toggleCameraButton.textContent = 'Turn Camera Off';
    }
    cameraOn = !cameraOn;
});

// Start camera when the page loads (optional)
startCamera();
cameraOn = true;
toggleCameraButton.textContent = 'Turn Camera Off';



window.addEventListener("beforeunload", () => {
    if (peerConnection.state === "CONNECTED") {
        peerConnection.sendBye();
    }
});
