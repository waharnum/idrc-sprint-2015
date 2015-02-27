var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var button = document.querySelector('input');
var oer_sprint = {};

$.get("catt.json", function (catt) {
    oer_sprint.catt = catt;
});

// Stereo
var channels = 2;
var sampleRate = audioCtx.sampleRate;
// Create an empty two second stereo buffer at the
// sample rate of the AudioContext
var frameCount = audioCtx.sampleRate * 2.0;


oer_sprint.makeBuffer = function () {
    var myArrayBuffer = audioCtx.createBuffer(2, frameCount, audioCtx.sampleRate);
    var c = oer_sprint.catt;
    var elemsPerSample = frameCount / c.length;
    var phase = 0;
    var freq = 440;
    var delta = 2 * Math.PI / sampleRate;
    // Fill the buffer with white noise;
    // just random values between -1.0 and 1.0
    for (var channel = 0; channel < channels; channel++) {
       // This gives us the actual array that contains the data
       var nowBuffering = myArrayBuffer.getChannelData(channel);
       for (var i = 0; i < frameCount; i++) {
           var sample = c[Math.floor(i / elemsPerSample)];
           sample = channel === 0 ? sample : (500 - sample);
           freq = 6 * sample - 200;
           phase += freq * delta;
           // audio needs to be in [-1.0; 1.0]
           nowBuffering[i] = Math.sin(phase) * 1;
       }
    }
    return myArrayBuffer;
};

oer_sprint.playBuffer = function (buffer) {
    // Get an AudioBufferSourceNode.
    // This is the AudioNode to use when we want to play an AudioBuffer
    var source = audioCtx.createBufferSource();
    // set the buffer in the AudioBufferSourceNode
    source.buffer = buffer;
    // connect the AudioBufferSourceNode to the
    // destination so we can hear the sound
    source.connect(audioCtx.destination);
    // start the source playing
    source.start();
};

button.onclick = function () {
    var buffer = oer_sprint.makeBuffer();
    oer_sprint.playBuffer(buffer);
}