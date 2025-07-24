// API Configuration for SPARKA Frontend
// Centralized configuration to avoid NetworkError issues
//
// SIMPLIFIED CONFIGURATION:
// - Use only API_URL and NEXT_PUBLIC_API_URL in .env files
// - Set them to base URL without /api suffix (e.g., http://localhost:8000)
// - The /api suffix will be automatically added by getApiBaseUrl()
// - This reduces environment variable complexity and ensures consistency

const getApiBaseUrl = () => {
  let baseUrl;
  
  // For client-side requests (browser)
  if (typeof window !== 'undefined') {
    baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  }
  // For server-side requests (Next.js server)
  else {
    baseUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  }
  
  // Always ensure /api is included in the base URL
  if (!baseUrl.endsWith('/api')) {
    baseUrl = baseUrl + '/api';
  }
  
  return baseUrl;
};

const getIntegrationApiUrl = () => {
  // For client-side requests (browser)
  if (typeof window !== 'undefined') {
    return 'http://localhost:8004';
  }
  
  // For server-side requests
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:8004';
  }
  
  // In production/Docker
  return 'http://sparka-integration:8004';
};

const getStreamingApiUrl = () => {
  // For client-side requests (browser)
  if (typeof window !== 'undefined') {
    return process.env.NEXT_PUBLIC_STREAMING_URL || 'http://localhost:8010';
  }
  
  // For server-side requests
  if (process.env.NODE_ENV === 'development') {
    return process.env.NEXT_PUBLIC_STREAMING_URL || 'http://localhost:8010';
  }
  
  // In production/Docker
  return process.env.STREAMING_API_URL || 'http://sparka-streaming:8010';
};

export const API_CONFIG = {
  BASE_URL: getApiBaseUrl(),
  INTEGRATION_URL: getIntegrationApiUrl(),
  STREAMING_URL: getStreamingApiUrl(),
  ENDPOINTS: {
    HEALTH: '/health',
    LOGIN: '/auth/login',
    ADMIN: {
      AREAS: '/admin/area',
      PARKING: '/admin/parkir',
      STREAMING: '/admin/streaming'
    },
    AI: {
      PARKING_UPDATE: '/ai/parking/update-status',
      HEALTH: '/ai/health'
    }
  }
};

export default API_CONFIG;