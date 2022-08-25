const socket = io();
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
SECCIÓN PRODUCTOS
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const buttonProduct = document.getElementById("BotonAgregar");
const nameInput = document.getElementById("name");
const priceInput = document.getElementById("price");
const thumbnailInput = document.getElementById("thumbnail");

buttonProduct.addEventListener("click", (e) => {
  const url = "http://localhost:8080/productos";
  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: nameInput.value,
      price: priceInput.value,
      thumbnail: thumbnailInput.value,
    }),
  });

  const msg = "producto agregado";
  socket.emit("productAdded", msg);
});

function printProducts(data) {
  let html = "";
  html += data.map((item) => {
    return `<div class="card mb-3" style="width: 540px; height:150px">
  <div class="row g-0">
    <div class="col-md-4">
      <img src=${item.thumbnail} class="img-fluid rounded-start" style="width:100px" alt="...">
    </div>
    <div class="col-md-8">
      <div class="card-body">
        <h5 class="card-title fw-bolder">${item.title}</h5>
        <p class="card-text">$ ${item.price}</p>
        
      </div>
    </div>
  </div>
</div>`;
  });

  document.getElementById("productsList").innerHTML = html;
}

socket.on("newProducts", function (productList) {
  printProducts(productList);
});

/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
SECCIÓN MENSAJES
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const buttonChat = document.getElementById("buttonChat");

socket.on("messages", (data) => {
  let msgHtml = "";
  msgHtml = data.map((item) => {
    return `<span>
    <p style="color:brown">[${item.time}]</p>
      <p class="text-info fw-bold">${item.user}</p>
      <p class="text-success"><em>${item.comment}</em></p>
    </span>
    <hr>
    `;
  });
  document.getElementById("msg").innerHTML = msgHtml;
});

buttonChat.addEventListener("click", (e) => {
  if (document.getElementById("user").value.trim() === " ") {
    alert("Ingrese un correo electrónico para poder enviar un mensaje.");
    return;
  }
  const msg = {
    user: document.getElementById("user").value,
    comment: document.getElementById("comment").value,
    time: new Date().toLocaleString(),
  };
  socket.emit("new-msg", msg);
});
