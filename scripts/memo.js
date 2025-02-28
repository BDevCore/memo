document.addEventListener("DOMContentLoaded", function () {

  const modal = document.getElementById("addMemoModal");
  const createMemo = document.getElementById("create-memo");
  const closeBtn = document.querySelector(".close");
  const saveBtn = document.getElementById("saveMemo");

  const fabToggle = document.getElementById("menu-toggle-item");
  const fabToggleIcon = document.getElementById("fab-toggle-icon");
  fabToggle.addEventListener("click", function (event) {

    document.getElementById("fabContainer").classList.toggle("fab-expanded");

    if (fabContainer.classList.contains("fab-expanded")) {
      fabToggleIcon.classList.replace("fa-list-ul", "fa-xmark");
    } else {
      fabToggleIcon.classList.replace("fa-xmark", "fa-list-ul");
    }

    event.stopPropagation();
  });

  document.addEventListener("click", function (event) {
    if (!fabContainer.contains(event.target)) {
      fabContainer.classList.remove("fab-expanded");
      fabToggleIcon.classList.replace("fa-xmark", "fa-list-ul");
    }
  });

  // Open modal
  createMemo.addEventListener("click", () => {
    modal.style.display = "flex";
    fabContainer.classList.remove("fab-expanded");
    fabToggleIcon.classList.replace("fa-xmark", "fa-list-ul");
  });

  // Close modal
  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // Close modal when clicking outside
  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });


  document.querySelector('#memo-container').style.display = 'none';

  document.querySelectorAll(".memo-menu").forEach(button => {
    button.addEventListener("click", function (event) {

      event.stopPropagation();

      let menu = this.nextElementSibling;
      document.querySelectorAll(".memo-popup-menu").forEach(m => {
        if (m !== menu) m.style.display = "none";
      });

      // Toggle visibility
      menu.style.display = (menu.style.display === "block") ? "none" : "block";
    });
  });

  // Hide menu when clicking outside
  document.addEventListener("click", function () {
    document.querySelectorAll(".memo-popup-menu").forEach(menu => {
      menu.style.display = "none";
    });
  });
});


setTimeout(() => {
  var loaderOverlay = document.querySelector('#loader-overlay');
  loaderOverlay.style.display = 'none';
  document.querySelector('#memo-container').style.display = 'grid';
}, 2000);

document.addEventListener("click", function (event) {
  // Check if the clicked element is a delete button
  if (event.target.closest(".memo-menu-delete")) {
    let memoElement = event.target.closest(".card.memo"); // Get the parent memo card
    let memoId = memoElement.querySelector(".memo-id")?.value; // Get memo ID

    if (!memoId) {
      console.warn("No memo ID found, skipping delete.");
      return;
    }

    console.log("Deleting memo with ID:", memoId);

    // Remove memo from DOM
    memoElement.remove();
  }
});