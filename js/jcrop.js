$(document).ready(function() {
    var canvas, ctx, overlayImage;

    $('#imageUpload').change(function() {
        var file = this.files[0];
        if (file.size > 2 * 1024 * 1024) {
            alert('Please select an image file smaller than 2 MB.');
            return;
        }

        var reader = new FileReader();
        reader.onload = function(e) {
            var img = new Image();
            img.onload = function() {
                var width = img.width;
                var height = img.height;
                if (width > 512 || height > 512) {
                    var ratio = width / height;
                    if (ratio > 1) {
                        width = 512;
                        height = Math.round(width / ratio);
                    } else {
                        height = 512;
                        width = Math.round(height * ratio);
                    }
                }
                canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                $('#uploadedImage').attr('src', canvas.toDataURL());
                $('#imageWrapper').show();
                $('#overlayWrapper').show();
                $('#downloadButton').show();
                initializeJCrop();
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    });

    function initializeJCrop() {
        $('#uploadedImage').Jcrop({
            aspectRatio: 1, // Set the aspect ratio to 1:1 for square selection
            onSelect: updateOverlay // Call updateOverlay function when selection is made
        });
    }

    function updateOverlay(coords) {
        canvas = document.getElementById('overlayCanvas');
        ctx = canvas.getContext('2d');
        var image = new Image();
        image.onload = function() {
            canvas.width = coords.w;
            canvas.height = coords.h;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(image, coords.x, coords.y, coords.w, coords.h, 0, 0, coords.w, coords.h);
            image.setAttribute('crossorigin', 'anonymous');

            // Superponer la imagen uniforme
            var uniforme = new Image();
            uniforme.onload = function() {
                ctx.drawImage(uniforme, 0, 0, canvas.width, canvas.height);
                overlayImage = canvas.toDataURL("image/jpeg", 0.8); // Convertir el canvas a una imagen JPEG
            };
            image.setAttribute('crossorigin', 'anonymous');
            uniforme.src = 'images/uniforme.png'; // Ruta de la imagen uniforme
        };
        image.src = $('#uploadedImage').attr('src');
    }

    $('#downloadButton').click(function() {
        if (overlayImage) {
            var link = document.createElement('a');
            link.href = overlayImage;
            link.download = 'overlay_image.jpg'; // Nombre del archivo a descargar
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    });
});