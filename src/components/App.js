import { Header } from './Header';
import { Main } from './Main';

export const App = () => {
  return (
    <div className="app">
      <Header />
      <Main>
        <p>1/15</p>
        <p>Question?</p>
      </Main>
    </div>
  );
};
