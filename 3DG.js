var scene = [],destination = [];

function Env(scene,destination){
    this.init = function(){
        var scene_new = new THREE.Scene();
        scene.push(scene_new);
        var destination_obj = new THREE.BoxGeometry(100, 100, 100);//形状
        var destination_material = new THREE.MeshLambertMaterial({
            color: 0x0000ff
          }); //材质对象Material
        var destination_new = new THREE.Mesh(destination_obj, destination_material); //网格模型对象Mesh
        destination.push(destination_new);
        scene[0].add(destination[0]);//网格模型添加到场景中
        var axesHelper = new THREE.AxesHelper(250);
        scene[0].add(axesHelper);
        //至此，创建了sence，destination和axeshelper
    }
    this.fresh = function(){
        destination[0]
    }
}

var test = new Env(scene,destination);
test.init();
console.log(scene.length);