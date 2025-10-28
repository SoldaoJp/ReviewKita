import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { getAllReviewers } from '../../../services/reviewerService';
import { useNavigate } from 'react-router-dom';

function QuizGenerationModal({ isOpen, onClose, onGenerate, reviewerId, fromDashboard = false, preSelectedDifficulty = null }) {
  const [formData, setFormData] = useState({
    numQuestions: 10,
    questionType: 'multiple-choice',
    timerMinutes: 0,
    difficulty: preSelectedDifficulty || 'medium',
    provideScenarios: false,
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [reviewers, setReviewers] = useState([]);
  const [selectedReviewerId, setSelectedReviewerId] = useState('');
  const [loadingReviewers, setLoadingReviewers] = useState(false);
  const navigate = useNavigate();

  const [mixedTypeConfig, setMixedTypeConfig] = useState({
    'multiple-choice': { enabled: false, count: 0 },
    'identification': { enabled: false, count: 0 },
    'open-ended': { enabled: false, count: 0 },
    'fill-in-the-blanks': { enabled: false, count: 0 },
  });

  useEffect(() => {
    if (fromDashboard && isOpen) {
      const fetchReviewers = async () => {
        try {
          setLoadingReviewers(true);
          const response = await getAllReviewers(1000);
          if (response.success && Array.isArray(response.data)) {
            setReviewers(response.data);
          } else if (Array.isArray(response)) {
            setReviewers(response);
          }
        } catch (error) {
          console.error('Error fetching reviewers:', error);
        } finally {
          setLoadingReviewers(false);
        }
      };
      fetchReviewers();
    }
  }, [fromDashboard, isOpen]);

  useEffect(() => {
    if (preSelectedDifficulty && isOpen) {
      setFormData(prev => ({ ...prev, difficulty: preSelectedDifficulty }));
    }
  }, [preSelectedDifficulty, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    const numValue = Math.max(0, parseInt(value) || 0);
    setFormData((prev) => ({ ...prev, [name]: numValue }));
  };

  const handleToggle = () => {
    setFormData((prev) => ({ ...prev, provideScenarios: !prev.provideScenarios }));
  };

  const handleMixedTypeToggle = (type) => {
    setMixedTypeConfig(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        enabled: !prev[type].enabled,
        count: !prev[type].enabled ? 1 : 0
      }
    }));
  };

  const handleMixedTypeCountChange = (type, value) => {
    const numValue = Math.max(0, parseInt(value) || 0);
    const totalOtherTypes = Object.entries(mixedTypeConfig)
      .filter(([t]) => t !== type)
      .reduce((sum, [, config]) => sum + config.count, 0);
    
    const maxAllowed = formData.numQuestions - totalOtherTypes;
    const finalCount = Math.min(numValue, maxAllowed);
    
    setMixedTypeConfig(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        count: finalCount
      }
    }));
  };

  const getTotalMixedQuestions = () => {
    return Object.values(mixedTypeConfig).reduce((sum, config) => sum + config.count, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.numQuestions < 1) {
      alert('Number of questions must be at least 1');
      return;
    }

    if (fromDashboard && !selectedReviewerId) {
      alert('Please select a reviewer');
      return;
    }

    if (formData.questionType === 'mixed') {
      const totalMixed = getTotalMixedQuestions();
      const enabledTypes = Object.entries(mixedTypeConfig).filter(([, config]) => config.enabled);
      
      if (enabledTypes.length === 0) {
        alert('Please select at least one question type for mixed quiz');
        return;
      }
      
      if (totalMixed !== formData.numQuestions) {
        alert(`Total questions must equal ${formData.numQuestions}. Currently: ${totalMixed}`);
        return;
      }
    }

    try {
      setIsGenerating(true);
      
      const targetReviewerId = fromDashboard ? selectedReviewerId : reviewerId;
      
      if (!targetReviewerId) {
        alert('Please select a reviewer');
        setIsGenerating(false);
        return;
      }
      
      let questionTypesArray;
      if (formData.questionType === 'mixed') {
        questionTypesArray = [];
        Object.entries(mixedTypeConfig).forEach(([type, config]) => {
          if (config.enabled && config.count > 0) {
            for (let i = 0; i < config.count; i++) {
              questionTypesArray.push(type);
            }
          }
        });
      } else {
        questionTypesArray = [formData.questionType];
      }
      
      const quizPayload = {
        reviewerId: String(targetReviewerId),
        numQuestions: parseInt(formData.numQuestions),
        questionTypes: questionTypesArray,
        timerMinutes: parseInt(formData.timerMinutes),
        difficulty: formData.difficulty,
        provideScenarios: Boolean(formData.provideScenarios),
      };
      
      
      if (fromDashboard && !onGenerate) {
        const { createQuiz } = await import('../../../services/quizService');
        const result = await createQuiz(quizPayload);
        
        if (result.quiz && result.quiz.reviewer) {
          navigate(`/quiz/${result.quiz.reviewer}`);
        } else {
          throw new Error('Invalid quiz response structure');
        }
      } else if (onGenerate) {
        await onGenerate(quizPayload);
      }
      
      setFormData({
        numQuestions: 10,
        questionType: 'multiple-choice',
        timerMinutes: 0,
        difficulty: 'medium',
        provideScenarios: false,
      });
      setSelectedReviewerId('');
      setMixedTypeConfig({
        'multiple-choice': { enabled: false, count: 0 },
        'identification': { enabled: false, count: 0 },
        'open-ended': { enabled: false, count: 0 },
        'fill-in-the-blanks': { enabled: false, count: 0 },
      });
      onClose();
    } catch (error) {
      console.error('Error generating quiz:', error);
      alert(error.response?.data?.error || error.message || 'Failed to generate quiz');
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
          {/* Reviewer Selector - Only shown when from dashboard */}
          {fromDashboard && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Reviewer
              </label>
              {loadingReviewers ? (
                <div className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-500 text-sm">
                  Loading reviewers...
                </div>
              ) : (
                <select
                  value={selectedReviewerId}
                  onChange={(e) => setSelectedReviewerId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  disabled={isGenerating}
                  required
                >
                  <option value="">-- Select a Reviewer --</option>
                  {reviewers.map((reviewer) => (
                    <option key={reviewer._id} value={reviewer._id}>
                      {reviewer.title}
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}

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
              <option value="open-ended">Essay (Open-ended)</option>
              <option value="fill-in-the-blanks">Fill in the Blanks</option>
              <option value="mixed">Mixed</option>
            </select>
          </div>

          {/* Mixed Type Configuration - Only shown when Mixed is selected */}
          {formData.questionType === 'mixed' && (
            <div className="border border-gray-300 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">
                  Question Type Distribution
                </label>
                <span className="text-xs text-gray-500">
                  Total: {getTotalMixedQuestions()} / {formData.numQuestions}
                </span>
              </div>
              
              {/* Multiple Choice */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 flex-1">
                  <input
                    type="checkbox"
                    id="mixed-mc"
                    checked={mixedTypeConfig['multiple-choice'].enabled}
                    onChange={() => handleMixedTypeToggle('multiple-choice')}
                    disabled={isGenerating}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-400"
                  />
                  <label htmlFor="mixed-mc" className="text-sm text-gray-700">
                    Multiple Choice
                  </label>
                </div>
                <input
                  type="number"
                  min="0"
                  max={formData.numQuestions}
                  value={mixedTypeConfig['multiple-choice'].count}
                  onChange={(e) => handleMixedTypeCountChange('multiple-choice', e.target.value)}
                  disabled={!mixedTypeConfig['multiple-choice'].enabled || isGenerating}
                  className="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-400 focus:border-transparent disabled:bg-gray-100"
                  placeholder="0"
                />
              </div>

              {/* Identification */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 flex-1">
                  <input
                    type="checkbox"
                    id="mixed-id"
                    checked={mixedTypeConfig['identification'].enabled}
                    onChange={() => handleMixedTypeToggle('identification')}
                    disabled={isGenerating}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-400"
                  />
                  <label htmlFor="mixed-id" className="text-sm text-gray-700">
                    Identification
                  </label>
                </div>
                <input
                  type="number"
                  min="0"
                  max={formData.numQuestions}
                  value={mixedTypeConfig['identification'].count}
                  onChange={(e) => handleMixedTypeCountChange('identification', e.target.value)}
                  disabled={!mixedTypeConfig['identification'].enabled || isGenerating}
                  className="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-400 focus:border-transparent disabled:bg-gray-100"
                  placeholder="0"
                />
              </div>

              {/* Open-ended */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 flex-1">
                  <input
                    type="checkbox"
                    id="mixed-essay"
                    checked={mixedTypeConfig['open-ended'].enabled}
                    onChange={() => handleMixedTypeToggle('open-ended')}
                    disabled={isGenerating}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-400"
                  />
                  <label htmlFor="mixed-essay" className="text-sm text-gray-700">
                    Essay (Open-ended)
                  </label>
                </div>
                <input
                  type="number"
                  min="0"
                  max={formData.numQuestions}
                  value={mixedTypeConfig['open-ended'].count}
                  onChange={(e) => handleMixedTypeCountChange('open-ended', e.target.value)}
                  disabled={!mixedTypeConfig['open-ended'].enabled || isGenerating}
                  className="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-400 focus:border-transparent disabled:bg-gray-100"
                  placeholder="0"
                />
              </div>

              {/* Fill in the Blanks */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 flex-1">
                  <input
                    type="checkbox"
                    id="mixed-fitb"
                    checked={mixedTypeConfig['fill-in-the-blanks'].enabled}
                    onChange={() => handleMixedTypeToggle('fill-in-the-blanks')}
                    disabled={isGenerating}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-400"
                  />
                  <label htmlFor="mixed-fitb" className="text-sm text-gray-700">
                    Fill in the Blanks
                  </label>
                </div>
                <input
                  type="number"
                  min="0"
                  max={formData.numQuestions}
                  value={mixedTypeConfig['fill-in-the-blanks'].count}
                  onChange={(e) => handleMixedTypeCountChange('fill-in-the-blanks', e.target.value)}
                  disabled={!mixedTypeConfig['fill-in-the-blanks'].enabled || isGenerating}
                  className="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-400 focus:border-transparent disabled:bg-gray-100"
                  placeholder="0"
                />
              </div>

              {getTotalMixedQuestions() !== formData.numQuestions && (
                <p className="text-xs text-red-600 mt-2">
                  Total questions must equal {formData.numQuestions}
                </p>
              )}
            </div>
          )}

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

          {/* Difficulty - Only show if not pre-selected */}
          {!preSelectedDifficulty && (
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
          )}

          {/* Show selected difficulty as info when pre-selected */}
          {preSelectedDifficulty && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Difficulty
              </label>
              <div className={`w-full px-3 py-2 border-2 rounded-lg font-medium ${
                preSelectedDifficulty === 'easy' ? 'bg-green-50 border-green-300 text-green-700' :
                preSelectedDifficulty === 'medium' ? 'bg-yellow-50 border-yellow-300 text-yellow-700' :
                'bg-red-50 border-red-300 text-red-700'
              }`}>
                {preSelectedDifficulty.charAt(0).toUpperCase() + preSelectedDifficulty.slice(1)}
              </div>
            </div>
          )}

          {/* removed schedule field */}

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

