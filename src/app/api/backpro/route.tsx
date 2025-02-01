import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

async function blobToBase64(blob: Blob): Promise<string> {
  const arrayBuffer = await blob.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return buffer.toString("base64");
}

export async function POST(req: NextRequest) {
  try {
    // Extract the request body
    const body = await req.json();

    // Determine the target endpoint based on the body
    // const endpoint = body.endpoint === 'chat'
    //   ? '/api/chat'
    //   : body.endpoint === 'image'
    //   ? '/api/image'
    //   : null;

    // // If no valid endpoint is provided, return an error
    // if (!endpoint) {
    //   return NextResponse.json({ error: 'Invalid endpoint specified' }, { status: 400 });
    // }

    // Prepare the URL for the external API
    // const apiUrl = process.env.NEXT_PUBLIC_CHAT_URL; //+ `${endpoint}`; // Use backticks for string interpolation
    const apiUrl = process.env.NEXT_PUBLIC_IMAGE_URL //+ `${endpoint}`; // Use backticks for string interpolation

    // const apiHeaders = JSON.parse(process.env.NEXT_PUBLIC_API_HEADERS || '{}');

    // Forward the headers (you can customize which ones you need to forward)
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY}`,
      // ...apiHeaders,
    };

    if (!apiUrl) {
      return NextResponse.json({ error: 'API URL is not defined' }, { status: 500 });
    }

    const externalResponse = await fetch(apiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    if (!externalResponse.ok) {
      return NextResponse.json({ error: `Error from external API: ${externalResponse.statusText}` }, { status: externalResponse.status });
    }

    // Return the response from the external API
    //const responseData = await externalResponse.json();
    const blob = await externalResponse.blob();
    const base64Image = await blobToBase64(blob);

    // Construct the response with the required format
    const imageContent = `data:None;base64,${base64Image}`;
    return NextResponse.json(imageContent);

    // return NextResponse.json(responseData.output[0]);
    // return NextResponse.json(responseData);

  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
