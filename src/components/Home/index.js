import React, { useState, useRef, useEffect } from "react";
import { useHistory } from "react-router-dom"
import './css'
import API from "../../api"
import { useParams } from "react-router-dom";

const Form = (props) => {
  const [employeeId, setEmployeeId] = useState('');
  const [projectName, setProjectName] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState('')

  function handleSubmit() {
    props.addTask(employeeId, projectName, description, date);
    setEmployeeId('');
    setProjectName('')
    setDescription('')
    setDate('')
  }

  return (
    <div class="form-group flex-fill mb-2">

      <input
        type="text"
        className="form-control"
        name="text"
        autoComplete="off"
        value={employeeId}
        placeholder='Employee Id'
        style={{ marginBottom: 20}}
        onChange={event => setEmployeeId(event.target.value)}
      />

      <input
        type="text"
        className="form-control"
        name="text"
        autoComplete="off"
        value={projectName}
        placeholder='Title'
        style={{ marginBottom: 20}}
        onChange={event => setProjectName(event.target.value)}
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

      <input
        type="text"
        className="form-control"
        name="text"
        autoComplete="off"
        value={date}
        placeholder='Date'
        style={{ marginBottom: 20}}
        onChange={event => setDate(event.target.value)}
      />

<button className="btn btn-primary" onClick={() => handleSubmit()}>Add
      <i class="fa fa-solid fa-plus" style={{ marginLeft: 20 }}></i></button>
    </div>
  );
}

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

function Home(props) {

  console.log('Home page')
  const [tasks, setTasks] = useState(null);
  const [employees, setEmployees] = useState(null)
  const [trys, settry] = useState('')
  const [displayCreateEmployee,setDisplayCreateEmployee] = useState(false)
  const [displayCreateTask,setDisplayCreateTask] = useState(false)
  const [displayEditTask,setDisplayEditTask] = useState(false)
  const [username,setUserName] = useState('')
  const [password,setPassword] = useState('')
  const { type } = useParams()
  const history = useHistory()
  console.log(type)

  const editTask = async (projectId,description) => {
    const newTask = { projectId,description }

    const response = await API.editTask(newTask)
    console.log(response)
    alert("Task edited successfully!.");
    window.location.reload()
  }

  const addTask = async (employeeId, projectName, description, date) => {
    const newTask = { employeeId: employeeId, projectName: projectName, description: description, date: date };

    const response = await API.addTask(newTask)
    console.log(response)
    alert("Task created successfully!.");
    window.location.reload()
  }

  const handleAuthentication = async () => {
    if(username && password) {
      const response = await API.signUp(username,password)
      console.log(response)
      alert("Employee created successfully!.");
      window.location.reload()
    }
  }

  const fetchData = async () => {
    try {
      const response = await API.getAdminData()
      const employeeResponse = await API.getEmployeeList()
      setTasks(response)
      setEmployees(employeeResponse)
      console.log(response)
    } catch (error) {
      console.log('error')
    }
  }

  console.log(tasks,trys)

  useEffect(() => {
    fetchData()
  },[])

  const adminTemplate = () => (
    <div className="home-admin">
    <div style={{ width: 'calc(90vw)' }}>
      <button className="btn btn-primary" style={{ marginRight: 20 }} onClick={() => setDisplayCreateEmployee(!displayCreateEmployee)}>Create Employee
      <i class="fa fa-solid fa-plus"></i></button>
      <button className="btn btn-primary" onClick={() => setDisplayCreateTask(!displayCreateTask)}>Create Project
      <i class="fa fa-solid fa-plus"></i></button>
      <button className="btn btn-danger" style={{ height: 40, float: 'right' }} onClick={() => history.replace('/')}>Sign Out
      </button>
    </div>
     
      {
        displayCreateEmployee && <div className="body-form">
        <div className="input-group mb-3">
<div className="input-group-prepend">
<span className="input-group-text"><i className="fa fa-user"></i></span>
</div>
<input type="text" value={username} onChange={event => setUserName(event.target.value)} className="form-control" placeholder="Email" />
</div>
<div className="input-group mb-3">
<div className="input-group-prepend">
<span className="input-group-text"><i className="fa fa-lock"></i></span>
</div>
<input type="text" value={password} onChange={event => setPassword(event.target.value)} className="form-control" placeholder="Password" />
</div>
<button type="button" className="btn btn-secondary btn-block" onClick={handleAuthentication}>Create</button>
    </div>
      }
      <div>
      {
        displayCreateTask && <Form addTask={addTask} />
      }
      {
        displayEditTask && <EditForm editTask={editTask} />
      }
      </div>
    </div>
  )

  const deleteTask = async (id) => {
    const response = await API.deleteTask(id)  
    console.log(response)
    alert("Task deleted successfully!.");
    window.location.reload()
  }

  const employyeList = () => (
    <>
      {
        employees.map((data,index) => <>
        
  <tbody>
    <tr>
      <th scope="row">{data.id}</th>
      <td>{data.username}</td>
      <td>{data.email}</td>
    </tr>
  </tbody>
        
                </>
      )
      }
    </>
  )

  const taskList = () => (
    <>
      {
        tasks.map((data,index) => <>
        
  <tbody>
    <tr>
      <th scope="row">{data.id}</th>
      <td>{data.name}</td>
      <td>{data.title}</td>
      <td>{data.description}</td>
      <td>{data.date}</td>
      <td>    <button class="btn btn-outline-secondary bg-danger text-white" type="button" onClick={() => deleteTask(data.id)}>X</button>
</td>
    </tr>
  </tbody>
        
                </>
      )
      }
    </>
  )

  return (
    <div className="" style={{ paddingLeft: 20, paddingRight: 20 }}>
      <div class="row justify-content-center align-items-center main-row">
    <div class="col shadow main-col bg-white">
      <div class="row text-white p-2">
      {
        type === 'admin' && adminTemplate()
      }
      <table class="table">
        <thead>
    <tr>
      <th scope="col">Id</th>
      <th scope="col">Name</th>
      <th scope="col">Title</th>
      <th scope="col">Description</th>
      <th scope="col">Date</th>
    </tr>
    </thead>
    {tasks && taskList()}
    </table>
    <table class="table">
        <thead>
    <tr>
      <th scope="col">Id</th>
      <th scope="col">Name</th>
      <th scope="col">Email</th>
    </tr>
    </thead>
    {employees && employyeList()}
    </table>

    </div>
  </div>
      </div>
    </div>
  );
}

export default Home;