// Modal
const openModalButton = document.getElementById("open-modal-btn");
const modal = document.getElementById("modal");
// Suppliers
const suppliersContainer = document.getElementById("suppliers");
const supplierName = document.querySelector(".title"); // rendering the selected supplier name
// CTA buttons
const backButton = document.querySelector(".back-btn");
const closeButton = document.querySelector(".close-btn");
const productSelectedButton = document.querySelector(".product-selected");
const productSelectedBtnPlaceholder = document.querySelector(
  ".product-selected-btn-placeholder"
);
const cancelButton = document.querySelector(".cancel-btn");
const addButton = document.querySelector(".add-btn");
// Search bar
const searchBarContainer = document.querySelector(".search-bar-container");
const searchInput = document.querySelector(".search-input");
// Toast
const toast = document.querySelector(".toast-container");
const toastCloseButton = document.querySelector(".close-button-toast");
const toastMessage = document.querySelector(".toast-message");
// Selected List
const selectedList = document.querySelector(".selected-list");
const selectedProducts = []; // tracking the selected products
// Horizontal rule
const horizontalRuleTop = document.querySelector(".horizontal-rule-top");

// Function to open modal
function openModal() {
  modal.style.display = "block";
  // resetting value to 0
  productSelectedButton.textContent = "0 product selected";
}

// Function to close modal or toast
function closeModalOrToast() {
  modal.style.display = "none";
  toast.style.display = "none";
}

// Opening modal after click
openModalButton.addEventListener("click", openModal);

// Closing the modal after click
closeButton.addEventListener("click", closeModalOrToast);

// Closing the modal by clicking the outside/window
window.addEventListener("click", function (event) {
  if (event.target === modal) {
    modal.style.display = "none";
  }
});

// Cancel Button
cancelButton.addEventListener("click", closeModalOrToast);

// Fetching Suppliers Data
fetch("data/suppliers.json")
  .then((response) => response.json())
  .then((suppliersData) => {
    suppliersData.forEach((supplier) => {
      // Rendering each suppliers name inside a div and appending it inside suppliersContainer
      const supplierElement = document.createElement("div");
      supplierElement.textContent = supplier.name;
      supplierElement.className = "supplier-element";
      supplierElement.setAttribute("tabindex", "0");
      suppliersContainer.appendChild(supplierElement);

      // Rendering chevron icon for each suppliers name
      const chevronIcon = document.createElement("img");
      chevronIcon.src = "assets/chevron-right.png";
      chevronIcon.className = "chevron-icon";
      supplierElement.appendChild(chevronIcon);

      // After Selecting a supplier this function will trigger
      // Note each supplierElement represents an ID, we're using the IDs as arguments
      supplierElement.addEventListener("click", () => {
        displayProducts(supplier.id); // calling displayProducts and passing the ID of the selected supplier
        suppliersContainer.style.display = "none";
        backButton.style.display = "block"; // show back button
      });
    });
  });

// This will run after selecting a supplier
// SupplierId parameter contains the ID of the selected supplier
function displayProducts(supplierId) {
  fetch("data/products.json")
    .then((response) => response.json())
    .then((productsData) => {
      // Fetch suppliers data
      fetch("data/suppliers.json")
        .then((response) => response.json())
        .then((suppliersData) => {
          // Container that shows the list of products including(image, chevron icon)
          const productsContainer = document.getElementById("products");
          // showing list of products after click
          productsContainer.style.display = "block";
          productsContainer.innerHTML = ""; // Clear previous products

          // const products contains the products(parent & child) of the selected supplier
          const products = productsData.data.filter(
            (product) => product.supplierId === supplierId // matching the id
          );

          // const supplier contains the ID of the selected supplier
          const supplier = suppliersData.find(
            (supplier) => supplier.id === supplierId
          );

          // Products (forEach)
          products.forEach((product) => {
            // Container for Parent product, also the accordion.
            const parentProductInfo = document.createElement("div");
            parentProductInfo.className = "parent-product-info";
            parentProductInfo.setAttribute("tabindex", "0");
            productsContainer.appendChild(parentProductInfo);

            // Container for blank image and product-sku (to make it display flex)
            const imgProductSkuContainer = document.createElement("div");
            imgProductSkuContainer.className = "img-product-sku-container";
            parentProductInfo.appendChild(imgProductSkuContainer);

            // Blank image
            const blankImage = document.createElement("img");
            blankImage.src = "./assets/blank-image.png";
            blankImage.className = "blank-image";
            imgProductSkuContainer.appendChild(blankImage);

            // Container for Product name and SKU
            const productSku = document.createElement("div");
            productSku.className = "product-sku";
            imgProductSkuContainer.appendChild(productSku);

            // Render Parent Product Name
            const productName = document.createElement("div");
            productName.textContent = `Product name: ${product.name}`;
            productName.className = "parent-product-name";
            productSku.appendChild(productName);

            // Render Parent SKU, (used the product name)
            const sku = document.createElement("p");
            sku.textContent = `SKU: ${product.name}`;
            sku.className = "parent-sku";
            productSku.appendChild(sku);

            // Render the selected supplier on the top/title
            supplierName.textContent = `${supplier.name}`;

            // Render chevron
            const chevronIcon = document.createElement("img");
            chevronIcon.src = "assets/chevron-right.png";
            chevronIcon.className = "chevron-icon";
            parentProductInfo.appendChild(chevronIcon);

            // Accordion div or child products
            const accordionContent = document.createElement("div");
            accordionContent.className = "accordion-content";
            productsContainer.appendChild(accordionContent);

            // Loop through child products and render their names, SKUs, checkboxes, and quantity inputs
            product.childProducts.forEach((childProduct) => {
              const childProductInfo = document.createElement("div");
              childProductInfo.className = "child-product-info";

              // Deleting a product in selection list
              function deleteSelectedProduct(selectedProductElement) {
                const productName = selectedProductElement.querySelector(
                  ".product-name-selected"
                ).textContent;
                const sku =
                  selectedProductElement.querySelector(
                    ".sku-selected"
                  ).textContent;

                // Remove the selected product from the DOM
                selectedProductElement.remove();

                // Remove the deleted product from the selectedProducts array
                const deletedProduct = `${productName} SKU: ${sku}`;
                const index = selectedProducts.indexOf(deletedProduct);
                if (index !== -1) {
                  selectedProducts.splice(index, 1);
                }

                // Update the selected product count
                updateSelectedProductCount();
              }

              // Event listener for trashButton click
              selectedList.addEventListener("click", (event) => {
                const trashButton = event.target.closest(".trash-button");
                if (trashButton) {
                  const selectedProductElement = trashButton.closest(
                    ".selected-list-content"
                  );
                  if (selectedProductElement) {
                    // Get the product name and SKU for the selected item
                    const productName = selectedProductElement.querySelector(
                      ".product-name-selected"
                    ).textContent;

                    // Call the function to delete the selected product
                    deleteSelectedProduct(selectedProductElement);
                    // Show a toast message with the product name
                    showToastMessage(`Deleted ${productName} successfully`);
                  }
                }
              });

              // Function to show a toast message
              function showToastMessage(message) {
                toastMessage.textContent = message;
                toast.style.display = "flex";
                toast.style.opacity = "1";
                modal.style.display = "none";

                setTimeout(() => {
                  toast.style.opacity = "0";
                  setTimeout(() => {
                    toast.classList.add("hidden");
                  }, 500);
                }, 3000);
              }

              // Function to update the productSelectedButton text/count
              function updateSelectedProductCount() {
                const checkedCheckboxes = document.querySelectorAll(
                  ".child-product-checkbox:checked"
                );
                const selectedCount = checkedCheckboxes.length;

                if (selectedCount > 0) {
                  productSelectedButton.textContent = `${selectedCount} products selected`;
                  productSelectedButton.style.color = "#3E4760";
                } else {
                  productSelectedButton.textContent = "0 product selected";
                  productSelectedButton.style.color = "#808285";
                }
              }
              // Checking if checkbox is checked or unchecked
              const checkboxes = document.querySelectorAll(
                ".child-product-checkbox"
              );
              checkboxes.forEach((checkbox) => {
                checkbox.addEventListener("change", updateSelectedProductCount);
              });

              // Call the function initially to set the initial state
              updateSelectedProductCount();

              //   Checkbox functionality when ON
              function checkBoxOn() {
                childProductInfo.style.backgroundColor = "#E3F1FE";
                quantityInput.disabled = false;
                productSelectedButton.removeAttribute("disabled");
                productSelectedButton.style.color = "#808285";
                cancelButton.removeAttribute("disabled");
                cancelButton.style.color = "#808285";
                addButton.removeAttribute("disabled");
                addButton.style.backgroundColor = "#3E4760";
                addButton.style.color = "#fff";
                addButton.style.border = "none";
                backButton.style.display = "none";
              }

              // Checkbox functionality when OFF
              function checkBoxOff() {
                childProductInfo.style.backgroundColor = "#f5f5f5"; // Reset background color
                quantityInput.disabled = true;
                productSelectedButton.setAttribute("disabled", "disabled");
                cancelButton.setAttribute("disabled", "disabled");
                addButton.style.backgroundColor = "#E5E5E5";
                addButton.style.color = "#C4C4C4";
                addButton.setAttribute("disabled", "disabled");
                backButton.style.display = "block";
              }

              // Selection List
              function updateSelectedProductsList() {
                selectedList.innerHTML = ""; // Clear the previous list

                // selectedProducts [] on line 21
                if (selectedProducts.length > 0) {
                  selectedProducts.forEach((product, index) => {
                    // This will show one row per selected product
                    const selectedListContent = document.createElement("div");
                    selectedListContent.className = "selected-list-content";

                    // Numbering in the Selection List
                    const countNumber = document.createElement("span");
                    countNumber.className = "count-number";
                    countNumber.textContent = `${index + 1}`;
                    selectedListContent.appendChild(countNumber);

                    // blank image
                    const selectionImage = document.createElement("img");
                    selectionImage.src = "./assets/blank-image.png";
                    selectionImage.className = "selection-image";
                    selectedListContent.appendChild(selectionImage);

                    // Container for Product Name and SKU (Selection List)
                    const selectedProductDetails =
                      document.createElement("div");
                    selectedProductDetails.className =
                      "selected-product-details";

                    // Rendering product names on the selections list
                    // Extract the product name and SKU from the selected product string
                    const productName = product.split("SKU: ")[0].trim();
                    const sku = product.split("SKU: ")[1].trim();

                    // Parent Product Name (Selected)
                    const parentProductNameElement =
                      document.createElement("h2");
                    parentProductNameElement.textContent = "";
                    selectedProductDetails.appendChild(
                      parentProductNameElement
                    );

                    //  Product Name (Selected)
                    const productNameElement = document.createElement("h3");
                    productNameElement.textContent = `${productName}`;
                    productNameElement.className = "product-name-selected";
                    selectedProductDetails.appendChild(productNameElement);

                    // SKU (Selected)
                    const skuElement = document.createElement("p");
                    skuElement.textContent = `SKU: ${sku}`;
                    skuElement.className = "sku-selected";
                    selectedProductDetails.appendChild(skuElement);

                    // Input (shows quantity)
                    const selectedProductCount =
                      document.createElement("input");
                    selectedProductCount.className = "selected-product-count";
                    selectedProductCount.readOnly = true;

                    // Trash or Delete button
                    const trashButton = document.createElement("button");
                    trashButton.className = "trash-button";
                    const trashIcon = document.createElement("img");
                    trashIcon.src = "./assets/trash.png";
                    trashIcon.className = "trash-icon";
                    trashButton.appendChild(trashIcon);

                    selectedListContent.appendChild(selectedProductDetails);
                    selectedListContent.appendChild(selectedProductCount);
                    selectedListContent.appendChild(trashButton);
                    selectedList.appendChild(selectedListContent);
                  });
                }
              }

              // Opening Selected List
              productSelectedButton.addEventListener("click", () => {
                suppliersContainer.style.display = "none";
                productsContainer.style.display = "none";
                searchBarContainer.style.display = "none";
                backButton.style.display = "block";
                // show selected list
                selectedList.style.display = "block";
                // Remove functionality of addButton temporarily
                addButton.setAttribute("disabled", "disabled");
                // Updating name title to Selection
                supplierName.textContent = "Selection";
                // horizontal rule top adjustment
                horizontalRuleTop.style.position = "absolute";
                horizontalRuleTop.style.top = "16.3%";
                horizontalRuleTop.style.left = "0";
                horizontalRuleTop.style.right = "0";
                // Hiding the prductSelectedButton on selection
                productSelectedButton.style.display = "none";
                productSelectedBtnPlaceholder.style.display = "block";
              });

              // Create a checkbox for the child product
              const checkbox = document.createElement("input");
              checkbox.type = "checkbox";
              checkbox.className = "child-product-checkbox";

              // Checkbox on/off functionality
              const temporarySelectedItems = []; // temporary array to store selected items
              checkbox.addEventListener("change", () => {
                const selectedChildProduct = productDetails.textContent;

                if (checkbox.checked) {
                  checkBoxOn();
                  // Add the selected product to the temporary array if it's not already in the array
                  if (!temporarySelectedItems.includes(selectedChildProduct)) {
                    temporarySelectedItems.push(selectedChildProduct);
                  }
                } else {
                  checkBoxOff();
                  // Remove the deselected product from the temporary array
                  const index =
                    temporarySelectedItems.indexOf(selectedChildProduct);
                  if (index !== -1) {
                    temporarySelectedItems.splice(index, 1);
                  }
                }
              });

              childProductInfo.appendChild(checkbox);

              //   Clicking the addButton(showing toast, adding items and reflecting input values)
              addButton.addEventListener("click", () => {
                // Add the items from temporarySelectedItems to selectedProducts
                selectedProducts.push(...temporarySelectedItems);
                updateSelectedProductsList();
                temporarySelectedItems.length = 0;
                closeModalOrToast();

                // Generate a toast message based on selected products
                const selectedProductCount = selectedProducts.length;
                let toastMessageText = "";

                if (selectedProductCount === 0) {
                  toastMessageText = "No products were added.";
                } else if (selectedProductCount === 1) {
                  toastMessageText = `Add "${selectedProducts[0]}" successfully.`;
                } else {
                  toastMessageText = `Added ${selectedProductCount} products successfully`;
                }

                toastMessage.textContent = toastMessageText;

                modal.style.display = "none";
                toast.style.display = "flex";
                toast.style.opacity = "1";

                // Toast message duration
                setTimeout(() => {
                  toast.style.opacity = "0";
                  setTimeout(() => {
                    toast.classList.add("hidden");
                  }, 500);
                }, 3000);

                productsContainer.style.display = "none";
                suppliersContainer.style.display = "block";

                // Reflecting entered value to selection list
                const enteredValue =
                  document.querySelectorAll(".quantity-input");
                const showValue = document.querySelectorAll(
                  ".selected-product-count"
                );

                enteredValue.forEach((input, index) => {
                  if (showValue[index]) {
                    // Check if showValue[index] is defined
                    showValue[index].value = input.value;
                  }
                });
              });

              //   Toast Close button functionality
              toastCloseButton.addEventListener("click", closeModalOrToast);

              // Container for child product name and SKU
              const productDetails = document.createElement("div");
              productDetails.className = "product-details";

              //  Rendering Child Products

              // Container for checkbox and product details(name and sku)
              const checkboxProductDetailsDiv = document.createElement("div");
              checkboxProductDetailsDiv.className =
                "checkbox-product-details-container";
              childProductInfo.appendChild(checkboxProductDetailsDiv);
              checkboxProductDetailsDiv.appendChild(checkbox);

              // Render Child Product Name and SKU
              const productName = document.createElement("h3");
              productName.textContent = `Child Product: ${childProduct.name}`;
              productDetails.appendChild(productName);

              const sku = document.createElement("p");
              sku.textContent = `SKU: ${childProduct.sku}`;
              productDetails.appendChild(sku);

              childProductInfo.appendChild(productDetails);
              checkboxProductDetailsDiv.appendChild(productDetails);

              // Create an input for adding quantity
              const quantityInput = document.createElement("input");
              quantityInput.type = "text";
              quantityInput.className = "quantity-input";
              quantityInput.placeholder = "1";
              quantityInput.disabled = true;
              childProductInfo.appendChild(quantityInput);

              // From Stack overflow - Input without dropdown and only accept numbers
              // https://stackoverflow.com/questions/13952686/how-to-make-html-input-tag-only-accept-numerical-values
              function numberOnly(e) {
                var inputValue = this.value.replace(
                  new RegExp(/[^\d]/, "ig"),
                  ""
                );
                this.value = inputValue;
              }
              quantityInput.addEventListener("input", numberOnly);

              //   Show child products and rotate chevron icon
              parentProductInfo.addEventListener("click", () => {
                if (childProductInfo.style.display === "flex") {
                  childProductInfo.style.display = "none";
                  chevronIcon.src = "assets/chevron-right.png";
                } else {
                  childProductInfo.style.display = "flex";
                  chevronIcon.src = "assets/chevron-down.png";
                }
              });

              accordionContent.appendChild(childProductInfo);

              // Back button functionality
              backButton.addEventListener("click", function () {
                suppliersContainer.style.display = "block";
                productsContainer.style.display = "none";
                backButton.style.display = "none";
                supplierName.textContent = "Select Supplier";
                selectedList.style.display = "none";
                searchBarContainer.style.display = "flex";
                horizontalRuleTop.style.top = "26.4%";
                productSelectedButton.style.display = "block";
              });
            });
          });
        });
    });
}

// Arrow keys functionality - Listen for arrow key presses on the document
const suppliersList = suppliersContainer.getElementsByTagName("div");
suppliersContainer.addEventListener("keydown", (event) => {
  const focusedItem = document.activeElement;

  if (event.key === "ArrowDown" || event.key === "ArrowUp") {
    event.preventDefault();

    let index = Array.from(suppliersList).indexOf(focusedItem);

    if (event.key === "ArrowDown") {
      index = (index + 1) % suppliersList.length;
    } else if (event.key === "ArrowUp") {
      index = (index - 1 + suppliersList.length) % suppliersList.length;
    }

    suppliersList[index].focus();
  } else if (event.key === "Enter") {
    event.preventDefault();
    focusedItem.click(); // Simulate a click after hitting enter btn
  }
});

// Search functionality
searchInput.addEventListener("input", (event) => {
  const searchTerm = event.target.value.toLowerCase();

  // Filter parent products
  const parentProducts = document.querySelectorAll(".parent-product-info");
  parentProducts.forEach((parentProduct) => {
    const parentProductName = parentProduct
      .querySelector(".product-sku div")
      .textContent.toLowerCase();
    if (parentProductName.includes(searchTerm)) {
      parentProduct.style.display = "flex";
    } else {
      parentProduct.style.display = "none";
    }
  });

  // Filter child products
  const childProducts = document.querySelectorAll(".child-product-info");
  childProducts.forEach((childProduct) => {
    const childProductName = childProduct
      .querySelector(".product-details h3")
      .textContent.toLowerCase();
    if (childProductName.includes(searchTerm)) {
      childProduct.style.display = "flex";
      childProduct.parentElement.querySelector(
        ".parent-product-info"
      ).style.display = "flex";
    } else {
      childProduct.style.display = "none";
    }
  });
});
