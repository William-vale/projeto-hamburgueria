const menu = document.getElementById("menu");
const cardCarrinho = document.getElementById("card-carrinho"); 
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("card-total");
const cartContador = document.getElementById("cart-count");
const fecharModal = document.getElementById("close-btn-modal");
const finalizarPedido = document.getElementById("checkout-btn");
const endereco = document.getElementById("address");
const enderecoErrado = document.getElementById("address-warn");
const horarioRestaurante = document.getElementById("date-span");

let cart = []

// abrir o modal do carrinho
cardCarrinho.addEventListener("click", function() {
    cartModal.style.display = "flex"
    updateCart();
})

// Fechar o modal quando clicar fora
cartModal.addEventListener("click", function(event) {
    if(event.target === cartModal) {
        cartModal.style.display = "none";
    }
})

fecharModal.addEventListener("click", function() {
    cartModal.style.display = "none";
})

// adicionar no carrinho
menu.addEventListener("click", function(event) {
    let parentButton = event.target.closest(".btn-cart")

    if(parentButton) {
        const name = parentButton.getAttribute("data-name") 
        const price = parseFloat(parentButton.getAttribute("data-price"))
        addToCart(name, price)
    }
})

function addToCart(name, price) {
    const existeItem = cart.find(item => item.name === name)

    if(existeItem) {
        existeItem.quantity += 1;
        return;
    } else {
        cart.push({
            name,
            price,
            quantity: 1,
        })

    }
    
    updateCart();
}

// Atualizar as coisas no carrinho
function updateCart() {
    cartItems.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")

        cartItemElement.innerHTML = `
            <div class="flex items-center justify-between">
                <div>
                    <p class="font-bold">${item.name}</p>
                    <p>Qtd: ${item.quantity}</p>
                    <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
                </div>

                <button class="remove-btn" data-name="${item.name}">
                    Remover
                </button>
            </div>
        `

        total += item.price * item.quantity;
        
        
        cartItems.appendChild(cartItemElement);
    })

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    cartContador.innerHTML = cart.length;
}

// Função para remover o item do carrinho
cartItems.addEventListener('click', function(event) {
    if(event.target.classList.contains("remove-btn")) {
        const name = event.target.getAttribute("data-name");

        removeItemsCart(name);

    }
})

function removeItemsCart(name) {
    const index = cart.findIndex(item => item.name === name);
    
    if(index !== -1) {
        const item = cart[index];
        
        if(item.quantity > 1){
            item.quantity -= 1;
            updateCart()
            return;
        }

        cart.splice(index, 1);
        updateCart();
    }
}

endereco.addEventListener("input", function(event) {
    const inputValue = event.target.value;
    
    if (inputValue !== "") {
        endereco.classList.remove("border-red-500");
        enderecoErrado.classList.add("hidden");
    }
});

finalizarPedido.addEventListener("click", function() {
    const isOpen = checkRestaurantOpen();
    
    if (!isOpen) {
        Toastify({
            text: "Ops restaurante fechado no momento!",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: "#af4444",
            },
        }).showToast();

        return;
    }

    if(cart.length === 0) return;
    if(endereco.value === ""){
        enderecoErrado.classList.remove("hidden");
        endereco.classList.add("border-red-500");
        return;
    }

    // Enviar pedido para a api do wpp
    const cartItems = cart.map((item) => {
        return (
            ` ${item.name} Quantidade: (${item.quantity}) Preço: R$${item.price} |`
        );
    }).join("")

    const message = encodeURIComponent(cartItems);
    const phone = "88996273564";

    window.open(`https://wa.me/${phone}?text=${message} Endereço: ${endereco.value}`, "_blank");

    cart = [];
    updateCart();
});


// Verificar se o Resturante está ou não aberto
function checkRestaurantOpen() {
    const data = new Date();
    const hora = data.getHours();
    return hora >= 18 && hora < 22; 
}

const isOpen = checkRestaurantOpen();

if (isOpen) {
    horarioRestaurante.classList.remove("bg-red-500");
    horarioRestaurante.classList.add("bg-green-500");
}else {
    horarioRestaurante.classList.remove("bg-green-500");
    horarioRestaurante.classList.add("bg-red-500");
}