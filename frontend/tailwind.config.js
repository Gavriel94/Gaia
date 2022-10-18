const plugin = require("tailwindcss/plugin")

const Rotate = plugin(function ({ addUtilities }) {
    addUtilities({
        ".rotate-y-180": {
            transform: "rotateY(180deg)",
        },
        ".preserve": {
            transformStyle: "preserve-3d"
        },
        ".perspective": {
            perspective: "1000px"
        },
        ".hide-back": {
            backfaceVisibility: "hidden",
        },
    });
});

module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,}", './public/index.html'
    ],
    darkMode: 'class',
    theme: {
        spacing: {
            px: '1px',
            0: '0',
            0.5: '0.125rem',
            1: '0.25rem',
            1.5: '0.375rem',
            2: '0.5rem',
            2.5: '0.625rem',
            3: '0.75rem',
            3.5: '0.875rem',
            4: '1rem',
            5: '1.25rem',
            6: '1.5rem',
            7: '1.75rem',
            8: '2rem',
            9: '2.25rem',
            10: '2.5rem',
            11: '2.75rem',
            12: '3rem',
            14: '3.5rem',
            16: '4rem',
            20: '5rem',
            24: '6rem',
            28: '7rem',
            32: '8rem',
            36: '9rem',
            40: '10rem',
            44: '11rem',
            48: '12rem',
            52: '13rem',
            56: '14rem',
            58: '14.5rem',
            60: '15rem',
            62: '15.5rem',
            64: '16rem',
            72: '18rem',
            80: '20rem',
            88: '22rem',
            96: '24rem',
            100: '25rem',
            108: '27rem',
            124: '31rem',
            186: '46.5rem',
            200: '50rem',
            224: '56rem',
            248: '62rem',
        },
        // light-white and dark-grey are bg colours for light and dark mode
        colors: {
            "light-orange": "#F08A12",
            "light-white": "#FFF8F0",
            "light-green": "#3AF41",
            "light-red": "#720E07",
            "light-purple": "#0F0326",
            "dark-orange": "#CC5500",
            "dark-grey": "#212121",
            "dark-silver": "#C1BCAC",
            "black": "#000000",
            "light-orange-hover": "#F4AC57",
            "dark-orange-hover": "#FF974D",
            "white": "#FFFFFF",
        },
        extend: {
            fontFamily: {
                'montserrat': ['montserrat', 'sans-serif']
            },
            fontSize: {
                14: "14px",
                12: "12px",
                10: "10px",
            },
            // ? Kept just for gradient reference
            // backgroundImage: (theme) => ({
            //     "cd-light": `linear-gradient(to top, ${theme("colors.blue")}, ${theme(
            //         "colors.white"
            //     )})`,
            //     "cd-dark": `linear-gradient(to top, ${theme(
            //         "colors.dark-blue"
            //     )}, ${theme("colors.gray")})`,
            //     "eth-light": `linear-gradient(to top, ${theme("colors.gray")}, ${theme(
            //         "colors.white"
            //     )})`,
            //     "eth-dark": `linear-gradient(to top, ${theme(
            //         "colors.dark-gray"
            //     )}, ${theme("colors.gray")})`,
            //     "sol-light": `linear-gradient(to top, ${theme(
            //         "colors.purple"
            //     )}, ${theme("colors.green")})`,
            //     "sol-dark": `linear-gradient(to top, ${theme(
            //         "colors.dark-purple"
            //     )}, ${theme("colors.dark-green")})`,
            // }),
            borderWidth: {
                1: "1px",
                2: "2px",
            },
            borderColor: {
                color: "rgba(0, 0, 0, 0.1)",
            },
            width: {
                400: "400px",
                760: "760px",
                780: "780px",
                800: "800px",
                1000: "1000px",
                1200: "1200px",
                1400: "1400px",
            },
            height: {
                80: "80px",
            },
            minHeight: {
                590: "590px",
            },
            backgroundColor: {
                color: '#000000',
            }
        },
    },
    plugins: [
        Rotate,
    ],
};
