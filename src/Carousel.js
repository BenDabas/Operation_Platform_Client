import React, { useState, useEffect } from 'react';

// This assignment involves creating a React component called "Carousel" that takes in two props:
// "delay" and "children". The "children" prop should consist of multiple elements that will be cycled
// through automatically with a given delay time. The "Carousel" component should render the first child element
// and two buttons ("next" and "previous") to cycle through the child elements manually. The automatic cycling should reset
//when the buttons are clicked. Additionally, if there are less than two child elements, the component should not render anything.

const Carousel = ({ delay, children }) => {
  const [currentChildIndex, setCurrentChildIndex] = useState(0);

  const chidElements = React.Children.toArray(children);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentChildIndex((currentChildIndex) =>
        currentChildIndex + 1 < chidElements.length ? currentChildIndex + 1 : 0
      );
    }, delay);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const handleNext = () => {
    setCurrentChildIndex((currentChildIndex) =>
      currentChildIndex + 1 < chidElements.length ? currentChildIndex + 1 : 0
    );
    resetDelay();
  };

  const handlePrevious = () => {
    setCurrentChildIndex((currentChildIndex) =>
      currentChildIndex - 1 >= 0
        ? currentChildIndex - 1
        : chidElements.length - 1
    );
    resetDelay();
  };

  const resetDelay = () => {
    clearInterval(interval);
    const newInterval = setInterval(() => {
      setCurrentChildIndex((currentChildIndex) =>
        currentChildIndex + 1 < chidElements.length ? currentChildIndex + 1 : 0
      );
    }, delay);
    setInterval(newInterval);
  };

  if (chidElements.length < 2) {
    return null;
  }

  return (
    <div>
      {chidElements[currentChildIndex]}
      <div className="buttons">
        <button className="button-next" onClick={handleNext}>
          next
        </button>
        <button className="button-previous" onClick={handlePrevious}>
          previous
        </button>
      </div>
    </div>
  );
};

export default Carousel;
