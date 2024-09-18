feather.replace() // icooooooon


// redirect after creating a task

document.addEventListener("DOMContentLoaded", function() {
    // Attacher des événements aux boutons de suppression
    const deleteButtons = document.querySelectorAll(".deleteButton");

    deleteButtons.forEach(button => {
        button.addEventListener("click", function(event) {
            event.preventDefault();  // Empêche le rechargement de la page
            const taskId = this.dataset.id;  // Récupère l'ID de la tâche via data-id

            console.log(`Task ID: ${taskId} - Delete button clicked`);

            fetch(`/tasks/${taskId}/delete`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                }
            })
            .then(response => response.json())
            .then(data => {
                console.log("Response from server:", data);
                if (data.success) {
                    // Supprimer la tâche du DOM après suppression
                    const taskItem = document.getElementById(`task-${taskId}`);
                    if (taskItem) {
                        taskItem.remove();
                        console.log(`Task ${taskId} removed from DOM`);
                    }
                } else {
                    alert("Erreur lors de la suppression de la tâche.");
                }
            })
            .catch(error => {
                console.error("Erreur :", error);
                alert("Une erreur est survenue lors de la suppression.");
            });
        });
    });

    const taskForm = document.getElementById("taskForm");
    if (taskForm) {
        taskForm.addEventListener("submit", function(event) {
            event.preventDefault();  // Empêche le rechargement de la page

            // Récupérer les données du formulaire
            const formData = new FormData(taskForm);
            const title = formData.get("title");
            const description = formData.get("description");
            const due_date = formData.get("due_date");

            // Créer l'objet de la tâche
            const taskData = {
                title: title,
                description: description,
                due_date: due_date
            };

            console.log("Task data to be created:", taskData);

            // Envoyer les données en AJAX
            fetch("/tasks/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(taskData)
            })
            .then(response => {
                if (response.redirected) {
                    console.log(`Redirection to: ${response.url}`);
                    // Attendre 2 secondes avant de rediriger
                    setTimeout(() => {
                        window.location.href = response.url;
                    }, 1200);
                } else {
                    return response.json();
                }
            })
            .then(data => {
                if (data && data.success) {
                    // Ajouter la nouvelle tâche au DOM sans recharger la page
                    const taskList = document.getElementById("taskList");
                    const newTask = document.createElement("li");
                    newTask.setAttribute("id", `task-${data.task.id}`);
                    newTask.innerHTML = `
                        <h3>${data.task.title}</h3>
                        <p>${data.task.description}</p>
                        <p><strong>Date d'échéance :</strong> ${data.task.due_date ? data.task.due_date : "Pas de date"}</p>
                        <button type="button" class="deleteButton" data-id="${data.task.id}">Supprimer</button>
                    `;
                    taskList.appendChild(newTask);

                    // Attacher l'événement de suppression au nouveau bouton créé
                    newTask.querySelector(".deleteButton").addEventListener("click", function(event) {
                        event.preventDefault();
                        const taskId = this.dataset.id;
                        fetch(`/tasks/${taskId}/delete`, {
                            method: "DELETE",
                            headers: {
                                "Content-Type": "application/json"
                            }
                        })
                        .then(response => response.json())
                        .then(data => {
                            if (data.success) {
                                newTask.remove();
                            } else {
                                alert("Erreur lors de la suppression de la tâche.");
                            }
                        })
                        .catch(error => console.error("Erreur :", error));
                    });

                    // Réinitialiser le formulaire
                    taskForm.reset();
                } else if (data) {
                    alert("Erreur lors de la création de la tâche.");
                }
            })
            .catch(error => {
                console.error("Erreur :", error);
                alert("Une erreur est survenue lors de la création.");
            });
        });
    }
});




// create task form animation

$(document).ready(function() {
  setTimeout(function() {
    // Tous vos événements jQuery ici, après un petit délai
    $('.taskFormTitle').on("change keyup paste", function() {
      if ($(this).val()) {
        $('.icon-paper-plane').addClass("next");
      } else {
        $('.icon-paper-plane').removeClass("next");
      }
    });

    $('.next-button').hover(function() {
      $(this).css('cursor', 'pointer');
    });

    $('.next-button.taskFormTitle').click(function() {
      console.log("Title button clicked");
      $('.createTitle-section').addClass("fold-up");
      $('.createDesc-section').removeClass("folded");
    });

    $('.taskFormDesc').on("change keyup paste", function() {
      if ($(this).val()) {
        $('.icon-lock').addClass("next");
      } else {
        $('.icon-lock').removeClass("next");
      }
    });

    $('.next-button.taskFormDesc').click(function() {
      console.log("Password button clicked");
      $('.createDesc-section').addClass("fold-up");
      $('.createDueDate-section').removeClass("folded");
    });

    $('.taskFormDueDate').on("change keyup paste", function() {
      if ($(this).val()) {
        $('.icon-repeat-lock').addClass("next");
      } else {
        $('.icon-repeat-lock').removeClass("next");
      }
    });

    $('.next-button.taskFormDueDate').click(function() {
      console.log("Repeat password button clicked");
      $('.createDueDate-section').addClass("fold-up");
      $('.success').css("marginTop", 0);
    });
  }, 100); // Attendre 100ms avant d'attacher les événements jQuery
});



