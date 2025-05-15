const navItems = document.querySelectorAll('.nav-item')
const list = document.getElementById('list')

navItems[0].classList.add('active')

async function fetchData(category) {
    try {
        const response = await fetch(`https://thecocktaildb.com/api/json/v1/1/filter.php?c=${category}`)
        const cocktailData = await response.json()
        addItems(cocktailData.drinks)
    } catch (error) {
        console.error(error)
}
}

navItems.forEach(item => {
    item.addEventListener('click', function(event) {
        navItems.forEach(item => item.classList.remove('active'))
        event.currentTarget.classList.add('active')
        fetchData(event.currentTarget.id)
    })
})

fetchData('Cocktail')

function addItems(drinks) {
    list.innerHTML = '' //vide la liste avant d'ajouter une nouvelle catégorie sinon les filtres s'ajoutent
    drinks.forEach(drink => {
        const container = document.createElement('div')
        container.classList.add('list-item', 'col-12', 'col-sm-3')
        const title = document.createElement('h3')
        title.textContent = drink.strDrink
        const thumbnail = document.createElement('img')
        thumbnail.setAttribute('src', drink.strDrinkThumb)
        thumbnail.classList.add('thumbnail')
        container.appendChild(thumbnail)
        container.appendChild(title)
        //Modal click
        container.addEventListener('click', () => showDetails(drink.idDrink));

        list.appendChild(container)
    })
}

async function showDetails(drinkId) {
    try {
        const response = await fetch(`https://thecocktaildb.com/api/json/v1/1/lookup.php?i=${drinkId}`);
        const data = await response.json();
        const drink = data.drinks[0];

        document.getElementById('drink-name').textContent = drink.strDrink;
        document.getElementById('drink-image').src = drink.strDrinkThumb;
        document.getElementById('drink-instructions').textContent = drink.strInstructionsFR || drink.strInstructions;

        // Ingrédients + mesures
        const ingredientsList = document.getElementById('drink-ingredients');
        ingredientsList.innerHTML = '';
        for (let i = 1; i <= 15; i++) {
            const ingredient = drink[`strIngredient${i}`];
            const measure = drink[`strMeasure${i}`];
            if (ingredient) {
                const li = document.createElement('li');
                li.textContent = `${measure ? measure : ''} ${ingredient}`;
                ingredientsList.appendChild(li);
            }
        }

        document.getElementById('modal').style.display = 'flex';
    } catch (error) {
        console.error('Erreur lors de la récupération des détails:', error);
    }
}

// Fermer la modale en cliquant en dehors du contenu
document.getElementById('modal').addEventListener('click', (e) => {
    if (e.target.id === 'modal') {
        document.getElementById('modal').style.display = 'none';
    }
});