/**
 * Google Apps Script para manejar RSVP y Galería Post-Boda
 * Este script maneja tanto las respuestas RSVP como las imágenes de la galería
 */

// ID de la carpeta de Google Drive donde se almacenarán las imágenes
const DRIVE_FOLDER_ID = '1Wn8l8MDtP2PUxsij_By-JEHt3zNBQnT1';

// Función para manejar requests GET (JSONP compatible)
function doGet(e) {
  const params = e.parameter || {};
  const callback = params.callback;
  
  console.log('GET Request params:', params);
  
  let response;
  
  // Manejar diferentes acciones
  if (params.test) {
    response = handleTestRequest(params);
  } else if (params.action === 'getImages') {
    response = handleGetImages();
  } else if (params.action === 'uploadImage') {
    response = handleImageUpload(params);
  } else {
    // Fallback a RSVP para compatibilidad
    response = handleRSVPRequest(params);
  }
  
  // Si hay callback, devolver JSONP
  if (callback) {
    const jsonpResponse = callback + '(' + JSON.stringify(response) + ');';
    return ContentService
      .createTextOutput(jsonpResponse)
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  
  // Si no hay callback, devolver JSON normal
  return ContentService
    .createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

// Función para manejar requests POST
function doPost(e) {
  let params = {};
  
  // Si viene como FormData
  if (e.postData && e.postData.contents) {
    try {
      // Intentar parsear como JSON
      params = JSON.parse(e.postData.contents);
    } catch (error) {
      // Si no es JSON, parsear como form data
      const formData = e.postData.contents;
      const pairs = formData.split('&');
      pairs.forEach(pair => {
        const [key, value] = pair.split('=');
        if (key && value) {
          params[decodeURIComponent(key)] = decodeURIComponent(value.replace(/\+/g, ' '));
        }
      });
    }
  }
  
  // También revisar parámetros normales
  if (e.parameter) {
    params = { ...params, ...e.parameter };
  }
  
  return handleRSVPRequest(params);
}

// Función para manejar requests de prueba
function handleTestRequest(params) {
  console.log('Test request received:', params);
  
  if (params.test === 'simple') {
    return {
      status: 'success',
      message: 'Google Apps Script está funcionando correctamente',
      timestamp: new Date().toISOString(),
      testType: 'simple'
    };
  } else if (params.test === 'jsonp') {
    return {
      status: 'success',
      message: 'JSONP está funcionando correctamente',
      timestamp: new Date().toISOString(),
      testType: 'jsonp',
      callback: params.callback || 'no callback provided'
    };
  }
  
  return {
    status: 'success',
    message: 'Test genérico exitoso',
    params: params
  };
}

// Función para obtener las imágenes de la galería
function handleGetImages() {
  try {
    console.log('Getting images from Drive folder:', DRIVE_FOLDER_ID);
    
    const folder = DriveApp.getFolderById(DRIVE_FOLDER_ID);
    const files = folder.getFiles();
    const images = [];
    
    while (files.hasNext()) {
      const file = files.next();
      const mimeType = file.getBlob().getContentType();
      
      // Solo procesar archivos de imagen
      if (mimeType.startsWith('image/')) {
        images.push({
          id: file.getId(),
          name: file.getName(),
          url: `https://drive.google.com/uc?id=${file.getId()}`,
          thumbnail: `https://drive.google.com/thumbnail?id=${file.getId()}&sz=w400`,
          uploadDate: file.getDateCreated().toISOString(),
          size: file.getSize(),
          mimeType: mimeType
        });
      }
    }
    
    console.log(`Found ${images.length} images`);
    
    return {
      status: 'success',
      images: images,
      count: images.length,
      timestamp: new Date().toISOString()
    };
    
  } catch (error) {
    console.error('Error getting images:', error);
    return {
      status: 'error',
      message: 'Error al obtener las imágenes: ' + error.toString(),
      timestamp: new Date().toISOString()
    };
  }
}

// Función para subir una imagen
function handleImageUpload(params) {
  try {
    console.log('Uploading image:', params.fileName);
    
    if (!params.fileData || !params.fileName || !params.mimeType) {
      throw new Error('Faltan datos requeridos: fileData, fileName, mimeType');
    }
    
    // Decodificar el archivo base64
    const fileBlob = Utilities.newBlob(
      Utilities.base64Decode(params.fileData),
      params.mimeType,
      params.fileName
    );
    
    // Obtener la carpeta de destino
    const folder = DriveApp.getFolderById(DRIVE_FOLDER_ID);
    
    // Crear el archivo en Drive
    const file = folder.createFile(fileBlob);
    
    // Hacer el archivo público para visualización
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    
    console.log('Image uploaded successfully:', file.getId());
    
    return {
      status: 'success',
      message: 'Imagen subida exitosamente',
      image: {
        id: file.getId(),
        name: file.getName(),
        url: `https://drive.google.com/uc?id=${file.getId()}`,
        thumbnail: `https://drive.google.com/thumbnail?id=${file.getId()}&sz=w400`,
        uploadDate: file.getDateCreated().toISOString(),
        size: file.getSize()
      },
      timestamp: new Date().toISOString()
    };
    
  } catch (error) {
    console.error('Error uploading image:', error);
    return {
      status: 'error',
      message: 'Error al subir la imagen: ' + error.toString(),
      timestamp: new Date().toISOString()
    };
  }
}

// Función principal que maneja la lógica de RSVP (mantenida para compatibilidad)
function handleRSVPRequest(params) {
  try {
    // ID de tu hoja de cálculo (extraído de la URL)
    const SPREADSHEET_ID = '1Cn4uviDanHrnTMM4X6Z8m6E1fMDHVwAOS-zVTyagTyo';
    
    // Log para debugging
    console.log('Parámetros RSVP recibidos:', params);
    
    // Abrir la hoja de cálculo
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    
    // Obtener la primera hoja (o crear una específica para RSVP)
    let sheet = spreadsheet.getSheetByName('RSVP');
    
    // Si no existe la hoja RSVP, crearla
    if (!sheet) {
      sheet = spreadsheet.insertSheet('RSVP');
      
      // Agregar encabezados si es una hoja nueva
      const headers = [
        'Fecha de Respuesta',
        'Nombre Completo', 
        'Asistencia',
        'Número de Invitados',
        'Mensaje',
        'Timestamp'
      ];
      
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      
      // Formatear encabezados
      const headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#d4af37'); // Color dorado
      headerRange.setFontColor('white');
    }
    
    // Validar que tenemos los datos mínimos necesarios
    if (!params.nombre || !params.asistencia) {
      console.error('Faltan datos requeridos:', params);
      return {
        status: 'error',
        message: 'Faltan datos requeridos: nombre y asistencia son obligatorios'
      };
    }
    
    // Preparar los datos para insertar
    const rowData = [
      params.fecha || new Date().toLocaleString('es-MX'),
      params.nombre || '',
      params.asistencia || '',
      params.invitados || '0',
      params.mensaje || 'Sin mensaje',
      new Date() // Timestamp del servidor
    ];
    
    // Insertar nueva fila al final
    sheet.appendRow(rowData);
    
    // Formatear la nueva fila
    const lastRow = sheet.getLastRow();
    const newRowRange = sheet.getRange(lastRow, 1, 1, rowData.length);
    
    // Alternar colores de fila para mejor legibilidad
    if (lastRow % 2 === 0) {
      newRowRange.setBackground('#f8f9fa');
    }
    
    // Ajustar ancho de columnas automáticamente
    sheet.autoResizeColumns(1, rowData.length);
    
    // Log para debugging
    console.log('Nueva respuesta RSVP guardada:', {
      nombre: params.nombre,
      asistencia: params.asistencia,
      invitados: params.invitados,
      fila: lastRow
    });
    
    // Respuesta exitosa
    return {
      status: 'success',
      message: 'Respuesta guardada correctamente',
      row: lastRow,
      data: rowData
    };
      
  } catch (error) {
    // Log del error
    console.error('Error en handleRSVPRequest:', error);
    
    // Respuesta de error
    return {
      status: 'error',
      message: 'Error interno del servidor: ' + error.toString(),
      stack: error.stack
    };
  }
}

/**
 * Función para probar el script localmente
 * Puedes ejecutar esta función desde el editor para probar
 */
function testScript() {
  // Simular parámetros de prueba
  const testParams = {
    nombre: 'Juan Pérez Test',
    asistencia: 'Sí',
    invitados: '2',
    mensaje: 'Muy emocionados por la boda! (PRUEBA)',
    fecha: new Date().toLocaleString('es-MX')
  };
  
  // Ejecutar la función
  const result = handleRSVPRequest(testParams);
  console.log('Resultado de prueba:', result);
}

/**
 * Función para configurar la hoja inicial (opcional)
 * Ejecuta esta función una vez para configurar la hoja con formato
 */
function setupSheet() {
  const SPREADSHEET_ID = '1Cn4uviDanHrnTMM4X6Z8m6E1fMDHVwAOS-zVTyagTyo';
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  
  let sheet = spreadsheet.getSheetByName('RSVP');
  
  if (!sheet) {
    sheet = spreadsheet.insertSheet('RSVP');
  }
  
  // Limpiar hoja existente
  sheet.clear();
  
  // Configurar encabezados
  const headers = [
    'Fecha de Respuesta',
    'Nombre Completo', 
    'Asistencia',
    'Número de Invitados',
    'Mensaje',
    'Timestamp del Servidor'
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // Formatear encabezados
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#d4af37'); // Color dorado del tema
  headerRange.setFontColor('white');
  headerRange.setHorizontalAlignment('center');
  
  // Configurar ancho de columnas
  sheet.setColumnWidth(1, 150); // Fecha
  sheet.setColumnWidth(2, 200); // Nombre
  sheet.setColumnWidth(3, 100); // Asistencia
  sheet.setColumnWidth(4, 120); // Invitados
  sheet.setColumnWidth(5, 300); // Mensaje
  sheet.setColumnWidth(6, 180); // Timestamp
  
  // Congelar la primera fila
  sheet.setFrozenRows(1);
  
  console.log('Hoja configurada correctamente');
}