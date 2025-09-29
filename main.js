const container = document.querySelector(".main__body");
async function getData() {
   const url = "http://localhost:3000/orders";

   try {
      const response = await fetch(url);

      if (!response.ok) {
         throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log(data);
      data.forEach((el) => {
         const item = document.createElement("div");
         container.appendChild(item);

         const itemTitle = document.createElement("h2");
         itemTitle.textContent = el.title;
         item.appendChild(itemTitle);

         const itemDescription = document.createElement("p");
         itemDescription.textContent = el.description;
         item.appendChild(itemDescription);

         const itemCard = document.createElement("div");
         item.appendChild(itemCard);

         const itemImage = document.createElement("img");
         itemImage.src = el.assignee.avatar;
         itemImage.alt = el.assignee.name;
         itemCard.appendChild(itemImage);

         const itemName = document.createElement("span");
         itemName.textContent = el.assignee.name;
         itemCard.appendChild(itemName);

         const itemStatus = document.createElement("span");
         itemStatus.textContent = el.status;
         item.appendChild(itemStatus);

         const itemReward = document.createElement("span");
         itemReward.textContent = el.itemReward;
         item.appendChild(itemReward);

         const itemDeadline = document.createElement("span");
         itemDeadline.textContent = el.deadline;
         item.appendChild(itemDeadline);

         const itemCreatedAT = document.createElement("span");
         itemCreatedAT.textContent = el.createdAt;
         item.appendChild(itemCreatedAT);
      });
   } catch (error) {
      console.error("Error receiving data:", error);
      return null;
   }
}

document.addEventListener("DOMContentLoaded", getData);
