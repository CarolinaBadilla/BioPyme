import dotenv from 'dotenv';
import path from 'path';

// Cargar variables de entorno desde la raíz
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Sembrando consorcios camineros...');

  // Limpiar tabla antes de insertar
  await prisma.consorcioCaminero.deleteMany();
  console.log('🗑️ Tabla consorcios_camineros limpiada');

  const consorcios = [
    // Regional 1
    { regional: "Regional 1", codigo: "CC 103", nombre: "Deán Funes", localidad: "Deán Funes", latitud: -30.4203, longitud: -64.3498 },
    { regional: "Regional 1", codigo: "CC 113", nombre: "Los Pozos", localidad: "Deán Funes", latitud: -30.4833, longitud: -64.2833 },
    { regional: "Regional 1", codigo: "CC 165", nombre: "Candelaria", localidad: "La Candelaria", latitud: -31.0833, longitud: -64.6000 },
    { regional: "Regional 1", codigo: "CC 169", nombre: "Tuclame-Iglesia Vieja", localidad: "Tuclame", latitud: -30.7600, longitud: -65.2000 },
    { regional: "Regional 1", codigo: "CC 174", nombre: "Serrezuela", localidad: "Serrezuela", latitud: -30.6380, longitud: -65.3871 },
    { regional: "Regional 1", codigo: "CC 177", nombre: "Punilla Norte", localidad: "Capilla del Monte", latitud: -30.8583, longitud: -64.5242 },
    { regional: "Regional 1", codigo: "CC 196", nombre: "Media Naranja", localidad: "Media Naranja", latitud: -30.7000, longitud: -64.8833 },
    { regional: "Regional 1", codigo: "CC 367", nombre: "San Marcos Sierras", localidad: "San Marcos Sierras", latitud: -30.7825, longitud: -64.6339 },
    { regional: "Regional 1", codigo: "CC 390", nombre: "San José Mallín", localidad: "Cosquín", latitud: -31.2444, longitud: -64.4658 },
    { regional: "Regional 1", codigo: "CC 411", nombre: "Mariano Moreno", localidad: "Villa de Soto", latitud: -30.8542, longitud: -64.9983 },
    { regional: "Regional 1", codigo: "CC 415", nombre: "Tosno", localidad: "Tosno", latitud: -30.9333, longitud: -65.0833 },

    // Regional 2
    { regional: "Regional 2", codigo: "CC 74", nombre: "Conlara", localidad: "Conlara", latitud: -32.1333, longitud: -65.2500 },
    { regional: "Regional 2", codigo: "CC 151", nombre: "Alto Grande", localidad: "San Alberto", latitud: -31.7500, longitud: -65.0000 },
    { regional: "Regional 2", codigo: "CC 214", nombre: "El Huaico", localidad: "Villa Dolores", latitud: -31.9500, longitud: -65.1833 },
    { regional: "Regional 2", codigo: "CC 227", nombre: "San Lorenzo", localidad: "San Lorenzo", latitud: -31.8167, longitud: -65.0167 },
    { regional: "Regional 2", codigo: "CC 252", nombre: "Las Calles", localidad: "Las Calles", latitud: -31.8167, longitud: -64.9667 },
    { regional: "Regional 2", codigo: "CC 279", nombre: "San Vicente", localidad: "San Vicente", latitud: -31.9000, longitud: -65.2500 },
    { regional: "Regional 2", codigo: "CC 281", nombre: "San Javier", localidad: "San Javier", latitud: -32.0167, longitud: -65.0167 },
    { regional: "Regional 2", codigo: "CC 305", nombre: "La Ramada", localidad: "La Ramada", latitud: -31.7000, longitud: -65.1000 },
    { regional: "Regional 2", codigo: "CC 330", nombre: "Chancaní", localidad: "Chancaní", latitud: -31.4167, longitud: -65.4667 },
    { regional: "Regional 2", codigo: "CC 379", nombre: "San Carlos Minas", localidad: "San Carlos Minas", latitud: -31.1833, longitud: -65.1000 },
    { regional: "Regional 2", codigo: "CC 385", nombre: "Los Cerrillos", localidad: "Los Cerrillos", latitud: -31.9333, longitud: -65.4333 },
    { regional: "Regional 2", codigo: "CC 417", nombre: "Pampa de Achala", localidad: "Mina Clavero", latitud: -31.6000, longitud: -64.8333 },
    { regional: "Regional 2", codigo: "CC 419", nombre: "Camino Real (Los Hornillos)", localidad: "Los Hornillos", latitud: -31.8833, longitud: -64.9833 },
    { regional: "Regional 2", codigo: "CC 421", nombre: "Tala Cañada", localidad: "Tala Cañada", latitud: -31.3500, longitud: -64.9667 },

    // Regional 3
    { regional: "Regional 3", codigo: "CC 208", nombre: "San Francisco del Chañar", localidad: "San Francisco del Chañar", latitud: -29.7833, longitud: -63.9333 },
    { regional: "Regional 3", codigo: "CC 249", nombre: "La Totorilla", localidad: "Sobremonte", latitud: -29.8500, longitud: -63.8500 },
    { regional: "Regional 3", codigo: "CC 291", nombre: "El Guanaco", localidad: "Río Seco", latitud: -29.9000, longitud: -63.7000 },
    { regional: "Regional 3", codigo: "CC 363", nombre: "Santa Elena", localidad: "Santa Elena", latitud: -30.0833, longitud: -63.9667 },
    { regional: "Regional 3", codigo: "CC 364", nombre: "Las Peñas", localidad: "Las Peñas", latitud: -30.5833, longitud: -64.0167 },
    { regional: "Regional 3", codigo: "CC 370", nombre: "Villa Tulumba", localidad: "Villa Tulumba", latitud: -30.3983, longitud: -64.1225 },
    { regional: "Regional 3", codigo: "CC 372", nombre: "San José de la Dormida", localidad: "San José de la Dormida", latitud: -30.3551, longitud: -63.9481 },
    { regional: "Regional 3", codigo: "CC 384", nombre: "Las Arrias", localidad: "Las Arrias", latitud: -30.3667, longitud: -63.6000 },
    { regional: "Regional 3", codigo: "CC 393", nombre: "Villa de María de Río Seco", localidad: "Villa de María", latitud: -29.9058, longitud: -63.7258 },
    { regional: "Regional 3", codigo: "CC 408", nombre: "La Rinconada", localidad: "La Rinconada", latitud: -29.9833, longitud: -63.5167 },
    { regional: "Regional 3", codigo: "CC 413", nombre: "Gutemberg", localidad: "Gutenberg", latitud: -29.5667, longitud: -63.5667 },
    { regional: "Regional 3", codigo: "CC 414", nombre: "Puesto de Castro", localidad: "Puesto de Castro", latitud: -30.1000, longitud: -63.4500 },

    // Regional 4
    { regional: "Regional 4", codigo: "CC 33", nombre: "Cañada de Río Pinto", localidad: "Cañada de Río Pinto", latitud: -30.7500, longitud: -64.2500 },
    { regional: "Regional 4", codigo: "CC 35", nombre: "Monte Cristo", localidad: "Monte Cristo", latitud: -31.3444, longitud: -63.9458 },
    { regional: "Regional 4", codigo: "CC 84", nombre: "Colonia Caroya", localidad: "Colonia Caroya", latitud: -31.0289, longitud: -64.0612 },
    { regional: "Regional 4", codigo: "CC 186", nombre: "Capilla de Sitón - La Posta", localidad: "Capilla de Sitón", latitud: -30.6667, longitud: -63.6833 },
    { regional: "Regional 4", codigo: "CC 200", nombre: "La Granja", localidad: "La Granja", latitud: -31.0083, longitud: -64.2708 },
    { regional: "Regional 4", codigo: "CC 201", nombre: "El Quebrachal", localidad: "Totoral", latitud: -30.8000, longitud: -63.8500 },
    { regional: "Regional 4", codigo: "CC 211", nombre: "Los Cometierra", localidad: "Jesús María", latitud: -30.9833, longitud: -64.0833 },
    { regional: "Regional 4", codigo: "CC 229", nombre: "General Paz", localidad: "Estación General Paz", latitud: -31.1333, longitud: -64.1500 },
    { regional: "Regional 4", codigo: "CC 239", nombre: "Tres Esquinas", localidad: "Sinsacate", latitud: -30.9412, longitud: -64.0889 },
    { regional: "Regional 4", codigo: "CC 261", nombre: "Candelaria", localidad: "Saldán", latitud: -31.3000, longitud: -64.3000 },
    { regional: "Regional 4", codigo: "CC 298", nombre: "Colonia Tirolesa", localidad: "Colonia Tirolesa", latitud: -31.2412, longitud: -64.0621 },
    { regional: "Regional 4", codigo: "CC 314", nombre: "Piquillín", localidad: "Piquillín", latitud: -31.3089, longitud: -63.5012 },

    // Regional 5
    { regional: "Regional 5", codigo: "CC 21", nombre: "Capilla del Carmen", localidad: "Capilla del Carmen", latitud: -31.5167, longitud: -63.6167 },
    { regional: "Regional 5", codigo: "CC 42", nombre: "Villa del Rosario", localidad: "Villa del Rosario", latitud: -31.5567, longitud: -63.5350 },
    { regional: "Regional 5", codigo: "CC 73", nombre: "Río Segundo", localidad: "Río Segundo", latitud: -31.6421, longitud: -63.8812 },
    { regional: "Regional 5", codigo: "CC 88", nombre: "Matorrales", localidad: "Matorrales", latitud: -31.7121, longitud: -63.4215 },
    { regional: "Regional 5", codigo: "CC 90", nombre: "Pilar", localidad: "Pilar", latitud: -31.6821, longitud: -63.8689 },
    { regional: "Regional 5", codigo: "CC 95", nombre: "Luque", localidad: "Luque", latitud: -31.6472, longitud: -63.3429 },
    { regional: "Regional 5", codigo: "CC 100", nombre: "Laguna Larga", localidad: "Laguna Larga", latitud: -31.7789, longitud: -63.8012 },
    { regional: "Regional 5", codigo: "CC 101", nombre: "Calchín", localidad: "Calchín", latitud: -31.6668, longitud: -63.1951 },
    { regional: "Regional 5", codigo: "CC 171", nombre: "La Carbonada", localidad: "Córdoba", latitud: -31.4833, longitud: -64.1167 },
    { regional: "Regional 5", codigo: "CC 182", nombre: "Colonia Impira", localidad: "Impira", latitud: -31.7333, longitud: -63.6667 },
    { regional: "Regional 5", codigo: "CC 224", nombre: "Despeñaderos", localidad: "Despeñaderos", latitud: -31.8121, longitud: -64.2981 },
    { regional: "Regional 5", codigo: "CC 232", nombre: "Monte Ralo", localidad: "Monte Ralo", latitud: -31.8833, longitud: -64.2167 },
    { regional: "Regional 5", codigo: "CC 378", nombre: "12 de octubre", localidad: "Oncativo", latitud: -31.9167, longitud: -63.6833 },
    { regional: "Regional 5", codigo: "CC 398", nombre: "Potrero de Garay", localidad: "Potrero de Garay", latitud: -31.7914, longitud: -64.5458 },
    { regional: "Regional 5", codigo: "CC 399", nombre: "Tres Lomas", localidad: "Santa María", latitud: -31.6000, longitud: -64.4000 },
    { regional: "Regional 5", codigo: "CC 409", nombre: "Falda del Carmen", localidad: "Falda del Carmen", latitud: -31.5167, longitud: -64.4500 },

    // Regional 6
    { regional: "Regional 6", codigo: "CC 25", nombre: "La Para", localidad: "La Para", latitud: -30.8953, longitud: -62.9992 },
    { regional: "Regional 6", codigo: "CC 48", nombre: "Río Primero", localidad: "Río Primero", latitud: -31.3389, longitud: -63.6312 },
    { regional: "Regional 6", codigo: "CC 50", nombre: "Plaza Mercedes", localidad: "Plaza Mercedes", latitud: -31.2500, longitud: -63.4000 },
    { regional: "Regional 6", codigo: "CC 207", nombre: "La Puerta", localidad: "La Puerta", latitud: -31.1589, longitud: -63.2612 },
    { regional: "Regional 6", codigo: "CC 219", nombre: "Villa Fontana", localidad: "Villa Fontana", latitud: -31.1589, longitud: -63.3481 },
    { regional: "Regional 6", codigo: "CC 243", nombre: "Diego de Rojas", localidad: "Diego de Rojas", latitud: -31.1167, longitud: -63.3500 },
    { regional: "Regional 6", codigo: "CC 251", nombre: "Cuatro Esquinas", localidad: "Río Primero", latitud: -31.2833, longitud: -63.5500 },
    { regional: "Regional 6", codigo: "CC 317", nombre: "Colonia El Fortín", localidad: "El Fortín", latitud: -31.9667, longitud: -62.3000 },
    { regional: "Regional 6", codigo: "CC 321", nombre: "Obispo Trejo", localidad: "Obispo Trejo", latitud: -30.7828, longitud: -63.4150 },
    { regional: "Regional 6", codigo: "CC 322", nombre: "La Quinta", localidad: "La Quinta", latitud: -31.0500, longitud: -63.2000 },
    { regional: "Regional 6", codigo: "CC 327", nombre: "Las Gramillas", localidad: "Las Gramillas", latitud: -31.4167, longitud: -63.2500 },
    { regional: "Regional 6", codigo: "CC 331", nombre: "Colonia La Argentina", localidad: "Villa Concepción del Tío", latitud: -31.3000, longitud: -62.8000 },
    { regional: "Regional 6", codigo: "CC 351", nombre: "Santa Rosa de Río Primero", localidad: "Santa Rosa de Río Primero", latitud: -31.1512, longitud: -63.4021 },
    { regional: "Regional 6", codigo: "CC 371", nombre: "Las Saladas", localidad: "Las Saladas", latitud: -31.1833, longitud: -63.6667 },
    { regional: "Regional 6", codigo: "CC 376", nombre: "Sanavirones", localidad: "Sanavirones", latitud: -30.9833, longitud: -63.1500 },
    { regional: "Regional 6", codigo: "CC 388", nombre: "Sagrada Familia", localidad: "Tránsito", latitud: -31.4500, longitud: -63.1000 },
    { regional: "Regional 6", codigo: "CC 392", nombre: "Los Chañaritos", localidad: "Los Chañaritos", latitud: -31.4500, longitud: -63.5667 },
    { regional: "Regional 6", codigo: "CC 406", nombre: "Comechingones", localidad: "Comechingones", latitud: -31.1833, longitud: -63.5000 },
    { regional: "Regional 6", codigo: "CC 420", nombre: "El Crispín", localidad: "El Crispín", latitud: -31.0833, longitud: -63.4667 },

    // Regional 7
    { regional: "Regional 7", codigo: "CC 7", nombre: "La Francia", localidad: "La Francia", latitud: -31.4069, longitud: -62.6342 },
    { regional: "Regional 7", codigo: "CC 16", nombre: "El Tío", localidad: "El Tío", latitud: -31.3833, longitud: -62.8333 },
    { regional: "Regional 7", codigo: "CC 18", nombre: "Marull", localidad: "Marull", latitud: -30.9639, longitud: -62.8258 },
    { regional: "Regional 7", codigo: "CC 22", nombre: "Tránsito", localidad: "Tránsito", latitud: -31.4258, longitud: -63.1983 },
    { regional: "Regional 7", codigo: "CC 26", nombre: "Villa Concepción del Tío", localidad: "Villa Concepción del Tío", latitud: -31.3253, longitud: -62.8142 },
    { regional: "Regional 7", codigo: "CC 30", nombre: "Miramar", localidad: "Miramar", latitud: -30.9189, longitud: -62.6781 },
    { regional: "Regional 7", codigo: "CC 39", nombre: "La Tordilla", localidad: "La Tordilla", latitud: -31.2500, longitud: -62.8833 },
    { regional: "Regional 7", codigo: "CC 102", nombre: "La Pobladora", localidad: "Arroyito", latitud: -31.4500, longitud: -63.0000 },
    { regional: "Regional 7", codigo: "CC 109", nombre: "Las Pichanas", localidad: "Las Pichanas", latitud: -31.2000, longitud: -62.9000 },
    { regional: "Regional 7", codigo: "CC 125", nombre: "Balnearia", localidad: "Balnearia", latitud: -31.0112, longitud: -62.6712 },
    { regional: "Regional 7", codigo: "CC 144", nombre: "Arroyito", localidad: "Arroyito", latitud: -31.4189, longitud: -63.0581 },
    { regional: "Regional 7", codigo: "CC 153", nombre: "Colonia San Bartolomé", localidad: "Colonia San Bartolomé", latitud: -31.5500, longitud: -62.7167 },
    { regional: "Regional 7", codigo: "CC 185", nombre: "Vacas Blancas", localidad: "El Tío", latitud: -31.3000, longitud: -62.7500 },
    { regional: "Regional 7", codigo: "CC 257", nombre: "Trincheras", localidad: "Trincheras", latitud: -31.4667, longitud: -62.7667 },
    { regional: "Regional 7", codigo: "CC 285", nombre: "Villa Guglieri", localidad: "La Francia", latitud: -31.3500, longitud: -62.5500 },

    // Regional 8
    { regional: "Regional 8", codigo: "CC 10", nombre: "La Paquita", localidad: "La Paquita", latitud: -30.8833, longitud: -62.2000 },
    { regional: "Regional 8", codigo: "CC 12", nombre: "Altos de Chipión", localidad: "Altos de Chipión", latitud: -30.9583, longitud: -62.3361 },
    { regional: "Regional 8", codigo: "CC 19", nombre: "Brinkmann", localidad: "Brinkmann", latitud: -30.8651, longitud: -62.0412 },
    { regional: "Regional 8", codigo: "CC 66", nombre: "Colonia Vignaud", localidad: "Colonia Vignaud", latitud: -30.8500, longitud: -62.0000 },
    { regional: "Regional 8", codigo: "CC 82", nombre: "Porteña", localidad: "Porteña", latitud: -31.0121, longitud: -62.0689 },
    { regional: "Regional 8", codigo: "CC 104", nombre: "Freyre", localidad: "Freyre", latitud: -31.1712, longitud: -62.1021 },
    { regional: "Regional 8", codigo: "CC 119", nombre: "Morteros", localidad: "Morteros", latitud: -30.7189, longitud: -61.9981 },
    { regional: "Regional 8", codigo: "CC 140", nombre: "Seeber", localidad: "Seeber", latitud: -30.9167, longitud: -61.9667 },
    { regional: "Regional 8", codigo: "CC 258", nombre: "Colonia Valtelina", localidad: "Colonia Valtelina", latitud: -31.0333, longitud: -62.2333 },
    { regional: "Regional 8", codigo: "CC 293", nombre: "Colonia Anita", localidad: "San Justo", latitud: -30.9833, longitud: -62.1167 },
    { regional: "Regional 8", codigo: "CC 344", nombre: "Colonia Dos Hermanos", localidad: "Morteros", latitud: -30.6833, longitud: -61.9167 },
    { regional: "Regional 8", codigo: "CC 345", nombre: "Colonia Beiró", localidad: "Porteña", latitud: -30.9500, longitud: -62.0333 },
    { regional: "Regional 8", codigo: "CC 346", nombre: "Colonia Maunier", localidad: "Freyre", latitud: -31.1000, longitud: -62.0500 },
    { regional: "Regional 8", codigo: "CC 347", nombre: "Colonia Milesi", localidad: "Seeber", latitud: -30.8833, longitud: -61.9167 },
    { regional: "Regional 8", codigo: "CC 396", nombre: "Colonia 10 de Julio", localidad: "Morteros", latitud: -30.6000, longitud: -61.9833 },

    // Regional 9
    { regional: "Regional 9", codigo: "CC 13", nombre: "Devoto", localidad: "Devoto", latitud: -31.4053, longitud: -62.3083 },
    { regional: "Regional 9", codigo: "CC 15", nombre: "Alicia", localidad: "Alicia", latitud: -31.9421, longitud: -62.4690 },
    { regional: "Regional 9", codigo: "CC 17", nombre: "El Fortín", localidad: "El Fortín", latitud: -31.9667, longitud: -62.3000 },
    { regional: "Regional 9", codigo: "CC 20", nombre: "Colonia Prosperidad", localidad: "Colonia Prosperidad", latitud: -31.6167, longitud: -62.3833 },
    { regional: "Regional 9", codigo: "CC 36", nombre: "Las Varas", localidad: "Las Varas", latitud: -31.8083, longitud: -62.6056 },
    { regional: "Regional 9", codigo: "CC 58", nombre: "Saturnino María Laspiur", localidad: "Saturnino María Laspiur", latitud: -31.7012, longitud: -62.4812 },
    { regional: "Regional 9", codigo: "CC 76", nombre: "Colonia Marina", localidad: "Colonia Marina", latitud: -31.3500, longitud: -62.2833 },
    { regional: "Regional 9", codigo: "CC 98", nombre: "Las Varillas", localidad: "Las Varillas", latitud: -31.8706, longitud: -62.7192 },
    { regional: "Regional 9", codigo: "CC 105", nombre: "Sacanta", localidad: "Sacanta", latitud: -31.6612, longitud: -63.0489 },
    { regional: "Regional 9", codigo: "CC 111", nombre: "El Arañado", localidad: "El Arañado", latitud: -31.8500, longitud: -62.8333 },
    { regional: "Regional 9", codigo: "CC 161", nombre: "Quebracho Herrado", localidad: "Quebracho Herrado", latitud: -31.4500, longitud: -62.1833 },
    { regional: "Regional 9", codigo: "CC 255", nombre: "Villa San Esteban", localidad: "San Francisco", latitud: -31.4167, longitud: -62.0667 },
    { regional: "Regional 9", codigo: "CC 265", nombre: "Plaza Luxardo", localidad: "Plaza Luxardo", latitud: -31.3167, longitud: -62.1000 },
    { regional: "Regional 9", codigo: "CC 292", nombre: "Plaza San Francisco", localidad: "San Francisco", latitud: -31.3833, longitud: -62.0833 },
    { regional: "Regional 9", codigo: "CC 299", nombre: "Colonia Iturraspe", localidad: "Colonia Iturraspe", latitud: -31.5000, longitud: -62.2500 },

    // Regional 10
    { regional: "Regional 10", codigo: "CC 4", nombre: "Oliva", localidad: "Oliva", latitud: -32.0412, longitud: -63.5789 },
    { regional: "Regional 10", codigo: "CC 53", nombre: "Oncativo", localidad: "Oncativo", latitud: -31.9139, longitud: -63.6817 },
    { regional: "Regional 10", codigo: "CC 75", nombre: "Las Junturas", localidad: "Las Junturas", latitud: -31.8300, longitud: -63.4500 },
    { regional: "Regional 10", codigo: "CC 79", nombre: "Colazo", localidad: "Colazo", latitud: -31.8167, longitud: -63.3333 },
    { regional: "Regional 10", codigo: "CC 87", nombre: "Pozo del Molle", localidad: "Pozo del Molle", latitud: -32.0167, longitud: -62.9167 },
    { regional: "Regional 10", codigo: "CC 106", nombre: "La Playosa", localidad: "La Playosa", latitud: -32.1012, longitud: -63.0312 },
    { regional: "Regional 10", codigo: "CC 172", nombre: "Arroyo Algodón", localidad: "Arroyo Algodón", latitud: -32.1833, longitud: -63.1667 },
    { regional: "Regional 10", codigo: "CC 194", nombre: "Carrilobo", localidad: "Carrilobo", latitud: -31.8833, longitud: -63.1167 },
    { regional: "Regional 10", codigo: "CC 202", nombre: "James Craik", localidad: "James Craik", latitud: -32.1612, longitud: -63.4789 },
    { regional: "Regional 10", codigo: "CC 203", nombre: "Colonia Cocha", localidad: "Colonia Cocha", latitud: -31.9667, longitud: -63.8000 },
    { regional: "Regional 10", codigo: "CC 222", nombre: "Manfredi", localidad: "Manfredi", latitud: -31.8333, longitud: -63.7500 },
    { regional: "Regional 10", codigo: "CC 226", nombre: "Colonia Videla", localidad: "Colonia Videla", latitud: -31.7667, longitud: -63.6000 },
    { regional: "Regional 10", codigo: "CC 230", nombre: "Colonia Almada", localidad: "Colonia Almada", latitud: -32.0167, longitud: -63.8333 },
    { regional: "Regional 10", codigo: "CC 244", nombre: "Corral del Bajo", localidad: "Oncativo", latitud: -31.9833, longitud: -63.6333 },
    { regional: "Regional 10", codigo: "CC 277", nombre: "Villa Ascasubi", localidad: "Villa Ascasubi", latitud: -32.1612, longitud: -63.8921 },
    { regional: "Regional 10", codigo: "CC 303", nombre: "Los Zorros", localidad: "Los Zorros", latitud: -32.0833, longitud: -63.2667 },
    { regional: "Regional 10", codigo: "CC 350", nombre: "Calchín Oeste", localidad: "Calchín Oeste", latitud: -31.7333, longitud: -63.2333 },

    // Regional 11
    { regional: "Regional 11", codigo: "CC 2", nombre: "Silvio Pellico", localidad: "Silvio Pellico", latitud: -32.2500, longitud: -63.0833 },
    { regional: "Regional 11", codigo: "CC 28", nombre: "Chilibroste", localidad: "Chilibroste", latitud: -32.6167, longitud: -62.4333 },
    { regional: "Regional 11", codigo: "CC 31", nombre: "Ordóñez", localidad: "Ordóñez", latitud: -32.8389, longitud: -62.8667 },
    { regional: "Regional 11", codigo: "CC 37", nombre: "Idiazábal", localidad: "Idiazábal", latitud: -32.8167, longitud: -63.0333 },
    { regional: "Regional 11", codigo: "CC 40", nombre: "Colonia 25 de Mayo", localidad: "San Marcos Sud", latitud: -32.6833, longitud: -62.5833 },
    { regional: "Regional 11", codigo: "CC 46", nombre: "Ballesteros", localidad: "Ballesteros", latitud: -32.5312, longitud: -62.5589 },
    { regional: "Regional 11", codigo: "CC 49", nombre: "Ana Zumarán", localidad: "Ana Zumarán", latitud: -32.3500, longitud: -62.7167 },
    { regional: "Regional 11", codigo: "CC 55", nombre: "Morrison", localidad: "Morrison", latitud: -32.5921, longitud: -62.8389 },
    { regional: "Regional 11", codigo: "CC 65", nombre: "Cintra", localidad: "Cintra", latitud: -32.3083, longitud: -62.6500 },
    { regional: "Regional 11", codigo: "CC 116", nombre: "Justiniano Posse", localidad: "Justiniano Posse", latitud: -32.8833, longitud: -62.6833 },
    { regional: "Regional 11", codigo: "CC 130", nombre: "Ausonia", localidad: "Ausonia", latitud: -32.3667, longitud: -63.2333 },
    { regional: "Regional 11", codigo: "CC 134", nombre: "San Antonio de Litín", localidad: "San Antonio de Litín", latitud: -32.2167, longitud: -62.6333 },
    { regional: "Regional 11", codigo: "CC 135", nombre: "Bell Ville", localidad: "Bell Ville", latitud: -32.6189, longitud: -62.6681 },
    { regional: "Regional 11", codigo: "CC 149", nombre: "Alto Alegre", localidad: "Alto Alegre", latitud: -32.1833, longitud: -62.8833 },
    { regional: "Regional 11", codigo: "CC 159", nombre: "La Herradura", localidad: "Bell Ville", latitud: -32.5500, longitud: -62.6000 },
    { regional: "Regional 11", codigo: "CC 295", nombre: "Los Ucles", localidad: "Ordóñez", latitud: -32.7500, longitud: -62.7833 },
    { regional: "Regional 11", codigo: "CC 336", nombre: "Cuatro Caminos", localidad: "Justiniano Posse", latitud: -32.9500, longitud: -62.6000 },
    { regional: "Regional 11", codigo: "CC 391", nombre: "Monte Leña", localidad: "Monte Leña", latitud: -32.6333, longitud: -62.5833 },

    // Regional 12
    { regional: "Regional 12", codigo: "CC 1", nombre: "Alejandro", localidad: "Alejandro Roca", latitud: -33.3528, longitud: -63.7183 },
    { regional: "Regional 12", codigo: "CC 3", nombre: "Los Cisnes", localidad: "Los Cisnes", latitud: -33.3912, longitud: -63.4589 },
    { regional: "Regional 12", codigo: "CC 14", nombre: "La Laguna", localidad: "La Laguna", latitud: -32.8000, longitud: -63.2500 },
    { regional: "Regional 12", codigo: "CC 44", nombre: "Etruria", localidad: "Etruria", latitud: -32.8389, longitud: -63.2481 },
    { regional: "Regional 12", codigo: "CC 60", nombre: "Pasco", localidad: "Pasco", latitud: -32.7500, longitud: -63.3333 },
    { regional: "Regional 12", codigo: "CC 64", nombre: "Carnerillo", localidad: "Carnerillo", latitud: -32.9167, longitud: -64.0167 },
    { regional: "Regional 12", codigo: "CC 72", nombre: "General Cabrera", localidad: "General Cabrera", latitud: -32.8131, longitud: -63.8722 },
    { regional: "Regional 12", codigo: "CC 183", nombre: "Olaeta", localidad: "Olaeta", latitud: -33.0500, longitud: -63.9000 },
    { regional: "Regional 12", codigo: "CC 188", nombre: "Ucacha", localidad: "Ucacha", latitud: -33.0319, longitud: -63.5042 },
    { regional: "Regional 12", codigo: "CC 189", nombre: "Chazón", localidad: "Chazón", latitud: -33.0833, longitud: -63.2833 },
    { regional: "Regional 12", codigo: "CC 215", nombre: "Charras", localidad: "Charras", latitud: -33.0167, longitud: -64.0500 },
    { regional: "Regional 12", codigo: "CC 228", nombre: "Santa Eufemia", localidad: "Santa Eufemia", latitud: -33.1758, longitud: -63.2811 },
    { regional: "Regional 12", codigo: "CC 234", nombre: "Las Acequias", localidad: "Las Acequias", latitud: -33.2833, longitud: -63.9833 },
    { regional: "Regional 12", codigo: "CC 307", nombre: "Bengolea", localidad: "Bengolea", latitud: -33.0333, longitud: -63.6667 },
    { regional: "Regional 12", codigo: "CC 377", nombre: "La Carlota", localidad: "La Carlota", latitud: -33.4210, longitud: -63.2981 },

    // Regional 13
    { regional: "Regional 13", codigo: "CC 24", nombre: "Los Cóndores", localidad: "Los Cóndores", latitud: -32.2167, longitud: -64.2833 },
    { regional: "Regional 13", codigo: "CC 51", nombre: "Elena", localidad: "Elena", latitud: -32.5712, longitud: -64.3981 },
    { regional: "Regional 13", codigo: "CC 61", nombre: "Alcira Gigena", localidad: "Alcira Gigena", latitud: -32.7533, longitud: -64.3361 },
    { regional: "Regional 13", codigo: "CC 78", nombre: "Río Tercero", localidad: "Río Tercero", latitud: -32.1812, longitud: -64.1451 },
    { regional: "Regional 13", codigo: "CC 92", nombre: "Corralito", localidad: "Corralito", latitud: -32.0333, longitud: -64.1833 },
    { regional: "Regional 13", codigo: "CC 108", nombre: "Almafuerte", localidad: "Almafuerte", latitud: -32.1936, longitud: -64.2567 },
    { regional: "Regional 13", codigo: "CC 152", nombre: "Alpa Corral", localidad: "Alpa Corral", latitud: -32.6889, longitud: -64.7236 },
    { regional: "Regional 13", codigo: "CC 181", nombre: "Sierras Grande - Lutti", localidad: "Lutti", latitud: -32.3333, longitud: -64.8000 },
    { regional: "Regional 13", codigo: "CC 192", nombre: "Las Caleras", localidad: "Las Caleras", latitud: -32.4167, longitud: -64.5833 },
    { regional: "Regional 13", codigo: "CC 256", nombre: "San Agustín", localidad: "San Agustín", latitud: -31.9833, longitud: -64.3667 },
    { regional: "Regional 13", codigo: "CC 294", nombre: "Las Peñas Sud", localidad: "Las Peñas Sud", latitud: -32.5167, longitud: -64.2000 },
    { regional: "Regional 13", codigo: "CC 308", nombre: "Berrotarán", localidad: "Berrotarán", latitud: -32.4589, longitud: -64.3981 },
    { regional: "Regional 13", codigo: "CC 405", nombre: "La Cumbrecita", localidad: "La Cumbrecita", latitud: -31.8986, longitud: -64.7742 },
    { regional: "Regional 13", codigo: "CC 412", nombre: "Cerro Colorado", localidad: "Cerro Colorado", latitud: -30.1000, longitud: -63.9333 },

    // Regional 14
    { regional: "Regional 14", codigo: "CC 23", nombre: "Tancacha", localidad: "Tancacha", latitud: -32.2412, longitud: -63.9812 },
    { regional: "Regional 14", codigo: "CC 32", nombre: "Arroyo Cabral", localidad: "Arroyo Cabral", latitud: -32.4908, longitud: -63.4008 },
    { regional: "Regional 14", codigo: "CC 69", nombre: "General Deheza", localidad: "General Deheza", latitud: -32.7589, longitud: -63.7881 },
    { regional: "Regional 14", codigo: "CC 83", nombre: "Hernando", localidad: "Hernando", latitud: -32.4289, longitud: -63.7381 },
    { regional: "Regional 14", codigo: "CC 86", nombre: "Las Perdices", localidad: "Las Perdices", latitud: -32.6986, longitud: -63.7058 },
    { regional: "Regional 14", codigo: "CC 94", nombre: "Dalmacio Vélez", localidad: "Dalmacio Vélez Sarsfield", latitud: -32.6103, longitud: -63.5786 },
    { regional: "Regional 14", codigo: "CC 107", nombre: "Ticino", localidad: "Ticino", latitud: -32.6933, longitud: -63.4358 },
    { regional: "Regional 14", codigo: "CC 124", nombre: "Paraje Santa Rosa", localidad: "Rio Tercero", latitud: -32.2833, longitud: -63.8500 },
    { regional: "Regional 14", codigo: "CC 148", nombre: "Villa Nueva", localidad: "Villa Nueva", latitud: -32.4389, longitud: -63.2512 },
    { regional: "Regional 14", codigo: "CC 167", nombre: "Gral. Fotheringham", localidad: "General Fotheringham", latitud: -32.2612, longitud: -63.8289 },
    { regional: "Regional 14", codigo: "CC 175", nombre: "La Palestina", localidad: "La Palestina", latitud: -32.5500, longitud: -63.3000 },
    { regional: "Regional 14", codigo: "CC 187", nombre: "San Antonio de Yupat", localidad: "Villa María", latitud: -32.3500, longitud: -63.4000 },
    { regional: "Regional 14", codigo: "CC 236", nombre: "Punta del Agua", localidad: "Punta del Agua", latitud: -32.5833, longitud: -63.8000 },
    { regional: "Regional 14", codigo: "CC 275", nombre: "Luca", localidad: "Luca", latitud: -32.3512, longitud: -63.3521 },
    { regional: "Regional 14", codigo: "CC 297", nombre: "Pampayasta Norte", localidad: "Pampayasta Norte", latitud: -32.3167, longitud: -63.6333 },
    { regional: "Regional 14", codigo: "CC 302", nombre: "Tío Pujio", localidad: "Tío Pujio", latitud: -32.2833, longitud: -63.3500 },
    { regional: "Regional 14", codigo: "CC 323", nombre: "Las Isletillas", localidad: "Las Isletillas", latitud: -32.3833, longitud: -63.8333 },

    // Regional 15
    { regional: "Regional 15", codigo: "CC 52", nombre: "Suco", localidad: "Suco", latitud: -33.4500, longitud: -64.8333 },
    { regional: "Regional 15", codigo: "CC 54", nombre: "Holmberg", localidad: "Santa Catalina - Holmberg", latitud: -33.1833, longitud: -64.4333 },
    { regional: "Regional 15", codigo: "CC 71", nombre: "Chaján", localidad: "Chaján", latitud: -33.5500, longitud: -64.9833 },
    { regional: "Regional 15", codigo: "CC 146", nombre: "Sampacho", localidad: "Sampacho", latitud: -33.3833, longitud: -64.7167 },
    { regional: "Regional 15", codigo: "CC 158", nombre: "Achiras", localidad: "Achiras", latitud: -33.1722, longitud: -64.9933 },
    { regional: "Regional 15", codigo: "CC 160", nombre: "Coronel Baigorria", localidad: "Coronel Baigorria", latitud: -32.8500, longitud: -64.3667 },
    { regional: "Regional 15", codigo: "CC 217", nombre: "Coronel Bulnes", localidad: "Coronel Bulnes", latitud: -33.6833, longitud: -64.5167 },
    { regional: "Regional 15", codigo: "CC 231", nombre: "San Basilio", localidad: "San Basilio", latitud: -33.5000, longitud: -64.3167 },
    { regional: "Regional 15", codigo: "CC 280", nombre: "Cremería La Moderna", localidad: "Río Cuarto", latitud: -33.1000, longitud: -64.4000 },
    { regional: "Regional 15", codigo: "CC 315", nombre: "Espinillo", localidad: "Río Cuarto", latitud: -33.0500, longitud: -64.3000 },
    { regional: "Regional 15", codigo: "CC 332", nombre: "Chucul", localidad: "Chucul", latitud: -33.0167, longitud: -64.1833 },
    { regional: "Regional 15", codigo: "CC 337", nombre: "Las Vertientes", localidad: "Las Vertientes", latitud: -33.2667, longitud: -64.5833 },
    { regional: "Regional 15", codigo: "CC 359", nombre: "Las Cortaderas", localidad: "Las Cortaderas", latitud: -33.3167, longitud: -64.8500 },
    { regional: "Regional 15", codigo: "CC 383", nombre: "Colonias Unidas de Moldes", localidad: "Coronel Moldes", latitud: -33.6212, longitud: -64.5981 },
    { regional: "Regional 15", codigo: "CC 397", nombre: "Villa El Chacay", localidad: "Las Albahacas", latitud: -32.8833, longitud: -64.8167 },
    { regional: "Regional 15", codigo: "CC 418", nombre: "La Carolina El Potosí", localidad: "Río Cuarto", latitud: -32.9500, longitud: -64.6500 },
    { regional: "Regional 15", codigo: "CC 422", nombre: "Cuatro Vientos", localidad: "Río Cuarto", latitud: -33.2000, longitud: -64.2500 },

    // Regional 16
    { regional: "Regional 16", codigo: "CC 70", nombre: "Washington", localidad: "Washington", latitud: -33.8667, longitud: -64.6833 },
    { regional: "Regional 16", codigo: "CC 126", nombre: "General Levalle", localidad: "General Levalle", latitud: -34.0168, longitud: -63.8978 },
    { regional: "Regional 16", codigo: "CC 129", nombre: "La Cautiva", localidad: "La Cautiva", latitud: -33.8500, longitud: -64.2167 },
    { regional: "Regional 16", codigo: "CC 131", nombre: "Colonia La Providencia", localidad: "Vicuña Mackenna", latitud: -33.9500, longitud: -64.2500 },
    { regional: "Regional 16", codigo: "CC 143", nombre: "Pacheco de Melo", localidad: "Pacheco de Melo", latitud: -33.9333, longitud: -63.7833 },
    { regional: "Regional 16", codigo: "CC 155", nombre: "Curapaligüe", localidad: "General Levalle", latitud: -34.1000, longitud: -63.8000 },
    { regional: "Regional 16", codigo: "CC 164", nombre: "Adelia María", localidad: "Adelia María", latitud: -33.6312, longitud: -64.0210 },
    { regional: "Regional 16", codigo: "CC 173", nombre: "Río Bamba", localidad: "Río Bamba", latitud: -34.0833, longitud: -63.6667 },
    { regional: "Regional 16", codigo: "CC 179", nombre: "Guardia Vieja", localidad: "Guardia Vieja", latitud: -34.2167, longitud: -63.5167 },
    { regional: "Regional 16", codigo: "CC 191", nombre: "Vicuña Mackenna", localidad: "Vicuña Mackenna", latitud: -33.9189, longitud: -64.3881 },
    { regional: "Regional 16", codigo: "CC 199", nombre: "Tres Colonias", localidad: "Adelia María", latitud: -33.7000, longitud: -63.9000 },
    { regional: "Regional 16", codigo: "CC 218", nombre: "Rosales", localidad: "Rosales", latitud: -34.0500, longitud: -63.4833 },
    { regional: "Regional 16", codigo: "CC 248", nombre: "Huanchilla", localidad: "Huanchilla", latitud: -33.6833, longitud: -63.5833 },
    { regional: "Regional 16", codigo: "CC 250", nombre: "Tosquitas", localidad: "Tosquitas", latitud: -33.8333, longitud: -64.4667 },
    { regional: "Regional 16", codigo: "CC 273", nombre: "Villa Rossi", localidad: "Villa Rossi", latitud: -34.2833, longitud: -63.2833 },
    { regional: "Regional 16", codigo: "CC 386", nombre: "General Soler", localidad: "Vicuña Mackenna", latitud: -33.8000, longitud: -64.5000 },
    { regional: "Regional 16", codigo: "CC 395", nombre: "Colonia La Carmencita", localidad: "General Levalle", latitud: -33.9000, longitud: -63.7000 },
    { regional: "Regional 16", codigo: "CC 416", nombre: "Villa Sarmiento", localidad: "Villa Sarmiento", latitud: -34.3833, longitud: -64.2167 },

    // Regional 17
    { regional: "Regional 17", codigo: "CC 85", nombre: "Huinca Renancó", localidad: "Huinca Renancó", latitud: -34.8389, longitud: -64.3721 },
    { regional: "Regional 17", codigo: "CC 114", nombre: "Villa Valeria", localidad: "Villa Valeria", latitud: -34.3333, longitud: -64.9167 },
    { regional: "Regional 17", codigo: "CC 118", nombre: "Buchardo", localidad: "Buchardo", latitud: -34.7167, longitud: -63.5167 },
    { regional: "Regional 17", codigo: "CC 121", nombre: "Villa Huidobro", localidad: "Villa Huidobro", latitud: -34.8333, longitud: -64.5833 },
    { regional: "Regional 17", codigo: "CC 138", nombre: "Jovita", localidad: "Jovita", latitud: -34.5070, longitud: -63.9388 },
    { regional: "Regional 17", codigo: "CC 145", nombre: "Italó", localidad: "Italó", latitud: -34.7333, longitud: -63.8667 },
    { regional: "Regional 17", codigo: "CC 147", nombre: "Onagoity", localidad: "Onagoity", latitud: -34.6167, longitud: -63.6667 },
    { regional: "Regional 17", codigo: "CC 176", nombre: "Serrano", localidad: "Serrano", latitud: -34.4689, longitud: -63.5381 },
    { regional: "Regional 17", codigo: "CC 259", nombre: "Del Campillo", localidad: "Del Campillo", latitud: -34.3781, longitud: -64.4921 },
    { regional: "Regional 17", codigo: "CC 271", nombre: "Melo", localidad: "Melo", latitud: -34.3500, longitud: -63.5333 },
    { regional: "Regional 17", codigo: "CC 353", nombre: "Colonia El Árbol", localidad: "Jovita", latitud: -34.6000, longitud: -64.1000 },
    { regional: "Regional 17", codigo: "CC 374", nombre: "Mattaldi", localidad: "Mattaldi", latitud: -34.4667, longitud: -64.1833 },
    { regional: "Regional 17", codigo: "CC 404", nombre: "Pincén-Ranqueles", localidad: "Pincén", latitud: -34.7000, longitud: -64.2833 },

    // Regional 18
    { regional: "Regional 18", codigo: "CC 8", nombre: "Guatimozín", localidad: "Guatimozín", latitud: -33.4667, longitud: -62.0500 },
    { regional: "Regional 18", codigo: "CC 29", nombre: "Colonia Italiana", localidad: "Colonia Italiana", latitud: -33.3167, longitud: -62.3167 },
    { regional: "Regional 18", codigo: "CC 34", nombre: "Canals", localidad: "Canals", latitud: -33.5689, longitud: -62.8812 },
    { regional: "Regional 18", codigo: "CC 59", nombre: "Alejo Ledesma", localidad: "Alejo Ledesma", latitud: -33.6083, longitud: -62.6222 },
    { regional: "Regional 18", codigo: "CC 67", nombre: "Laborde", localidad: "Laborde", latitud: -33.1500, longitud: -62.8500 },
    { regional: "Regional 18", codigo: "CC 68", nombre: "Arias", localidad: "Arias", latitud: -33.6421, longitud: -62.4089 },
    { regional: "Regional 18", codigo: "CC 93", nombre: "Pueblo Italiano", localidad: "Pueblo Italiano", latitud: -33.5333, longitud: -62.8333 },
    { regional: "Regional 18", codigo: "CC 117", nombre: "Pascanas", localidad: "Pascanas", latitud: -33.1333, longitud: -63.0500 },
    { regional: "Regional 18", codigo: "CC 123", nombre: "Monte Maíz", localidad: "Monte Maíz", latitud: -33.2000, longitud: -62.6000 },
    { regional: "Regional 18", codigo: "CC 136", nombre: "Wenceslao Escalante", localidad: "Wenceslao Escalante", latitud: -33.1667, longitud: -62.7667 },
    { regional: "Regional 18", codigo: "CC 141", nombre: "Isla Verde", localidad: "Isla Verde", latitud: -33.2389, longitud: -62.4000 },
    { regional: "Regional 18", codigo: "CC 154", nombre: "Viamonte", localidad: "Viamonte", latitud: -33.7500, longitud: -63.1000 },
    { regional: "Regional 18", codigo: "CC 190", nombre: "Benjamín Gould", localidad: "Benjamín Gould", latitud: -33.1333, longitud: -62.9667 },
    { regional: "Regional 18", codigo: "CC 233", nombre: "La Cesira", localidad: "La Cesira", latitud: -33.9500, longitud: -62.9667 },
    { regional: "Regional 18", codigo: "CC 240", nombre: "Corral de Bustos", localidad: "Corral de Bustos", latitud: -33.2806, longitud: -62.1856 },
    { regional: "Regional 18", codigo: "CC 245", nombre: "Colonia Bismark", localidad: "Colonia Bismarck", latitud: -33.3167, longitud: -62.5333 },
    { regional: "Regional 18", codigo: "CC 318", nombre: "Cavanagh", localidad: "Cavanagh", latitud: -33.4667, longitud: -62.3333 },
    { regional: "Regional 18", codigo: "CC 326", nombre: "Colonia Bremen", localidad: "Canals", latitud: -33.4500, longitud: -62.7000 },
    { regional: "Regional 18", codigo: "CC 340", nombre: "Dos Colonias", localidad: "Arias", latitud: -33.5500, longitud: -62.3000 },

    // Regional 19
    { regional: "Regional 19", codigo: "CC 5", nombre: "General Roca", localidad: "General Roca", latitud: -32.7333, longitud: -61.9167 },
    { regional: "Regional 19", codigo: "CC 6", nombre: "Los Surgentes", localidad: "Los Surgentes", latitud: -32.9812, longitud: -62.0210 },
    { regional: "Regional 19", codigo: "CC 9", nombre: "Camilo Aldao", localidad: "Camilo Aldao", latitud: -33.1259, longitud: -62.0935 },
    { regional: "Regional 19", codigo: "CC 11", nombre: "General Baldissera", localidad: "General Baldissera", latitud: -33.1167, longitud: -62.3000 },
    { regional: "Regional 19", codigo: "CC 27", nombre: "Leones", localidad: "Leones", latitud: -32.6589, longitud: -62.3121 },
    { regional: "Regional 19", codigo: "CC 47", nombre: "Inriville", localidad: "Inriville", latitud: -32.9451, longitud: -62.2289 },
    { regional: "Regional 19", codigo: "CC 56", nombre: "Cruz Alta", localidad: "Cruz Alta", latitud: -33.0083, longitud: -61.8083 },
    { regional: "Regional 19", codigo: "CC 77", nombre: "Saira", localidad: "Saira", latitud: -32.4000, longitud: -62.1167 },
    { regional: "Regional 19", codigo: "CC 110", nombre: "Marcos Juárez", localidad: "Marcos Juárez", latitud: -32.6989, longitud: -62.0951 },
    { regional: "Regional 19", codigo: "CC 120", nombre: "Monte Buey", localidad: "Monte Buey", latitud: -32.9189, longitud: -62.4581 },
    { regional: "Regional 19", codigo: "CC 132", nombre: "Noetinger", localidad: "Noetinger", latitud: -32.3667, longitud: -62.3167 },
    { regional: "Regional 19", codigo: "CC 269", nombre: "San Marcos Sud", localidad: "San Marcos Sud", latitud: -32.6312, longitud: -62.4981 }
  ];

  for (const item of consorcios) {
    await prisma.consorcioCaminero.create({
      data: item,
    });
  }

  console.log(`✅ ${consorcios.length} consorcios camineros sembrados exitosamente.`);
}

main()
  .catch((e) => {
    console.error('❌ Error al ejecutar el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });