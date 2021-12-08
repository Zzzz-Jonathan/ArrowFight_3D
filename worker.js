const url = 'http://127.0.0.1:8000/test/'
var data = undefined, result = true, dateTime = new Date();

self.onmessage = function (event){
    data = event.data;
    //postMessage("Worker received!");
}

function sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

function postJson(url, data){
    var xhr = new XMLHttpRequest();
    xhr.open("POST",url);
    xhr.setRequestHeader('content-type', 'application/json');

    xhr.send(JSON.stringify(data));
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if(xhr.getResponseHeader('content-type')==='application/json') {
                postMessage(JSON.parse(xhr.responseText));
                result = true;
                //console.log(xhr.responseText);
            }
        }
    }
    // while (result === undefined){
    //     postMessage("Waiting reply...");
    // }
}
setInterval(function (){
    if(result && data !== undefined){
        result = false;
        postJson(url, data);
        postMessage(new Date() - dateTime);
        dateTime = new Date();
    }
},10);
