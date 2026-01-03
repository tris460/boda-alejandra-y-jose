const https = require('https');

exports.handler = async (event, context) => {
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

    if (!cloudName || !apiKey || !apiSecret) {
      throw new Error('Missing Cloudinary credentials in environment variables');
    }

    // Crear Basic Auth
    const credentials = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64');
    
    // URL del Admin API
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/resources/image?max_results=50&prefix=post-wedding-gallery/`;

    // Hacer la petición
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Cloudinary API error: ${response.status} ${response.statusText}`);
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
        count: images.length
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
        images: []
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