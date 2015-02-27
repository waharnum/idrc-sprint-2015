var audioCtx = new (window.AudioContext || window.webkitAudioContext)();

var oer_sprint = {};

//$.get("catt.json", function (catt) {
//    oer_sprint.catt = catt;
//});

// Stereo
var channels = 2;
var sampleRate = audioCtx.sampleRate;
oer_sprint.duration = 2;

oer_sprint.catteToBuffer = function (c, myArrayBuffer) {
    var elemsPerSample = oer_sprint.frameCount / c.length;
    var phase = 0;
    var freq = 440;
    var delta = 2 * Math.PI / sampleRate;
    // Fill the buffer with white noise;
    // just random values between -1.0 and 1.0
    for (var channel = 0; channel < channels; channel++) {
       // This gives us the actual array that contains the data
       var nowBuffering = myArrayBuffer.getChannelData(channel);
       for (var i = 0; i < oer_sprint.frameCount; i++) {
           var sample = c[Math.floor(i / elemsPerSample)];
           freq = 10 * sample - 700;
           phase += freq * delta;
           // audio needs to be in [-1.0; 1.0]
           nowBuffering[i] += Math.sin(phase) * 1;
       }
    }  
}


oer_sprint.makeBuffer = function () {
    oer_sprint.frameCount = audioCtx.sampleRate * oer_sprint.duration;    
    var myArrayBuffer = audioCtx.createBuffer(2, oer_sprint.frameCount, audioCtx.sampleRate);
    for (var i = 0; i < oer_sprint.cattes.length; ++ i) {
        var catte = oer_sprint.cattes[i].bpArray;
        if (oer_sprint.selection[i]) {
            oer_sprint.catteToBuffer(catte, myArrayBuffer);
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

oer_sprint.isSelected = function (id) {
    var elem = fluid.jById(id);
    return elem.prop("checked");
}

oer_sprint.getSelected = function () {
    return fluid.transform(["box-1", "box-2", "box-3"], function (id) {
        return oer_sprint.isSelected(id);
    });
};

var button = document.querySelector("#Play");

button.onclick = function () {
    oer_sprint.selection = oer_sprint.getSelected();
    oer_sprint.duration = +$("#Duration").val();
    var buffer = oer_sprint.makeBuffer();
    oer_sprint.playBuffer(buffer);
};