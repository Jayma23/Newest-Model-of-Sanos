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
document.getElementById("toggleCamera").addEventListener("click", () => {
    const localVideo = document.getElementById("localVideo");
    const stream = localVideo.srcObject;
    const videoTrack = stream.getVideoTracks()[0];

    if (videoTrack.enabled) {
        videoTrack.enabled = false;
        document.getElementById("toggleCamera").innerText = "Turn on Camera";
    } else {
        videoTrack.enabled = true;
        document.getElementById("toggleCamera").innerText = "Turn off Camera";
    }
});

window.addEventListener("beforeunload", () => {
    if (peerConnection.state === "CONNECTED") {
        peerConnection.sendBye();
    }
});
