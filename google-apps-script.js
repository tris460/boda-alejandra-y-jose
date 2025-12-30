/**
 * Google Apps Script para manejar las respuestas RSVP
 * Este script recibe los datos del formulario y los guarda en la hoja de cálculo
 */

// Función para manejar requests GET (para compatibilidad)
function doGet(e) {
  return handleRequest(e.parameter);
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
  
  return handleRequest(params);
}

// Función principal que maneja la lógica
function handleRequest(params) {
  try {
    // ID de tu hoja de cálculo (extraído de la URL)
    const SPREADSHEET_ID = '1Cn4uviDanHrnTMM4X6Z8m6E1fMDHVwAOS-zVTyagTyo';
    
    // Log para debugging
    console.log('Parámetros recibidos:', params);
    
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
      return ContentService
        .createTextOutput(JSON.stringify({
          status: 'error',
          message: 'Faltan datos requeridos: nombre y asistencia son obligatorios'
        }))
        .setMimeType(ContentService.MimeType.JSON);
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
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'success',
        message: 'Respuesta guardada correctamente',
        row: lastRow,
        data: rowData
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Log del error
    console.error('Error en handleRequest:', error);
    
    // Respuesta de error
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'error',
        message: 'Error interno del servidor: ' + error.toString(),
        stack: error.stack
      }))
      .setMimeType(ContentService.MimeType.JSON);
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
  const result = handleRequest(testParams);
  console.log('Resultado de prueba:', result.getContent());
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