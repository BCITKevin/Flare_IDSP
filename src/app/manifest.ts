import { MetadataRoute } from "next";

const manifest = (): MetadataRoute.Manifest => {
  return {
    theme_color: "#222",
    background_color: "#222",
    display: "standalone",
    scope: "/",
    start_url: "/",
    name: "Flare",
    short_name: "Flare",
    description: "The Wildfire Alert App",
    icons: [
      {
        src: "/images/logo_Flare-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/images/logo_Flare-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
    ],
  };
};
export default manifest;