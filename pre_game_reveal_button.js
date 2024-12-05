    
document.addEventListener('DOMContentLoaded', async function () {
    const revealAnsButton = document.getElementById('toggle-ans-reveal');
    let answersRevealed = false; // Track the toggle state

    const getPaperNameFromURL = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const paperName = urlParams.get('paper');
        console.log(`Paper name extracted from URL: ${paperName}`);
        return paperName;
    };

    const fetchQuestions = async (paperName) => {
        try {
            console.log(`Fetching JSON file: data/${paperName}.json`);
            const response = await fetch(`data/${paperName}.json`);
            if (!response.ok) throw new Error('Failed to load questions');
            console.log('JSON file loaded successfully');
            return await response.json();
        } catch (error) {
            console.error('Error loading JSON:', error);
            return null;
        }
    };

    const revealAnswers = async () => {
        const paperName = getPaperNameFromURL();
        const questionData = await fetchQuestions(paperName);

        if (!questionData) {
            console.error('No question data found');
            return;
        }

        console.log('Question data loaded:', questionData);

        for (const pageKey in questionData) {
            console.log(`Processing page: ${pageKey}`);
            const questions = questionData[pageKey];
            questions.forEach(question => {
                console.log(`Processing question:`, question);

                const questionId = `q${question.qno}`;
                const storedSelection = localStorage.getItem(questionId);
                console.log(`Stored selection for ${questionId}: ${storedSelection}`);

                if (!storedSelection) {
                    console.warn(`No selection found in localStorage for ${questionId}`);
                    return;
                }

                const questionElement = document.getElementById(questionId);
                if (!questionElement) {
                    console.warn(`Question element not found on page for ID: ${questionId}`);
                    return;
                }

                console.log(`Found question element for ID: ${questionId}`);

                // Locate all `ul` elements related to this question
                const optionLists = questionElement.parentElement.querySelectorAll('ul');
                optionLists.forEach(optionsList => {
                    optionsList.querySelectorAll('label').forEach((label, index) => {
                        const input = optionsList.querySelector(`input[name="${questionId}"][value="${String.fromCharCode(97 + index)}"]`);
                        if (input) {
                            console.log(`Processing option: ${input.value} for question ${questionId}`);
                            if (answersRevealed) {
                                // Reset label colors to white
                                label.style.color = '#ffffff';
                                console.log(`Resetting color for option: ${input.value}`);
                            } else {
                                // Only process if the input is checked
                                if (input.checked) {
                                    console.log(`Option ${input.value} is checked`);
                                    if (input.value === question.ans) {
                                        console.log(`Correct answer for ${questionId}: ${input.value}`);
                                        label.style.color = '#49CDC8'; // Correct answer
                                    } else {
                                        console.log(`Incorrect answer for ${questionId}: ${input.value}`);
                                        label.style.color = '#AB6565'; // Incorrect answer
                                    }
                                } else {
                                    console.log(`Option ${input.value} is not checked`);
                                }
                            }
                        } else {
                            console.warn(`Input not found for option index ${index} in question ID: ${questionId}`);
                        }
                    });
                });
            });
        }

        // Toggle state after processing
        answersRevealed = !answersRevealed;
        console.log(`Answers revealed state toggled to: ${answersRevealed}`);
    };

    revealAnsButton.addEventListener('click', () => {
        console.log('Reveal Ans button clicked');
        revealAnswers();
    });
});
