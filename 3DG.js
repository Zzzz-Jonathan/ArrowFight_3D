var mapSize = [3000,3000,3000], cameraSize = 10000, keyCode = [];//
var scene = [], destination = [], camera = [], renderer = [], phyWorld = [], destinationPhysic = [], timeCloud = [], player = [], playerPhysic = [], rocket = [];

function Env(scene,destination,camera,renderer,timeCloud,player,rocket){
    this.init = function(){
        var scene_new = new THREE.Scene();
        scene.push(scene_new);
        // const destination_obj = new THREE.BoxBufferGeometry( 100, 100, 100 );
        // const colorsAttr = destination_obj.attributes.position.clone();
        // // Faces will be colored by vertex colors
        // destination_obj.setAttribute('color', colorsAttr);
        // const destination_material = new THREE.MeshBasicMaterial({
        //     //wireframe:true,
        //     vertexColors: THREE.VertexColors
        // });
        // const destination_new = new THREE.Mesh( destination_obj, destination_material);
        // destination.push(destination_new);
        // scene[0].add(destination[0]);
        destination.push(this.destinationCube());
        scene[0].add(destination[0]);
        //终点的网格模型添加到场景中
        var axesHelper = new THREE.AxesHelper(250);
        scene[0].add(axesHelper);//辅助坐标系添加到场景中
        //至此，创建了sence，destination和axeshelper
        player.push(this.setPlayer());
        scene[0].add(player[0]);
        player[0].position.set(mapSize[0]*0.5,mapSize[1]*0.5,mapSize[2]*0.5);
        //创建了player
        var camera_new = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 1, cameraSize);
        camera.push(camera_new);
        this.cameraPosition = [player[0].position.x,player[0].position.y,player[0].position.z];
        //this.cameraDirection = [0,0,0];
        this.moveCamera();
        //设置相机
        var renderer_new = new THREE.WebGLRenderer();
        renderer.push(renderer_new);
        this.reSizeMap();
        renderer[0].shadowMap.enabled = true;
        //设置画布
        var ambient = new THREE.AmbientLight(0xffffff,0.5);
        scene[0].add(ambient);
        //设置环境光
        var point = new THREE.PointLight(0xffffff, 5, 0);
        point.position.set(mapSize[0]*0.5,mapSize[1]*0.5,mapSize[2]*0.5); //点光源位置
        point.visible = true;
        scene[0].add(point);
        //点光源添加到场景中
        this.timeCloud();//生成时间云
        for(var i = 0; i < 40; i++){
            this.genRocket(randomRocket());
        }
    }
    this.destinationCube = function (){
        var triangles = 16000;

        var geometry = new THREE.BufferGeometry();
        var positions = new Float32Array( triangles * 3 * 3);
        var normals = new Float32Array( triangles * 3 * 3);
        var colors = new Float32Array( triangles * 3 * 3);

        var color = new THREE.Color();

        var n = 100, n2 = n/2;
        var d = 3, d2 = d/2;

        var pA = new THREE.Vector3();
        var pB = new THREE.Vector3();
        var pC = new THREE.Vector3();

        var cb = new THREE.Vector3();
        var ab = new THREE.Vector3();

        for( var i = 0; i < positions.length; i += 9 ){
            var x = Math.random() * n - n2;
            var y = Math.random() * n - n2;
            var z = Math.random() * n - n2;

            var ax = x + Math.random() * d - d2;
            var ay = y + Math.random() * d - d2;
            var az = z + Math.random() * d - d2;

            var bx = x + Math.random() * d - d2;
            var by = y + Math.random() * d - d2;
            var bz = z + Math.random() * d - d2;

            var cx = x + Math.random() * d - d2;
            var cy = y + Math.random() * d - d2;
            var cz = z + Math.random() * d - d2;

            positions[i] = ax;
            positions[i + 1] = ay;
            positions[i + 2] = az;

            positions[i + 3] = bx;
            positions[i + 4] = by;
            positions[i + 5] = bz;

            positions[i + 6] = cx;
            positions[i + 7] = cy;
            positions[i + 8] = cz;

            pA.set(ax, ay, az);
            pB.set(bx, by, bz);
            pC.set(cx, cy, cz);

            cb.subVectors(pC, pB);
            ab.subVectors(pA, pB);
            cb.cross(ab);

            cb.normalize();
            //法向量的方向可以这样表示N(nx, ny, nz);
            var nx = cb.x;
            var ny = cb.y;
            var nz = cb.z;

            normals[i]     = nx;
            normals[i + 1] = ny;
            normals[i + 2] = nz;

            normals[i + 3] = nx;
            normals[i + 4] = ny;
            normals[i + 5] = nz;

            normals[i + 6] = nx;
            normals[i + 7] = ny;
            normals[i + 8] = nz;
            //颜色用rgb表示, rgb每一个分量取值范围0-1,vx,vy,vz分别对应rgb值。
            var vx = (x/n) + 0.5;
            var vy = (y/n) + 0.5;
            var vz = (z/n) + 0.5;

            color.setRGB(vx, vy, vz);
            //将三角形的三个顶点设为同样的颜色
            colors[i] = color.r;
            colors[i + 1] = color.g;
            colors[i + 2] = color.b;

            colors[i + 3] = color.r;
            colors[i + 4] = color.g;
            colors[i + 5] = color.b;

            colors[i + 6] = color.r;
            colors[i + 7] = color.g;
            colors[i + 8] = color.b;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute( positions, 3));
        geometry.setAttribute('normal', new THREE.BufferAttribute( normals, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute( colors, 3));

        geometry.computeBoundingSphere();

        var material = new THREE.MeshPhongMaterial({
            color : 0xaaaaaa, ambient : 0xaaaaaa, specular : 0xffffff, shininess : 250,
            side : THREE.DoubleSide, vertexColors : THREE.VertexColors
        });

        mesh = new THREE.Mesh( geometry, material);
        return mesh;
    }
    this.moveCamera = function (){
        camera[0].position.set(this.cameraPosition[0],this.cameraPosition[1],this.cameraPosition[2]);
        //camera[0].lookAt(new THREE.Vector3(this.cameraDirection[0],this.cameraDirection[1],this.cameraDirection[2]));
        //camera[0].rotation.order = 'YXZ';
    }
    this.genRocket = function ([x,y,z]){
        var geometry = new THREE.SphereGeometry(5, 40, 40);
        var material = new THREE.MeshLambertMaterial({
            color: 0xffffff
        });
        mesh = new THREE.Mesh(geometry, material); //网格模型对象Mesh
        mesh.position.set(x,y,z);
        rocket.push(mesh);
        scene[0].add(mesh);
    }
    this.reSizeMap = function (){
        var width = window.innerWidth, height = window.innerHeight; //窗口高度
        renderer[0].setSize(width, height);//设置渲染区域尺寸
        renderer[0].setClearColor(0x000000, 1); //设置背景颜色
        document.body.appendChild(renderer[0].domElement); //body元素中插入canvas对象
    }
    this.fresh = function(){
        destinationPhysic[0].position.set(Math.random()*mapSize[0],Math.random()*mapSize[1],Math.random()*mapSize[2]);
        //在map的范围内随机移动了destination
        for(var i = 0; i < timeCloud.length; i++){
            timeCloud[i].position.set(Math.random()*mapSize[0],Math.random()*mapSize[1],Math.random()*mapSize[2]);
        }
        for(i = 0; i < rocket.length; i++){
            var rd = randomRocket();
            rocket[i].position.set(rd[0],rd[1],rd[2]);
            scene[0].add(rocket[i]);
        }
        console.log(destination[0]);
    }
    this.setPlayer = function (){
        var geometry = new THREE.SphereGeometry(30, 40, 40);
        var material = new THREE.MeshPhongMaterial({
            color: 0xffffff
        });
        return new THREE.Mesh(geometry, material); //网格模型对象Mesh
    }
    this.timeCloud = function (){
        var OBJLoader = new THREE.OBJLoader();//obj加载器
        var MTLLoader = new THREE.MTLLoader();//材质文件加载器
        MTLLoader.load('./Clouds.mtl', function(materials) {
            // 返回一个包含材质的对象MaterialCreator
            //obj的模型会和MaterialCreator包含的材质对应起来
            OBJLoader.setMaterials(materials);
            OBJLoader.load('./Clouds.obj', function(obj) {
                obj.scale.set(0.05, 0.05, 0.05); //放大obj组对象
                for(var i = 0; i < obj.children.length; i++){
                    timeCloud[i] = obj.children[i];
                    timeCloud[i].geometry.computeBoundingBox();
                    var centroid = new THREE.Vector3();
                    centroid.addVectors(timeCloud[i].geometry.boundingBox.min, timeCloud[i].geometry.boundingBox.max);
                    centroid.multiplyScalar( 0.5 );
                    centroid.applyMatrix4(timeCloud[i].matrixWorld);
                    timeCloud[i].geometry.center(centroid.x*0.05, centroid.y*0.05, centroid.z*0.05)
                    //obj.position.set(centroid.x*0.05, centroid.y*0.05, centroid.z*0.05)//

                    timeCloud[i].material.color.set(0x999999);
                    timeCloud[i].material.opacity = 0.75;
                    timeCloud[i].material.transparent = true;
                    timeCloud[i].position.set(Math.random()*mapSize[0],Math.random()*mapSize[1],Math.random()*mapSize[2]);
                    scene[0].add(timeCloud[i]);//返回的组对象插入场景中
                    //console.log(timeCloud[i]);
                }
            })
        })
    }
}
function randomRocket(){
    var max = 1500, min = 400;
    var length = (max - min)*Math.random()+min;
    var x = Math.random(), y = Math.random(), z = Math.random();
    var rx = (x*x)/(x*x+y*y+z*z), ry= (y*y)/(x*x+y*y+z*z), rz = (z*z)/(x*x+y*y+z*z);
    if(Math.random() < 0.5){rx = -rx;}
    if(Math.random() < 0.5){ry = -ry;}
    if(Math.random() < 0.5){rz = -rz;}
    console.log(rx,ry,rz);
    var lx = length*rx+camera[0].position.x, ly = length*ry+camera[0].position.y, lz = length*rz+camera[0].position.z;

    return [lx,ly,lz];
}
function rocketMove(){
    for(var i = 0; i < rocket.length; i++){
        var dx = player[0].position.x - rocket[i].position.x, dy = player[0].position.y - rocket[i].position.y, dz = player[0].position.z - rocket[i].position.z;
        var dist = Math.sqrt(dx*dx+dy*dy+dz*dz), velocity = 2.5;
        var rx = (dx*dx)/(dx*dx+dy*dy+dz*dz), ry = (dy*dy)/(dx*dx+dy*dy+dz*dz),rz = (dz*dz)/(dx*dx+dy*dy+dz*dz);
        if(dx < 0){rx = -rx;}
        if(dy < 0){ry = -ry;}
        if(dz < 0){rz = -rz;}
        if(dist < 25){scene[0].remove(rocket[i]);}
        else{
            rocket[i].translateX(velocity*rx);
            rocket[i].translateY(velocity*ry);
            rocket[i].translateZ(velocity*rz);
        }
    }
}
function Physic(phyWorld,destinationPhysic,playerPhysic){
    this.init = function (){
        var world_new = new CANNON.World();
        phyWorld.push(world_new);
        phyWorld[0].gravity.set(0, 0, 0);
        //创建物理世界
        destinationPhysic_new = new CANNON.Body({ //创建一个刚体（物理世界的刚体数据）
            mass: 0, //刚体的质量，这里单位为kg
            position: new CANNON.Vec3(destination[0].position.x, destination[0].position.y, destination[0].position.z), //刚体的位置，单位是米
            shape: new CANNON.Box(new CANNON.Vec3(100, 100, 100)), //刚体的形状（这里是立方体，立方体的参数是一个包含半长、半宽、半高的三维向量，具体我们以后会说）
            material: new CANNON.Material({friction: 0.05, restitution: 0}) //材质数据，里面规定了摩擦系数和弹性系数
        });
        destinationPhysic.push(destinationPhysic_new);
        phyWorld[0].addBody(destinationPhysic[0]);
        //创建物理destination
        player_new = new CANNON.Body({ //创建一个刚体（物理世界的刚体数据）
            mass: 0, //刚体的质量，这里单位为kg
            position: new CANNON.Vec3(player[0].position.x, player[0].position.y, player[0].position.z), //刚体的位置，单位是米
            shape: new CANNON.Sphere(30),
            material: new CANNON.Material({friction: 0.05, restitution: 0}) //材质数据，里面规定了摩擦系数和弹性系数
        });
        playerPhysic.push(player_new);
        phyWorld[0].addBody(playerPhysic[0]);
    }
    this.freshPhysic = function (){
        var timeStep = 1.0 / 60.0;
        phyWorld[0].step(timeStep);

        destination[0].position.copy(destinationPhysic[0].position);
        destination[0].quaternion.copy(destinationPhysic[0].quaternion);//更新终点
        playerPhysic[0].position.copy(player[0].position);
        playerPhysic[0].quaternion.copy(player[0].quaternion);//更新playerPhysic
        //console.log(destinationPhysic[0].position);
    }
}
function render(){
    requestAnimationFrame(render);
    renderer[0].render(scene[0],camera[0]);//执行渲染操作
    keyMotion();
    rocketMove();
}
function keyMotion(){
    if(keyCode[87] == true){
        player[0].translateZ(-3);
    }//按下W
    if(keyCode[83] == true){
        player[0].translateZ(1);
    }//按下S
    if(keyCode[65] == true){
        player[0].translateX(-1);
    }//按下A
    if(keyCode[68] == true){
        player[0].translateX(1);
    }//按下D
    if(keyCode[81] == true){
        player[0].rotateZ(-0.01);
        camera[0].rotateZ(-0.01);
        // console.log(player[0]);
        // console.log(camera[0]);
    }//按下Q
    if(keyCode[69] == true){
        player[0].rotateZ(0.01);
        camera[0].rotateZ(0.01);
    }//按下E

    camera[0].position.x = player[0].position.x;
    camera[0].position.y = player[0].position.y;
    camera[0].position.z = player[0].position.z;
    //camera[0].translateZ(500);
    //camera[0].lookAt(player[0].position);
    //camera[0].translateY(500);
}
function arriveDestination(env,physic){
    if(Math.abs(player[0].position.x - destination[0].position.x) < 50 ){
        if(Math.abs(player[0].position.y - destination[0].position.y) < 50 ){
            if(Math.abs(player[0].position.z - destination[0].position.z) < 50 ){
                env.fresh();
            }
        }
    }
    physic.freshPhysic();
}