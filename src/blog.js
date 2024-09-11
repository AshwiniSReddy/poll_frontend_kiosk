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
  ThemeProvider,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
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
      const votedQuestions =
        JSON.parse(localStorage.getItem("votedQuestions")) || [];
      if (!votedQuestions.includes(question._id)) {
        votedQuestions.push(question._id);
        localStorage.setItem("votedQuestions", JSON.stringify(votedQuestions));
      }
    } catch (error) {
      console.error("Failed to cast vote:", error);
    }
  };
  const totalVotes = votes.option1Votes + votes.option2Votes;
  const option1Percentage =
    totalVotes === 0 ? 0 : (votes.option1Votes / totalVotes) * 100;
 
  const option2Percentage =
    totalVotes === 0 ? 0 : (votes.option2Votes / totalVotes) * 100;
  useEffect(() => {
    const votedQuestions =
      JSON.parse(localStorage.getItem("votedQuestions")) || [];
    if (votedQuestions.includes(question._id)) {
      setShowResults(true); // Do not show options if already voted
    }

    setoption1greater(option1Percentage > option2Percentage);
    setoption2greater(option2Percentage > option1Percentage);
  }, [question._id, votes]);

  return (
    <Box
      p={[5, 10, 15]}
      borderWidth="1px"
      display="flex"
      flexDirection="column"
      alignItems="baseline"
      width={["70%", "80%", "80%"]}
      gap={[2, 4, 6]}
    >
      <Text
        fontSize={["md", "lg", "xl"]}
        fontWeight="600"
        mb={[2, 4]}
        color="#113343"
      >
        {question.question}
      </Text>
      {!showResults ? (
        <ButtonGroup width="100%" direction={["column", "row"]} spacing="4">
          <Button
            onClick={() => handleVote("option1")}
            p={[5, 8, 10]} // Responsive padding
            height={["60px", "70px", "80px"]} // Responsive heights
            bg="white"
            color="#113343"
            borderRadius="5"
            width="100%"
            borderColor="#7d9aa7"
            borderWidth="1px"
            boxShadow="5px 10px #2f5d72"
            mb={[2, 0]} // Bottom margin on smaller screens
          >
            {question.option1}
          </Button>
          <Button
            onClick={() => handleVote("option2")}
            p={[5, 8, 10]} // Responsive padding
            height={["60px", "70px", "80px"]} // Responsive heights
            bg="white"
            color="#113343"
            borderRadius="5"
            width="100%"
            borderColor="#7d9aa7"
            borderWidth="1px"
            boxShadow="5px 10px #2f5d72"
            mt={[2, 0]} // Top margin on smaller screens
          >
            {question.option2}
          </Button>
        </ButtonGroup>
      ) : (
        <Box
          mt={4}
          boxShadow="5px 10px #2f5d72"
          width="100%"
          bg="white"
          color="#113343"
          borderRadius="5"
          p={[4, 6, 8]}
          borderColor="#7d9aa7"
          borderWidth="2px"
          borderStyle="solid"
        >
          <Progress
            value={option1greater ? option1Percentage : option2Percentage}
            size="lg"
            height="24px"
            hasStripe
            mt={2}
            colorScheme={option1greater ? "blue" : "green"}
          />
          <Flex justifyContent="space-between" mt={2} borderColor="#7d9aa7">
            <Text>
              {question.option1} ({option1Percentage.toFixed(0)}%)
            </Text>
            <Text>{totalVotes.toLocaleString()} votes</Text>
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
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [timer, setTimer] = useState(null);

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

  const handleTouchStart = () => {
    clearTimeout(timer);
   
    setTimer(setTimeout(onOpen, 30000)); // Start the 30-second timer
  };

  const handleUserConfirmation = (isNewUser) => {
    if (isNewUser) {
      // Example for clearing localStorage, replace with your cookie clearing method
      localStorage.clear();
    }
    onClose(); // Close the modal
    clearTimeout(timer); // Clear the timer
    setTimer(null); // Reset timer state
    window.location.reload();
  };

  useEffect(() => {
    window.addEventListener("touchstart", handleTouchStart);
    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      clearTimeout(timer); // Cleanup timer on component unmount
    };
  }, [timer]);

    // Function to handle inactivity timeout
    const handleInactivity = () => {
      // Open modal or perform any action after 30 seconds of inactivity
      onOpen();
    };
  
    // Function to reset inactivity timer
    const resetTimer = () => {
      clearTimeout(timer);
      setTimer(setTimeout(handleInactivity, 30000)); // 30,000 milliseconds = 30 seconds
    };
  
    // Set up event listeners for user activity
    useEffect(() => {
      // Events to listen for any user interaction
      const events = ['click', 'mousemove', 'keypress', 'scroll', 'touchstart'];
      events.forEach(event => window.addEventListener(event, resetTimer));
  
      // Set initial timer
      resetTimer();
  
      // Clean up
      return () => {
        events.forEach(event => window.removeEventListener(event, resetTimer));
        clearTimeout(timer);
      };
    }, []);

  return (
    <Box
      bgSize="cover"
      bgPosition="center"
      minH="100vh"
      width="100vw"
      display="flex"
      justifyContent="center"
      p={[8, 16, 30]} // Responsive padding to adjust to different screen sizes
      onTouchStart={handleTouchStart} // Reset timer on touch
    >
      <VStack
        spacing={[4, 8, 20]}
        p={[8, 16, 30]}
        width="100%"
        justifyContent="center"
      >
        {" "}
        // Adjust spacing and padding responsively
        <Heading as="h1" size="2xl" mb={[4, 8]} color="#113343" fontFamily="'Dancing Script', cursive" fontSize={["20px","60px","80px"]}>
          Curious conundrums
        </Heading>
        {/* <Text fontSize={["lg", "xl", "2xl"]} color="#113343" mb={[6, 12]}>
          Vote on the questions below and see what others think!
        </Text> */}
        {questions.map((q) => (
          <QuestionCard key={q._id} question={q} vote={q} />
        ))}
      </VStack>

      <Modal isOpen={isOpen} onClose={onClose} size={["xs", "md", "lg"]}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize={["lg", "xl"]}>Session Check</ModalHeader>
          <ModalCloseButton />
          <ModalBody fontSize={["md", "lg"]}>
            Are you the same user or a different user?
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={() => handleUserConfirmation(true)}
              size={["sm", "md"]}
            >
              Different User
            </Button>
            <Button
              variant="ghost"
              onClick={() => handleUserConfirmation(false)}
              size={["sm", "md"]}
            >
              Same User
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default QuestionsContainer;
