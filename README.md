# streamteam

Node module for streaming audio buffers and extracting frequency data.

To get started, just `npm install --save git+ssh://git@github.ibm.com/watson-prototypes/streamteam.git`

and make a new streaming object:

```
let stream = new StreamTeam({
  url: audioUrl,
  chunkSize: 30 // size of chunks to stream in (in seconds)
})
```

`chunkSize` was created in order to have control of request time of the chunk. Best practice is to make `chunkSize` as large as possible without sacrificing load time. If an audio file is small enough, you can make chunksize the length of the entire file (eliminating any streaming logic).


To change starting point of stream (in seconds):

`stream.setStartTime(200);`

To play:

`stream.play();`

To pause:

`stream.pause();`

Get Current Time:

`stream.getCurrentTime();`

Get Frequency Array:

`stream.getFrequencies();`

Toggle Mute:

`stream.muteOrUnmute();`
