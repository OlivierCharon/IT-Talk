
// Get the modal - create-ITTchat
var createModal = document.getElementById("create-ITTchat");
// Get the button that opens the modal
var createBtn = document.getElementById("create-ITTchat-btn");
// Get the <span> element that closes the modal
var createSpan = document.getElementById("close-create-tchat");
// When the user clicks on the button, open the modal
createBtn.onclick = function() {
    createModal.style.display = "block";
}
// When the user clicks on <span> (x), close the modal
createSpan.onclick = function() {
    createModal.style.display = "none";
}


// Get the modal - edit-ITTchat
var editModal = document.getElementById("edit-ITTchat");
// Get the <span> element that closes the modal
var editSpan = document.getElementById("close-edit-tchat");
// When the user clicks on <span> (x), close the modal
editSpan.onclick = function() {
    editModal.style.display = "none";
}
// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == editModal) {
        editModal.style.display = "none";
    }
}
let editIds = document.querySelectorAll('[id^=btn-edit-]');
for (id in editIds) {
    var el = editIds[id];
    el.addEventListener && el.addEventListener('click', function (event) {
        event.preventDefault();
        const ITTchatId = event.currentTarget.getAttribute('id').substr(event.currentTarget.getAttribute('id').lastIndexOf('-') + 1);
        const ITTchatTitle = document.getElementById('title-'+ITTchatId).textContent;
        const ITTchatConfidentiality = document.getElementById('confidentiality-'+ITTchatId).textContent;
        console.log(ITTchatTitle);
        console.log(document.getElementById('title-'+ITTchatId));
        document.getElementById('id-to-edit').value = ITTchatId;
        document.getElementById('title-to-edit').value = ITTchatTitle;
        if(ITTchatConfidentiality != 'Publique') {
            document.getElementById("private-to-edit").checked = true;
            document.getElementById("public-to-edit").checked = false;
        } else {
            document.getElementById("private-to-edit").checked = false;
            document.getElementById("public-to-edit").checked = true;
        }
        editModal.style.display = "block";
    });
}

// EDIT ITTchat
document.getElementById("edit-ITTchat-form").addEventListener('submit', event => {
    event.preventDefault();
    console.log(event.target);
    console.log(event.currentTarget);
    const id = event.target.querySelector('input[name=id-to-edit]').value;
    const title = event.target.querySelector('input[name=title-to-edit]').value;
    console.log(id);
    console.log(title);
    var data = {
        'title': title
    };

    
    fetch('/' + id, {
        method: 'put',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(function (r) { return r.json() })
        .then(function (response) {
            if (response.status) {
                document.location.href = '/';
            } else {
                alert(response.message || 'Une erreur est survenue');
            }
        })
});


// // Delete ITTchat
// if(document.getElementById('create-ITTchat-form')){
let deleteIds = document.querySelectorAll('[id^=btn-delete-]');
for (id in deleteIds) {
    var el = deleteIds[id];
    el.addEventListener && el.addEventListener('click', function (event) {
        event.preventDefault();
        console.log(event.currentTarget);
        const id = event.currentTarget.getAttribute('id').substr(event.currentTarget.getAttribute('id').lastIndexOf('-') + 1);
        console.log('nom du file');
        console.log(id);
        fetch('/'+id, {
            method: 'delete',
            headers: {
                'Accept': 'application/json'
            }
        })
            .then(function (r) { return r.json() })
            .then(function (response) {
                if (response.status) {
                    document.location.href = '/';
                } else {
                    alert(response.message || 'Une erreur est survenue');
                }
            })
    });
}
