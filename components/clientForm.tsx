'use client'

import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import Webcam from 'react-webcam';

interface ClientFormData {
  name: string;
  contact: string;
  address: string;
  image: File | null;
}

export default function ClientForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<ClientFormData>();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showWebcam, setShowWebcam] = useState(false);
  const webcamRef = useRef<Webcam>(null);

  const onSubmit = (data: ClientFormData) => {
    // Handle form submission
    console.log(data);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setShowWebcam(false);
    }
  };

  const captureImage = () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setImagePreview(imageSrc);
      // Convert data URL to File object
      fetch(imageSrc)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], 'captured-image.jpg', { type: 'image/jpeg' });
          // You can store this file in your form state if needed
        });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl p-8 md:p-12">
        <div className="mb-10">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center">Client Registration</h2>
          <p className="mt-2 text-sm text-gray-500 text-center">Please fill in the details below</p>
        </div>
  
        <div className="md:grid md:grid-cols-12 md:gap-10">
          {/* Image Section */}
          <div className="md:col-span-5 mb-8 md:mb-0">
            <div className="space-y-6">
              <div className="group relative aspect-square w-full bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300 hover:border-indigo-500 transition-colors">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full rounded-2xl object-cover shadow-md"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400 group-hover:text-indigo-500 transition-colors"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                    >#
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="mt-2 text-sm text-gray-500">
                      <label className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500">
                        <span>Upload a file</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="sr-only"
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">PNG, JPG up to 5MB</p>
                  </div>
                )}
              </div>
  
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => setShowWebcam(!showWebcam)}
                  className="w-full flex items-center justify-center px-4 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200"
                >
                  <svg
                    className="w-5 h-5 mr-2 -ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  {showWebcam ? 'Close Camera' : 'Take photo'}
                </button>
  
                {showWebcam && (
                  <div className="space-y-4">
                    <Webcam
                      audio={false}
                      ref={webcamRef}
                      screenshotFormat="image/jpeg"
                      className="rounded-xl w-full aspect-video"
                    />
                    <button
                      type="button"
                      onClick={captureImage}
                      className="w-full flex items-center justify-center px-4 py-2.5 border border-transparent rounded-xl text-sm font-medium text-white bg-green-600 hover:bg-green-700 transition-all duration-200"
                    >
                      Capture Photo
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
  
          {/* Form Fields */}
          <div className="md:col-span-7">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                <div className="relative">
                  <input
                    {...register('name', { required: 'Name is required' })}
                    type="text"
                    className="w-full px-4 py-3 text-sm rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400 transition-all"
                    placeholder="John Doe"
                  />
                  {errors.name && (
                    <div className="absolute right-3 top-3.5 text-red-500">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </div>
                {errors.name && (
                  <p className="mt-1.5 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>
  
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Contact Number</label>
                  <div className="relative">
                    <input
                      {...register('contact', { required: 'Contact is required' })}
                      type="tel"
                      className="w-full px-4 py-3 text-sm rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400 transition-all"
                      placeholder="+1 (555) 000-0000"
                    />
                    {errors.contact && (
                      <div className="absolute right-3 top-3.5 text-red-500">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                  {errors.contact && (
                    <p className="mt-1.5 text-sm text-red-600">{errors.contact.message}</p>
                  )}
                </div>
  
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Address</label>
                  <div className="relative">
                    <textarea
                      {...register('address', { required: 'Address is required' })}
                      rows={3}
                      className="w-full px-4 py-3 text-sm rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400 transition-all"
                      placeholder="Enter full address"
                    />
                    {errors.address && (
                      <div className="absolute right-3 top-3.5 text-red-500">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                  {errors.address && (
                    <p className="mt-1.5 text-sm text-red-600">{errors.address.message}</p>
                  )}
                </div>
              </div>
  
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center px-6 py-3.5 border border-transparent rounded-xl text-base font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-indigo-100"
                >
                  Register Client
                  <svg
                    className="w-5 h-5 ml-2 -mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}