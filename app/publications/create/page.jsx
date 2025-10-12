"use client";

import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { PublicationAPI } from '@/app/services/api';
import { useRouter } from 'next/navigation';

// Component for authors to submit a new publication
const SubmitPublication = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    abstract: '',
    content: '',
    file: null,
    video_file: null,
    categories: [],
    keywords: '',
  });

  // Handle text input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle file input changes
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files[0]) {
      const fileName = files[0].name;
      console.log(`Selected file for ${name}: ${fileName} (type: ${files[0].type}, size: ${files[0].size} bytes)`);
      
      if (name === 'video_file') {
        // Validate video file type
        const validVideoExtensions = ['.mp4', '.avi', '.mov'];
        const isValidExtension = validVideoExtensions.some(ext => fileName.toLowerCase().endsWith(ext));
        if (!isValidExtension) {
          toast.error(`Video file must be an MP4, AVI, or MOV file. Got: ${fileName}`, { position: 'top-right' });
          e.target.value = ''; // Clear the input
          setFormData({ ...formData, [name]: null });
          return;
        }
        setFormData({ ...formData, [name]: files[0] });
      } else if (name === 'file') {
        // Validate document file type
        const validDocExtensions = ['.pdf', '.doc', '.docx'];
        const isValidExtension = validDocExtensions.some(ext => fileName.toLowerCase().endsWith(ext));
        if (!isValidExtension) {
          toast.error(`File must be a PDF or Word document. Got: ${fileName}`, { position: 'top-right' });
          e.target.value = ''; // Clear the input
          setFormData({ ...formData, [name]: null });
          return;
        }
        setFormData({ ...formData, [name]: files[0] });
      } else {
        setFormData({ ...formData, [name]: files[0] });
      }
    } else {
      console.log(`No file selected for ${name}`);
      setFormData({ ...formData, [name]: null });
    }
  };

  // Handle category selection (multi-select)
  const handleCategoryChange = (e) => {
    const selected = Array.from(e.target.selectedOptions, (option) => option.value);
    setFormData({ ...formData, categories: selected });
  };

  // Handle form submission with client-side validation
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation
    if (!formData.title.trim()) {
      toast.error('Title is required.', { position: 'top-right' });
      return;
    }
    if (!formData.abstract.trim()) {
      toast.error('Abstract is required.', { position: 'top-right' });
      return;
    }
    if (formData.categories.length === 0) {
      toast.error('At least one category must be selected.', { position: 'top-right' });
      return;
    }
    if (formData.file && !['.pdf', '.doc', '.docx'].some(ext => formData.file.name.toLowerCase().endsWith(ext))) {
      toast.error(`File must be a PDF or Word document. Got: ${formData.file.name}`, { position: 'top-right' });
      return;
    }
    if (formData.video_file && !['.mp4', '.avi', '.mov'].some(ext => formData.video_file.name.toLowerCase().endsWith(ext))) {
      toast.error(`Video file must be an MP4, AVI, or MOV file. Got: ${formData.video_file.name}`, { position: 'top-right' });
      return;
    }
    if (formData.video_file && formData.video_file.size > 50 * 1024 * 1024) {
      toast.error('Video file size cannot exceed 50MB.', { position: 'top-right' });
      return;
    }
    if (formData.keywords && formData.keywords.length > 500) {
      toast.error('Keywords cannot exceed 500 characters.', { position: 'top-right' });
      return;
    }
    if (formData.keywords) {
      const keywordCount = formData.keywords.split(',').filter(k => k.trim()).length;
      if (keywordCount > 20) {
        toast.error('Cannot have more than 20 keywords.', { position: 'top-right' });
        return;
      }
    }

    const data = new FormData();
    data.append('title', formData.title);
    data.append('abstract', formData.abstract);
    data.append('content', formData.content || '');
    if (formData.file) data.append('file', formData.file);
    if (formData.video_file) data.append('video_file', formData.video_file);
    formData.categories.forEach((cat) => data.append('categories', cat));
    data.append('keywords', formData.keywords || '');

    // Log FormData for debugging
    for (let [key, value] of data.entries()) {
      console.log(`FormData ${key}: ${value instanceof File ? value.name : value}`);
    }

    try {
      const response = await PublicationAPI.create(data);
      console.log('API Response:', response.data);
      toast.success('Paper submitted successfully!', {
        position: 'top-right',
      });
      // Reset form
      setFormData({
        title: '',
        abstract: '',
        content: '',
        file: null,
        video_file: null,
        categories: [],
        keywords: '',
      });
      router.push("/");
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 
        Object.entries(err.response?.data || {})
          .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
          .join('; ') || 
        'Error submitting paper';
      toast.error(errorMessage, { position: 'top-right' });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Submit a Publication</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700">Abstract</label>
          <textarea
            name="abstract"
            value={formData.abstract}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            rows="4"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700">Content</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            rows="6"
          />
        </div>
        <div>
          <label className="block text-gray-700">File (PDF or Word)</label>
          <input
            type="file"
            name="file"
            onChange={handleFileChange}
            className="w-full border p-2 rounded"
            accept=".pdf,.doc,.docx"
          />
        </div>
        <div>
          <label className="block text-gray-700">Video File (MP4, AVI, MOV)</label>
          <input
            type="file"
            name="video_file"
            onChange={handleFileChange}
            className="w-full border p-2 rounded"
            accept=".mp4,.avi,.mov"
          />
        </div>
        <div>
          <label className="block text-gray-700">Categories</label>
          <select
            name="categories"
            multiple
            value={formData.categories}
            onChange={handleCategoryChange}
            className="w-full border p-2 rounded"
          >
            <option value="" disabled>Select categories</option>
            <option value="journal">Journal Article</option>
            <option value="conference">Conference Paper</option>
            <option value="book">Book/Book Chapter</option>
            <option value="thesis">Thesis/Dissertation</option>
            <option value="report">Technical Report</option>
            <option value="review">Review Paper</option>
            <option value="case_study">Case Study</option>
            <option value="editorial">Editorial/Opinion</option>
            <option value="news">News/Blog</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-700">Keywords (comma-separated)</label>
          <input
            type="text"
            name="keywords"
            value={formData.keywords}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            placeholder="e.g., machine learning, AI, data science"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Submit
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default SubmitPublication;