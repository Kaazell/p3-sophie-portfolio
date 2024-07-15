async function getWorks(filter) {
  const url = "http://localhost:5678/api/works";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const json = await response.json();
    if (filter) {
      console.log(filter);
      const filtered = json.filter((data) => data.categoryId === filter);
      console.log(filtered);
      for (let i = 0; i < json.length; i++) {
        setFigure(filtered[i]);
      }
    }
  } catch (error) {
    console.error(error.message);
  }
}
getWorks(2);

function setFigure(data) {
  const figure = document.createElement("figure");
  figure.innerHTML = `<img src=${data.imageUrl} alt=${data.title}>
                    <figcaption>${data.title}</figcaption>`;

  document.querySelector(".gallery").append(figure);
}

async function getCategories() {
  const url = "http://localhost:5678/api/categories";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    for (let i = 0; i < json.length; i++) {
      setFilter(json[i]);
    }
  } catch (error) {
    console.error(error.message);
  }
}
getCategories();

function setFilter(data) {
  console.log(data);
  const div = document.createElement("div");
  div.className = data.id;
  div.addEventListener("click", () => getWorks(data.id));
  // Demander au mentor si j'ai un autre choix que de mettre l'id commen nom de classe
  div.innerHTML = `${data.name}`;
  document.querySelector(".div-container").append(div);
}
// document.querySelector(".tous").addEventListener("click", () => getWorks());
// quel parametre envoyer dans getWorks ? (Probablement le id de la categorie)
