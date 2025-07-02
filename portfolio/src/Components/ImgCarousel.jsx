import React, { useState } from "react";
import "./ImgCarousel.css";
import arrld from "../Images/arrow-left-dark.svg";
import arrll from "../Images/arrow-left.svg";
import arrrd from "../Images/arrow-right-dark.svg";
import arrrl from "../Images/arrow-right.svg";
import circl from "../Images/circle-light.svg";
import circd from "../Images/circle.svg";

const ImgCarousel = ({ images, theme }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  console.log("Aktuální téma v ImgCarousel:", theme);
  const goToPrevious = () => {
    const isFirstImg = currentIndex === 0;
    const newIndex = isFirstImg ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const isLastImg = currentIndex === images.length - 1;
    const newIndex = isLastImg ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const goToSlide = (slideIndex) => {
    setCurrentIndex(slideIndex);
  };

  if (!images || images.length === 0) {
    return (
      <div className="text-center text-gray-500 p-4">
        Žádné obrázky k zobrazení.
      </div>
    );
  }

  return (
    <div className="carousel-container">
      <div className="carousel-image-wrapper">
        <img
          src={images[currentIndex]}
          alt={`Carousel image${currentIndex + 1}`}
          className="carousel-image"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              "https://placehold.co/250x200/cccccc/333333?text=Chyba+obrazku";
          }}
        />
      </div>
      <div className="nav-button-container">
        <button
          onClick={goToPrevious}
          className="carousel-nav-button left"
          aria-label="Previous image"
        >
          {theme === "light" ? (
            <img className="arrow-icon" src={arrld} alt="Arrow left dark" />
          ) : (
            <img className="arrow-icon" src={arrll} alt="Arrow left light" />
          )}
        </button>
        {images.map((_, slideIndex) => (
          <button
            key={slideIndex}
            onClick={() => goToSlide(slideIndex)}
            className={`carousel-dot ${
              currentIndex === slideIndex ? "active" : ""
            }`}
            aria-label={`Go to slide ${slideIndex + 1}`}
          >
            {theme === "light" ? (
              <img className="circle-icon" src={circd} alt="circle dark" />
            ) : (
              <img className="circle-icon" src={circl} alt="circle light" />
            )}
          </button>
        ))}
        <button
          onClick={goToNext}
          className="carousel-nav-button right"
          aria-label="Next image"
        >
          {theme === "light" ? (
            <img className="arrow-icon" src={arrrd} alt="Arrow right dark" />
          ) : (
            <img className="arrow-icon" src={arrrl} alt="Arrow right light" />
          )}
        </button>
      </div>
    </div>
  );
};

export default ImgCarousel;
