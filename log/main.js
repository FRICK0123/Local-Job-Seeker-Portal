// Get the dropdown element by id
            const categoryDropdown = document.getElementById('categoryDropdown');
            const categoryDropdown2 = document.getElementById('categoryDropdown2');
            const categoryDropdown3 = document.getElementById('categoryDropdown3');
            const categoryDropdown4 = document.getElementById('categoryDropdown4');
            const categoryDropdown5 = document.getElementById('categoryDropdown5');
            const categoryDropdown6 = document.getElementById('categoryDropdown6');
            const categoryDropdown7 = document.getElementById('categoryDropdown7');
            const categoryDropdown8 = document.getElementById('categoryDropdown8');


            // Get all content items
            const jobCards = document.querySelectorAll('.job-card');

            // Add a click event listener to the dropdown
            categoryDropdown.addEventListener('click', function (e) {
                if (e.target.tagName === 'A') {
                    const selectedCategory = e.target.innerText.toLowerCase();

                    // Iterate through job cards and show/hide based on the selected category
                    jobCards.forEach(card => {
                        const cardCategory = card.dataset.category;

                        if (selectedCategory === 'all' || cardCategory.includes(selectedCategory)) {
                            card.style.display = 'block';
                        } else {
                            card.style.display = 'none';
                        }
                    });
                }
            });

            categoryDropdown2.addEventListener('click', function (e) {
                if (e.target.tagName === 'A') {
                    const selectedCategory = e.target.innerText.toLowerCase();

                    // Iterate through job cards and show/hide based on the selected category
                    jobCards.forEach(card => {
                        const cardCategory = card.dataset.category;

                        if (selectedCategory === 'all' || cardCategory.includes(selectedCategory)) {
                            card.style.display = 'block';
                        } else {
                                card.style.display = 'none';
                        }
                    });
                }
            });

        categoryDropdown3.addEventListener('click', function (e) {
                if (e.target.tagName === 'A') {
                    const selectedCategory = e.target.innerText.toLowerCase();

                    // Iterate through job cards and show/hide based on the selected category
                    jobCards.forEach(card => {
                        const cardCategory = card.dataset.category;

                        if (selectedCategory === 'all' || cardCategory.includes(selectedCategory)) {
                            card.style.display = 'block';
                        } else {
                            card.style.display = 'none';
                        }
                    });
                }
            });

        categoryDropdown4.addEventListener('click', function (e) {
                if (e.target.tagName === 'A') {
                    const selectedCategory = e.target.innerText.toLowerCase();

                    // Iterate through job cards and show/hide based on the selected category
                    jobCards.forEach(card => {
                        const cardCategory = card.dataset.category;

                        if (selectedCategory === 'all' || cardCategory.includes(selectedCategory)) {
                            card.style.display = 'block';
                        } else {
                            card.style.display = 'none';
                        }
                    });
                }
            });

            categoryDropdown5.addEventListener('click', function (e) {
                    if (e.target.tagName === 'A') {
                        const selectedCategory = e.target.innerText.toLowerCase();

                        // Iterate through job cards and show/hide based on the selected category
                        jobCards.forEach(card => {
                            const cardCategory = card.dataset.category;

                            if (selectedCategory === 'all' || cardCategory.includes(selectedCategory)) {
                                card.style.display = 'block';
                            } else {
                                card.style.display = 'none';
                            }
                        });
                    }
                });

            categoryDropdown6.addEventListener('click', function (e) {
                    if (e.target.tagName === 'A') {
                        const selectedCategory = e.target.innerText.toLowerCase();

                        // Iterate through job cards and show/hide based on the selected category
                        jobCards.forEach(card => {
                            const cardCategory = card.dataset.category;

                            if (selectedCategory === 'all' || cardCategory.includes(selectedCategory)) {
                                card.style.display = 'block';
                            } else {
                                card.style.display = 'none';
                            }
                        });
                    }
                });

            categoryDropdown7.addEventListener('click', function (e) {
                    if (e.target.tagName === 'A') {
                        const selectedCategory = e.target.innerText.toLowerCase();

                        // Iterate through job cards and show/hide based on the selected category
                        jobCards.forEach(card => {
                            const cardCategory = card.dataset.category;

                            if (selectedCategory === 'all' || cardCategory.includes(selectedCategory)) {
                                card.style.display = 'block';
                            } else {
                                card.style.display = 'none';
                            }
                        });
                    }
                });
            
                categoryDropdown8.addEventListener('click', function (e) {
                        if (e.target.tagName === 'A') {
                            const selectedCategory = e.target.innerText.toLowerCase();

                            // Iterate through job cards and show/hide based on the selected category
                            jobCards.forEach(card => {
                                const cardCategory = card.dataset.category;

                                if (selectedCategory === 'all' || cardCategory.includes(selectedCategory)) {
                                    card.style.display = 'block';
                                } else {
                                    card.style.display = 'none';
                                }
                            });
                        }
                    });

            function filterJobs() {
                const searchInput = document.getElementById('search').value.toLowerCase();
                const jobCards = document.querySelectorAll('.col-md-4'); // Adjust the selector based on your HTML structure

                jobCards.forEach(card => {
                    const category = card.querySelector('.card-text[data-category]').dataset.category.toLowerCase();
                    if (category.includes(searchInput)) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            }