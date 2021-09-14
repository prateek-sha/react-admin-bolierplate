function canvasDataURL(path, obj, callback, resolve, fileName) {
	var img = new Image();
	img.src = path;
	img.onload = function () {
		var that = this;
		// Compress proportionally by default
		var w = that.width,
			h = that.height,
			scale = w / h;
		w = obj.width || w;
		h = obj.height || (w / scale);
		var quality = 0.7;  // The default image quality is 0.7
		//Generate canvas
		var canvas = document.createElement('canvas');
		var ctx = canvas.getContext('2d');
		// Create attribute node
		var anw = document.createAttribute("width");
		anw.nodeValue = w;
		var anh = document.createAttribute("height");
		anh.nodeValue = h;
		canvas.setAttributeNode(anw);
		canvas.setAttributeNode(anh);
		ctx.drawImage(that, 0, 0, w, h);
		// Image Quality
		if (obj.quality && obj.quality <= 1 && obj.quality > 0) {
			quality = obj.quality;
		}
		// The smaller the quality value, the more blurred the drawn image
		var base64 = canvas.toDataURL('image/jpeg', 0.5);
		// The callback function returns the value of base64
		convertBase64UrlToBlob(base64, resolve, fileName);
	}
}

export function convertBase64UrlToBlob(urlData, resolve, fileName) {
	var arr = urlData.split(','), mime = arr[0].match(/:(.*?);/)[1],
		bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
	while (n--) {
		u8arr[n] = bstr.charCodeAt(n);
	}
	let blob = new Blob([u8arr], { type: mime });
	blob.name = fileName
    resolve(blob)
	// return new Blob([u8arr], { type: mime });
}


export const photoCompress = (file, w, objDiv, fileName) => {
    return new Promise((resolve) => {
        const ret = (data) => resolve(data)
        var ready = new FileReader();
        ready.readAsDataURL(file);
        ready.onload = function () {
            var re = this.result;
            canvasDataURL(re, w, objDiv, ret, fileName)   
        }
    })
}