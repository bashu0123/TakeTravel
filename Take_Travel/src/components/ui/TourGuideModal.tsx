import React, { useState } from 'react';
import { X, Plus, X as XIcon, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import axios from 'axios';

interface TourGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  name: string;
  email: string;
  phoneNumber: string;
  experience: string;
  role: string;
  languages: string[];
  specialization: string;
  password: string;
  passwordConfirm: string;
}

interface ValidationErrors {
  [key: string]: string;
}
const CustomAlert: React.FC<{ message: string }> = ({ message }) => (
  <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 rounded">
    <div className="flex items-center">
      <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
      <p className="text-red-700">{message}</p>
    </div>
  </div>
);

const TourGuideModal: React.FC<TourGuideModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phoneNumber: '',
    experience: '',
    role: 'guide',
    languages: [],
    specialization: '',
    password: '',
    passwordConfirm: ''
  });

  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [loading, setLoading] = useState(false);

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};
    if (!formData.name.trim()) errors.name = 'Full Name is required';
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) errors.email = 'Invalid email format';
    if (!formData.phoneNumber.match(/^\d{10}$/)) errors.phoneNumber = 'Phone number must be 10 digits';
    if (!formData.experience || isNaN(Number(formData.experience)) || Number(formData.experience) < 0) errors.experience = 'Experience must be a positive number';
    if (!formData.languages.length) errors.languages = 'At least one language is required';
    if (!formData.specialization) errors.specialization = 'Specialization is required';
    if (formData.password.length < 8) errors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.passwordConfirm) errors.passwordConfirm = 'Passwords do not match';
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValidationErrors({});
  
    if (!validateForm()) return;
    setLoading(true);
  
    try {
      const response = await axios.post('http://localhost:8000/users/signup/guide', formData);
      console.log("Registration Successful:", response.data);
  
      // Close the modal and redirect (modify based on your routing)
      onClose();
      window.location.href = "/auth"; // Change the route as needed
  
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 400) {
          const errorData = error.response.data;
          if (errorData.errors) {
            setValidationErrors(errorData.errors); // Map errors correctly
          } else if (typeof errorData.message === 'string') {
            setValidationErrors({ general: errorData.message });
          }
        }
      } else {
        setValidationErrors({ general: 'An unexpected error occurred. Please try again.' });
      }
    }finally {
      setLoading(false); // Stop loading
    }
  };
  
  const availableLanguages: string[] = [
    'English', 'Spanish', 'French', 'German', 'Italian', 'Chinese', 'Japanese',
    'Arabic', 'Russian', 'Portuguese', 'Hindi', 'Korean', 'Thai', 'Vietnamese', 'Turkish'
  ].sort();


  const getFieldError = (fieldName: string) => {
    return validationErrors[fieldName];
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear the error for this field when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  const addLanguage = (): void => {
    if (selectedLanguage && !formData.languages.includes(selectedLanguage)) {
      setFormData(prev => ({
        ...prev,
        languages: [...prev.languages, selectedLanguage]
      }));
      setSelectedLanguage('');
    }
  };

  const removeLanguage = (languageToRemove: string): void => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.filter(lang => lang !== languageToRemove)
    }));
  };

  const handleSuccessClose = () => {
    setIsSuccessModalOpen(false);
  };

  if (!isOpen) return null;

  return (
    <>
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
          type="button"
          aria-label="Close modal"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold mb-6 text-orange-600">Tour Guide Registration</h2>

        {validationErrors.general && (
        
            <CustomAlert message={validationErrors.general} />
         
  
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  getFieldError('name') ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your full name"
              />
              {getFieldError('name') && (
                <p className="mt-1 text-sm text-red-600">{getFieldError('name')}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  getFieldError('email') ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your email"
              />
              {getFieldError('email') && (
                <p className="mt-1 text-sm text-red-600">{getFieldError('email')}</p>
              )}
            </div>

            {/* Phone Number Field */}
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                id="phoneNumber"
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  getFieldError('phoneNumber') ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your phone number"
              />
              {getFieldError('phoneNumber') && (
                <p className="mt-1 text-sm text-red-600">{getFieldError('phoneNumber')}</p>
              )}
            </div>

            {/* Experience Field */}
            <div>
              <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
                Years of Experience
              </label>
              <input
                id="experience"
                type="number"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                required
                min="0"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  getFieldError('experience') ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Years of experience"
              />
              {getFieldError('experience') && (
                <p className="mt-1 text-sm text-red-600">{getFieldError('experience')}</p>
              )}
            </div>
          </div>

          {/* Languages Field */}
          <div>
            <label htmlFor="languageSelect" className="block text-sm font-medium text-gray-700 mb-1">
              Languages
            </label>
            <div className="flex gap-2 mb-2">
              <select
                id="languageSelect"
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className={`flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  getFieldError('languages') ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select a language</option>
                {availableLanguages
                  .filter(lang => !formData.languages.includes(lang))
                  .map(lang => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))
                }
              </select>
              <button
                type="button"
                onClick={addLanguage}
                className="px-3 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                aria-label="Add language"
              >
                <Plus size={20} />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.languages.map(lang => (
                <span
                  key={lang}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-800 rounded-full"
                >
                  {lang}
                  <button
                    type="button"
                    onClick={() => removeLanguage(lang)}
                    className="text-orange-600 hover:text-orange-800"
                    aria-label={`Remove ${lang}`}
                  >
                    <XIcon size={16} />
                  </button>
                </span>
              ))}
            </div>
            {getFieldError('languages') && (
              <p className="mt-1 text-sm text-red-600">{getFieldError('languages')}</p>
            )}
          </div>

          {/* Specialization Field */}
          <div>
            <label htmlFor="specialization" className="block text-sm font-medium text-gray-700 mb-1">
              Specialization
            </label>
            <select
              id="specialization"
              name="specialization"
              value={formData.specialization}
              onChange={handleChange}
              required
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                getFieldError('specialization') ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select specialization</option>
              <option value="cultural">Cultural Tours</option>
              <option value="adventure">Adventure Tours</option>
              <option value="historical">Historical Tours</option>
              <option value="nature">Nature Tours</option>
              <option value="food">Food Tours</option>
            </select>
            {getFieldError('specialization') && (
              <p className="mt-1 text-sm text-red-600">{getFieldError('specialization')}</p>
            )}
          </div>

          {/* Password Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  getFieldError('password') ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your password"
              />
              {getFieldError('password') && (
                <p className="mt-1 text-sm text-red-600">{getFieldError('password')}</p>
              )}
            </div>

            <div>
              <label htmlFor="passwordConfirm" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                id="passwordConfirm"
                type="password"
                name="passwordConfirm"
                value={formData.passwordConfirm}
                onChange={handleChange}
                required
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  getFieldError('passwordConfirm') ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Confirm your password"
              />
              {getFieldError('passwordConfirm') && (
                <p className="mt-1 text-sm text-red-600">{getFieldError('passwordConfirm')}</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors flex justify-center items-center"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader className="animate-spin mr-2" size={20} />
                Registering...
              </>
            ) : (
              "Register"
            )}
          </button>
        </form>
      </div>
    </div>

    {/* Success Modal */}
    {isSuccessModalOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg w-full max-w-md p-6 text-center shadow-lg">
          <CheckCircle className="mx-auto text-green-500" size={48} />
          <h2 className="text-xl font-bold mt-4 text-green-700">Registration Successful!</h2>
          <p className="text-gray-600 mt-2">You have successfully registered as a tour guide.</p>
          <button
            onClick={handleSuccessClose}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-500"
          >
            OK
          </button>
        </div>
      </div>
    )}
    </>
  );
};

export default TourGuideModal;