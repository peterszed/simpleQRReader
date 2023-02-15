# Simle QR Reader 
QR Reader custom component with stencil JS

# Usage

Import the following scripts:

```html
	
<script src="./js/adapter.js"></script> 
<script src="./js/zxing_packed.js"></script>


<script type="module" src="./js/qr-reader.esm.js"></script>
<script nomodule src="./js/qr-reader.js"></script>
```

Then define the qr-reader component with attributes: 

* reload-time in ms
* after-scan="stop-scan", if you want to stop the scanner after scanning a qr code
* if you don't define the after-scan attribute, the scanner will reload after your specified time.



Then import app.js, which should handle the custom event from the QR reader:

```html
<qr-reader reload-time="5000" after-scan="stopScan"></qr-reader>
<script src="./js/app.js"></script>
```


Example usage is in **example_site** folder.
