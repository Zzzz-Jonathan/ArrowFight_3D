class Communicate {
    constructor(){

    }
    POSTJSON(url, data){
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
    inf(player, enemy, energy, camera, reward, done){
        var positionP = player.position, velocityP = player.velocity, rotationP = camera.rotation;
        var positionE = enemy.position, velocityE = enemy.velocity;
        var hitpointP = player.hitpoint, hitPointE = enemy.hitpoint;
        var playerId = player.id;

        //var json = [];
        var row = {};

        row.playerId = playerId;//id

        var rowPP = {};//state
        rowPP.x = positionP.x;
        rowPP.y = positionP.y;
        rowPP.z = positionP.z;
        row.position = rowPP;

        var rowPV = {};
        rowPV.x = velocityP.x;
        rowPV.y = velocityP.y;
        rowPV.z = velocityP.z;
        row.velocity = rowPV;

        var rowPR = {};
        rowPR.x = rotationP.x;
        rowPR.y = rotationP.y;
        rowPR.z = rotationP.z;
        row.rotation = rowPR;

        var rowERP = {};
        rowERP.x = positionP.x - positionE.x;
        rowERP.y = positionP.y - positionE.y;
        rowERP.z = positionP.z - positionE.z;
        row.enemyRelativePosition = rowERP;

        var rowEV = {};
        rowEV.x = velocityE.x;
        rowEV.y = velocityE.y;
        rowEV.z = velocityE.z;
        row.enemyVelocity = rowEV;

        //row.hitpointP = hitpointP;

        row.hitPointE = hitPointE;

        row.energy = energy;

        //json.push(row);

        return row;
    }
}

export { Communicate };