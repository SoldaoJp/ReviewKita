import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { getReviewerById, deleteReviewer, updateReviewer, reenhanceReviewerContent } from "../../services/reviewerService";
import { logUserActivity } from "../../services/userActivityService";
import { getAvailableLlmModels, recommendLlmConfig, reportLlmConfigReviewer, rateLlmConfig } from "../../services/llmConfigService";
import { createQuiz, createRetakeQuiz } from "../../services/quizService";
import { useReviewerContext } from "../../controllers/context/ReviewerContext";
import QuizGenerationModal from "../components/reviewer/QuizGenerationModal";

function ReviewerDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { triggerReviewerUpdate } = useReviewerContext();
  const [reviewer, setReviewer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeView, setActiveView] = useState("original"); // "original" or "enhanced"
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [showDifficultyModal, setShowDifficultyModal] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [hoveredQuiz, setHoveredQuiz] = useState(null);
  const [activeSection, setActiveSection] = useState(0);
  const sectionRefs = useRef([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [reEnhancing, setReEnhancing] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportIssue, setReportIssue] = useState("");
  const [reportDetails, setReportDetails] = useState("");
  const [availableModels, setAvailableModels] = useState([]);
  const [selectedModelId, setSelectedModelId] = useState(null);
  const [loadingModels, setLoadingModels] = useState(false);
  const [recommending, setRecommending] = useState(false);
  const [notification, setNotification] = useState(null); // { type: 'success' | 'error', message: string }
  const [showRetakeModal, setShowRetakeModal] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isRating, setIsRating] = useState(false);

  // Debug log for userRating changes
  useEffect(() => {
    console.log('userRating state updated:', userRating);
  }, [userRating]);

  useEffect(() => {
      fetchReviewerDetail();
      // Log activity only if the user stays on the page for at least 60 seconds
      let timerId;
      if (id) {
        timerId = setTimeout(() => {
          logUserActivity('open_reviewer', id).catch((err) => {
            console.error('Failed to log user activity:', err);
          });
        }, 60_000); // 60 seconds
      }
      return () => {
        if (timerId) clearTimeout(timerId);
      };
    }, [id]);

  // Fetch available models when reviewer is loaded
  useEffect(() => {
    if (reviewer) {
      fetchAvailableModels();
    }
  }, [reviewer?.modelId]);

  // Auto-hide notification after 5 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const showNotification = (type, message) => {
    setNotification({ type, message });
  };

  const handleCancelEnhancing = () => {
    setReEnhancing(false);
    showNotification('error', 'Enhancement cancelled by user.');
  };

  const fetchAvailableModels = async () => {
    try {
      setLoadingModels(true);
      const response = await getAvailableLlmModels('reviewer');
      if (response.models) {
        setAvailableModels(response.models);
        // Set the current model as selected if not already set
        if (reviewer?.modelId && !selectedModelId) {
          setSelectedModelId(reviewer.modelId.toString());
        }
      }
    } catch (err) {
      console.error("Error fetching models:", err);
      showNotification('error', 'Failed to load AI models. Please try again.');
    } finally {
      setLoadingModels(false);
    }
  };

  const handleEnhancedTabClick = () => {
    // Simply switch to enhanced view
    setActiveView("enhanced");
  };

  const handleModelChange = async (newModelId) => {
    if (!newModelId || newModelId === selectedModelId) {
      return;
    }
    
    setSelectedModelId(newModelId);
    
    try {
      setReEnhancing(true);
      
      // Call the re-enhance endpoint with the selected model
      const response = await reenhanceReviewerContent(id, { 
        revisionNotes: '', 
        model_id: newModelId 
      });
      
      if (response.success) {
        // Update the reviewer with new enhanced content and model info
        setReviewer(prev => ({
          ...prev,
          enhancedContentByAI: response.data.enhancedContentByAI,
          modelId: newModelId,
          modelName: availableModels.find(m => m.id === newModelId)?.model_name || prev.modelName
        }));
        
        showNotification('success', 'Content re-enhanced successfully with the selected model!');
      }
    } catch (err) {
      console.error("Error enhancing content:", err);
      showNotification('error', err.response?.data?.message || 'Failed to enhance content. Please try again.');
      // Revert to previous model on error
      setSelectedModelId(reviewer?.modelId?.toString() || '');
    } finally {
      setReEnhancing(false);
    }
  };

  const handleRecommendModel = async () => {
    if (!reviewer.modelId) {
      alert("No model associated with this reviewer.");
      return;
    }

    try {
      setRecommending(true);
      const isRemoving = reviewer.userHasRecommendedModel;
      await recommendLlmConfig(reviewer.modelId, isRemoving);
      
      // Update local state
      setReviewer(prev => ({
        ...prev,
        userHasRecommendedModel: !isRemoving
      }));
      
      showNotification('success', isRemoving ? 'Recommendation removed successfully!' : 'Model recommended successfully!');
    } catch (err) {
      console.error("Error with model recommendation:", err);
      showNotification('error', 'Failed to update recommendation. Please try again.');
    } finally {
      setRecommending(false);
    }
  };

  const fetchReviewerDetail = async () => {
    try {
      setLoading(true);
      const response = await getReviewerById(id);
      console.log('Reviewer API Response:', response); // Debug log
      if (response.success && response.data) {
        setReviewer(response.data);
        console.log('Reviewer Data:', response.data); // Debug log
        console.log('Rated:', response.data.rated, 'UserRating:', response.data.userRating); // Debug log
        
        // Set user rating if available
        if (response.data.userRating) {
          setUserRating(response.data.userRating);
          console.log('Setting userRating to:', response.data.userRating); // Debug log
        } else {
          setUserRating(0);
          console.log('No rating found, setting to 0'); // Debug log
        }
      }
      setError(null);
    } catch (err) {
      console.error("Error fetching reviewer:", err);
      setError("Failed to load reviewer. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRatingClick = async (rating) => {
    if (!reviewer.modelId) {
      showNotification('error', 'No model associated with this reviewer.');
      return;
    }

    try {
      setIsRating(true);
      const response = await rateLlmConfig(reviewer.modelId, rating);
      
      // Update local state
      setUserRating(rating);
      setReviewer(prev => ({
        ...prev,
        rated: true,
        userRating: rating
      }));
      
      showNotification('success', `Rated ${rating} star${rating !== 1 ? 's' : ''}!`);
    } catch (err) {
      console.error("Error rating model:", err);
      showNotification('error', err.response?.data?.message || 'Failed to submit rating. Please try again.');
    } finally {
      setIsRating(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteReviewer(id);
      triggerReviewerUpdate(); // Notify sidebar to refresh
      navigate("/reviewer");
    } catch (err) {
      console.error("Error deleting reviewer:", err);
      alert("Failed to delete reviewer. Please try again.");
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedContent(reviewer.originalContent);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedContent("");
  };

  const handleSave = async () => {
    // Validate that content is not empty
    if (!editedContent || editedContent.trim() === '') {
      showNotification('error', 'Content cannot be empty. Please enter some text.');
      return;
    }

    try {
      setSaving(true);
      // Include current model_id with originalContent for sync enhancement
      const response = await updateReviewer(id, { originalContent: editedContent.trim(), model_id: reviewer.modelId });
      if (response.success) {
        // Update the local reviewer state with new content
        const updatedReviewer = {
          ...reviewer,
          originalContent: response.data.originalContent,
          enhancedContentByAI: response.data.enhancedContentByAI
        };
        setReviewer(updatedReviewer);
        setIsEditing(false);
        setEditedContent("");
        showNotification('success', 'Reviewer updated successfully!');
      }
    } catch (err) {
      console.error("Error updating reviewer:", err);
      showNotification('error', err.response?.data?.message || 'Failed to update reviewer. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleReEnhance = async () => {
    try {
      setReEnhancing(true);
      const response = await reenhanceReviewerContent(id, { revisionNotes: '', model_id: reviewer.modelId });
      if (response.success) {
        setReviewer(prev => ({
          ...prev,
          enhancedContentByAI: response.data.enhancedContentByAI
        }));
        showNotification('success', 'Content re-enhanced successfully!');
      }
    } catch (err) {
      console.error("Error re-enhancing reviewer:", err);
      showNotification('error', err.response?.data?.message || 'Failed to re-enhance content. Please try again.');
    } finally {
      setReEnhancing(false);
    }
  };

  const handleReportSubmit = async () => {
    if (!reportIssue) {
      showNotification('error', 'Please select an issue type.');
      return;
    }
    if (!reportDetails.trim()) {
      showNotification('error', 'Please provide details about the issue.');
      return;
    }

    if (!reviewer.modelId) {
      showNotification('error', 'Unable to submit report: Model ID not found.');
      return;
    }

    try {
      const reportData = {
        type: reportIssue,
        description: reportDetails.trim(),
        reviewer_id: id // Add the reviewer ID from URL params
      };

      const response = await reportLlmConfigReviewer(reviewer.modelId, reportData);
      
      if (response.success || response.report) {
        showNotification('success', 'Report submitted successfully. Thank you for helping improve our content!');
        
        // Reset and close modal
        setReportIssue("");
        setReportDetails("");
        setShowReportModal(false);
      }
    } catch (error) {
      console.error("Error submitting report:", error);
      showNotification('error', error.response?.data?.error || error.message || 'Failed to submit report. Please try again.');
    }
  };

  const handleReportCancel = () => {
    setReportIssue("");
    setReportDetails("");
    setShowReportModal(false);
  };

  const handleGenerateQuiz = async (quizData) => {
    try {
      showNotification('loading', `Generating ${selectedDifficulty} quiz...`);
      
      // Add difficulty to quiz data
      const quizDataWithDifficulty = {
        ...quizData,
        difficulty: selectedDifficulty
      };
      
      const response = await createQuiz(quizDataWithDifficulty);
      console.log('Quiz created successfully:', response);
      showNotification('success', 'Quiz generated successfully! Redirecting...');
      setShowQuizModal(false);
      
      // Navigate to quiz page after a brief delay
      setTimeout(() => {
        navigate(`/quiz/${id}`);
      }, 1500);
    } catch (error) {
      console.error('Error generating quiz:', error);
      console.error('Error details:', error.response?.data);
      
      // Extract detailed error message
      let errorMessage = 'Failed to generate quiz. Please try again.';
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        errorMessage = error.response.data.errors.map(e => e.msg).join(', ');
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      showNotification('error', errorMessage);
      setSelectedDifficulty(null);
    }
  };

  const handleDifficultySelect = (difficulty) => {
    setSelectedDifficulty(difficulty);
    setShowDifficultyModal(false);
    
    // Check if this difficulty already has a quiz
    const hasQuizForDifficulty = reviewer?.quizzes?.[difficulty]?.quizId;
    
    if (hasQuizForDifficulty) {
      // Show retake confirmation
      setShowRetakeModal(true);
    } else {
      // Show quiz generation modal
      setShowQuizModal(true);
    }
  };

  const handleRetakeQuiz = async () => {
    if (!id || !selectedDifficulty) return;
    
    try {
      setShowRetakeModal(false);
      showNotification('loading', `Generating new ${selectedDifficulty} quiz...`);
      
      // Get the quiz ID for the selected difficulty
      const quizId = reviewer?.quizzes?.[selectedDifficulty]?.quizId;
      
      if (!quizId) {
        throw new Error('Quiz ID not found for selected difficulty');
      }
      
      // Use retake endpoint to create a new quiz with same settings
      const response = await createRetakeQuiz(quizId);
      console.log('Retake quiz created successfully:', response);
      
      // Get the retake quiz ID from response
      const retakeQuizId = response.retake?._id || response._id;
      
      showNotification('success', 'New quiz generated successfully! Redirecting...');
      
      setTimeout(() => {
        // Navigate to retake quiz using the retake quiz ID
        navigate(`/retake-quiz/${retakeQuizId}`);
      }, 1500);
    } catch (error) {
      console.error('Error generating retake quiz:', error);
      
      let errorMessage = 'Failed to generate new quiz. Please try again.';
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        errorMessage = error.response.data.errors.map(e => e.msg).join(', ');
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      showNotification('error', errorMessage);
      setSelectedDifficulty(null);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
  };

  // Parse content supporting the new tagged format:
  // [SECTION: KEY]\n[Human Title]\n...content...\n[END_SECTION]
  // Falls back to heuristic parsing if no tags are found
  const parseContentSections = (content) => {
    if (!content) return [];
    const lines = content.split('\n');
    const sections = [];
    let i = 0;
    let foundTagged = false;

    while (i < lines.length) {
      const line = lines[i].trim();
      const m = line.match(/^\[SECTION:\s*([A-Z0-9_]+)\]/);
      if (m) {
        foundTagged = true;
        const key = m[1];
        let j = i + 1;
        let title = key.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
        if (j < lines.length) {
          const next = lines[j].trim();
          const tm = next.match(/^\[([^\]]+)\]/);
          if (tm) {
            title = tm[1];
            j++;
          }
        }
        const contentLines = [];
        while (j < lines.length && !/^\[END_SECTION\]/.test(lines[j].trim())) {
          const curr = lines[j];
          if (curr.trim().length > 0) contentLines.push(curr);
          j++;
        }
        // advance past END_SECTION if present
        i = j + 1;
        sections.push({ key, title, content: contentLines });
        continue;
      }
      i++;
    }

    if (foundTagged) return sections;

    // Fallback heuristic parsing (legacy content)
    const result = [];
    let current = { title: 'Content', content: [] };
    for (const raw of lines) {
      const t = raw.trim();
      const isHeading =
        /^[A-Z][A-Z\s]+$/.test(t) ||
        /^\d+\.\s+[A-Z]/.test(t) ||
        /^[A-Z][^.!?]*:$/.test(t) ||
        (t.length > 0 && t.length < 50 && /^[A-Z]/.test(t) && !t.includes('.'));
      if (isHeading && t.length > 0) {
        if (current.content.length > 0) result.push(current);
        current = { title: t.replace(/:$/, ''), content: [] };
      } else if (t.length > 0) {
        current.content.push(raw);
      }
    }
    if (current.content.length > 0) result.push(current);
    return result.length > 0 ? result : [{ title: 'Content', content: lines }];
  };

  // Render content with bullet list and inline **bold** support
  const renderSectionContent = (contentLines) => {
    const blocks = [];
    let i = 0;

    const isBullet = (l) => /^\s*[-*]\s+/.test(l);
    const stripBullet = (l) => l.replace(/^\s*[-*]\s+/, '');
    const isBoldOnly = (l) => /^\s*\*\*([^*].*?)\*\*\s*$/.test(l);
    const extractBoldOnly = (l) => (l.match(/^\s*\*\*([^*].*?)\*\*\s*$/) || [,''])[1];

    const renderInline = (text) => {
      // Supports existing **bold** syntax and also bolds words enclosed in [brackets]
      const parts = String(text).split(/(\*\*[^*]+\*\*|\[[^\]]+\])/g);
      return parts.map((part, idx) => {
        // Markdown-style bold
        const boldMatch = part.match(/^\*\*(.+)\*\*$/);
        if (boldMatch) {
          return <strong key={idx}>{boldMatch[1]}</strong>;
        }
        // Bracketed text: render brackets normally and bold the inner content
        const bracketMatch = part.match(/^\[([^\]]+)\]$/);
        if (bracketMatch) {
          const inner = bracketMatch[1];
          return (
            <span key={idx}>[<strong>{inner}</strong>]</span>
          );
        }
        // Plain text
        return <span key={idx}>{part}</span>;
      });
    };

    while (i < contentLines.length) {
      const line = contentLines[i];
      if (isBullet(line)) {
        const items = [];
        while (i < contentLines.length && isBullet(contentLines[i])) {
          items.push(stripBullet(contentLines[i]));
          i++;
        }
        blocks.push({ type: 'ul', items });
        continue;
      }

      if (isBoldOnly(line)) {
        blocks.push({ type: 'h3', text: extractBoldOnly(line) });
        i++;
        continue;
      }

      const t = String(line).trim();
      if (t.length > 0) {
        blocks.push({ type: 'p', text: line });
      }
      i++;
    }

    return (
      <div className="prose max-w-none">
        {blocks.map((b, idx) => {
          if (b.type === 'ul') {
            return (
              <ul key={idx} className="list-disc ml-6 mb-4 text-gray-700">
                {b.items.map((it, ii) => (
                  <li key={ii} className="mb-1">{renderInline(it)}</li>
                ))}
              </ul>
            );
          }
          if (b.type === 'h3') {
            return (
              <h3 key={idx} className="mt-4 mb-2 font-semibold text-gray-800">{renderInline(b.text)}</h3>
            );
          }
          return (
            <p key={idx} className="mb-4 text-gray-700 leading-relaxed">{renderInline(b.text)}</p>
          );
        })}
      </div>
    );
  };

  const scrollToSection = (index) => {
    setActiveSection(index);
    if (sectionRefs.current[index]) {
      sectionRefs.current[index].scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const sections = reviewer ? parseContentSections(
    activeView === "enhanced" ? reviewer.enhancedContentByAI : reviewer.originalContent
  ) : [];

  // Update sections when reviewer content changes
  useEffect(() => {
    if (reviewer) {
      // Reset section refs when content changes
      sectionRefs.current = [];
    }
  }, [reviewer?.originalContent, reviewer?.enhancedContentByAI, activeView]);

  if (loading) {
    return (
      <div className="p-8 h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">Loading reviewer...</p>
        </div>
      </div>
    );
  }

  if (error || !reviewer) {
    return (
      <div className="p-8 h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || "Reviewer not found"}</p>
          <button 
            onClick={() => navigate("/reviewer")}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Back to Reviewers
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 h-screen flex flex-col" style={{ background: '#e3f2fd' }}>
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate("/reviewer")}
            className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center hover:bg-blue-200 transition-colors"
          >
            <span className="text-xl">â†</span>
          </button>
          <div>
            <h1 className="text-2xl font-bold">{reviewer.title}</h1>
            <p className="text-sm text-gray-500">Last updated: {formatDate(reviewer.extractedDate)}</p>
            {reviewer.modelName && (
              <div className="flex items-center gap-3 mt-1">
                <p className="text-xs text-gray-500">Generated by {reviewer.modelName}</p>
                <div className="flex items-center gap-1.5">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => handleRatingClick(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        disabled={isRating}
                        className="transition-transform hover:scale-110 disabled:cursor-not-allowed focus:outline-none"
                        title={reviewer.rated ? `Change rating to ${star} star${star !== 1 ? 's' : ''}` : `Rate ${star} star${star !== 1 ? 's' : ''}`}
                      >
                        <svg
                          className={`w-5 h-5 ${
                            (hoverRating || userRating) >= star
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-300 fill-gray-300'
                          } transition-colors`}
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="1"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                          />
                        </svg>
                      </button>
                    ))}
                  </div>
                  {reviewer.rated && userRating > 0 ? (
                    <span className="text-xs font-medium text-yellow-600">
                      {userRating}/5
                    </span>
                  ) : (
                    <span className="text-xs text-gray-400">
                      Rate this reviewer
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {activeView === "original" ? (
            isEditing ? (
              <>
                <button 
                  onClick={handleCancelEdit}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm"
                  disabled={saving}
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSave}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                  disabled={saving}
                >
                  {saving ? "Saving..." : "ðŸ’¾ Save"}
                </button>
              </>
            ) : (
              <button 
                onClick={handleEdit}
                className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors text-sm"
              >
                ðŸ“ Edit
              </button>
            )
          ) : (
            <>
              <button 
                onClick={handleReEnhance}
                className="px-4 py-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors text-sm"
                disabled={reEnhancing}
              >
                {reEnhancing ? "Re-enhancing..." : "âœ¨ Re-enhance"}
              </button>
              <button 
                onClick={() => setShowReportModal(true)}
                className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors text-sm"
              >
                ðŸš© Report
              </button>
              <button 
                onClick={handleRecommendModel}
                className={`px-4 py-2 rounded-lg transition-colors text-sm ${
                  reviewer.userHasRecommendedModel
                    ? "bg-orange-100 text-orange-600 hover:bg-orange-200"
                    : "bg-green-100 text-green-600 hover:bg-green-200"
                }`}
                disabled={recommending || !reviewer.modelId}
              >
                {recommending 
                  ? "Processing..." 
                  : reviewer.userHasRecommendedModel 
                    ? "âŒ Remove Recommendation"
                    : "ðŸ‘ Recommend Model"}
              </button>
            </>
          )}
          <button 
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              activeView === "original" 
                ? "bg-black text-white" 
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            onClick={() => {
              setActiveView("original");
              setIsEditing(false);
            }}
          >
            Original
          </button>
          <button 
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              activeView === "enhanced" 
                ? "bg-black text-white" 
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            onClick={handleEnhancedTabClick}
          >
            Enhanced
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex gap-6 overflow-hidden mb-6">
        {/* Left Sidebar - Table of Contents */}
        <div className="w-64 flex flex-col gap-3">
          <div className="rounded-lg p-4 flex-1 overflow-hidden flex flex-col">
            <h2 className="font-semibold mb-4 text-sm text-gray-600">TABLE OF CONTENTS</h2>
            <div className="flex flex-col gap-1 overflow-y-auto flex-1 pr-2">
              {sections.map((section, index) => {
                const tocLabel = section.key
                  ? String(section.key).replace(/^\s*SECTION:\s*/i, '').replace(/_/g, ' ').trim()
                  : section.title;
                return (
                  <button
                    key={index}
                    onClick={() => scrollToSection(index)}
                    className={`text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      activeSection === index
                        ? "bg-blue-100 text-blue-600 font-medium"
                        : "text-gray-700 hover:bg-white/50"
                    }`}
                  >
                    <span className="block w-full truncate">{tocLabel}</span>
                  </button>
                );
              })}
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col gap-2">
            <button 
              onClick={() => setShowDifficultyModal(true)}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
            >
              {reviewer.hasAllDifficulties ? "Retake Quiz" : reviewer.hasQuiz ? "Generate/Retake Quiz" : "Generate Quiz"}
            </button>
            
            {/* Difficulty Badges */}
            {reviewer.hasQuiz && (
              <div className="flex gap-2 flex-wrap">
                {reviewer.quizzes?.easy?.quizId && (
                  <span className="px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full">Easy âœ“</span>
                )}
                {reviewer.quizzes?.medium?.quizId && (
                  <span className="px-2 py-0.5 text-xs bg-yellow-100 text-yellow-700 rounded-full">Medium âœ“</span>
                )}
                {reviewer.quizzes?.hard?.quizId && (
                  <span className="px-2 py-0.5 text-xs bg-red-100 text-red-700 rounded-full">Hard âœ“</span>
                )}
              </div>
            )}
            
            <button 
              onClick={() => setShowDeleteModal(true)}
              className="w-full px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors text-sm"
            >
              Delete Reviewer
            </button>
          </div>
        </div>

        {/* Right Content Area - Display all sections */}
        <div className="flex-1 bg-white/50 rounded-2xl shadow-sm border border-[#eef3fb] p-8 overflow-y-auto relative">
          {isEditing ? (
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="w-full h-full min-h-[600px] p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Enter your content here..."
            />
          ) : (
            sections.map((section, index) => (
              <div 
                key={index} 
                ref={el => sectionRefs.current[index] = el}
                className="mb-12"
              >
                <div className="flex items-baseline gap-3 mb-4">
                  <h2 className="text-2xl font-bold">{section.title}</h2>
                  {section.key && (
                    <span className="text-xs uppercase bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{String(section.key).replace(/^\*?SECTION:\s*/i, '').replace(/_/g, ' ').trim()}</span>
                  )}
                </div>
                {renderSectionContent(section.content)}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-[360px] px-6 py-5 relative">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Confirm deletion
            </h2>
            <p className="text-gray-600 text-sm mb-6">
              Do you want to permanently remove{" "}
              <span className="text-blue-600 font-medium">
                {reviewer.title}
              </span>{" "}
              reviewer?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-800 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
              >
                Delete
              </button>
            </div>

            <button
              onClick={() => setShowDeleteModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-lg"
            >
              Ã—
            </button>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-[480px] px-6 py-5 relative">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Report Enhanced Content
            </h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Issue Type
              </label>
              <select
                value={reportIssue}
                onChange={(e) => setReportIssue(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select an issue...</option>
                <option value="inaccurate_information">Inaccurate information</option>
                <option value="incomplete_content">Incomplete content</option>
                <option value="poor_formatting">Poor formatting/structure</option>
                <option value="misleading_explanations">Misleading explanations</option>
                <option value="irrelevant_content">Irrelevant content</option>
                <option value="grammatical_errors">Grammatical errors</option>
                <option value="others">Others</option>
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Details
              </label>
              <textarea
                value={reportDetails}
                onChange={(e) => setReportDetails(e.target.value)}
                placeholder="Please provide more details about the issue..."
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={handleReportCancel}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-800 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleReportSubmit}
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
              >
                Submit
              </button>
            </div>

            <button
              onClick={handleReportCancel}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-lg"
            >
              Ã—
            </button>
          </div>
        </div>
      )}

      {/* Notification Popup */}
      {notification && notification.type !== 'loading' && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div className={`rounded-lg shadow-lg p-4 min-w-[300px] max-w-[400px] ${
            notification.type === 'success' 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-red-50 border border-red-200'
          }`}>
            <div className="flex items-start gap-3">
              <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
              }`}>
                {notification.type === 'success' ? (
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </div>
              <div className="flex-1">
                <p className={`text-sm font-medium ${
                  notification.type === 'success' ? 'text-green-800' : 'text-red-800'
                }`}>
                  {notification.type === 'success' ? 'Success!' : 'Error'}
                </p>
                <p className={`text-sm mt-1 ${
                  notification.type === 'success' ? 'text-green-700' : 'text-red-700'
                }`}>
                  {notification.message}
                </p>
              </div>
              <button
                onClick={() => setNotification(null)}
                className={`flex-shrink-0 ${
                  notification.type === 'success' ? 'text-green-400 hover:text-green-600' : 'text-red-400 hover:text-red-600'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading Notification for Re-enhancing */}
      {reEnhancing && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div className="rounded-lg shadow-lg p-4 min-w-[300px] bg-blue-50 border border-blue-200">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-800">
                  Enhancing Content
                </p>
                <p className="text-sm mt-1 text-blue-700">
                  Please wait while we enhance your reviewer content with AI...
                </p>
              </div>
              <button
                onClick={handleCancelEnhancing}
                className="flex-shrink-0 text-blue-400 hover:text-blue-600 transition-colors"
                title="Cancel enhancement"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading Notification for Quiz Generation */}
      {notification && notification.type === 'loading' && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div className="rounded-lg shadow-lg p-4 min-w-[300px] bg-blue-50 border border-blue-200">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-800">
                  Processing
                </p>
                <p className="text-sm mt-1 text-blue-700">
                  {notification.message}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quiz Generation Modal */}
      <QuizGenerationModal
        isOpen={showQuizModal}
        onClose={() => {
          setShowQuizModal(false);
          setSelectedDifficulty(null);
        }}
        onGenerate={handleGenerateQuiz}
        reviewerId={id}
        preSelectedDifficulty={selectedDifficulty}
      />

      {/* Difficulty Selection Modal */}
      {showDifficultyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
            <h3 className="text-lg font-semibold mb-3">Select Quiz Difficulty</h3>
            <p className="text-gray-600 text-sm mb-6">
              Choose the difficulty level for your quiz. Already completed? Click to practice more!
            </p>
            <div className="space-y-3">
              {/* Easy Button */}
              <div 
                className="relative"
                onMouseEnter={() => reviewer?.quizzes?.easy?.quizId && setHoveredQuiz('easy')}
                onMouseLeave={() => setHoveredQuiz(null)}
              >
                <button
                  onClick={() => handleDifficultySelect('easy')}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
                    reviewer?.quizzes?.easy?.quizId
                      ? 'bg-green-100 text-green-700 border-2 border-green-300 hover:bg-green-200'
                      : 'bg-green-500 text-white hover:bg-green-600'
                  }`}
                >
                  Easy {reviewer?.quizzes?.easy?.quizId && 'âœ“'}
                </button>
                {hoveredQuiz === 'easy' && reviewer?.quizzes?.easy?.quizId && (
                  <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-3 rounded whitespace-nowrap">
                    Practice more
                  </div>
                )}
              </div>

              {/* Medium Button */}
              <div 
                className="relative"
                onMouseEnter={() => reviewer?.quizzes?.medium?.quizId && setHoveredQuiz('medium')}
                onMouseLeave={() => setHoveredQuiz(null)}
              >
                <button
                  onClick={() => handleDifficultySelect('medium')}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
                    reviewer?.quizzes?.medium?.quizId
                      ? 'bg-yellow-100 text-yellow-700 border-2 border-yellow-300 hover:bg-yellow-200'
                      : 'bg-yellow-500 text-white hover:bg-yellow-600'
                  }`}
                >
                  Medium {reviewer?.quizzes?.medium?.quizId && 'âœ“'}
                </button>
                {hoveredQuiz === 'medium' && reviewer?.quizzes?.medium?.quizId && (
                  <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-3 rounded whitespace-nowrap">
                    Practice more
                  </div>
                )}
              </div>

              {/* Hard Button */}
              <div 
                className="relative"
                onMouseEnter={() => reviewer?.quizzes?.hard?.quizId && setHoveredQuiz('hard')}
                onMouseLeave={() => setHoveredQuiz(null)}
              >
                <button
                  onClick={() => handleDifficultySelect('hard')}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
                    reviewer?.quizzes?.hard?.quizId
                      ? 'bg-red-100 text-red-700 border-2 border-red-300 hover:bg-red-200'
                      : 'bg-red-500 text-white hover:bg-red-600'
                  }`}
                >
                  Hard {reviewer?.quizzes?.hard?.quizId && 'âœ“'}
                </button>
                {hoveredQuiz === 'hard' && reviewer?.quizzes?.hard?.quizId && (
                  <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-3 rounded whitespace-nowrap">
                    Practice more
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-3 justify-end mt-6">
              <button
                onClick={() => {
                  setShowDifficultyModal(false);
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Retake Quiz Confirmation Modal */}
      {showRetakeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
            <h3 className="text-lg font-semibold mb-3">Practice More - {selectedDifficulty?.charAt(0).toUpperCase() + selectedDifficulty?.slice(1)} Level</h3>
            <p className="text-gray-600 text-sm mb-6">
              Ready to practice more? We'll generate a fresh set of <span className="font-semibold">{selectedDifficulty}</span> questions with the same settings. Your previous attempts will be saved in your history!
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowRetakeModal(false);
                  setSelectedDifficulty(null);
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleRetakeQuiz}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Start Practice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReviewerDetailPage;

