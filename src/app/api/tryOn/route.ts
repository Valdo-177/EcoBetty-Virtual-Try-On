// pages/api/message.ts

import { NextResponse } from 'next/server';
import axios from 'axios';

const FASHN_API_KEY = 'fa-5PsqGWlRt02g-kIi9u3MRFx6UP0VjEuGugGlL';

export async function POST(request: Request) {
  // Obtener el cuerpo de la solicitud en formato JSON
  const { model_image, garment_image, category } = await request.json();

  // Validar los campos requeridos
  if (!model_image || !garment_image || !category) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  console.log('categoria: ', category);

  // Hacer la solicitud a la API externa (Fashn)
  try {
    const response = await axios.post(
      'https://api.fashn.ai/v1/run',
      {
        model_image,
        garment_image,
        category,
      },
      {
        headers: {
          Authorization: `Bearer ${FASHN_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // Responder con los datos de la API externa
    return NextResponse.json({
      msg: 'Request successful',
      data: response.data,  // Aquí retornamos la respuesta de la API externa
    });
  } catch (error) {
    console.error('Error calling Fashn API:', error);

    // Manejar errores de la API externa
    return NextResponse.json({ error: 'Error calling Fashn API' }, { status: 500 });
  }
}

export async function GET(request: Request) {
    // Obtener el ID de la predicción desde la URL
    const url = new URL(request.url);
    const predictionId = url.pathname.split('/').pop(); // Extrae el ID de la URL
    
    // Validar que el predictionId esté presente
    if (!predictionId) {
        return NextResponse.json({ error: 'Prediction ID is required' }, { status: 400 });
    }
      return NextResponse.json({ error: 'Error calling Fashn API', id: predictionId }, { status: 200 });
  
    // Hacer la solicitud a la API externa (Fashn)
    // try {
    //   const response = await axios.get(`https://api.fashn.ai/v1/status/${predictionId}`, {
    //     headers: {
    //       Authorization: `Bearer ${FASHN_API_KEY}`,
    //       'Content-Type': 'application/json',
    //     },
    //   });
  
    //   // Responder con los datos de la API externa
    //   return NextResponse.json({
    //     msg: 'Request successful',
    //     data: response.data, // Aquí retornamos la respuesta de la API externa
    //   });
    // } catch (error) {
    //   console.error('Error calling Fashn API:', error);
  
    //   // Manejar errores de la API externa
    //   return NextResponse.json({ error: 'Error calling Fashn API' }, { status: 500 });
    // }
  }
  