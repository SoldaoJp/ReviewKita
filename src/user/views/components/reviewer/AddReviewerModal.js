import { useState, useEffect } from "react";
import { getAvailableLlmModelsReviewer } from "../../../services/llmConfigService";
import { createReviewer } from "../../../services/reviewerService";

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
    label: "🧰 Senior High School Applied & Specialized Subjects",
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

export default function AddReviewerModal({
  isOpen,
  onClose,
  onSuccess,
  showNotification,
}) {
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

  useEffect(() => {
    const loadModels = async () => {
      if (!isOpen) return;
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
  }, [isOpen]);

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
        handleClose();
        onSuccess?.();
      }
    } catch (err) {
      console.error("Error creating reviewer:", err);
      showNotification('error', err.response?.data?.message || 'Failed to create reviewer. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({ title: "", subject: "", description: "", file: null });
    setSubjectCategory("");
    setSubjectSearch("");
    setShowCustomSubject(false);
    setSelectedModelId("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-[500px] max-h-[85vh] relative flex flex-col">
        {/* Fixed Header */}
        <div className="flex-shrink-0 p-6 border-b flex justify-between items-center">
          <h2 className="text-lg font-bold">Add Reviewer</h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 text-lg"
            disabled={submitting}
          >
            ×
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6">

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
        
        {!formData.subject && (
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
        )}

        {formData.subject && !showCustomSubject && (
          <div className="mb-4 p-3 bg-cyan-50 border border-cyan-200 rounded flex items-center justify-between">
            <p className="text-sm text-gray-700">
              <span className="font-medium">Selected Subject:</span> {formData.subject}
            </p>
            <button
              onClick={() => {
                setFormData({ ...formData, subject: "" });
                setSubjectCategory("");
                setSubjectSearch("");
                setShowCustomSubject(false);
              }}
              className="ml-2 text-gray-500 hover:text-gray-700 font-bold text-lg"
              title="Clear selection"
            >
              ×
            </button>
          </div>
        )}

        {subjectCategory && !formData.subject && (
          <>
            <div className="mb-4">
              <input
                type="text"
                placeholder="🔍 Search subjects..."
                value={subjectSearch}
                onChange={(e) => setSubjectSearch(e.target.value)}
                className="w-full px-3 py-2 border rounded-t focus:ring-2 focus:ring-cyan-400 text-sm"
              />
              
              {/* Custom scrollable subject list */}
              <div className="w-full border border-t-0 rounded-b bg-white max-h-64 overflow-y-auto">
                {/* Render subjects based on category */}
                {subjectCategory === 'college' ? (
                  Object.entries(SUBJECT_CATEGORIES[subjectCategory].courses).map(([course, subjects]) => {
                    const filteredSubjects = subjects.filter(subject => 
                      subjectSearch === '' || 
                      subject.toLowerCase().includes(subjectSearch.toLowerCase()) ||
                      course.toLowerCase().includes(subjectSearch.toLowerCase())
                    );
                    
                    return filteredSubjects.length > 0 ? (
                      <div key={course}>
                        <div className="sticky top-0 px-3 py-2 bg-gray-100 border-b text-sm font-semibold text-gray-700">
                          {course}
                        </div>
                        {filteredSubjects.map((subject, idx) => (
                          <div
                            key={`${course}-${idx}`}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setShowCustomSubject(false);
                              setFormData({ ...formData, subject: subject });
                            }}
                            className={`w-full text-left px-3 py-2 hover:bg-cyan-100 active:bg-cyan-200 transition-colors text-sm cursor-pointer ${
                              formData.subject === subject ? 'bg-cyan-200 font-semibold' : ''
                            }`}
                          >
                            {subject}
                          </div>
                        ))}
                      </div>
                    ) : null;
                  })
                ) : (
                  SUBJECT_CATEGORIES[subjectCategory].subjects
                    .filter(subject => 
                      subjectSearch === '' || 
                      subject.toLowerCase().includes(subjectSearch.toLowerCase())
                    )
                    .map((subject, idx) => (
                      <div
                        key={idx}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setShowCustomSubject(false);
                          setFormData({ ...formData, subject: subject });
                        }}
                        className={`w-full text-left px-3 py-2 hover:bg-cyan-100 active:bg-cyan-200 transition-colors text-sm cursor-pointer ${
                          formData.subject === subject ? 'bg-cyan-200 font-semibold' : ''
                        }`}
                      >
                        {subject}
                      </div>
                    ))
                )}
                
                {/* Custom subject option */}
                {subjectSearch === '' && (
                  <>
                    <div className="border-t px-3 py-2 text-gray-400 text-xs">────────────────────</div>
                    <button
                      type="button"
                      onClick={() => {
                        setShowCustomSubject(true);
                        setFormData({ ...formData, subject: "" });
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-blue-100 active:bg-blue-200 transition-colors text-sm font-medium text-blue-600"
                    >
                      ✏️ Specify Unlisted Subject
                    </button>
                  </>
                )}
              </div>
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
        </div>

        {/* Fixed Footer */}
        <div className="flex-shrink-0 p-6 border-t flex justify-end gap-2">
          <button
            onClick={handleClose}
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
      </div>
    </div>
  );
}
