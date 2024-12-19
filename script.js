const modelList = document.getElementById("model-list");
const modelDetails = document.getElementById("model-details");
const modelName = document.getElementById("model-name");
const modelImage = document.getElementById("model-image");
const modelDescription = document.getElementById("model-description");
const commentList = document.getElementById("comment-list");
const commentForm = document.getElementById("comment-form");
const commentInput = document.getElementById("comment-input");
const searchInput = document.getElementById("search-input");
const filterForm = document.getElementById("filter-form");

let models = [];

// Fetch data from db.json
async function fetchModels() {
    try {
        const response = await fetch('db.json');
        const data = await response.json();
        return data.BMWs || []; // Assuming "BMWs" is the key in db.json
    } catch (error) {
        console.error("Error fetching models:", error);
        return [];
    }
}

// Save comments to localStorage
function saveComments(modelId, comments) {
    localStorage.setItem(`comments_${modelId}`, JSON.stringify(comments));
}

// Load comments from localStorage
function loadComments(modelId) {
    const comments = localStorage.getItem(`comments_${modelId}`);
    return comments ? JSON.parse(comments) : [];
}

// Populate model list dynamically
function populateModelList(modelsToDisplay) {
    modelList.innerHTML = ""; // Clear the list before adding items
    modelsToDisplay.forEach((model) => {
        const listItem = document.createElement("li");
        listItem.textContent = model.model;
        listItem.dataset.id = model.id; // Attach the ID for later use
        listItem.addEventListener("click", () => showModelDetails(model));
        modelList.appendChild(listItem);
    });
}

// Show model details
function showModelDetails(model) {
    modelName.textContent = model.model;
    modelImage.src = model.image;
    modelImage.alt = model.model;
    modelDescription.textContent = model.Description;

    // Load and display comments
    const comments = loadComments(model.id);
    displayComments(comments);

    modelDetails.style.display = "block"; // Make the details section visible

    // Attach comment form submission logic
    commentForm.onsubmit = (e) => {
        e.preventDefault();
        const newComment = commentInput.value.trim();
        if (newComment) {
            comments.push(newComment);
            saveComments(model.id, comments);
            displayComments(comments);
            commentInput.value = ""; // Clear the input
        }
    };
}

// Display comments
function displayComments(comments) {
    commentList.innerHTML = ""; // Clear the current list
    comments.forEach((comment) => {
        const commentItem = document.createElement("li");
        commentItem.textContent = comment;
        commentList.appendChild(commentItem);
    });
}

// Implement search functionality
function searchModels(query) {
    const filteredModels = models.filter((model) =>
        model.model.toLowerCase().includes(query.toLowerCase())
    );
    populateModelList(filteredModels);
}

// Implement filtering options
function filterModels(filters) {
    const filteredModels = models.filter((model) => {
        return Object.keys(filters).every((key) => {
            if (!filters[key]) return true; // Skip empty filters
            return model[key]?.toString().includes(filters[key]);
        });
    });
    populateModelList(filteredModels);
}

// Initialize the page
document.addEventListener("DOMContentLoaded", async () => {
    models = await fetchModels();
    populateModelList(models); // Populate the list on page load

    // Attach search functionality
    searchInput.addEventListener("input", (e) => {
        searchModels(e.target.value);
    });

    // Attach filtering functionality
    filterForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const filters = {
            year: e.target.year.value,
            engine: e.target.engine.value,
        };
        filterModels(filters);
    });
});
