import { createContext, useContext, useState, useCallback } from 'react';

const ReviewerContext = createContext();

export const ReviewerProvider = ({ children }) => {
  const [reviewerUpdateTrigger, setReviewerUpdateTrigger] = useState(0);

  const triggerReviewerUpdate = useCallback(() => {
    setReviewerUpdateTrigger(prev => prev + 1);
  }, []);

  return (
    <ReviewerContext.Provider value={{ reviewerUpdateTrigger, triggerReviewerUpdate }}>
      {children}
    </ReviewerContext.Provider>
  );
};

export const useReviewerContext = () => {
  const context = useContext(ReviewerContext);
  if (!context) {
    throw new Error('useReviewerContext must be used within a ReviewerProvider');
  }
  return context;
};
