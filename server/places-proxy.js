/**
 * Backend proxy para Google Places API
 * 
 * INSTALACIÓN:
 * 1. npm install express cors dotenv axios
 * 
 * CONFIGURACIÓN:
 * 1. Crear archivo .env con:
 *    GOOGLE_PLACES_API_KEY=AIzaSyBnWo0NDberDpZxN84TjzZerTkTmgueEJY
 * 
 * 2. Ejecutar este servidor en paralelo al ng serve:
 *    node server/places-proxy.js
 * 
 * USO:
 * GET http://localhost:3000/api/places/details?placeId=ChIJq6rmpcSepBIRd1DTH-hGCFA
 */

const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const GOOGLE_PLACES_API_URL = 'https://maps.googleapis.com/maps/api/place/details/json';

/**
 * Endpoint para obtener detalles del lugar con reseñas
 */
app.get('/api/places/details', async (req, res) => {
  const { placeId } = req.query;

  if (!placeId) {
    return res.status(400).json({ error: 'placeId es requerido' });
  }

  if (!GOOGLE_API_KEY) {
    return res.status(500).json({ error: 'GOOGLE_PLACES_API_KEY no configurada' });
  }

  try {
    const response = await axios.get(GOOGLE_PLACES_API_URL, {
      params: {
        place_id: placeId,
        fields: 'reviews',
        key: GOOGLE_API_KEY,
      },
    });

    // Filtrar solo reseñas con rating >= 4
    const reviews = response.data.result?.reviews || [];
    const filteredReviews = reviews.filter((review) => review.rating >= 4);

    res.json({
      reviews: filteredReviews,
      total: filteredReviews.length,
    });
  } catch (error) {
    console.error('Error al obtener reseñas de Google Places:', error.message);
    res.status(500).json({
      error: 'Error al obtener reseñas',
      details: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`✓ Proxy de Google Places API ejecutándose en http://localhost:${PORT}`);
  console.log(`✓ Endpoint: GET http://localhost:${PORT}/api/places/details?placeId=ChIJq6rmpcSepBIRd1DTH-hGCFA`);
});
