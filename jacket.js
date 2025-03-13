let currentPage = 1;
const totalPages = 2; // Page 1 = API, Page 2 = Local JSON
const LOCAL_JSON_PATH = "./jackets.json";
const API_BASE_URL = "https://v2.api.noroff.dev/rainy-days"; 



// -----------------------------------------------------Function to fetch jackets from API page 1 or local JSON page 2------------------------------------------------



async function fetchJackets(page = 1) {
    try {
        if (page === 1) {
            console.log(`Fetching from API: ${API_BASE_URL}?page=${page}`);
            const response = await fetch(`${API_BASE_URL}?page=${page}`);

            if (!response.ok) throw new Error(`API Fetch Error: ${response.status}`);

            const apiData = await response.json();
            console.log("API Jackets Loaded:", apiData.data);
            return apiData.data;
        } else if (page === 2) {
            console.log(`Fetching from Local JSON: ${LOCAL_JSON_PATH}`);
            const response = await fetch(LOCAL_JSON_PATH);

            if (!response.ok) throw new Error("Local JSON Fetch Error.");

            const localData = await response.json();
            console.log("Local JSON Jackets Loaded:", localData);

            if (!localData || !localData.jackets) {
                throw new Error("JSON structure incorrect! Expected { jackets: [...] }");
            }

            return localData.jackets;
        }
    } catch (error) {
        console.log("Fetching jackets failed:", error);
        return [];
    }
}

console.log("fethcJackets unrking perfectly"${API BASE})

// ---------------------------------------------------------------------------------------End--------------------------------------------------------------------------------------------------





// ----------------------------------------------------------Function to display jackets on the page-------------------------------------------------------------------------------------------



async function displayJackets(page = 1) {
    const container = document.getElementById("jackets-container");
    container.innerHTML = "<p>Loading jackets...</p>";

    const jackets = await fetchJackets(page);
    if (!jackets || jackets.length === 0) {
        container.innerHTML = "<p>No jackets found.</p>";
        return;
    }

    console.log(`Displaying jackets for page: ${page}`);
    container.innerHTML = "";

    jackets.forEach(jacket => {
        const jacketElement = document.createElement("div");
        jacketElement.classList.add("jacket-item");

        // Size picker
        const sizePicker = `
            <label for="size-${jacket.id}">Size:</label>
            <select id="size-${jacket.id}" class="size-selector">
                <option value="S">Small (S)</option>
                <option value="M" selected>Medium (M)</option>
                <option value="L">Large (L)</option>
                <option value="XL">Extra Large (XL)</option>
                <option value="XXL">XXL</option>
            </select>`;

        // Create jacket card         
        jacketElement.innerHTML = `
            <div class="text-container">
                <img src="${jacket.image.url}" alt="${jacket.image.alt}">
                <h3>${jacket.title}</h3>
                <p>${jacket.description}</p>
                <h2>$${jacket.onSale ? jacket.discountedPrice : jacket.price}</h2>
                ${sizePicker}
                <button class="add-to-cart" data-id="${jacket.id}">Add to Cart</button>
            </div>`;

            container.appendChild(jacketElement);
    });

    attachCartListeners();
    updatePaginationButtons();
}



// ---------------------------------------------------------------------------------------End------------------------------------------------------------------------------------------------------





// ----------------------------------------------------------Function to Attach "Add to Cart" Listeners-------------------------------------------------------------------------------------------


function attachCartListeners() {
    console.log("Attaching 'Add to Cart' listeners...");

    setTimeout(() => {
        const buttons = document.querySelectorAll(".add-to-cart");
        console.log("Found Add to Cart buttons:", buttons.length);

        buttons.forEach(button => {
            button.removeEventListener("click", handleAddToCart);
            button.addEventListener("click", handleAddToCart);
        });

        console.log("Add to Cart Listeners Successfully Attached!");
    }, 500);
}

// ---------------------------------------------------------------------------------------End------------------------------------------------------------------------------------------------------



// ---------------------------------------------------------------------------Pagiantion-----------------------------------------------------------------------------------------------------------

function updatePaginationButtons() {
    const prevBtn = document.getElementById("prevPage");
    const nextBtn = document.getElementById("nextPage");
    const pageIndicator = document.getElementById("currentPage");

    if (!prevBtn || !nextBtn || !pageIndicator) {
        console.error("Pagination elements missing!");
        return;
    }

    pageIndicator.textContent = `Page ${currentPage} of ${totalPages}`;

    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("prevPage").addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            displayJackets(currentPage);
            updatePaginationButtons();
        }
    });

    document.getElementById("nextPage").addEventListener("click", () => {
        if (currentPage < totalPages) {
            currentPage++;
            displayJackets(currentPage);
            updatePaginationButtons();
        }
    });

    updatePaginationButtons();
});


// ---------------------------------------------------------------------------------------End------------------------------------------------------------------------------------------------------



// ---------------------------------------------------------------------------Initialize Page on Load---------------------------------------------------------------------------------------------



document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM Loaded! Displaying jackets...");
    displayJackets();
});

// ---------------------------------------------------------------------------------------End------------------------------------------------------------------------------------------------------
