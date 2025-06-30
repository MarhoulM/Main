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
    "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";

  const [displayedImage, setDisplayedImage] = useState(defaultPlaceholder);
  const [imageOpacity, setImageOpacity] = useState(1);

  useEffect(() => {
    Object.values(imageMap).forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  useEffect(() => {
    let newImageSrc = "";
    let targetPath = hoveredPath || location.pathname;

    if (location.pathname === "/" || location.pathname === "/portfolio") {
      if (hoveredPath === "/" || hoveredPath === "/portfolio") {
        targetPath = "/portfolio";
      } else if (!hoveredPath) {
        targetPath = "/portfolio";
      }
    }

    newImageSrc = imageMap[targetPath] || defaultPlaceholder;

    let skipTransition = false;
    const isCurrentPathPortfolioLike =
      location.pathname === "/" || location.pathname === "/portfolio";
    const isTargetPathPortfolioLike =
      targetPath === "/" || targetPath === "/portfolio";

    if (hoveredPath !== null) {
      if (
        (isCurrentPathPortfolioLike && isTargetPathPortfolioLike) ||
        targetPath === location.pathname
      ) {
        const imageForCurrentLocation =
          imageMap[location.pathname] ||
          (isCurrentPathPortfolioLike
            ? imageMap["/portfolio"]
            : defaultPlaceholder);

        if (
          newImageSrc === displayedImage &&
          displayedImage === imageForCurrentLocation
        ) {
          skipTransition = true;
        }
      }
    } else {
      const imageForCurrentLocation =
        imageMap[location.pathname] ||
        (isCurrentPathPortfolioLike
          ? imageMap["/portfolio"]
          : defaultPlaceholder);
      if (displayedImage === imageForCurrentLocation) {
        skipTransition = true;
      }
    }

    if (!skipTransition) {
      setImageOpacity(0);

      const timer = setTimeout(() => {
        setDisplayedImage(newImageSrc);
        setImageOpacity(1);
      }, 300);

      return () => clearTimeout(timer);
    } else {
      if (displayedImage !== newImageSrc) {
        setDisplayedImage(newImageSrc);
      }
      setImageOpacity(1);
    }
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
