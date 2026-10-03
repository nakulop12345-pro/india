/* =========================================================
   SOLAR SYSTEM ENGINE
========================================================= */

import * as THREE from "three";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.180.0/examples/jsm/controls/OrbitControls.js";


import {
    PLANETS,
    SUN,
    MOONS,
    STAR_COLORS
} from "./data.js";


/* =========================================================
   GLOBAL STATE
========================================================= */

let scene;

let camera;

let renderer;

let controls;

let clock;

let sun;

let selectedPlanet = null;

let selectedPlanetData = null;

let isPaused = false;

let simulationSpeed = 1;

let simulationDays = 0;

let cameraTarget = new THREE.Vector3();

let focusAnimation = null;

const planetObjects = [];

const moonObjects = [];

const raycaster =
    new THREE.Raycaster();

const mouse =
    new THREE.Vector2();


/* =========================================================
   INITIALIZATION
========================================================= */

init();


function init() {

    updateLoading(
        5,
        "Creating rendering engine..."
    );


    scene =
        new THREE.Scene();


    scene.background =
        new THREE.Color(0x000000);


    clock =
        new THREE.Clock();


    createCamera();

    createRenderer();

    createLighting();

    createStars();

    createSun();

    createPlanets();

    createOrbitLines();

    createMoons();

    createUI();

    createEvents();


    updateLoading(
        100,
        "Simulation ready"
    );


    setTimeout(() => {

        document
            .getElementById("loadingScreen")
            .classList
            .add("loaded");

    }, 700);


    animate();

}


/* =========================================================
   CAMERA
========================================================= */

function createCamera() {

    camera =
        new THREE.PerspectiveCamera(

            50,

            window.innerWidth /
            window.innerHeight,

            0.1,

            5000

        );


    camera.position.set(
        40,
        28,
        58
    );


}


/* =========================================================
   RENDERER
========================================================= */

function createRenderer() {

    const canvas =
        document.getElementById("space");


    renderer =
        new THREE.WebGLRenderer({

            canvas,

            antialias: true,

            powerPreference:
                "high-performance"

        });


    renderer.setPixelRatio(
        Math.min(
            window.devicePixelRatio,
            2
        )
    );


    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );


    renderer.outputColorSpace =
        THREE.SRGBColorSpace;


    renderer.toneMapping =
        THREE.ACESFilmicToneMapping;


    renderer.toneMappingExposure =
        1.15;


    renderer.shadowMap.enabled =
        true;


    renderer.shadowMap.type =
        THREE.PCFSoftShadowMap;


    controls =
        new OrbitControls(
            camera,
            renderer.domElement
        );


    controls.enableDamping =
        true;


    controls.dampingFactor =
        0.045;


    controls.rotateSpeed =
        1.65;


    controls.zoomSpeed =
        1.25;


    controls.panSpeed =
        1.0;


    controls.minDistance =
        4;


    controls.maxDistance =
        350;


    controls.target.set(
        0,
        0,
        0
    );

}


/* =========================================================
   LIGHTING
========================================================= */

function createLighting() {

    const ambient =
        new THREE.AmbientLight(
            0x202530,
            0.18
        );


    scene.add(
        ambient
    );


    const sunLight =
        new THREE.PointLight(
            0xffffff,
            3000,
            0,
            1.5
        );


    sunLight.position.set(
        0,
        0,
        0
    );


    sunLight.castShadow =
        true;


    sunLight.shadow.mapSize.width =
        2048;


    sunLight.shadow.mapSize.height =
        2048;


    scene.add(
        sunLight
    );

}


/* =========================================================
   STARFIELD
========================================================= */

function createStars() {

    const count =
        14000;


    const positions =
        new Float32Array(
            count * 3
        );


    const colors =
        new Float32Array(
            count * 3
        );


    const color =
        new THREE.Color();


    for (
        let i = 0;
        i < count;
        i++
    ) {

        const radius =
            300 +
            Math.random() * 1200;


        const theta =
            Math.random() *
            Math.PI *
            2;


        const phi =
            Math.acos(
                2 *
                Math.random() -
                1
            );


        const x =
            radius *
            Math.sin(phi) *
            Math.cos(theta);


        const y =
            radius *
            Math.cos(phi);


        const z =
            radius *
            Math.sin(phi) *
            Math.sin(theta);


        positions[i * 3] =
            x;

        positions[i * 3 + 1] =
            y;

        positions[i * 3 + 2] =
            z;


        const chosen =
            STAR_COLORS[
                Math.floor(
                    Math.random() *
                    STAR_COLORS.length
                )
            ];


        color.setHex(
            chosen
        );


        colors[i * 3] =
            color.r;

        colors[i * 3 + 1] =
            color.g;

        colors[i * 3 + 2] =
            color.b;

    }


    const geometry =
        new THREE.BufferGeometry();


    geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(
            positions,
            3
        )
    );


    geometry.setAttribute(
        "color",
        new THREE.BufferAttribute(
            colors,
            3
        )
    );


    const material =
        new THREE.PointsMaterial({

            size: 0.75,

            sizeAttenuation: true,

            vertexColors: true,

            transparent: true,

            opacity: 0.9,

            depthWrite: false

        });


    const stars =
        new THREE.Points(
            geometry,
            material
        );


    scene.add(
        stars
    );

}


/* =========================================================
   SUN
========================================================= */

function createSun() {

    const geometry =
        new THREE.SphereGeometry(
            SUN.size,
            96,
            96
        );


    const material =
        new THREE.MeshBasicMaterial({

            color:
                SUN.color

        });


    sun =
        new THREE.Mesh(
            geometry,
            material
        );


    sun.name =
        "Sun";


    scene.add(
        sun
    );


    createSunGlow();

}


/* =========================================================
   SUN GLOW
========================================================= */

function createSunGlow() {

    const geometry =
        new THREE.SphereGeometry(
            SUN.size * 1.45,
            64,
            64
        );


    const material =
        new THREE.MeshBasicMaterial({

            color:
                0xff9d24,

            transparent: true,

            opacity: 0.08,

            blending:
                THREE.AdditiveBlending,

            depthWrite: false

        });


    const glow =
        new THREE.Mesh(
            geometry,
            material
        );


    scene.add(
        glow
    );


    const geometry2 =
        new THREE.SphereGeometry(
            SUN.size * 1.9,
            64,
            64
        );


    const material2 =
        new THREE.MeshBasicMaterial({

            color:
                0xff7b1a,

            transparent: true,

            opacity: 0.035,

            blending:
                THREE.AdditiveBlending,

            depthWrite: false

        });


    const glow2 =
        new THREE.Mesh(
            geometry2,
            material2
        );


    scene.add(
        glow2
    );

}


/* =========================================================
   PLANETS
========================================================= */

function createPlanets() {

    PLANETS.forEach(
        (data, index) => {

            const geometry =
                new THREE.SphereGeometry(

                    data.size,

                    64,

                    64

                );


            const material =
                new THREE.MeshStandardMaterial({

                    color:
                        data.color,

                    roughness:
                        data.name === "Jupiter" ||
                        data.name === "Saturn"
                            ? 0.85
                            : 0.72,

                    metalness: 0,

                    emissive:
                        0x000000,

                    emissiveIntensity:
                        0

                });


            const mesh =
                new THREE.Mesh(
                    geometry,
                    material
                );


            mesh.name =
                data.name;


            mesh.castShadow =
                true;


            mesh.receiveShadow =
                true;


            mesh.userData =
                data;


            /* -----------------------------------------
               INITIAL ORBIT POSITION
            ------------------------------------------ */

            const angle =
                index *
                0.83;


            const orbitRadius =
                data.orbitScale;


            const eccentricity =
                data.eccentricity;


            const radius =
                orbitRadius *
                (
                    1 -
                    eccentricity *
                    eccentricity
                ) /
                (
                    1 +
                    eccentricity *
                    Math.cos(angle)
                );


            mesh.position.set(

                radius *
                Math.cos(angle),

                Math.sin(
                    THREE.MathUtils.degToRad(
                        data.inclination
                    )
                ) *
                radius *
                0.35,

                radius *
                Math.sin(angle)

            );


            scene.add(
                mesh
            );


            planetObjects.push({

                mesh,

                data,

                angle,

                orbitRadius

            });


            /* -----------------------------------------
               SPECIAL PLANET EFFECTS
            ------------------------------------------ */

            if (
                data.name === "Saturn"
            ) {

                createSaturnRings(
                    mesh
                );

            }


            if (
                data.name === "Earth"
            ) {

                createEarthAtmosphere(
                    mesh
                );

            }


            if (
                data.name === "Jupiter"
            ) {

                createJupiterBands(
                    mesh
                );

            }

        }
    );

}


/* =========================================================
   EARTH ATMOSPHERE
========================================================= */

function createEarthAtmosphere(
    planet
) {

    const geometry =
        new THREE.SphereGeometry(
            1.09,
            64,
            64
        );


    const material =
        new THREE.MeshBasicMaterial({

            color:
                0x3c9dff,

            transparent: true,

            opacity: 0.11,

            side:
                THREE.BackSide,

            blending:
                THREE.AdditiveBlending,

            depthWrite: false

        });


    const atmosphere =
        new THREE.Mesh(
            geometry,
            material
        );


    planet.add(
        atmosphere
    );

}


/* =========================================================
   JUPITER ATMOSPHERE DETAIL
========================================================= */

function createJupiterBands(
    planet
) {

    const bandGeometry =
        new THREE.TorusGeometry(
            2.66,
            0.015,
            8,
            128
        );


    const bandMaterial =
        new THREE.MeshBasicMaterial({

            color:
                0x9b8067,

            transparent: true,

            opacity: 0.25

        });


    for (
        let i = 0;
        i < 6;
        i++
    ) {

        const band =
            new THREE.Mesh(
                bandGeometry,
                bandMaterial
            );


        band.rotation.x =
            Math.PI / 2;


        band.rotation.z =
            i *
            0.1;


        band.scale.set(

            1,

            1,

            0.15

        );


        planet.add(
            band
        );

    }

}


/* =========================================================
   SATURN RINGS
========================================================= */

function createSaturnRings(
    planet
) {

    const ringGeometry =
        new THREE.RingGeometry(
            2.7,
            4.5,
            128
        );


    const positions =
        ringGeometry.attributes.position;


    const uv =
        ringGeometry.attributes.uv;


    for (
        let i = 0;
        i < positions.count;
        i++
    ) {

        const x =
            positions.getX(i);


        const y =
            positions.getY(i);


        const distance =
            Math.sqrt(
                x * x +
                y * y
            );


        const normalized =
            (
                distance -
                2.7
            ) /
            (
                4.5 -
                2.7
            );


        uv.setX(
            i,
            normalized
        );

    }


    const ringMaterial =
        new THREE.MeshStandardMaterial({

            color:
                0xc8b99a,

            side:
                THREE.DoubleSide,

            transparent: true,

            opacity: 0.82,

            roughness: 0.9

        });


    const rings =
        new THREE.Mesh(
            ringGeometry,
            ringMaterial
        );


    rings.rotation.x =
        Math.PI / 2;


    rings.rotation.z =
        THREE.MathUtils.degToRad(
            27
        );


    rings.receiveShadow =
        true;


    planet.add(
        rings
    );

}


/* =========================================================
   ORBIT LINES
========================================================= */

function createOrbitLines() {

    PLANETS.forEach(
        data => {

            const points = [];


            const segments = 256;


            for (
                let i = 0;
                i <= segments;
                i++
            ) {

                const angle =
                    (
                        i /
                        segments
                    ) *
                    Math.PI *
                    2;


                const e =
                    data.eccentricity;


                const radius =
                    data.orbitScale *
                    (
                        1 -
                        e * e
                    ) /
                    (
                        1 +
                        e *
                        Math.cos(angle)
                    );


                const inclination =
                    THREE.MathUtils.degToRad(
                        data.inclination
                    );


                points.push(

                    new THREE.Vector3(

                        radius *
                        Math.cos(angle),

                        radius *
                        Math.sin(angle) *
                        Math.sin(
                            inclination
                        ),

                        radius *
                        Math.sin(angle) *
                        Math.cos(
                            inclination
                        )

                    )

                );

            }


            const geometry =
                new THREE.BufferGeometry()
                    .setFromPoints(
                        points
                    );


            const material =
                new THREE.LineBasicMaterial({

                    color:
                        0x556070,

                    transparent: true,

                    opacity: 0.28

                });


            const line =
                new THREE.LineLoop(
                    geometry,
                    material
                );


            line.userData =
                data;


            scene.add(
                line
            );

        }
    );

}


/* =========================================================
   MOONS
========================================================= */

function createMoons() {

    Object.entries(
        MOONS
    ).forEach(
        ([parentName, moons]) => {

            const parent =
                planetObjects.find(
                    object =>
                        object.data.name ===
                        parentName
                );


            if (!parent)
                return;


            moons.forEach(
                moonData => {

                    const geometry =
                        new THREE.SphereGeometry(
                            moonData.size,
                            32,
                            32
                        );


                    const material =
                        new THREE.MeshStandardMaterial({

                            color:
                                moonData.color,

                            roughness:
                                0.95

                        });


                    const moon =
                        new THREE.Mesh(
                            geometry,
                            material
                        );


                    moon.castShadow =
                        true;


                    moon.receiveShadow =
                        true;


                    moon.userData = {

                        ...moonData,

                        parent:
                            parentName

                    };


                    moon.position.x =
                        moonData.distance;


                    parent.mesh.add(
                        moon
                    );


                    moonObjects.push({

                        mesh:
                            moon,

                        parent:
                            parent.mesh,

                        data:
                            moonData,

                        angle:
                            Math.random() *
                            Math.PI *
                            2

                    });

                }
            );

        }
    );

}


/* =========================================================
   UI
========================================================= */

function createUI() {

    const container =
        document.getElementById(
            "planetButtons"
        );


    PLANETS.forEach(
        data => {

            const button =
                document.createElement(
                    "button"
                );


            button.className =
                "planet-button";


            button.textContent =
                data.name.toUpperCase();


            button.dataset.planet =
                data.name;


            button.addEventListener(
                "click",
                () => {

                    selectPlanet(
                        data.name
                    );

                }
            );


            container.appendChild(
                button
            );

        }
    );


    document
        .querySelectorAll(
            "[data-speed]"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        simulationSpeed =
                            Number(
                                button.dataset.speed
                            );


                        document
                            .getElementById(
                                "simulationSpeed"
                            )
                            .textContent =
                            simulationSpeed +
                            "×";


                        document
                            .querySelectorAll(
                                "[data-speed]"
                            )
                            .forEach(
                                b =>
                                    b.classList
                                     .remove(
                                         "active"
                                     )
                            );


                        button.classList
                            .add("active");

                    }
                );

            }
        );


    document
        .querySelector(
            '[data-speed="1"]'
        )
        .classList
        .add("active");


    document
        .getElementById(
            "pauseButton"
        )
        .addEventListener(
            "click",
            togglePause
        );


    document
        .getElementById(
            "closeInfo"
        )
        .addEventListener(
            "click",
            closeInfo
        );


    document
        .getElementById(
            "focusButton"
        )
        .addEventListener(
            "click",
            () => {

                if (
                    selectedPlanet
                ) {

                    focusPlanet(
                        selectedPlanet
                    );

                }

            }
        );


    document
        .getElementById(
            "resetCamera"
        )
        .addEventListener(
            "click",
            resetCamera
        );

}


/* =========================================================
   EVENTS
========================================================= */

function createEvents() {

    window.addEventListener(
        "resize",
        onResize
    );


    renderer.domElement
        .addEventListener(
            "pointerdown",
            onPointerDown
        );


    renderer.domElement
        .addEventListener(
            "pointermove",
            onPointerMove
        );

}


/* =========================================================
   MOUSE CLICK
========================================================= */

function onPointerDown(
    event
) {

    mouse.x =
        (
            event.clientX /
            window.innerWidth
        ) *
        2 -
        1;


    mouse.y =
        -(
            event.clientY /
            window.innerHeight
        ) *
        2 +
        1;


    raycaster.setFromCamera(
        mouse,
        camera
    );


    const intersects =
        raycaster.intersectObjects(
            planetObjects.map(
                object =>
                    object.mesh
            ),
            false
        );


    if (
        intersects.length
    ) {

        const mesh =
            intersects[0].object;


        selectPlanet(
            mesh.name
        );

    }

}


/* =========================================================
   MOUSE MOVE
========================================================= */

function onPointerMove(
    event
) {

    /*
       Subtle parallax.

       OrbitControls still handles
       actual camera rotation.

       This adds a small cinematic
       response to mouse position.
    */

    const x =
        (
            event.clientX /
            window.innerWidth
        ) -
        0.5;


    const y =
        (
            event.clientY /
            window.innerHeight
        ) -
        0.5;


    if (
        !selectedPlanet &&
        !focusAnimation
    ) {

        camera.rotation.z =
            THREE.MathUtils.lerp(
                camera.rotation.z,
                -x * 0.025,
                0.04
            );

    }

}


/* =========================================================
   SELECT PLANET
========================================================= */

function selectPlanet(
    name
) {

    const object =
        planetObjects.find(
            item =>
                item.data.name ===
                name
        );


    if (!object)
        return;


    selectedPlanet =
        object.mesh;


    selectedPlanetData =
        object.data;


    document
        .querySelectorAll(
            ".planet-button"
        )
        .forEach(
            button => {

                button.classList.toggle(

                    "active",

                    button.dataset.planet ===
                    name

                );

            }
        );


    updateInfoPanel(
        object.data
    );


    document
        .getElementById(
            "targetName"
        )
        .textContent =
        name.toUpperCase();


    focusPlanet(
        object.mesh
    );

}


/* =========================================================
   INFO PANEL
========================================================= */

function updateInfoPanel(
    data
) {

    document
        .getElementById(
            "infoName"
        )
        .textContent =
        data.name.toUpperCase();


    document
        .getElementById(
            "infoType"
        )
        .textContent =
        data.type;


    document
        .getElementById(
            "infoDiameter"
        )
        .textContent =
        formatNumber(
            data.diameter
        ) +
        " KM";


    document
        .getElementById(
            "infoOrbit"
        )
        .textContent =
        formatNumber(
            data.orbitDays
        ) +
        " DAYS";


    document
        .getElementById(
            "infoRotation"
        )
        .textContent =
        formatNumber(
            Math.abs(
                data.rotationHours
            )
        ) +
        " H";


    document
        .getElementById(
            "infoGravity"
        )
        .textContent =
        data.gravity +
        " M/S²";


    document
        .getElementById(
            "infoTemperature"
        )
        .textContent =
        data.temperature +
        " °C";


    document
        .getElementById(
            "infoMoons"
        )
        .textContent =
        data.moons;


    document
        .getElementById(
            "infoDescription"
        )
        .textContent =
        data.description;


    document
        .getElementById(
            "infoPanel"
        )
        .classList
        .remove(
            "hidden"
        );

}


/* =========================================================
   CLOSE INFO
========================================================= */

function closeInfo() {

    document
        .getElementById(
            "infoPanel"
        )
        .classList
        .add(
            "hidden"
        );


    selectedPlanet =
        null;


    selectedPlanetData =
        null;


    document
        .querySelectorAll(
            ".planet-button"
        )
        .forEach(
            button =>
                button.classList
                    .remove(
                        "active"
                    )
        );


    document
        .getElementById(
            "targetName"
        )
        .textContent =
        "SOLAR SYSTEM";

}


/* =========================================================
   CAMERA FOCUS
========================================================= */

function focusPlanet(
    planet
) {

    const worldPosition =
        new THREE.Vector3();


    planet.getWorldPosition(
        worldPosition
    );


    const radius =
        planet.geometry
            .boundingSphere
            ?.radius ||
        1;


    const direction =
        new THREE.Vector3(
            1,
            0.45,
            1
        )
        .normalize();


    const destination =
        worldPosition
            .clone()
            .add(
                direction.multiplyScalar(
                    radius * 6 + 5
                )
            );


    const startPosition =
        camera.position.clone();


    const startTarget =
        controls.target.clone();


    const startTime =
        performance.now();


    const duration =
        1000;


    focusAnimation =
        true;


    function animateCamera(
        now
    ) {

        const progress =
            Math.min(
                (
                    now -
                    startTime
                ) /
                duration,
                1
            );


        const eased =
            easeInOutCubic(
                progress
            );


        camera.position.lerpVectors(

            startPosition,

            destination,

            eased

        );


        controls.target.lerpVectors(

            startTarget,

            worldPosition,

            eased

        );


        controls.update();


        if (
            progress < 1
        ) {

            requestAnimationFrame(
                animateCamera
            );

        } else {

            focusAnimation =
                false;

        }

    }


    requestAnimationFrame(
        animateCamera
    );

}


/* =========================================================
   RESET CAMERA
========================================================= */

function resetCamera() {

    const destination =
        new THREE.Vector3(
            40,
            28,
            58
        );


    const start =
        camera.position.clone();


    const startTarget =
        controls.target.clone();


    const endTarget =
        new THREE.Vector3(
            0,
            0,
            0
        );


    const startTime =
        performance.now();


    const duration =
        900;


    function animateReset(
        now
    ) {

        const progress =
            Math.min(
                (
                    now -
                    startTime
                ) /
                duration,
                1
            );


        const eased =
            easeInOutCubic(
                progress
            );


        camera.position.lerpVectors(

            start,

            destination,

            eased

        );


        controls.target.lerpVectors(

            startTarget,

            endTarget,

            eased

        );


        controls.update();


        if (
            progress < 1
        ) {

            requestAnimationFrame(
                animateReset
            );

        }

    }


    requestAnimationFrame(
        animateReset
    );


    closeInfo();

}


/* =========================================================
   PAUSE
========================================================= */

function togglePause() {

    isPaused =
        !isPaused;


    const icon =
        document.getElementById(
            "pauseIcon"
        );


    const text =
        document.getElementById(
            "pauseText"
        );


    if (
        isPaused
    ) {

        icon.textContent =
            "▶";


        text.textContent =
            "PLAY";

    } else {

        icon.textContent =
            "Ⅱ";


        text.textContent =
            "PAUSE";

    }

}


/* =========================================================
   PLANET MOTION
========================================================= */

function updatePlanets(
    delta
) {

    if (
        isPaused
    )
        return;


    /*
       This is intentionally an
       exploration-time simulation.

       1 real second =
       simulationSpeed × 2 days.

       Later we can replace this
       with JPL ephemeris calculations.
    */

    simulationDays +=
        delta *
        simulationSpeed *
        2;


    planetObjects.forEach(
        object => {

            const data =
                object.data;


            const angularVelocity =
                (
                    Math.PI * 2
                ) /
                data.orbitDays;


            object.angle +=
                angularVelocity *
                delta *
                simulationSpeed *
                2;


            const e =
                data.eccentricity;


            const radius =
                object.orbitRadius *
                (
                    1 -
                    e * e
                ) /
                (
                    1 +
                    e *
                    Math.cos(
                        object.angle
                    )
                );


            const inclination =
                THREE.MathUtils
                    .degToRad(
                        data.inclination
                    );


            object.mesh.position.x =
                radius *
                Math.cos(
                    object.angle
                );


            object.mesh.position.z =
                radius *
                Math.sin(
                    object.angle
                ) *
                Math.cos(
                    inclination
                );


            object.mesh.position.y =
                radius *
                Math.sin(
                    object.angle
                ) *
                Math.sin(
                    inclination
                );


            /*
               Planet rotation.

               Negative rotation periods
               indicate retrograde rotation.
            */

            const rotation =
                data.rotationHours;


            if (
                rotation !== 0
            ) {

                object.mesh.rotation.y +=

                    (
                        delta *
                        simulationSpeed *
                        0.5
                    ) *
                    (
                        rotation < 0
                            ? -1
                            : 1
                    );

            }

        }
    );

}


/* =========================================================
   MOON MOTION
========================================================= */

function updateMoons(
    delta
) {

    if (
        isPaused
    )
        return;


    moonObjects.forEach(
        object => {

            object.angle +=

                delta *
                simulationSpeed *
                object.data.speed;


            object.mesh.position.x =

                Math.cos(
                    object.angle
                ) *
                object.data.distance;


            object.mesh.position.z =

                Math.sin(
                    object.angle
                ) *
                object.data.distance;


            object.mesh.rotation.y +=
                delta *
                simulationSpeed;

        }
    );

}


/* =========================================================
   SUN ANIMATION
========================================================= */

function updateSun(
    delta
) {

    sun.rotation.y +=
        delta *
        0.05;


    const pulse =
        1 +
        Math.sin(
            performance.now() *
            0.0008
        ) *
        0.008;


    sun.scale.setScalar(
        pulse
    );

}


/* =========================================================
   DATE DISPLAY
========================================================= */

function updateDate() {

    const baseDate =
        new Date(
            "2026-01-01T00:00:00Z"
        );


    const date =
        new Date(
            baseDate.getTime() +
            simulationDays *
            86400000
        );


    const day =
        String(
            date.getUTCDate()
        )
        .padStart(
            2,
            "0"
        );


    const monthNames = [

        "JAN",
        "FEB",
        "MAR",
        "APR",
        "MAY",
        "JUN",
        "JUL",
        "AUG",
        "SEP",
        "OCT",
        "NOV",
        "DEC"

    ];


    const month =
        monthNames[
            date.getUTCMonth()
        ];


    const year =
        date.getUTCFullYear();


    document
        .getElementById(
            "simulationDate"
        )
        .textContent =
        `${day} ${month} ${year}`;

}


/* =========================================================
   RENDER LOOP
========================================================= */

function animate() {

    requestAnimationFrame(
        animate
    );


    const delta =
        Math.min(
            clock.getDelta(),
            0.05
        );


    updatePlanets(
        delta
    );


    updateMoons(
        delta
    );


    updateSun(
        delta
    );


    updateDate();


    controls.update();


    renderer.render(
        scene,
        camera
    );

}


/* =========================================================
   RESIZE
========================================================= */

function onResize() {

    camera.aspect =
        window.innerWidth /
        window.innerHeight;


    camera.updateProjectionMatrix();


    renderer.setSize(

        window.innerWidth,

        window.innerHeight

    );

}


/* =========================================================
   UTILITIES
========================================================= */

function formatNumber(
    number
) {

    return Number(
        number
    ).toLocaleString(
        "en-US",
        {
            maximumFractionDigits: 1
        }
    );

}


function easeInOutCubic(
    t
) {

    return t < 0.5

        ? 4 * t * t * t

        : 1 -
          Math.pow(
              -2 * t + 2,
              3
          ) /
          2;

}


/* =========================================================
   LOADING
========================================================= */

function updateLoading(
    percentage,
    text
) {

    const progress =
        document.getElementById(
            "loadingProgress"
        );


    const label =
        document.getElementById(
            "loadingText"
        );


    if (
        progress
    ) {

        progress.style.width =
            percentage + "%";

    }


    if (
        label
    ) {

        label.textContent =
            text;

    }

}