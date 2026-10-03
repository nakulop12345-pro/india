import * as THREE from "three";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.180.0/examples/jsm/controls/OrbitControls.js";

import {
    PLANETS,
    SUN,
    MOONS,
    STAR_COLORS
} from "./data.js";

/* =========================================================
   SOLAR SYSTEM — BUILD 2
   REALISM / RENDERING ENGINE
   ========================================================= */

const canvas = document.getElementById("space");

const loadingScreen = document.getElementById("loadingScreen");
const loadingProgress = document.getElementById("loadingProgress");
const loadingText = document.getElementById("loadingText");

const planetButtons = document.getElementById("planetButtons");

const infoPanel = document.getElementById("infoPanel");
const closeInfo = document.getElementById("closeInfo");

const infoName = document.getElementById("infoName");
const infoType = document.getElementById("infoType");
const infoDiameter = document.getElementById("infoDiameter");
const infoOrbit = document.getElementById("infoOrbit");
const infoRotation = document.getElementById("infoRotation");
const infoGravity = document.getElementById("infoGravity");
const infoTemperature = document.getElementById("infoTemperature");
const infoMoons = document.getElementById("infoMoons");
const infoDescription = document.getElementById("infoDescription");

const focusButton = document.getElementById("focusButton");

const pauseButton = document.getElementById("pauseButton");
const pauseIcon = document.getElementById("pauseIcon");
const pauseText = document.getElementById("pauseText");

const resetCamera = document.getElementById("resetCamera");

const simulationDate = document.getElementById("simulationDate");
const simulationSpeed = document.getElementById("simulationSpeed");
const targetName = document.getElementById("targetName");


/* =========================================================
   ERROR HANDLING
   ========================================================= */

window.addEventListener("error", event => {
    console.error(event.error || event.message);

    if (loadingText) {
        loadingText.textContent =
            "ENGINE ERROR — CHECK CONSOLE";
    }
});

window.addEventListener("unhandledrejection", event => {
    console.error(event.reason);

    if (loadingText) {
        loadingText.textContent =
            "ENGINE ERROR — CHECK CONSOLE";
    }
});


/* =========================================================
   GLOBAL STATE
   ========================================================= */

let scene;
let camera;
let renderer;
let controls;
let clock;

let raycaster;
let pointer;

let solarSystem;

let sunObject;

const planetObjects = new Map();
const moonObjects = [];

let selectedPlanet = null;

let simulationPaused = false;
let timeSpeed = 1;

let simulationTime =
    new Date("2026-01-01T00:00:00Z");

let focusAnimation = null;

const defaultCameraPosition =
    new THREE.Vector3(0, 35, 72);

const defaultTarget =
    new THREE.Vector3(0, 0, 0);


/* =========================================================
   MATERIAL CACHE
   ========================================================= */

const materialCache = new Map();


/* =========================================================
   INITIALIZATION
   ========================================================= */

async function init() {

    updateLoading(5, "Creating rendering engine...");

    clock = new THREE.Clock();

    scene = new THREE.Scene();

    scene.background = new THREE.Color(0x000005);

    scene.fog = new THREE.FogExp2(
        0x000005,
        0.00075
    );

    updateLoading(10, "Building camera system...");

    createCamera();

    updateLoading(16, "Configuring high-quality renderer...");

    createRenderer();

    updateLoading(22, "Creating orbital environment...");

    createLighting();

    createStars();

    createNebulaDust();

    updateLoading(32, "Building Sun...");

    createSun();

    updateLoading(40, "Constructing planets...");

    createPlanets();

    updateLoading(58, "Creating planetary atmospheres...");

    createAtmospheres();

    updateLoading(66, "Creating moons...");

    createMoons();

    updateLoading(73, "Drawing orbital architecture...");

    createOrbitLines();

    updateLoading(80, "Creating navigation system...");

    createControls();

    createInteraction();

    createPlanetButtons();

    createUIEvents();

    updateLoading(92, "Calibrating simulation...");

    updateSimulationDate();

    updateLoading(100, "Solar system ready");

    setTimeout(() => {

    loadingScreen.style.opacity = "0";
    loadingScreen.style.pointerEvents = "none";

    setTimeout(() => {
        loadingScreen.style.display = "none";
    }, 700);

    animate();

}, 500);

/* =========================================================
   LOADING
   ========================================================= */

function updateLoading(progress, message) {

    if (loadingProgress) {
        loadingProgress.style.width =
            `${progress}%`;
    }

    if (loadingText) {
        loadingText.textContent = message;
    }
}


/* =========================================================
   CAMERA
   ========================================================= */

function createCamera() {

    camera = new THREE.PerspectiveCamera(
        55,
        window.innerWidth / window.innerHeight,
        0.01,
        5000
    );

    camera.position.copy(
        defaultCameraPosition
    );
}


/* =========================================================
   RENDERER
   ========================================================= */

function createRenderer() {

    renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: false,
        powerPreference: "high-performance"
    });

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );

    renderer.setPixelRatio(
        Math.min(window.devicePixelRatio, 2)
    );

    renderer.shadowMap.enabled = true;

    renderer.shadowMap.type =
        THREE.PCFSoftShadowMap;

    renderer.outputColorSpace =
        THREE.SRGBColorSpace;

    renderer.toneMapping =
        THREE.ACESFilmicToneMapping;

    renderer.toneMappingExposure = 1.15;

    renderer.useLegacyLights = false;
}


/* =========================================================
   LIGHTING
   ========================================================= */

function createLighting() {

    const ambient =
        new THREE.HemisphereLight(
            0x445577,
            0x050508,
            0.055
        );

    scene.add(ambient);

    const sunLight =
        new THREE.PointLight(
            0xffffff,
            3500,
            0,
            1.5
        );

    sunLight.position.set(
        0,
        0,
        0
    );

    sunLight.castShadow = true;

    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;

    sunLight.shadow.camera.near = 0.1;
    sunLight.shadow.camera.far = 1000;

    scene.add(sunLight);
}


/* =========================================================
   STAR FIELD
   ========================================================= */

function createStars() {

    const count = 24000;

    const positions =
        new Float32Array(count * 3);

    const colors =
        new Float32Array(count * 3);

    const sizes =
        new Float32Array(count);

    for (let i = 0; i < count; i++) {

        const radius =
            400 +
            Math.random() * 1800;

        const theta =
            Math.random() * Math.PI * 2;

        const phi =
            Math.acos(
                2 * Math.random() - 1
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

        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;

        const palette =
            STAR_COLORS ||
            [
                0xffffff,
                0xbfd8ff,
                0xffe8c2
            ];

        const color =
            new THREE.Color(
                palette[
                    Math.floor(
                        Math.random() *
                        palette.length
                    )
                ]
            );

        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;

        sizes[i] =
            0.35 +
            Math.random() * 1.5;
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

    geometry.setAttribute(
        "size",
        new THREE.BufferAttribute(
            sizes,
            1
        )
    );

    const material =
        new THREE.PointsMaterial({
            size: 0.65,
            vertexColors: true,
            transparent: true,
            opacity: 0.9,
            depthWrite: false,
            blending:
                THREE.AdditiveBlending
        });

    const stars =
        new THREE.Points(
            geometry,
            material
        );

    scene.add(stars);

    stars.userData.rotationSpeed =
        0.000012;

    solarSystem = stars;
}


/* =========================================================
   NEBULA DUST
   ========================================================= */

function createNebulaDust() {

    const count = 3500;

    const positions =
        new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {

        const radius =
            250 +
            Math.random() * 1000;

        const angle =
            Math.random() * Math.PI * 2;

        positions[i * 3] =
            Math.cos(angle) *
            radius;

        positions[i * 3 + 1] =
            (Math.random() - 0.5) *
            radius *
            0.35;

        positions[i * 3 + 2] =
            Math.sin(angle) *
            radius;
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

    const material =
        new THREE.PointsMaterial({
            color: 0x29364f,
            size: 1.4,
            transparent: true,
            opacity: 0.08,
            depthWrite: false,
            blending:
                THREE.AdditiveBlending
        });

    const dust =
        new THREE.Points(
            geometry,
            material
        );

    scene.add(dust);
}


/* =========================================================
   SUN
   ========================================================= */

function createSun() {

    const group =
        new THREE.Group();

    group.name = "Sun";

    const geometry =
        new THREE.SphereGeometry(
            SUN.size || 6,
            96,
            96
        );

    const material =
        new THREE.MeshBasicMaterial({
            color:
                SUN.color || 0xffcc55
        });

    const sun =
        new THREE.Mesh(
            geometry,
            material
        );

    group.add(sun);

    /*
     * Outer glow layers
     */

    const glow1 =
        createGlowSphere(
            (SUN.size || 6) * 1.18,
            0xffbb55,
            0.13
        );

    const glow2 =
        createGlowSphere(
            (SUN.size || 6) * 1.42,
            0xff9922,
            0.055
        );

    group.add(glow1);
    group.add(glow2);

    /*
     * Corona particles
     */

    const corona =
        createSunCorona(
            SUN.size || 6
        );

    group.add(corona);

    scene.add(group);

    sunObject = group;
}


function createGlowSphere(
    radius,
    color,
    opacity
) {

    const geometry =
        new THREE.SphereGeometry(
            radius,
            48,
            48
        );

    const material =
        new THREE.MeshBasicMaterial({
            color,
            transparent: true,
            opacity,
            depthWrite: false,
            blending:
                THREE.AdditiveBlending
        });

    return new THREE.Mesh(
        geometry,
        material
    );
}


function createSunCorona(radius) {

    const count = 1200;

    const positions =
        new Float32Array(
            count * 3
        );

    for (let i = 0; i < count; i++) {

        const r =
            radius *
            (
                1.0 +
                Math.random() * 0.65
            );

        const theta =
            Math.random() *
            Math.PI *
            2;

        const phi =
            Math.acos(
                2 * Math.random() - 1
            );

        positions[i * 3] =
            r *
            Math.sin(phi) *
            Math.cos(theta);

        positions[i * 3 + 1] =
            r *
            Math.cos(phi);

        positions[i * 3 + 2] =
            r *
            Math.sin(phi) *
            Math.sin(theta);
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

    const material =
        new THREE.PointsMaterial({
            color: 0xffc477,
            size: 0.07,
            transparent: true,
            opacity: 0.55,
            depthWrite: false,
            blending:
                THREE.AdditiveBlending
        });

    return new THREE.Points(
        geometry,
        material
    );
}


/* =========================================================
   PLANETS
   ========================================================= */

function createPlanets() {

    PLANETS.forEach((planet, index) => {

        const group =
            new THREE.Group();

        group.name =
            planet.name;

        const radius =
            planet.size || 1;

        const geometry =
            new THREE.SphereGeometry(
                radius,
                64,
                64
            );

        const material =
            createPlanetMaterial(
                planet
            );

        const mesh =
            new THREE.Mesh(
                geometry,
                material
            );

        mesh.castShadow = true;
        mesh.receiveShadow = true;

        mesh.userData.planet =
            planet;

        mesh.userData.type =
            "planet";

        group.add(mesh);

        /*
         * Axial tilt
         */

        group.rotation.z =
            THREE.MathUtils.degToRad(
                planet.inclination || 0
            );

        /*
         * Special planets
         */

        if (
            planet.name === "Saturn"
        ) {

            createSaturnRings(
                group,
                radius
            );
        }

        if (
            planet.name === "Jupiter"
        ) {

            createJupiterBands(
                group,
                radius
            );
        }

        scene.add(group);

        planetObjects.set(
            planet.name,
            {
                data: planet,
                group,
                mesh,
                angle:
                    index *
                    0.73,
                orbitRadius:
                    planet.distance ||
                    10
            }
        );
    });
}


/* =========================================================
   PLANET MATERIAL
   ========================================================= */

function createPlanetMaterial(
    planet
) {

    let color =
        planet.color ||
        0xaaaaaa;

    const material =
        new THREE.MeshStandardMaterial({
            color,
            roughness:
                planet.name === "Venus"
                    ? 0.8
                    : 0.65,
            metalness: 0,
            emissive:
                planet.name === "Jupiter"
                    ? color
                    : 0x000000,
            emissiveIntensity:
                planet.name === "Jupiter"
                    ? 0.035
                    : 0
        });

    return material;
}


/* =========================================================
   ATMOSPHERES
   ========================================================= */

function createAtmospheres() {

    const atmosphereData = {

        Earth: {
            color: 0x4ca3ff,
            scale: 1.12,
            opacity: 0.17
        },

        Venus: {
            color: 0xffc56b,
            scale: 1.08,
            opacity: 0.10
        },

        Mars: {
            color: 0xff6b35,
            scale: 1.06,
            opacity: 0.045
        },

        Uranus: {
            color: 0x77dfff,
            scale: 1.07,
            opacity: 0.08
        },

        Neptune: {
            color: 0x387cff,
            scale: 1.08,
            opacity: 0.11
        }
    };

    planetObjects.forEach(
        planetObject => {

            const data =
                atmosphereData[
                    planetObject.data.name
                ];

            if (!data) return;

            const radius =
                planetObject.data.size ||
                1;

            const atmosphere =
                createAtmosphere(
                    radius,
                    data
                );

            planetObject.group.add(
                atmosphere
            );
        }
    );
}


function createAtmosphere(
    radius,
    data
) {

    const geometry =
        new THREE.SphereGeometry(
            radius * data.scale,
            64,
            64
        );

    const material =
        new THREE.MeshBasicMaterial({
            color: data.color,
            transparent: true,
            opacity: data.opacity,
            side: THREE.BackSide,
            depthWrite: false,
            blending:
                THREE.AdditiveBlending
        });

    return new THREE.Mesh(
        geometry,
        material
    );
}


/* =========================================================
   JUPITER
   ========================================================= */

function createJupiterBands(
    group,
    radius
) {

    const bandColors = [
        0xc99c78,
        0xe7c7a0,
        0x9b6f52,
        0xd8b994,
        0xb87d5a,
        0xe1c49d
    ];

    bandColors.forEach(
        (color, index) => {

            const geometry =
                new THREE.TorusGeometry(
                    radius * 1.001,
                    radius * 0.025,
                    12,
                    96
                );

            const material =
                new THREE.MeshBasicMaterial({
                    color,
                    transparent: true,
                    opacity: 0.22,
                    depthWrite: false
                });

            const band =
                new THREE.Mesh(
                    geometry,
                    material
                );

            band.rotation.x =
                Math.PI / 2;

            band.scale.y =
                0.82 +
                index * 0.015;

            group.add(band);
        }
    );
}


/* =========================================================
   SATURN RINGS
   ========================================================= */

function createSaturnRings(
    group,
    radius
) {

    const ringGroup =
        new THREE.Group();

    const ringLayers = [
        {
            inner: radius * 1.35,
            outer: radius * 1.85,
            opacity: 0.58
        },
        {
            inner: radius * 1.88,
            outer: radius * 2.10,
            opacity: 0.42
        },
        {
            inner: radius * 2.13,
            outer: radius * 2.30,
            opacity: 0.25
        }
    ];

    ringLayers.forEach(
        layer => {

            const geometry =
                new THREE.RingGeometry(
                    layer.inner,
                    layer.outer,
                    160
                );

            const material =
                new THREE.MeshStandardMaterial({
                    color: 0xcdbb9c,
                    side:
                        THREE.DoubleSide,
                    transparent: true,
                    opacity:
                        layer.opacity,
                    roughness: 1
                });

            const ring =
                new THREE.Mesh(
                    geometry,
                    material
                );

            ring.rotation.x =
                Math.PI / 2;

            ringGroup.add(ring);
        }
    );

    ringGroup.rotation.z =
        THREE.MathUtils.degToRad(
            27
        );

    group.add(ringGroup);
}


/* =========================================================
   MOONS
   ========================================================= */

function createMoons() {

    const moonList = Array.isArray(MOONS)
        ? MOONS
        : Object.values(MOONS);

    moonList.forEach(
        moon => {

            const geometry =
                new THREE.SphereGeometry(
                    moon.size || 0.15,
                    32,
                    32
                );

            const material =
                new THREE.MeshStandardMaterial({
                    color:
                        moon.color ||
                        0xaaaaaa,
                    roughness: 0.95
                });

            const mesh =
                new THREE.Mesh(
                    geometry,
                    material
                );

            mesh.castShadow = true;

            mesh.userData.moon =
                moon;

            mesh.userData.type =
                "moon";

            scene.add(mesh);

            moonObjects.push({
                data: moon,
                mesh,
                angle:
                    Math.random() *
                    Math.PI *
                    2,
                speed:
                    moon.speed ||
                    0.01
            });
        }
    );
}

/* =========================================================
   ORBIT LINES
   ========================================================= */

function createOrbitLines() {

    PLANETS.forEach(
        planet => {

            const radius =
                planet.distance ||
                10;

            const curve =
                new THREE.EllipseCurve(
                    0,
                    0,
                    radius,
                    radius *
                    Math.sqrt(
                        1 -
                        Math.pow(
                            planet.eccentricity ||
                            0,
                            2
                        )
                    ),
                    0,
                    Math.PI * 2,
                    false,
                    0
                );

            const points =
                curve.getPoints(256);

            const positions =
                new Float32Array(
                    points.length * 3
                );

            points.forEach(
                (point, i) => {

                    positions[i * 3] =
                        point.x;

                    positions[i * 3 + 1] =
                        0;

                    positions[i * 3 + 2] =
                        point.y;
                }
            );

            const geometry =
                new THREE.BufferGeometry();

            geometry.setAttribute(
                "position",
                new THREE.BufferAttribute(
                    positions,
                    3
                )
            );

            const material =
                new THREE.LineBasicMaterial({
                    color: 0x52627a,
                    transparent: true,
                    opacity: 0.26
                });

            const line =
                new THREE.LineLoop(
                    geometry,
                    material
                );

            line.rotation.x =
                THREE.MathUtils.degToRad(
                    planet.inclination || 0
                );

            scene.add(line);
        }
    );
}


/* =========================================================
   CONTROLS
   ========================================================= */

function createControls() {

    controls =
        new OrbitControls(
            camera,
            renderer.domElement
        );

    controls.enableDamping = true;

    controls.dampingFactor =
        0.055;

    controls.rotateSpeed = 1.15;

    controls.zoomSpeed = 1.35;

    controls.panSpeed = 0.8;

    controls.minDistance = 2;

    controls.maxDistance = 1600;

    controls.target.copy(
        defaultTarget
    );
}


/* =========================================================
   INTERACTION
   ========================================================= */

function createInteraction() {

    raycaster =
        new THREE.Raycaster();

    pointer =
        new THREE.Vector2();

    window.addEventListener(
        "pointerdown",
        onPointerDown
    );
}


function onPointerDown(event) {

    if (
        event.target !==
        renderer.domElement
    ) {
        return;
    }

    pointer.x =
        (event.clientX /
            window.innerWidth) *
            2 -
        1;

    pointer.y =
        -(event.clientY /
            window.innerHeight) *
            2 +
        1;

    raycaster.setFromCamera(
        pointer,
        camera
    );

    const meshes = [];

    planetObjects.forEach(
        object => {
            meshes.push(
                object.mesh
            );
        }
    );

    const hits =
        raycaster.intersectObjects(
            meshes,
            false
        );

    if (!hits.length) return;

    const object =
        hits[0].object;

    const planet =
        object.userData.planet;

    if (planet) {

        selectPlanet(
            planet.name
        );
    }
}


/* =========================================================
   PLANET BUTTONS
   ========================================================= */

function createPlanetButtons() {

    if (!planetButtons) return;

    planetButtons.innerHTML = "";

    PLANETS.forEach(
        planet => {

            const button =
                document.createElement(
                    "button"
                );

            button.textContent =
                planet.name;

            button.dataset.planet =
                planet.name;

            button.addEventListener(
                "click",
                () => {

                    selectPlanet(
                        planet.name
                    );
                }
            );

            planetButtons.appendChild(
                button
            );
        }
    );
}


/* =========================================================
   PLANET SELECTION
   ========================================================= */

function selectPlanet(name) {

    const object =
        planetObjects.get(name);

    if (!object) return;

    selectedPlanet = object;

    showPlanetInfo(
        object.data
    );

    focusPlanet(object);
}


function showPlanetInfo(
    planet
) {

    if (!infoPanel) return;

    infoName.textContent =
        planet.name;

    infoType.textContent =
        planet.type || "Planet";

    infoDiameter.textContent =
        formatValue(
            planet.diameter,
            " km"
        );

    infoOrbit.textContent =
        formatValue(
            planet.orbitDays,
            " days"
        );

    infoRotation.textContent =
        formatValue(
            planet.rotationHours,
            " hours"
        );

    infoGravity.textContent =
        formatValue(
            planet.gravity,
            " m/s²"
        );

    infoTemperature.textContent =
        formatValue(
            planet.temperature,
            " °C"
        );

    infoMoons.textContent =
        planet.moons ?? 0;

    infoDescription.textContent =
        planet.description ||
        "No description available.";

    infoPanel.classList.add(
        "visible"
    );

    if (targetName) {
        targetName.textContent =
            planet.name.toUpperCase();
    }
}


function formatValue(
    value,
    suffix = ""
) {

    if (
        value === undefined ||
        value === null
    ) {
        return "—";
    }

    return `${value}${suffix}`;
}


/* =========================================================
   CAMERA FOCUS
   ========================================================= */

function focusPlanet(
    object
) {

    const worldPosition =
        new THREE.Vector3();

    object.group.getWorldPosition(
        worldPosition
    );

    const distance =
        Math.max(
            object.data.size * 7,
            5
        );

    const destination =
        worldPosition.clone().add(
            new THREE.Vector3(
                distance,
                distance * 0.35,
                distance
            )
        );

    focusAnimation = {
        start:
            camera.position.clone(),

        target:
            controls.target.clone(),

        destination,

        destinationTarget:
            worldPosition.clone(),

        progress: 0
    };
}


/* =========================================================
   CAMERA ANIMATION
   ========================================================= */

function updateCameraFocus() {

    if (!focusAnimation) return;

    const animation =
        focusAnimation;

    animation.progress +=
        0.025;

    const eased =
        easeInOutCubic(
            Math.min(
                animation.progress,
                1
            )
        );

    camera.position.lerpVectors(
        animation.start,
        animation.destination,
        eased
    );

    controls.target.lerpVectors(
        animation.target,
        animation.destinationTarget,
        eased
    );

    if (
        animation.progress >= 1
    ) {

        focusAnimation = null;
    }
}


function easeInOutCubic(t) {

    return t < 0.5
        ? 4 * t * t * t
        : 1 -
          Math.pow(
              -2 * t + 2,
              3
          ) / 2;
}


/* =========================================================
   UI EVENTS
   ========================================================= */

function createUIEvents() {

    if (closeInfo) {

        closeInfo.addEventListener(
            "click",
            () => {

                infoPanel.classList.remove(
                    "visible"
                );
            }
        );
    }

    if (focusButton) {

        focusButton.addEventListener(
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
    }

    if (resetCamera) {

        resetCamera.addEventListener(
            "click",
            resetView
        );
    }

    if (pauseButton) {

        pauseButton.addEventListener(
            "click",
            togglePause
        );
    }

    document.querySelectorAll(
        "[data-speed]"
    ).forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    timeSpeed =
                        Number(
                            button.dataset.speed
                        );

                    if (
                        simulationSpeed
                    ) {

                        simulationSpeed.textContent =
                            `${timeSpeed}×`;
                    }

                    document
                        .querySelectorAll(
                            "[data-speed]"
                        )
                        .forEach(
                            item =>
                                item.classList.remove(
                                    "active"
                                )
                        );

                    button.classList.add(
                        "active"
                    );
                }
            );
        }
    );

    window.addEventListener(
        "resize",
        onResize
    );
}


/* =========================================================
   PAUSE
   ========================================================= */

function togglePause() {

    simulationPaused =
        !simulationPaused;

    if (pauseText) {

        pauseText.textContent =
            simulationPaused
                ? "Resume"
                : "Pause";
    }

    if (pauseIcon) {

        pauseIcon.textContent =
            simulationPaused
                ? "▶"
                : "Ⅱ";
    }
}


/* =========================================================
   RESET
   ========================================================= */

function resetView() {

    focusAnimation = {
        start:
            camera.position.clone(),

        target:
            controls.target.clone(),

        destination:
            defaultCameraPosition.clone(),

        destinationTarget:
            defaultTarget.clone(),

        progress: 0
    };

    selectedPlanet = null;

    if (targetName) {
        targetName.textContent =
            "SOLAR SYSTEM";
    }

    if (infoPanel) {
        infoPanel.classList.remove(
            "visible"
        );
    }
}


/* =========================================================
   PLANET ORBIT MOTION
   ========================================================= */

function updatePlanets(delta) {

    if (simulationPaused) return;

    const speed =
        timeSpeed;

    planetObjects.forEach(
        object => {

            const planet =
                object.data;

            /*
             * Orbit speed is based on
             * orbital period.
             */

            const orbitDays =
                Number(
                    planet.orbitDays
                ) || 365;

            object.angle +=
                (
                    delta *
                    speed *
                    0.55
                ) /
                Math.sqrt(
                    orbitDays
                );

            const e =
                Number(
                    planet.eccentricity
                ) || 0;

            const a =
                object.orbitRadius;

            const b =
                a *
                Math.sqrt(
                    1 -
                    e * e
                );

            const x =
                Math.cos(
                    object.angle
                ) * a;

            const z =
                Math.sin(
                    object.angle
                ) * b;

            object.group.position.set(
                x,
                0,
                z
            );

            /*
             * Planet rotation.
             */

            const rotationHours =
                Number(
                    planet.rotationHours
                ) || 24;

            object.mesh.rotation.y +=
                delta *
                speed *
                (
                    24 /
                    Math.abs(
                        rotationHours
                    )
                ) *
                0.45;
        });
}


/* =========================================================
   MOON MOTION
   ========================================================= */

function updateMoons(delta) {

    if (simulationPaused) return;

    moonObjects.forEach(
        moon => {

            const data =
                moon.data;

            const parent =
                findMoonParent(
                    data
                );

            if (!parent) return;

            const parentPosition =
                parent.group.position;

            const distance =
                data.distance ||
                3;

            moon.angle +=
                delta *
                timeSpeed *
                moon.speed;

            moon.mesh.position.set(
                parentPosition.x +
                Math.cos(
                    moon.angle
                ) *
                distance,

                parentPosition.y,

                parentPosition.z +
                Math.sin(
                    moon.angle
                ) *
                distance
            );

            moon.mesh.rotation.y +=
                delta *
                0.4;
        }
    );
}


function findMoonParent(
    moon
) {

    const parentNames = {
        Moon: "Earth",
        Phobos: "Mars",
        Deimos: "Mars",
        Io: "Jupiter",
        Europa: "Jupiter",
        Ganymede: "Jupiter",
        Callisto: "Jupiter"
    };

    const name =
        parentNames[
            moon.name
        ];

    return name
        ? planetObjects.get(name)
        : null;
}


/* =========================================================
   SUN ANIMATION
   ========================================================= */

function updateSun(delta) {

    if (!sunObject) return;

    const pulse =
        1 +
        Math.sin(
            performance.now() *
            0.0008
        ) *
        0.008;

    sunObject.scale.setScalar(
        pulse
    );

    sunObject.rotation.y +=
        delta *
        0.025;
}


/* =========================================================
   DATE
   ========================================================= */

function updateSimulationDate() {

    if (!simulationDate) return;

    simulationDate.textContent =
        simulationTime
            .toISOString()
            .slice(0, 10);
}


function advanceSimulation(
    delta
) {

    if (simulationPaused) return;

    /*
     * One visual second represents
     * a number of simulated hours.
     */

    const simulatedHours =
        delta *
        timeSpeed *
        6;

    simulationTime =
        new Date(
            simulationTime.getTime() +
            simulatedHours *
            60 *
            60 *
            1000
        );

    updateSimulationDate();
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

    updatePlanets(delta);

    updateMoons(delta);

    updateSun(delta);

    advanceSimulation(
        delta
    );

    updateCameraFocus();

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

    renderer.setPixelRatio(
        Math.min(
            window.devicePixelRatio,
            2
        )
    );
}


/* =========================================================
   START
   ========================================================= */

init();