'use server';

import { cookies } from "next/headers";

const baseUrl = process.env.API_URL;

export default async function fetchApi({ method = 'get', endpoint, data, contentType }) {
  const token = cookies().get('token')?.value || 'false';
  const url = `${baseUrl}/api${endpoint}`;
  
  // Tentukan body berdasarkan tipe data
  const body = data instanceof FormData ? data : data ? JSON.stringify(data) : undefined;
  
  // Tentukan headers
  const headers = {
    Authorization: `Bearer ${token}`,
    ...(contentType && contentType !== 'multipart/form-data' && { 'Content-Type': contentType || 'application/json' }),
  };

  try {
    const response = await fetch(url, { method, headers, body });
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}
