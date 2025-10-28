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
        let userAnswerText = '';
        
        if (ans?.isSkipped) {
          userAnswerText = 'Skipped';
        } else if (ans?.answer) {
          if (typeof ans.answer === 'object' && ans.answer !== null) {
            userAnswerText = Object.values(ans.answer).join(', ');
          } else {
            userAnswerText = String(ans.answer);
          }
        } else {
          userAnswerText = '';
        }
        
        let correctAnswerText = '';
        if (q.type === 'multiple-choice') {
          correctAnswerText = `${q.correct_answer}${q.options ? ` (${q.options[q.correct_answer]})` : ''}`;
        } else if (q.type === 'fill-in-the-blanks') {
          if (Array.isArray(q.fill_in_the_blank_answers)) {
            correctAnswerText = q.fill_in_the_blank_answers.join(', ');
          } else if (typeof q.fill_in_the_blank_answers === 'object') {
            correctAnswerText = Object.values(q.fill_in_the_blank_answers).join(', ');
          } else {
            correctAnswerText = q.fill_in_the_blank_answers || '';
          }
        } else {
          correctAnswerText = q.identification_answer || '';
        }
        
        return {
          number: idx + 1,
          question: q.question,
          numberedQuestion: `${idx + 1}. ${q.question}`,
          userAnswer: userAnswerText,
          correctAnswer: correctAnswerText,
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

