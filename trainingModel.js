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
        action = (parseInt(action)).toString(5);
        let actions = [];

        action.push(parseInt(action[0]));
        action.push(parseInt(action[1]));
        action.push(parseInt(action[2]));

        return actions;
    }
}

export {TrainingModel};