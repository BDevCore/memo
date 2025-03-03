document.addEventListener("DOMContentLoaded", function () {

  const tx = document.getElementsByTagName("textarea");
  for (let i = 0; i < tx.length; i++) {
    tx[i].setAttribute("style", "height:" + (tx[i].scrollHeight) + "px;overflow-y:hidden;");
    tx[i].addEventListener("input", OnInput, false);
  }

  function OnInput() {
    this.style.height = "auto";
    this.style.height = (this.scrollHeight) + "px";
  }


  $('#memoEditModal').on('shown.bs.modal', function (e) {

  });


  const fabToggle = document.getElementById("menu-toggle-item");
  const fabToggleIcon = document.getElementById("fab-toggle-icon");
  const bottomSheet = document.getElementById("bottomSheet");
  const fabContainer = document.getElementById("fabContainer");

  loadMemos();

  $('#create-memo').click(() => {
    //$('#newMemoModal').modal('show');
    bottomSheet.classList.toggle('active');
    if (bottomSheet.classList.contains('active')) {
      fabContainer.style.display = 'none';
    } else {
      setTimeout(() => {
        fabContainer.style.display = 'flex';
      }, 300);
    }
  });

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
  if (bottomSheet.classList.contains('active')) {
    fabContainer.style.display = 'none';
  } else {
    setTimeout(() => {
      fabContainer.style.display = 'flex';
    }, 300);

  }
}

function closeSheet() {
  document.getElementById('bottomSheet').classList.remove('active');
  $('#memo-editor').val('');
  if (bottomSheet.classList.contains('active')) {
    fabContainer.style.display = 'none';
  } else {
    setTimeout(() => {
      fabContainer.style.display = 'flex';
    }, 300);
  }
}


$('#save-memo-btn').click(() => {
  var memo = $('#memo-editor').val().trim();
  var title = $('#memo-title').val().trim();
  if (!memo) return;

  var memoTxt = localStorage.getItem("memo");
  var memos = memoTxt ? JSON.parse(memoTxt) : [];

  const date = new Date();

  memo = {
    id: Math.floor(Math.random() * 1000000000),
    created_on: date.toLocaleString('en-GB', { hour12: false }),
    edited_on: "",
    category: 'General',
    visibility: true,
    checked: false,
    checked_on: '',
    title: title,
    text: memo
  }

  memos.push(memo);

  localStorage.setItem("memo", JSON.stringify(memos));

  //Hide bottomsheet
  closeSheet();
  showToast("Memo saved", "Saving memo", "Now");
});


function getDate() {
  const today = new Date();
  const yyyy = today.getFullYear();
  let mm = today.getMonth() + 1; // Months start at 0!
  let dd = today.getDate();
  let hr = today.getHours();
  let min = today.getMinutes;

  if (dd < 10) dd = '0' + dd;
  if (mm < 10) mm = '0' + mm;

  const formattedToday = dd + '-' + mm + '-' + yyyy + ' ' + hr + ' ' + min;

  return formattedToday;
}

function showToast(msg, title = "", timeStamp = "") {
  const toast = document.getElementById('pageToast')

  const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toast);
  $('#toast-title').text(title);
  $('#toast-timestamp').text(timeStamp);
  $('#toast-body').html(msg);

  toastBootstrap.show()

  loadMemos();
}


function loadMemos() {
  let memos = localStorage.getItem('memo');

  if (!memos) memos = "[]";

  memos = JSON.parse(memos);

  if (memos.length <= 0) {
    $('#memo-hint').removeClass('d-none');
    $('#memo-hint').html('No memo available!<br>Click on menu button to create memo')
  }
  else $('#memo-hint').addClass('d-none');

  $('#memos').html('');
  memos.forEach((memo, i) => {
    var checked = memo.checked ? 'checked' : '';
    const checked_status = (memo.checked_on && memo.checked) ? `Marked completed on ${memo.checked_on}` : '';
    const timestamp_status = !memo.edited_on ? memo.created_on : `Edited on ${memo.edited_on}`;
    const title = memo.title ? memo.title : '';
    $('#memos').prepend(`<div class="card memo shadow-1">
                          <span class="memo-timestamp">${timestamp_status}</span>
                          <div class="d-flex align-items-center">
                          <span class="text-small ps-2"><strong>${title}</strong></span>
                          <input type="checkbox" class="memo-check form-check-input ms-auto m-2" ${checked} data-id="${memo.id}">
                          </div>
                          <div class="memo-text-preview">${memo.text}</div>
                          <div class="memo-footer-bar">
                            <i class="fa-solid fa-pen me-3 memo-edit" data-id="${memo.id}"></i>
                            <i class="fa-solid fa-trash memo-delete" data-id="${memo.id}"></i>
                            <span class="memo-edit-status ms-auto">${checked_status}</span>
                          </div>
                        </div>`
    );
  });


  $(".memo-edit").off('click').click((e) => {

    const memoId = e.target.getAttribute("data-id");
    let memos = localStorage.getItem('memo');

    if (!memos) memos = "[]";

    memos = JSON.parse(memos);
    memo = memos.find(obj => Number(obj.id) === Number(memoId));

    if (!memo) {
      showToast("Unable to found memo provided!", "Deleting memo", "");
      return;
    }

    const memoText = memo.text;
    const category = memo.category;
    const title = memo.title;


    $('#memo-content-editor').val(memoText);
    $('#memo-catogory-editor').val(category);
    $('#memo-title-editor').val(title);

    $('#save-changes-btn').prop('disabled', true);

    $('#memoEditModal').modal('show');

    setTimeout(() => {
      document.getElementById("memo-content-editor").style.height = "auto";
      document.getElementById("memo-content-editor").style.height = document.getElementById("memo-content-editor").scrollHeight + "px";
    }, 150);


    $('#memo-content-editor').on('keyup', (e)=>{
      const changes = e.target.value;
      if (changes !== memo.text) $('#save-changes-btn').prop('disabled', false);
      else $('#save-changes-btn').prop('disabled', true);
    });

    $('#memo-catogory-editor').on('keyup', (e)=>{
      const changes = e.target.value;
      if (changes !== memo.category) $('#save-changes-btn').prop('disabled', false);
      else $('#save-changes-btn').prop('disabled', true);
    });

    $('#memo-title-editor').on('keyup', (e)=>{
      const changes = e.target.value;
      if (changes !== memo.title) $('#save-changes-btn').prop('disabled', false);
      else $('#save-changes-btn').prop('disabled', true);
    });
    
    $('#save-changes-btn').off('click').click((e) => {

      const newText = $('#memo-content-editor').val();
      const newCategory = $('#memo-catogory-editor').val();
      const newTitle = $('#memo-title-editor').val();

      const memoIndex = memos.findIndex(obj => String(obj.id) === String(memoId));
      const dateNow = new Date().toLocaleString('en-GB', { hour12: false });

      if (memoIndex !== -1) {

        memos[memoIndex].text = newText;
        memos[memoIndex].category = newCategory;
        memos[memoIndex].edited_on = dateNow;
        memos[memoIndex].title = newTitle;

        localStorage.setItem('memo', JSON.stringify(memos));

        $('#memoEditModal').modal('hide');
        showToast("Memo state updated!", "Updating memo", "");

        $('#memo-content-editor').val('');
        $('#memo-catogory-editor').val('');
        $('#memo-title-editor').val('');

      } else {
        console.warn("Memo not found with ID:", memoId);
        showToast("Memo not found!", "Updating memo", "");
      }


    })

  });

  $(".memo-delete").click((e) => {
    const memoId = e.target.getAttribute("data-id");
    $('#modal-confirm-pos-btn').removeClass("btn-primary").addClass('btn-danger');
    $('#modal-confirm-pos-btn').text('Delete');
    $('#confirmation-modal-body').html('<p>Do you want to delete this memo?<br><br><small><strong>Changes can\'t be undone!</strong></small></p>');
    $('#modal-confirm-pos-btn').off('click').click((e) => {
      deleteMemo(memoId);
    })
    $('#confirmationModal').modal('show');

  });

  $(".memo-check").change(function (e) {
    const memoId = e.target.getAttribute("data-id");

    let checked = $(this).is(":checked");

    let memos = localStorage.getItem('memo');

    const checkedDate = new Date().toLocaleString('en-GB', { hour12: false });

    if (!memos) {
      showToast("Failed to retrieve memos", "Getting memos", "");
      return;
    }

    memos = JSON.parse(memos);

    if (!Array.isArray(memos)) {
      showToast("There was an internal error!", "Getting memos", "");
      return;
    }

    const memoIndex = memos.findIndex(obj => String(obj.id) === String(memoId));

    if (memoIndex !== -1) {
      memos[memoIndex].checked = checked;
      memos[memoIndex].checked_on = checkedDate;
      localStorage.setItem('memo', JSON.stringify(memos));
      showToast("Memo state updated!", "Updating memo", "");
    } else {
      console.warn("Memo not found with ID:", memoId);
      showToast("Memo not found!", "Updating memo", "")
    }
  });


}

function deleteMemo(memoId) {


  console.log("ID: " + memoId)

  if (!memoId) {
    showToast("Memo id was not provided!", "Deleting memo", "");
    return;
  }

  $('#confirmationModal').modal('hide');

  //Get memo from storage (For prototyping is local storage)
  let memos = localStorage.getItem('memo');

  if (!memos) memos = "[]";

  memos = JSON.parse(memos);
  memo = memos.find(obj => Number(obj.id) === Number(memoId));

  if (!memo) {
    showToast("Unable to found memo provided!", "Deleting memo", "");
    return;
  }

  const updatedMemos = memos.filter(obj => String(obj.id) !== String(memoId));

  localStorage.setItem('memo', JSON.stringify(updatedMemos));

  loadMemos();

  showToast("Memo removed successfully!", "Deleting memo", "");

}