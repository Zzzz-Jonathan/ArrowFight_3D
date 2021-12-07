var url = 'http://127.0.0.1:8000/test/', data = undefined;


async function polling (){
    if(data !== undefined){
        POSTJSON(url, data);
        postMessage("Worker have posted!");
    }
    else{
        postMessage("Worker unposted!");
    }
    await sleep(5000);
    if(data === false){}
    else{polling();}
}

self.onmessage = function (event){
    data = event.data;
    postMessage("Worker received!");
}

function sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

function POSTJSON(url, data){
    var xhr = new XMLHttpRequest();
    xhr.open("POST",url);
    xhr.setRequestHeader('content-type', 'application/json');

    xhr.send(JSON.stringify(data));
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            if(xhr.getResponseHeader('content-type')==='application/json') {
                var result = JSON.parse(xhr.responseText);
                //console.log(xhr.responseText);
                if(result.code===-1) {
                    alert('验证码错误');
                }
            }
            else {
                console.log(xhr.responseText);
            }
        }
    }
}

polling()