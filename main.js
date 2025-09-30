const container = document.querySelector(".main__body");

const BASE_URL = "http://localhost:4000";

async function getDataAll() {
   try {
      const response = await fetch(`${BASE_URL}/orders`);

      if (!response.ok) {
         throw new Error(`HTTP error! status: ${response.status}`);
      }
      const dataAll = await response.json();
      renderCards(dataAll);
   } catch (error) {
      console.error("Error receiving data:", error);
   }
}

async function getItem(id) {
   try {
      const response = await fetch(`${BASE_URL}/orders/${id}`);

      if (!response.ok) {
         throw new Error(`HTTP error! status: ${response.status}`);
      }

      const dataOne = await response.json();

      return dataOne;
   } catch (error) {
      console.error("Error receiving data:", error);
      return null;
   }
}

async function deleteItem(id) {
   try {
      const response = await fetch(`${BASE_URL}/orders/${id}`, {
         method: "DELETE",
      });

      if (!response.ok) {
         throw new Error(`HTTP error! status: ${response.status}`);
      }

      const itemToRemove = document.querySelector(
         `.card__item[data-order-id="${id}"]`
      );
      if (itemToRemove) itemToRemove.remove();
   } catch (error) {
      console.error("Error deleting order:", error);
   }
}

async function updateItem(order) {
   try {
      const response = await fetch(`${BASE_URL}/orders/${order.id}`, {
         method: "PUT",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify(order),
      });
      if (!response.ok)
         throw new Error(`HTTP error! status: ${response.status}`);
      try {
         const updated = await response.json();
         return updated || order;
      } catch {
         return order;
      }
   } catch (error) {
      console.error("Error updating order:", error);
      throw error;
   }
}

function createOrderElement(order) {
   const item = document.createElement("div");
   item.classList.add("card__item");
   item.dataset.orderId = order.id;

   const blockImage = document.createElement("div");
   blockImage.classList.add("card__item-image-block");
   item.appendChild(blockImage);

   const blockInfo = document.createElement("div");
   blockInfo.classList.add("card__item-info-block");
   item.appendChild(blockInfo);

   const itemImage = document.createElement("img");
   itemImage.classList.add("card__item-image");
   itemImage.src = order.assignee.avatar;
   itemImage.alt = order.assignee.name;
   blockImage.appendChild(itemImage);

   const itemName = document.createElement("h2");
   itemName.classList.add("card__item-name");
   itemName.textContent = order.assignee.name;
   blockInfo.appendChild(itemName);

   const itemCustomer = document.createElement("span");
   itemCustomer.classList.add("card__item-customer");
   itemCustomer.textContent = `заказчик: ${order.customerName}`;
   blockInfo.appendChild(itemCustomer);

   const itemTitle = document.createElement("span");
   itemTitle.classList.add("card__item-title");
   itemTitle.textContent = `задание: ${order.title}`;
   blockInfo.appendChild(itemTitle);

   const itemDescription = document.createElement("span");
   itemDescription.classList.add("card__item-description");
   itemDescription.textContent = `описание: ${order.description}`;
   blockInfo.appendChild(itemDescription);

   const itemReward = document.createElement("span");
   itemReward.classList.add("card__item-reward");
   itemReward.textContent = `награда: ${order.reward}`;
   blockInfo.appendChild(itemReward);

   const itemStatus = document.createElement("span");
   itemStatus.classList.add("card__item-status");
   itemStatus.textContent = `status: ${order.status}`;
   blockInfo.appendChild(itemStatus);

   const itemDeadline = document.createElement("span");
   itemDeadline.classList.add("card__item-deadline");
   itemDeadline.textContent = order.deadline;
   blockInfo.appendChild(itemDeadline);

   const itemCreatedAt = document.createElement("span");
   itemCreatedAt.classList.add("card__item-createdAt");
   itemCreatedAt.textContent = order.createdAt;
   blockInfo.appendChild(itemCreatedAt);

   const blockButtons = document.createElement("div");
   blockButtons.classList.add("card-item__block-buttons");

   const deleteButton = document.createElement("button");
   deleteButton.classList.add("card__item-delete-button");
   deleteButton.textContent = "Удалить";
   deleteButton.dataset.itemId = order.id;
   deleteButton.addEventListener("click", () => renderDeleteModal(order.id));
   blockButtons.appendChild(deleteButton);

   const editButton = document.createElement("button");
   editButton.classList.add("card__item-edit-button");
   editButton.textContent = "Редактировать";
   editButton.addEventListener("click", () => renderEditModal(order));
   blockButtons.appendChild(editButton);

   item.appendChild(blockButtons);

   return item;
}

function renderCards(data) {
   container.innerHTML = "";
   if (!Array.isArray(data) || data.length === 0) {
      container.textContent = "Карточек нет.";
      return;
   }
   data.forEach((el) => {
      const orderElement = createOrderElement(el);
      container.appendChild(orderElement);
   });
}

function createModal() {
   const wrapperModal = document.createElement("div");
   wrapperModal.classList.add("wrapper__modal");
   wrapperModal.addEventListener("click", (e) => {
      if (e.target === wrapperModal) wrapperModal.remove();
   });
   const modal = document.createElement("div");
   modal.classList.add("modal__body");
   wrapperModal.appendChild(modal);
   document.body.appendChild(wrapperModal);

   return {
      wrapperModal,
      modal,
      close: () => {
         if (wrapperModal.parentElement)
            wrapperModal.parentElement.removeChild(wrapperModal);
      },
   };
}

function updateCardInDOM(updatedOrder) {
   const card = document.querySelector(
      `.card__item[data-order-id="${updatedOrder.id}"]`
   );
   if (!card) return;

   const titleEl = card.querySelector(".card__item-title");
   const descEl = card.querySelector(".card__item-description");

   if (titleEl) titleEl.textContent = `задание: ${updatedOrder.title}`;
   if (descEl) descEl.textContent = `описание: ${updatedOrder.description}`;
}

function renderDeleteModal(id) {
   const { wrapperModal, modal, close } = createModal();

   const modalTitle = document.createElement("h2");
   modalTitle.classList.add("modal__title");
   modalTitle.textContent = "Вы действительно хотите удалить карточку?";
   modal.appendChild(modalTitle);

   const buttonBlock = document.createElement("div");
   buttonBlock.classList.add("modal__button-block");
   modal.appendChild(buttonBlock);

   const buttonConfirm = document.createElement("button");
   buttonConfirm.classList.add("modal__button-confirmation");
   buttonConfirm.textContent = "Естественно";
   buttonConfirm.addEventListener("click", async () => {
      await deleteItem(id);
      close();
   });
   buttonBlock.appendChild(buttonConfirm);

   const buttonCancel = document.createElement("button");
   buttonCancel.classList.add("modal__button-cancel");
   buttonCancel.textContent = "Нет, не удалять";
   buttonCancel.addEventListener("click", () => {
      close();
   });
   buttonBlock.appendChild(buttonCancel);
}

async function renderEditModal(order) {
   let fullOrder = order;
   if (!order || !order.id) return;

   const { wrapperModal, modal, close } = createModal();

   const modalTitle = document.createElement("h2");
   modalTitle.classList.add("modal__title");
   modalTitle.textContent = "Редактировать задание";
   modal.appendChild(modalTitle);

   const form = document.createElement("form");
   form.classList.add("modal__form");

   const labelTitle = document.createElement("label");
   labelTitle.textContent = "Title";
   const inputTitle = document.createElement("input");
   inputTitle.classList.add("modal__form-input-title");
   inputTitle.type = "text";
   inputTitle.name = "title";
   inputTitle.value = fullOrder.title || "";
   labelTitle.appendChild(inputTitle);
   form.appendChild(labelTitle);

   const labelDesc = document.createElement("label");
   labelDesc.textContent = "Description";
   const inputDescription = document.createElement("input");
   inputDescription.classList.add("modal__form-input-description");
   inputDescription.type = "text";
   inputDescription.name = "description";
   inputDescription.value = fullOrder.description || "";
   labelDesc.appendChild(inputDescription);
   form.appendChild(labelDesc);

   const buttonBlock = document.createElement("div");
   buttonBlock.classList.add("modal__button-block");
   form.appendChild(buttonBlock);

   const saveButton = document.createElement("button");
   saveButton.type = "button";
   saveButton.classList.add("modal__button-save");
   saveButton.textContent = "Сохранить";
   saveButton.addEventListener("click", async () => {
      const updatedOrder = {
         ...fullOrder,
         title: inputTitle.value,
         description: inputDescription.value,
      };
      try {
         const updatedFromServer = await updateItem(updatedOrder);

         updateCardInDOM(updatedFromServer || updatedOrder);
         close();
      } catch (err) {
         console.error("Ошибка при обновлении:", err);
         alert("Не удалось обновить заказ. Попробуйте снова.");
      }
   });

   buttonBlock.appendChild(saveButton);

   const cancelButton = document.createElement("button");
   cancelButton.type = "button";
   cancelButton.classList.add("modal__button-cancel");
   cancelButton.textContent = "Отмена";
   cancelButton.addEventListener("click", () => close());
   buttonBlock.appendChild(cancelButton);

   modal.appendChild(form);
}

document.addEventListener("DOMContentLoaded", getDataAll);
