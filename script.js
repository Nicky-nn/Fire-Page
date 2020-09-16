const c = console.log;
const ci = alert;
const f = firebase;
const d = document;
const db = firebase.firestore();

const form = d.getElementById('task-form')
const taskContainer = d.getElementById('tasks-container')

let editStatus = false;
let id = '';

/* CRUD*/
const save = (title, description) => //Enviar
db.collection('tasks').doc().set({
    title,
    description
})

const getForm = () => db.collection('tasks').get();
const updateTask = id => db.collection('tasks').doc(id).get()
const updateBefore = (id, actu) => db.collection('tasks').doc(id).update(actu)
const obsTask = (callback) => db.collection('tasks').onSnapshot(callback)//Cualquier Cambio
const deleteTask = id => db.collection('tasks').doc(id).delete() 

/* FUNCIONES */
window.addEventListener('DOMContentLoaded', async(e) => {
    obsTask((querySnapshot) => { //Cada vez que se ejecute
        taskContainer.innerHTML = '';
        querySnapshot.forEach(doc => {
            const t = doc.data();
            t.id = doc.id;
            taskContainer.innerHTML += `
                <div class="card card-body mt-2 border-primary ">
                <h3 class = "h5">${t.title}</h3>
                <p>${t.description}</p>
                <div>
                    <button type="button" class = "btn btn-outline-success btn-edit"  data-id = "${t.id}">Editar</button>       
                    <button type="button" class = "btn btn-outline-danger btn-delete" data-id = "${t.id}">Borrar</button>     
                </div>
                </div>
            `
            const btnDelete = document.querySelectorAll('.btn-delete');
            btnDelete.forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    // c(e.target.dataset.id) //Sabemos que boton Fue
                    await deleteTask(e.target.dataset.id)
                })
            })
            const btnEdit = document.querySelectorAll('.btn-edit');
            btnEdit.forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    const x = await updateTask(e.target.dataset.id)
                    const td = doc.data()
                    editStatus = true
                    id = e.target.dataset.id;
                    c(id);

                    form['task-title'].value = td.title;
                    form['task-description'].value = td.description;
                    form['save'].innerText = 'Editar'
                })
            })
        })
    })
})

d.addEventListener('submit', async(e) => {
    e.preventDefault();
    const title = form['task-title'];
    const description = form['task-description'];

    if(!editStatus){
        await save(title.value, description.value);
    } else{
        await updateBefore(id, {
            title: title.value,
            description: description.value
        })
        editStatus = false;
        form['save'].innerText = 'Guardar'
        c(id);
        id = '';
    }
    
    await getForm();
    form.reset();
    title.focus();
    
})