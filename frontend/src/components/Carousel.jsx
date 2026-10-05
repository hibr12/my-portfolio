import { memo, useCallback, useRef, useState, useEffect } from 'react';
import ProjectCard from './ProjectCard.jsx';

const INITIAL_DELAY = 100;
const AUTO_SLIDE_INTERVAL = 10000;
const CLICK_DEBOUNCE = 300;

const Carousel = memo(function Carousel({ projects }) {
  const [slideIndex, setSlideIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [mouseDown, setMouseDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const timeoutRef = useRef(null);

  const updateSlideIndex = useCallback((index, preventTimerReset = false) => {
    if (animating) return;
    setAnimating(true);

    const newIndex = Math.max(0, Math.min(index, projects.length - 1));
    setSlideIndex(newIndex);

    if (!preventTimerReset && isAutoPlaying) {
      resetAutoTimer();
    }

    setTimeout(() => setAnimating(false), 600);
  }, [projects.length, isAutoPlaying]);

  const resetAutoTimer = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    timeoutRef.current = setTimeout(() => {
      setSlideIndex((i) => Math.min(i + 1, projects.length - 1));
    }, AUTO_SLIDE_INTERVAL);
  }, [isAutoPlaying]);

  const handlePrevClick = useCallback(() => {
    if (animating) return;
    setAnimating(true);
    const newIndex = slideIndex === 0 ? projects.length - 1 : slideIndex - 1;
    setSlideIndex(newIndex);
    resetAutoTimer();
    setTimeout(() => setAnimating(false), 600);
  }, [slideIndex, projects.length, isAutoPlaying, resetAutoTimer]);

  const handleNextClick = useCallback(() => {
    if (animating) return;
    setAnimating(true);
    const newIndex = slideIndex === projects.length - 1 ? 0 : slideIndex + 1;
    setSlideIndex(newIndex);
    resetAutoTimer();
    setTimeout(() => setAnimating(false), 600);
  }, [slideIndex, projects.length, isAutoPlaying, resetAutoTimer]);

  useEffect(() => {
    if (isHovered) return;
    resetAutoTimer();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isHovered, resetAutoTimer]);

  useEffect(() => {
    const onMouseEnter = () => {
      setIsHovered(true);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };

    const onMouseLeave = () => {
      setIsHovered(false);
      if (!animating) {
        resetAutoTimer();
      }
    };

    const carousel = document.querySelector('.projects-carousel');
    if (carousel) {
      carousel.addEventListener('mouseenter', onMouseEnter);
      carousel.addEventListener('mouseleave', onMouseLeave);
    }

    return () => {
      if (carousel) {
        carousel.removeEventListener('mouseenter', onMouseEnter);
        carousel.removeEventListener('mouseleave', onMouseLeave);
      }
    };
  }, [resetAutoTimer, animating]);

  const handleMouseMove = useCallback((e) => {
    if (!mouseDown) return;
    const deltaX = e.clientX - startX;
    const cardWidth = document.querySelector('.project-card')?.offsetWidth || 300;

    if (Math.abs(deltaX) > cardWidth / 2) {
      if (deltaX > 0) {
        handlePrevClick();
      } else {
        handleNextClick();
      }
      setMouseDown(false);
    }
  }, [handleNextClick, handlePrevClick]);

  const handleMouseUp = useCallback(() => {
    setMouseDown(false);
  }, []);

  useEffect(() => {
    const onMouseDown = (e) => {
      setMouseDown(true);
      setStartX(e.clientX);
    };

    const onMouseMove = (e) => {
      handleMouseMove(e);
    };

    const onMouseUp = () => {
      handleMouseUp();
    };

    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    return () => {
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  useEffect(() => {
    const onTouchStart = (e) => {
      setMouseDown(true);
      setStartX(e.touches[0].clientX);
    };

    const onTouchMove = (e) => {
      e.preventDefault();
      handleMouseMove(e);
    };

    const onTouchEnd = () => {
      handleMouseUp();
    };

    window.addEventListener('touchstart', onTouchStart, { passive: false });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd);

    return () => {
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [handleMouseMove]);

  const goToSlide = useCallback((index) => {
    if (animating) return;
    setAnimating(true);
    setSlideIndex(index);
    resetAutoTimer();
    setTimeout(() => setAnimating(false), 600);
  }, [slideIndex, projects.length, isAutoPlaying, resetAutoTimer]);

  const handleClick = useCallback((e) => {
    if (animating) return;
    setAnimating(true);
    resetAutoTimer();
    setTimeout(() => setAnimating(false), 400);
  }, [resetAutoTimer]);

  const slideStyle = {
    transform: `translateX(${-slideIndex * 100}%)`,
    transition: animating ? 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)' : 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
  };

  const cardStyle = {
    marginRight: '1.5rem',
    marginLeft: '1.5rem',
    flex: '0 0 auto',
  };

  if (projects.length === 0) {
    return null;
  }

  return (
    <section
      className="projects-carousel"
      style={{ overflow: 'hidden' }}
    >
      <div
        className="projects-carousel__track"
        style={slideStyle}
      >
        <div className="projects-carousel__slide" style={{ display: 'flex', transition: 'none' }}>
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id || project.title}
              project={project}
              style={cardStyle}
              index={index}
            />
          ))}
        </div>
      </div>

      <div className="projects-carousel__nav">
        <button
          className="projects-carousel__prev"
          onClick={handlePrevClick}
          aria-label="Previous project"
          disabled={animating}
        >
          ←
        </button>
        <button
          className="projects-carousel__next"
          onClick={handleNextClick}
          aria-label="Next project"
          disabled={animating}
        >
          →
        </button>
      </div>
    </section>
  );
});

Carousel.defaultProps = {
  projects: [],
};

export default Carousel;