var mapSize = [1000,1000,1000], cameraSize = 10000, keyCode = [];//
var scene = [], destination = [], camera = [], renderer = [];

function Env(scene,destination,camera,renderer){
    this.init = function(){
        var scene_new = new THREE.Scene();
        scene.push(scene_new);
        var destination_obj = new THREE.BoxGeometry(100, 100, 100);//形状
        var destination_material = new THREE.MeshLambertMaterial({
            color: 0x114514
          }); //材质对象Material
        var destination_new = new THREE.Mesh(destination_obj, destination_material); //网格模型对象Mesh
        destination.push(destination_new);
        scene[0].add(destination[0]);//终点的网格模型添加到场景中
        var axesHelper = new THREE.AxesHelper(250);
        scene[0].add(axesHelper);//辅助坐标系添加到场景中
        //至此，创建了sence，destination和axeshelper
        var camera_new = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 1, cameraSize);
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
        var point = new THREE.PointLight(0xffffff);
        point.position.set(0,0,0); //点光源位置
        scene[0].add(point); //点光源添加到场景中
    }
    this.moveCamera = function (){
        camera[0].position.set(this.cameraPosition[0],this.cameraPosition[1],this.cameraPosition[2]);
        camera[0].lookAt(new THREE.Vector3(this.cameraDirection[0],this.cameraDirection[1],this.cameraDirection[2]));
        //camera[0].rotation.order = 'YXZ';
    }
    this.reSizeMap = function (){
        var width = window.innerWidth, height = window.innerHeight; //窗口高度
        renderer[0].setSize(width, height);//设置渲染区域尺寸
        renderer[0].setClearColor(0x000000, 1); //设置背景颜色
        document.body.appendChild(renderer[0].domElement); //body元素中插入canvas对象
    }
    this.fresh = function(){
        destination[0].position.set(Math.random()*mapSize[0],Math.random()*mapSize[1],Math.random()*mapSize[2])
        //在10000的范围内随机移动了destination
        console.log(destination[0].position);
    }
}
function render(){
    requestAnimationFrame(render);
    renderer[0].render(scene[0],camera[0]);//执行渲染操作
    keyMotion();
}
function keyMotion(){
    if(keyCode[87] == true){
        camera[0].translateZ(-3);
    }//按下W
    if(keyCode[83] == true){
        camera[0].translateZ(1);
    }//按下S
    if(keyCode[65] == true){
        camera[0].translateX(-1);
    }//按下A
    if(keyCode[68] == true){
        camera[0].translateX(1);
    }//按下D
    if(keyCode[81] == true){
        camera[0].rotateZ(-0.01);
    }//按下Q
    if(keyCode[69] == true){
        camera[0].rotateZ(0.01);
    }//按下E
}
function arriveDestination(env){
    if(Math.abs(camera[0].position.x - destination[0].position.x) < 50 ){
        if(Math.abs(camera[0].position.y - destination[0].position.y) < 50 ){
            if(Math.abs(camera[0].position.z - destination[0].position.z) < 50 ){
                env.fresh();
            }
        }
    }
}