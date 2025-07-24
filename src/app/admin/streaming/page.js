'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import Hls from 'hls.js';
import { API_CONFIG } from '../../lib/config/apiConfig.js';

const StreamingManagement = () => {
    const [cctvList, setCctvList] = useState([]);
    const [activeStreams, setActiveStreams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [streamingStates, setStreamingStates] = useState({});
    const [selectedStream, setSelectedStream] = useState(null);
    const [showPlayer, setShowPlayer] = useState(false);

const API_BASE_URL = API_CONFIG.BASE_URL;

    useEffect(() => {
        fetchCctvData();
        fetchActiveStreams();
        
        // Refresh active streams every 30 seconds
        const interval = setInterval(fetchActiveStreams, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchCctvData = async () => {
        try {
            const token = localStorage.getItem('admin_token');
            const response = await fetch(`${API_BASE_URL}/api/cctv-data`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                setCctvList(data.data || []);
            } else {
                toast.error('Failed to fetch CCTV data');
            }
        } catch (error) {
            console.error('Error fetching CCTV data:', error);
            toast.error('Error fetching CCTV data');
        } finally {
            setLoading(false);
        }
    };

    const fetchActiveStreams = async () => {
        try {
            const token = localStorage.getItem('admin_token');
            const response = await fetch(`${API_BASE_URL}/admin/streaming/active`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                setActiveStreams(data.streams || []);
            }
        } catch (error) {
            console.error('Error fetching active streams:', error);
        }
    };

    const startStream = async (cctvId) => {
        setStreamingStates(prev => ({ ...prev, [cctvId]: 'starting' }));
        
        try {
            const token = localStorage.getItem('admin_token');
            const response = await fetch(`${API_BASE_URL}/admin/streaming/start`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ cctv_id: cctvId })
            });
            
            const data = await response.json();
            
            if (data.success) {
                toast.success('Stream started successfully');
                fetchActiveStreams();
                setStreamingStates(prev => ({ ...prev, [cctvId]: 'active' }));
            } else {
                toast.error(data.message || 'Failed to start stream');
                setStreamingStates(prev => ({ ...prev, [cctvId]: 'error' }));
            }
        } catch (error) {
            console.error('Error starting stream:', error);
            toast.error('Error starting stream');
            setStreamingStates(prev => ({ ...prev, [cctvId]: 'error' }));
        }
    };

    const stopStream = async (cctvId) => {
        setStreamingStates(prev => ({ ...prev, [cctvId]: 'stopping' }));
        
        try {
            const token = localStorage.getItem('admin_token');
            const response = await fetch(`${API_BASE_URL}/admin/streaming/stop`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ cctv_id: cctvId })
            });
            
            const data = await response.json();
            
            if (data.success) {
                toast.success('Stream stopped successfully');
                fetchActiveStreams();
                setStreamingStates(prev => ({ ...prev, [cctvId]: 'inactive' }));
            } else {
                toast.error(data.message || 'Failed to stop stream');
                setStreamingStates(prev => ({ ...prev, [cctvId]: 'error' }));
            }
        } catch (error) {
            console.error('Error stopping stream:', error);
            toast.error('Error stopping stream');
            setStreamingStates(prev => ({ ...prev, [cctvId]: 'error' }));
        }
    };

    const playStream = (stream) => {
        setSelectedStream(stream);
        setShowPlayer(true);
    };

    const isStreamActive = (cctvId) => {
        return activeStreams.some(stream => stream.cctv_id === cctvId);
    };

    const getStreamStatus = (cctvId) => {
        if (streamingStates[cctvId]) {
            return streamingStates[cctvId];
        }
        return isStreamActive(cctvId) ? 'active' : 'inactive';
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'text-green-600 bg-green-100';
            case 'starting': return 'text-yellow-600 bg-yellow-100';
            case 'stopping': return 'text-orange-600 bg-orange-100';
            case 'error': return 'text-red-600 bg-red-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'active': return 'Active';
            case 'starting': return 'Starting...';
            case 'stopping': return 'Stopping...';
            case 'error': return 'Error';
            default: return 'Inactive';
        }
    };

    const isRtspUrl = (url) => {
        return url && url.toLowerCase().startsWith('rtsp://');
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Streaming Management</h1>
                <p className="text-gray-600">Manage RTSP to HLS streaming conversion for CCTV cameras</p>
            </div>

            {/* Active Streams Summary */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Active Streams</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-green-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{activeStreams.length}</div>
                        <div className="text-sm text-green-700">Active Streams</div>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                            {cctvList.filter(cctv => isRtspUrl(cctv.url)).length}
                        </div>
                        <div className="text-sm text-blue-700">RTSP Cameras</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-gray-600">{cctvList.length}</div>
                        <div className="text-sm text-gray-700">Total Cameras</div>
                    </div>
                </div>
            </div>

            {/* CCTV List */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">CCTV Cameras</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Camera Info
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    URL
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {cctvList.map((cctv) => {
                                const status = getStreamStatus(cctv.id);
                                const activeStream = activeStreams.find(stream => stream.cctv_id === cctv.id);
                                
                                return (
                                    <tr key={cctv.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">
                                                    {cctv.jenis_kamera} - Blok {cctv.id_blok}
                                                </div>
                                                <div className="text-sm text-gray-500">ID: {cctv.id}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900 max-w-xs truncate" title={cctv.url}>
                                                {cctv.url}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {isRtspUrl(cctv.url) ? 'RTSP Stream' : 'Other Format'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(status)}`}>
                                                {getStatusText(status)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex space-x-2">
                                                {isRtspUrl(cctv.url) && (
                                                    <>
                                                        {status === 'active' ? (
                                                            <>
                                                                <button
                                                                    onClick={() => stopStream(cctv.id)}
                                                                    disabled={status === 'stopping'}
                                                                    className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-3 py-1 rounded text-xs"
                                                                >
                                                                    {status === 'stopping' ? 'Stopping...' : 'Stop'}
                                                                </button>
                                                                {activeStream && (
                                                                    <button
                                                                        onClick={() => playStream(activeStream)}
                                                                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs"
                                                                    >
                                                                        Play
                                                                    </button>
                                                                )}
                                                            </>
                                                        ) : (
                                                            <button
                                                                onClick={() => startStream(cctv.id)}
                                                                disabled={status === 'starting'}
                                                                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-3 py-1 rounded text-xs"
                                                            >
                                                                {status === 'starting' ? 'Starting...' : 'Start Stream'}
                                                            </button>
                                                        )}
                                                    </>
                                                )}
                                                {!isRtspUrl(cctv.url) && (
                                                    <span className="text-gray-500 text-xs">Not RTSP</span>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Video Player Modal */}
            {showPlayer && selectedStream && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">
                                {selectedStream.cctv_name} - Live Stream
                            </h3>
                            <button
                                onClick={() => setShowPlayer(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="aspect-video bg-black rounded-lg overflow-hidden">
                            <video
                                ref={(video) => {
                                    if (video && selectedStream.hls_url) {
                                        if (Hls.isSupported()) {
                                            const hls = new Hls();
                                            hls.loadSource(selectedStream.hls_url);
                                            hls.attachMedia(video);
                                        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                                            video.src = selectedStream.hls_url;
                                        }
                                    }
                                }}
                                controls
                                autoPlay
                                className="w-full h-full"
                            />
                        </div>
                        <div className="mt-4 text-sm text-gray-600">
                            <p><strong>HLS URL:</strong> {selectedStream.hls_url}</p>
                            <p><strong>RTSP URL:</strong> {selectedStream.rtsp_url}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StreamingManagement;