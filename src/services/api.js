// API Service for Job Command Center Backend
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Helper for handling responses
async function handleResponse(response) {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
    throw new Error(error.detail || 'API request failed');
  }
  return response.json();
}

// Applications API
export const applicationsApi = {
  list: async () => {
    const response = await fetch(`${API_BASE}/applications`);
    return handleResponse(response);
  },

  get: async (id) => {
    const response = await fetch(`${API_BASE}/applications/${id}`);
    return handleResponse(response);
  },

  create: async (data) => {
    const response = await fetch(`${API_BASE}/applications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  update: async (id, data) => {
    const response = await fetch(`${API_BASE}/applications/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  delete: async (id) => {
    const response = await fetch(`${API_BASE}/applications/${id}`, {
      method: 'DELETE'
    });
    return response.ok;
  },

  uploadFile: async (id, file, fileType) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('file_type', fileType);

    const response = await fetch(`${API_BASE}/applications/${id}/files`, {
      method: 'POST',
      body: formData
    });
    return handleResponse(response);
  },

  listFiles: async (id) => {
    const response = await fetch(`${API_BASE}/applications/${id}/files`);
    return handleResponse(response);
  },

  exportForLLM: async () => {
    const response = await fetch(`${API_BASE}/applications/export-for-llm`);
    return handleResponse(response);
  }
};

// Resumes API
export const resumesApi = {
  list: async () => {
    const response = await fetch(`${API_BASE}/resumes`);
    return handleResponse(response);
  },

  get: async (id) => {
    const response = await fetch(`${API_BASE}/resumes/${id}`);
    return handleResponse(response);
  },

  create: async (data, file = null) => {
    const formData = new FormData();
    formData.append('name', data.name);
    if (data.description) formData.append('description', data.description);
    if (data.target_roles) formData.append('target_roles', data.target_roles);
    if (data.content) formData.append('content', data.content);
    if (file) formData.append('file', file);

    const response = await fetch(`${API_BASE}/resumes`, {
      method: 'POST',
      body: formData
    });
    return handleResponse(response);
  },

  update: async (id, data) => {
    const response = await fetch(`${API_BASE}/resumes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  delete: async (id) => {
    const response = await fetch(`${API_BASE}/resumes/${id}`, {
      method: 'DELETE'
    });
    return response.ok;
  },

  uploadFile: async (id, file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE}/resumes/${id}/upload`, {
      method: 'POST',
      body: formData
    });
    return handleResponse(response);
  },

  getDownloadUrl: (id) => `${API_BASE}/resumes/${id}/download`
};

// Target Companies API
export const companiesApi = {
  list: async () => {
    const response = await fetch(`${API_BASE}/companies`);
    return handleResponse(response);
  },

  get: async (id) => {
    const response = await fetch(`${API_BASE}/companies/${id}`);
    return handleResponse(response);
  },

  create: async (data) => {
    const response = await fetch(`${API_BASE}/companies`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  update: async (id, data) => {
    const response = await fetch(`${API_BASE}/companies/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  delete: async (id) => {
    const response = await fetch(`${API_BASE}/companies/${id}`, {
      method: 'DELETE'
    });
    return response.ok;
  }
};

// Files API
export const filesApi = {
  get: async (id) => {
    const response = await fetch(`${API_BASE}/files/${id}`);
    return handleResponse(response);
  },

  getDownloadUrl: (id) => `${API_BASE}/files/${id}/download`,

  delete: async (id) => {
    const response = await fetch(`${API_BASE}/files/${id}`, {
      method: 'DELETE'
    });
    return response.ok;
  }
};

// Check if backend is available
export const checkBackendHealth = async () => {
  try {
    const response = await fetch(`${API_BASE.replace('/api', '')}/health`);
    return response.ok;
  } catch {
    return false;
  }
};

// Unified API object
export const api = {
  applications: applicationsApi,
  resumes: resumesApi,
  companies: companiesApi,
  files: filesApi,
  checkHealth: checkBackendHealth
};

export default api;
