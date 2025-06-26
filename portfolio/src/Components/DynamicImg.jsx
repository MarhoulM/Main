import React from "react";
import "./Header.css";

const DynamicImg = () => {
  const image = "https://placehold.co/192x192/FF6347/FFFFFF?text=Obrázek";
  return (
    <>
      <img src={image} alt="Profilový obrázek" className="dynamic-img-actual" />
    </>
  );
};

export default DynamicImg;
