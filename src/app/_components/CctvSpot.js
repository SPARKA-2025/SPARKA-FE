// Normal
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
  const rotate = angle > -1 ? `rotate(${angle - 45}deg)` : undefined;

  // const offestStyle = ( offsetX.includes('-') ? ` -translate-x-[${offsetX}%] ` : ` translate-x-[${offsetX}%] ` ) + ( offsetY.includes('-') ? ` -translate-y-[${offsetX}%] ` : ` translate-y-[${offsetX}%] ` )

  return (
    <div
      id="CctvSpot"
      className={`relative flex justify-center items-center w-full h-full overflow-visible ${className}`}
      style={{
        translate: ` ${offsetX}% ${offsetY}% `,
      }}
    >
      {/* {angle > -1 ? ( */}
      <div
        style={{
          transform: rotate,
          transformOrigin: "bottom left",
        }}
        className={`absolute bottom-1/2 left-1/2 w-[200%] h-[200%] bg-red-300 rounded-tr-full opacity-80`}
      ></div>
      {isActive && (<div
        className="absolute rounded-full bg-red-500 opacity-75 animate-ping"
        style={{
          width: size,
          height: size,
        }}
      ></div>)}

      {/* // ) : (
      //   animate && (
      //     <div
      //       className="absolute rounded-full bg-green-500 opacity-75 animate-ping"
      //       style={{
      //         width: size,
      //         height: size,
      //       }}
      //     ></div>
      //   )
      // )} */}

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

// Psikopat
