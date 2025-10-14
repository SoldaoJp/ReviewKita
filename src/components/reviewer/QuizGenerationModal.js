import React, { useState } from 'react';
import { X } from 'lucide-react';

function QuizGenerationModal({ isOpen, onClose, onGenerate, reviewerId }) {
  const [formData, setFormData] = useState({
    numQuestions: 10,
    questionType: 'multiple-choice',
    timerMinutes: 0,
    difficulty: 'medium',
    provideScenarios: false,
    scheduledAt: '', // ISO-less local string from datetime-local input
  });

  const [isGenerating, setIsGenerating] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    // Ensure positive numbers only
    const numValue = Math.max(0, parseInt(value) || 0);
    setFormData((prev) => ({ ...prev, [name]: numValue }));
  };

  const handleToggle = () => {
    setFormData((prev) => ({ ...prev, provideScenarios: !prev.provideScenarios }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (formData.numQuestions < 1) {
      alert('Number of questions must be at least 1');
      return;
    }

    try {
      setIsGenerating(true);
      await onGenerate({
        reviewerId,
        numQuestions: formData.numQuestions,
        questionTypes: [formData.questionType],
        timerMinutes: formData.timerMinutes,
        difficulty: formData.difficulty,
        provideScenarios: formData.provideScenarios,
        // Optional scheduling info; backend may ignore if not supported
        scheduledAt: formData.scheduledAt ? new Date(formData.scheduledAt).toISOString() : undefined,
      });
      // Reset form
      setFormData({
        numQuestions: 10,
        questionType: 'multiple-choice',
        timerMinutes: 0,
        difficulty: 'medium',
        provideScenarios: false,
        scheduledAt: '',
      });
      onClose();
    } catch (error) {
      console.error('Error generating quiz:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white w-[500px] max-h-[85vh] rounded-xl shadow-lg relative animate-fade-in flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Generate Quiz</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition"
            disabled={isGenerating}
          >
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Form Content */}
        <div className="px-6 py-4 space-y-4 overflow-y-auto flex-1">
          {/* Number of Questions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Number of Questions
            </label>
            <input
              type="number"
              name="numQuestions"
              value={formData.numQuestions}
              onChange={handleNumberChange}
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              required
              disabled={isGenerating}
            />
          </div>

          {/* Question Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Question Type
            </label>
            <select
              name="questionType"
              value={formData.questionType}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              disabled={isGenerating}
            >
              <option value="multiple-choice">Multiple Choice</option>
              <option value="identification">Identification</option>
            </select>
          </div>

          {/* Timer */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Timer (minutes)
            </label>
            <input
              type="number"
              name="timerMinutes"
              value={formData.timerMinutes}
              onChange={handleNumberChange}
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              placeholder="0 for no timer"
              disabled={isGenerating}
            />
            <p className="text-xs text-gray-500 mt-1">Set to 0 for no timer</p>
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Difficulty
            </label>
            <select
              name="difficulty"
              value={formData.difficulty}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              disabled={isGenerating}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          {/* Schedule (optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Schedule (optional)
            </label>
            <input
              type="datetime-local"
              name="scheduledAt"
              value={formData.scheduledAt}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              disabled={isGenerating}
            />
            <p className="text-xs text-gray-500 mt-1">If set, we’ll remember when you plan to take this quiz.</p>
          </div>

          {/* Provide Scenarios Toggle */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">
              Provide Scenarios
            </label>
            <button
              type="button"
              onClick={handleToggle}
              disabled={isGenerating}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 ${
                formData.provideScenarios ? 'bg-blue-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  formData.provideScenarios ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Fixed Footer Buttons */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            disabled={isGenerating}
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isGenerating}
          >
            {isGenerating ? 'Generating...' : 'Generate Quiz'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default QuizGenerationModal;
