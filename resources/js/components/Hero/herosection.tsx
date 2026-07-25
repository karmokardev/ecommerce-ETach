import React from 'react';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';

interface SliderImage {
    id?: number;
    image: string;
}

interface HeroSettings {
    slider_images?: SliderImage[];
    slider_enabled?: string;
    auto_slide_interval?: number;
}

interface Props {
    settings?: HeroSettings;
}

const HeroSection: React.FC<Props> = ({ settings }) => {
  const isEnabled = settings?.slider_enabled === 'true';
  const sliderImages = settings?.slider_images || [];
  const autoSlideInterval = settings?.auto_slide_interval || 3000;
  
  if (!isEnabled || sliderImages.length === 0) {
    return null;
  }

  return (
    <section className="relative w-full">
      <div className="relative w-full h-[200px] sm:h-full md:h-full lg:h-full xl:h-full">
        <Carousel
          autoPlay
          infiniteLoop
          interval={autoSlideInterval}
          showThumbs={false}
          showStatus={false}
          showArrows={true}
          swipeable={true}
          emulateTouch={true}
          className="hero-carousel"
          renderArrowPrev={(onClickHandler, hasPrev, label) => (
            <button
              type="button"
              onClick={onClickHandler}
              disabled={!hasPrev}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-gray-800 p-2 sm:p-3 rounded-full shadow-lg transition-all disabled:opacity-50"
              aria-label={label}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          renderArrowNext={(onClickHandler, hasNext, label) => (
            <button
              type="button"
              onClick={onClickHandler}
              disabled={!hasNext}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-gray-800 p-2 sm:p-3 rounded-full shadow-lg transition-all disabled:opacity-50"
              aria-label={label}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        >
          {sliderImages.map((slide, index) => (
            <div key={index} className="relative w-full h-[200px] sm:h-full md:h-full lg:h-full xl:h-full">
              <img
                src={slide.image}
                alt={`Slide ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </Carousel>
      </div>
    </section>
  );
};

export default HeroSection;
