// src/components/reviewer/ReviewerDetailPage.js
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getReviewerById, deleteReviewer, updateReviewer } from "../../services/reviewerService";

function ReviewerDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reviewer, setReviewer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeView, setActiveView] = useState("original"); // "original" or "enhanced"
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
  const sectionRefs = useRef([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [reEnhancing, setReEnhancing] = useState(false);

  useEffect(() => {
    fetchReviewerDetail();
  }, [id]);

  const fetchReviewerDetail = async () => {
    try {
      setLoading(true);
      const response = await getReviewerById(id);
      if (response.success) {
        setReviewer(response.data);
      }
      setError(null);
    } catch (err) {
      console.error("Error fetching reviewer:", err);
      setError("Failed to load reviewer. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteReviewer(id);
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
    try {
      setSaving(true);
      const response = await updateReviewer(id, { originalContent: editedContent });
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
        alert("Reviewer updated successfully!");
      }
    } catch (err) {
      console.error("Error updating reviewer:", err);
      alert(err.response?.data?.message || "Failed to update reviewer. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleReEnhance = async () => {
    try {
      setReEnhancing(true);
      const response = await updateReviewer(id, { originalContent: reviewer.originalContent });
      if (response.success) {
        setReviewer(prev => ({
          ...prev,
          enhancedContentByAI: response.data.enhancedContentByAI
        }));
        alert("Content re-enhanced successfully!");
      }
    } catch (err) {
      console.error("Error re-enhancing reviewer:", err);
      alert(err.response?.data?.message || "Failed to re-enhance content. Please try again.");
    } finally {
      setReEnhancing(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
  };

  // Parse content to extract sections (assuming content has headings)
  const parseContentSections = (content) => {
    if (!content) return [];
    
    // Split by common heading patterns (lines starting with uppercase or numbers)
    const lines = content.split('\n');
    const sections = [];
    let currentSection = { title: 'Introduction', content: [] };
    
    lines.forEach(line => {
      const trimmedLine = line.trim();
      
      // Check if line looks like a heading (all caps, or starts with number, or ends with colon)
      const isHeading = 
        /^[A-Z][A-Z\s]+$/.test(trimmedLine) || 
        /^\d+\.\s+[A-Z]/.test(trimmedLine) ||
        /^[A-Z][^.!?]*:$/.test(trimmedLine) ||
        (trimmedLine.length > 0 && trimmedLine.length < 50 && /^[A-Z]/.test(trimmedLine) && !trimmedLine.includes('.'));
      
      if (isHeading && trimmedLine.length > 0) {
        if (currentSection.content.length > 0) {
          sections.push(currentSection);
        }
        currentSection = { title: trimmedLine.replace(/^#+\s*/, '').replace(/:$/, ''), content: [] };
      } else if (trimmedLine.length > 0) {
        currentSection.content.push(line);
      }
    });
    
    if (currentSection.content.length > 0) {
      sections.push(currentSection);
    }
    
    return sections.length > 0 ? sections : [{ title: 'Content', content: content.split('\n') }];
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
            <span className="text-xl">←</span>
          </button>
          <div>
            <h1 className="text-2xl font-bold">{reviewer.title}</h1>
            <p className="text-sm text-gray-500">Last updated: {formatDate(reviewer.extractedDate)}</p>
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
                  {saving ? "Saving..." : "💾 Save"}
                </button>
              </>
            ) : (
              <button 
                onClick={handleEdit}
                className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors text-sm"
              >
                📝 Edit file
              </button>
            )
          ) : (
            <button 
              onClick={handleReEnhance}
              className="px-4 py-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors text-sm"
              disabled={reEnhancing}
            >
              {reEnhancing ? "Re-enhancing..." : "✨ Re-enhance"}
            </button>
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
            onClick={() => {
              setActiveView("enhanced");
              setIsEditing(false);
            }}
          >
            Enhanced
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex gap-6 overflow-hidden mb-6">
        {/* Left Sidebar - Table of Contents */}
        <div className="w-64 flex flex-col gap-3">
          <div className="rounded-lg p-4 overflow-y-auto flex-1">
            <h2 className="font-semibold mb-4 text-sm text-gray-600">TABLE OF CONTENTS</h2>
            <div className="flex flex-col gap-1">
              {sections.map((section, index) => (
                <button
                  key={index}
                  onClick={() => scrollToSection(index)}
                  className={`text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    activeSection === index
                      ? "bg-blue-100 text-blue-600 font-medium"
                      : "text-gray-700 hover:bg-white/50"
                  }`}
                >
                  {section.title}
                </button>
              ))}
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col gap-2">
            <button className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm">
              Generate Quiz
            </button>
            <button 
              onClick={() => setShowDeleteModal(true)}
              className="w-full px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors text-sm"
            >
              Delete Reviewer
            </button>
          </div>
        </div>

        {/* Right Content Area - Display all sections */}
        <div className="flex-1 bg-white rounded-lg shadow-sm p-8 overflow-y-auto">
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
                <h2 className="text-2xl font-bold mb-6">{section.title}</h2>
                <div className="prose max-w-none">
                  {section.content.map((line, idx) => (
                    <p key={idx} className="mb-4 text-gray-700 leading-relaxed">
                      {line}
                    </p>
                  ))}
                </div>
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
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReviewerDetailPage;
