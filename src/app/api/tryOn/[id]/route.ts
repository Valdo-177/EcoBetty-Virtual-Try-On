// pages/api/message.ts

import { NextResponse } from 'next/server';
import axios from 'axios';

const FASHN_API_KEY = 'fa-5PsqGWlRt02g-kIi9u3MRFx6UP0VjEuGugGlL';

export async function GET(request: Request) {
    // Obtener el ID de la predicción desde la URL
    const url = new URL(request.url);
    const predictionId = url.pathname.split('/').pop(); // Extrae el ID de la URL
    
    // Validar que el predictionId esté presente
    if (!predictionId) {
        return NextResponse.json({ error: 'Prediction ID is required' }, { status: 400 });
    }
    // Hacer la solicitud a la API externa (Fashn)
    try {
      const response = await axios.get(`https://api.fashn.ai/v1/status/${predictionId}`, {
        headers: {
          Authorization: `Bearer ${FASHN_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });
  
      // Responder con los datos de la API externa
      return NextResponse.json({
        msg: 'Request successful',
        data: response.data, // Aquí retornamos la respuesta de la API externa
      });
    } catch (error) {
      console.error('Error calling Fashn API:', error);
  
      // Manejar errores de la API externa
      return NextResponse.json({ error: 'Error calling Fashn API' }, { status: 500 });
    }
  }
  