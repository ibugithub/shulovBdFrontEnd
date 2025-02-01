'use client'
import React, { useState, useRef } from 'react';
import axios from 'axios';

const ClientForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    address: '',
    image: null as File | null,
  });
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access camera. Please ensure you have granted permission.');
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      // Set canvas dimensions to match video stream
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Draw the current video frame onto the canvas
      context?.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert canvas image to a Blob (File)
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], 'captured-image.png', { type: 'image/png' });
          setFormData({ ...formData, image: file });
          setCameraActive(false); // Stop the camera after capturing
        }
      }, 'image/png');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = new FormData();
    data.append('name', formData.name);
    data.append('contact', formData.contact);
    data.append('address', formData.address);
    if (formData.image) {
      data.append('image', formData.image);
    }

    try {
      const response = await axios.post('/api/clients/', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Client created:', response.data);
      // Handle success (e.g., show a success message, redirect, etc.)
    } catch (error) {
      console.error('Error creating client:', error);
      // Handle error (e.g., show an error message)
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Client Name</label>
        <input
          type="text"
          name="name"
          id="name"
          value={formData.name}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>

      <div>
        <label htmlFor="contact" className="block text-sm font-medium text-gray-700">Client Contact</label>
        <input
          type="text"
          name="contact"
          id="contact"
          value={formData.contact}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>

      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700">Client Address</label>
        <input
          type="text"
          name="address"
          id="address"
          value={formData.address}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>

      <div>
        <label htmlFor="image" className="block text-sm font-medium text-gray-700">Client Image</label>
        {cameraActive ? (
          <div className="space-y-2">
            <video ref={videoRef} autoPlay className="w-full rounded-md border border-gray-300" />
            <button
              type="button"
              onClick={captureImage}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Capture Image
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={startCamera}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Open Camera
          </button>
        )}
        <canvas ref={canvasRef} className="hidden" />
      </div>

      <div>
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default ClientForm;