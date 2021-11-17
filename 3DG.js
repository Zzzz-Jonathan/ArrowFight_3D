var mapSize = [3000,3000,3000], cameraSize = 10000, keyCode = [], moveEnergy = 400,moveEnergyMax = 400, mouseClickTime = 0, loading = true, score = [0,0], vOfPlayer = [200,130,60];//
var scene = [], destination = [], camera = [], renderer = [], phyWorld = [], destinationPhysic = [], timeCloud = [], timeCloudMap = [], player = [], playerPhysic = [], rocket = [], rocketPhysic = [], bullet = new Array(), bulletPhysics = new Array();
var playerModule = [], cloudModules = [];

function Env(scene,destination,camera,renderer,timeCloud,player){
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
        var camera_new = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 1, cameraSize);
        camera.push(camera_new);
        //终点的网格模型添加到场景中
        var axesHelper = new THREE.AxesHelper(30);
        scene[0].add(axesHelper);//辅助坐标系添加到场景中
        //至此，创建了sence，destination和axeshelper
        this.setPlayer();
        //console.log(player.length);
        //创建了player
        this.cameraPosition = [0,0,0];
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
        point.position.set(0,0,0); //点光源位置
        point.visible = true;
        scene[0].add(point);
        //点光源添加到场景中
        this.timeCloud();//生成时间云
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
    this.reSizeMap = function (){
        var width = window.innerWidth, height = window.innerHeight; //窗口高度
        renderer[0].setSize(width, height);//设置渲染区域尺寸
        renderer[0].setClearColor(0x000000, 1); //设置背景颜色
        document.getElementById("game").appendChild(renderer[0].domElement); //body元素中插入canvas对象
    }
    this.fresh = function(){
        destinationPhysic[0].position.set(Math.random()*mapSize[0]-0.5*mapSize[0],Math.random()*mapSize[1]-0.5*mapSize[1],Math.random()*mapSize[2]-0.5*mapSize[2]);
        //在map的范围内随机移动了destination
        for(var i = 0; i < timeCloud.length; i++){
            timeCloud[i].position.set(Math.random()*mapSize[0]-0.5*mapSize[0],Math.random()*mapSize[1]-0.5*mapSize[1],Math.random()*mapSize[2]-0.5*mapSize[2]);
        }
        for(i = 0; i < rocket.length; i++){
            var rd = randomRocket();
            rocketPhysic[i].position.set(rd[0],rd[1],rd[2]);
            scene[0].add(rocket[i]);
            // rocket[i].material.pose();
            // rocket[i].geometry.pose();
            phyWorld[0].addBody(rocketPhysic[i]);
        }
        console.log(destination[0]);
    }
    this.setPlayer = function (){
        // var mesh = new THREE.Mesh();
        // mesh.copy(playerModule[0]);
        var mesh = playerModule[0].clone();
        player.push(mesh);
        scene[0].add(player[0]);
        player[0].position.set(0,0,0);

        // var OBJLoader = new THREE.OBJLoader();//obj加载器
        // var MTLLoader = new THREE.MTLLoader();//材质文件加载器
        // MTLLoader.load('./player/SciFi_Fighter.mtl', function(materials) {
        //     OBJLoader.setMaterials(materials);
        //     OBJLoader.load('./player/SciFi_Fighter.obj', function(obj) {
        //         obj.scale.set(5, 5, 5); //放大obj组对象
        //         player.push(obj);
        //         scene[0].add(player[0]);
        //         player[0].position.set(0,0,0);
        //         //player[0].rotateY(Math.PI);
        //         //player[0].quaternion.copy(camera[0].quaternion);
        //     });
        // })
    }
    this.timeCloud = function (){
        for(var i = 0; i < cloudModules[0].children.length; i++){
            timeCloud[i] = cloudModules[0].children[i].clone();
            timeCloud[i].geometry.computeBoundingBox();
            var centroid = new THREE.Vector3();
            centroid.addVectors(timeCloud[i].geometry.boundingBox.min, timeCloud[i].geometry.boundingBox.max);
            centroid.multiplyScalar( 0.5 );
            centroid.applyMatrix4(timeCloud[i].matrixWorld);
            timeCloud[i].geometry.center(centroid.x*0.05, centroid.y*0.05, centroid.z*0.05)
            //obj.position.set(centroid.x*0.05, centroid.y*0.05, centroid.z*0.05)//
            timeCloud[i].material.color.set(0xadadad);
            timeCloud[i].material.specular.set(0xffffff);
            timeCloud[i].material.opacity = 0.75;
            timeCloud[i].material.transparent = true;
            var pos = freshInMap();
            timeCloud[i].position.set(pos[0], pos[1], pos[2]);
            timeCloud[i].receiveShadow = true;
            scene[0].add(timeCloud[i]);//返回的组对象插入场景中
        }
        // var OBJLoader = new THREE.OBJLoader();//obj加载器
        // var MTLLoader = new THREE.MTLLoader();//材质文件加载器
        // MTLLoader.load('./Clouds.mtl', function(materials) {
        //     // 返回一个包含材质的对象MaterialCreator
        //     //obj的模型会和MaterialCreator包含的材质对应起来
        //     OBJLoader.setMaterials(materials);
        //     OBJLoader.load('./Clouds.obj', function(obj) {
        //         obj.scale.set(0.05, 0.05, 0.05); //放大obj组对象
        //         for(var i = 0; i < obj.children.length; i++){
        //             timeCloud[i] = obj.children[i];
        //             timeCloud[i].geometry.computeBoundingBox();
        //             var centroid = new THREE.Vector3();
        //             centroid.addVectors(timeCloud[i].geometry.boundingBox.min, timeCloud[i].geometry.boundingBox.max);
        //             centroid.multiplyScalar( 0.5 );
        //             centroid.applyMatrix4(timeCloud[i].matrixWorld);
        //             timeCloud[i].geometry.center(centroid.x*0.05, centroid.y*0.05, centroid.z*0.05)
        //             //obj.position.set(centroid.x*0.05, centroid.y*0.05, centroid.z*0.05)//
        //
        //             timeCloud[i].material.color.set(0xadadad);
        //             timeCloud[i].material.specular.set(0xffffff);
        //             timeCloud[i].material.opacity = 0.75;
        //             timeCloud[i].material.transparent = true;
        //             var pos = freshInMap();
        //             timeCloud[i].position.set(pos[0], pos[1], pos[2]);
        //             timeCloud[i].receiveShadow = true;
        //             scene[0].add(timeCloud[i]);//返回的组对象插入场景中
        //             //console.log(timeCloud[i]);
        //         }
        //     })
        // })
    }
    this.playerShoot = function(t){
        if(!loading){
            var po = player[0].position.clone(), ro = new THREE.Vector3();
            camera[0].getWorldDirection(ro);
            po.add(ro.multiplyScalar(50));
            //console.log(player[0].position, po)
            Bullet(po, ro, t);
        }
    }
}
function freshInMap(){
    var x = Math.random()*mapSize[0]-0.5*mapSize[0], y = Math.random()*mapSize[1]-0.5*mapSize[1], z = Math.random()*mapSize[2]-0.5*mapSize[2];
    return [x, y, z];
}
function limitInBox(object){
    var x = object.position.x, y = object.position.y, z = object.position.z;
    if(Math.abs(x) > mapSize[0]/2){
        if(x > 0) {
            object.position.x = -1*mapSize[0]/2;
        }
        else {
            object.position.x = mapSize[0]/2;
        }
    }
    if(Math.abs(y) > mapSize[1]/2){
        if(y > 0) {
            object.position.y = -1*mapSize[1]/2;
        }
        else {
            object.position.y = mapSize[1]/2;
        }
    }
    if(Math.abs(z) > mapSize[2]/2){
        if(z > 0) {
            object.position.z = -1*mapSize[2]/2;
        }
        else {
            object.position.z = mapSize[2]/2;
        }
    }
}
function MiniMap(scene, destination, player, renderer, camera, timeCloudMap){
    this.init = function (){
        this.miniMapSize = [100,100,100];
        var map = new THREE.Scene();
        scene.push(map);
        // var geometry = new THREE.SphereGeometry(60, 40, 40); //创建一个球体几何对象
        var geometry1 = new THREE.BoxGeometry(10, 10, 10); //创建一个立方体几何对象Geometry
        var material1 = new THREE.MeshLambertMaterial({
            color: 0xff0000
        }); //材质对象Material
        var geometry3 = new THREE.BoxGeometry(this.miniMapSize[0], this.miniMapSize[1], this.miniMapSize[2]); //创建一个立方体几何对象Geometry
        const C3 = geometry3.attributes.position.clone();
        // Faces will be colored by vertex colors
        geometry3.setAttribute('color', C3);
        const material3 = new THREE.MeshBasicMaterial({
            wireframe:true,
            vertexColors: THREE.VertexColors
        });
        var geometry2 = new THREE.SphereGeometry(8, 10, 10);
        var material2 = new THREE.MeshLambertMaterial({
            color: 0x00ff00
        }); //材质对象Material
        var destination_map = new THREE.Mesh(geometry1, material1); //网格模型对象Mesh
        destination.push(destination_map);
        var player_map = new THREE.Mesh(geometry2, material2);
        player.push(player_map);
        var box_map = new THREE.Mesh(geometry3, material3);
        this.arrow = new THREE.ArrowHelper(new THREE.Vector3(0,0,1).normalize(),new THREE.Vector3(0,0,0).normalize(), 25,0xffff00,10,10);
        //console.log(this.arrow);
        //console.log(timeCloud.length);
        scene[1].add(player[1]);
        scene[1].add(destination[1]); //网格模型添加到场景中
        scene[1].add(box_map);
        scene[1].add(this.arrow);
        //点光源
        var point = new THREE.PointLight(0xffffff);
        point.position.set(0, 0, 0); //点光源位置
        scene[1].add(point); //点光源添加到场景中
        //环境光
        var ambient = new THREE.AmbientLight(0xffffff);
        scene[1].add(ambient);

        var axesHelper = new THREE.AxesHelper(20);
        scene[1].add(axesHelper);

        var width = 250, height = 250; //窗口高度
        var k = width / height; //窗口宽高比
        var s = 150; //三维场景显示范围控制系数，系数越大，显示的范围越大
        //创建相机对象
        var camera_map = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 500);
        camera.push(camera_map);
        camera[1].position.set(0, 0, 0); //设置相机位置

        var renderer_map = new THREE.WebGLRenderer({alpha: true});
        renderer_map.setSize(width, height);//设置渲染区域尺寸
        renderer_map.setClearColor(0x000000, 0); //设置背景颜色
        document.getElementById("map").appendChild(renderer_map.domElement); //body元素中插入canvas对象
        //执行渲染操作   指定场景、相机作为参数
        renderer.push(renderer_map);
    }
    this.fresh = function (){
        var length = 150;
        var mdx = ((destination[0].position.x)/mapSize[0])*this.miniMapSize[0], mdy = ((destination[0].position.y)/mapSize[1])*this.miniMapSize[1], mdz = ((destination[0].position.z)/mapSize[2])*this.miniMapSize[2];
        var mpx = ((player[0].position.x)/mapSize[0])*this.miniMapSize[0], mpy = ((player[0].position.y)/mapSize[1])*this.miniMapSize[1], mpz = ((player[0].position.z)/mapSize[2])*this.miniMapSize[2];

        var dx = player[0].position.x, dy = player[0].position.y, dz = player[0].position.z;
        var lx = ((dx*dx)/(dx*dx+dz*dz))*length, lz = ((dz*dz)/(dx*dx+dz*dz))*length,ly = 0.7*length;
        if(dx < 0){lx = -lx;}
        if(dy < 0){ly = -ly;}
        if(dz < 0){lz = -lz;}

        // var pLocal = new THREE.Vector3(0, 0, -1);
        // var pWorld = pLocal.applyMatrix4(camera[0].matrixWorld);
        // var dir = pWorld.sub(camera[0].position).normalize();
        // if(keyCode[87]){
        //     dir.x = -1*dir.x;
        //     dir.y = -1*dir.y;
        //     dir.z = -1*dir.z;
        // }
        var dir = new THREE.Vector3();
        camera[0].getWorldDirection(dir);
        //console.log(dir);

        player[1].position.set(mpx,mpy,mpz);
        //this.arrow.rotateX(0.01);
        this.arrow.setDirection(dir);
        //console.log(this.arrow.rotation.x,camera[0].rotation.x);
        //this.arrow.quaternion.copy(camera[0].quaternion);
        this.arrow.position.copy(player[1].position);
        destination[1].position.set(mdx,mdy,mdz);
        camera[1].position.set(lx,ly,lz);
        //console.log(camera[1].position);
        camera[1].lookAt(new THREE.Vector3(0,0,0));
    }
}
function Bullet(position, direction, t){
    var vset = 20, tset = 10000;
    var geometry = new THREE.CylinderGeometry(1, 5, 10, 30);
    var material = new THREE.MeshLambertMaterial({
        color: 0xffffff
    });
    bullet_new = new THREE.Mesh(geometry, material); //网格模型对象Mesh
    bullet_new.position.set(position.x, position.y, position.z);
    //bullet_new.name = 'bullet';
    //生成bullet图像，并初始化位置

    body = new CANNON.Body({ //创建一个刚体（物理世界的刚体数据）
        mass: 10, //刚体的质量，这里单位为kg
        position: new CANNON.Vec3(position.x, position.y, position.z), //刚体的位置，单位是米
        shape: new CANNON.Cylinder(1, 5, 10, 10),
        material: new CANNON.Material({friction: 0.01, restitution: 0}) //材质数据，里面规定了摩擦系数和弹性系数
    });
    body.name = "bullet";
    //console.log(body.name);
    var dir_camera = new THREE.Quaternion();
    camera[0].getWorldQuaternion(dir_camera);
    var rot = new THREE.Quaternion();
    rot.setFromAxisAngle(new THREE.Vector3(-1,0,0), Math.PI/2);
    dir_camera.multiply(rot);
    //console.log(body)
    //body.quaternion.copy(direction);
    body.quaternion.copy(dir_camera);
    bullet_new.quaternion.copy(dir_camera);
    //body.quaternion.normalize();
    //body.quaternion.z = body.quaternion.z - Math.PI/2;
    // body.quaternion.setFromAxisAngle(direction.x, direction.y);
    // body.quaternion.normalize();
    body.velocity.copy(direction.multiplyScalar(vset));

    scene[0].add(bullet_new);
    phyWorld[0].addBody(body);
    bullet.push(bullet_new);
    bulletPhysics.push(body);

    // if((tset*t)/1000 <20){
    //     tset = tset*t;
    // }
    // else{
    //     tset = 20000;
    // }

    setTimeout(function(){
        var outBullet = bullet.shift();
        var outBulletBody = bulletPhysics.shift();
        scene[0].remove(outBullet);
        outBullet.material.dispose();
        outBullet.geometry.dispose();
        phyWorld[0].removeBody(outBulletBody);
    },tset);
}
function randomRocket(){
    var max = 1500, min = 400;
    var length = (max - min)*Math.random()+min;
    var x = Math.random(), y = Math.random(), z = Math.random();
    var rx = (x*x)/(x*x+y*y+z*z), ry= (y*y)/(x*x+y*y+z*z), rz = (z*z)/(x*x+y*y+z*z);
    if(Math.random() < 0.5){rx = -rx;}
    if(Math.random() < 0.5){ry = -ry;}
    if(Math.random() < 0.5){rz = -rz;}
    //console.log(rx,ry,rz);
    var lx = length*rx+camera[0].position.x, ly = length*ry+camera[0].position.y, lz = length*rz+camera[0].position.z;

    return [lx,ly,lz];
}
function Move(){
    this.dirToAim = function(object, aim){
        var dx = aim.position.x - object.position.x, dy = aim.position.y - object.position.y, dz = aim.position.z - object.position.z;
        var dist = Math.sqrt(dx*dx+dy*dy+dz*dz);

        var dir = new THREE.Vector3(dx, dy, dz), vec = new THREE.Vector3();
        vec.copy(dir);
        dir.normalize();
        //console.log(dir, dist);
        return [dir, dist, vec];
    }
    this.dirToAimRelative = function(object, aim){
        var matrix = new THREE.Matrix4();
        matrix.copy(object.matrixWorldInverse);
        //object.matrixWorldInverse.multiplyMatrices(object.matrixWorld,matrix);
        //console.log(matrix.elements);
        //matrix.transpose(matrix);
        var worldDirAndDist = this.dirToAim(object, aim), worldVertex = new THREE.Vector3();
        worldVertex.copy(worldDirAndDist[2]);
        var vertex4 = new THREE.Vector4(worldVertex.x, worldVertex.y, worldVertex.z, 1);
        //console.log(vertex4);
        vertex4.applyMatrix4(matrix);
        console.log(vertex4);

        // var dir = [];
        // for(var i = 0; i < 4; i++){
        //     var ans = 0;
        //     for(var j = 0; j < 4; j++){
        //         ans = ans + matrix.elements[i*4 + j]*worldVertex[j];
        //     }
        //     dir.push(ans);
        // }
        // var dirFinal = new THREE.Vector3(dir[0], dir[1], dir[2]);
        //dirFinal.normalize();
        //console.log(camera[0].position);
        //console.log(dirFinal);
        return vertex4;
    }
    this.goAim = function (object, dir, dist, limitV, deltaV){
        var vo = object.velocity;
        var v = Math.sqrt(vo.x*vo.x+vo.y*vo.y+vo.z*vo.z);
        var dir_v = new THREE.Quaternion();
        dir_v.setFromEuler(new THREE.Euler(dir.x, dir.y, -1*dir.z));
        //console.log(vo);
        if(v < limitV){
            object.velocity.x = object.velocity.x + dir.x*deltaV;
            object.velocity.y = object.velocity.y + dir.y*deltaV;
            object.velocity.z = object.velocity.z + dir.z*deltaV;
        }
        else{
            if(vo.x < limitV*dir.x){
                object.velocity.x = object.velocity.x + Math.abs(dir.x*deltaV);
            }
            else{
                object.velocity.x = object.velocity.x - Math.abs(dir.x*deltaV);
            }
            if(vo.y < limitV*dir.y){
                object.velocity.y = object.velocity.y + Math.abs(dir.y*deltaV);
            }
            else{
                object.velocity.y = object.velocity.y - Math.abs(dir.y*deltaV);
            }
            if(vo.z < limitV*dir.z){
                object.velocity.z = object.velocity.z + Math.abs(dir.z*deltaV);
            }
            else{
                object.velocity.z = object.velocity.z - Math.abs(dir.z*deltaV);
            }
        }
        object.quaternion.copy(dir_v);
        //console.log(object.quaternion);
        return [dist, v];
    }
}
function rocketMove(){
    for(var i = 0; i < rocket.length; i++){
        var dd = move.dirToAim(rocketPhysic[i], playerPhysic[0]);
        var dir = dd[0], dist = dd[1];
        dist = move.goAim(rocketPhysic[i],dir,dist,100,5);
        //console.log(rocketPhysic[i].velocity);
        if(dist[0] < 55){
            scene[0].remove(rocket[i]);
            rocket[i].material.dispose();
            rocket[i].geometry.dispose();
            phyWorld[0].removeBody(rocketPhysic[i]);
        }
    }
}
function Physic(phyWorld, destinationPhysic, playerPhysic, rocket, rocketPhysic){
    this.init = function (){
        var world_new = new CANNON.World();
        phyWorld.push(world_new);
        phyWorld[0].gravity.set(0, 0, 0);
        //创建物理世界
        var destinationPhysic_new = new CANNON.Body({ //创建一个刚体（物理世界的刚体数据）
            mass: 0, //刚体的质量，这里单位为kg
            position: new CANNON.Vec3(destination[0].position.x, destination[0].position.y, destination[0].position.z), //刚体的位置，单位是米
            shape: new CANNON.Box(new CANNON.Vec3(50, 50, 50)), //刚体的形状（这里是立方体，立方体的参数是一个包含半长、半宽、半高的三维向量，具体我们以后会说）
            material: new CANNON.Material({friction: 0.05, restitution: 0}) //材质数据，里面规定了摩擦系数和弹性系数
        });
        destinationPhysic.push(destinationPhysic_new);
        phyWorld[0].addBody(destinationPhysic[0]);
        //创建物理destination
        var player_new = new CANNON.Body({ //创建一个刚体（物理世界的刚体数据）
            mass: 100, //刚体的质量，这里单位为kg
            position: new CANNON.Vec3(player[0].position.x, player[0].position.y, player[0].position.z), //刚体的位置，单位是米
            shape: new CANNON.Sphere(30),
            material: new CANNON.Material({friction: 10, restitution: 0}) //材质数据，里面规定了摩擦系数和弹性系数
        });
        playerPhysic.push(player_new);
        phyWorld[0].addBody(playerPhysic[0]);
        for(var i = 0; i < 40; i++){
            this.genRocket(randomRocket());
        }
    }
    this.freshPhysic = function (){
        var timeStep = 1.0 / 100.0;
        phyWorld[0].step(timeStep);

        destination[0].position.copy(destinationPhysic[0].position);
        destination[0].quaternion.copy(destinationPhysic[0].quaternion);//更新终点
        player[0].position.copy(playerPhysic[0].position);
        playerPhysic[0].quaternion.copy(player[0].quaternion);//更新playerPhysic

        for(var i = 0; i < bullet.length; i++){
            bullet[i].position.copy(bulletPhysics[i].position);
            bullet[i].quaternion.copy(bulletPhysics[i].quaternion);
        }
        for(i = 0; i < rocket.length; i++){
            // var dir = rocketPhysic[i].velocity;
            // var dir_v = new THREE.Quaternion();
            // dir_v.setFromEuler(new THREE.Euler(dir.x, dir.y, dir.z));
            // var rot = new THREE.Quaternion();
            // rot.setFromAxisAngle(new THREE.Vector3(-1,0,0), Math.PI/2);
            // dir_v.multiply(rot);
            // rocketPhysic[i].quaternion.copy(dir_v);
            rocket[i].position.copy(rocketPhysic[i].position);
            rocket[i].quaternion.copy(rocketPhysic[i].quaternion);
        }
        //console.log(destinationPhysic[0].position);
    }
    this.genRocket = function ([x,y,z]){
        var p = player[0].position;
        var dir = new THREE.Vector3(p.x-x, p.y-y, p.z-z);
        dir = dir.normalize();
        var geometry = new THREE.OctahedronGeometry(20);
        //var geometry = new THREE.CylinderGeometry(1, 5, 30, 30);
        var material = new THREE.MeshPhongMaterial({
            color: 0xff5809,
            shininess:50,
            specular: 0xffffff
        });
        mesh = new THREE.Mesh(geometry, material); //网格模型对象Mesh
        mesh.position.set(x,y,z);
        rocket.push(mesh);

        var Octahedron = OctahedronConvex();

        var body = new CANNON.Body({ //创建一个刚体（物理世界的刚体数据）
            mass: 20, //刚体的质量，这里单位为kg
            position: new CANNON.Vec3(x, y, z), //刚体的位置，单位是米
            shape: Octahedron,
            material: new CANNON.Material({friction: 0.05, restitution: 0}) //材质数据，里面规定了摩擦系数和弹性系数
        });
        rocketPhysic.push(body);
        body.velocity.copy(dir);
        //var euler = new THREE.Euler(dir.x, dir.y, dir.z);
        // var dir_v = new THREE.Quaternion();
        // dir_v.setFromEuler(new THREE.Euler(dir.x, dir.y, dir.z));
        // var rot = new THREE.Quaternion();
        // rot.setFromAxisAngle(new THREE.Vector3(-1,0,0), Math.PI/2);
        // dir_v.multiply(rot);
        // body.quaternion.copy(dir_v);
        // mesh.quaternion.copy(dir_v);

        scene[0].add(mesh);
        phyWorld[0].addBody(body);
    }
}
function moduleLoad(){
    var OBJLoaderP = new THREE.OBJLoader();//obj加载器
    var MTLLoaderP = new THREE.MTLLoader();//材质文件加载器
    MTLLoaderP.load('./player/SciFi_Fighter.mtl', function(materials) {
        OBJLoaderP.setMaterials(materials);
        OBJLoaderP.load('./player/SciFi_Fighter.obj', function(obj) {
            obj.scale.set(5, 5, 5); //放大obj组对象
            //console.log(obj);
            playerModule.push(obj);
            //player[0].rotateY(Math.PI);
            //player[0].quaternion.copy(camera[0].quaternion);
        });
    });

    var OBJLoaderC = new THREE.OBJLoader();//obj加载器
    var MTLLoaderC = new THREE.MTLLoader();//材质文件加载器
    MTLLoaderC.load('./Clouds.mtl', function(materials) {
        // 返回一个包含材质的对象MaterialCreator
        //obj的模型会和MaterialCreator包含的材质对应起来
        OBJLoaderC.setMaterials(materials);
        OBJLoaderC.load('./Clouds.obj', function(obj) {
            obj.scale.set(0.05, 0.05, 0.05); //放大obj组对象
            cloudModules.push(obj);
        });
    });
}
function throttle(fn, delay){
    let last = 0, timer = null;
    return function (){
        let context = this;
        let args = arguments;
        let now = +new Date();

        if(now - last < delay){
            clearTimeout(timer);
            timer = setTimeout(function (){
                last = now;
                fn.apply(context,args);
            },delay);
        }
        else {
            last = now;
            fn.apply(context,args);
        }
    }
}
function OctahedronConvex() {
    let points = [
        new CANNON.Vec3(20,0,0),
        new CANNON.Vec3(-20,0,0),
        new CANNON.Vec3(0,20,0),
        new CANNON.Vec3(0,-20,0),
        new CANNON.Vec3(0,0,20),
        new CANNON.Vec3(0,0,-20)
    ];
    let faces = [
        [0,4,3],
        [0,3,5],
        [0,2,4],
        [0,5,2],
        [1,3,4],
        [1,5,3],
        [1,4,2],
        [1,2,5]
    ];
    return new CANNON.ConvexPolyhedron(points, faces);
}
function render(){
    requestAnimationFrame(render);
    renderer[0].render(scene[0],camera[0]);//执行渲染操作
    renderer[1].render(scene[1],camera[1]);
}
function Engine(object, objectPhysic){
    this.init = function (){
        this.matrix = new THREE.Matrix4();
        this.matrix.copy(object.matrixWorld);
        this.dirx = new THREE.Vector4(1,0,0,1);
        this.diry = new THREE.Vector4(0,1,0,1);
        this.dirz = new THREE.Vector4(0,0,1,1);
        this.dirx.applyMatrix4(this.matrix);
        this.diry.applyMatrix4(this.matrix);
        this.dirz.applyMatrix4(this.matrix);
        var worldDirAndDist = move.dirToAim(scene[0], object), worldVertex = new THREE.Vector4(worldDirAndDist[2].x, worldDirAndDist[2].y, worldDirAndDist[2].z, 1);
        //console.log(worldVertex);
        this.dirx = new THREE.Vector4(this.dirx.x-worldVertex.x,this.dirx.y-worldVertex.y,this.dirx.z-worldVertex.z,this.dirx.w-worldVertex.w);
        this.diry = new THREE.Vector4(this.diry.x-worldVertex.x,this.diry.y-worldVertex.y,this.diry.z-worldVertex.z,this.diry.w-worldVertex.w);
        this.dirz = new THREE.Vector4(this.dirz.x-worldVertex.x,this.dirz.y-worldVertex.y,this.dirz.z-worldVertex.z,this.dirz.w-worldVertex.w);
        var vo = objectPhysic.velocity;// v = Math.sqrt(vo.x*vo.x+vo.y*vo.y+vo.z*vo.z);

        var base = this.dirx.x*this.dirx.x + this.dirx.y*this.dirx.y + this.dirx.z*this.dirx.z;
        var dotM = this.dirx.x*vo.x + this.dirx.y*vo.y + this.dirx.z*vo.z;
        this.vOfx = dotM/base;

        base = this.diry.x*this.diry.x + this.diry.y*this.diry.y + this.diry.z*this.diry.z;
        dotM = this.diry.x*vo.x + this.diry.y*vo.y + this.diry.z*vo.z;
        this.vOfy = dotM/base;

        base = this.dirz.x*this.dirz.x + this.dirz.y*this.dirz.y + this.dirz.z*this.dirz.z;
        dotM = this.dirz.x*vo.x + this.dirz.y*vo.y + this.dirz.z*vo.z;
        this.vOfz = dotM/base;
        //console.log(this.dirx, this.diry, this.dirz);
    }
    this.nZ = function (vMax, vDelta){
        this.init();
        var dir = new THREE.Vector3(-1*this.dirz.x, -1*this.dirz.y, -1*this.dirz.z);
        if((vMax === 0) && (Math.abs(this.vOfz) < 5)){
            if(Math.abs(this.vOfz) > 1){
                if(this.vOfz > 0){
                    objectPhysic.velocity.x = objectPhysic.velocity.x + dir.x*Math.abs(this.vOfz);
                    objectPhysic.velocity.y = objectPhysic.velocity.y + dir.y*Math.abs(this.vOfz);
                    objectPhysic.velocity.z = objectPhysic.velocity.z + dir.z*Math.abs(this.vOfz);
                }
                else {
                    objectPhysic.velocity.x = objectPhysic.velocity.x - dir.x*Math.abs(this.vOfz);
                    objectPhysic.velocity.y = objectPhysic.velocity.y - dir.y*Math.abs(this.vOfz);
                    objectPhysic.velocity.z = objectPhysic.velocity.z - dir.z*Math.abs(this.vOfz);
                }
            }
        }
        else {
            if(Math.abs(this.vOfz - (-1*vMax)) > 5){
                if(this.vOfz > -1*vMax){
                    objectPhysic.velocity.x = objectPhysic.velocity.x + dir.x*vDelta;
                    objectPhysic.velocity.y = objectPhysic.velocity.y + dir.y*vDelta;
                    objectPhysic.velocity.z = objectPhysic.velocity.z + dir.z*vDelta;
                }
                else {
                    objectPhysic.velocity.x = objectPhysic.velocity.x - dir.x*vDelta;
                    objectPhysic.velocity.y = objectPhysic.velocity.y - dir.y*vDelta;
                    objectPhysic.velocity.z = objectPhysic.velocity.z - dir.z*vDelta;
                }
            }
        }
    }
    this.pZ = function (vMax, vDelta){
        this.init();
        var dir = new THREE.Vector3(this.dirz.x, this.dirz.y, this.dirz.z);
        if(Math.abs(this.vOfz - vMax) > 5){
            if(this.vOfz < vMax){
                objectPhysic.velocity.x = objectPhysic.velocity.x + dir.x*vDelta;
                objectPhysic.velocity.y = objectPhysic.velocity.y + dir.y*vDelta;
                objectPhysic.velocity.z = objectPhysic.velocity.z + dir.z*vDelta;
            }
            else {
                objectPhysic.velocity.x = objectPhysic.velocity.x - dir.x*vDelta;
                objectPhysic.velocity.y = objectPhysic.velocity.y - dir.y*vDelta;
                objectPhysic.velocity.z = objectPhysic.velocity.z - dir.z*vDelta;
            }
        }
    }
    this.nX = function (vMax, vDelta){
        this.init();
        var dir = new THREE.Vector3(-1*this.dirx.x, -1*this.dirx.y, -1*this.dirx.z);
        if((vMax === 0) && (Math.abs(this.vOfx) < 5)){
            if(Math.abs(this.vOfx) > 1){
                if(this.vOfx > 0){
                    objectPhysic.velocity.x = objectPhysic.velocity.x + dir.x*Math.abs(this.vOfx);
                    objectPhysic.velocity.y = objectPhysic.velocity.y + dir.y*Math.abs(this.vOfx);
                    objectPhysic.velocity.z = objectPhysic.velocity.z + dir.z*Math.abs(this.vOfx);
                }
                else {
                    objectPhysic.velocity.x = objectPhysic.velocity.x - dir.x*Math.abs(this.vOfx);
                    objectPhysic.velocity.y = objectPhysic.velocity.y - dir.y*Math.abs(this.vOfx);
                    objectPhysic.velocity.z = objectPhysic.velocity.z - dir.z*Math.abs(this.vOfx);
                }
            }
        }
        else {
            if(Math.abs(this.vOfx - (-1*vMax)) > 5){
                if(this.vOfx > -1*vMax){
                    objectPhysic.velocity.x = objectPhysic.velocity.x + dir.x*vDelta;
                    objectPhysic.velocity.y = objectPhysic.velocity.y + dir.y*vDelta;
                    objectPhysic.velocity.z = objectPhysic.velocity.z + dir.z*vDelta;
                }
                else {
                    objectPhysic.velocity.x = objectPhysic.velocity.x - dir.x*vDelta;
                    objectPhysic.velocity.y = objectPhysic.velocity.y - dir.y*vDelta;
                    objectPhysic.velocity.z = objectPhysic.velocity.z - dir.z*vDelta;
                }
            }
        }
    }
    this.pX = function (vMax, vDelta){
        this.init();
        var dir = new THREE.Vector3(this.dirx.x, this.dirx.y, this.dirx.z);
        if(Math.abs(this.vOfx - vMax) > 5){
            if(this.vOfx < vMax){
                objectPhysic.velocity.x = objectPhysic.velocity.x + dir.x*vDelta;
                objectPhysic.velocity.y = objectPhysic.velocity.y + dir.y*vDelta;
                objectPhysic.velocity.z = objectPhysic.velocity.z + dir.z*vDelta;
            }
            else {
                objectPhysic.velocity.x = objectPhysic.velocity.x - dir.x*vDelta;
                objectPhysic.velocity.y = objectPhysic.velocity.y - dir.y*vDelta;
                objectPhysic.velocity.z = objectPhysic.velocity.z - dir.z*vDelta;
            }
        }
    }
    this.pY = function (vMax, vDelta){
        this.init();
        var dir = new THREE.Vector3(this.diry.x, this.diry.y, this.diry.z);
        if((vMax === 0) && (Math.abs(this.vOfy) < 5)){
            if(Math.abs(this.vOfy) > 1){
                if(this.vOfy > 0){
                    objectPhysic.velocity.x = objectPhysic.velocity.x - dir.x*Math.abs(this.vOfy);
                    objectPhysic.velocity.y = objectPhysic.velocity.y - dir.y*Math.abs(this.vOfy);
                    objectPhysic.velocity.z = objectPhysic.velocity.z - dir.z*Math.abs(this.vOfy);
                }
                else {
                    objectPhysic.velocity.x = objectPhysic.velocity.x + dir.x*Math.abs(this.vOfy);
                    objectPhysic.velocity.y = objectPhysic.velocity.y + dir.y*Math.abs(this.vOfy);
                    objectPhysic.velocity.z = objectPhysic.velocity.z + dir.z*Math.abs(this.vOfy);
                }
            }
        }
        else {
            if(this.vOfy < vMax){
                objectPhysic.velocity.x = objectPhysic.velocity.x + dir.x*vDelta;
                objectPhysic.velocity.y = objectPhysic.velocity.y + dir.y*vDelta;
                objectPhysic.velocity.z = objectPhysic.velocity.z + dir.z*vDelta;
            }
            else {
                objectPhysic.velocity.x = objectPhysic.velocity.x - dir.x*vDelta;
                objectPhysic.velocity.y = objectPhysic.velocity.y - dir.y*vDelta;
                objectPhysic.velocity.z = objectPhysic.velocity.z - dir.z*vDelta;
            }
        }
    }
}
function keyMotion(){
    // var dir = new THREE.Vector3();
    // camera[0].getWorldDirection(dir);
    if(keyCode[87] || keyCode[83]){//按下W
        //console.log(playerPhysic[0]);
        if(keyCode[87] && !keyCode[83]){
            if(keyCode[32] && (moveEnergy >= 0)){
                engine.nZ(vOfPlayer[0],10);
                moveEnergy = moveEnergy -1;
            }
            else {
                engine.nZ(vOfPlayer[1],7);
            }
        }
        if(keyCode[83] && !keyCode[87]){//按下S
            engine.pZ(vOfPlayer[2],4);
        }
    }
    else {
        engine.nZ(0,1);
        //move.goAim(playerPhysic[0], dir, null, 0, 1);
    }
    if(keyCode[65] || keyCode[68]){
        if(keyCode[65] && !keyCode[68]){
            engine.nX(vOfPlayer[2],4);
        }//按下A
        if(keyCode[68] && !keyCode[65]){
            engine.pX(vOfPlayer[2],4);
        }//按下D
    }
    else {
        engine.nX(0,1);
    }
    engine.pY(0,1);
    if(keyCode[81]){
        //player[0].rotateZ(-0.01);
        camera[0].rotateZ(-0.01);
        // console.log(player[0]);
        // console.log(camera[0]);
    }//按下Q
    if(keyCode[69]){
        //player[0].rotateZ(0.01);
        camera[0].rotateZ(0.01);
    }//按下E
    // if(keyCode[82]){
    //     player[0].rotation.z = 0;
    //     camera[0].rotation.z = 0;
    // }//按下R

    if((moveEnergy < moveEnergyMax) && (!keyCode[32] || !keyCode[87])){
        moveEnergy = moveEnergy + 0.5;
    }

    engine.init();
    cameraBehind(-150, -40, engine.vOfx, camera[0], playerPhysic[0]);

    var rot = new THREE.Quaternion(), dirCamera = new THREE.Quaternion();
    dirCamera.copy(camera[0].quaternion);
    rot.setFromAxisAngle(new THREE.Vector3(0,1,0), Math.PI);
    dirCamera.multiply(rot);
    player[0].quaternion.copy(dirCamera);
    //camera[0].translateZ(500);
    //camera[0].lookAt(player[0].position);
    //camera[0].translateY(500);
}
function cameraBehind(x, y, moveSlide, camera, player){
    var slideSide1 = 30, slideSide2 = 45, lenSlide;
    if(Math.abs(moveSlide) < vOfPlayer[2]){
        lenSlide = (moveSlide/vOfPlayer[2])*slideSide1;
    }
    else {
        lenSlide = slideSide1 + slideSide2*((moveSlide - vOfPlayer[2])/200);
        if(moveSlide < 0){
            lenSlide = -1*lenSlide;
        }
    }
    var poC = camera.position, poP = player.position;
    var matrix = new THREE.Matrix4();
    matrix.copy(camera.matrixWorld);
    var dir = new THREE.Vector4(lenSlide,y,x,1);
    dir.applyMatrix4(matrix);
    dir = new THREE.Vector3(dir.x - poC.x, dir.y - poC.y, dir.z - poC.z);
    //console.log(dir);

    camera.position.x = poP.x - dir.x;
    camera.position.y = poP.y - dir.y;
    camera.position.z = poP.z - dir.z;
}
function arriveDestination(env){
    if(Math.abs(player[0].position.x - destination[0].position.x) < 50 ){
        if(Math.abs(player[0].position.y - destination[0].position.y) < 50 ){
            if(Math.abs(player[0].position.z - destination[0].position.z) < 50 ){
                env.fresh();
                document.getElementById("inf").style.color = "#ffffff";
                score[1] = score[0];
            }
        }
    }
}
function freshUI(){
    var pct = 172.7 - (moveEnergy/moveEnergyMax)*172.7;
    //console.log(document.getElementById("energy"));
    document.getElementById("energy").setAttribute('stroke-dashoffset',pct);
}
function freshAll(env, physic, map){
    if(!loading){
        keyMotion();
        rocketMove();
        map.fresh();
        physic.freshPhysic();
        arriveDestination(env);
        limitInBox(destinationPhysic[0]);
        freshUI();
    }
}