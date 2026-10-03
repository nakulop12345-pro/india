/* =========================================================
   SOLAR SYSTEM DATA
========================================================= */

export const PLANETS = [

    {
        name: "Mercury",

        type: "TERRESTRIAL PLANET",

        diameter: 4879,

        distance: 57.9,

        orbitDays: 88.0,

        rotationHours: 1407.6,

        gravity: 3.7,

        temperature: 167,

        moons: 0,

        eccentricity: 0.206,

        inclination: 7.0,

        color: 0x8f8174,

        size: 0.55,

        orbitScale: 8,

        description:
            "The smallest planet and the closest planet to the Sun. Mercury has a heavily cratered surface and an extreme temperature range."
    },


    {
        name: "Venus",

        type: "TERRESTRIAL PLANET",

        diameter: 12104,

        distance: 108.2,

        orbitDays: 224.7,

        rotationHours: -5832.5,

        gravity: 8.9,

        temperature: 464,

        moons: 0,

        eccentricity: 0.007,

        inclination: 3.4,

        color: 0xd6b27a,

        size: 0.95,

        orbitScale: 11,

        description:
            "A world covered by a dense atmosphere and persistent clouds. Venus rotates retrograde and has the hottest planetary surface in the Solar System."
    },


    {
        name: "Earth",

        type: "TERRESTRIAL PLANET",

        diameter: 12756,

        distance: 149.6,

        orbitDays: 365.2,

        rotationHours: 23.9,

        gravity: 9.8,

        temperature: 15,

        moons: 1,

        eccentricity: 0.017,

        inclination: 0,

        color: 0x4d8fd1,

        size: 1.05,

        orbitScale: 14,

        description:
            "Our home world. Earth has extensive liquid water, a nitrogen-rich atmosphere, active geology and the only known biosphere."
    },


    {
        name: "Mars",

        type: "TERRESTRIAL PLANET",

        diameter: 6792,

        distance: 228.0,

        orbitDays: 687.0,

        rotationHours: 24.6,

        gravity: 3.7,

        temperature: -65,

        moons: 2,

        eccentricity: 0.094,

        inclination: 1.8,

        color: 0xb85638,

        size: 0.72,

        orbitScale: 18,

        description:
            "A cold, dusty terrestrial world with ancient valleys, enormous volcanoes and a thin atmosphere dominated by carbon dioxide."
    },


    {
        name: "Jupiter",

        type: "GAS GIANT",

        diameter: 142984,

        distance: 778.5,

        orbitDays: 4331,

        rotationHours: 9.9,

        gravity: 23.1,

        temperature: -110,

        moons: 95,

        eccentricity: 0.049,

        inclination: 1.3,

        color: 0xc9a27d,

        size: 2.65,

        orbitScale: 27,

        description:
            "The largest planet in the Solar System. Jupiter is a rapidly rotating gas giant with powerful atmospheric bands and a vast satellite system."
    },


    {
        name: "Saturn",

        type: "GAS GIANT",

        diameter: 120536,

        distance: 1432.0,

        orbitDays: 10747,

        rotationHours: 10.7,

        gravity: 9.0,

        temperature: -140,

        moons: 274,

        eccentricity: 0.052,

        inclination: 2.5,

        color: 0xd8c39b,

        size: 2.3,

        orbitScale: 35,

        description:
            "A gas giant famous for its extensive ring system. Saturn has a low average density and a large family of natural satellites."
    },


    {
        name: "Uranus",

        type: "ICE GIANT",

        diameter: 51118,

        distance: 2867.0,

        orbitDays: 30589,

        rotationHours: -17.2,

        gravity: 8.7,

        temperature: -195,

        moons: 28,

        eccentricity: 0.047,

        inclination: 0.8,

        color: 0x8fd3d8,

        size: 1.65,

        orbitScale: 43,

        description:
            "An ice giant with a striking blue-green atmosphere. Uranus has an extreme axial tilt and rotates in a highly unusual orientation."
    },


    {
        name: "Neptune",

        type: "ICE GIANT",

        diameter: 49528,

        distance: 4515.0,

        orbitDays: 59800,

        rotationHours: 16.1,

        gravity: 11.0,

        temperature: -200,

        moons: 16,

        eccentricity: 0.010,

        inclination: 1.8,

        color: 0x365ac5,

        size: 1.62,

        orbitScale: 51,

        description:
            "The outermost major planet. Neptune is a cold ice giant with an active atmosphere and some of the fastest winds measured on a planet."
    }

];


/* =========================================================
   SUN
========================================================= */

export const SUN = {

    name: "Sun",

    diameter: 1392700,

    temperature: 5500,

    color: 0xffbd45,

    size: 5.0

};


/* =========================================================
   MAJOR MOONS
========================================================= */

export const MOONS = {

    Earth: [

        {
            name: "Moon",
            distance: 2.2,
            size: 0.28,
            speed: 1.0,
            color: 0xb7b7b7
        }

    ],

    Mars: [

        {
            name: "Phobos",
            distance: 1.35,
            size: 0.09,
            speed: 2.5,
            color: 0x817b72
        },

        {
            name: "Deimos",
            distance: 1.7,
            size: 0.06,
            speed: 1.6,
            color: 0x9b9389
        }

    ],

    Jupiter: [

        {
            name: "Io",
            distance: 3.7,
            size: 0.18,
            speed: 1.7,
            color: 0xd7bd70
        },

        {
            name: "Europa",
            distance: 4.5,
            size: 0.16,
            speed: 1.25,
            color: 0xd8d4c4
        },

        {
            name: "Ganymede",
            distance: 5.5,
            size: 0.25,
            speed: 0.9,
            color: 0x9c968b
        },

        {
            name: "Callisto",
            distance: 6.7,
            size: 0.23,
            speed: 0.65,
            color: 0x70685e
        }

    ]

};


/* =========================================================
   STAR COLORS
========================================================= */

export const STAR_COLORS = [

    0xffffff,

    0xdce9ff,

    0xfff1d0,

    0xb8d5ff,

    0xffd8b0

];