import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Text,
  ButtonGroup,
  Button,
  VStack,
  Progress,
  Flex,
  Heading,
  ThemeProvider
} from "@chakra-ui/react";

function QuestionCard({ question }) {
  const [showResults, setShowResults] = useState(false);
  const [option1greater, setoption1greater] = useState(false);
  const [option2greater, setoption2greater] = useState(false);
  const [votes, setVotes] = useState({
    option1Votes: question.option1Votes,
    option2Votes: question.option2Votes,
  });

  const handleVote = async (option) => {
    setShowResults(true);
    try {
      const response = await axios.post("http://localhost:5000/api/vote", {
        questionId: question._id,
        option,
      });
      setVotes({
        option1Votes: response.data.data.option1Votes,
        option2Votes: response.data.data.option2Votes,
      });

      // Update localStorage
      const votedQuestions = JSON.parse(localStorage.getItem('votedQuestions')) || [];
      if (!votedQuestions.includes(question._id)) {
        votedQuestions.push(question._id);
        localStorage.setItem('votedQuestions', JSON.stringify(votedQuestions));
      }
    } catch (error) {
      console.error("Failed to cast vote:", error);
    }
  };
  const totalVotes = votes.option1Votes + votes.option2Votes;
  const option1Percentage = totalVotes === 0 ? 0 : (votes.option1Votes / totalVotes) * 100;
  console.log(option1Percentage, "ooptionq")
  const option2Percentage = totalVotes === 0 ? 0 : (votes.option2Votes / totalVotes) * 100;
  useEffect(() => {
    const votedQuestions = JSON.parse(localStorage.getItem("votedQuestions")) || [];
    if (votedQuestions.includes(question._id)) {
      setShowResults(true); // Do not show options if already voted
    }

    setoption1greater(option1Percentage > option2Percentage);
    setoption2greater(option2Percentage > option1Percentage);

  }, [question._id,votes]);

 
  

  return (
    <Box p={10} borderWidth="1px"  display="flex" flexDirection="column" alignItems="baseline" width="50%" gap={2}>
      <Text fontWeight="600" mb={4} color="#113343">
        {question.question}
      </Text>
      {!showResults ? (
        <ButtonGroup width="100%">
          <Box mr={4} flex={1} width="50%"> {/* Add right margin */}
            <Button
              onClick={() => handleVote("option1")}
              p={10} // Increased padding for larger height
              height="60px" // Set button height
              bg="white" // Background color for button
              color="#113343" // Text color for button

              borderRadius="5" // Add border radius

              width="100%"
              borderColor="#7d9aa7"
              maxW="sm"
              borderWidth="1px"

              overflow="hidden"


              boxShadow="5px 10px #2f5d72;"
              display="flex"
              alignItems="center"
              justifyContent="center"


            >
              {question.option1}
            </Button>
          </Box>
          <Box ml={2} flex={1} width="50%"> {/* Add left margin */}
            <Button
              onClick={() => handleVote("option2")}
              p={10} // Increased padding for larger height
              height="60px" // Set button height
              bg="white" // Background color for button
              color="#113343" // Text color for button

              borderRadius="5" // Add border radius

              width="100%"
              borderColor="#7d9aa7"
              maxW="sm"
              borderWidth="1px"

              overflow="hidden"


              boxShadow="5px 10px #2f5d72;"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              {question.option2}
            </Button>

          </Box>
        </ButtonGroup>
      ) : (
        <Box mt={4} boxShadow="5px 10px #2f5d72" width="100%" bg="white" color="#113343" borderRadius="5" p={8} borderColor="#7d9aa7" borderWidth="2px" borderStyle="solid">
       {option1greater ? <Progress
            value={option1Percentage}
            size="lg"
            height="24px"
            hasStripe={true}
            mt={2}
            colorScheme={option1Percentage > option2Percentage ? "blue" : "green"} // Use color scheme based on comparison

          />:<Progress
          value={option2Percentage}
          size="lg"
          height="24px"
          hasStripe={true}
          mt={2}
          colorScheme={option1Percentage > option2Percentage ? "blue" : "green"} // Use color scheme based on comparison

        />} 



          {/* <Progress colorScheme='green' height='32px' value={20} /> */}





          <Flex justifyContent="space-between" mt={2} borderColor="#7d9aa7">
            <Text>
              {question.option1} ({option1Percentage.toFixed(0)}%)
            </Text>
            <Text>
              {totalVotes.toLocaleString()} votes
            </Text>
            <Text>
              {question.option2} ({option2Percentage.toFixed(0)}%)
            </Text>

          </Flex>

        </Box>
      )}
    </Box>
  );
}

function QuestionsContainer() {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/questions");
        setQuestions(response.data);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };
    fetchQuestions();
  }, []);

  return (
    <Box
     
      bgSize="cover"
      bgPosition="center"
      minH="100vh"
      width="100vw"
      p={8}
    
   
    >
      <VStack spacing={4}  p={8}>
        <Heading as="h1" size="xl" mb={4} color="#113343">
          Questions of the Day
        </Heading>
        <Text fontSize="lg" color="#113343" mb={6} >
          Vote on the questions below and see what others think!
        </Text>

        {questions.map((q) => (
          <QuestionCard key={q._id} question={q} vote={q} />
        ))}
      </VStack>
    </Box>
  );
}

export default QuestionsContainer;





