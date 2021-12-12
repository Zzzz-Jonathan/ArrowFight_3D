import {Geometry} from "./Geometry.js";
import {State} from "./state.js"
import {TrainingModel} from "./trainingModel.js";

init();

function init(){
    var mapSize = [5000,5000,5000], cameraSize = 20000, keyCode = [], mouseCode = [], EnergyMax = 400, mouseClickTime = 0, loading = true, crystalNum = 5, vOfPlayer = [200,130,60], aOfPlayer = [10,5,5], catchedtime = +new Date(), rayDist = 3000;//
    var trainingModel = false, autoAction = [], gameTime = 180000;
    var scene = [], destination = [], camera = [], renderer = [], phyWorld = [], destinationPhysic = [], timeCloud = [], timeCloudMap = [], player = [], playerPhysic = [], rocket = [], rocketPhysic = [], bullet = [], bulletPhysic = [], toxicPhysic = [];
    var crystal = [], crystalPhysic = [];
    var playerModule = [], cloudModules = [], texture = [], blackholeModules = [];

    function Env(scene,destination,camera,renderer,timeCloud,player,crystal){
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
            point.position.set(100,100,100); //点光源位置
            point.visible = true;
            scene[0].add(point);
            //点光源添加到场景中
            this.timeCloud();//生成时间云
            var bgGeometry = new THREE.SphereGeometry(10000, 50, 50);
            bgGeometry.scale(-1, 1, 1);
            let bgMaterial = new THREE.MeshBasicMaterial({map: texture[0]});
            this.bgsphere = new THREE.Mesh(bgGeometry, bgMaterial);
            scene[0].add(this.bgsphere);//天空球
            //player[0].material.map = texture[1]; //整活小车代码
            //this.genToxicCloud();
            //scene[0].add(blackholeModules[0]);
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

            var mesh = new THREE.Mesh( geometry, material);
            mesh.uid = idGenerator.gen("destination");
            mesh.name = "destination";
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
            var pos = freshInMap();
            destinationPhysic[0].position.set(pos[0], pos[1], pos[2]);
            //在map的范围内随机移动了destination
            for(var i = 0; i < timeCloud.length; i++){
                pos = freshInMap();
                timeCloud[i].position.set(pos[0], pos[1], pos[2]);
            }

            for(var i = 0; i < crystal.length; i++){
                pos = freshInMap();
                crystalPhysic[i].position.set(pos[0], pos[1], pos[2]);
            }

            document.getElementById("inf").style.color = "#ffffff";
            //score[1] = score[0];
            destinationPhysic[0].collisionMaskGroup = 1;
            destinationPhysic[0].collisionFilterGroup = 1;

            var num = crystal.length;
            for(var i = 0; i < crystalNum - num; i++){
                enemyGenerator.genCrystal(crystal, crystalPhysic, freshInMap());
                scene[1].add(map.crystal[i]);
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
            player[0].uid = idGenerator.gen("player");
            //console.log();
            //player[0].children[0].material.wireframe = true;

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
                timeCloud[i].material.side = THREE.DoubleSide;
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
        this.genToxicCloud = function(){
            this.toxic = [];
            var p = 0.2;
            for(var i = 0; i < timeCloud.length; i++){
                if(Math.random() < p){
                    this.toxic[i] = true;
                    if(toxicPhysic[i] == null){
                        toxicPhysic[i] = G2B.toB(timeCloud[i].geometry);
                        toxicPhysic[i].collisionResponse = 0;
                    }
                    toxicPhysic[i].position.copy(timeCloud[i].position);
                    toxicPhysic[i].quaternion.copy(timeCloud[i].quaternion);
                    //i号云mesh变成绿色
                    timeCloud[i].material.color.set(0xadffad);
                }
                else {
                    this.toxic[i] = false;
                }
            }
        }
    }
    function Player(playermodule, camera, playerP){
        this.playermodule = playermodule;
        this.camera = camera;
        this.playerP = playerP;

        this.shoot = function(t){
            //console.log(this.camera);
            var po = this.camera.position.clone(), ro = new THREE.Vector3();
            this.camera.getWorldDirection(ro);
            po.add(ro.multiplyScalar(250));
            this.camera.getWorldDirection(ro);
            //console.log(player[0].position, po)
            weapon.bullet(po, ro, t);
        }
        this.launchRocket = function (aim){
            var po = this.playermodule.position.clone(), ro = new THREE.Vector3();
            this.camera.getWorldDirection(ro);
            po.add(ro.multiplyScalar(100));
            weapon.rocket([po.x, po.y, po.z], aim);
        }
        this.reset = function (){
            //this.camera.lookAt(new THREE.Vector3(0,0,-1));
            this.playerP.position.set(0,0,0);
            this.playerP.velocity.set(0,0,0);
            this.playerP.energy = EnergyMax;
        }
    }
    function Enemy(){
        this.init = function (){
            for(var i = 0; i < crystalNum; i++){
                enemyGenerator.genCrystal(crystal,crystalPhysic, freshInMap());
            }
        }
        this.genCrystal = function (crystal, crystalPhysic, [posx, posy, posz]){
            var triangles = 640;

            var geometry = new THREE.BufferGeometry();
            var positions = new Float32Array( triangles * 3 * 3);
            var normals = new Float32Array( triangles * 3 * 3);
            var colors = new Float32Array( triangles * 3 * 3);

            var color = new THREE.Color();

            var n = 200, n2 = n/2;
            var d = 50, d2 = d/2;

            var pA = new THREE.Vector3();
            var pB = new THREE.Vector3();
            var pC = new THREE.Vector3();

            var cb = new THREE.Vector3();
            var ab = new THREE.Vector3();

            for( var i = 0; i < positions.length; i += 9 ) {
                var x = Math.random() * n - n2;
                var y = Math.random() * (n2 - Math.abs(x));
                if(Math.random() < 0.5){
                    y = -1*y;
                }
                var z = Math.random() * (n2 - Math.abs(x) - Math.abs(y));
                if(Math.random() < 0.5){
                    z = -1*z;
                }

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
            //console.log(colors);

            geometry.setAttribute('position', new THREE.BufferAttribute( positions, 3));
            geometry.setAttribute('normal', new THREE.BufferAttribute( normals, 3));
            geometry.setAttribute('color', new THREE.BufferAttribute( colors, 3));
            geometry.colorOrgin = colors;

            geometry.computeBoundingSphere();

            var material = new THREE.MeshPhongMaterial({
                color : 0xaaaaaa, ambient : 0xaaaaaa, specular : 0xffffff, shininess : 250,
                side : THREE.DoubleSide, vertexColors : THREE.VertexColors
            });

            var mesh = new THREE.Mesh( geometry, material);
            mesh.position.set(posx, posy, posz);
            mesh.name = "crystal";
            mesh.uid = idGenerator.gen("crystal");
            
            var body = genHitpointObject(mesh.uid, mesh.name, 0, 1000, 1000, mesh.position, "box");
            

            scene[0].add(mesh);
            phyWorld[0].addBody(body);
            crystal.push(mesh);
            crystalPhysic.push(body);
        }
        this.fadeWithHp = function (id){
            var obj = getObject(id);
            var health = obj[1].hitpoint/obj[1].hitpointMax;
            var zeroLength = Math.ceil(health*obj[0].geometry.colorOrgin.length/3);
            var colorNew = new Float32Array( obj[0].geometry.colorOrgin.length), color = new THREE.Color();
            for(var i = 0; i < obj[0].geometry.colorOrgin.length; i += 3){
                if(i > zeroLength){
                    color.setRGB(0.3, 0.3, 0.3);
                    colorNew[i] = color.r;
                    colorNew[i+1] = color.g;
                    colorNew[i+2] = color.b;
                }
                else {
                    color.setRGB(obj[0].geometry.colorOrgin[i], obj[0].geometry.colorOrgin[i+1], obj[0].geometry.colorOrgin[i+2]);
                    colorNew[i] = color.r;
                    colorNew[i+1] = color.g;
                    colorNew[i+2] = color.b;
                }
            }
            obj[0].geometry.setAttribute('color', new THREE.BufferAttribute( colorNew, 3));
        }
    }
    function freshInMap(){
        var x = Math.random()*mapSize[0]-0.5*mapSize[0], y = Math.random()*mapSize[1]-0.5*mapSize[1], z = Math.random()*mapSize[2]-0.5*mapSize[2];
        return [x, y, z];
    }
    function IdGenerator(){
        this.destination = [0,0,9];
        this.player = [10,10,19];
        this.bullet = [400,400,799];
        this.rocket = [800,800,899];
        this.crystal = [50,50,59];
        this.gen = function (type){
            if(type === "destination"){
                this.destination[0] = this.destination[0] + 1;
                if(this.destination[0] > this.destination[2]){
                    this.destination[0] = this.destination[0] - (this.destination[2] - this.destination[1] + 1);
                }
                return this.destination[0];
            }
            if(type === "player"){
                this.player[0] = this.player[0] + 1;
                if(this.player[0] > this.player[2]){
                    this.player[0] = this.player[0] - (this.player[2] - this.player[1] + 1);
                }
                return this.player[0];
            }
            if(type === "bullet"){
                this.bullet[0] = this.bullet[0] + 1;
                if(this.bullet[0] > this.bullet[2]){
                    this.bullet[0] = this.bullet[0] - (this.bullet[2] - this.bullet[1] + 1);
                }
                return this.bullet[0];
            }
            if(type === "rocket"){
                this.rocket[0] = this.rocket[0] + 1;
                if(this.rocket[0] > this.rocket[2]){
                    this.rocket[0] = this.rocket[0] - (this.rocket[2] - this.rocket[1] + 1);
                }
                return this.rocket[0];
            }
            if(type === "crystal"){
                this.crystal[0] = this.crystal[0] + 1;
                if(this.crystal[0] > this.crystal[2]){
                    this.crystal[0] = this.crystal[0] - (this.crystal[2] - this.crystal[1] + 1);
                }
                return this.crystal[0];
            }
        }
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
            this.crystal = [];
            var map = new THREE.Scene();
            scene.push(map);
            // var geometry = new THREE.SphereGeometry(60, 40, 40); //创建一个球体几何对象
            for(var i = 0; i < crystal.length; i++){
                var geometryc = new THREE.OctahedronGeometry(4);
                var materialc = new THREE.MeshLambertMaterial({
                    color: 0xff00ff
                }); //材质对象Material
                var mesh = new THREE.Mesh(geometryc, materialc);
                scene[1].add(mesh);
                this.crystal.push(mesh);
            }
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
            //console.log(geometry3);
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

            for(var i = 0; i < this.crystal.length; i++){
                //console.log(crystal[i]);
                if(i < crystal.length){
                    var mcx = (crystal[i].position.x/mapSize[0])*this.miniMapSize[0], mcy = (crystal[i].position.y/mapSize[1])*this.miniMapSize[1], mcz = (crystal[i].position.z/mapSize[2])*this.miniMapSize[2];
                    this.crystal[i].position.set(mcx, mcy, mcz);
                }
                else {
                    scene[1].remove(this.crystal[i]);
                }
            }

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
    function randomRocket(){
        var max = 2000, min =700;
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
        this.dist = function (object, aim){
            var dx = aim.position.x - object.position.x, dy = aim.position.y - object.position.y, dz = aim.position.z - object.position.z;
            return Math.sqrt(dx*dx+dy*dy+dz*dz);
        }
        this.dirToAimRelative = function(object, aim1, aim2){
            var matrix = new THREE.Matrix4();
            matrix.copy(object.matrixWorldInverse);
            //object.matrixWorldInverse.multiplyMatrices(object.matrixWorld,matrix);
            //console.log(matrix.elements);
            //matrix.transpose(matrix);
            var worldDirAndDist = this.dirToAim(aim1, aim2), worldVertex = new THREE.Vector3();
            worldVertex.copy(worldDirAndDist[2]);
            var vertex4 = new THREE.Vector4(worldVertex.x, worldVertex.y, worldVertex.z, 1);
            vertex4.applyMatrix4(matrix);
            var dir = new THREE.Vector3(vertex4.x, vertex4.y, vertex4.z);
            dir.normalize();
            //console.log(Math.tan(Math.PI/3));

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
            return dir;
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
    function rayCaster(posV2, dist){
        var raycaster = new THREE.Raycaster();//光线投射器
        raycaster.far = rayDist;
        console.log(raycaster);
        raycaster.setFromCamera(posV2, camera[0]);
        var intersects = raycaster.intersectObjects(scene[0].children);
        //console.log(intersects);
        if (intersects.length > 0) {
            for(var i = 0; i < intersects.length; i++){
                if(intersects[i].distance < dist){
                    var name = intersects[i].object.name;
                    if(name === "destination" || name === "rocket" || name === "crystal"){
                        //console.log("catched!");
                        return intersects[i].object;
                    }
                }
            }
        }
    }
    function Physic(phyWorld, destinationPhysic, playerPhysic, rocket, rocketPhysic,crystal,crystalPhysic){
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
            //console.log(destination[0].id);
            destinationPhysic_new.id = destination[0].uid;
            destinationPhysic.push(destinationPhysic_new);
            phyWorld[0].addBody(destinationPhysic[0]);
            //创建物理destination
            var player_new = new CANNON.Body({ //创建一个刚体（物理世界的刚体数据）
                mass: 100, //刚体的质量，这里单位为kg
                position: new CANNON.Vec3(player[0].position.x, player[0].position.y, player[0].position.z), //刚体的位置，单位是米
                shape: new CANNON.Sphere(30),
                material: new CANNON.Material({friction: 10, restitution: 0}) //材质数据，里面规定了摩擦系数和弹性系数
            });
            player_new.id = player[0].uid;
            player_new.energy = EnergyMax;
            playerPhysic.push(player_new);
            phyWorld[0].addBody(playerPhysic[0]);
        }
        this.freshPhysic = function (){
            var timeStep = 1.0 / 100.0;
            phyWorld[0].step(timeStep);

            destination[0].position.copy(destinationPhysic[0].position);
            destination[0].quaternion.copy(destinationPhysic[0].quaternion);//更新终点
            player[0].position.copy(playerPhysic[0].position);
            playerPhysic[0].quaternion.copy(player[0].quaternion);//更新playerPhysic

            for(var i = 0; i < bullet.length; i++){
                bullet[i].position.copy(bulletPhysic[i].position);
                bullet[i].quaternion.copy(bulletPhysic[i].quaternion);
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
            for(i = 0; i < crystal.length; i++){
                crystal[i].position.copy(crystalPhysic[i].position);
                crystal[i].quaternion.copy(crystalPhysic[i].quaternion);
            }
            //console.log(destinationPhysic[0].position);
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

        // var STLLoaderP = new THREE.STLLoader();//stl加载器
        // STLLoaderP.load('./SantaFe.stl', function(obj) {
        //     var material = new THREE.MeshPhongMaterial({
        //         color: 0x00aa00,
        //         shininess:50,
        //         specular: 0xddffdd
        //     });
        //     var mesh = new THREE.Mesh(obj, material);
        //     mesh.scale.set(0.7, 0.7, 0.7);
        //     playerModule.push(mesh);
        // }); //整活小车代码

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

        var textureB = new THREE.TextureLoader().load('./space.jpg');
        texture.push(textureB);
        var textureC = new THREE.TextureLoader().load('./space2.jpg');
        texture.push(textureC);


        // var FBXLoaderB = new THREE.FBXLoader();
        // FBXLoaderB.load("./blackhole.fbx",function (obj){
        //     //console.log(obj);
        //     // for(var i = 0; i < obj.children.length; i++){
        //     //     obj.children[i].material.side = THREE.DoubleSide;
        //     // }
        //     //console.log(obj);
        //     obj.scale.set(100,100,100);
        //     blackholeModules.push(obj);
        // });
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
    function deepClone(object){
        let target = null;
		if(object.type === 'Mesh' || object.type === 'Sprite'){
			target =  new THREE.Mesh(object.geometry.clone(false), object.material.clone(false) );
		}
        else{				
            target = object.clone( false );
		}
			
		target.name = object.name;

		target.position.x = object.position.x;
		target.position.y = object.position.y;
		target.position.z = object.position.z; 

		target.rotation.x = object.rotation.x;
		target.rotation.y = object.rotation.y;
        target.rotation.z = object.rotation.z;
 
		target.scale.x = object.scale.x;
    	target.scale.y = object.scale.y;
		target.scale.z = object.scale.z;

		if(object.children && object.children.length > 0){
 
			object.children.forEach( child => {
                target.add( this.deepClone(child) );
			});
		}
 
		return target; 
    }
    function FromGemotryToBody(){
        this.toB = function(geometry){
            var GG = new Geometry;
            var geometry = GG.fromBufferGeometry(geometry);
            //console.log(gg);
            let vertices = [];
            let faces = [];
            for(let i=0; i<geometry.vertices.length; i++) {
                vertices.push(new CANNON.Vec3(geometry.vertices[i].x, geometry.vertices[i].y, geometry.vertices[i].z));
            }
            for(let i=0; i<geometry.faces.length; i++) {
                faces.push([geometry.faces[i].a, geometry.faces[i].b, geometry.faces[i].c]);
            }
            return new CANNON.ConvexPolyhedron(vertices, faces);
        }
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
            if((vMax === 0) && (Math.abs(this.vOfx) < (vDelta/2+1))){
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
                if(Math.abs(this.vOfx - (-1*vMax)) > (vDelta/2+1)){
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
            if(Math.abs(this.vOfx - vMax) > (vDelta/2+1)){
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
        if(trainingModel === true) {
            trainM.actionToKey(autoAction, mouseCode, keyCode);
            let cR = trainM.actionToMouse(autoAction), k = 3;

            camera[0].rotateY(cR[0]/k);
            camera[0].rotateX(cR[1]/k);
            //console.log(cR);
        }
        // var dir = new THREE.Vector3();
        // camera[0].getWorldDirection(dir);
        if(mouseCode[0]){
            var t = new Date() - mouseClickTime;
            if(t > 300 && playerPhysic[0].energy > 0){
                mouseClickTime = new Date();
                playerOption.shoot();
                playerPhysic[0].energy = playerPhysic[0].energy - 5;
            }
        }

        if(keyCode[87] || keyCode[83]){//按下W
            //console.log(playerPhysic[0]);
            if(keyCode[87] && !keyCode[83]){
                if(keyCode[32] && (playerPhysic[0].energy >= 0)){
                    engine.nZ(vOfPlayer[0],aOfPlayer[0]);
                    playerPhysic[0].energy = playerPhysic[0].energy -1;
                }
                else {
                    engine.nZ(vOfPlayer[1],aOfPlayer[1]);
                }
            }
            if(keyCode[83] && !keyCode[87]){//按下S
                engine.pZ(vOfPlayer[2],4);
            }
        }
        else {
            engine.nZ(0,0.5);
            //move.goAim(playerPhysic[0], dir, null, 0, 1);
        }
        if(keyCode[65] || keyCode[68]){
            if(keyCode[65] && !keyCode[68]){
                engine.nX(vOfPlayer[2],aOfPlayer[2]);
            }//按下A
            if(keyCode[68] && !keyCode[65]){
                engine.pX(vOfPlayer[2],aOfPlayer[2]);
            }//按下D
        }
        else {
            engine.nX(0,0.5);
        }
        engine.pY(0,0.5);
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
        if(keyCode[82]){

        }//按下R
        if(keyCode[67]){
            let last = +new Date();
            if(last - catchedtime > 1000){
                catchedtime = last;
                //physic.genRocket([0,0,-1000]);
                ui.catchShowPosition();
            }
        }//按下C

        if((playerPhysic[0].energy < EnergyMax) && (!keyCode[32] || !keyCode[87]) && (!mouseCode[0] && new Date() - mouseClickTime > 500)){
            playerPhysic[0].energy = playerPhysic[0].energy + 0.5;
        }

        engine.init();
        //cameraBehind(-150, -40, engine.vOfx, camera[0], playerPhysic[0]);
        cameraBehind(-200, -30, engine.vOfx, engine.vOfy, camera[0], playerPhysic[0]); //整活小车代码

        var rot = new THREE.Quaternion(), dirCamera = new THREE.Quaternion();
        dirCamera.copy(camera[0].quaternion);

        rot.setFromAxisAngle(new THREE.Vector3(0,1,0), Math.PI); //飞机旋转角度
        // var rot2 = new THREE.Quaternion();
        // rot.setFromAxisAngle(new THREE.Vector3(-1,0,0), Math.PI/2);
        // rot2.setFromAxisAngle(new THREE.Vector3(0,0,-1), Math.PI/2);
        // rot.multiply(rot2); //整活小车旋转代码

        dirCamera.multiply(rot);
        player[0].quaternion.copy(dirCamera);
        //camera[0].translateZ(500);
        //camera[0].lookAt(player[0].position);
        //camera[0].translateY(500);
    }
    function AI(){
        this.nextStep = function () {

        }
    }
    function Weapon(){
        this.bullet = function (position, direction, t){
            var vset = 3000, tset = 10000;
            var geometry = new THREE.CylinderGeometry(1, 5, 10, 30);
            var material = new THREE.MeshLambertMaterial({
                color: 0xc0c0c0
            });
            var bullet_new = new THREE.Mesh(geometry, material); //网格模型对象Mesh
            bullet_new.position.set(position.x, position.y, position.z);
            bullet_new.uid = idGenerator.gen("bullet");
            bullet_new.name = 'bullet';
            //生成bullet图像，并初始化位置

            var body = genDamageObject(bullet_new.uid, bullet_new.name, 100, position, "ball");

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

            //console.log(direction);
            scene[0].add(bullet_new);
            phyWorld[0].addBody(body);
            bullet.push(bullet_new);
            bulletPhysic.push(body);

            //console.log(bullet_new.uid);

            var timer = setTimeout(function(){
                var outBullet = bullet.shift();
                var outBulletBody = bulletPhysic.shift();
                deletObject(outBulletBody, false);
            },tset);

            body.timer = timer;
        }
        this.rocket = function ([x, y, z], aimid){
            var tset = 20000;
            //var geometry = new THREE.OctahedronGeometry(20);
            var geometry = new THREE.SphereGeometry(20,2,2);
            var material = new THREE.MeshPhongMaterial({
                color: 0xff5809,
                shininess:50,
                specular: 0xff2222
            });
            var mesh = new THREE.Mesh(geometry, material); //网格模型对象Mesh
            //console.log(mesh);
            mesh.position.set(x,y,z);
            mesh.uid = idGenerator.gen("rocket");
            mesh.name = "rocket";
            rocket.push(mesh);

            var body = genDamageObject(mesh.uid, mesh.name, 500, mesh.position, "box");
            body.aimid = aimid;
            //console.log(body.position);
            rocketPhysic.push(body);
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

            //console.log(body.id);

            var timer = setTimeout(function(){
                var outRocket = rocket.shift();
                var outRocketBody = rocketPhysic.shift();
                deletObject(outRocketBody, false);
            },tset);

            //console.log(timer);
            body.timer = timer;
            //console.log(body.timer);
        }
        this.rocketMove = function (){
            for(var i = 0; i < rocket.length; i++){
                var obj = getObject(rocketPhysic[i].aimid);
                //console.log(obj);
                if(obj[1] !== undefined){
                    var dd = move.dirToAim(rocketPhysic[i], obj[1]);
                    var dir = dd[0], dist = dd[1];
                    dist = move.goAim(rocketPhysic[i],dir,dist,400,2);
                    //console.log(rocketPhysic[i].velocity);
                    //日后可以在这里增加爆炸效果
                }
                else {
                    deletObject(rocketPhysic[i], true);
                    //console.log(rocket.length,rocketPhysic.length);
                }
            }
        }
    }
    function genDamageObject(id, name, damage, pos, type){
        if(type === "ball"){
            var body = new CANNON.Body({ //创建一个刚体（物理世界的刚体数据）
                mass: 10, //刚体的质量，这里单位为kg
                position: new CANNON.Vec3(pos.x, pos.y, pos.z), //刚体的位置，单位是米
                shape: new CANNON.Sphere(5),
                material: new CANNON.Material({friction: 0.01, restitution: 0}) //材质数据，里面规定了摩擦系数和弹性系数
            });

            body.name = name;
            body.id = id;
            body.damage = damage;
            //console.log(body);
            return body;
        }
        if(type === "box"){
            var body = new CANNON.Body({ //创建一个刚体（物理世界的刚体数据）
                mass: 10, //刚体的质量，这里单位为kg
                position: new CANNON.Vec3(pos.x, pos.y, pos.z), //刚体的位置，单位是米
                shape: new CANNON.Box(new CANNON.Vec3(15, 15, 15)), //刚体的形状（这里是立方体，立方体的参数是一个包含半长、半宽、半高的三维向量，具体我们以后会说）
                material: new CANNON.Material({friction: 0.01, restitution: 0}) //材质数据，里面规定了摩擦系数和弹性系数
            });

            body.name = name;
            body.id = id;
            body.damage = damage;
            return body;
        }
    }
    function genHitpointObject(id, name, mass, hitpoint, hitpointMax, pos, type){
        if(type === "box"){
            var body = new CANNON.Body({ //创建一个刚体（物理世界的刚体数据）
                mass: mass, //刚体的质量，这里单位为kg
                position: new CANNON.Vec3(pos.x, pos.y, pos.z), //刚体的位置，单位是米
                shape: new CANNON.Box(new CANNON.Vec3(100, 100, 100)), //刚体的形状（这里是立方体，立方体的参数是一个包含半长、半宽、半高的三维向量，具体我们以后会说）
                material: new CANNON.Material({friction: 0.01, restitution: 0}) //材质数据，里面规定了摩擦系数和弹性系数
            });

            body.name = name;
            body.id = id;
            body.hitpoint = hitpoint;
            body.hitpointMax = hitpointMax;

            body.addEventListener("collide", function (event){
                damageCalculate(event, "enemyGenerator.fadeWithHp")
            });
            return body;
        }
    }
    Array.prototype.indexOf = function (val) {
        for(var i = 0; i < this.length; i++){
            if(this[i] == val){return i;}
        }
        return -1;
    }
    Array.prototype.remove = function (val) {
        var index = this.indexOf(val);
        if(index > -1){this.splice(index,1);}
    }
    function damageCalculate(event, fn){
        if(event.body.damage !== undefined){
            if(event.body.damage < 0 && event.target.hitpoint < event.target.hitpointMax){
                event.target.hitpoint = event.target.hitpoint - event.body.damage;
            }
            if(event.body.damage > 0){
                event.target.hitpoint = event.target.hitpoint - event.body.damage;
            }
            deletObject(event.body, true);
        }
        if(event.target.hitpoint <= 0){
            deletObject(event.target, true);

        }
        else {
            if(typeof(eval(fn)) == "function"){
                eval(fn+"(event.target.id);");
            }
            else
            {
                // 函数不存在
            }
        }
    }
    function deletObject(objet, delPop){
        var id = objet.id;
        var objs = getObject(id);

        if(objs[0] != null && objs[1] != null){
            if(delPop){
                if(objs[0].name === "rocket"){
                    rocket.remove(objs[0]);
                    rocketPhysic.remove(objs[1]);
                }
                if(objs[0].name === "bullet"){
                    bullet.remove(objs[0]);
                    bulletPhysic.remove(objs[1]);
                }
                if(objs[0].name === "crystal"){
                    crystal.remove(objs[0]);
                    crystalPhysic.remove(objs[1]);
                }
                if(objs[1].timer !== undefined){
                    var timer = objs[1].timer;
                    //console.log(timer);
                    clearTimeout(timer);
                }
            }
            scene[0].remove(objs[0]);
            phyWorld[0].removeBody(objs[1]);
        }
        //console.log(objs);
    }
    function getObject(id){
        var mesh, body;
        for(var i = 0; i < scene[0].children.length; i++){
            if(scene[0].children[i].uid === id){
                mesh = scene[0].children[i];
            }
        }
        for(var i = 0; i < phyWorld[0].bodies.length; i++){
            if(phyWorld[0].bodies[i].id === id){
                body = phyWorld[0].bodies[i];
            }
        }
        return [mesh, body];
    }
    function cameraBehind(x, y, moveSlide, ySlide, camera, player){
        // var gg = deepClone(playerModule[0].children[0]);
        // gg.material.wireframe = true;
        // console.log(gg);

        var slideSide1 = 30, slideSide2 = 35, lenSlideZ, lenSlideY;
        //console.log(moveSlidew);
        if(Math.abs(moveSlide) < vOfPlayer[2]){
            lenSlideZ = (moveSlide/vOfPlayer[2])*slideSide1;
        }
        else {
            lenSlideZ = slideSide1 + slideSide2*((Math.abs(moveSlide) - vOfPlayer[2])/200);
            if(moveSlide < 0){
                lenSlideZ = -1*lenSlideZ;
            }
        }

        if(Math.abs(ySlide) < vOfPlayer[2]){
            lenSlideY = (ySlide/vOfPlayer[2])*slideSide1;
        }
        else {
            lenSlideY = slideSide1 + slideSide2*((Math.abs(ySlide) - vOfPlayer[2])/200);
            if(ySlide < 0){
                lenSlideY = -1*lenSlideY;
            }
        }
        //console.log(lenSlide);
        var poC = camera.position, poP = player.position;
        var matrix = new THREE.Matrix4();
        matrix.copy(camera.matrixWorld);
        var dir = new THREE.Vector4(lenSlideZ,y+lenSlideY,x,1);
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
                }
            }
        }
    }
    function UI(){
        this.init = function(){
            this.rockSvgExist = new Array(1024).fill(false);
            this.catchedObj = [];
            this.haveCatched = false;
            this.catchedUIType = 1;
        }
        this.calculDeginWindow = function (dir){
            var len = Math.sqrt(dir.x*dir.x + dir.y*dir.y)
            var xydir = [dir.x/len, dir.y/len];
            var degflat = Math.atan(xydir[0]/xydir[1]);
            if(xydir[1] < 0){degflat = degflat + Math.PI;}
            degflat = degflat*(180/Math.PI);
            return degflat;
        }
        this.fresh = function(){
            var pct = 172.7 - (playerPhysic[0].energy/EnergyMax)*172.7;
            //console.log(document.getElementById("energy"));
            document.getElementById("energy").setAttribute('stroke-dashoffset',pct);

            document.getElementById("inf").innerHTML = crystalNum - crystal.length;

            if(crystalNum - crystal.length >= crystalNum){
                destinationPhysic[0].collisionMaskGroup = 2;
                destinationPhysic[0].collisionFilterGroup = 2;
                document.getElementById("inf").style.color = "#ff0000";
                //console.log("success!")
            }

            for(var i = 0; i < scene[0].children.length; i++){
                if(scene[0].children[i].name === "rocket"){
                    var id = scene[0].children[i].uid, rockExist = true;
                    var dd = move.dirToAim(playerPhysic[0], scene[0].children[i]);
                    var dir = move.dirToAimRelative(camera[0], scene[0], scene[0].children[i]);
                    var deg = (Math.sqrt(dir.x*dir.x + dir.y*dir.y)/Math.abs(dir.z));
                    if(dir.z < 0 && deg < Math.tan(Math.PI/3)){
                        rockExist = false;
                        //console.log(i+" can see!");
                    }
                    else {
                        if(dd[1] > 800){rockExist = false;}
                        else {
                            var degflat = this.calculDeginWindow(dir);
                        }
                    }
                    if(this.rockSvgExist[id] !== true){
                        if(rockExist){
                            //添加进html 
                            this.genEnemyPosition("rocket"+id, degflat, "120,-10 115,-2 125,-2", "rgba(218,165,32,0.7)");
                            this.rockSvgExist[id] = true;
                        }
                    }
                    else {
                        var obj = document.getElementById("rocket"+id);
                        if(!rockExist){
                            obj.remove();
                            this.rockSvgExist[id] = false;
                        }
                        else {
                            this.freshEnemyPosition(obj, degflat, dd[1], 'rgba(255,0,0,0.7)', 'rgba(218,165,32,0.7)');
                            //更新
                        }
                    }
                }
            }//更新rocket指示

            this.checkCatchExist();

            var id = "catched", vid = "Vcatched";
            if(this.catchedObj.length !== 0){
                //console.log(this.catchedObj);
                var dd = move.dirToAim(player[0], this.catchedObj[0]);
                if(dd[1] < rayDist){
                    var pos = this.positionOnScreen(this.catchedObj[0]);
                    var posV = this.posVUI(this.catchedObj[0], pos[0], pos[1]);
                    //console.log(pos);
                    //console.log(pos);
                    var a = window.innerWidth / 2;
                    var b = window.innerHeight / 2;
                    if(pos[0] > -a && pos[0] < a && pos[1] > -b && pos[1] < b && pos[2] < 1){//在视野内
                        if(this.haveCatched === false){
                            this.haveCatched = true;
                            this.catchedUIType = 1;
                            //创建ui1
                            this.genCatchedUI(vid, posV[0], posV[1], "rgba(255,0,0,0.6)");
                            this.genRectUI(id, pos[0], pos[1], "rgba(255,255,0,0.6)");
                        }
                        else {
                            var objUI = document.getElementById(id);
                            var objVUI = document.getElementById(vid);
                            if(this.catchedUIType !== 1){
                                //var objUI = document.getElementById(id);
                                this.catchedUIType = 1;
                                objUI.remove();
                                //移除ui
                                //创建ui1
                                this.genCatchedUI(vid, posV[0], posV[1], "rgba(255,0,0,0.6)");
                                this.genRectUI(id, pos[0], pos[1], "rgba(255,255,0,0.6)");
                            }
                            else {
                                //更新ui1
                                //var objUI = document.getElementById(id);
                                this.freshCatchedUI(objUI, pos[0], pos[1]);
                                this.freshCatchedUI(objVUI, posV[0], posV[1]);
                            }
                        }
                    }
                    else{
                        //计算deg
                        var dir = move.dirToAimRelative(camera[0],  scene[0], this.catchedObj[0]);
                        var degflat = this.calculDeginWindow(dir);

                        if(this.haveCatched === false){
                            this.haveCatched = true;
                            this.catchedUIType = 2;
                            //创建ui2
                            this.genEnemyPosition(id, degflat, "120,-25 110,-15 130,-15", "rgba(218,165,32,0.7)");
                        }
                        else {
                            var objUI = document.getElementById(id);
                            var objVUI = document.getElementById(vid);
                            if(this.catchedUIType !== 2){
                                //var objUI = document.getElementById(id);
                                this.catchedUIType = 2;
                                objUI.remove();
                                objVUI.remove();
                                //移除ui
                                //创建ui2
                                this.genEnemyPosition(id, degflat, "120,-25 110,-15 130,-15", "rgba(218,165,32,0.7)");
                            }
                            else {
                                //var objUI = document.getElementById(id);
                                this.freshEnemyPosition(objUI, degflat, dd[1], 'rgba(255,0,0,0.7)', 'rgba(218,165,32,0.7)');
                                //更新ui2
                            }
                        }
                    }
                }
                else{
                    //移除ui
                    var objUI = document.getElementById(id);
                    var objVUI = document.getElementById(vid);
                    objUI.remove();
                    if(objVUI !== null){
                        objVUI.remove();
                    }
                    this.catchedObj.pop();
                    this.haveCatched = false;
                }
            }//更新十字框选指示
            else {
                var objUI = document.getElementById(id);
                var objVUI = document.getElementById(vid);
                if(objUI !== null){
                    objUI.remove();
                }
                if(objVUI !== null){
                    objVUI.remove();
                }
            }
        }
        this.checkCatchExist = function (){
            //console.log(this.catchedObj.length);
            if(this.catchedObj.length === 1){
                var id = this.catchedObj[0].uid, flag = false;
                for(var i = 0; i < scene[0].children.length; i++){
                    if(scene[0].children[i].uid === id){flag = true}
                }
                //console.log(flag);
                if(flag === false){
                    this.haveCatched = false;
                    this.catchedObj.pop();
                }
            }
        }
        this.genEnemyPosition = function(id, deg, style, color){
            //var ep = '<polygon id="'+'rocket'+id+'" class = "enemyPosition" points="125,-10 120,-2 130,-2" style="transform:rotate('+deg+'deg)"></polygon>';
            //document.getElementById("svg").innerHTML += ep;
            var ep = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
            ep.setAttribute("id", id);
            ep.setAttribute("class", "enemyPosition");
            ep.setAttribute("points", style); //"125,-10 120,-2 130,-2"
            ep.setAttribute("fill", color);//"rgba(218,165,32,0.7)"
            ep.style.transform = "rotate("+deg+"deg)";
            document.getElementById("svgCenter").appendChild(ep);
        }//生成三角ui
        this.freshEnemyPosition = function (obj, deg, dist, c1, c2){
            obj.style.transform = "rotate("+deg+"deg)"
            //console.log(dd[1]);
            if(dist < 200){
                obj.setAttribute("fill", c1);
            }
            else {
                obj.setAttribute("fill", c2);
            }
        }//刷新三角ui
        this.catchShowPosition = function (){
            var obj = rayCaster(new THREE.Vector2(0,0), rayDist);
            //console.log(obj);
            if(obj !== undefined){
                if(this.catchedObj.length === 0){
                    this.catchedObj.push(obj);
                }
                else{
                    this.catchedObj.pop();
                    this.catchedObj.push(obj);
                }
                //生成div，并给其初始位置
                // var pos = this.positionOnScreen(obj);
                // console.log(pos);
            }
        }//抓取物体
        this.genCatchedUI = function (id, x, y, color){
            var cu = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
            cu.setAttribute("id", id);
            cu.setAttribute("class", "cross");
            cu.setAttribute("points", "110,120 130,120 120,110 120,130");
            cu.setAttribute("stroke", color);
            cu.style.transform = "translate("+x+"px,"+y+"px)";
            document.getElementById("svgCenter").appendChild(cu);
            //<polyline id="cross1" points="110,120 130,120 120,110 120,130" stroke-dasharray="19.5,15.1" style="fill:none; stroke:black; stroke-width:2"></polyline>
        }//生成正面ui
        this.genRectUI = function (id, x, y, color){
            //console.log(114);
            var ru = document.createElementNS("http://www.w3.org/2000/svg","rect");
            //console.log(514);
            ru.setAttribute("id", id);
            //ru.setAttribute("class", "cross");
            ru.setAttribute("x", "95");
            ru.setAttribute("y", "95");
            ru.setAttribute("rx", "5");
            ru.setAttribute("ry", "5");
            ru.setAttribute("width", "50");
            ru.setAttribute("height", "50");
            ru.setAttribute("fill", "blue");
            ru.setAttribute("stroke", "50");
            ru.setAttribute("stroke", color);
            ru.setAttribute("stroke-width", "3px");
            ru.setAttribute("stroke-dashoffset", "7.5");
            ru.setAttribute("stroke-dasharray", "7.5,40");
            ru.setAttribute("fill-opacity", "0");
            ru.setAttribute("stroke-opacity", "0.7");
            ru.style.transform = "translate("+x+"px,"+y+"px)";

            document.getElementById("svgCenter").appendChild(ru);
        }
        this.freshCatchedUI = function (obj, x, y){
            obj.style.transform = "translate("+x+"px,"+y+"px)";

        }//刷新正面ui
        this.positionOnScreen = function (obj){
            var worldVector = new THREE.Vector3(obj.position.x, obj.position.y, obj.position.z);
            var standardVector = worldVector.project(camera[0]);//x,y -1,1 1,-1
            var a = window.innerWidth / 2;
            var b = window.innerHeight / 2;
            var x = Math.round(standardVector.x * a);
            var y = Math.round(-standardVector.y * b);//x,y center
            return [x,y,standardVector.z];
        }
        this.calculVelocityUI = function (obj){
            var dist = move.dist(camera[0], obj);
            var t = dist/1000;

            this.velocityObj = new THREE.Mesh();

            this.velocityObj.position.x = obj.position.x + obj.velocity.x*t;
            this.velocityObj.position.y = obj.position.y + obj.velocity.y*t;
            this.velocityObj.position.z = obj.position.z + obj.velocity.z*t;
        }
        this.getPhysicItem = function (obj){
            var id = obj.uid;
            for(var i = 0; i < phyWorld[0].bodies.length; i++){
                if(phyWorld[0].bodies[i].id === id){
                    return phyWorld[0].bodies[i];
                }
            }
        }
        this.posVUI = function (obj, x, y){
            //var c = 1;
            var objPhy = this.getPhysicItem(obj);
            this.calculVelocityUI(objPhy);
            //console.log(pos[0], pos[1]);

            return this.positionOnScreen(this.velocityObj);
        }
    }
    function freshAll(env, physic, map, ui, train){
        if(!loading){
            trainingModel = train.keyBoardTest(keyCode, toServe, state);
            keyMotion();
            weapon.rocketMove();
            map.fresh();
            physic.freshPhysic();
            arriveDestination(env);
            limitInBox(destinationPhysic[0]);
            ui.fresh();
            env.bgsphere.position.copy(camera[0].position);
        }
    }

    moduleLoad();

    var env = new Env(scene,destination,camera,renderer,timeCloud,player,crystal);
    var physic = new Physic(phyWorld,destinationPhysic,playerPhysic,rocket,rocketPhysic,crystal,crystalPhysic);
    var map = new MiniMap(scene,destination,player,renderer,camera,timeCloudMap);
    var move = new Move(), engine, ui = new UI(), G2B = new FromGemotryToBody(), weapon = new Weapon(), playerOption, idGenerator = new IdGenerator(), enemyGenerator = new Enemy();
    var toServe = new Worker('worker.js'), trainM = new TrainingModel(), state;

    document.oncontextmenu = function(){return false};
    document.addEventListener('mousedown', function(event){
        if(document.pointerLockElement !== document.body){
            document.body.requestPointerLock();
        }
        if(event.button === 0 && trainingModel === false){
            mouseCode[0] = true;
            if(new Date() - mouseClickTime > 300){
                mouseClickTime = new Date() - 310;
            }
        }
        if(event.button === 2){
            event.preventDefault();
        }
    });
    document.addEventListener('mouseup', function(event){
        if(event.button === 0 && trainingModel === false){
            mouseCode[0] = false;
            // mouseClickTime = new Date() - mouseClickTime;
            // playerOption.shoot(mouseClickTime);
        }
        if(event.button === 2 && trainingModel === false){
            event.preventDefault();
            if(ui.catchedObj[0] !== undefined){
                playerOption.launchRocket(ui.catchedObj[0].uid);
            }
        }
    });
    document.body.addEventListener('mousemove',function(event) {
        if (document.pointerLockElement === document.body && trainingModel === false) {
            var cry = 0, crx = 0;
            cry = -1 * event.movementX / 500;
            crx = -1 * event.movementY / 500;
            //console.log(cry, crx)
            camera[0].rotateY(cry);
            camera[0].rotateX(crx);
        }
    });
    document.onkeydown=function(event){
        keyCode[event.keyCode] = true;
    };
    document.onkeyup=function(event){
        keyCode[event.keyCode] = false;
    };

    // const collideTest = throttle(function (event){
    //   if(event.contact.bj.name === "bullet"){
    //     score[0] = score[0] + 1;
    //     //document.getElementById("inf").innerHTML = score[0];
    //   }
    // },100);

    setInterval(function(){
        freshAll(env,physic,map,ui,trainM);
    },10);
    var checkLoad = setInterval(function () {
      if((cloudModules.length < 1) || (playerModule.length < 1) || (texture.length < 1) || (blackholeModules.length < 0)){//
        document.getElementById("load").style.display="";
        //console.log(document.getElementById("load"));
      }
      else{
        env.init();
        physic.init();
        enemyGenerator.init();
        map.init();
        ui.init();
        physic.freshPhysic();
        env.fresh();
        engine = new Engine(camera[0],playerPhysic[0]);
        playerOption  = new Player(player[0], camera[0], playerPhysic[0]);
        state = new State(crystalPhysic, playerPhysic[0], camera[0], gameTime);

        //engine.init();
        //console.log(player[0])
        render();

        document.getElementById("load").style.display="none";
        document.getElementById("svgCenter").style.display="";
        loading = false;

        // for(var i = 0; i < rocketPhysic.length; i++){
        //   rocketPhysic[i].addEventListener("collide", collideTest);
        // }
        window.onresize=function(){
          // 重置渲染器输出画布canvas尺寸
          renderer[0].setSize(window.innerWidth,window.innerHeight);
          // 全屏情况下：设置观察范围长宽比aspect为窗口宽高比
          camera[0].aspect = window.innerWidth/window.innerHeight;
          // 渲染器执行render方法的时候会读取相机对象的投影矩阵属性projectionMatrix
          // 但是不会每渲染一帧，就通过相机的属性计算投影矩阵(节约计算资源)
          // 如果相机的一些属性发生了变化，需要执行updateProjectionMatrix ()方法更新相机的投影矩阵
          camera[0].updateProjectionMatrix ();
        };

        clearInterval(checkLoad);
      }
    },100);
    setInterval(function () {
        if(trainingModel){
            let msg = state.step();
            toServe.postMessage(msg);
        }
    },2);
    setInterval(function (){
        //console.log(camera[0].position);
    },1000)
    toServe.onmessage = function (event) {
        if(event.data === 'Done has send!'){
            env.fresh();
            state.resetMsg();
            playerOption.reset();
        }
        else {
            let type = typeof (event.data);
            if(type === "number"){
                console.log('Time cost: ' + event.data+'ms in one step');
            }
            if(type === "object"){
                let obj = event.data;
                autoAction = trainM.actionTrans(obj.msg);
                state.clearReward();
                //console.log(autoAction);
            }
        }
    }
}


