(async function () {
    const container = document.getElementById('question-container');
    const notes_container = document.getElementById('notes-container');
    const prevButton = document.getElementById('prev-page');
    const nextButton = document.getElementById('next-page');
    const resetButton = document.createElement('div');
/*
    resetButton.id = 'reset-button';
    resetButton.textContent = '⟳';
    container.appendChild(resetButton);
    */

    let currentPage = 1;
    let questionData = null;

    // Fetch JSON data based on the selected paper
    const fetchQuestions = async (paperJson) => {
        try {
            const response = await fetch(`${paperJson}.json`);
            if (!response.ok) throw new Error('Failed to load questions');
            return await response.json();
        } catch (error) {
            console.error(error);
            container.textContent = 'Error loading questions.';
            return null;
        }
    };


let isShowAnsToggled = false;

// Function to toggle the 'Show Ans' state
const toggleShowAns = () => {
    isShowAnsToggled = !isShowAnsToggled;
};

// Add event listener to the 'Show Ans' button (assuming its ID is 'toggle-ans')
const toggleAnsButton = document.getElementById('toggle-ans');
toggleAnsButton.addEventListener('click', toggleShowAns);

    // Render questions for the current page
const renderQuestions = (questions) => {
    container.innerHTML = '';
    notes_container.innerHTML = '';

    container.appendChild(resetButton);

    questions.forEach(questionData => {
        // Create question text
        const questionText = document.createElement('div');
        questionText.style.textAlign = 'left';
        questionText.textContent = `${questionData.qno}.ㅤ${questionData.qtext}`;
        questionText.id = `q${questionData.qno}`; // Set the ID as 'q' followed by qno
        questionText.classList.add('ques'); // Add the 'ques' class
        container.appendChild(questionText);

        // Add qhtml content rendered as HTML
        if (questionData.qhtml) {
            const questionHtml = document.createElement('div');
            questionHtml.style.textAlign = 'left';
            questionHtml.innerHTML = questionData.qhtml; // Render qhtml content as HTML
            questionHtml.id = `qhtml-${questionData.qno}`; // Set a unique ID for qhtml
            questionHtml.classList.add('ques'); // Add the 'ques' class
            container.appendChild(questionHtml);
        }

        // Add notes if present
        if (questionData.qnotes) {
            // Create the question number element and set text alignment
            const questionNoteText = document.createElement('span');
            questionNoteText.textContent = `${questionData.qno}.`; // Set question number as text
            questionNoteText.style.textAlign = 'left'; // Ensure left alignment
            questionNoteText.style.marginRight = '10px'; // Add space after question number

            // Create the notes container element
            const questionNotesHtml = document.createElement('div');
            questionNotesHtml.style.textAlign = 'left'; // Ensure left alignment for the notes
            questionNotesHtml.innerHTML = questionData.qnotes; // Render qnotes content as HTML

            // Create a separator element (using a <br> for a new line)
            const separator = document.createElement('br'); // This adds a line break

            // Wrap the question number and the notes together in a flex container
            const questionContainer = document.createElement('div');
            questionContainer.style.display = 'flex'; // Use flexbox to align items
            questionContainer.style.alignItems = 'flex-start'; // Align items at the top

            // Assign an ID based on the qno (e.g., id="1" for qno 1)
            questionContainer.id = `qnote-${questionData.qno}`; // Set a unique ID for qnotes container
            questionContainer.classList.add('qnote'); // Add the 'qnote' class to the container

            // Append the question number and notes to the container
            questionContainer.appendChild(questionNoteText); // Append question number
            questionContainer.appendChild(questionNotesHtml); // Append the notes (questionHtml)

            // Append the whole container to the notes container
            notes_container.appendChild(questionContainer); // Add the question with notes
            notes_container.appendChild(separator); // Add a line break after the notes
        }

        // Function to create options and statements
        const optionsList = document.createElement('ul');
        optionsList.style.listStyle = 'none';
        optionsList.style.padding = '0';

        const createStatementsList = (statements) => {
            const list = document.createElement('ul');
            list.style.listStyle = 'none';
            list.style.padding = '0';

            statements.forEach((statement, index) => {
                const listItem = document.createElement('li');
                listItem.textContent = `${index + 1}. ${statement}`;
                listItem.style.marginBottom = '5px';
                list.appendChild(listItem);
            });

            return list;
        };

        // Add options or statements based on question type
        if (questionData.qtype === 'single') {
            questionData.options.forEach((option, index) => {
                const optionItem = document.createElement('li');
                const input = document.createElement('input');
                const label = document.createElement('label');

                input.type = 'radio';
                input.name = `q${questionData.qno}`;
                input.value = String.fromCharCode(97 + index);
                label.textContent = option;
                label.style.marginLeft = '5px';
                label.style.cursor = 'pointer';

                // Check if the option is selected and update the label color
                const storedSelection = localStorage.getItem(`q${questionData.qno}`);
                if (isShowAnsToggled) {
                    if (storedSelection === input.value) {
                        input.checked = true;
                        if (input.checked && input.value === questionData.ans) {
                            label.style.color = '#49CDC8'; // Correct answer
                        } else if (input.checked) {
                            label.style.color = '#AB6565'; // Incorrect answer
                        }
                    }
                }

                input.addEventListener('change', () => {
                    localStorage.setItem(`q${questionData.qno}`, input.value);

                    // Reset all labels to default color
                    const labels = optionsList.querySelectorAll('label');
                    labels.forEach((label) => {
                        label.style.color = '';
                    });

                    // Check if option is selected and apply colors accordingly
                if (isShowAnsToggled) {
                    if (input.checked && input.value === questionData.ans) {
                        label.style.color = '#49CDC8'; // Correct answer
                    } else if (input.checked) {
                        label.style.color = '#AB6565'; // Incorrect answer
                    }

                    // Highlight the correct answer in green regardless of selection
                    if (input.value === questionData.ans && !input.checked) {
                        label.style.col
                        or = '#49CDC8'; // Correct answer (even if not selected)
                    }
                    }   
                });

                optionItem.appendChild(input);
                optionItem.appendChild(label);
                optionsList.appendChild(optionItem);
            });
        } else if (questionData.qtype === 'stat' || questionData.qtype === 'both') {
            const statementsList = createStatementsList(questionData.Statements);
            container.appendChild(statementsList);
            questionData.options.forEach((option, index) => {
                const optionItem = document.createElement('li');
                const input = document.createElement('input');
                const label = document.createElement('label');

                input.type = 'radio';
                input.name = `q${questionData.qno}`;
                input.value = String.fromCharCode(97 + index);
                label.textContent = option;
                label.style.marginLeft = '5px';
                label.style.cursor = 'pointer';

                // Check if the option is selected and update the label color
                const storedSelection = localStorage.getItem(`q${questionData.qno}`);
                if (isShowAnsToggled) {
                    if (storedSelection === input.value) {
                        input.checked = true;
                        if (input.checked && input.value === questionData.ans) {
                            label.style.color = '#49CDC8'; // Correct answer
                        } else if (input.checked) {
                            label.style.color = '#AB6565'; // Incorrect answer
                        }
                    }
                }

                input.addEventListener('change', () => {
                        localStorage.setItem(`q${questionData.qno}`, input.value);

                        // Reset all labels to default color
                        const labels = optionsList.querySelectorAll('label');
                        labels.forEach((label) => {
                            label.style.color = '';
                        });

                        // Only apply color change if 'Show Ans' is toggled
                        if (isShowAnsToggled) {
                            // Check if option is selected and apply colors accordingly
                            if (input.checked && input.value === questionData.ans) {
                                label.style.color = '#49CDC8'; // Correct answer
                            } else if (input.checked) {
                                label.style.color = '#AB6565'; // Incorrect answer
                            }

                            // Highlight the correct answer in green regardless of selection
                            if (input.value === questionData.ans && !input.checked) {
                                label.style.color = '#49CDC8'; // Correct answer (even if not selected)
                            }
                        }
                    });


                optionItem.appendChild(input);
                optionItem.appendChild(label);
                optionsList.appendChild(optionItem);
            });
        }

        container.appendChild(optionsList);
    });
};


    // Handle page navigation
    const updatePage = (direction) => {
        if (direction === 'next') currentPage++;
        else if (direction === 'prev') currentPage--;

        renderQuestions(questionData[`page${currentPage}`]);

        prevButton.disabled = currentPage <= 1;
        nextButton.disabled = !questionData[`page${currentPage + 1}`];
    };


    /*
    // Reset button functionality
    resetButton.addEventListener('click', () => {
        localStorage.clear();
        renderQuestions(questionData[`page${currentPage}`]);
    });

    */


    prevButton.addEventListener('click', () => updatePage('prev'));
    nextButton.addEventListener('click', () => updatePage('next'));

    // Load initial data
    questionData = await fetchQuestions(paper_json);
    if (questionData) {
        renderQuestions(questionData[`page${currentPage}`]);
        nextButton.disabled = !questionData[`page${currentPage + 1}`];
    }
})();



        // Function to toggle text color in question-container
        const toggleTextColor = () => {
            const questions = document.querySelectorAll('#question-container .ques, #question-container label'); // Select all elements inside question-container
    
            questions.forEach(element => {
                const currentColor = window.getComputedStyle(element).color;
    
                // Check if the text color is already white
                if (currentColor === 'rgb(255, 255, 255)') {
                    // Revert back to original color by removing the 'color' style property
                    element.style.removeProperty('color');
                } else {
                    // Set the text color to white and make sure it's applied as 'important'
                    element.style.setProperty('color', '#ffffff', 'important');
                }
            });
        };
    

        
    
        