## Command reference

Convert a video to webm:

```sh
ffmpeg -i input.mp4 -c:v libvpx-vp9 -crf 30 -b:v 0 -b:a 128k -c:a libopus output.webm
ffmpeg -i input.mov -c:v libvpx-vp9 -crf 30 -b:v 0 output.webm # without audio
```
