
import './App.css';
import QuestionsContainer from './blog';
import { ChakraProvider } from '@chakra-ui/react'

function App() {
  return (
    <ChakraProvider>
      <div className="App">
        <QuestionsContainer />
      </div>
    </ChakraProvider>

  );
}

export default App;
