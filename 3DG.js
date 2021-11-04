var mapSize = [10000,10000,10000]
var scene = [], destination = [], camera = [];

function Env(scene,destination,camera){
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
        destination[0].translateX(Math.random()*mapSize[0]);
        destination[0].translateY(Math.random()*mapSize[1]);
        destination[0].translateZ(Math.random()*mapSize[2]);//在10000的范围内随机移动了destination
    }
}
//let T0 = new Date();//上次时间
function render() {
    let T1 = new Date();//本次时间
    let t = T1-T0;//时间差
    T0 = T1;//把本次时间赋值给上次时间
    requestAnimationFrame(render);
    renderer.render(scene,camera);//执行渲染操作
}
//render();//很大程度上避免了速度突变

var test = new Env(scene,destination);
test.init();
console.log(scene.length);