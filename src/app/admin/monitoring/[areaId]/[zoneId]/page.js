"use client";

import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "@components/Sidebar";
import fetchApi from "@/app/lib/fetch/fetchApi";
import Hls from "hls.js";
import ZoominIcon from "@icon/zoom-in.svg";
import ZoomoutIcon from "@icon/zoom-out.svg"
import SlotArea from "@/app/_components/SlotArea";
import { useRouter } from "next/navigation";
import { toast, Toaster } from 'react-hot-toast';

export default function Main({ params }) {
  const [slotActive, setSlotActive] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [partData, setPartData] = useState([]);
  const [slotData, setSlotData] = useState([]);
  const [gatewayData, setGatewayData] = useState([]);
  const [cctvData, setCctvData] = useState([]);
  const [activeMap, setActiveMap] = useState(null);
  const [activeCam, setActiveCam] = useState({
    url: 'http:///34.128.83.137:8080/hls/ruang_1a/index.m3u8'
  });
  const { areaId, zoneId } = params;

  const [camZoom, setCamZoom] = useState(false)
  const [player, setPlayer] = useState(null);
  const videoElement = React.createRef();
  const [streamingUrl, setStreamingUrl] = useState(null);
  const [streamStatus, setStreamStatus] = useState('inactive');
  const [isStartingStream, setIsStartingStream] = useState(false);

  const router = useRouter()

  // Fetch part data
  useEffect(() => {
    fetchApi({
      method: "get",
      endpoint: `/admin/part/${zoneId}/get-parts-data`,
    }).then((resp) => {
      setPartData(resp);
      setActiveMap(resp[0]); // Default part map
    });
  }, []);

  useEffect(() => {
    // This useEffect is now handled by the video ref callback
    // to avoid direct URL access and CORS issues
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCam, showCamera]);

    useEffect(() => {
      if (videoElement.current) {
        videoElement.current.play();
      }
    }, [videoElement]);

  useEffect(() => {
    console.log(slotActive)
    if(slotActive?.id?.includes('cctv')) setActiveCam(slotActive)
  }, [slotActive]);

  // Fetch data for slots, gateways, and CCTV based on the active map
  useEffect(() => {
    if (activeMap?.id) {
      fetchApi({
        method: "get",
        endpoint: `/admin/slot-parkir/${activeMap.id}/${zoneId}/get-slot-on-part`,
      }).then((resp) => setSlotData(resp.slots));

      fetchApi({
        method: "get",
        endpoint: `/admin/gateway/${activeMap.id}/${zoneId}/get-gateway-on-part`,
      }).then((resp) => {
        console.log(`gateway:\n\n${JSON.stringify(resp.gateways)}`);
        setGatewayData(resp.gateways || []);
      }).catch((error) => {
        console.error('Error fetching gateway data:', error);
        setGatewayData([]);
      });

      fetchApi({
        method: "get",
        endpoint: `/admin/cctv/${activeMap.id}/${zoneId}/${areaId}/get-cctv-on-part`,
      }).then(async (resp) => {
        console.log(`cctv:\n\n${JSON.stringify(resp.cctvs)}`)
        const data = resp.cctvs
        setCctvData(data)
        
        // Check if data exists and has at least one item before accessing data[0]
        if (data && data.length > 0) {
          const firstCctv = data[0];
          setActiveCam({
            id: 'cctv-' + firstCctv.id,
            ...firstCctv
          })
          
          // Get streaming URL for the first CCTV
          if (needsConversion(firstCctv.url)) {
            // RTSP URLs need conversion
            const streamUrl = await getStreamingUrl(firstCctv.id);
            if (streamUrl && isValidStreamUrl(streamUrl)) {
              setStreamingUrl(streamUrl);
              // Trigger AI processing for converted stream
              await triggerAIProcessing(firstCctv.id, streamUrl);
            } else {
              setStreamingUrl(null);
              if (streamUrl) {
                console.warn('Invalid converted stream URL:', streamUrl);
              }
            }
          } else if (canPlayDirectly(firstCctv.url)) {
            // YouTube and HTTP URLs can be played directly
            setStreamingUrl(firstCctv.url);
            console.log('Using direct stream URL:', firstCctv.url);
            // Trigger AI processing for direct stream
            await triggerAIProcessing(firstCctv.id, firstCctv.url);
          } else {
            console.warn('Unsupported CCTV URL format:', firstCctv.url);
            setStreamingUrl(null);
          }
        } else {
          console.warn('No CCTV data available for this zone')
          setActiveCam(null)
          setStreamingUrl(null);
        }
      }).catch((error) => {
        console.error('Error fetching CCTV data:', error)
        setCctvData([])
        setActiveCam(null)
        setStreamingUrl(null);
      });
    }
  }, [activeMap]);

  const handleSlotClick = (blockData) => {
    setSlotActive(blockData)
  }

  const youtubeLoopSrc = (url) => {
    if (!url) return null;
  
    // Handle YouTube live streams
    if (url.includes("youtube.com/live/") || url.includes("youtu.be/live/")) {
      const videoId = url.includes("youtube.com/live/") 
        ? url.split("/live/")[1]?.split("?")[0]
        : url.split("/live/")[1]?.split("?")[0];
      
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=1&rel=0`;
      }
    }
  
    // Handle regular YouTube videos
    if (url.includes("youtu.be/") && !url.includes("/live/")) {
      const videoId = url.split("youtu.be/")[1]?.split("?")[0];
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=1&rel=0`;
      }
    }

    // Handle youtube.com/watch URLs
    if (url.includes("youtube.com/watch")) {
      const urlParams = new URLSearchParams(url.split('?')[1]);
      const videoId = urlParams.get('v');
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=1&rel=0`;
      }
    }
  
    return null;
  };

  const isRtspUrl = (url) => {
    return url && url.toLowerCase().startsWith('rtsp://');
  };

  const isValidStreamUrl = (url) => {
    if (!url) return false;
    
    // Allow all HTTP/HTTPS URLs (including YouTube, external streams)
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return true;
    }
    
    // Allow RTSP URLs (will be converted by backend)
    if (isRtspUrl(url)) {
      return true;
    }
    
    return false;
  };

  const needsConversion = (url) => {
    // Only RTSP URLs need conversion
    return isRtspUrl(url);
  };

  const canPlayDirectly = (url) => {
    // YouTube URLs and HTTP streams can be played directly
    return url && (url.includes('youtube.com') || url.includes('youtu.be') || url.includes('.m3u8') || url.startsWith('http'));
  };

  const getStreamingUrl = async (cctvId) => {
    try {
      const response = await fetchApi({
        method: "get",
        endpoint: `/admin/streaming/url/${cctvId}`,
      });
      
      if (response.success) {
        setStreamingUrl(response.streaming_url);
        setStreamStatus(response.stream_active ? 'active' : 'inactive');
        return response.streaming_url;
      }
    } catch (error) {
      console.error('Error getting streaming URL:', error);
    }
    return null;
  };

  const startRtspStream = async (cctvId) => {
    setIsStartingStream(true);
    try {
      const response = await fetchApi({
        method: "post",
        endpoint: `/admin/streaming/start`,
        data: { cctv_id: cctvId }
      });
      
      if (response.success) {
        toast.success('Stream started successfully');
        setStreamingUrl(response.hls_url);
        setStreamStatus('active');
        // Trigger AI processing for RTSP stream
        await triggerAIProcessing(cctvId, response.hls_url);
        return response.hls_url;
      } else {
        toast.error(response.message || 'Failed to start stream');
      }
    } catch (error) {
      console.error('Error starting stream:', error);
      toast.error('Error starting stream');
    } finally {
      setIsStartingStream(false);
    }
    return null;
  };

  const stopRtspStream = async (cctvId) => {
    try {
      const response = await fetchApi({
        method: "post",
        endpoint: `/admin/streaming/stop`,
        data: { cctv_id: cctvId }
      });
      
      if (response.success) {
        toast.success('Stream stopped successfully');
        setStreamingUrl(null);
        setStreamStatus('inactive');
      } else {
        toast.error(response.message || 'Failed to stop stream');
      }
    } catch (error) {
      console.error('Error stopping stream:', error);
      toast.error('Error stopping stream');
    }
  };

  const triggerAIProcessing = async (cctvId, streamUrl) => {
    try {
      // Debug logging to see what values are being sent
      console.log('triggerAIProcessing called with:', {
        cctvId: cctvId,
        cctvIdType: typeof cctvId,
        streamUrl: streamUrl,
        streamUrlType: typeof streamUrl,
        isValidCctvId: cctvId !== null && cctvId !== undefined && !isNaN(cctvId),
        isValidStreamUrl: streamUrl !== null && streamUrl !== undefined && streamUrl.trim() !== ''
      });
      
      // Validate parameters before sending
      if (!cctvId || isNaN(cctvId)) {
        console.error('Invalid cctv_id:', cctvId);
        return;
      }
      
      if (!streamUrl || typeof streamUrl !== 'string' || streamUrl.trim() === '') {
        console.error('Invalid stream_url:', streamUrl);
        return;
      }
      
      const requestData = { 
        cctv_id: parseInt(cctvId),
        stream_url: streamUrl.trim()
      };
      
      console.log('Sending request data:', requestData);
      
      const response = await fetchApi({
        method: "post",
        endpoint: `/admin/streaming/trigger-ai`,
        data: requestData
      });
      
      if (response.success) {
        console.log('AI processing triggered for:', streamUrl);
      } else {
        console.warn('Failed to trigger AI processing:', response.message);
      }
    } catch (error) {
      console.error('Error triggering AI processing:', error);
    }
  };

  const handleCameraClick = async (camera) => {
    setActiveCam({
      id: 'cctv-' + camera.id,
      ...camera
    })
    
    // Get streaming URL for the selected camera
    if (needsConversion(camera.url)) {
      // RTSP URLs need conversion
      const streamUrl = await getStreamingUrl(camera.id);
      if (streamUrl && isValidStreamUrl(streamUrl)) {
        setStreamingUrl(streamUrl);
        // Trigger AI processing for converted stream
        await triggerAIProcessing(camera.id, streamUrl);
      } else {
        setStreamingUrl(null);
        if (streamUrl) {
          console.warn('Invalid converted stream URL:', streamUrl);
        }
      }
    } else if (canPlayDirectly(camera.url)) {
      // YouTube and HTTP URLs can be played directly
      setStreamingUrl(camera.url);
      console.log('Using direct stream URL:', camera.url);
      // Trigger AI processing for direct stream
      await triggerAIProcessing(camera.id, camera.url);
    } else {
      console.warn('Unsupported camera URL format:', camera.url);
      setStreamingUrl(null);
    }
  }
  
  
  return (
    <main className="bg-[#EDEEF0] min-h-screen w-full flex flex-col overflow-y-auto pt-[10%]">
      <div className="flex flex-col w-full px-[2%] pb-[10%] space-y-4">
        {/* Keterangan Slot Parkir */}
        <div className="flex w-full justify-center mb-4">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-4xl">
            <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">Keterangan Status Slot Parkir</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="w-6 h-6 bg-green-500 rounded border-2 border-green-600"></div>
                <div>
                  <span className="font-semibold text-green-700">Kosong</span>
                  <p className="text-xs text-green-600">Tersedia untuk parkir</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                <div className="w-6 h-6 bg-red-500 rounded border-2 border-red-600"></div>
                <div>
                  <span className="font-semibold text-red-700">Terisi</span>
                  <p className="text-xs text-red-600">Sedang digunakan</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="w-6 h-6 bg-yellow-500 rounded border-2 border-yellow-600"></div>
                <div>
                  <span className="font-semibold text-yellow-700">Dibooking</span>
                  <p className="text-xs text-yellow-600">Sudah dipesan</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="w-6 h-6 bg-blue-500 rounded border-2 border-blue-600"></div>
                <div>
                  <span className="font-semibold text-blue-700">Dipilih</span>
                  <p className="text-xs text-blue-600">Sedang dipilih</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation for Maps */}
        <div className="text-primary font-semibold gap-4 flex justify-center mb-4">
          {partData?.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveMap(item)}
              className={`cursor-pointer px-4 py-2 rounded-lg transition-all duration-200 ${
                activeMap?.id === item.id 
                  ? "bg-primary text-white shadow-lg" 
                  : "hover:bg-primary hover:bg-opacity-10"
              }`}
            >
              {item.nama}
            </div>
          ))}
        </div>

        {/* Selected Slot Information */}
        {slotActive && (
          <div className="flex justify-center mb-4">
            <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-primary">
              <div className="flex items-center gap-3">
                <div className={`w-4 h-4 rounded ${
                  slotActive.status === 'Kosong' ? 'bg-green-500' :
                  slotActive.status === 'Terisi' ? 'bg-red-500' :
                  slotActive.status === 'Dibooking' ? 'bg-yellow-500' :
                  'bg-blue-500'
                }`}></div>
                <div>
                  <span className="font-semibold text-gray-800">
                    Slot Terpilih: {slotActive.slot_name || slotActive.id}
                  </span>
                  <span className={`ml-3 px-2 py-1 rounded-full text-xs font-medium ${
                    slotActive.status === 'Kosong' ? 'bg-green-100 text-green-800' :
                    slotActive.status === 'Terisi' ? 'bg-red-100 text-red-800' :
                    slotActive.status === 'Dibooking' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {slotActive.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Grid Display */}
        <div className="flex pb-16 pt-8 mt-4 relative justify-start items-center overflow-auto w-[100%] min-h-[500px] flex-grow">
          <SlotArea
            gridRows={activeMap?.row || 2}
            gridColumns={activeMap?.column || 2}
            gatewayData={gatewayData}
            cctvData={cctvData}
            // onDragOver={handleDragOver}
            // onDrop={handleDrop}
            slotData={slotData}
            // onDragStart={handleDragStart}
            onBlockClick={handleSlotClick}
            activeBlock={slotActive}
            toogleData={{ showCctv: showCamera }}
            editMode={false}
          />
        </div>

        {/* Interaction Buttons */}
        <div className="flex justify-center gap-6 mb-6">
          <button
            className={`px-8 py-3 rounded-xl font-bold text-white shadow-lg transition-all duration-300 transform hover:scale-105 ${
              showCamera 
                ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700" 
                : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
            }`}
            onClick={() => setShowCamera(!showCamera)}
          >
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              {showCamera ? "Tutup Kamera" : "Lihat Kamera"}
            </div>
          </button>
          
          <button
            className="px-8 py-3 rounded-xl font-bold text-white shadow-lg transition-all duration-300 transform hover:scale-105 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
            onClick={() => router.push(`/admin/monitoring/${areaId}/${zoneId}/edit`)}
          >
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Zona
            </div>
          </button>
          
          <button
            className={`px-8 py-3 rounded-xl font-bold text-white shadow-lg transition-all duration-300 transform ${
              (!slotActive || slotActive.status !== "Kosong") 
                ? "bg-gray-400 cursor-not-allowed" 
                : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 hover:scale-105"
            }`}
            disabled={!slotActive || slotActive.status !== "Kosong"}
            onClick={() => {
              if (slotActive && slotActive.status === "Kosong") {
                window.location.href = `/admin/booking/${slotActive.id}`;
              }
            }}
          >
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2v12a2 2 0 002 2z" />
              </svg>
              Booking Slot
            </div>
          </button>
        </div>
      </div>

      {showCamera && (
        <div
          className={`fixed flex bottom-12 right-12 bg-slate-500 shadow-2xl rounded-lg z-20 ${
            camZoom ? "h-4/5" : "h-1/5"
          }`}
        >
          <div className="absolute flex hover:opacity-100 opacity-0 h-full w-full bg-black bg-opacity-50 z-20 rounded-l">
            <div
              className={`flex w-6 absolute text-white hover:cursor-pointer z-10 ${
                camZoom
                  ? "bottom-[4%] right-[2%] w-8"
                  : "top-[6%] left-[2%] w-6"
              }`}
              onClick={() => setCamZoom(!camZoom)}
            >
              {camZoom ? <ZoominIcon /> : <ZoomoutIcon />}
            </div>
            <div className="flex h-full w-full absolute justify-center items-center">
              Layar Penuh
            </div>
          </div>
          {/* Video Player */}
          {streamingUrl && activeCam ? (
            streamingUrl.includes('.m3u8') || isRtspUrl(activeCam?.url) ? (
              <video
                ref={(video) => {
                  if (video && streamingUrl) {
                    let hls = null;
                    let retryCount = 0;
                    const maxRetries = 3;
                    
                    const setupHls = () => {
                      if (Hls.isSupported()) {
                        if (hls) {
                          hls.destroy();
                        }
                        
                        hls = new Hls({
                          enableWorker: true,
                          lowLatencyMode: true,
                          backBufferLength: 90,
                          maxBufferLength: 30,
                          maxMaxBufferLength: 60,
                          manifestLoadingTimeOut: 10000,
                          manifestLoadingMaxRetry: 3,
                          manifestLoadingRetryDelay: 1000,
                          levelLoadingTimeOut: 10000,
                          levelLoadingMaxRetry: 3,
                          levelLoadingRetryDelay: 1000,
                          fragLoadingTimeOut: 20000,
                          fragLoadingMaxRetry: 3,
                          fragLoadingRetryDelay: 1000
                        });
                        
                        hls.loadSource(streamingUrl);
                        hls.attachMedia(video);
                        
                        hls.on(Hls.Events.MANIFEST_PARSED, () => {
                          console.log('HLS manifest parsed, starting playback');
                          video.play().catch(e => {
                            console.warn('Auto-play failed:', e);
                          });
                        });
                        
                        hls.on(Hls.Events.ERROR, (event, data) => {
                          console.error('HLS error:', data);
                          
                          if (data.fatal) {
                            switch (data.type) {
                              case Hls.ErrorTypes.NETWORK_ERROR:
                                console.log('Network error, attempting to recover...');
                                if (retryCount < maxRetries) {
                                  retryCount++;
                                  setTimeout(() => {
                                    try {
                                      hls.startLoad();
                                    } catch (e) {
                                      console.error('Failed to restart HLS load:', e);
                                    }
                                  }, 1000 * retryCount);
                                } else {
                                  console.error('Max retries reached for network error');
                                  toast.error('Network error: Unable to load stream. Please check your connection.');
                                }
                                break;
                              case Hls.ErrorTypes.MEDIA_ERROR:
                                console.log('Media error, attempting to recover...');
                                try {
                                  hls.recoverMediaError();
                                } catch (e) {
                                  console.error('Failed to recover from media error:', e);
                                  toast.error('Media error: Unable to recover stream');
                                }
                                break;
                              default:
                                console.error('Unrecoverable HLS error:', data);
                                toast.error('Stream error: Unable to play video. Please try restarting the stream.');
                                break;
                            }
                          }
                        });
                        
                        // Cleanup function
                        return () => {
                          if (hls) {
                            hls.destroy();
                          }
                        };
                      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                        video.src = streamingUrl;
                        video.addEventListener('loadedmetadata', () => {
                          video.play().catch(e => {
                            console.warn('Auto-play failed:', e);
                          });
                        });
                        
                        video.addEventListener('error', (e) => {
                          console.error('Video error:', e);
                          toast.error('Video playback error');
                        });
                      } else {
                        console.error('HLS not supported in this browser');
                        toast.error('Video format not supported in this browser');
                      }
                    };
                    
                    setupHls();
                  }
                }}
                width="100%"
                height="100%"
                playsInline
                autoPlay
                muted
                controls
                className="flex justify-center rounded-lg"
                onError={(e) => {
                  console.error('Video element error:', e);
                  toast.error('Video playback failed');
                }}
                onLoadStart={() => {
                  console.log('Video loading started');
                }}
                onCanPlay={() => {
                  console.log('Video can start playing');
                }}
              />
            ) : youtubeLoopSrc(streamingUrl) ? (
              <iframe
                width="100%"
                height="100%"
                src={youtubeLoopSrc(streamingUrl)}
                className="rounded-lg"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                onLoad={() => {
                  console.log('YouTube iframe loaded successfully');
                }}
                onError={() => {
                  console.error('YouTube iframe error');
                  toast.error('Failed to load YouTube video');
                }}
              ></iframe>
            ) : (
              <div className="flex items-center justify-center h-full bg-gray-800 text-white rounded-lg">
                <div className="text-center">
                  <div className="mb-4">
                    <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="mb-2 font-semibold">Unsupported video format</p>
                  <p className="text-sm text-gray-400 break-all px-4">{streamingUrl}</p>
                  <button 
                    onClick={() => {
                      if (activeCam && needsConversion(activeCam.url)) {
                        startRtspStream(activeCam.id.replace('cctv-', ''));
                      } else if (activeCam && canPlayDirectly(activeCam.url)) {
                        setStreamingUrl(activeCam.url);
                      }
                    }}
                    className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
                  >
                    Retry Stream
                  </button>
                </div>
              </div>
            )
          ) : (
            <div className="flex items-center justify-center h-full bg-gray-800 text-white rounded-lg">
              <div className="text-center">
                {activeCam ? (
                  <>
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                    <p className="mb-2">Loading stream...</p>
                    <div className="text-sm text-gray-400">
                      <p>Camera: {activeCam.jenis_kamera}</p>
                      <p>Block: {activeCam.id_blok}</p>
                    </div>
                    {needsConversion(activeCam.url) && (
                       <button 
                         onClick={() => startRtspStream(activeCam.id.replace('cctv-', ''))}
                         disabled={isStartingStream}
                         className="mt-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded text-sm"
                       >
                         {isStartingStream ? 'Starting...' : 'Start Stream'}
                       </button>
                     )}
                  </>
                ) : (
                  <>
                    <div className="mb-4">
                      <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="mb-2 font-semibold">No Camera Available</p>
                    <p className="text-sm text-gray-400">No CCTV data found for this zone</p>
                  </>
                )}
              </div>
            </div>
          )}
          
          {/* Stream Controls for RTSP */}
          {activeCam && needsConversion(activeCam.url) && (
            <div className="absolute top-2 left-2 flex gap-2">
              {streamStatus === 'active' ? (
                <button
                  onClick={() => stopRtspStream(activeCam.id.replace('cctv-', ''))}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs"
                >
                  Stop Stream
                </button>
              ) : (
                <button
                  onClick={() => startRtspStream(activeCam.id.replace('cctv-', ''))}
                  disabled={isStartingStream}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-3 py-1 rounded text-xs"
                >
                  {isStartingStream ? 'Starting...' : 'Start Stream'}
                </button>
              )}
              <div className={`px-2 py-1 rounded text-xs ${
                streamStatus === 'active' ? 'bg-green-600 text-white' : 'bg-gray-600 text-white'
              }`}>
                {streamStatus === 'active' ? 'Live' : 'Offline'}
              </div>
            </div>
          )}
        </div>
      )}

      <Sidebar active={2} />
      <Toaster position="top-right" />
    </main>
  );
}
