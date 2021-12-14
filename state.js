class State {
    constructor(enemy, player, camera, gameTime, move, scene){
        this.player = player;
        this.camera = camera;
        this.enemylist = enemy;
        this.enemy = undefined;
        this.eHP = [];
        this.eID = [];
        for(var i = 0; i < this.enemylist.length; i++){
            this.eHP[i] = this.enemylist[i].hitpoint;
            this.eID[i] = this.enemylist[i].id;
        }
        this.enemyNum = enemy.length;
        this.reward = 0;
        this.showReward = 0;
        this.time = undefined;
        this.reset = undefined;
        this.gameTime = gameTime;
        this.move = move;
        this.canSee = false;
        this.scene = scene;
    }
    rewardCalc(enemy){
        // if(enemy !== undefined){
        //     console.log(this.eHP, enemy.hitpoint);
        // }

        if(this.enemylist.length < this.enemyNum){
            this.reward += 10*(this.enemyNum - this.enemylist.length);
            this.showReward += 10*(this.enemyNum - this.enemylist.length);
            this.enemyNum = this.enemylist.length;
        }
        else{
            let id = enemy.id, aim = 0;
            for(var i = 0; i < this.eID.length; i++){
                if(this.eID[i] === id){aim = i;break;}
            }
            if(enemy.hitpoint < this.eHP[aim]){
                this.reward += 1;
                this.showReward += 1;
                this.eHP[aim] = enemy.hitpoint;
            }
        }
        var dir = this.move.dirToAimRelative(this.camera, this.scene, enemy);
        var deg = (Math.sqrt(dir.x*dir.x + dir.y*dir.y)/Math.abs(dir.z));
        if(dir.z < 0 && deg < Math.tan(Math.PI/72)){
            if(!this.canSee){
                this.canSee = true;
                this.reward += 1;
                this.showReward += 1;
            }
            //console.log("Can see!");
        }
        else {
            if(this.canSee){
                this.canSee = false;
                this.reward -= 1;
                this.showReward -= 1;
            }
            //console.log("Can't see!");
        }
    }
    clearReward(){
        this.reward = 0;
    }
    resetMsg(){
        this.reset = true;
        this.time = new Date();
        this.showReward = 0;
        this.enemyNum = this.enemylist.length;
        for(var i = 0; i < this.enemylist.length; i++){
            this.eHP[i] = this.enemylist[i].hitpoint;
        }
    }
    selectEnemy(){
        let min = 9999, aim = 0;
        let px = this.player.position.x, py = this.player.position.y, pz = this.player.position.z;

        for(var i = 0; i < this.enemylist.length; i++){
            this.eID[i] = this.enemylist[i].id;
            let pos = this.enemylist[i].position;
            let dist = (pos.x - px)*(pos.x - px) + (pos.y - py)*(pos.y - py) + (pos.z - pz)*(pos.z - pz);
            if(Math.sqrt(dist) < min){
                min = Math.sqrt(dist);
                aim = i;
            }
        }
        return this.enemylist[aim];
    }
    inf(player, enemy, camera, reward, done){
        if(this.enemyNum === 0){
            var vec = new THREE.Vector3(0,0,0);
            var positionP = vec, velocityP = vec, rotationP = vec;
            var positionE = vec, velocityE = vec;
            var hitPointE = 0;
            var playerId = player.id;
        }
        else {
            var positionP = player.position, velocityP = player.velocity, rotationP = camera.rotation;
            var positionE = enemy.position, velocityE = enemy.velocity;
            var hitPointE = enemy.hitpoint;
            var playerId = player.id;
        }

        //var json = [];
        var row = {};

        if(this.reset){
            row.type = 'reset';
            //console.log("reset!");
            this.reset = false;
        }
        else {
            row.type = 'action';
        }

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

        row.energy = player.energy;
        row.reward = reward;
        row.done = done;

        //json.push(row);

        return row;
    }
    step(){
        let done;
        if(this.enemyNum !== 0){
            this.enemy = this.selectEnemy();
            this.rewardCalc(this.enemy);
        }
        done =  this.enemyNum === 0 || (new Date() - this.time) > this.gameTime;
        //console.log(new Date() - this.time)
        return this.inf(this.player, this.enemy, this.camera, this.reward, done);
    }
}

export { State };