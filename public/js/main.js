const paginationBtn = document.querySelectorAll("[pagination]");
if (paginationBtn) {
  paginationBtn.forEach((btn) => {
    const url = new URL(window.location.href);
    btn.addEventListener("click", () => {
      const page = btn.getAttribute("pagination");
      if (page) {
        url.searchParams.set("page", page);
      }
      window.location.href = url.href;
    });
  });
}

const menuList = document.getElementById("header-menu");
if (menuList) {
  menuList.addEventListener("click", () => {
    const menu = document.getElementById("nav-menu");
    menu.classList.toggle("nav-visible");
  });
}

const category = document.getElementById("btn-select-option");
if (category) {
  const categoryList = document.getElementById("category-list");
  const url = new URL(window.location.href);
  let value;
  categoryList.addEventListener("change", (e) => {
    value = e.target.value;
  });
  category.addEventListener("click", () => {
    url.searchParams.set("page", 1);
    if (value) {
      url.searchParams.set("category", value);
    }
    window.location.href = url.href;
  });
}

const selectList = document.getElementById("select-list");
if (selectList) {
  const savedOption = sessionStorage.getItem("selectedOptionValue");
  if (savedOption) {
    for (let option of selectList.options) {
      if (option.getAttribute("value-option") === savedOption) {
        option.selected = true;
        break;
      }
    }
  }

  selectList.addEventListener("change", (e) => {
    const selectedOption = e.target.options[e.target.selectedIndex];
    const valueOption = selectedOption.getAttribute("value-option");
    sessionStorage.setItem("selectedOptionValue", valueOption);
  });

  const btn = document.getElementById("btn");
  btn.addEventListener("click", (e) => {
    let url = new URL(window.location.href);
    const valueOption = sessionStorage.getItem("selectedOptionValue");
    if (valueOption) {
      const result = valueOption.split("-");
      if (result) {
        url.searchParams.set("sortKey", result[0]);
        url.searchParams.set("sortValue", result[1]);
        url.searchParams.set("page", 1);
        window.location.href = url.href;
      }
    }
  });
}

let selectedProducts = [];
function updateSelectedProducts(product, isChecked) {
  const productId = product.value;
  const quantity = parseInt(product.getAttribute("quantity"));
  const index = selectedProducts.findIndex((item) => item.id === productId);
  if (isChecked) {
    if (index === -1) {
      selectedProducts.push({ id: productId, quantity: quantity });
    }
  } else {
    if (index !== -1) {
      selectedProducts.splice(index, 1);
    }
  }
}

const formPayProducts = document.getElementById("form-pay-products");
if (formPayProducts) {
  const productList = document.querySelectorAll(".product-cart .cart-checked");
  const formInput = document.getElementById("input-product-list");

  productList.forEach((product) => {
    product.addEventListener("change", (e) => {
      updateSelectedProducts(e.target, e.target.checked);
    });
  });

  formPayProducts.addEventListener("submit", (e) => {
    const dataPath = formPayProducts.getAttribute("data-path");
    const products = JSON.stringify(selectedProducts);
    formInput.value = products;
    formPayProducts.action = dataPath;
    formAddProduct.submit();
  });
}

const formSearch = document.getElementById("search-box");
if (formSearch) {
  let url = new URL(window.location.href);
  formSearch.addEventListener("submit", (e) => {
    e.preventDefault();
    const keyword = e.target.elements[0].value.toLowerCase().trim();
    if (keyword) {
      url.searchParams.set("search", keyword);
    } else {
      url.searchParams.delete("search");
    }
    window.location.href = url.href;
  });
}

const formAdd = document.getElementById("form-add");
const buttonAddToCart = document.getElementsByClassName("btn-add");

if (buttonAddToCart) {
  Array.from(buttonAddToCart).forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const productId = btn.getAttribute("data-id");
      const dataPath = formAdd.getAttribute("data-path");

      formAdd.action = `${dataPath}/${productId}`;
      formAdd.submit();
    });
  });
}

const formDelete = document.getElementById("form-delete");
if (formDelete) {
  const dataPath = formDelete.getAttribute("data-path");
  const btnDelete = document.querySelectorAll("[button-delete]");
  btnDelete.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const isConfirm = confirm("Are you sure you want to delete ?");
      if (isConfirm) {
        e.preventDefault();
        const dataId = btn.getAttribute("data-id");
        const action = `${dataPath}/${dataId}?_method=DELETE`;
        formDelete.action = action;
        console.log(action);
        formDelete.submit();
      }
    });
  });
}

const checkAll = document.querySelector("[check-all]");
const changeStatus = document.querySelectorAll("[change-status]");
let total = 0;
function updateTotal() {
  total = 0;
  changeStatus.forEach((input) => {
    if (input.checked) {
      const price = parseInt(input.getAttribute("price-product"), 10);
      const quantity = parseInt(input.getAttribute("quantity"), 10);
      total += price * quantity;
    }
  });
  const totalBox = document.getElementById("total-price");
  totalBox.textContent = `${total}`;
}

if (checkAll) {
  checkAll.addEventListener("click", () => {
    const shouldBeChecked = !Array.from(changeStatus).every(
      (input) => input.checked
    );
    changeStatus.forEach((input) => {
      input.checked = shouldBeChecked;
      input.dispatchEvent(new Event("change"));
    });
    updateTotal();
    checkAll.classList.toggle("btn-primary", shouldBeChecked);
  });
}

changeStatus.forEach((inputStatus) => {
  inputStatus.addEventListener("click", () => {
    const allChecked = Array.from(changeStatus).every((input) => input.checked);
    checkAll.classList.toggle("btn-primary", allChecked);
    checkAll.checked = allChecked;
  });

  inputStatus.addEventListener("change", updateTotal);
});

const formIncrease = document.getElementById("form-increase");
if (formIncrease) {
  const btnUp = document.querySelectorAll(".btn-up");
  btnUp.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const dataPath = formIncrease.getAttribute("data-path");
      const productId = btn.getAttribute("data-id");
      formIncrease.action = `${dataPath}/${productId}`;
      formIncrease.submit();
    });
  });
}

const formDecrease = document.getElementById("form-decrease");
if (formDecrease) {
  const btnDown = document.querySelectorAll(".btn-down");
  btnDown.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const dataPath = formDecrease.getAttribute("data-path");
      const productId = btn.getAttribute("data-id");
      formDecrease.action = `${dataPath}/${productId}`;
      formDecrease.submit();
    });
  });
}

const btnViewCart = document.getElementById("btn-view-cart");
if (btnViewCart) {
  btnViewCart.addEventListener("click", () => {
    window.location.href = "/cart/view-cart";
  });
}

const productImg = document.querySelectorAll(".images");
if (productImg) {
  productImg.forEach((img) => {
    img.addEventListener("change", (e) => {
      const imgPreview = document.querySelector(".imagePreview");
      imgPreview.innerHTML = "";
      const files = e.target.files;
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        reader.onload = function (e) {
          const image = new Image();
          image.src = e.target.result;
          image.style.width = "200px";
          image.style.height = "auto";
          imgPreview.appendChild(image);
        };
        reader.readAsDataURL(file);
      }
    });
  });
}

const btnAdminDelete = document.querySelectorAll(".btn-admin-delete");
if (btnAdminDelete) {
  const formAdminDelete = document.getElementById("form-admin-delete");
  btnAdminDelete.forEach((btn) => {
    btn.addEventListener("click", () => {
      const productId = btn.getAttribute("data-id");
      const dataPath = formAdminDelete.getAttribute("data-path");
      formAdminDelete.action = `${dataPath}/${productId}?_method=DELETE`;
      formAdminDelete.submit();
    });
  });
}

const formEmailManagement = document.getElementById("form-mail-management");
if (formEmailManagement) {
  const btnLock = document.querySelectorAll(".btn-lock");
  const btnUnlock = document.querySelectorAll(".btn-unlock");

  btnLock.forEach((btn) => {
    btn.addEventListener("click", () => {
      const dataPath = formEmailManagement.getAttribute("data-path");
      const dataId = btn.getAttribute("data-id");
      formEmailManagement.action = `${dataPath}/lock-account/${dataId}?_method=PATCH`;
      formEmailManagement.submit();
    });
  });

  btnUnlock.forEach((btn) => {
    btn.addEventListener("click", () => {
      const dataPath = formEmailManagement.getAttribute("data-path");
      const dataId = btn.getAttribute("data-id");
      formEmailManagement.action = `${dataPath}/unlock-account/${dataId}?_method=PATCH`;
      formEmailManagement.submit();
    });
  });
}

const formLockAll = document.getElementById("form-lock-all");
const formUnlockAll = document.getElementById("form-unlock-all");
if (formLockAll && formUnlockAll) {
  formLockAll.addEventListener("submit", (e) => {
    e.preventDefault();
    const inputChecked = document.querySelectorAll(".user-checked:checked");
    const arr = Array.from(inputChecked).map((input) => input.value);
    const dataPath = formLockAll.getAttribute("data-path");
    const lockAllInput = formLockAll.querySelector('input[name="lockAll"]');
    lockAllInput.value = arr.join(",");
    formLockAll.action = dataPath;
    formLockAll.submit();
  });

  formUnlockAll.addEventListener("submit", (e) => {
    e.preventDefault();
    const inputChecked = document.querySelectorAll(".user-checked:checked");
    const arr = Array.from(inputChecked).map((input) => input.value);
    const dataPath = formUnlockAll.getAttribute("data-path");
    const unlockAllInput = formUnlockAll.querySelector(
      'input[name="unlockAll"]'
    );
    unlockAllInput.value = arr.join(",");
    formUnlockAll.action = dataPath;
    formUnlockAll.submit();
  });
}

const checkAllAdmin = document.querySelector("[checkAll]");
const emailInput = document.querySelector(".email-address");
if (checkAllAdmin) {
  const userInput = document.querySelectorAll(".user-checked");
  checkAllAdmin.addEventListener("click", () => {
    let isChecked = checkAllAdmin.checked;
    userInput.forEach((item) => {
      item.checked = isChecked;
    });
    updateEmailInput(userInput, emailInput);
  });

  userInput.forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      updateEmailInput(userInput, emailInput);
    });
  });
}

const btnAddToCart = document.querySelectorAll(".btn-add-to-cart");
if (btnAddToCart) {
  const formAddProduct = document.getElementById("form-add-product");
  const inputQuantity = document.getElementById("quantity-detail");

  let quantity = 1;
  inputQuantity?.addEventListener("change", (e) => {
    quantity = e.target.value;
  });

  btnAddToCart.forEach((btn) => {
    btn.addEventListener("click", () => {
      const dataPath = formAddProduct.getAttribute("data-path");
      formAddProduct.action = `${dataPath}/${quantity}`;
      formAddProduct.submit();
    });
  });
}

function updateEmailInput(checkboxes, emailInput) {
  const checkedValues = Array.from(checkboxes)
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => checkbox.value)
    .join(", ");
  emailInput.value = checkedValues;
}

const formDecentralization = document.getElementById("form-decentralization");
const btnRoles = document.querySelectorAll(".btn-role");
if (formDecentralization) {
  btnRoles.forEach((btn) => {
    btn.addEventListener("click", () => {
      const dataPath = formDecentralization.getAttribute("data-path");
      const userId = btn.getAttribute("user-data");
      const currentValue = btn.getAttribute("value");
      formDecentralization.action = `${dataPath}${userId}/${currentValue}?_method=PATCH`;
      formDecentralization.submit();
    });
  });
}

document.addEventListener("DOMContentLoaded", function () {
  const images = document.querySelectorAll(".thumbnail-img");
  const prevButton = document.querySelector(".carousel-prev");
  const nextButton = document.querySelector(".carousel-next");
  let currentIndex = 0;
  function setActiveImage(index) {
    images.forEach((img, i) => {
      img.classList.toggle("active", i === index);
    });
  }
  function showPrevImage() {
    currentIndex = currentIndex > 0 ? currentIndex - 1 : images.length - 1;
    setActiveImage(currentIndex);
  }
  function showNextImage() {
    currentIndex = currentIndex < images.length - 1 ? currentIndex + 1 : 0;
    setActiveImage(currentIndex);
  }
  prevButton?.addEventListener("click", showPrevImage);
  nextButton?.addEventListener("click", showNextImage);
  setActiveImage(currentIndex);
});

document.addEventListener("DOMContentLoaded", () => {
  const socket = io();
  const messagesList = document.getElementById("messages");
  const messageForm = document.getElementById("form-message");
  const messageInput = document.getElementById("chat-input");
  let currentRoom = "";

  socket.on("room_assigned", (room) => {
    currentRoom = room;
  });

  messageForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const message = messageInput.value;
    if (message.length > 0) {
      socket.emit("send_message", { message, room: currentRoom });
      addMessageToList(message, true);
      messageInput.value = "";
    }
  });

  socket.on("message_received", (data) => {
    addMessageToList(data.message, false);
  });

  function addMessageToList(message, isOwnMessage) {
    const item = document.createElement("li");
    item.classList.add("message");
    item.textContent = message;
    if (isOwnMessage) {
      item.style.backgroundColor = "#4399FF";
      item.style.display = "block";
      item.style.float = "right";
    } else {
      item.style.backgroundColor = "#DCE8FF";
      item.style.display = "block";
      item.style.float = "left";
    }
    messagesList.appendChild(item);
    messagesList.scrollTop = messagesList.scrollHeight;
  }
});
