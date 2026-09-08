import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Camera, FolderOpen, Search, RotateCcw, Trash2, Image as ImageIcon, CheckCircle, ShieldAlert, AlertTriangle } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

export const DiseaseUpload = ({ onAnalyze }) => {
  const { t } = useTranslation();
  const cameraInputRef = useRef(null);
  const fileInputRef = useRef(null);
  
  const [preview, setPreview] = useState(null);
  const [source, setSource] = useState(null); // 'camera' or 'upload'
  const [file, setFile] = useState(null);

  const handleFile = (selectedFile, sourceType) => {
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      // Basic validation for size (e.g. max 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        alert("Image is too large. Please select an image under 10MB.");
        return;
      }
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setSource(sourceType);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] },
    multiple: false,
    noClick: true,
    onDrop: acceptedFiles => {
      if (acceptedFiles.length > 0) handleFile(acceptedFiles[0], 'upload');
    }
  });

  const clearImage = () => {
    setPreview(null);
    setFile(null);
    setSource(null);
  };

  const handleAnalyze = () => {
    if (file) {
      onAnalyze(file, source);
    }
  };

  if (preview) {
    return (
      <div className="card p-6 border-2 border-primary-green bg-white shadow-lg animate-fade-in">
        <h3 className="text-xl font-bold text-dark-green mb-4 text-center">{t('disease.imagePreview')}</h3>
        <div className="relative w-full max-w-md mx-auto aspect-square rounded-2xl overflow-hidden shadow-inner mb-6 bg-gray-100 flex items-center justify-center">
          <img src={preview} alt="Crop Preview" className="w-full h-full object-cover" />
        </div>
        
        <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
          {source === 'camera' ? (
            <button 
              onClick={() => cameraInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition-colors"
            >
              <RotateCcw size={18} /> {t('disease.retake')}
            </button>
          ) : (
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition-colors"
            >
              <FolderOpen size={18} /> {t('disease.chooseAnother')}
            </button>
          )}
          
          <button 
            onClick={clearImage}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg font-semibold transition-colors"
          >
            <Trash2 size={18} /> {t('disease.remove')}
          </button>
        </div>

        <button 
          onClick={handleAnalyze}
          className="w-full bg-primary-green hover:bg-dark-green text-white py-4 rounded-xl font-extrabold text-lg flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg"
        >
          <Search size={22} /> {t('disease.analyzePhoto')}
        </button>

        {/* Hidden inputs to allow retaking/re-uploading from preview state */}
        <input ref={cameraInputRef} type="file" accept="image/jpeg, image/png, image/webp" capture="environment" className="hidden" onChange={e => handleFile(e.target.files?.[0], 'camera')} />
        <input ref={fileInputRef} type="file" accept="image/jpeg, image/png, image/webp" className="hidden" onChange={e => handleFile(e.target.files?.[0], 'upload')} />
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={`border-4 border-dashed rounded-3xl p-8 md:p-12 text-center transition-colors shadow-sm bg-white ${
        isDragActive ? 'border-primary-green bg-green-50' : 'border-gray-200 hover:border-primary-green hover:bg-gray-50'
      }`}
    >
      <input ref={cameraInputRef} type="file" accept="image/jpeg, image/png, image/webp" capture="environment" className="hidden" onChange={e => handleFile(e.target.files?.[0], 'camera')} />
      <input ref={fileInputRef} type="file" accept="image/jpeg, image/png, image/webp" className="hidden" onChange={e => handleFile(e.target.files?.[0], 'upload')} />
      <input {...getInputProps()} />

      <div className="bg-green-50 w-24 h-24 rounded-full mx-auto flex items-center justify-center mb-6 shadow-sm border border-green-100">
        <ImageIcon size={40} className="text-primary-green" />
      </div>
      <h3 className="text-2xl md:text-3xl font-extrabold text-dark-green mb-3">{t('disease.title')}</h3>
      <p className="text-gray-600 mb-8 max-w-md mx-auto text-lg">
        {t('disease.uploadPromptLong')}
      </p>

      <div className="flex flex-col gap-4 max-w-xs mx-auto">
        <button
          type="button"
          className="bg-primary-green text-white hover:bg-dark-green py-4 px-6 rounded-2xl font-bold flex items-center justify-center gap-3 transition-colors shadow-md text-lg"
          onClick={() => cameraInputRef.current?.click()}
        >
          <Camera size={24} /> {t('disease.takePhoto')}
        </button>

        <button
          type="button"
          className="bg-white text-dark-green border-2 border-dark-green hover:bg-green-50 py-4 px-6 rounded-2xl font-bold flex items-center justify-center gap-3 transition-colors shadow-sm text-lg"
          onClick={() => fileInputRef.current?.click()}
        >
          <FolderOpen size={24} /> {t('disease.uploadPhoto')}
        </button>
      </div>
      <p className="text-sm text-gray-400 mt-6 font-medium">{t('disease.supportedFormats')}</p>
    </div>
  );
};
