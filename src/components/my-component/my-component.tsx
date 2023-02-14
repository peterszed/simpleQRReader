//import { Component, Prop, h } from '@stencil/core';
import { Component, Element, Prop,  h, Event, EventEmitter} from '@stencil/core';
//import { format } from '../../utils/utils';

@Component({
  tag: 'qr-reader',
  styleUrl: 'my-component.css',
  shadow: true,
})
export class QRReader {
    QRcode: any;
    video: any;
    canvasElement: any;
    canvas: any;
    scanning: boolean;
    constraints: object;
    window: any;
    @Element() el: HTMLElement;
    @Prop({ mutable: true }) reloadTime: any;
    @Prop() afterScan: string;
    @Event() qrScanned: EventEmitter<string>;
  connectedCallback() {
        this.scanning = false;
        this.constraints = { facingMode: { exact: "environment" }};
        this.reloadTime = parseInt(this.reloadTime);
  }

  componentDidRender(){
        this.QRcode = window.qrcode;
        this.video = document.createElement("video");
        this.canvasElement = this.el.shadowRoot.getElementById("qr-canvas"); // has to be qr-canvas
        this.canvas = this.canvasElement.getContext("2d");
        this.startScan();
        this.QRcode.callback = async (res) => {
            if (res) {
                //console.log(res)
                this.qrScanned.emit(res);
                //outputData.innerText = res;
                this.scanning = false;

                this.video.srcObject.getTracks().forEach(track => {
                        track.stop();
                        });
                if (this.afterScan === "stopScan"){
                    this.video.srcObject.getTracks().forEach(track => {
                        track.stop();
                    }); 
                    this.canvasElement.hidden = true;
                }
                else
                    setTimeout(this.startScan.bind(this), this.reloadTime);
            }

  };
  }
  
  render() {
    return (
            <div class="row">
                <canvas id="qr-canvas" style={{height:'auto', width:'100%', borderStyle:'solid'}}></canvas>
            </div>
    );
  }

  drawStreamFrame() {
      /*console.log('draw')
      console.log(this.canvasElement)*/
      this.canvasElement.height = this.video.videoHeight;
      this.canvasElement.width = this.video.videoWidth;
      this.canvas.drawImage(this.video, 0, 0, this.canvasElement.width, this.canvasElement.height);

      this.scanning && requestAnimationFrame(this.drawStreamFrame.bind(this));
  }

  qrDecode() {
      try {
          this.QRcode.decode();
      } catch (e) {
          //console.log(e);
          setTimeout(this.qrDecode.bind(this), 300);
      }
  }


  startScan(){
      navigator.mediaDevices
          .getUserMedia({ video: this.constraints })
          .then((stream) => {
                  this.scanning = true;
                  this.canvasElement.hidden = false;
                  this.video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
                  this.video.srcObject = stream;
                  this.video.play();
                  this.drawStreamFrame();
                  let boundQrDecode = this.qrDecode.bind(this);
                  boundQrDecode();
                  })
      .catch( () => {
              this.constraints = { facingMode:  "environment" };
              this.startScan();
              });
  }
}

declare global {
  interface Window {
    qrcode: any; 
  }
}
