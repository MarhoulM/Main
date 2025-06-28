import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./Header.css";
import "./DynamicImg.css";
import portfolioImg from "../Images/portfolioo.png";
import aboutImg from "../Images/about.png";
import contactImg from "../Images/contact.png";
import certificateImg from "../Images/certificate.png";
import downloadImg from "../Images/download.png";

const imageMap = {
  "/portfolio": portfolioImg,
  "/about": aboutImg,
  "/contact": contactImg,
  "/certs": certificateImg,
  "/downloads": downloadImg,
};

const DynamicImg = ({ hoveredPath }) => {
  const location = useLocation();
  const defaultPlaceholder =
    "https://placehold.co/192x192/FF6347/FFFFFF?text=Obrázek";

  const [displayedImage, setDisplayedImage] = useState(defaultPlaceholder);
  const [imageOpacity, setImageOpacity] = useState(1);

  useEffect(() => {
    let newImageSrc = "";

    if (hoveredPath) {
      newImageSrc = imageMap[hoveredPath] || defaultPlaceholder;
    } else {
      newImageSrc = imageMap[location.pathname] || defaultPlaceholder;
    }

    setImageOpacity(0);

    const timer = setTimeout(() => {
      setDisplayedImage(newImageSrc);
      setImageOpacity(1);
    }, 300);

    return () => clearTimeout(timer);
  }, [location.pathname, hoveredPath]);

  return (
    <>
      <img
        src={displayedImage}
        alt={displayedImage}
        className="dynamic-img-actual"
        style={{
          opacity: imageOpacity,
          transition: "opacity 0.3s ease-in-out",
        }}
      />
    </>
  );
};

export default DynamicImg;
