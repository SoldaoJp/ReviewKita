// src/components/reviewer/ReviewerPage.js
import { useState, useEffect } from "react";
import Topbar from "../components/sidebar/Topbar";
import { getAllReviewers, createReviewer, deleteReviewer } from "../../services/reviewerService";
import { getAvailableLlmModelsReviewer } from "../../services/llmConfigService";
import { createQuiz } from "../../services/quizService";
import { useNavigate } from "react-router-dom";
import { useReviewerContext } from "../../controllers/context/ReviewerContext";
import QuizGenerationModal from "../components/reviewer/QuizGenerationModal";

// Color palette for reviewer cards
const colors = [
  { bg: "bg-blue-200", border: "border-blue-400" },
  { bg: "bg-pink-200", border: "border-pink-400" },
  { bg: "bg-purple-200", border: "border-purple-400" },
  { bg: "bg-green-200", border: "border-green-400" },
  { bg: "bg-orange-200", border: "border-orange-400" },
  { bg: "bg-red-200", border: "border-red-400" },
  { bg: "bg-yellow-200", border: "border-yellow-400" },
  { bg: "bg-indigo-200", border: "border-indigo-400" },
];

// Subject categories and their subjects
const SUBJECT_CATEGORIES = {
  "elementary_jhs": {
    label: "📚 Elementary & Junior High School (K–10)",
    subjects: [
      "English", "Filipino", "Mathematics", "Science", "Araling Panlipunan (Social Studies)",
      "Edukasyon sa Pagpapakatao (Values Education)", "MAPEH (Music, Arts, PE, and Health)",
      "TLE (Technology and Livelihood Education)", "Computer Education", "Reading and Writing",
      "Mother Tongue (MTB-MLE)", "Civics", "Penmanship / Handwriting", "Spelling", "Grammar and Composition"
    ]
  },
  "shs_core": {
    label: "🎓 Senior High School Core Subjects (Grades 11–12)",
    subjects: [
      "Oral Communication", "Reading and Writing Skills", "21st Century Literature from the Philippines and the World",
      "Komunikasyon at Pananaliksik sa Wika at Kulturang Pilipino", "Pagbasa at Pagsusuri ng Iba't Ibang Teksto Tungo sa Pananaliksik",
      "Media and Information Literacy", "General Mathematics", "Statistics and Probability", "Earth and Life Science",
      "Physical Science", "Understanding Culture, Society, and Politics", "Contemporary Philippine Arts from the Regions",
      "Physical Education and Health", "Personal Development", "Empowerment Technologies (E-Tech)"
    ]
  },
  "shs_specialized": {
    label: "💼 Senior High School Applied & Specialized Subjects",
    subjects: [
      "Research in Daily Life 1", "Research in Daily Life 2", "Inquiries, Investigations, and Immersion",
      "Entrepreneurship", "Creative Writing", "Fundamentals of Accountancy, Business, and Management 1",
      "Fundamentals of Accountancy, Business, and Management 2", "Business Math", "Organization and Management",
      "Principles of Marketing", "Animation / ICT", "Programming (Java, Python, C++)", "Electrical Installation and Maintenance",
      "Home Economics", "Bread and Pastry Production", "Tourism and Hospitality Management", "Agri-Fishery Arts",
      "Shielded Metal Arc Welding (SMAW)", "Automotive Servicing", "Cookery"
    ]
  },
  "college": {
    label: "🎓 College General Education & Major Subjects",
    courses: {
      "General Education": [
        "Purposive Communication", "The Contemporary World", "Science, Technology, and Society", "Readings in Philippine History",
        "Art Appreciation", "Ethics", "Mathematics in the Modern World", "Understanding the Self", "Philippine Politics and Governance",
        "Environmental Science", "Life and Works of Rizal", "Physical Education 1 – Fitness and Wellness",
        "Physical Education 2 – Rhythmic Activities", "Physical Education 3 – Individual/Dual Sports", "Physical Education 4 – Team Sports",
        "NSTP 1 (Civic Welfare Training Service / ROTC / LTS)", "NSTP 2 (Civic Welfare Training Service / ROTC / LTS)",
        "Filipino sa Iba't Ibang Disiplina", "World Religions and Belief Systems", "Gender and Society"
      ],
      "Computer Science / Information Technology": [
        "Computer Programming 1 (Introduction to Programming)", "Computer Programming 2 (Intermediate Programming)",
        "Data Structures and Algorithms", "Object-Oriented Programming", "Database Management Systems", "Web Development",
        "Mobile Application Development", "Systems Analysis and Design", "Information Security and Assurance", "Software Engineering",
        "Operating Systems", "Computer Networks", "Human-Computer Interaction (HCI)", "Artificial Intelligence", "Machine Learning",
        "Cloud Computing", "Data Analytics / Data Science", "Internet of Things (IoT)", "Capstone Project 1", "Capstone Project 2",
        "Discrete Mathematics", "Linear Algebra", "Computer Architecture and Organization", "Theory of Computation", "Compiler Design",
        "Digital Logic Design", "Cybersecurity Fundamentals", "DevOps / Systems Administration", "Game Development / Game Design",
        "UI/UX Design", "Blockchain Fundamentals", "Robotics and Automation", "Technopreneurship", "Project Management",
        "Business Process Management", "IT Laws and Professional Ethics", "E-Commerce Systems", "Management Information Systems (MIS)",
        "Quality Assurance and Software Testing", "IT Research Methods", "IT Elective / Emerging Technologies"
      ],
      "Business, Accountancy & Management": [
        "Principles of Management", "Business Mathematics", "Principles of Marketing", "Financial Accounting", "Managerial Accounting",
        "Business Law and Taxation", "Entrepreneurship", "Business Ethics and Social Responsibility", "Human Resource Management",
        "Business Communication", "Strategic Management", "Financial Management", "Microeconomics", "Macroeconomics", "E-Commerce",
        "Business Research", "Operations Management", "Business Statistics"
      ],
      "Nursing / Medical Allied Courses": [
        "Anatomy and Physiology", "Microbiology and Parasitology", "Biochemistry", "Fundamentals of Nursing", "Nursing Pharmacology",
        "Health Assessment", "Community Health Nursing", "Medical-Surgical Nursing", "Maternal and Child Nursing", "Mental Health Nursing",
        "Nursing Informatics", "Pathophysiology", "Nursing Research 1", "Nursing Research 2", "Leadership and Management in Nursing",
        "Nutrition and Diet Therapy", "Pharmacotherapeutics", "Professional Adjustment and Ethics", "Clinical Practicum / RLE (Related Learning Experience)"
      ],
      "Engineering": [
        "Engineering Drawing", "Engineering Mechanics", "Differential Equations", "Engineering Mathematics", "Thermodynamics",
        "Fluid Mechanics", "Strength of Materials", "Electrical Circuits", "Electronics 1 & 2", "Computer-Aided Design (CAD)",
        "Project Management for Engineers", "Engineering Economy", "Instrumentation and Control", "Power Systems", "Civil Engineering Design",
        "Structural Analysis", "Programming for Engineers", "Engineering Ethics", "Feasibility Study", "Practicum / OJT"
      ],
      "Education": [
        "Facilitating Learner-Centered Teaching", "Assessment in Learning", "The Teaching Profession", "Curriculum Development",
        "Child and Adolescent Development", "Educational Technology", "Principles of Teaching 1 & 2", "Foundations of Education",
        "Field Study 1–6", "Practice Teaching / Internship", "Teaching Strategies and Methods", "Classroom Management",
        "Research in Education", "Inclusive Education"
      ],
      "Criminology": [
        "Introduction to Criminology", "Criminal Law 1 & 2", "Criminal Investigation", "Forensic Science", "Police Organization and Administration",
        "Ethics and Values in Law Enforcement", "Sociology of Crimes and Delinquency", "Criminalistics", "Correctional Administration",
        "Human Behavior and Crisis Management", "Police Patrol Operations", "Firearms and Marksmanship", "Juvenile Delinquency and the Juvenile Justice System"
      ],
      "Mass Communication / Journalism": [
        "Introduction to Communication", "News Writing and Reporting", "Photojournalism", "Broadcasting Principles", "Media Law and Ethics",
        "Public Relations", "Digital Media Production", "Communication Research", "Scriptwriting for Radio and TV", "Editing and Layout Design",
        "Speech Communication", "Advertising Principles"
      ],
      "Political Science / Public Administration": [
        "Introduction to Political Science", "Philippine Government and Constitution", "Comparative Politics", "International Relations",
        "Political Theories", "Public Policy and Governance", "Local Government Administration", "Public Fiscal Administration",
        "Research in Political Science"
      ],
      "Fine Arts / Multimedia Arts": [
        "Visual Communication", "2D Animation", "3D Modeling and Rendering", "Graphic Design", "Motion Graphics", "Digital Photography",
        "Art History", "Illustration Techniques", "Typography and Layout", "Portfolio Development"
      ]
    }
  }
};

function ReviewerPage({ title }) {
  const navigate = useNavigate();
  const { triggerReviewerUpdate } = useReviewerContext();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showLearnModal, setShowLearnModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [showRetakeModal, setShowRetakeModal] = useState(false);
  const [selectedReviewer, setSelectedReviewer] = useState(null);
  const [reviewers, setReviewers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Form state for adding new reviewer
  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    description: "",
    file: null,
  });
  const [subjectCategory, setSubjectCategory] = useState("");
  const [subjectSearch, setSubjectSearch] = useState("");
  const [showCustomSubject, setShowCustomSubject] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [llmModels, setLlmModels] = useState([]);
  const [modelsLoading, setModelsLoading] = useState(false);
  const [selectedModelId, setSelectedModelId] = useState("");
  const [notification, setNotification] = useState(null); // { type: 'success' | 'error' | 'loading', message: string }
  const [sortOrder, setSortOrder] = useState(""); // Sort order state

  // Auto-hide notification after 5 seconds (except for loading)
  useEffect(() => {
    if (notification && notification.type !== 'loading') {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const showNotification = (type, message) => {
    setNotification({ type, message });
  };

  // Fetch reviewers on component mount
  useEffect(() => {
    fetchReviewers();
  }, [sortOrder]); // Re-fetch when sort order changes

  // Load available LLM models when the Add modal is opened
  useEffect(() => {
    const loadModels = async () => {
      if (!showAddModal) return;
      try {
        setModelsLoading(true);
        const res = await getAvailableLlmModelsReviewer();
        const models = Array.isArray(res?.models) ? res.models : [];
        setLlmModels(models);
        setSelectedModelId(models[0]?.id || "");
      } catch (err) {
        console.error("Error loading LLM models:", err);
        setLlmModels([]);
      } finally {
        setModelsLoading(false);
      }
    };
    loadModels();
  }, [showAddModal]);

  const fetchReviewers = async () => {
    try {
      setLoading(true);
      const response = await getAllReviewers(100, null, sortOrder || null);
      if (response.success) {
        setReviewers(response.data);
      }
      setError(null);
    } catch (err) {
      console.error("Error fetching reviewers:", err);
      setError("Failed to load reviewers. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (reviewer) => {
    setSelectedReviewer(reviewer);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteReviewer(selectedReviewer._id);
      setReviewers((prev) => prev.filter((r) => r._id !== selectedReviewer._id));
      triggerReviewerUpdate(); // Notify sidebar to refresh
      setShowDeleteModal(false);
      setSelectedReviewer(null);
    } catch (err) {
      console.error("Error deleting reviewer:", err);
      alert("Failed to delete reviewer. Please try again.");
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setSelectedReviewer(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, file: e.target.files[0] }));
  };

  const handleAddReviewer = async () => {
    if (!formData.title || !formData.subject || !formData.description || !formData.file) {
      showNotification('error', 'Please fill in all fields and select a file.');
      return;
    }

    if (!selectedModelId) {
      showNotification('error', 'Please select an AI model.');
      return;
    }

    try {
      setSubmitting(true);
      showNotification('loading', 'Creating reviewer...');
      
      const data = new FormData();
      data.append("title", formData.title);
      data.append("subject", formData.subject);
      data.append("description", formData.description);
      data.append("file", formData.file);
      data.append("model_id", selectedModelId);

      const response = await createReviewer(data);
      if (response.success) {
        showNotification('success', 'Reviewer added successfully!');
        setShowAddModal(false);
        setFormData({ title: "", subject: "", description: "", file: null });
        setSubjectCategory("");
        setSubjectSearch("");
        setShowCustomSubject(false);
        setSelectedModelId("");
        fetchReviewers(); // Refresh the list
        triggerReviewerUpdate(); // Notify sidebar to refresh
      }
    } catch (err) {
      console.error("Error creating reviewer:", err);
      showNotification('error', err.response?.data?.message || 'Failed to create reviewer. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenReviewer = (reviewerId) => {
    navigate(`/reviewer/${reviewerId}`);
  };

  const handleGenerateQuizClick = (reviewer) => {
    setSelectedReviewer(reviewer);
    if (reviewer.hasQuiz) {
      // If quiz exists, show modal to confirm retake
      setShowRetakeModal(true);
    } else {
      // If no quiz, show generation modal
      setShowQuizModal(true);
    }
  };

  const handleRetakeQuiz = async () => {
    if (!selectedReviewer) return;
    
    try {
      setShowRetakeModal(false);
      showNotification('loading', 'Generating retake quiz...');
      
      // Generate a new quiz (retake) with default settings
      const quizData = {
        reviewerId: selectedReviewer._id,
        numberOfQuestions: 10, // Default number of questions for retake
        questionTypes: ['multiple-choice'] // Default question type
      };
      
      const response = await createQuiz(quizData);
      console.log('Retake quiz created successfully:', response);
      showNotification('success', 'Retake quiz generated successfully! Redirecting...');
      
      // Navigate to quiz page after a brief delay
      setTimeout(() => {
        navigate(`/quiz/${selectedReviewer._id}`);
      }, 1500);
    } catch (error) {
      console.error('Error generating retake quiz:', error);
      
      let errorMessage = 'Failed to generate retake quiz. Please try again.';
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        errorMessage = error.response.data.errors.map(e => e.msg).join(', ');
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      showNotification('error', errorMessage);
      setSelectedReviewer(null);
    }
  };

  const handleGenerateQuiz = async (quizData) => {
    try {
      showNotification('loading', 'Generating quiz...');
      const response = await createQuiz(quizData);
      console.log('Quiz created successfully:', response);
      showNotification('success', 'Quiz generated successfully! Redirecting...');
      setShowQuizModal(false);
      
      // Navigate to quiz page after a brief delay
      setTimeout(() => {
        navigate(`/quiz/${selectedReviewer._id}`);
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
      setSelectedReviewer(null);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
  };

  const getColorForIndex = (index) => {
    return colors[index % colors.length];
  };

  return (
    <div className="p-8">
      {/* Topbar */}
      <Topbar />

      {/* Reviewer Cards */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">My Reviewers</h2>
        <div className="flex gap-2 items-center">
          {/* Sort Dropdown */}
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg bg-white hover:border-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value="">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="a->z">A → Z</option>
            <option value="z->a">Z → A</option>
          </select>
          
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            + Add
          </button>
          <button
            onClick={() => setShowLearnModal(true)}
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
          >
            Learn
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <p className="text-gray-500">Loading reviewers...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-12">
          <p className="text-red-500">{error}</p>
          <button 
            onClick={fetchReviewers}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && reviewers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No reviewers yet. Create your first one!</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            + Add Reviewer
          </button>
        </div>
      )}

      {/* Reviewer Grid */}
      {!loading && !error && reviewers.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {reviewers.map((reviewer, idx) => {
            const colorScheme = getColorForIndex(idx);
            return (
              <div 
                key={reviewer._id} 
                className="bg-white/50 rounded-2xl p-4 shadow-sm border border-[#eef3fb] relative cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleOpenReviewer(reviewer._id)}
              >
                <div
                  className={`absolute top-0 left-0 h-2 w-full ${colorScheme.border} bg-opacity-80 rounded-t-lg`}
                />
                <div className="mt-4">
                  <h3 className="text-lg font-semibold">{reviewer.title}</h3>
                  <p className="text-sm text-gray-500">{reviewer.description}</p>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleGenerateQuizClick(reviewer);
                    }}
                    className="px-3 py-1 bg-cyan-500 text-white text-sm rounded hover:bg-cyan-600"
                  >
                    {reviewer.hasQuiz ? "Retake Quiz" : "Generate Quiz"}
                  </button>
                  <span className="text-xs text-gray-400">{formatDate(reviewer.extractedDate)}</span>
                </div>

                {/* Delete Icon */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteClick(reviewer);
                  }}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  title="Delete Reviewer"
                >
                  🗑
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Reviewer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[500px] max-h-[85vh] overflow-y-auto relative">
            <h2 className="text-lg font-bold mb-4">Add Reviewer</h2>

            <label className="block mb-2 text-sm font-medium">Subject Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g. Mathematics"
              className="w-full px-3 py-2 border rounded mb-4 focus:ring-2 focus:ring-cyan-400"
            />

            {/* Subject Selection */}
            <label className="block mb-2 text-sm font-medium flex items-center gap-2">
              Subject
              <span 
                className="text-blue-500 cursor-help" 
                title="We use this subject field to categorize your quiz subject type and for our analytics to improve our app and ensure it meets its goals."
              >
                ℹ️
              </span>
            </label>
            
            <select
              value={subjectCategory}
              onChange={(e) => {
                setSubjectCategory(e.target.value);
                setFormData({ ...formData, subject: "" });
                setShowCustomSubject(false);
                setSubjectSearch("");
              }}
              className="w-full px-3 py-2 border rounded mb-3 focus:ring-2 focus:ring-cyan-400"
            >
              <option value="">Select category...</option>
              {Object.entries(SUBJECT_CATEGORIES).map(([key, category]) => (
                <option key={key} value={key}>{category.label}</option>
              ))}
            </select>

            {subjectCategory && (
              <>
                {/* Subject Dropdown with search functionality */}
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="🔍 Search subjects..."
                    value={subjectSearch}
                    onChange={(e) => setSubjectSearch(e.target.value)}
                    className="w-full px-3 py-2 border rounded-t focus:ring-2 focus:ring-cyan-400 text-sm"
                  />
                  
                  <select
                    value={showCustomSubject ? "custom" : formData.subject}
                    onChange={(e) => {
                      if (e.target.value === "custom") {
                        setShowCustomSubject(true);
                        setFormData({ ...formData, subject: "" });
                      } else {
                        setShowCustomSubject(false);
                        setFormData({ ...formData, subject: e.target.value });
                      }
                    }}
                    className="w-full px-3 py-2 border border-t-0 rounded-b focus:ring-2 focus:ring-cyan-400"
                    size="8"
                  >
                    <option value="">Select a subject...</option>
                    
                    {/* Render subjects based on category */}
                    {subjectCategory === 'college' ? (
                      // For college: group by course
                      Object.entries(SUBJECT_CATEGORIES[subjectCategory].courses).map(([course, subjects]) => {
                        const filteredSubjects = subjects.filter(subject => 
                          subjectSearch === '' || 
                          subject.toLowerCase().includes(subjectSearch.toLowerCase()) ||
                          course.toLowerCase().includes(subjectSearch.toLowerCase())
                        );
                        
                        return filteredSubjects.length > 0 ? (
                          <optgroup key={course} label={`${course}`}>
                            {filteredSubjects.map((subject, idx) => (
                              <option key={`${course}-${idx}`} value={subject}>
                                {subject}
                              </option>
                            ))}
                          </optgroup>
                        ) : null;
                      })
                    ) : (
                      // For other categories: simple list
                      SUBJECT_CATEGORIES[subjectCategory].subjects
                        .filter(subject => 
                          subjectSearch === '' || 
                          subject.toLowerCase().includes(subjectSearch.toLowerCase())
                        )
                        .map((subject, idx) => (
                          <option key={idx} value={subject}>{subject}</option>
                        ))
                    )}
                    
                    {/* Custom subject option */}
                    {subjectSearch === '' && (
                      <>
                        <option disabled>─────────────────────</option>
                        <option value="custom">✏️ Specify Unlisted Subject</option>
                      </>
                    )}
                  </select>
                </div>

                {/* Custom Subject Input */}
                {showCustomSubject && (
                  <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Custom Subject Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter the specific subject name"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-cyan-400"
                      autoFocus
                    />
                    <p className="text-xs text-gray-600 mt-1">
                      Please enter the exact name of your subject if not listed above
                    </p>
                  </div>
                )}
              </>
            )}

            <label className="block mb-2 text-sm font-medium">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="add description here...."
              className="w-full px-3 py-2 border rounded mb-4 focus:ring-2 focus:ring-cyan-400"
              rows="3"
            />

            <label className="block mb-2 text-sm font-medium">AI Model</label>
            {modelsLoading ? (
              <div className="w-full px-3 py-2 border rounded mb-4 text-gray-500 text-sm">
                Loading models...
              </div>
            ) : llmModels.length === 0 ? (
              <div className="w-full px-3 py-2 border rounded mb-4 text-red-500 text-sm">
                No models available
              </div>
            ) : (
              <select
                value={selectedModelId}
                onChange={(e) => setSelectedModelId(e.target.value)}
                className="w-full px-3 py-2 border rounded mb-4 focus:ring-2 focus:ring-cyan-400"
              >
                <option value="">Select an AI model</option>
                {llmModels.map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.model_name} - {model.provider}
                  </option>
                ))}
              </select>
            )}

            <label className="block mb-2 text-sm font-medium">Import File (PDF, DOC, DOCX, TXT)</label>
            <div className="w-full border border-dashed border-gray-300 rounded p-4 mb-4 text-center">
              <input 
                type="file" 
                className="hidden" 
                id="file-upload"
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleFileChange}
              />
              <label htmlFor="file-upload" className="cursor-pointer text-blue-500">
                {formData.file ? formData.file.name : "Choose file or drag & drop"}
              </label>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setFormData({ title: "", subject: "", description: "", file: null });
                  setSubjectCategory("");
                  setSubjectSearch("");
                  setShowCustomSubject(false);
                  setSelectedModelId("");
                }}
                className="px-4 py-2 border rounded hover:bg-gray-100"
                disabled={submitting}
              >
                Cancel
              </button>
              <button 
                onClick={handleAddReviewer}
                className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 disabled:bg-gray-400"
                disabled={submitting}
              >
                {submitting ? "Adding..." : "Add"}
              </button>
            </div>

            <button
              onClick={() => {
                setShowAddModal(false);
                setFormData({ title: "", subject: "", description: "", file: null });
                setSubjectCategory("");
                setSubjectSearch("");
                setShowCustomSubject(false);
                setSelectedModelId("");
              }}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-lg"
              disabled={submitting}
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Learn Modal (Scrollable) */}
      {showLearnModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl shadow-lg p-6 w-[500px] relative max-h-[80vh] flex flex-col">
            <h2 className="text-lg font-bold mb-4">Learn</h2>

            {/* Scrollable content */}
            <div className="flex flex-col gap-3 overflow-y-auto pr-2" style={{ maxHeight: "60vh" }}>
              {reviewers.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No reviewers available</p>
              ) : (
                reviewers.map((reviewer, idx) => {
                  const colorScheme = getColorForIndex(idx);
                  return (
                    <div
                      key={reviewer._id}
                      className={`flex justify-between items-center px-4 py-3 border ${colorScheme.border} ${colorScheme.bg} rounded-lg`}
                    >
                      <span className="font-medium text-gray-800">{reviewer.title}</span>
                      <button 
                        onClick={() => handleOpenReviewer(reviewer._id)}
                        className="px-4 py-1 bg-black text-white text-sm rounded-lg hover:bg-gray-800"
                      >
                        Open
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            {/* Close button */}
            <button
              onClick={() => setShowLearnModal(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-lg"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedReviewer && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-[380px] px-6 py-5 relative">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Delete reviewer
            </h2>
            <p className="text-gray-600 text-sm mb-1">
              Are you sure you want to delete this reviewer?
            </p>
            <p className="text-gray-700 text-sm mb-6">
              <span className="font-medium">{selectedReviewer.title}</span>
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-800 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
              >
                Delete
              </button>
            </div>

            <button
              onClick={handleCancelDelete}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-lg"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Notification Popups */}
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

      {/* Loading Notification */}
      {notification && notification.type === 'loading' && (
        <div className="fixed top-4 right-4 z-[60] animate-slide-in">
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
          setSelectedReviewer(null);
        }}
        onGenerate={handleGenerateQuiz}
        reviewerId={selectedReviewer?._id}
      />

      {/* Retake Quiz Confirmation Modal */}
      {showRetakeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
            <h3 className="text-lg font-semibold mb-3">Retake Quiz</h3>
            <p className="text-gray-600 text-sm mb-6">
              Are you sure you want to generate a new quiz for this reviewer? This will create a new attempt.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowRetakeModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleRetakeQuiz}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Generate Retake
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReviewerPage;
