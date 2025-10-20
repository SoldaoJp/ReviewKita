import httpService from '../../user/services/httpService';

export const fetchLLMReports = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.model_name) params.append('model_name', filters.model_name);
    if (filters.email) params.append('email', filters.email);
    if (filters.sort) params.append('sort', filters.sort);
    
    const queryString = params.toString();
    const url = `/admin/llm/reports${queryString ? `?${queryString}` : ''}`;
    
    const response = await httpService.get(url);
    return response.reports || [];
  } catch (error) {
    console.error('Error fetching LLM reports:', error);
    throw error;
  }
};

export const getStaticReports = () => [
  {
    id: "RPT-001",
    username: "alice",
    user_email: "alice@example.com",
    llm_name: "openai/gpt-oss-20b:free",
    llm_provider: "openrouter",
    type: "hallucination",
    description: "Incorrect facts in section 2",
    reviewer: {
      title: "Cell Biology – Photosynthesis",
      original: "The process occurs in mitochondria...",
      enhanced:
        "The process occurs in chloroplasts where sunlight converts CO2...",
    },
    created_at: "2025-10-17T09:00:00.000Z",
  },
  {
    id: "RPT-002",
    username: "bob",
    user_email: "bob@example.com",
    llm_name: "anthropic/claude-3-opus",
    llm_provider: "anthropic",
    type: "bias",
    description: "Slight gender bias in example selection.",
    reviewer: {
      title: "Ethics in AI Writing",
      original: "Example favored one demographic group...",
      enhanced:
        "Example rewritten to ensure neutral tone and balance.",
    },
    created_at: "2025-10-18T11:30:00.000Z",
  },
  {
    id: "RPT-003",
    username: "will",
    user_email: "will@example.com",
    llm_name: "google/gemini-1.5-pro",
    llm_provider: "google",
    type: "incomplete",
    description: "Answer stops mid-sentence during explanation.",
    reviewer: {
      title: "Quantum Mechanics – Wave Functions",
      original: "The wave function describes...",
      enhanced:
        "The wave function describes the probability amplitude of a particle...",
    },
    created_at: "2025-10-19T15:00:00.000Z",
  },
];
