import React, { useEffect, useContext, useState } from 'react'
import { useHistory } from "react-router-dom"
import API from '../../api'
import './index.css'

const Login = (props) => {

  const [username,setUserName] = useState('')
  const [password,setPassword] = useState('')
  const [type, setType] = useState('')
  const [error, setError] = useState(false)
  const history = useHistory()

  const onChangeValue = (event) => {
    setType(event.target.value)
  }

  const handleAuthentication = async () => {
    if(username && password && type) {
      const response = await API.login(username,password,type)
      console.log(response)
      if(response.message === 'Login Success') {
        if(type === 'admin') {
          history.push(`/home/${type}`);
        } else {
          history.push(`/employee/${response.data.id}`);
        }
      } else {
        setError('Incorrect username and password')
      }
    } else {
      setError('Enter Username and password')
    }
  }

  
  return (
    <>
    <h1 style={{ textAlign: 'center'}}>Employee Status Report Application</h1>
    <h2 style={{ textAlign: 'center'}}>Developed by Akshay</h2>
    <div className="container">
        <div className="form-box">
          <div className="header-form">
            <h4 className="text-primary text-center"><i className="fa fa-user-circle" style={{fontSize:"110px"}}></i></h4>
            <div className="image">
            </div>
          </div>
          <div onChange={onChangeValue}>
        <input type="radio" value="admin" checked={ type === 'admin' } /> Admin
        <input type="radio" value="employee" checked={ type === 'employee' } /> Employee
      </div>
          <div className="body-form">
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
{error && <p style={{ fontColor: '#red'}}>Check username and password</p>}
 <button type="button" className="btn btn-secondary btn-block" onClick={handleAuthentication}>LOGIN</button>
          </div>
        </div>
       </div>  
      </>
  )
}

export default Login