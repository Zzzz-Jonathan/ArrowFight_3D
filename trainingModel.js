class TrainingModel {
    constructor(){
        this.start = false;
        this.mode = false;
    }
    keyBoardTest(keyCode){
        if (keyCode[84] && keyCode[77]) {
            //同时按下t,m
            this.start = true;
        }
        if (this.start === true){
            if (!keyCode[84] && !keyCode[77]){
                this.start = false;
                this.mode = !this.mode;
            }
        }
        return this.mode;
    }
    actionTrans(action) {
        //console.log(action, typeof (action))
        action = (parseInt(action)).toString(5);
        let len = action.length
        for(var i = 0; i < 3 - len; i++) {
            action = '0' + action;
        }
        //console.log(action, typeof (action))
        let actions = [];

        actions.push(parseInt(action[0]));
        actions.push(parseInt(action[1]));
        actions.push(parseInt(action[2]));

        return actions;
    }
    actionToKey (autoAction, mouseCode, keyCode) {
        if(autoAction[0] === 0){
            mouseCode[0] = false;
        }
        else if(autoAction[0] === 1){
            mouseCode[0] = true;
        }

        if(autoAction[1] === 0){
            keyCode[87] = keyCode[83] = keyCode[65] = keyCode[68] = false;
        }
        else if(autoAction[1] === 1){
            keyCode[87] = true;
            keyCode[83] = keyCode[65] = keyCode[68] = false;
        }
        else if(autoAction[1] === 2){
            keyCode[83] = true;
            keyCode[87] = keyCode[65] = keyCode[68] = false;
        }
        else if(autoAction[1] === 3){
            keyCode[65] = true;
            keyCode[87] = keyCode[83] = keyCode[68] = false;
        }
        else if(autoAction[1] === 4){
            keyCode[68] = true;
            keyCode[87] = keyCode[83] = keyCode[65] = false;
        }
    }
    actionToMouse (autoAction){
        var cry, crx;
        if(autoAction[2] === 0){cry = crx = 0;}
        else if(autoAction[2] === 1){cry = 0; crx = 0.02;}
        else if(autoAction[2] === 2){cry = 0; crx = -0.02;}
        else if(autoAction[2] === 3){cry = 0.02; crx = 0;}
        else if(autoAction[2] === 4){cry = -0.02; crx = 0;}

        return [cry, crx];
    }
}

export {TrainingModel};