/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
      maxWidth:{
      container:"1440px",
      contentContainer:"1140px",
      containerSm:"1024px",
      containerXs:"768px"
    },
    extend: {
       screens:{
        xs:"320px",
        sm:"375px",
        sml:"500px",
        md:"667px",
        mdl:"800px",
        lg:"960px",
        lgl:"1024px",
        xl:"1280px"
      },
     fontFamily:{
      bodyFont:['Inter',],
      titleFont:['Poppins',],
     },
     colors:{
      textDark:"#8892b0",
      activeButton:'#218DFA',
      appBg:'#F5F7FB',
    },
    boxShadow:{
      listShadow: "0 5px 10px rgba(0, 0, 0, 0.2)",
    }
  },
  plugins: [require('tailwind-scrollbar'),],
}
}