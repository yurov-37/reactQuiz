export const NextButton = ({
  onNextQuestion,
  answer,
  index,
  numQuestions,
  onFinishQuiz,
}) => {
  if (answer === null) return null;
  if (index < numQuestions - 1)
    return (
      <button className="btn btn-ui" onClick={() => onNextQuestion()}>
        Next
      </button>
    );

  if (index === numQuestions - 1)
    return (
      <button className="btn btn-ui" onClick={() => onFinishQuiz()}>
        Finish
      </button>
    );
};
