import React from 'react';

const SecurityWatermark = ({ traineeInfo, className = '' }) => {
  const watermarkText = `${traineeInfo?.name} | ID: ${traineeInfo?.id} | ${new Date()?.toLocaleString()}`;
  
  // Generate multiple watermark instances for better coverage
  const generateWatermarks = () => {
    const watermarks = [];
    const rows = 8;
    const cols = 6;
    
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        watermarks?.push({
          id: `${row}-${col}`,
          top: `${(row * 100) / (rows - 1)}%`,
          left: `${(col * 100) / (cols - 1)}%`,
          rotation: row % 2 === 0 ? 45 : -45
        });
      }
    }
    
    return watermarks;
  };

  const watermarks = generateWatermarks();

  return (
    <div className={`fixed inset-0 pointer-events-none z-watermark overflow-hidden ${className}`}>
      {/* Main watermark pattern */}
      <div className="absolute inset-0 opacity-5">
        {watermarks?.map((mark) => (
          <div
            key={mark?.id}
            className="absolute text-xs font-medium text-foreground whitespace-nowrap select-none"
            style={{
              top: mark?.top,
              left: mark?.left,
              transform: `translate(-50%, -50%) rotate(${mark?.rotation}deg)`,
              fontFamily: 'monospace'
            }}
          >
            {watermarkText}
          </div>
        ))}
      </div>
      {/* Corner watermarks for extra security */}
      <div className="absolute top-4 left-4 opacity-10">
        <div className="text-xs font-medium text-foreground transform rotate-45 select-none">
          CONFIDENTIAL - {traineeInfo?.name}
        </div>
      </div>
      <div className="absolute top-4 right-4 opacity-10">
        <div className="text-xs font-medium text-foreground transform -rotate-45 select-none">
          TRAINING MATERIAL - ID: {traineeInfo?.id}
        </div>
      </div>
      <div className="absolute bottom-4 left-4 opacity-10">
        <div className="text-xs font-medium text-foreground transform -rotate-45 select-none">
          {new Date()?.toLocaleDateString()} - RESTRICTED
        </div>
      </div>
      <div className="absolute bottom-4 right-4 opacity-10">
        <div className="text-xs font-medium text-foreground transform rotate-45 select-none">
          TRAINEE ACCESS ONLY
        </div>
      </div>
      {/* Center watermark */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-3">
        <div className="text-lg font-bold text-foreground transform rotate-45 select-none">
          {traineeInfo?.name?.toUpperCase()}
        </div>
      </div>
    </div>
  );
};

export default SecurityWatermark;