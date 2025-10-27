import httpService from './httpService';

export async function addAttempt(attempt) {
  try {
    const response = await httpService.post('/quizzes/history', {
      reviewer_id: attempt.reviewerId,
      reviewer_title: attempt.reviewerTitle,
      quiz_id: attempt.quizId,
      title: attempt.title,
      score_percent: attempt.stats?.percentage || 0,
      details: attempt.questions.map((q, idx) => {
        const ans = attempt.answers?.[idx];
        return {
          number: idx + 1,
          question: q.question,
          numberedQuestion: `${idx + 1}. ${q.question}`,
          userAnswer: ans?.isSkipped ? 'Skipped' : (ans?.answer ?? ''),
          correctAnswer: q.type === 'multiple-choice' 
            ? `${q.correct_answer}${q.options ? ` (${q.options[q.correct_answer]})` : ''}`
            : (q.identification_answer || ''),
          explanation: q.explanation || '',
        };
      }),
    });
    return response;
  } catch (error) {
    console.error('Failed to save quiz attempt:', error);
    throw error;
  }
}

export async function getAllAttempts() {
  try {
    const response = await httpService.get('/quizzes/history');
    return response.history || [];
  } catch (error) {
    console.error('Failed to fetch quiz history:', error);
    throw error;
  }
}

export async function getAttemptById(id) {
  try {
    const all = await getAllAttempts();
    return all.find(a => a.id === id) || null;
  } catch (error) {
    console.error('Failed to fetch attempt by id:', error);
    return null;
  }
}

