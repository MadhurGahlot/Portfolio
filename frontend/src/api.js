// frontend/src/api.js

const API_BASE_URL = 'http://127.0.0.1:8000/api';

/**
 * Fetch list of portfolio categories
 */
export async function fetchCategories() {
  try {
    const res = await fetch(`${API_BASE_URL}/categories`);
    if (!res.ok) throw new Error('Failed to fetch categories');
    return await res.json();
  } catch (error) {
    console.error('API Error [fetchCategories]:', error);
    // Fallback data if backend unavailable
    return [
      { id: 'all', name: 'All Works' },
      { id: 'AI/ML', name: 'AI & ML Tool' },
      { id: 'Backend', name: 'Backend Develoment' },
      { id: 'Cpp', name: 'Cpp & Graphics' },
      { id: 'Intergration', name: 'Backend & Intergration' }
    ];
  }
}

/**
 * Fetch portfolio projects with optional category filtering
 * @param {string} category 
 */
export async function fetchProjects(category = 'all') {
  try {
    const url = category && category !== 'all' 
      ? `${API_BASE_URL}/projects?category=${encodeURIComponent(category)}`
      : `${API_BASE_URL}/projects`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch projects');
    return await res.json();
  } catch (error) {
    console.error('API Error [fetchProjects]:', error);
    return [];
  }
}

/**
 * Fetch project details by slug or ID
 * @param {string} slug 
 */
export async function fetchProjectBySlug(slug) {
  try {
    const res = await fetch(`${API_BASE_URL}/projects/${slug}`);
    if (!res.ok) throw new Error('Project not found');
    return await res.json();
  } catch (error) {
    console.error('API Error [fetchProjectBySlug]:', error);
    return null;
  }
}

/**
 * Submit contact form payload to FastAPI endpoint
 * @param {Object} formData 
 */
export async function submitContact(formData) {
  try {
    const res = await fetch(`${API_BASE_URL}/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.detail || 'Submission failed');
    }
    return data;
  } catch (error) {
    console.error('API Error [submitContact]:', error);
    throw error;
  }
}
