(async function () {
    const container = document.getElementById('question-container');
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

    // Render questions for the current page
    const renderQuestions = (questions) => {
        container.innerHTML = '';
        container.appendChild(resetButton);

        questions.forEach(questionData => {
            // Create question text
            const questionText = document.createElement('div');
            questionText.style.textAlign = 'left';
            questionText.textContent = `${questionData.qno}.ㅤ${questionData.qtext}`;
            container.appendChild(questionText);


              // Add qhtml content rendered as HTML
            if (questionData.qhtml) {
                const questionHtml = document.createElement('div');
                questionHtml.style.textAlign = 'left';
                questionHtml.innerHTML = questionData.qhtml; // Render qhtml content as HTML
                container.appendChild(questionHtml);
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
                    if (storedSelection === input.value) {
                        input.checked = true;
                        if (input.checked && input.value === questionData.ans) {
                            label.style.color = '#49CDC8'; // Correct answer
                        } else if (input.checked) {
                            label.style.color = '#AB6565'; // Incorrect answer
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
                        if (input.checked && input.value === questionData.ans) {
                            label.style.color = '#49CDC8'; // Correct answer
                        } else if (input.checked) {
                            label.style.color = '#AB6565'; // Incorrect answer
                        }

                        // Highlight the correct answer in green regardless of selection
                        if (input.value === questionData.ans && !input.checked) {
                            label.style.color = '#49CDC8'; // Correct answer (even if not selected)
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
                    if (storedSelection === input.value) {
                        input.checked = true;
                        if (input.checked && input.value === questionData.ans) {
                            label.style.color = '#49CDC8'; // Correct answer
                        } else if (input.checked) {
                            label.style.color = '#AB6565'; // Incorrect answer
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
                        if (input.checked && input.value === questionData.ans) {
                            label.style.color = '#49CDC8'; // Correct answer
                        } else if (input.checked) {
                            label.style.color = '#AB6565'; // Incorrect answer
                        }

                        // Highlight the correct answer in green regardless of selection
                        if (input.value === questionData.ans && !input.checked) {
                            label.style.color = '#49CDC8'; // Correct answer (even if not selected)
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