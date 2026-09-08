export const analyzeCropImage = async (file, language = 'en', locationState = null) => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
  const formData = new FormData();
  formData.append('image', file);
  formData.append('language', language);
  
  if (locationState && locationState.lat && locationState.lon) {
    formData.append('lat', locationState.lat);
    formData.append('lon', locationState.lon);
  }

  const token = localStorage.getItem('token');
  const headers = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;

  try {
    const response = await fetch(`${BACKEND_URL}/api/disease/analyze`, {
      method: 'POST',
      headers,
      body: formData
    });
    
    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || 'Failed to analyze image');
    
    return data.data;
  } catch (error) {
    console.error('Error analyzing image via backend:', error);
    throw new Error(error.message || 'Failed to analyze image');
  }
};
