import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom"
import './css'
import API from "../../api"
import { useParams } from "react-router-dom";

const EditForm = (props) => {
  const [projectId, setProjectId] = useState('');
  const [description, setDescription] = useState('')

  function handleSubmit() {
    props.editTask(projectId,description)
    setProjectId('')
    setDescription('')
  }

  return (
    <div class="form-group flex-fill mb-2">

      <input
        type="text"
        className="form-control"
        name="text"
        autoComplete="off"
        value={projectId}
        placeholder='Project Id'
        style={{ marginBottom: 20}}
        onChange={event => setProjectId(event.target.value)}
      />

      <input
        type="text"
        className="form-control"
        name="text"
        autoComplete="off"
        value={description}
        placeholder='Description'
        style={{ marginBottom: 20}}
        onChange={event => setDescription(event.target.value)}
      />

<button className="btn btn-primary" onClick={() => handleSubmit()}>Edit
      <i class="fa fa-solid fa-plus" style={{ marginLeft: 20 }}></i></button>
    </div>
  );
}

function Employee(props) {

  console.log('Employee page')
  const [tasks, setTasks] = useState(null)
  const [displayEditTask,setDisplayEditTask] = useState(false)
  const { id } = useParams()
  const history = useHistory()
  console.log(id)

  const editTask = async (projectId,description) => {
    const newTask = { projectId,description }

    const response = await API.editTask(newTask)
    console.log(response)
    alert("Task edited successfully!.");
    window.location.reload()
  }

  const fetchData = async () => {
    const response = await API.getEmployee(id)
    setTasks(response)
    console.log(response)
  }

  useEffect(() => {
    fetchData()
  },[])

  const taskList = () => (
    <>
      {
        tasks.map((data,index) => <>
        <tbody>
    <tr>
      <th scope="row">{data.id}</th>
      <td>{data.title}</td>
      <td>{data.description}</td>
      <td>{data.date}</td>
    </tr>
  </tbody>
                </>
      )
      }
    </>
  )

  return (
    <div className="" style={{ paddingLeft: 20, paddingRight: 20 }}>
      <div style={{ display: 'flex', width: 'calc(90vw)', justifyContent: 'space-between', marginTop: 30 }}>
        <button className="btn btn-primary" onClick={() => setDisplayEditTask(!displayEditTask)}>Submit Status Here
        <i class="fa fa-solid fa-plus"></i></button>
        <div>
        <button className="btn btn-danger" onClick={() => history.replace('/')}>Sign Out
        </button>
      </div>
      </div>
      <div class="row justify-content-center align-items-center main-row" style={{ marginTop: 30 }}>
    <div class="col shadow main-col bg-white">
    {
        displayEditTask && <EditForm editTask={editTask} />
      }
      <div class="row text-white p-2">
      <table class="table">
        <thead>
    <tr>
      <th scope="col">Id</th>
      <th scope="col">Title</th>
      <th scope="col">Description</th>
      <th scope="col">Date</th>
    </tr>
    </thead>
    {tasks && taskList()}
    </table>
      </div>
      <div class="row" id="todo-container">
      </div>
    </div>
  </div>
      
    </div>
  );
}

export default Employee;