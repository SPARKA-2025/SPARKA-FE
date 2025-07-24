import { API_CONFIG } from '../config/apiConfig.js';

const baseUrl = API_CONFIG.BASE_URL;

export default async function fetchApi({ method = 'get', endpoint, data, contentType }) {
  // Get token from document.cookie on client side
  const getTokenFromCookie = () => {
    if (typeof document === 'undefined') return 'false';
    const cookies = document.cookie.split(';');
    const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('token='));
    return tokenCookie ? tokenCookie.split('=')[1] : 'false';
  };
  
  const token = getTokenFromCookie();
  const url = `${baseUrl}${endpoint}`;
  
  // Tentukan body berdasarkan tipe data
  const body = data instanceof FormData ? data : data ? JSON.stringify(data) : undefined;
  
  // Tentukan headers
  const headers = {
    Authorization: `Bearer ${token}`,
    ...(!(data instanceof FormData) && { 'Content-Type': contentType || 'application/json' }),
  };

  try {
    const response = await fetch(url, { method, headers, body });
    
    // Check if response is ok
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`HTTP ${response.status}: ${errorText}`);
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    } else {
      const text = await response.text();
      console.error('Non-JSON response:', text);
      throw new Error('Server returned non-JSON response');
    }
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}
