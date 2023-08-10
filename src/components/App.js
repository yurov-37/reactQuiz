import { useEffect, useReducer } from 'react';

import { Header } from './Header';
import { Main } from './Main';
import { Loader } from './Loader';
import { Error } from './Error';
import { StartScreen } from './StartScreen';
import { Question } from './Question';
import { NextButton } from './NextButton';
import { Progress } from './Progress';
import { FinishScreen } from './FinishScreen';
import { Footer } from './Footer';
import { Timer } from './Timer';

const SEC_PER_QUESTION = 30;

const initialState = {
  questions: [],

  //'loading','error','ready','active','finished'
  status: 'loading',
  index: 0,
  answer: null,
  points: 0,
  highscore: 0,
  secondsRemaning: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'dataReceived':
      return { ...state, questions: action.payload, status: 'ready' };
    case 'dataFailed':
      return { ...state, status: 'error' };
    case 'start':
      return {
        ...state,
        status: 'active',
        secondsRemaning: state.questions.length * SEC_PER_QUESTION,
      };
    case 'newAnswer':
      const question = state.questions.at(state.index);
      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === question.correctOption
            ? state.points + question.points
            : state.points,
      };
    case 'nextQuestion':
      return { ...state, index: state.index + 1, answer: null };
    case 'finish':
      return {
        ...state,
        status: 'finished',
        highscore:
          state.points > state.highscore ? state.points : state.highscore,
      };
    case 'restart':
      return { ...initialState, questions: state.questions, status: 'ready' };
    case 'tick':
      return {
        ...state,
        secondsRemaning: state.secondsRemaning - 1,
        status: state.secondsRemaning === 0 ? 'finished' : state.status,
        highscore:
          state.secondsRemaining === 0
            ? Math.max(state.points, state.highscore)
            : state.highscore,
      };
    default:
      throw new Error('Action is unknown');
  }
};

export const App = () => {
  const [
    { questions, status, index, answer, points, highscore, secondsRemaning },
    dispatch,
  ] = useReducer(reducer, initialState);

  const numQuestions = questions.length;
  const maxPossiblePoints = questions.reduce((acc, cur) => acc + cur.points, 0);

  useEffect(() => {
    fetch('http://localhost:8000/questions')
      .then(res => res.json())
      .then(data => dispatch({ type: 'dataReceived', payload: data }))
      .catch(err => dispatch({ type: 'dataFailed' }));
  }, []);

  const startQuiz = () => {
    dispatch({ type: 'start' });
  };

  const handleAnswer = answer => {
    dispatch({ type: 'newAnswer', payload: answer });
  };

  const handleNextQuestion = () => {
    dispatch({ type: 'nextQuestion' });
  };

  const handleFinishScreen = () => {
    dispatch({ type: 'finish' });
  };

  const handleRestartQuiz = () => {
    dispatch({ type: 'restart' });
  };

  const handleTimerTick = () => {
    dispatch({ type: 'tick' });
  };

  return (
    <div className="app">
      <Header />
      <Main>
        {status === 'loading' && <Loader />}
        {status === 'error' && <Error />}
        {status === 'ready' && (
          <StartScreen numQuestions={numQuestions} startQuiz={startQuiz} />
        )}
        {status === 'active' && (
          <>
            <Progress
              index={index}
              numQuestions={numQuestions}
              points={points}
              maxPossiblePoints={maxPossiblePoints}
              answer={answer}
            />
            <Question
              question={questions[index]}
              onAnswer={handleAnswer}
              answer={answer}
            />
            <Footer>
              <Timer
                onTimerTick={handleTimerTick}
                secondsRemaning={secondsRemaning}
              />
              <NextButton
                onNextQuestion={handleNextQuestion}
                onFinishQuiz={handleFinishScreen}
                answer={answer}
                numQuestions={numQuestions}
                index={index}
              />
            </Footer>
          </>
        )}
        {status === 'finished' && (
          <FinishScreen
            points={points}
            maxPossiblePoints={maxPossiblePoints}
            highscore={highscore}
            onRestartQuiz={handleRestartQuiz}
          />
        )}
      </Main>
    </div>
  );
};
