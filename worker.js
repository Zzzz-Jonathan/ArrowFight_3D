import {Communicate} from "./sendInf.js"

var comm = new Communicate()
var url = '', data = [undefined]
var polling = function (){
    comm.POSTJSON()
}

self.onmessage = function (event){
    data[0] = event.data
}