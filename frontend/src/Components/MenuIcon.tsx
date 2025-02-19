import { SvgIconComponent } from "@mui/icons-material";
import React from "react";

type icprops = {
  icon: React.ReactElement;
  text: string;
  url: string;
};

const Menuwithicon: React.FC<icprops> = ({ icon, text, url }) => {
  return (
    <a href={url} style={{ color: "white", textDecoration: "none" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 10,
          fontFamily: "monospace",
        }}
      >
        {icon}
        {text}
      </div>
    </a>
  );
};

export default Menuwithicon;
