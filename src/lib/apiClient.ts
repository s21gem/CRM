export const apiClient = async (endpoint: string, options: RequestInit = {}) => {
  const url = endpoint.startsWith('http') ? endpoint : `http://localhost:5000${endpoint}`;
  
  const headers = new Headers(options.headers || {});
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include', // Automatically send HttpOnly cookies
  });

  if (response.status === 401) {
    localStorage.removeItem('crm_role');
    window.location.href = '/';
  }

  return response;
};
