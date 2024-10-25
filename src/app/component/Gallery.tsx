"use client";
import React, { useState } from "react";
import imagesData from "./images.json";

// Type for the image file with URL
interface ImageFile {
  id: number;
  url: string;
  selected: boolean;
}

export default function Gallery() {
  const [images, setImages] = useState<ImageFile[]>(imagesData);
  const [selectedCount, setSelectedCount] = useState(0);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Handle file upload and set images
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newImages = Array.from(event.target.files).map((file, index) => ({
        id: images.length + index + 1,
        url: URL.createObjectURL(file),
        selected: false,
      }));
      setImages((prev) => [...prev, ...newImages]);
    }
  };

  // Handle checkbox toggle
  const toggleSelection = (id: number) => {
    setImages((prevImages) => {
      const updatedImages = prevImages.map((img) =>
        img.id === id ? { ...img, selected: !img.selected } : img
      );
      // Calculate the new selected count
      const newSelectedCount = updatedImages.filter(
        (img) => img.selected
      ).length;
      setSelectedCount(newSelectedCount);
      return updatedImages;
    });
  };

  // Delete selected files
  const deleteSelectedFiles = () => {
    setImages(images.filter((img) => !img.selected));
    setSelectedCount(0);
  };

  // Drag and drop handlers
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // Prevent default behavior to allow dropping
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== index) {
      const updatedImages = [...images];
      const [movedImage] = updatedImages.splice(draggedIndex, 1); // Remove the dragged image
      updatedImages.splice(index, 0, movedImage); // Insert it at the new position
      setImages(updatedImages);
      setDraggedIndex(index); // Update the dragged index
    }
  };

  return (
    <div className='p-4 bg-white rounded-lg border shadow'>
      {/* Header with Total Files Selected and Delete Button */}
      <div className='flex items-center justify-between mb-4'>
        <div className='flex items-center space-x-2'>
          <input
            type='checkbox'
            className='w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500'
            checked={selectedCount > 0} // Check if any file is selected
            onChange={() =>
              setImages((prevImages) => {
                const selectAll = selectedCount === 0; // Select all if none are selected
                const updatedImages = prevImages.map((img) => ({
                  ...img,
                  selected: selectAll,
                }));
                // Update selected count based on selection
                const newSelectedCount = selectAll ? updatedImages.length : 0;
                setSelectedCount(newSelectedCount);
                return updatedImages;
              })
            }
          />
          <span className='font-semibold text-lg'>
            {selectedCount} Files Selected
          </span>
        </div>
        <button
          className='text-red-600 hover:underline cursor-pointer'
          onClick={deleteSelectedFiles}
          disabled={selectedCount === 0} // Disable button if no files are selected
        >
          Delete files
        </button>
      </div>

      {/* File Grid with Dynamic Images */}
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 max-h-[500px] overflow-y-auto'>
        {images?.map((img, index) => (
          <div
            key={img.id}
            draggable // Make the image container draggable
            onDragStart={() => handleDragStart(index)} // Handle drag start
            onDragOver={handleDragOver} // Handle drag over
            onDrop={(e) => handleDrop(e, index)} // Handle drop
            className={`relative group ${
              index === 0 ? "col-span-2 row-span-2" : ""
            }`}
          >
            {/* Image Container */}
            <div className='overflow-hidden rounded border'>
              <img
                src={img.url}
                alt={`File ${img.id}`}
                className='object-cover w-full h-full'
                style={{
                  height: index === 0 ? "250px" : "120px", // Keep sizes consistent
                  width: index === 0 ? "320px" : "155px",
                }}
              />
            </div>
            {/* Checkbox and Overlay (Visible on Hover) */}
            <div className='absolute inset-0  bg-gray-800 bg-opacity-50 opacity-0 group-hover:opacity-100 flex flex-row-reverse items-start justify-start transition-opacity duration-200'>
              <input
                type='checkbox'
                className='w-6 h-6 text-blue-600 cursor-pointer border-gray-300 rounded focus:ring-blue-500'
                checked={img.selected}
                onChange={() => toggleSelection(img.id)}
              />
            </div>
          </div>
        ))}

        {/* Add Images Button (Always Last) */}
        <div className='flex shrink-0 items-center w-[155px] h-[120px] justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:border-gray-400'>
          <input
            type='file'
            accept='image/*'
            multiple
            className='hidden'
            id='file-upload'
            onChange={handleFileUpload}
          />
          <label
            htmlFor='file-upload'
            className='flex items-center cursor-pointer'
          >
            <svg
              className='w-6 h-6 text-gray-400'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 4v16m8-8H4'
              />
            </svg>
            <span className='ml-2 text-[14px] text-gray-600'>Add Images</span>
          </label>
        </div>
      </div>
    </div>
  );
}
