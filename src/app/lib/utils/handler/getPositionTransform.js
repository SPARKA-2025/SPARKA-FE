const getPositionTransform = ({x, y, columns, rows, direction}) => {
  const isLeftEdge = x === 0;
  const isRightEdge = x === columns - 1;
  const isTopEdge = y === 0;
  const isBottomEdge = y === rows - 1;

  // Tentukan apakah gateway berada di salah satu sudut
  const isTopLeft = isLeftEdge && isTopEdge;
  const isTopRight = isRightEdge && isTopEdge;
  const isBottomLeft = isLeftEdge && isBottomEdge;
  const isBottomRight = isRightEdge && isBottomEdge;

  const isCorner = isTopLeft || isTopRight || isBottomLeft || isBottomRight;

  // Atur transformasi default
  let translateX = "0";
  let translateY = "0";
  let rotate = "";

  if (isCorner) {
      console.log(direction)
    // Sudut spesifik: gunakan `direction` untuk orientasi
    if (direction === "horizontal") {
      translateX = isTopLeft || isBottomLeft ? "-50%" : "50%";
      translateY = isTopLeft || isTopRight ? "-50%" : "50%";
      rotate = ""; // Horizontal tidak perlu rotasi
    } else if (direction === "vertical") {
      translateX = isTopLeft || isBottomLeft ? "-50%" : "50%";
      translateY = isTopLeft || isTopRight ? "-50%" : "50%";
      rotate = "rotate(90deg)"; // Vertikal membutuhkan rotasi
    }
  } else {
    // Jika tidak berada di sudut, gunakan logika pinggir biasa
    translateX = isLeftEdge ? "-50%" : isRightEdge ? "50%" : "0";
    translateY = isTopEdge ? "-50%" : isBottomEdge ? "50%" : "0";
    rotate = isTopEdge || isBottomEdge ? "rotate(90deg)" : "";
  }

  return {
    transform: `translate(${translateX}, ${translateY}) ${rotate}`,
    isCorner,
    cornerType: isTopLeft
      ? "topLeft"
      : isTopRight
      ? "topRight"
      : isBottomLeft
      ? "bottomLeft"
      : isBottomRight
      ? "bottomRight"
      : null,
  };
};

export default getPositionTransform;
