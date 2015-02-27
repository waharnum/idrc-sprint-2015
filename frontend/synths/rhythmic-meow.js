(function () {
    "use strict";

    fluid.registerNamespace("oerSprint.synths");

    fluid.defaults("oerSprint.synths.rhythmicMeow", {
        gradeName: ["flock.synth", "autoInit"],

        synthDef: {
            ugen: "flock.ugen.triggerBuffers",
            bufferIndex: 0,
            speed: 1.0,
            trigger: {
                ugen: "flock.ugen.impulse",
                freq: {
                    ugen: "flock.ugen.in",
                    bus: 7
                }
            }
        }
    });

    fluid.defaults("oerSprint.synths.meowBand", {
        gradeName: ["flock.band", "autoInit"],

        components: {
            loader: {
                type: "flock.bufferLoader",
                options: {
                    bufferDefs: [
                        {
                            id: "cute-meow",
                            url: "../audio/cute-meow.wav"
                        },
                        {
                            id: "other-meow",
                            url: "../audio/other-meow.wav"
                        },
                        {
                            id: "cranky-meow",
                            url: "../audio/cranky-meow.wav"
                        }
                    ],

                    events: {
                        afterBuffersLoaded: "{meowBand}.events.afterBuffersLoaded"
                    }
                }
            },

            synth: {
                type: "oerSprint.synths.rhythmicMeow",
                createOnEvent: "afterBuffersLoaded"
                options: {
                    synthDef: {
                        options: {
                            bufferIDs: "@expand:oerSprint.synths.collectIDs({bufferLoader}.buffers)"
                        }
                    }
                }
            }
        },

        events: {
            afterBuffersLoaded: null
        }
    });

    oerSprint.synths.collectIDs = function (buffers) {
        return fluid.transform(buffers, function (buffer) {
            return buffer.id;
        });
    };

    fluid.defaults("oerSpring.synths.dataSynth", {
        gradeNames: ["flock.synth", "autoInit"],

        synthDef: {
            ugen: "flock.ugen.out",
            bus: 7,
            expand: 1,
            source: {
                ugen: "flock.ugen.playBuffer",
                loop: 1.0
                buffer: new Float32Array([100, 100, 120, 125, 130, 135, 140, 145, 150])
            }
        }
    });

}());
