import StreamTeam from '../src/streamteam.js';

let stream = new StreamTeam({
    url: "http://video-zoo.watson-proto.blue/2012prez.mp3",
    chunkSize: 10
});

stream.grabNewBuffer(true)
    .then(res => stream.startBuffer())