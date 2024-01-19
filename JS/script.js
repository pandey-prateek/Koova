import { DragControls } from 'https://unpkg.com/three/examples/jsm/controls/DragControls.js';
import { OrbitControls } from 'https://unpkg.com/three/examples/jsm/controls/OrbitControls.js';

import { OBJLoader } from 'https://unpkg.com/three/examples/jsm/loaders/OBJLoader';
import { FontLoader } from 'https://unpkg.com/three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'https://unpkg.com/three/examples/jsm/geometries/TextGeometry';
import * as THREE from 'three';
import { Vector3 } from 'three';

function radians(degrees) {
    var pi = Math.PI;
    return degrees * (pi / 180);
}
var R0 = 12
var inner_most = [];
for (var i = 0; i < 5; i++) {
    const x = R0 * Math.cos(radians(90 + i * 72)) * -1;
    const y = R0 * Math.sin(radians(90 + i * 72)) * -1;
    inner_most.push({ "x": x, "y": y });
}
var R1 = 15
var inner = [];
for (var i = 0; i < 5; i++) {
    const x = R1 * Math.cos(radians(90 + i * 72)) * -1;
    const y = R1 * Math.sin(radians(90 + i * 72)) * -1;
    inner.push({ "x": x, "y": y });
}
var R2 = 40
var outer = [];

for (var i = 0; i < 5; i++) {
    const x = R2 * Math.cos(radians(90 + i * 72));
    const y = R2 * Math.sin(radians(90 + i * 72));

    outer.push({ "x": x, "y": y });
}
var R3 = 33
var outer_most = [];

for (var i = 0; i < 5; i++) {
    const x = R3 * Math.cos(radians(90 + i * 72));
    const y = R3 * Math.sin(radians(90 + i * 72));

    outer_most.push({ "x": x, "y": y });
}
var log = document.getElementById("logs");
var crows = [];
var platforms = [];
var render_text = ""
var vultureposition = {}
const clickMouse = new THREE.Vector2();  // create once
const moveMouse = new THREE.Vector2();
//const lawnGreen = "#006E33";
const lawnGreen = "#000000";
const edgeColor = "#546E90";
const trackColor = "#08A2DE";
const crowbody = "#68FF00"
var logs = "" + new Date() + ":Game Init Started\n";
var dead_crows = 0;
const treeCrownColor = 0x498c2c;
const treeTrunkColor = 0x4b3f2f;
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const treeTrunkGeometry = new THREE.BoxBufferGeometry(1, 1, 4);
const treeTrunkMaterial = new THREE.MeshLambertMaterial({
    color: treeTrunkColor
});

const platformgeometry = new THREE.SphereGeometry(3.5);
platformgeometry.rotateX(90)

const innerdotgeometry = new THREE.SphereGeometry(1.5);

const treeCrownMaterial = new THREE.MeshLambertMaterial({
    color: treeCrownColor
});

const assetbodygeometry = new THREE.SphereGeometry(4, 1, 55);
const vulturebodygeometry = new THREE.SphereGeometry(4, 0, 55);
const crowbodyMaterial = new THREE.MeshLambertMaterial({
    color: crowbody
});
const vulturebodyMaterial = new THREE.MeshLambertMaterial({
    color: 0xee2e31
});
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);
camera.position.set(0, -80, 121.24355653);
camera.lookAt(0, 0, 0);
function pickRandom(array) {
    return array[Math.floor(Math.random() * array.length)];
}
const board_colors = [
    0x006FFF,
    0x68FF00,
    0xFAFF00,
    0xFFBF00,
    0xFF005C,
    /* 0xff9f1c, 0xa52523, 0xbdb638, 0x78b14b */
];

function Tree() {
    const tree = new THREE.Group();

    const trunk = new THREE.Mesh(treeTrunkGeometry, treeTrunkMaterial);
    trunk.position.z = 2;
    trunk.castShadow = true;
    trunk.receiveShadow = true;
    trunk.matrixAutoUpdate = false;
    tree.add(trunk);

    const treeHeights = [6];
    const height = pickRandom(treeHeights);

    const crown = new THREE.Mesh(
        new THREE.SphereGeometry(height / 2, 5, 5),
        treeCrownMaterial
    );
    crown.position.z = height / 2 + 1;
    crown.castShadow = true;
    crown.receiveShadow = false;
    tree.add(crown);

    return tree;
}
function Platform() {
    const plat = new THREE.Group();
    var color = pickRandom(board_colors);
    const platformMateial = new THREE.MeshLambertMaterial({
        color: 0x08A2DE
    });
    const trunk = new THREE.Mesh(platformgeometry, platformMateial);
    trunk.position.z = 2;
    trunk.castShadow = true;
    trunk.receiveShadow = true;
    trunk.matrixAutoUpdate = false;
    plat.add(trunk);

    return plat;
}
function design_dot() {
    const plat = new THREE.Group();

    const platformMateial = new THREE.MeshLambertMaterial({
        color: 0xFF005C
    });
    const trunk = new THREE.Mesh(innerdotgeometry, platformMateial);
    trunk.position.z = 2;
    trunk.castShadow = true;
    trunk.receiveShadow = true;
    trunk.matrixAutoUpdate = false;
    plat.add(trunk);

    return plat;
}
const scene = new THREE.Scene();
const crows_position = [];
const board = Board();
const ob = OuterBoard();
const ib = innerBoard();
const bb = BorderBoard();
scene.add(board);
scene.add(ob);
scene.add(ib);
scene.add(bb);


getLines();
get_side_Lines();
getOuterLines();
getOuter_mostLines();
addCorwsToBase();
add_neighbours();
add_targets();

function animate() {
    requestAnimationFrame(animate);

    renderer.render(scene, camera);
};
var draggable;
var vul = addVultureToBase();
const controls = new DragControls(crows, camera, renderer.domElement);
const vulture = new DragControls([vul], camera, renderer.domElement);
const loader = new FontLoader();

render_text = "Welcome to Revenge of Crows\nCrows go first,May the force be with you"
add_text();
add_kill_count();
/* const orb_controls=new OrbitControls(camera,renderer.domElement);
orb_controls.target=new Vector3(0,0,0);

orb_controls.keys = {
    LEFT: 'ArrowLeft', //left arrow
    UP: 'ArrowUp', // up arrow
    RIGHT: 'ArrowRight', // right arrow
    BOTTOM: 'ArrowDown' // down arrow
}
orb_controls.update() */
controls.activate()
vulture.deactivate();
controls.addEventListener('dragstart', e => {
    logs += "" + new Date() + ":" + e.object.name + "started to move from " + e.object.userData.base + "\n";
    clear_text();
    draggable = { "x": e.object.position.x, "y": e.object.position.y, "z": e.object.position.z };


})

vulture.addEventListener('dragstart', e => {
    clear_text();
    logs += "" + new Date() + ":" + e.object.name + "started to move from " + e.object.userData.base + "\n";
    draggable = { "x": e.object.position.x, "y": e.object.position.y, "z": e.object.position.z };
})
function check(X, Y) {
    for (let i = 0; i < 7; i++) {
        if ((X + 4 > crows_position[i].x && X - 4 < crows_position[i].x && Y + 4 > crows_position[i].y && Y - 4 < crows_position[i].y) ||
            (X + 4 > vultureposition.x && X - 4 < vultureposition.x && Y + 4 > vultureposition.y && Y - 4 < vultureposition.y)) {
            return false;
        }
    }
    return true;
}
controls.addEventListener('dragend', e => {

    var k = e.object.userData.index;
    var X = e.object.position.x //- crows_position[k].x;
    var Y = e.object.position.y //- crows_position[k].y;
    var playable = true;
    for (var i = 0; i < 7; i++) {
        playable &= crows_position[i].playable;
    }
    var last = e.object.userData.last_platform;
    if (last == -99) {
        render_text = "Dead crows don't fly"
        add_text();
        e.object.position.x = draggable["x"];
        e.object.position.y = draggable["y"];
        e.object.position.z = draggable["z"];
        return;
    }
    if (last == -1) {
        for (var i = 0; i < 10; i++) {
            if (X + 4 > platforms[i].position.x && X - 4 < platforms[i].position.x && e.object.position.y + 4 > platforms[i].position.y && e.object.position.y - 4 < platforms[i].position.y &&
                !(X + 4 > draggable["x"] && X - 4 < draggable["x"] && e.object.position.y + 4 > draggable["y"] && e.object.position.y - 4 < draggable["y"]) && check(X, Y)) {

                if ((e.object.userData.playable || playable) && e.object.userData.dead == false) {
                    e.object.position.x = platforms[i].position.x
                    e.object.position.y = platforms[i].position.y
                    e.object.userData.base = platforms[i].name;
                    var plat = scene.getObjectByName(platforms[i].name);
                    plat.userData.occupant = e.object.name;
                    crows_position[k].x = e.object.position.x;
                    crows_position[k].y = e.object.position.y;
                    crows_position[k].z = e.object.position.z;
                    e.object.position.z = 2
                    e.object.userData.playable = false;
                    e.object.userData.last_platform = i;
                    logs += "" + new Date() + ":" + e.object.name + " moved to " + platforms[i].name + "from Base\n";
                    crows_position[k].playable = true;
                    if (check_prey_status() && check_neighbour_status()) {

                        render_text = "Crow's have won"
                        add_text();
                        download();
                        controls.deactivate()
                        return;
                    }

                    render_text = "Vulture's Turn"
                    add_text();
                    controls.deactivate()
                    vulture.activate();
                    return;
                } else if (!e.object.userData.playable) {

                    render_text = "You Can't take on Vulture Alone,\nBring everyone on board"
                    add_text();
                }
            }
        }
    } else {
        for (var i = 0; i < platforms[last].userData.neighbours.length; i++) {
            var neighbor = platforms[last].userData.neighbours[i];
            if (X + 4 > neighbor.position.x && X - 4 < neighbor.position.x && e.object.position.y + 4 > neighbor.position.y && e.object.position.y - 4 < neighbor.position.y &&
                !(X + 4 > draggable["x"] && X - 4 < draggable["x"] && e.object.position.y + 4 > draggable["y"] && e.object.position.y - 4 < draggable["y"]) && check(X, Y)) {

                if ((e.object.userData.playable || playable) && e.object.userData.dead == false) {

                    e.object.position.x = neighbor.position.x
                    e.object.position.y = neighbor.position.y
                    e.object.userData.base = neighbor.name;
                    var plat = scene.getObjectByName(neighbor.name);
                    plat.userData.occupant = e.object.name;
                    var plat_last = scene.getObjectByName(platforms[last].name);
                    plat_last.userData.occupant = "";
                    crows_position[k].x = e.object.position.x;
                    crows_position[k].y = e.object.position.y;
                    crows_position[k].z = e.object.position.z;
                    e.object.position.z = 2
                    logs += "" + new Date() + ":" + e.object.name + " moved to " + neighbor.name + "from" + platforms[last].name + "\n";
                    e.object.userData.playable = false;
                    e.object.userData.last_platform = neighbor.userData.index;
                    crows_position[k].playable = true;
                    if (check_prey_status() && check_neighbour_status()) {
                        render_text = "Crow's have emerger victorious,please refresh to play again"
                        add_text();
                        debugger;
                        download();
                        controls.deactivate()
                        return;
                    }

                    render_text = "Vulture's Turn"
                    add_text();
                    controls.deactivate()
                    vulture.activate();
                    
                    return;
                } else if (playable == false) {
                    render_text = "You Can't take on Vulture Alone Bring everyone on board"
                    logs += "" + new Date() + ":" + e.object.name + " tried to take on Vulture alone Bad choice \n";
                    add_text();
                    e.object.position.x = draggable["x"];
                    e.object.position.y = draggable["y"];
                    e.object.position.z = draggable["z"];
                    return
                }
            }

        }
    }
    /* var x = Math.floor(i / 2);
    if (i % 2 == 0) {
        if (X + 4 > outer[x]["x"] && X - 4 < outer[x]["x"] && e.object.position.y + 4 > outer[x]["y"] && e.object.position.y - 4 < outer[x]["y"] &&
            !(X + 4 > draggable["x"] && X - 4 < draggable["x"] && e.object.position.y + 4 > draggable["y"] && e.object.position.y - 4 < draggable["y"])&&check(X,Y)) {
            if (e.object.userData.playable || playable) {
                
                e.object.position.x = outer[x]["x"]
                e.object.position.y = outer[x]["y"]
                crows_position[k].x = e.object.position.x;
                crows_position[k].y = e.object.position.y;
                crows_position[k].z = e.object.position.z; 
                e.object.position.z = 1
                e.object.userData.playable = false;
                crows_position[k].playable = true;
                controls.deactivate()
                vulture.activate();
                return;
            }
        }
    } else {
        if (e.object.position.x + 4 > inner[x]["x"] && e.object.position.x - 4 < inner[x]["x"] && e.object.position.y + 4 > inner[x]["y"] && e.object.position.y - 4 < inner[x]["y"] &&
            !(X + 4 > draggable["x"] && X - 4 < draggable["x"] && e.object.position.y + 4 > draggable["y"] && e.object.position.y - 4 < draggable["y"])&&check(X,Y)) {
            if (e.object.userData.playable || playable) {
                
                e.object.position.x = inner[x]["x"]
                e.object.position.y = inner[x]["y"]
                e.object.position.z = 1
                crows_position[k].x = e.object.position.x;
                crows_position[k].y = e.object.position.y;
                crows_position[k].z = e.object.position.z; 
                e.object.userData.playable = false;
                crows_position[k].playable = true;
                controls.deactivate()
                vulture.activate();

                return;
            }
        }
    } */

    logs += "" + new Date() + ":" + e.object.name + " invalid move \n";
    render_text = "Can't place there anything"
    add_text();


    e.object.position.x = draggable["x"];
    e.object.position.y = draggable["y"];
    e.object.position.z = draggable["z"];



})
vulture.addEventListener('dragend', e => {
    var k = e.object.userData.index;
    var X = e.object.position.x //- crows_position[k].x;
    var Y = e.object.position.y //- crows_position[k].y;
    var last = e.object.userData.last_platform;
    if (last == -1) {
        for (var i = 0; i < 10; i++) {
            if (X + 4 > platforms[i].position.x && X - 4 < platforms[i].position.x && e.object.position.y + 4 > platforms[i].position.y && e.object.position.y - 4 < platforms[i].position.y &&
                !(X + 4 > draggable["x"] && X - 4 < draggable["x"] && e.object.position.y + 4 > draggable["y"] && e.object.position.y - 4 < draggable["y"]) && check(X, Y)) {

                e.object.position.x = platforms[i].position.x
                e.object.position.y = platforms[i].position.y
                e.object.position.z = 2
                var plat = scene.getObjectByName(platforms[i].name);
                e.object.userData.base = platforms[i].name;
                plat.userData.occupant = e.object.name;
                vultureposition.x = e.object.position.x;
                vultureposition.y = e.object.position.y;
                vultureposition.z = e.object.position.z;
                e.object.userData.last_platform = i;
                logs += "" + new Date() + ":" + e.object.name + " moved to " + platforms[i].name + " from Base\n";
                render_text = "Crows's Turn"
                add_text();
                controls.activate()
                vulture.deactivate();
                return;

            }
        }
    } else {
        if (!check_prey_status()) {
            for (var i = 0; i < platforms[last].userData.target.length; i++) {
                var target = platforms[last].userData.target[i]["position"];
                var prey = scene.getObjectByName(platforms[last].userData.target[i]["target"].name);
                if (X + 4 > target.position.x && X - 4 < target.position.x && e.object.position.y + 4 > target.position.y && e.object.position.y - 4 < target.position.y &&
                    !(X + 4 > draggable["x"] && X - 4 < draggable["x"] && e.object.position.y + 4 > draggable["y"] && e.object.position.y - 4 < draggable["y"]) && check(X, Y)) {
                    if (prey.userData.occupant != "") {
                        e.object.position.x = target.position.x
                        e.object.position.y = target.position.y
                        e.object.position.z = 2
                        e.object.userData.base = target.name
                        var killed = scene.getObjectByName(prey.userData.occupant);
                        crows_position[killed.userData.index].x = 0;
                        crows_position[killed.userData.index].y = 0;
                        crows_position[killed.userData.index].z = 2;
                        killed.position.x = 0;
                        killed.position.y = 0;
                        killed.position.z = 2;
                        logs += "" + new Date() + ":" + e.object.name + " moved to " + target.name + " from " + platforms[last].name + " " + killed.name + " got killed at " + prey.name + "\n";
                        killed.userData.last_platform = -99;
                        killed.userData.dead = true;
                        var plat = scene.getObjectByName(target.name);
                        plat.userData.occupant = e.object.name;
                        var plat_last = scene.getObjectByName(platforms[last].name);
                        plat_last.userData.occupant = "";
                        vultureposition.x = e.object.position.x;
                        vultureposition.y = e.object.position.y;
                        vultureposition.z = e.object.position.z;
                        prey.userData.occupant = "";
                        e.object.userData.last_platform = target.userData.index;
                        dead_crows++;
                        clear_killcount();
                        add_kill_count();
                        if (dead_crows == 4) {

                            render_text = "Vulture has won the battle\nplease refresh to play again"
                            download();
                            add_text();
                            vulture.deactivate();
                            return;
                        }
                        render_text = "Vulture got someone it's Crows's Turn"
                        add_text();
                        controls.activate()
                        vulture.deactivate();
                        return;
                    }
                }
            }
            render_text = "Honour the code,\nA Vulture Must kill"
            add_text();


            e.object.position.x = draggable["x"];
            e.object.position.y = draggable["y"];
            e.object.position.z = draggable["z"];
            return;
        }
        for (var i = 0; i < platforms[last].userData.neighbours.length; i++) {
            var neighbor = platforms[last].userData.neighbours[i];
            if (X + 4 > neighbor.position.x && X - 4 < neighbor.position.x && e.object.position.y + 4 > neighbor.position.y && e.object.position.y - 4 < neighbor.position.y &&
                !(X + 4 > draggable["x"] && X - 4 < draggable["x"] && e.object.position.y + 4 > draggable["y"] && e.object.position.y - 4 < draggable["y"]) && check(X, Y)) {

                e.object.position.x = neighbor.position.x
                e.object.position.y = neighbor.position.y
                e.object.position.z = 2
                var plat = scene.getObjectByName(neighbor.name);
                plat.userData.occupant = e.object.name;
                e.object.userData.base = neighbor.name
                var plat_last = scene.getObjectByName(platforms[last].name);
                logs += "" + new Date() + ":" + e.object.name + " moved to " + neighbor.name + " from " + platforms[last].name + "\n";
                vultureposition.x = e.object.position.x;
                plat_last.userData.occupant = "";
                vultureposition.y = e.object.position.y;
                vultureposition.z = e.object.position.z;
                e.object.userData.last_platform = neighbor.userData.index;
                render_text = "Crows's Turn"
                add_text();
                controls.activate()
                vulture.deactivate();
                return;

            }

        }
    }

    /* for (var i = 0; i < 10; i++) {
        var x = Math.floor(i / 2);
        if (i % 2 == 0) {
            if (X + 4 > outer[x]["x"] && X - 4 < outer[x]["x"] && e.object.position.y + 4 > outer[x]["y"] && e.object.position.y - 4 < outer[x]["y"] &&
                !(X + 4 > draggable["x"] && X - 4 < draggable["x"] && e.object.position.y + 4 > draggable["y"] && e.object.position.y - 4 < draggable["y"]) && check(X, Y)) {
                e.object.position.x = outer[x]["x"]
                e.object.position.y = outer[x]["y"]
                e.object.position.z = 1
                vultureposition.x = e.object.position.x;
                vultureposition.y = e.object.position.y;
                vultureposition.z = e.object.position.z;
                controls.activate()
                vulture.deactivate();
                return;
            }
        } else {
            if (e.object.position.x + 4 > inner[x]["x"] && e.object.position.x - 4 < inner[x]["x"] && e.object.position.y + 4 > inner[x]["y"] && e.object.position.y - 4 < inner[x]["y"] &&
                !(X + 4 > draggable["x"] && X - 4 < draggable["x"] && e.object.position.y + 4 > draggable["y"] && e.object.position.y - 4 < draggable["y"]) && check(X, Y)) {
                e.object.position.x = inner[x]["x"]
                e.object.position.y = inner[x]["y"]
                e.object.position.z = 1
                vultureposition.x = e.object.position.x;
                vultureposition.y = e.object.position.y;
                vultureposition.z = e.object.position.z;
                controls.activate()
                vulture.deactivate();
                return;
            }
        }

        ;
    } */
    logs += "" + new Date() + ":" + e.object.name + " invalid move \n";
    render_text = "Can't place there anything"
    add_text();


    e.object.position.x = draggable["x"];
    e.object.position.y = draggable["y"];
    e.object.position.z = draggable["z"];


})
controls.addEventListener('drag', e => {
    e.object.position.z = 3;

})
vulture.addEventListener('drag', e => {
    e.object.position.z = 3;

})
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', onWindowResize, false);
/*  scene.background = new THREE.Color(0xAFEEEE,);  */
const ambientlight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientlight);

const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
dirLight.position.set(0, 80, 70);
dirLight.castShadow = true;
dirLight.shadow.mapSize.width = 1024;
dirLight.shadow.mapSize.height = 1024;
dirLight.shadow.camera.left = -400;
dirLight.shadow.camera.right = 350;
dirLight.shadow.camera.top = 400;
dirLight.shadow.camera.bottom = -300;
dirLight.shadow.camera.near = 100;
dirLight.shadow.camera.far = 800;
scene.add(dirLight);

const aspectRatio = window.innerWidth / window.innerHeight;



function Board() {
    const board = new THREE.Group();


    //const texture = getTruckSideTexture();
    const color = pickRandom(board_colors);
    const side_texture = getsideBoard_texture();
    const top_texture = getTopBoard_texture();
    const base = new THREE.Mesh(
        new THREE.BoxGeometry(85, 85, 5),
        new THREE.MeshLambertMaterial({ color: 0xf5f5f5 }),
        new THREE.MeshLambertMaterial({ color, map: side_texture }),
        new THREE.MeshLambertMaterial({ color, map: side_texture }), // back
        new THREE.MeshLambertMaterial({ color, map: side_texture }),
        new THREE.MeshLambertMaterial({ color, map: side_texture }),
        new THREE.MeshLambertMaterial({ color, map: top_texture }), // top
        new THREE.MeshLambertMaterial({ color }) // bottom
    )
    base.position.z = -2.3




    board.add(base);
    return board;
}
function innerBoard() {
    const board = new THREE.Group();


    //const texture = getTruckSideTexture();
    const color = pickRandom(board_colors);
    const side_texture = getsideBoard_texture();
    const crowbody = "#071e22"

    const top_texture = getTopBoard_texture();
    const base = new THREE.Mesh(
        new THREE.BoxGeometry(80, 80, 6),
        new THREE.MeshLambertMaterial({ color: lawnGreen }),
        new THREE.MeshLambertMaterial({ color, map: side_texture }),
        new THREE.MeshLambertMaterial({ color, map: side_texture }), // back
        new THREE.MeshLambertMaterial({ color, map: side_texture }),
        new THREE.MeshLambertMaterial({ color, map: side_texture }),
        new THREE.MeshLambertMaterial({ color, map: top_texture }), // top
        new THREE.MeshLambertMaterial({ color }) // bottom
    )
    base.position.z = -2.5



    board.add(base);
    return board;
}

function OuterBoard() {
    const board = new THREE.Group();


    //const texture = getTruckSideTexture();
    const color = pickRandom(board_colors);
    const side_texture = getsideBoard_texture();
    const top_texture = getTopBoard_texture();
    const base = new THREE.Mesh(
        new THREE.BoxGeometry(110, 90, 4),
        new THREE.MeshLambertMaterial({ color: 0x000000 }),
        new THREE.MeshLambertMaterial({ color, map: side_texture }),
        new THREE.MeshLambertMaterial({ color, map: side_texture }), // back
        new THREE.MeshLambertMaterial({ color, map: side_texture }),
        new THREE.MeshLambertMaterial({ color, map: side_texture }),
        new THREE.MeshLambertMaterial({ color, map: top_texture }), // top
        new THREE.MeshLambertMaterial({ color }) // bottom
    )
    base.position.z = -3;

    board.add(base);
    return board;
}



function BorderBoard() {
    const board = new THREE.Group();


    //const texture = getTruckSideTexture();
    const color = pickRandom(board_colors);
    const side_texture = getsideBoard_texture();
    const top_texture = getTopBoard_texture();
    const base = new THREE.Mesh(
        new THREE.BoxGeometry(115, 95, 1),
        new THREE.MeshLambertMaterial({ color: 0xf5f5f5 }),
        new THREE.MeshLambertMaterial({ color, map: side_texture }),
        new THREE.MeshLambertMaterial({ color, map: side_texture }), // back
        new THREE.MeshLambertMaterial({ color, map: side_texture }),
        new THREE.MeshLambertMaterial({ color, map: side_texture }),
        new THREE.MeshLambertMaterial({ color, map: top_texture }), // top
        new THREE.MeshLambertMaterial({ color }) // bottom
    )
    base.position.z = -2




    board.add(base);
    return board;
}
/* function getLineMarkings() {
    const canvas = document.createElement("canvas");
    canvas.width = mapWidth;
    canvas.height = mapHeight;
    const context = canvas.getContext("2d");

    context.fillStyle = trackColor;
    context.fillRect(0, 0, mapWidth, mapHeight);

    context.lineWidth = 2;
    context.strokeStyle = "#E0FFFF";
    context.setLineDash([10, 14]);


    var numberOfSides = 5,
    size = 100,
    Xcenter = 0,
    Ycenter = 0,
    step = 2 * Math.PI / numberOfSides,//Precalculate step value
    shift = (Math.PI / 180.0) * -18;//Quick fix ;)

    context.beginPath();
    //cxt.moveTo (Xcenter +  size * Math.cos(0), Ycenter +  size *  Math.sin(0));          

    for (var i = 0; i <= numberOfSides; i++) {
        var curStep = i * step + shift;
        context.lineTo(Xcenter + size * Math.cos(curStep), Ycenter + size * Math.sin(curStep));
    }

    context.strokeStyle = "#000000";
    context.lineWidth = 1;
    context.stroke();


    return new THREE.CanvasTexture(canvas);
} */
function getLines() {
    const material = new THREE.LineDashedMaterial({
        color: trackColor, linewidth: 10, scale: 1,
        dashSize: 3,
        gapSize: 1,
    });
    const points = [];
    for (var i = 0; i < 5; i++) {
        points.push(new THREE.Vector3(inner[i]["x"], inner[i]["y"], 1));

    }
    points.push(new THREE.Vector3(inner[0]["x"], inner[0]["y"], 1));
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geometry, material);
    scene.add(line)


}
function getmargins() {
    const material = new THREE.LineDashedMaterial({
        color: 0xf5f5f5, linewidth: 2, scale: 1,
        dashSize: 3,
        gapSize: 1,
    });
    const points = [];

    points.push(new THREE.Vector3(50, 42.5, 1));
    points.push(new THREE.Vector3(50, -44, 1));
    points.push(new THREE.Vector3(-50, -44, 1));

    points.push(new THREE.Vector3(-50, 42.5, 1));
    points.push(new THREE.Vector3(50, 42.5, 1));

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geometry, material);
    scene.add(line)


}
getmargins();
function getmargins1() {
    const material = new THREE.LineDashedMaterial({
        color: 0xf5f5f5, linewidth: 2, scale: 1,
        dashSize: 3,
        gapSize: 1,
    });
    const points = [];

    points.push(new THREE.Vector3(47, 42.3, 1));
    points.push(new THREE.Vector3(47, -45, 1));
    points.push(new THREE.Vector3(-47, -45, 1));

    points.push(new THREE.Vector3(-47, 42.5, 1));
    points.push(new THREE.Vector3(47, 42.5, 1));

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geometry, material);
    scene.add(line)


}
getmargins1();
function get_side_Lines() {
    const material = new THREE.LineDashedMaterial({
        color: trackColor, linewidth: 5, scale: 0.5,
        dashSize: 3,
        gapSize: 1,
    });
    const points = [];
    for (var i = 0; i < 5; i++) {


        points.push(new THREE.Vector3(inner_most[i]["x"], inner_most[i]["y"], 1));


    }
    points.push(new THREE.Vector3(inner_most[0]["x"], inner_most[0]["y"], 1));
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geometry, material);
    scene.add(line)


}
function getOuterLines() {
    const material = new THREE.LineDashedMaterial({
        color: trackColor, linewidth: 10, scale: 1,
        dashSize: 3,
        gapSize: 1,
    });

    const points = [];
    for (var i = 0; i < 10; i++) {
        var x = Math.floor(i / 2);
        const tree = Platform();
        tree.userData.index = i;
        tree.userData.neighbours = [];
        tree.userData.target = [];
        tree.userData.occupant = "";
        tree.name = "platform" + i;
        if (i % 2 == 0) {
            tree.position.x = outer[x]["x"];
            tree.position.y = outer[x]["y"];
            points.push(new THREE.Vector3(outer[x]["x"], outer[x]["y"], 1));
        } else {
            tree.position.x = inner[(3 + x) % 5]["x"];
            tree.position.y = inner[(3 + x) % 5]["y"];
            points.push(new THREE.Vector3(inner[(3 + x) % 5]["x"], inner[(3 + x) % 5]["y"], 1));
        }
        platforms.push(tree);
        scene.add(tree);
    }
    points.push(new THREE.Vector3(outer[0]["x"], outer[0]["y"], 1));

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geometry, material);
    scene.add(line)


}
function getOuter_mostLines() {
    const material = new THREE.LineDashedMaterial({
        color: trackColor, linewidth: 10, scale: 1,
        dashSize: 3,
        gapSize: 1,
    });

    const points = [];
    for (var i = 0; i < 10; i++) {
        var x = Math.floor(i / 2);

        if (i % 2 == 0) {

            points.push(new THREE.Vector3(outer_most[x]["x"], outer_most[x]["y"], 1));
        } else {

            points.push(new THREE.Vector3(inner_most[(3 + x) % 5]["x"], inner_most[(3 + x) % 5]["y"], 1));
        }

    }
    points.push(new THREE.Vector3(outer_most[0]["x"], outer_most[0]["y"], 1));

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geometry, material);
    scene.add(line)


}

function addCorwsToBase() {


    for (var i = 0; i < 7; i++) {

        const crow = Crow();

        crow.position.x = 48;
        crow.position.y = 30 - 10 * i;
        crow.position.z = 2;
        crow.userData.index = i;
        crow.userData.playable = true;
        crow.userData.dead = false;
        crow.userData.last_platform = -1;
        crow.userData.base = "";
        crow.name = "crow" + i;
        scene.add(crow);
        crows_position.push({ "x": crow.position.x, "y": crow.position.y, "z": crow.position.z, "playable": false, "dead": false });
        crows.push(crow)
    }



}
function addVultureToBase() {




    const vul = Vulture();

    vul.userData.last_platform = -1;

    vul.name = "vulture";
    vul.userData.base = "";
    scene.add(vul);
    vultureposition = { "x": vul.position.x, "y": vul.position.y, "z": vul.position.z, "playable": false, "dead": false };
    return vul;

}




function Crow() {


    const body = new THREE.Mesh(assetbodygeometry, crowbodyMaterial);
    body.position.z = 8;
    body.castShadow = true;
    body.receiveShadow = true;
    body.userData.index = 0;


    return body;
}
function Vulture() {


    const body = new THREE.Mesh(vulturebodygeometry, vulturebodyMaterial);
    body.position.x = -45
    body.position.z = 8;
    body.castShadow = true;
    body.receiveShadow = true;
    body.userData.index = -99;
    return body;

}
/* function renderMap(mapWidth, mapHeight) {
    const lineMarkingsTexture = getLines();

    const planeGeometry = new THREE.PlaneBufferGeometry(mapWidth, mapHeight);
    const planeMaterial = new THREE.MeshLambertMaterial({
        map: lineMarkingsTexture
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.receiveShadow = true;
    plane.matrixAutoUpdate = false;
    scene.add(plane);
} */
function getsideBoard_texture() {
    const color1 = pickRandom(board_colors);
    const canvas = document.createElement("canvas");
    canvas.width = 60;
    canvas.height = 3;
    const context = canvas.getContext("2d");

    context.fillStyle = color1;
    context.fillRect(0, 0, 60, 3);
    const color2 = pickRandom(board_colors);
    context.fillStyle = color2;
    context.fillRect(5, 1, 55, 2);

    return new THREE.CanvasTexture(canvas);
}
function getTopBoard_texture() {
    const canvas = document.createElement("canvas");
    canvas.width = 80;
    canvas.height = 80;
    const context = canvas.getContext("2d");
    const color1 = pickRandom(board_colors);
    context.fillStyle = color1;
    context.fillRect(0, 0, 80, 80);
    const color2 = pickRandom(board_colors);

    context.fillStyle = color2;
    context.fillRect(4, 4, 76, 76);

    return new THREE.CanvasTexture(canvas);
}

animate();
/* createCastle(); */
function add_neighbours() {
    for (var i = 0; i < 10; i++) {
        if (i == 0) {
            platforms[i].userData.neighbours.push(platforms[9]);
        } else {
            platforms[i].userData.neighbours.push(platforms[(i - 1)]);
        }
        platforms[i].userData.neighbours.push(platforms[(i + 1) % 10]);
        if (i % 2 == 1) {
            if (i == 1) {
                platforms[i].userData.neighbours.push(platforms[9]);
            } else {
                platforms[i].userData.neighbours.push(platforms[(i - 2)]);
            }
            platforms[i].userData.neighbours.push(platforms[(i + 2) % 10]);
        }
    }

}
function add_targets() {
    for (var i = 0; i < 10; i++) {

        if (i == 0) {
            platforms[i].userData.target.push({ "position": platforms[7], "target": platforms[9] });
        } else if (i == 1) {
            platforms[i].userData.target.push({ "position": platforms[8], "target": platforms[9] });
        } else if (i == 2) {
            platforms[i].userData.target.push({ "position": platforms[9], "target": platforms[1] });
        } else {
            if (i % 2 == 0)
                platforms[i].userData.target.push({ "position": platforms[i - 3], "target": platforms[i - 1] });
            else
                platforms[i].userData.target.push({ "position": platforms[i - 3], "target": platforms[i - 2] });
        }
        if (i % 2 == 0)
            platforms[i].userData.target.push({ "position": platforms[(i + 3) % 10], "target": platforms[(i + 1) % 10] });
        else
            platforms[i].userData.target.push({ "position": platforms[(i + 3) % 10], "target": platforms[(i + 2) % 10] });


    }

}
function check_prey_status() {

    var vulture = scene.getObjectByName("vulture");
    var platform = scene.getObjectByName(vulture.userData.base);
    if (vulture.userData.base == "")
        return false;
    for (var i = 0; i < platform.userData.target.length; i++) {
        var target = scene.getObjectByName(platform.userData.target[i]["position"].name);
        var prey = scene.getObjectByName(platform.userData.target[i]["target"].name);
        if (target.userData.occupant == "" && prey.userData.occupant != "") {
            return false;
        }
    }

    return true;
}
function check_neighbour_status() {

    var vulture = scene.getObjectByName("vulture");
    if (vulture.userData.base == "")
        return false;
    var platform = scene.getObjectByName(vulture.userData.base);

    for (var i = 0; i < platform.userData.neighbours.length; i++) {
        var neighbor = scene.getObjectByName(platform.userData.neighbours[i].name);
        if (neighbor.userData.occupant == "") {
            return false;
        }
    }

    return true;
}

function add_text() {

    loader.load('../ASSETS/optimer_regular.typeface.json', function (font) {

        const geometry = new TextGeometry(render_text, {
            font: font,
            size: 5,
            height: 0.1,
            curveSegments: 10,
            bevelEnabled: true,
            bevelThickness: 0.2,
            bevelSize: 0.2,
            bevelOffset: 0,
            bevelSegments: 3
        });
        var color = pickRandom(board_colors);
        const textMaterial = new THREE.MeshLambertMaterial({
            color: 0xfffff5
        });
        const text = new THREE.Mesh(geometry, textMaterial);
        text.rotation.x=Math.PI / 10;
        text.name = "text";
        text.position.set(-50, 50, 10);
        scene.add(text);
    });
}
function add_middile_text() {

    loader.load('../ASSETS/optimer_regular.typeface.json', function (font) {

        const geometry = new TextGeometry("KAOOA", {
            font: font,
            size: 3,
            height: 2,
            curveSegments: 20,

            bevelThickness: 0.2,
            bevelSize: 0.3,
            bevelOffset: 0,
            bevelSegments: 1
        });
        var color = pickRandom(board_colors);
        const textMaterial = new THREE.MeshLambertMaterial({
            color: trackColor
        });
        const text = new THREE.Mesh(geometry, textMaterial);
        text.name = "md";
        text.position.set(-7, -5, 5);
        scene.add(text);
    });
}
add_middile_text();
function add_kill_count() {

    loader.load('../ASSETS/optimer_regular.typeface.json', function (font) {

        const geometry = new TextGeometry("Kill Count\n" + dead_crows, {
            font: font,
            size: 5,
            height: 0.2,
            curveSegments: 5,
            bevelEnabled: true,
            bevelThickness: 0.2,
            bevelSize: 0.2,
            bevelOffset: 0,
            bevelSegments: 1
        });
        var color = pickRandom(board_colors);
        const textMaterial = new THREE.MeshLambertMaterial({
            color: 0xff0000
        });
        const text = new THREE.Mesh(geometry, textMaterial);
        text.rotation.x=Math.PI / 10;
    
        text.name = "kc";
        text.position.set(55, 20, 10);
        scene.add(text);
    });
}
function clear_killcount() {
    var text = scene.getObjectByName("kc");
    
    scene.remove(text);
}
function clear_text() {
    var text = scene.getObjectByName("text");

    scene.remove(text);
}



document.getElementById("logs").onclick = function () {
    download()
};

function download() {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(logs));
    element.setAttribute('download', "logs.txt");

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}
function kill_crow() {
    debugger;
    var vulture = scene.getObjectByName("vulture");
    var platform = scene.getObjectByName(vulture.userData.base);
    if (vulture.userData.base == "")
        return;
    for (var i = 0; i < platform.userData.target.length; i++) {
        var target = scene.getObjectByName(platform.userData.target[i]["position"].name);
        var prey = scene.getObjectByName(platform.userData.target[i]["target"].name);
        if (target.userData.occupant == "" && prey.userData.occupant != "") {
            vulture.position.x = target.position.x
            vulture.position.y = target.position.y
            vulture.position.z = 2
            vulture.userData.base = target.name
            var killed = scene.getObjectByName(prey.userData.occupant);
            crows_position[killed.userData.index].x = 0;
            crows_position[killed.userData.index].y = 0;
            crows_position[killed.userData.index].z = 2;
            killed.position.x = 0;
            killed.position.y = 0;
            killed.position.z = 2;
            logs += "" + new Date() + ":" + vulture.name + " moved to " + target.name + " from " + platform.name + "," + killed.name + " got killed at " + prey.name + "\n";
            killed.userData.last_platform = -99;
            killed.userData.dead = true;
            var plat = scene.getObjectByName(target.name);
            plat.userData.occupant = vulture.name;
            var plat_last = scene.getObjectByName(platform.name);
            plat_last.userData.occupant = "";
            vultureposition.x = vulture.position.x;
            vultureposition.y = vulture.position.y;
            vultureposition.z = vulture.position.z;
            prey.userData.occupant = "";
            e.object.userData.last_platform = target.userData.index;
            dead_crows++;
            clear_killcount();
            add_kill_count();
            if (dead_crows == 4) {

                render_text = "Vulture has won the battle,please refresh \nif you root for crows"
                download();
                add_text();
                vulture.deactivate();
                return;
            }
            render_text = "Vulture got someone it's Crows's Turn"
            add_text();
            controls.activate()
            vulture.deactivate();
            return;
        }
    }

}
renderer.setClearColor(0xffffff, 0);

renderer.render(scene, camera);

