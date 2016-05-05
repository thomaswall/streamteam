export default class StreamTeam {
    constructor(userArgs) {
        let defaultArgs = {
            fftSize: 512,
            chunkSize: 30,
            bitRate: 16000
        }

        this.args = {
            ...defaultArgs,
            ...userArgs
        }

        if(!window.context) window.context = new (window.AudioContext || window.webkitAudioContext)();
        this.gainNode = window.context.createGain();
        this.frequencyArray = [];
        this.sourceJs;
        this.analyser;
        this.sources = [];
        this.buffers = [];
        this.bufferIndex = 0;
        this.startTime = 0;
        this.lastTime = 0;
        this.currentTime = 0;
        this.grabbing = false;
        this.paused = false;
    }

    startBuffer = () => {
        this.sourceJs = window.context.createScriptProcessor(2048, 1, 1);
        this.sourceJs.buffer = this.buffers[0];
        this.sourceJs.connect(window.context.destination);
        this.analyser = window.context.createAnalyser();
        this.analyser.fftSize = 512;
        this.analyser.connect(this.sourceJs);

        let source = window.context.createBufferSource();
        source.buffer = this.buffers[0];
        source.connect(this.analyser);
        source.connect(window.context.destination);
        source.start(0, (this.currentTime - this.startTime)%this.args.chunkSize);
        source.connect(this.gainNode);

        this.sources[0] = source;
        this.gainNode.connect(window.context.destination);

        if(this.sources.length > 1) {
            let source = window.context.createBufferSource();
            source.buffer = this.buffers[1];
            source.connect(window.context.destination);
            this.sources[1] = source;
        }

        this.sourceJs.onaudioprocess = () => this.audioProcess();
    }

    connectNewBuffer = () => {
        this.buffers.shift();
        this.sources.shift();
        this.sources[0].start()

        this.sourceJs = window.context.createScriptProcessor(2048, 1, 1);
        this.sourceJs.buffer = this.buffers[0];
        this.sourceJs.connect(window.context.destination);
        this.analyser = window.context.createAnalyser();
        this.analyser.fftSize = this.args.fftSize;
        this.analyser.connect(this.sourceJs);
        
        this.sources[0].connect(this.analyser);
        this.sources[0].connect(window.context.destination);

        this.sources[0].connect(this.gainNode);
        this.gainNode.connect(window.context.destination);

        this.sourceJs.onaudioprocess = () => this.audioProcess();
    }

    audioProcess = () => {
        this.frequencyArray = new Uint8Array(this.analyser.frequencyBinCount);
        this.analyser.getByteFrequencyData(this.frequencyArray);

        if((this.currentTime - this.startTime)%this.args.chunkSize > this.args.chunkSize/2 + 0.5 && !this.grabbing) {
            this.grabbing = true;
            this.grabNewBuffer(false);
        }

        if((this.currentTime - this.startTime)%this.args.chunkSize < 0.5 && this.grabbing) {
            this.grabbing = false;
            this.connectNewBuffer();
        }
        if(Math.abs(window.context.currentTime - this.lastTime) > 0.5 && !this.paused) {
            this.currentTime = this.currentTime + window.context.currentTime - this.lastTime;
            this.lastTime = window.context.currentTime;
        }
    }

    stopBuffer = () => {
        this.sourceJs = {};
        if(this.sources[0]) this.sources[0].stop();
    }

    grabNewBuffer = (first) => {
        return new Promise((resolve, reject) => {
            let request = new XMLHttpRequest();
            request.open('GET', this.args.url, true);
            request.setRequestHeader('Range', `bytes=${parseInt(this.args.bitRate*(this.startTime + this.bufferIndex * this.args.chunkSize))}-${parseInt(this.args.bitRate*(this.startTime + (this.bufferIndex + 1) * this.args.chunkSize))}`);
            request.responseType = "arraybuffer";
            if(first) {
                this.buffers = [];
                this.sources = [];
            }
            request.onload = () => {
                window.context.decodeAudioData(
                    request.response,
                    (buffer) => {
                        this.buffers.push(buffer);

                        if(!first) {
                            let source = window.context.createBufferSource();
                            source.buffer = buffer;
                            source.connect(window.context.destination);
                            this.sources.push(source);
                        }
                        resolve(true);
                    },
                    function(error) {
                        console.log(error)
                        reject(true);
                    }
                );
            };

            request.send()
            this.bufferIndex += 1
        });
    }
}