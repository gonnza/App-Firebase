import {
    onGetTasks,
    saveTask,
    deleteTask,
    getTask,
    updateTask,
    getTasks,
  } from "./firebase.js";
  

const tasksContainer = document.getElementById('task-container')
const taskForm = document.getElementById('task-form')

let editStatus = false;
let id = "";

window.addEventListener("DOMContentLoaded", async (e) => {

  
    onGetTasks((querySnapshot) => {
      tasksContainer.innerHTML = "";
  
      querySnapshot.forEach((doc) => {
        const task =  doc.data();
  
        tasksContainer.innerHTML += `
        <div class="card card-body border-primary">
      <h3 class="h5">${task.title}</h3>
      <p>${task.description}</p>
      <div>
        <button class="btn btn-primary btn-delete" data-id="${doc.id}">
          🗑 Delete
        </button>
        <button class="btn btn-secondary btn-edit" data-id="${doc.id}">
          🖉 Edit
        </button>
      </div>
    </div>`;
      });



        const btnDelete = tasksContainer.querySelectorAll('.btn-delete')

        btnDelete.forEach(btn => {
            btn.addEventListener('click', ({ target: { dataset } }) => {
                deleteTask(dataset.id)
            })
        })

        const btnEdit = tasksContainer.querySelectorAll('.btn-edit')
        btnEdit.forEach((btn) => {
            btn.addEventListener('click', async ({ target: { dataset } }) => {

                const doc = await getTask(dataset.id)
                const task = doc.data()

                taskForm['task-title'].value = task.title
                taskForm['task-description'].value = task.description

                editStatus = true
                id = dataset.id

                taskForm['btn-task-save'].innerText = 'Update'

            })
        })

    })

})


taskForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const title = taskForm['task-title']
    const description = taskForm['task-description']

    //console.log(title.value, description.value)
    if (!editStatus) {
        saveTask(title.value, description.value)
    } else {
        updateTask(id, { title: title.value, description: description.value })
        editStatus = false;
    }


    taskForm.reset()
})