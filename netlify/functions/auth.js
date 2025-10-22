// Simple in-memory database (replace with MongoDB Atlas free tier for production)
const users = new Map();
const sessions = new Map();
const magicLinks = new Map();
const eas = new Map();
const licences = new Map();

// Initialize with demo data
function initializeDemoData() {
  // Demo mentor
  const demoMentor = {
    id: 'mentor-1',
    email: 'demo@maverick.com',
    name: 'Demo Mentor',
    role: 'mentor',
    mentorId: '15776',
    maxLicences: 1000,
    createdAt: new Date().toISOString()
  };
  users.set(demoMentor.id, demoMentor);

  // Demo EA
  const demoEA = {
    id: 'ea-1',
    name: 'MAVERICK SCALPER EA',
    version: '1.0',
    code: '57 5ee863f9 33a2e5ec44 414ce2838b 4',
    mentorId: '15776',
    totalUsers: 14,
    createdAt: new Date().toISOString()
  };
  eas.set(demoEA.id, demoEA);

  // Demo licences
  for (let i = 1; i <= 14; i++) {
    const licence = {
      id: `licence-${i}`,
      eaId: 'ea-1',
      mentorId: '15776',
      licenceKey: `MAV-${i}-${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
      active: true,
      createdAt: new Date().toISOString()
    };
    licences.set(licence.id, licence);
  }
}

// Initialize demo data
initializeDemoData();

exports.handler = async (event) => {
  const { action, ...data } = JSON.parse(event.body);

  try {
    switch (action) {
      case 'mentor_login':
        return await handleMentorLogin(data.email);
      
      case 'client_activate':
        return await handleClientActivate(data.email, data.mentorId, data.licenceKey);
      
      case 'verify_magic_link':
        return await verifyMagicLink(data.magicToken);
      
      case 'get_mentor_dashboard':
        return await getMentorDashboard(data.mentorId);
      
      case 'get_eas':
        return await getEAs(data.mentorId);
      
      case 'create_ea':
        return await createEA(data.mentorId, data.name, data.version);
      
      case 'get_ea_details':
        return await getEADetails(data.eaId);
      
      case 'create_licence':
        return await createLicence(data.mentorId, data.eaId);
      
      case 'get_client_dashboard':
        return await getClientDashboard(data.userId);
      
      default:
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'Invalid action' })
        };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};

// Generate random ID
function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

// Generate magic token
function generateMagicToken() {
  return Math.random().toString(36).substr(2, 16);
}

// Generate EA code like "57 5ee863f9 33a2e5ec44 414ce2838b 4"
function generateEACode() {
  const parts = [
    Math.floor(10 + Math.random() * 90).toString(),
    Math.random().toString(36).substr(2, 8),
    Math.random().toString(36).substr(2, 10),
    Math.random().toString(36).substr(2, 10),
    Math.floor(1 + Math.random() * 9).toString()
  ];
  return parts.join(' ');
}

async function handleMentorLogin(email) {
  // In production, validate email format
  const magicToken = generateMagicToken();
  
  magicLinks.set(magicToken, {
    email: email.toLowerCase(),
    type: 'mentor',
    timestamp: Date.now()
  });

  // For demo - return magic link directly
  // In production, send email with magic link
  const magicLink = `/.netlify/functions/auth?action=verify_magic_link&token=${magicToken}`;
  
  return {
    statusCode: 200,
    body: JSON.stringify({
      success: true,
      message: 'Magic link generated successfully',
      magicLink: magicLink, // For demo - remove in production
      magicToken: magicToken // For demo - remove in production
    })
  };
}

async function handleClientActivate(email, mentorId, licenceKey) {
  const mentor = Array.from(users.values()).find(u => 
    u.mentorId === mentorId && u.role === 'mentor'
  );

  if (!mentor) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid Mentor ID' })
    };
  }

  // Validate licence key exists and is active
  const validLicence = Array.from(licences.values()).find(l => 
    l.licenceKey === licenceKey && l.active && l.mentorId === mentorId
  );

  if (!validLicence) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid or inactive Licence Key' })
    };
  }

  const magicToken = generateMagicToken();
  magicLinks.set(magicToken, {
    email: email.toLowerCase(),
    mentorId,
    licenceKey,
    type: 'client',
    timestamp: Date.now()
  });

  const magicLink = `/.netlify/functions/auth?action=verify_magic_link&token=${magicToken}`;

  return {
    statusCode: 200,
    body: JSON.stringify({
      success: true,
      message: 'Activation link generated successfully',
      magicLink: magicLink, // For demo
      magicToken: magicToken // For demo
    })
  };
}

async function verifyMagicLink(token) {
  const linkData = magicLinks.get(token);
  
  if (!linkData) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid magic link' })
    };
  }

  // Check if token expired (15 minutes)
  if (Date.now() - linkData.timestamp > 15 * 60 * 1000) {
    magicLinks.delete(token);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Magic link expired' })
    };
  }

  magicLinks.delete(token);

  if (linkData.type === 'mentor') {
    let user = Array.from(users.values()).find(u => 
      u.email === linkData.email && u.role === 'mentor'
    );

    if (!user) {
      // Create new mentor
      user = {
        id: generateId(),
        email: linkData.email,
        name: linkData.email.split('@')[0],
        role: 'mentor',
        mentorId: Math.floor(10000 + Math.random() * 90000).toString(),
        maxLicences: 1000,
        createdAt: new Date().toISOString()
      };
      users.set(user.id, user);
    }

    const sessionToken = generateId();
    sessions.set(sessionToken, user);

    return {
      statusCode: 200,
      body: JSON.stringify({
        user,
        sessionToken,
        redirectTo: '/mentor/dashboard'
      })
    };
  } else {
    // Client activation
    const clientId = generateId();
    const client = {
      id: clientId,
      email: linkData.email,
      name: linkData.email.split('@')[0],
      role: 'client',
      mentorId: linkData.mentorId,
      licenceKey: linkData.licenceKey,
      activatedAt: new Date().toISOString()
    };
    
    users.set(clientId, client);
    
    const sessionToken = generateId();
    sessions.set(sessionToken, client);

    return {
      statusCode: 200,
      body: JSON.stringify({
        user: client,
        sessionToken,
        redirectTo: '/client/dashboard'
      })
    };
  }
}

async function getMentorDashboard(mentorId) {
  const mentorEAs = Array.from(eas.values()).filter(ea => ea.mentorId === mentorId);
  const mentorLicences = Array.from(licences.values()).filter(l => l.mentorId === mentorId);
  const activeLicences = mentorLicences.filter(l => l.active);

  return {
    statusCode: 200,
    body: JSON.stringify({
      mentorId,
      totalLicences: activeLicences.length,
      totalEAs: mentorEAs.length,
      maxLicences: 1000,
      date: new Date().toLocaleDateString('en-GB'),
      eas: mentorEAs
    })
  };
}

async function getEAs(mentorId) {
  const mentorEAs = Array.from(eas.values()).filter(ea => ea.mentorId === mentorId);
  
  return {
    statusCode: 200,
    body: JSON.stringify({
      eas: mentorEAs
    })
  };
}

async function createEA(mentorId, name, version) {
  const ea = {
    id: generateId(),
    name,
    version,
    code: generateEACode(),
    mentorId,
    totalUsers: 0,
    createdAt: new Date().toISOString()
  };
  
  eas.set(ea.id, ea);
  
  return {
    statusCode: 201,
    body: JSON.stringify(ea)
  };
}

async function getEADetails(eaId) {
  const ea = eas.get(eaId);
  
  if (!ea) {
    return {
      statusCode: 404,
      body: JSON.stringify({ error: 'EA not found' })
    };
  }
  
  return {
    statusCode: 200,
    body: JSON.stringify(ea)
  };
}

async function createLicence(mentorId, eaId) {
  const licence = {
    id: generateId(),
    eaId,
    mentorId,
    licenceKey: `MAV-${Math.random().toString(36).substr(2, 12).toUpperCase()}`,
    active: true,
    createdAt: new Date().toISOString()
  };
  
  licences.set(licence.id, licence);
  
  // Update EA user count
  const ea = eas.get(eaId);
  if (ea) {
    ea.totalUsers += 1;
    eas.set(eaId, ea);
  }
  
  return {
    statusCode: 201,
    body: JSON.stringify(licence)
  };
}

async function getClientDashboard(userId) {
  const client = users.get(userId);
  
  if (!client) {
    return {
      statusCode: 404,
      body: JSON.stringify({ error: 'Client not found' })
    };
  }
  
  const ea = Array.from(eas.values()).find(e => e.mentorId === client.mentorId);
  
  return {
    statusCode: 200,
    body: JSON.stringify({
      client,
      ea,
      message: 'Your EA is active and running'
    })
  };
}
