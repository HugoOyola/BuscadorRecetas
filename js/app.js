function iniciarApp() {
  const selectCategorias = document.querySelector("#categorias");
  selectCategorias.addEventListener("change", seleccionarCategoria);

  const resultado = document.querySelector("#resultado");
  const modal = new bootstrap.Modal("#modal", {});

  obtenerCategorias();

  function obtenerCategorias() {
    const url = "https://www.themealdb.com/api/json/v1/1/categories.php";
    fetch(url)
      .then((respuesta) => respuesta.json())
      .then((resultado) => mostrarCategorias(resultado.categories));
  }

  function mostrarCategorias(categorias = []) {
    categorias.forEach((categoria) => {
      const { strCategory } = categoria;
      const option = document.createElement("OPTION");
      option.value = strCategory;
      option.textContent = strCategory;
      selectCategorias.appendChild(option);
    });
  }

  function seleccionarCategoria(e) {
    const categoria = e.target.value;
    const url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoria}`;
    fetch(url)
      .then((respuesta) => respuesta.json())
      .then((resultado) => mostrarRecetas(resultado.meals));
  }

  function mostrarRecetas(recetas = []) {
    limpiarHtml(resultado)

    const heading = document.createElement("H2");
    heading.classList.add("text-center", "text-black","my-5");
    heading.textContent = recetas.length ? "Recetas" : "No se encontraron recetas";
    resultado.appendChild(heading);

    // Iterar las recetas
    recetas.forEach((receta) => {
      const { strMeal, strMealThumb, idMeal } = receta;

      const recetaContenedor = document.createElement("DIV");
      recetaContenedor.classList.add("col-md-4");

      const recetaCard = document.createElement("DIV");
      recetaCard.classList.add("card", "mb-4", "shadow-sm");

      const recetaImagen = document.createElement("IMG");
      recetaImagen.classList.add("card-img-top");
      recetaImagen.lastChild = `Imagen de la receta ${strMeal}`;
      recetaImagen.src = strMealThumb;

      const recetaCardBody = document.createElement("DIV");
      recetaCardBody.classList.add("card-body");

      const recetaHeading = document.createElement("H3");
      recetaHeading.classList.add("card-title", "mb-3");
      recetaHeading.textContent = strMeal;

      const recetaBottun = document.createElement("BUTTON");
      recetaBottun.classList.add("btn", "btn-danger", "w-100");
      recetaBottun.textContent = "Ver receta";
      // recetaBottun.dataset.bsTarget = "#modal"
      // recetaBottun.dataset.bsToggle = "modal"
      recetaBottun.onclick = () => {
        seleccionarReceta(idMeal);
      }

      // Inyectar en el codigo HTML
      recetaCardBody.appendChild(recetaHeading);
      recetaCardBody.appendChild(recetaBottun);

      recetaCard.appendChild(recetaImagen);
      recetaCard.appendChild(recetaCardBody);

      recetaContenedor.appendChild(recetaCard);

      resultado.appendChild(recetaContenedor);
    })
  }

  function seleccionarReceta(id){
    const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`;

    fetch(url)
      .then((respuesta) => respuesta.json())
      .then((resultado) => mostrarRecetaModal(resultado.meals[0]));
  }

  function mostrarRecetaModal(receta){
    const { idMeal, strInstructions, strMeal, strMealThumb } = receta;

    // Añadir contenido modal
    const modalTitle = document.querySelector(".modal .modal-title");
    const modalBody = document.querySelector(".modal .modal-body");

    modalTitle.textContent = strMeal;
    modalBody.innerHTML = `
      <img src="${strMealThumb}" class="img-fluid" alt="${strMeal}">
      <h3 class="my-3">Instrucciones</h3>
      <p>${strInstructions}</p>
    `;

    console.log(receta);
    // Muestra el modal
    modal.show();

  }

  function limpiarHtml(selector){
    while(selector.firstChild){
      resultado.removeChild(resultado.firstChild);
    }
  }
}


document.addEventListener("DOMContentLoaded", iniciarApp);
