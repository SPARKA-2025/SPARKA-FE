export default function CctvSpotEdit({
  angle = 0,
  isActive = false,
  onClick,
  size = 32,
  draggable = false,
  animate = false,
  className = "",
  offsetX = '0',
  offsetY = '0'
}) {
  // Mengatur rotasi penuh untuk slider 360 derajat
  const normalizedAngle = angle > -1 ? angle : 0;
  const rotate = `rotate(${normalizedAngle}deg)`;

  return (
    <div
      id="CctvSpot"
      className={`relative flex justify-center items-center w-full h-full overflow-visible ${className}`}
      style={{
        translate: ` ${offsetX}% ${offsetY}% `,
      }}
    >
      {/* Range area kamera CCTV */}
      <div
        style={{
          transform: rotate,
          transformOrigin: "bottom left",
        }}
        className={`absolute bottom-1/2 left-1/2 w-[200%] h-[200%] bg-red-300 rounded-tr-full opacity-80`}
      ></div>
      
      {/* Animasi ping saat aktif */}
      {isActive && (
        <div
          className="absolute rounded-full bg-red-500 opacity-75 animate-ping"
          style={{
            width: size,
            height: size,
          }}
        ></div>
      )}

      {/* Button CCTV */}
      <button
        onClick={onClick}
        draggable={draggable}
        className={`rounded-full bg-red-500 relative ${
          animate ? "" : "border-4 border-red-200"
        }`}
        style={{
          width: size,
          height: size,
        }}
      ></button>
    </div>
  );
}
