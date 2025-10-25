import { useEffect, useRef, useState } from 'react';
import AdminLayout from './Layout';
import {
  adminGetLlmConfigs,
  adminCreateLlmConfig,
  adminUpdateLlmConfig,
  adminDeleteLlmConfig,
} from '../controllers/adminController';

const defaultApiConfig = { temperature: 0.3, max_tokens: 2000, top_p: 1 };

const SYSTEM_PROMPTS = {
  reviewer: `You are an expert ReviewerEnhancer.
Task: Analyze the provided document and produce a concise, structured enhancement grouped by TOPICS. 
Output format requirements (strict):
- Partition the output into groups by related topics/themes.
- Each group MUST start with a single header line exactly in this form:
  [SECTION: <SECTION_KEY>]
  where <SECTION_KEY> is an UPPER_SNAKE_CASE identifier (e.g., CORE_CONCEPTS, METHODS, FINDINGS, LIMITATIONS, NEXT_STEPS).
- Follow each header with clear, concise bullet points ("- ") summarizing the most important points for that topic.
- Optionally include 1–2 short lines labeled "Summary:" at the end of the group if helpful.
- End each group with a line: [END_SECTION]
- Do not include any other markup, code fences, or prose outside these sections.
- If a point contains subpoints, keep them brief using indented dashes ("  - ").
- Avoid filler text. Preserve original meaning while improving clarity.

If no clear grouping emerges, use a single section with key: GENERAL_SUMMARY.
Your goal: deliver focused, high-value takeaways grouped into regex-friendly sections as specified.`,
  quiz: `You are an expert quiz generator.
Analyze the provided content and generate a comprehensive quiz.

Return ONLY a valid JSON object in this exact structure:
{
  "quiz": {
    "title": "Quiz Title Based on Content",
    "description": "Brief description of what this quiz covers",
    "questions": [
      {
        "id": 1,
        "question": "...",
        "type": "multiple-choice|identification|open-ended|fill-in-the-blanks",
        "difficulty": "easy|medium|hard",
        "options": {"A":"...","B":"...","C":"...","D":"..."},
        "correct_answer": "A|B|C|D",
        "identification_answer": "...",
        "blank_answers": ["...","..."],
        "subject_type": "...",
        "scenario": "...",
        "explanation": "... or empty for open-ended"
      }
    ]
  }
}

You must:
    + Default to multiple-choice questions with 4 options (A, B, C, D) if not specified.
    + For multiple-choice: include options A, B, C, D and set "correct_answer" to one of A/B/C/D.
    + For identification: no options; include "identification_answer".
    + For open-ended: no options; require a conceptual response; set "explanation" to empty string initially.
    + For fill-in-the-blanks: question text should include blanks (e.g., "___"); add ordered array "blank_answers".
    + Include an optional "subject_type" and an "explanation" per question (but for open-ended, leave it empty initially).
Generate questions based on the content length and complexity. Return ONLY the JSON, no additional text.`
};

export default function AdminLlmConfigsView() {
  const [configs, setConfigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [configToDelete, setConfigToDelete] = useState(null);
  const [form, setForm] = useState({
    model_name: '',
    system_prompt: '',
    is_active: true,
    use_case: 'reviewer',
    provider: 'openrouter',
    api_config: defaultApiConfig,
  });

  const promptTextAreaRef = useRef(null);
  const lineNumberRef = useRef(null);
  const lineNumberInnerRef = useRef(null);

  const lineCount = Math.max(1, (form.system_prompt.match(/\n/g) || []).length + 1);
  const lineHeight = 24;

  const loadConfigs = async () => {
    try {
      setLoading(true);
      const res = await adminGetLlmConfigs();
      setConfigs(res.configs || []);
      setError('');
    } catch (e) {
      setError(e.message || 'Failed to load LLM configs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConfigs();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ model_name: '', system_prompt: SYSTEM_PROMPTS.reviewer, is_active: true, use_case: 'reviewer', provider: 'openrouter', api_config: defaultApiConfig });
    setShowModal(true);
  };

  const openEdit = (cfg) => {
    setEditing(cfg);
    setForm({
      model_name: cfg.model_name,
      system_prompt: cfg.system_prompt || '',
      is_active: !!cfg.is_active,
      use_case: cfg.use_case,
      provider: cfg.provider,
      api_config: cfg.api_config || defaultApiConfig,
    });
    setShowModal(true);
  };

  const saveConfig = async () => {
    try {
      if (editing) {
        await adminUpdateLlmConfig(editing._id, {
          system_prompt: form.system_prompt,
          is_active: form.is_active,
          api_config: form.api_config,
        });
      } else {
        await adminCreateLlmConfig(form);
      }
      setShowModal(false);
      await loadConfigs();
    } catch (e) {
      alert(e.message || 'Failed to save config');
    }
  };

  const deleteConfig = async () => {
    if (!configToDelete) return;
    try {
      await adminDeleteLlmConfig(configToDelete._id);
      setShowDeleteModal(false);
      setConfigToDelete(null);
      await loadConfigs();
    } catch (e) {
      alert(e.message || 'Failed to delete config');
    }
  };

  const onDeleteClick = (cfg) => {
    setConfigToDelete(cfg);
    setShowDeleteModal(true);
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">LLM Configurations</h1>
          <button onClick={openCreate} className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800">+ New Config</button>
        </div>
        {loading && <p className="text-gray-500">Loading LLM configs...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && (
          <div className="bg-white/50 rounded-2xl shadow-sm border border-[#eef3fb] overflow-hidden">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-4 py-3 text-left">Model</th>
                  <th className="px-4 py-3 text-left">Provider</th>
                  <th className="px-4 py-3 text-left">Use Case</th>
                  <th className="px-4 py-3 text-left">Active</th>
                  <th className="px-4 py-3 text-left">Temperature</th>
                  <th className="px-4 py-3 text-left">Max Tokens</th>
                  <th className="px-4 py-3 text-left">Top P</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {configs.map((c) => (
                  <tr key={c._id} className="border-t">
                    <td className="px-4 py-3 font-medium">{c.model_name}</td>
                    <td className="px-4 py-3">{c.provider}</td>
                    <td className="px-4 py-3 capitalize">{c.use_case}</td>
                    <td className="px-4 py-3">{c.is_active ? 'Yes' : 'No'}</td>
                    <td className="px-4 py-3">{c.api_config?.temperature ?? '-'}</td>
                    <td className="px-4 py-3">{c.api_config?.max_tokens ?? '-'}</td>
                    <td className="px-4 py-3">{c.api_config?.top_p ?? '-'}</td>
                    <td className="px-4 py-3 space-x-2">
                      <button onClick={() => openEdit(c)} className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200">Edit</button>
                      <button onClick={() => onDeleteClick(c)} className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg w-[900px] max-w-[95vw] max-h-[90vh] flex flex-col relative">
              <h2 className="text-lg font-semibold mb-4 px-6 pt-6">{editing ? 'Edit Config' : 'New Config'}</h2>
              <div className="space-y-3 overflow-y-auto px-6 pb-6 flex-1">
                {!editing && (
                  <>
                    <label className="block text-sm font-medium">Model Name</label>
                    <input value={form.model_name} onChange={(e)=>setForm({...form, model_name: e.target.value})} className="w-full border rounded px-3 py-2" placeholder="provider/model:variant" />
                    <label className="block text-sm font-medium">Provider</label>
                    <input value={form.provider} onChange={(e)=>setForm({...form, provider: e.target.value})} className="w-full border rounded px-3 py-2" placeholder="openrouter" />
                    <label className="block text-sm font-medium">Use Case</label>
                    <select value={form.use_case} onChange={(e)=>{
                      const newUseCase = e.target.value;
                      setForm({...form, use_case: newUseCase, system_prompt: SYSTEM_PROMPTS[newUseCase]});
                    }} className="w-full border rounded px-3 py-2">
                      <option value="reviewer">reviewer</option>
                      <option value="quiz">quiz</option>
                    </select>
                  </>
                )}
                <label className="block text-sm font-medium">System Prompt</label>
                <div className="rounded-lg border" style={{ borderColor: '#44475a' }}>
                  <div className="grid" style={{ gridTemplateColumns: '3rem 1fr' }}>
                    <div ref={lineNumberRef} className="select-none overflow-hidden" onWheel={(e)=>{
                      if (promptTextAreaRef.current) {
                        const ta = promptTextAreaRef.current;
                        ta.scrollTop += e.deltaY;
                        if (lineNumberInnerRef.current) lineNumberInnerRef.current.style.transform = `translateY(-${ta.scrollTop}px)`;
                        e.preventDefault();
                      }
                    }} style={{ background: '#1e1f29', color: '#6272a4', maxHeight: '420px' }}>
                      <div ref={lineNumberInnerRef} className="m-0 text-right text-xs font-mono" style={{ padding: '12px 8px', lineHeight: `${lineHeight}px` }}>
                        {Array.from({ length: lineCount }, (_, i) => i + 1).map(n => (
                          <div key={n}>{n}</div>
                        ))}
                      </div>
                    </div>
                    <div className="relative" style={{ background: '#282a36' }}>
                      <textarea ref={promptTextAreaRef} value={form.system_prompt} onChange={(e)=>setForm({...form, system_prompt: e.target.value})} onScroll={(e)=>{ if (lineNumberInnerRef.current) lineNumberInnerRef.current.style.transform = `translateY(-${e.currentTarget.scrollTop}px)`; }} spellCheck={false} disabled={form.use_case === 'quiz'} className="w-full h-[420px] block font-mono text-sm resize-none disabled:opacity-50 disabled:cursor-not-allowed" style={{ background: 'transparent', color: '#f8f8f2', caretColor: '#f8f8f2', outline: 'none', border: 'none', padding: '12px 14px', lineHeight: `${lineHeight}px` }} placeholder={`You are an AI that ...`} />
                    </div>
                  </div>
                </div>
                {form.use_case === 'quiz' && (
                  <p className="text-sm text-blue-600 bg-blue-50 border border-blue-200 rounded px-3 py-2">
                    ℹ️ System prompt is automatically filled with the quiz template and cannot be modified.
                  </p>
                )}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm font-medium">Temperature</label>
                    <input type="number" step="0.01" value={form.api_config.temperature} onChange={(e)=>setForm({...form, api_config: {...form.api_config, temperature: parseFloat(e.target.value)}})} className="w-full border rounded px-3 py-2" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Max Tokens</label>
                    <input type="number" value={form.api_config.max_tokens} onChange={(e)=>setForm({...form, api_config: {...form.api_config, max_tokens: parseInt(e.target.value || '0', 10)}})} className="w-full border rounded px-3 py-2" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Top P</label>
                    <input type="number" step="0.01" value={form.api_config.top_p} onChange={(e)=>setForm({...form, api_config: {...form.api_config, top_p: parseFloat(e.target.value)}})} className="w-full border rounded px-3 py-2" />
                  </div>
                </div>
                <label className="inline-flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={form.is_active} onChange={(e)=>setForm({...form, is_active: e.target.checked})} /> Active
                </label>
              </div>
              <div className="flex justify-end gap-2 mt-6 px-6 pb-6 border-t pt-4">
                <button onClick={()=>setShowModal(false)} className="px-4 py-2 border rounded hover:bg-gray-100">Cancel</button>
                <button onClick={saveConfig} className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800">Save</button>
              </div>
              <button onClick={()=>setShowModal(false)} className="absolute top-2 right-3 text-gray-400 hover:text-gray-600 text-lg">×</button>
            </div>
          </div>
        )}

        {showDeleteModal && configToDelete && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full mx-4 relative">
              <h3 className="text-lg font-semibold mb-2">localhost:3000 says</h3>
              <p className="text-gray-700 mb-6">Delete LLM config {configToDelete.model_name}?</p>
              <div className="flex justify-end gap-3">
                <button onClick={() => { setShowDeleteModal(false); setConfigToDelete(null); }} className="px-6 py-2 border border-gray-300 rounded-lg text-gray-800 hover:bg-gray-100 transition">Cancel</button>
                <button onClick={deleteConfig} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">OK</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}



