import React, { createContext, useContext, useState } from 'react';
import { getAllReviewers } from '../../services/reviewerService';

const SearchContext = createContext(null);

export function SearchProvider({ children }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const staticPages = [
    { type: 'page', title: 'Dashboard', path: '/dashboard', description: 'Overview and progress' },
    { type: 'page', title: 'Profile', path: '/profile', description: 'Your learner profile' },
    { type: 'page', title: 'Reviewers', path: '/reviewers', description: 'Manage your reviewers and content' },
  ];

  const pageSections = [
    { type: 'section', title: 'Streak', section: 'Streak', path: '/dashboard#streak' },
    { type: 'section', title: 'Quizzes', section: 'Quizzes', path: '/dashboard#quizzes' },
    { type: 'section', title: 'Welcome', section: 'Welcome', path: '/dashboard#welcome' },
    { type: 'section', title: 'Progress', section: 'Progress', path: '/profile#progress' },
    { type: 'section', title: 'Mastery', section: 'Mastery', path: '/profile#mastery' },
    { type: 'section', title: 'Welcome Card', section: 'welcome', path: '/dashboard#welcome' },
    { type: 'section', title: 'Progress Tracker', section: 'progress', path: '/dashboard#progress' },
    { type: 'section', title: 'Subject Tracker', section: 'subjects', path: '/dashboard#subjects' },
    { type: 'section', title: 'Quick Actions', section: 'quick-actions', path: '/dashboard#quick-actions' },
    { type: 'section', title: 'Right Panel', section: 'right-panel', path: '/dashboard#right-panel' },
  ];

  const snippet = (text = '', q = '') => {
    const lower = text.toLowerCase();
    const i = lower.indexOf(q.toLowerCase());
    if (i === -1) return text.slice(0, 120);
    const start = Math.max(0, i - 30);
    const end = Math.min(text.length, i + 90);
  return (start > 0 ? '…' : '') + text.slice(start, end).replace(/\n+/g, ' ') + (end < text.length ? '…' : '');
  };

  async function performSearch(query) {
    setSearchQuery(query);
    setIsSearching(true);
    setShowResults(true);

    try {
      if (!query || query.trim().length === 0) {
        const suggestions = pageSections.map((s) => ({ ...s, category: 'Suggestions', title: s.title }));
        setSearchResults(suggestions);
        setIsSearching(false);
        return suggestions;
      }

      const q = query.trim().toLowerCase();
      const results = [];

      for (const p of staticPages) {
        if (p.title.toLowerCase().includes(q) || (p.description || '').toLowerCase().includes(q)) {
          results.push({ ...p, category: 'Pages', type: 'page', title: p.title, description: p.description });
        }
      }

      for (const s of pageSections) {
        if ((s.section || '').toLowerCase().includes(q) || (s.title || '').toLowerCase().includes(q)) {
          results.push({ ...s, category: 'Sections', type: 'section', title: s.title, section: s.section });
        }
      }

      try {
        const resp = await getAllReviewers(500);
        const reviewers = Array.isArray(resp) ? resp : (resp?.data || resp?.reviewers || []);

        for (const r of reviewers) {
          const title = r.title || r.name || '';
          const desc = r.description || r.summary || '';
          const contentFields = [r.originalContent || '', r.enhancedContent || r.enhancedContentByAI || ''].join('\n');

          if ((title && title.toLowerCase().includes(q)) || (desc && desc.toLowerCase().includes(q))) {
            results.push({
              type: 'reviewer',
              category: 'Reviewers',
              title: title || 'Reviewer',
              description: snippet(desc || contentFields, query),
              path: `/reviewers/${r._id || r.id}`,
              date: r.updatedAt || r.createdAt,
            });
          } else if (contentFields.toLowerCase().includes(q)) {
            const lines = contentFields.split(/\n+/).map((l) => l.trim()).filter(Boolean);
            let pushedSection = false;
            for (const line of lines) {
              if (line.toLowerCase().includes(q) && !pushedSection) {
                results.push({
                  type: 'reviewer-section',
                  category: 'Reviewer Sections',
                  title: title || 'Reviewer',
                  section: line.length > 60 ? line.slice(0, 60) + '…' : line,
                  description: snippet(line, query),
                  path: `/reviewers/${r._id || r.id}`,
                  date: r.updatedAt || r.createdAt,
                });
                pushedSection = true;
              }
            }
          }
        }
      } catch (err) {
      }

      setSearchResults(results);
      setIsSearching(false);
      return results;
    } catch (err) {
      setIsSearching(false);
      throw err;
    }
  }

  function highlightAndNavigate(path, selector) {
    const scrollAndHighlight = () => {
      try {
        let el = null;
        if (selector) {
          el = document.querySelector(`[data-search-section="${selector}"]`);
        }
        if (!el && selector) {
          el = document.getElementById(selector);
        }
        if (el) {
          el.classList.add('search-highlight');
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          setTimeout(() => el.classList.remove('search-highlight'), 2500);
          return true;
        }
      } catch (e) {
      }
      return false;
    };

    if (typeof window === 'undefined') return;
    const currentPath = window.location.pathname;
    const targetPath = path?.split('#')[0] || currentPath;
    const selectorFromPath = (path || '').split('#')[1];

    if (currentPath === targetPath) {
      scrollAndHighlight();
    } else {
      window.location.href = path || targetPath;
      setTimeout(() => {
        if (selectorFromPath) highlightAndNavigate(targetPath, selectorFromPath);
      }, 600);
    }
  }

  function handleSearch(value) {
    performSearch(value).catch(() => {});
  }

  function handleResultClick(path) {
    setShowResults(false);
    if (!path) return;
    const selector = (path || '').split('#')[1];
    highlightAndNavigate(path, selector);
  }

  function clearSearch() {
    setSearchQuery('');
    setSearchResults([]);
    setShowResults(false);
  }

  return (
    <SearchContext.Provider
      value={{
        searchQuery,
        searchResults,
        isSearching,
        showResults,
        handleSearch,
        handleResultClick,
        clearSearch,
        setShowResults,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const ctx = useContext(SearchContext);
  if (!ctx) {
    return {
      searchQuery: '',
      searchResults: [],
      isSearching: false,
      showResults: false,
      handleSearch: () => {},
      handleResultClick: () => {},
      clearSearch: () => {},
      setShowResults: () => {},
    };
  }
  return ctx;
}

export default SearchContext;

