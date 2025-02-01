'use client';

import React, { useState, ChangeEvent, MouseEvent } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload } from "lucide-react";

interface FileData {
  name: string;
  type: string;
  data: string;
}

interface APIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export default function FileUploader() {
  const [file, setFile] = useState<FileData | null>(null);
  const [response, setResponse] = useState<{ content: string } | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files ? event.target.files[0] : null;
    const allowedTypes = ["application/pdf", "image/jpeg", "image/jpg", "image/png"];

    if (uploadedFile && allowedTypes.includes(uploadedFile.type)) {
      const reader = new FileReader();
      reader.readAsDataURL(uploadedFile);
      reader.onload = () => {
        const base64Data = reader.result as string;
        setFile({ 
          name: uploadedFile.name, 
          type: uploadedFile.type, 
          data: base64Data.split(",")[1] 
        });
      };
    } else {
      alert("Please upload a valid PDF or image file (JPG, JPEG, PNG).");
    }
  };

  const handleUpload = async (event: MouseEvent<HTMLButtonElement>) => {
    if (!file) {
      alert("Please upload a file first.");
      return;
    }

    setUploading(true);

    try {
      console.log(file.data);
      const requestBody = {
        model: "google/gemini-2.0-flash-thinking-exp:free",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Analyse the provided medical document and return a structured JSON."
              },
              {
                type: "image",
                image: {
                  data: file.data,
                  mime_type: file.type
                }
              }
            ],
          },
        ],
      };

      const response = await axios.post<APIResponse>(
        "https://openrouter.ai/api/v1/chat/completions",
        requestBody,
        {
          headers: {
            Authorization: `Bearer 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`,
            "Content-Type": "application/json",
          },
        }
      );

      setResponse(response.data.choices[0].message);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to upload file.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center p-6 space-y-4">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center space-y-4 p-4">
          <input
            type="file"
            accept=".pdf, .jpg, .jpeg, .png"
            onChange={handleFileChange}
            className="p-2 border rounded w-full"
            disabled={uploading}
          />
          {file && (
            <div className="text-sm text-green-600">
              File ready: {file.name}
            </div>
          )}
          <Button 
            onClick={handleUpload} 
            disabled={uploading || !file} 
            className="flex items-center gap-2"
          >
            <Upload size={16} /> 
            {uploading ? "Uploading..." : "Upload File"}
          </Button>
        </CardContent>
      </Card>

      {response && (
        <Card className="w-full max-w-md">
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold mb-2">API Response:</h3>
            <pre className="text-sm bg-gray-100 p-2 rounded overflow-auto">
              {response.content}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}