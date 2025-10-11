// src/components/reviewer/ReviewerDetailPage.js
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getReviewerById, deleteReviewer, updateReviewer, reenhanceReviewerContent, reportReviewer } from "../../services/reviewerService";

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
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportIssue, setReportIssue] = useState("");
  const [reportDetails, setReportDetails] = useState("");

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
      // Include current model_id with originalContent for sync enhancement
      const response = await updateReviewer(id, { originalContent: editedContent, model_id: reviewer.modelId });
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
      const response = await reenhanceReviewerContent(id, { revisionNotes: '', model_id: reviewer.modelId });
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

  const handleReportSubmit = async () => {
    if (!reportIssue) {
      alert("Please select an issue type.");
      return;
    }
    if (!reportDetails.trim()) {
      alert("Please provide details about the issue.");
      return;
    }

    try {
      const reportData = {
        issueType: reportIssue,
        details: reportDetails.trim(),
        reviewerId: id,
        reviewerTitle: reviewer.title,
        reportedAt: new Date().toISOString()
      };

      const response = await reportReviewer(id, reportData);
      
      if (response.success) {
        alert("Report submitted successfully. Thank you for helping improve our content!");
        
        // Reset and close modal
        setReportIssue("");
        setReportDetails("");
        setShowReportModal(false);
      }
    } catch (error) {
      console.error("Error submitting report:", error);
      alert(error.message || "Failed to submit report. Please try again.");
    }
  };

  const handleReportCancel = () => {
    setReportIssue("");
    setReportDetails("");
    setShowReportModal(false);
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
      const parts = String(text).split(/(\*\*[^*]+\*\*)/g);
      return parts.map((part, idx) => {
        const m = part.match(/^\*\*(.+)\*\*$/);
        return m ? <strong key={idx}>{m[1]}</strong> : <span key={idx}>{part}</span>;
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
            <span className="text-xl">←</span>
          </button>
          <div>
            <h1 className="text-2xl font-bold">{reviewer.title}</h1>
            <p className="text-sm text-gray-500">Last updated: {formatDate(reviewer.extractedDate)}</p>
            {reviewer.modelName && (
              <p className="text-xs text-gray-500 mt-0.5">Generated by {reviewer.modelName}</p>
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
            <>
              <button 
                onClick={handleReEnhance}
                className="px-4 py-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors text-sm"
                disabled={reEnhancing}
              >
                {reEnhancing ? "Re-enhancing..." : "✨ Re-enhance"}
              </button>
              <button 
                onClick={() => setShowReportModal(true)}
                className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors text-sm"
              >
                🚩 Report
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
          <div className="rounded-lg p-4 flex-1">
            <h2 className="font-semibold mb-4 text-sm text-gray-600">TABLE OF CONTENTS</h2>
            <div className="flex flex-col gap-1">
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
                <div className="flex items-baseline gap-3 mb-4">
                  <h2 className="text-2xl font-bold">{section.title}</h2>
                  {section.key && (
                    <span className="text-xs uppercase bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{String(section.key).replace(/^\s*SECTION:\s*/i, '').replace(/_/g, ' ').trim()}</span>
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
              ×
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
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReviewerDetailPage;
