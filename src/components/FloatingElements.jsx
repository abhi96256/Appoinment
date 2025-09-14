import { useEffect, useState } from 'react';

const FloatingElements = () => {
  const [elements, setElements] = useState([]);

  useEffect(() => {
    const createElement = () => ({
      id: Math.random(),
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 4 + 2,
      speed: Math.random() * 0.5 + 0.1,
      direction: Math.random() * Math.PI * 2,
      opacity: Math.random() * 0.3 + 0.1,
      color: `hsl(${Math.random() * 60 + 200}, 70%, 60%)`
    });

    const initialElements = Array.from({ length: 20 }, createElement);
    setElements(initialElements);

    const animate = () => {
      setElements(prev => prev.map(element => {
        const newX = element.x + Math.cos(element.direction) * element.speed;
        const newY = element.y + Math.sin(element.direction) * element.speed;

        return {
          ...element,
          x: newX > window.innerWidth ? 0 : newX < 0 ? window.innerWidth : newX,
          y: newY > window.innerHeight ? 0 : newY < 0 ? window.innerHeight : newY,
        };
      }));
    };

    const interval = setInterval(animate, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {elements.map(element => (
        <div
          key={element.id}
          className="absolute rounded-full animate-pulse"
          style={{
            left: element.x,
            top: element.y,
            width: element.size,
            height: element.size,
            backgroundColor: element.color,
            opacity: element.opacity,
            boxShadow: `0 0 ${element.size * 2}px ${element.color}`,
          }}
        />
      ))}
    </div>
  );
};

export default FloatingElements;
