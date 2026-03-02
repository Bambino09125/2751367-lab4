const searchBtn = document.getElementById('search-btn');
const countryInput = document.getElementById('country-input');
const countryInfo = document.getElementById('country-info');
const borderContainer = document.getElementById('bordering-countries');
const spinner = document.getElementById('loading-spinner');
const errorMessage = document.getElementById('error-message');

async function searchCountry(countryName) {
    if (!countryName) return;

    try {
        // Show loading spinner
        spinner.classList.remove('hidden');
        errorMessage.classList.add('hidden');
        countryInfo.innerHTML = '';
        borderContainer.innerHTML = '';

        // Fetch country by name
        const response = await fetch(
            `https://restcountries.com/v3.1/name/${countryName}`
        );

        if (!response.ok) {
            throw new Error('Country not found');
        }

        const data = await response.json();
        const country = data[0]; // API returns array

        // Safe handling
        const capital = country.capital ? country.capital[0] : "N/A";
        const population = country.population.toLocaleString();
        const region = country.region;
        const flag = country.flags.svg;

        // Display main country
        countryInfo.innerHTML = `
            <div class="country-card">
                <h2>${country.name.common}</h2>
                <p><strong>Capital:</strong> ${capital}</p>
                <p><strong>Population:</strong> ${population}</p>
                <p><strong>Region:</strong> ${region}</p>
                <img src="${flag}" alt="${country.name.common} flag" width="150">
            </div>
        `;

        // Fetch bordering countries
        if (country.borders && country.borders.length > 0) {

            const borderPromises = country.borders.map(code =>
                fetch(`https://restcountries.com/v3.1/alpha/${code}`)
                    .then(res => res.json())
            );

            const borderResults = await Promise.all(borderPromises);

            borderContainer.innerHTML = `
                <h3>Bordering Countries:</h3>
                <div class="border-grid">
                    ${borderResults.map(border => `
                        <div class="country-card">
                            <p>${border[0].name.common}</p>
                            <img src="${border[0].flags.svg}" 
                                 alt="${border[0].name.common} flag" 
                                 width="100">
                        </div>
                    `).join('')}
                </div>
            `;

        } else {
            borderContainer.innerHTML = "<p>No bordering countries.</p>";
        }

    } catch (error) {
        errorMessage.textContent =
            "⚠ Country not found. Please check spelling and try again.";
        errorMessage.classList.remove('hidden');
    } finally {
        spinner.classList.add('hidden');
    }
}

// Button click
searchBtn.addEventListener('click', () => {
    searchCountry(countryInput.value.trim());
});

// Enter key
countryInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        searchCountry(countryInput.value.trim());
    }
});