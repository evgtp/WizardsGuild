const container = document.querySelector(".main__body");

const BASE_URL = "http://localhost:4000";

function createOrderElement(order) {
   const item = document.createElement("div");
   item.classList.add("card__item");

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

   const deleteButton = document.createElement("button");
   deleteButton.classList.add("card__item-delete-button");
   deleteButton.textContent = "Удалить";
   deleteButton.dataset.itemId = order.id;
   deleteButton.addEventListener("click", () => deleteCard(order.id));
   item.appendChild(deleteButton);

   return item;
}

async function getDataAll() {
   try {
      const response = await fetch(`${BASE_URL}/orders`);

      if (!response.ok) {
         throw new Error(`HTTP error! status: ${response.status}`);
      }

      const dataAll = await response.json();
      dataAll.forEach((el) => {
         const orderElement = createOrderElement(el);
         container.appendChild(orderElement);
      });
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

      return createOrderElement(dataOne);
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
         `button[data-item-id="${id}"]`
      ).parentElement;
      itemToRemove.remove();
   } catch (error) {
      console.error("Error deleting order:", error);
   }
}

function deleteCard(id) {
   const wrapperModal = document.createElement("div");
   wrapperModal.classList.add("wrapper__modal");
   document.body.appendChild(wrapperModal);

   const modal = document.createElement("div");
   modal.classList.add("modal__body");
   wrapperModal.appendChild(modal);

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
   buttonConfirm.addEventListener("click", () => {
      deleteItem(id);
      document.body.removeChild(wrapperModal);
   });
   buttonBlock.appendChild(buttonConfirm);

   const buttonCancel = document.createElement("button");
   buttonCancel.classList.add("modal__button-cancel");
   buttonCancel.textContent = "Нет конечно!";
   buttonCancel.addEventListener("click", () => {
      document.body.removeChild(wrapperModal);
   });
   buttonBlock.appendChild(buttonCancel);
}

document.addEventListener("DOMContentLoaded", getDataAll);
