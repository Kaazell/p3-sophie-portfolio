async function getWorks(filter) {
  document.querySelector(".gallery").innerHTML = "";
  const url = "http://localhost:5678/api/works";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const json = await response.json();
    if (filter) {
      const filtered = json.filter((data) => data.categoryId === filter);
      for (let i = 0; i < filtered.length; i++) {
        setFigure(filtered[i]);
        setFigureModal(filtered[i]);
      }
    } else {
      for (let i = 0; i < json.length; i++) {
        setFigure(json[i]);
        setFigureModal(json[i]);
      }
    }
    //Delete
    const trashCans = document.querySelectorAll(".fa-trash-can");
    trashCans.forEach((e) =>
      e.addEventListener("click", (event) => deleteWork(event))
    );
  } catch (error) {
    console.error(error.message);
  }
}
getWorks();

function setFigure(data) {
  const figure = document.createElement("figure");
  figure.innerHTML = `<img src=${data.imageUrl} alt=${data.title}>
                    <figcaption>${data.title}</figcaption>`;

  document.querySelector(".gallery").append(figure);
}

function setFigureModal(data) {
  const figure = document.createElement("figure");
  figure.innerHTML = `<div class="image-container">
        <img src="${data.imageUrl}" alt="${data.title}">
        <figcaption>${data.title}</figcaption>
        <i id=${data.id} class="fa-solid fa-trash-can overlay-icon"></i>
    </div>
`;

  document.querySelector(".modal-gallery").append(figure);
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
  const div = document.createElement("div");
  div.className = data.id;
  div.addEventListener("click", () => getWorks(data.id));
  // Demander au mentor si j'ai un autre choix que de mettre l'id commen nom de classe
  div.innerHTML = `${data.name}`;
  document.querySelector(".div-container").append(div);
}

document.querySelector(".tous").addEventListener("click", () => getWorks());

function displayAdminMode() {
  if (sessionStorage.authToken) {
    const editBanner = document.createElement("div");
    editBanner.className = "edit";
    editBanner.innerHTML =
      '<p><a href="#modal1" class="js-modal"><i class="fa-regular fa-pen-to-square"></i>Mode édition</a></p>';
    document.body.prepend(editBanner);
  }
}

displayAdminMode();

let modal = null;
const focusableSelector = "button, a, input, textarea";
let focusables = [];

const openModal = function (e) {
  e.preventDefault();
  modal = document.querySelector(e.target.getAttribute("href"));
  focusables = Array.from(modal.querySelectorAll(focusableSelector));
  focusables[0].focus();
  modal.style.display = null;
  modal.removeAttribute("aria-hidden");
  modal.setAttribute("aria-modal", "true");
  modal.addEventListener("click", closeModal);
  modal
    .querySelectorAll(".js-modal-close")
    .forEach((e) => e.addEventListener("click", closeModal));

  modal
    .querySelector(".js-modal-stop")
    .addEventListener("click", stopPropagation);
};

const closeModal = function (e) {
  if (modal === null) return;
  e.preventDefault();
  modal.style.display = "none";
  modal.setAttribute("aria-hidden", "true");
  modal.removeAttribute("aria-modal");
  modal.removeEventListener("click", closeModal);
  modal
    .querySelector(".js-modal-close")
    .removeEventListener("click", closeModal);
  modal
    .querySelector(".js-modal-stop")
    .removeEventListener("click", stopPropagation);
  modal = null;
};

const stopPropagation = function (e) {
  e.stopPropagation();
};

const focusInModal = function (e) {
  e.preventDefault();
  let index = focusables.findIndex((f) => f === modal.querySelector(":focus"));
  if (e.shiftKey === true) {
    index--;
  } else {
    index++;
  }
  if (index >= focusables.length) {
    index = 0;
  }
  if (index < 0) {
    index = focusables.length - 1;
  }
  focusables[index].focus();
};

window.addEventListener("keydown", function (e) {
  if (e.key === "Escape" || e.key === "Esc") {
    closeModal(e);
  }
  if (e.key === "Tab" && modal !== null) {
    focusInModal(e);
  }
});

document.querySelectorAll(".js-modal").forEach((a) => {
  a.addEventListener("click", openModal);
});

// Delete Function

async function deleteWork(event) {
  event.stopPropagation();
  const id = event.srcElement.id;
  const deleteApi = "http://localhost:5678/api/works/";
  const token = sessionStorage.authToken;
  let response = await fetch(deleteApi + id, {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  if (response.status == 401 || response.status == 500) {
    const errorBox = document.createElement("div");
    errorBox.className = "error-login";
    errorBox.innerHTML = "Il y a eu une erreur";
    document.querySelector(".modal-button-container").prepend(errorBox);
  } else {
    let result = await response.json();
    console.log(result);
  }
}

//Toggle function
const addPhotoButton = document.querySelector(".add-photo-button");
const backButton = document.querySelector(".js-modal-back");

addPhotoButton.addEventListener("click", toggleModal);
backButton.addEventListener("click", toggleModal);

function toggleModal() {
  const galleryModal = document.querySelector(".gallery-modal");
  const addModal = document.querySelector(".add-modal");

  if (
    galleryModal.style.display === "block" ||
    galleryModal.style.display === ""
  ) {
    galleryModal.style.display = "none";
    addModal.style.display = "block";
  } else {
    galleryModal.style.display = "block";
    addModal.style.display = "none";
  }
}
