import type { Config } from "tailwindcss";
export default {
  content: ["./src/app/**/*.{js,ts,jsx,tsx,mdx}","./src/components/**/*.{js,ts,jsx,tsx,mdx}","./src/lib/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: { extend: {
    colors: { cream:"#FFF7E6", bootred:"#B91C1C", bootgold:"#F59E0B", bootbrown:"#7C2D12", ink:"#111827" },
    boxShadow: { soft: "0 6px 24px rgba(17,24,39,0.08)" },
    borderRadius: { "2xl": "1.25rem" },
    fontFamily: { display:["ui-serif","Georgia","serif"], body:["ui-sans-serif","system-ui","Segoe UI","Roboto","Arial","sans-serif"] },
  } },
  plugins: [],
} satisfies Config;
