import { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';

export default function CommissionForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    projectType: '',
    projectLocation: '',
    surfaceType: '',
    projectSize: '',
    description: '',
    budget: '',
    timeline: ''
  });

  const [status, setStatus] = useState('idle'); // idle, loading, success, error

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const { error } = await supabase
        .from('commission_inquiries')
        .insert([{
          full_name: formData.fullName,
          email: null,
          phone: formData.phone,
          project_type: formData.projectType,
          project_location: formData.projectLocation,
          surface_type: formData.surfaceType,
          project_size: formData.projectSize,
          description: formData.description,
          budget: formData.budget,
          timeline: formData.timeline,
          status: 'new'
        }]);

      if (error) throw error;

      setStatus('success');
      setFormData({
        fullName: '',
        phone: '',
        projectType: '',
        projectLocation: '',
        surfaceType: '',
        projectSize: '',
        description: '',
        budget: '',
        timeline: ''
      });

      // Reset success message after 5 seconds
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      setStatus('error');
      
      // Reset error message after 5 seconds
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Full Name */}
        <div>
          <label htmlFor="fullName" className="block text-warm-white text-sm font-medium mb-2">
            Full Name *
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-charcoal border border-white/20 text-warm-white placeholder-muted-gray focus:border-warm-white focus:outline-none transition-colors"
            placeholder="Your name"
          />
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-warm-white text-sm font-medium mb-2">
            Phone Number *
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-charcoal border border-white/20 text-warm-white placeholder-muted-gray focus:border-warm-white focus:outline-none transition-colors"
            placeholder="+251 91 234 5678"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6"
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Project Location */}
        <div>
          <label htmlFor="projectLocation" className="block text-warm-white text-sm font-medium mb-2">
            Project Location
          </label>
          <input
            type="text"
            id="projectLocation"
            name="projectLocation"
            value={formData.projectLocation}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-charcoal border border-white/20 text-warm-white placeholder-muted-gray focus:border-warm-white focus:outline-none transition-colors"
            placeholder="City or region"
          />
        </div>

        {/* Surface Type */}
        <div>
          <label htmlFor="surfaceType" className="block text-warm-white text-sm font-medium mb-2">
            Wall / Surface Type
          </label>
          <input
            type="text"
            id="surfaceType"
            name="surfaceType"
            value={formData.surfaceType}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-charcoal border border-white/20 text-warm-white placeholder-muted-gray focus:border-warm-white focus:outline-none transition-colors"
            placeholder="e.g., Interior wall, exterior brick"
          />
        </div>
      </div>

      {/* Project Size */}
      <div>
        <label htmlFor="projectSize" className="block text-warm-white text-sm font-medium mb-2">
          Approximate Project Size
        </label>
        <input
          type="text"
          id="projectSize"
          name="projectSize"
          value={formData.projectSize}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-charcoal border border-white/20 text-warm-white placeholder-muted-gray focus:border-warm-white focus:outline-none transition-colors"
          placeholder="e.g., 10m x 3m, or digital dimensions"
        />
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-warm-white text-sm font-medium mb-2">
          Project Description *
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows={6}
          className="w-full px-4 py-3 bg-charcoal border border-white/20 text-warm-white placeholder-muted-gray focus:border-warm-white focus:outline-none transition-colors resize-none"
          placeholder="Tell me about your vision for this project..."
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Budget */}
        <div>
          <label htmlFor="budget" className="block text-warm-white text-sm font-medium mb-2">
            Budget Range
          </label>
          <input
            type="text"
            id="budget"
            name="budget"
            value={formData.budget}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-charcoal border border-white/20 text-warm-white placeholder-muted-gray focus:border-warm-white focus:outline-none transition-colors"
            placeholder="Optional"
          />
        </div>

        {/* Timeline */}
        <div>
          <label htmlFor="timeline" className="block text-warm-white text-sm font-medium mb-2">
            Preferred Timeline
          </label>
          <input
            type="text"
            id="timeline"
            name="timeline"
            value={formData.timeline}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-charcoal border border-white/20 text-warm-white placeholder-muted-gray focus:border-warm-white focus:outline-none transition-colors"
            placeholder="Optional"
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-4">
        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full md:w-auto px-12 py-4 bg-warm-white text-near-black font-medium text-sm uppercase tracking-wider hover:scale-105 transition-transform duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === 'loading' ? 'Sending...' : 'Submit Inquiry'}
        </button>
      </div>

      {/* Status Messages */}
      {status === 'success' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-green-500/20 border border-green-500/40 text-green-400"
        >
          Thank you! Your inquiry has been received. I'll get back to you soon.
        </motion.div>
      )}

      {status === 'error' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-red-500/20 border border-red-500/40 text-red-400"
        >
          Sorry, something went wrong. Please try contacting directly via phone or social media.
        </motion.div>
      )}
    </form>
  );
}
