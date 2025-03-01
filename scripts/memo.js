document.addEventListener("DOMContentLoaded", function () {

  const fabToggle = document.getElementById("menu-toggle-item");
  const fabToggleIcon = document.getElementById("fab-toggle-icon");
  const bottomSheet = document.getElementById("bottomSheet");
  const fabContainer = document.getElementById("fabContainer");

  $('#create-memo').click(()=>{
    //$('#newMemoModal').modal('show');
    bottomSheet.classList.toggle('active');
    if (bottomSheet.classList.contains('active')){
      fabContainer.style.display = 'none';
    }else{
      setTimeout(()=>{
        fabContainer.style.display = 'flex';
      }, 300);
    }
  })

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


function openSheet() {
  document.getElementById('bottomSheet').classList.add('active');
  if (bottomSheet.classList.contains('active')){
    fabContainer.style.display = 'none';
  }else{
    setTimeout(()=>{
      fabContainer.style.display = 'flex';
    }, 300);
    
  }
}

function closeSheet() {
  document.getElementById('bottomSheet').classList.remove('active');
  if (bottomSheet.classList.contains('active')){
    fabContainer.style.display = 'none';
  }else{
    setTimeout(()=>{
      fabContainer.style.display = 'flex';
    }, 300);
  }
}