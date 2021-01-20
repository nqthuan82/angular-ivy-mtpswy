import { Component, Output, EventEmitter, OnInit } from "@angular/core";
declare var Stream: any;
@Component({
  selector: "my-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit {
  title = "video-stream";
  enableMute = true;
  paused = true;
  player = null;

  ngOnInit() {
    new Promise(async resolve => {
      console.log("load SDK ...");
      let script = document.createElement("script");
      script.src = "https://embed.videodelivery.net/embed/sdk.latest.js";
      script.type = "text/javascript";
      script.async = true;
      script.charset = "utf-8";
      script.onload = () => {
        resolve({ script: "SDK", loaded: true, status: "Loaded" });
      };
      document.getElementsByTagName("head")[0].appendChild(script);
    }).then(x => {
      try {
        console.log(x);
        this.player = Stream(document.getElementById("stream-player"));
        // Listen event from player
        window.addEventListener(
          "message",
          e => {
            if (!e.data || !e.data.eventName) return;
            console.log("PLAYER-EVENT", e.data);
            switch (e.data.eventName) {
              case "pause":
                this.paused = true;
                break;
              case "play":
                this.paused = false;
                break;
              case "muted":
                console.log("muted");
                break;
            }
          },
          false
        );
        console.log("SUCCEED", this.player);
      } catch {
        console.log("FAILED");
      }
    });
  }

  togglePaused() {
    if (this.paused) {
      this.player.play().catch(() => {
        console.log("playback  failed, muting to try again");
        this.player.muted = true;
        this.player.play("play");
      });
    } else {
      this.player.pause();
    }
    this.paused = !this.paused;
  }

  mute() {
    this.player.muted = !this.player.muted;
    this.enableMute = this.player.muted;
  }
}
