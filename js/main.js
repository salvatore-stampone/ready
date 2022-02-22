//Set up the back to top button
const backToTopBtn = document.querySelector(".back-to-top-btn");

function backToTop() {
    window.scrollTo({
        top: 0,
        behavior: "smooth",
    })
}

backToTopBtn.addEventListener("click", backToTop);

//Toggle search bar
const searchButton = document.querySelector(".search-btn");
const searchBox = document.querySelector(".search-box");

function showBox() {
    if (searchBox.classList.contains("visible")) {
        searchBox.classList.remove("visible");
        searchBox.classList.add("hidden");
    } else if (searchBox.classList.contains("hidden")) {
        searchBox.classList.remove("hidden");
        searchBox.classList.add("visible");
    }
}

searchButton.addEventListener("click", showBox);

//Get works of a subject
const searchIcon = document.querySelector(".search-icon");
const searchInput = document.querySelector(".search");
const bookCardsContainer = document.querySelector(".book-cards-container");
let resultsTitle;

searchIcon.addEventListener("click", (e) => {
    if (!bookCardsContainer.innerHTML) {
        getData(searchInput.value);
    } else if (bookCardsContainer.innerHTML) {
        while (bookCardsContainer.firstChild) {
            bookCardsContainer.firstChild.remove();
        }
        getData(searchInput.value);
    }
})

// Execute the function on Enter
searchInput.addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
        searchIcon.click();
    }
});

let bookCard;
let readMoreButton;
let bookTitle;
let bookAuthor;
let bookDescription;
let resultsTitleBox;

async function getData(subj) {
    try {
        //Get the actual data
        const response = await fetch(`http://openlibrary.org/subjects/${subj.toLowerCase()}.json`);
        const data = await response.json();
        // console.log(data);

        //Display "Results" title
        resultsTitleBox = document.createElement("div");
        resultsTitle = document.createElement("h1");
        resultsTitleBox.classList.add("results-title-box");
        resultsTitle.textContent = `Results for "${subj}"`;
        resultsTitleBox.append(resultsTitle);
        searchBox.after(resultsTitleBox);

        //Get cards
        function getCards() {
            for (let i = 0; i < data.works.length; i++) {
                bookCard = document.createElement("div");
                bookCard.classList.add("book-card");
                bookCardsContainer.append(bookCard);

                const title = data.works[i].title;
                const author = data.works[i].authors[0].name;
                const key = data.works[i].key;
                let description;

                bookTitle = document.createElement("h2");
                bookAuthor = document.createElement("h3");
                bookDescription = document.createElement("p");
                bookTitle.classList.add("book-title");
                bookAuthor.classList.add("book-author");
                bookDescription.classList.add("book-description");

                bookTitle.textContent = `${title}`;
                bookAuthor.textContent = `${author}`;
                bookCard.append(bookTitle);
                bookCard.append(bookAuthor);

                readMoreButton = document.createElement("button");
                readMoreButton.classList.add("btn");
                readMoreButton.classList.add("long-btn");
                readMoreButton.classList.add("read-more-btn");
                readMoreButton.textContent = "Read More";
                readMoreButton.addEventListener("click", (e) => {
                    const prevTargetClassList = e.target.previousSibling.classList;
                    if (!prevTargetClassList.contains("book-description")) {
                        getDescription(e);
                    } else if (prevTargetClassList.contains("unexpanded")) {
                        prevTargetClassList.remove("unexpanded");
                        prevTargetClassList.add("expanded");
                    } else {
                        prevTargetClassList.add("unexpanded");
                        prevTargetClassList.remove("expanded");
                    }
                }
                );
                bookCard.append(readMoreButton);

                async function getDescription(event) {
                    const response = await fetch(`https://openlibrary.org${key}.json`);
                    const data = await response.json();
                    description = data.description.value;

                    if (description == undefined) {
                        description = "No data available.";
                    }
                    bookDescription.textContent = `${description}`;
                    event.target.before(bookDescription);
                    event.target.previousSibling.classList.remove("unexpanded");
                }
            }
        }

        function noData() {
            const noDataResult = document.createElement("p");
            noDataResult.classList.add("no-data-result");
            noDataResult.textContent = "Sorry! No data was found. \n Try with something else.";
            resultsTitleBox.append(noDataResult);
        }

        if (data.works.length == 0) {
            resultsTitleBox.nextSibling.remove();
            noData();
        } else if (resultsTitleBox) {
            resultsTitleBox.nextSibling.remove();
            getCards();
        }

    } catch (err) {
        err => console.log(err);
    }
}

//Get a random subject
const randomizeButton = document.querySelector(".randomize-btn");

const subjectArray = ["Arts",
    "Architecture",
    "Art",
    "Dance",
    "Design",
    "Fashion",
    "Film",
    "Graphic Design",
    "Music",
    "Music Theory",
    "Painting",
    "Photography",
    "Animals",
    "Bears",
    "Cats",
    "Kittens",
    "Dogs",
    "Puppies",
    "Fiction",
    "Fantasy",
    "Historical Fiction",
    "Horror",
    "Humor",
    "Literature",
    "Magic",
    "Mystery",
    "Detective stories",
    "Plays",
    "Poetry",
    "Romance",
    "Science Fiction",
    "Short Stories",
    "Thriller",
    "Young Adult",
    "Science", "Mathematics",
    "Biology",
    "Chemistry",
    "Mathematics",
    "Physics",
    "Programming",
    "Business",
    "Finance",
    "Management",
    "Entrepreneurship",
    "Business Economics",
    "Business Success",
    "Finance",
    "Children's",
    "Kids Books",
    "Stories in Rhyme",
    "Baby Books",
    "Bedtime Books",
    "Picture Books",
    "History",
    "Ancient Civilization",
    "Archaeology",
    "Anthropology",
    "World War II",
    "Health", "Wellness",
    "Cooking",
    "Mental Health",
    "Exercise",
    "Nutrition",
    "Self-help",
];

function randomizeSubject() {
    let randomSubject = subjectArray[Math.floor(Math.random() * subjectArray.length)];
    return randomSubject;
}

randomizeButton.addEventListener("click", (e) => {
    if (!resultsTitleBox) {
        getData(randomizeSubject());
    } else if (bookCardsContainer) {
        while (bookCardsContainer.firstChild) {
            bookCardsContainer.firstChild.remove();
        }
        getData(randomizeSubject());
    }
});