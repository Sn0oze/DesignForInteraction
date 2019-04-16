(function () {
    let deviceCameras = [];
    let qrContent = "";
    const preferredCameraKey = "prefCam";

    let currentCameraId = parseInt(localStorage.getItem(preferredCameraKey)) || 0;


    const scanner = new Instascan.Scanner({ video: document.getElementById('preview') });
    scanner.addListener('scan', function (content) {
        // close scanner after scanning the qr code
        qrContent = content;
        //scanner is closed in modal
        $("#scanCompleted").css("display", "inline");
        setTimeout(() => {$(
            '#scannerModal').modal('hide');
            $("#scanCompleted").css("display", "inline")
        }, 1000);
    });


    Instascan.Camera.getCameras().then(function (cameras) {
        if (cameras.length > 0) {
            deviceCameras = cameras;
            $("#openScannerBtn").removeAttr("disabled");
            if(cameras.length < 2){
                //hide the swith camera button in teh device doesn't have multiple cameras
                $("#switchCameraBtn").hide(0);
            }
        } else {
            console.error('No cameras found.');
        }
    }).catch(function (e) {
        //toggle camera alert
        $(".camera-alert").css("visibility", "visible");
    });

    $('#scannerModal').on('show.bs.modal', function (e) {
        if(deviceCameras.length){
            scanner.start(deviceCameras[currentCameraId]);
        }
        $('#scannerModal').modal('hide');


        console.log("open")
    });
    $('#scannerModal').on('hide.bs.modal', function (e) {
        scanner.stop().then(function () {
            //stop the scanner when to modal is closed manually
            scanner.stop().then(function () {
                if(qrContent){
                    if (isUrl(qrContent)){
                        if(getHost(qrContent) !== window.location.host){
                            window.open(qrContent, '_blank');
                        }
                    }
                    else if(qrContent.startsWith("/pages/")){
                        console.log(qrContent);
                        $(".overlay").css("display", "flex");
                        const quiz = qrContent;
                        setTimeout(()=> {window.location.href += quiz},1500);
                        // window.location.href += content
                    }
                    else{
                        alert(qrContent)
                    }
                    //reset qr content after modal is closed
                    qrContent = "";
                }
                else{
                    qrContent = "";
                    console.log("no scan");
                }
            });
        });
    });

    $("#switchCameraBtn").click(
        function(event){
            if(deviceCameras.length > 1){
                scanner.stop().then(function () {
                    currentCameraId = nextCameraId(currentCameraId, deviceCameras);
                    scanner.start(deviceCameras[currentCameraId]);

                });
            }
        });

    function isUrl(s) {
        const regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
        return regexp.test(s);
    }

    function getHost(url) {
        let a = document.createElement('a');
        a.href = url;
        return a.hostname;
    }

    function nextCameraId(current, deviceCameras) {
        let nextCamera = current === deviceCameras.length-1 ? 0 : current+1;
        localStorage.setItem(preferredCameraKey, nextCamera);
        return nextCamera;

    }
})();