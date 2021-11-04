var mapSize = [10000,10000,10000], cameraSize = 1000;//
var scene = [], destination = [], camera = [], renderer = [];

function Env(scene,destination,camera,renderer){
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
        var camera_new = new THREE.PerspectiveCamera(60, width / height, 1, 10000);
        camera.push(camera_new);
        this.cameraPosition = [0,0,0];
        this.cameraDirection = [0,0,0];
        this.moveCamera();
        //设置相机
        var renderer_new = new THREE.WebGLRenderer();
        renderer.push(renderer_new);
        this.reSizeMap();
        //设置画布
        var ambient = new THREE.AmbientLight(0xffffff);
        scene[0].add(ambient);
        //设置环境光
    }
    this.moveCamera = function (){

        camera[0].position.set(this.cameraPosition);
        camera[0].lookAt(new THREE.Vector3(this.cameraDirection[0],this.cameraDirection[1],this.cameraDirection[2]));
    }
    this.reSizeMap = function (){
        var width = window.innerWidth, height = window.innerHeight; //窗口高度
        renderer.setSize(width, height);//设置渲染区域尺寸
        renderer.setClearColor(0xffffff, 1); //设置背景颜色
        document.body.appendChild(renderer.domElement); //body元素中插入canvas对象
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