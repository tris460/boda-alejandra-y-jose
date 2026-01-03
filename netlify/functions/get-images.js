const https = require('https');

exports.handler = async (event, context) => {
  console.log('🔍 Function called with method:', event.httpMethod);
  console.log('🔍 Headers:', JSON.stringify(event.headers, null, 2));
  
  // Solo permitir GET requests
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS'
      },
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS'
      },
      body: ''
    };
  }

  try {
    console.log('🔍 Fetching images from Cloudinary Admin API...');

    // Credenciales desde variables de entorno
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    console.log('🔍 Environment check:');
    console.log('- CLOUDINARY_CLOUD_NAME:', cloudName ? '✅ Set' : '❌ Missing');
    console.log('- CLOUDINARY_API_KEY:', apiKey ? '✅ Set' : '❌ Missing');
    console.log('- CLOUDINARY_API_SECRET:', apiSecret ? '✅ Set' : '❌ Missing');

    if (!cloudName || !apiKey || !apiSecret) {
      const missingVars = [];
      if (!cloudName) missingVars.push('CLOUDINARY_CLOUD_NAME');
      if (!apiKey) missingVars.push('CLOUDINARY_API_KEY');
      if (!apiSecret) missingVars.push('CLOUDINARY_API_SECRET');
      
      throw new Error(`Missing environment variables: ${missingVars.join(', ')}`);
    }

    // Crear Basic Auth
    const credentials = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64');
    
    // URL del Admin API
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/resources/image?max_results=50&prefix=post-wedding-gallery/`;
    
    console.log('🔍 Making request to:', url.replace(credentials, '[CREDENTIALS]'));

    // Hacer la petición
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Accept': 'application/json'
      }
    });

    console.log('🔍 Cloudinary response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Cloudinary API error:', response.status, errorText);
      throw new Error(`Cloudinary API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    
    console.log(`✅ Found ${data.resources?.length || 0} images`);

    // Transformar los datos para el frontend
    const images = (data.resources || []).map(resource => ({
      id: resource.public_id,
      name: extractImageName(resource.public_id),
      url: resource.secure_url,
      thumbnail: resource.secure_url.replace('/upload/', '/upload/w_400,h_300,c_fill/'),
      uploadDate: resource.created_at || new Date().toISOString()
    }));

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=30' // Cache por 30 segundos
      },
      body: JSON.stringify({
        success: true,
        images: images,
        count: images.length,
        debug: {
          cloudName: cloudName,
          totalResources: data.resources?.length || 0,
          timestamp: new Date().toISOString()
        }
      })
    };

  } catch (error) {
    console.error('❌ Error fetching images:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        success: false,
        error: error.message,
        images: [],
        debug: {
          timestamp: new Date().toISOString(),
          environment: {
            cloudName: process.env.CLOUDINARY_CLOUD_NAME ? 'set' : 'missing',
            apiKey: process.env.CLOUDINARY_API_KEY ? 'set' : 'missing',
            apiSecret: process.env.CLOUDINARY_API_SECRET ? 'set' : 'missing'
          }
        }
      })
    };
  }
};

// Función helper para extraer nombre de imagen
function extractImageName(publicId) {
  const parts = publicId.split('/');
  const fileName = parts[parts.length - 1];
  const nameWithoutExt = fileName.replace(/\.[^/.]+$/, '');
  
  return nameWithoutExt
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());
}