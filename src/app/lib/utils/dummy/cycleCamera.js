function cycleCameras(cctvData) {
    let currentIndex = 0;
    let currentCameraIndex = 0;
  
    return function getNextCamera() {
      const currentCamera = cctvData[currentIndex].camera[currentCameraIndex];
      currentCameraIndex = (currentCameraIndex + 1) % cctvData[currentIndex].camera.length;
      if (currentCameraIndex === 0) {
        currentIndex = (currentIndex + 1) % cctvData.length;
      }
      return currentCamera;
    };
  }
  
  const getNextCamera = cycleCameras(cctvData);
