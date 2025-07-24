// Dummy CCTV data for development
const cctvDataDummy = [
  {
    id: 1,
    x: 1,
    y: 1,
    name: 'CCTV 1',
    url: 'http://localhost:8080/hls/camera1/index.m3u8',
    status: 'active'
  },
  {
    id: 2,
    x: 2,
    y: 1,
    name: 'CCTV 2',
    url: 'http://localhost:8080/hls/camera2/index.m3u8',
    status: 'active'
  },
  {
    id: 3,
    x: 1,
    y: 2,
    name: 'CCTV 3',
    url: 'http://localhost:8080/hls/camera3/index.m3u8',
    status: 'inactive'
  }
];

export default cctvDataDummy;