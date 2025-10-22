// API service functions
const API_BASE = '/.netlify/functions/auth';

export const apiService = {
  // Mentor actions
  mentorLogin: async (email) => {
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'mentor_login', email })
    });
    return response.json();
  },

  clientActivate: async (email, mentorId, licenceKey) => {
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'client_activate', email, mentorId, licenceKey })
    });
    return response.json();
  },

  verifyMagicLink: async (token) => {
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'verify_magic_link', magicToken: token })
    });
    return response.json();
  },

  getMentorDashboard: async (mentorId) => {
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'get_mentor_dashboard', mentorId })
    });
    return response.json();
  },

  getEAs: async (mentorId) => {
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'get_eas', mentorId })
    });
    return response.json();
  },

  createEA: async (mentorId, name, version) => {
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'create_ea', mentorId, name, version })
    });
    return response.json();
  },

  getEADetails: async (eaId) => {
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'get_ea_details', eaId })
    });
    return response.json();
  },

  createLicence: async (mentorId, eaId) => {
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'create_licence', mentorId, eaId })
    });
    return response.json();
  },

  getClientDashboard: async (userId) => {
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'get_client_dashboard', userId })
    });
    return response.json();
  }
};
