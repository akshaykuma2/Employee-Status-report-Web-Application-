import axios from 'axios'

class APIHandler {
  constructor() {
    this.axios = axios.create({
      baseURL: 'http://localhost:5000',
      headers: {
        Accept: '*/*',
        'Content-Type': 'application/json'
      }
    })
  }

  setAccessToken = (token) => {
    this.axios.defaults.headers.common.Authorization = `Bearer ${token}`
  }

  getAccessToken = () => {
    return this.axios.defaults.headers.common.Authorization.split(' ')[1]
  }

  login = async (username,password,type) => {
    const data = {
      email: username,
      password
    }
    try {
      const response = await this.axios.post(`/api/login/${type}`, data)
      return response.data
    } catch (error) {
      return Promise.reject(error)
    }
  }

  signUp = async (username,password) => {
    try {

      const data = {
        email: username,
        password,
        username
      }
      const response = await this.axios.post('/api/employee', data)
      return response.data
    } catch (error) {
      return Promise.reject(error)
    }
  }

  getEmployeeList = async (params) => {
    try {
    const employeeResponse = await this.axios.get('/api/employee')
    return employeeResponse.data.data
    } catch (e) {
      return Promise.reject(e)
    }
  }

  getAdminData = async (params) => {
    try {
    const employeeResponse = await this.axios.get('/api/employee')
    const projectResponse = await this.axios.get('/api/project')
    return projectResponse.data.data.map((datas, index) => {
      const getName = employeeResponse.data.data.find(data => datas.assignedTo == data.id)
      const merge = {
        id: datas.id,
        name: getName ? getName.username : '',
        title: datas.title,
        description: datas.description,
        date: datas.timeline
      }
      return merge
    })
    } catch (e) {
      return Promise.reject(e)
    }
  }

  getEmployee = async (id) => {
    try {
    const response = await this.axios.get(`/api/employee/project/${id}`)
    return response.data.data.map((datas, index) => {
      const merge = {
        id: datas.id,
        title: datas.title,
        description: datas.description,
        date: datas.timeline
        }
      return merge
    })
    } catch (error) {
      return Promise.reject(error)
    }
  }

  editTask = async (list) => {
    try {
      const data = {
        description: list.description
      }
      const response = await this.axios.put(`/api/employee/project/edit/${list.projectId}`,data)
      return response.data
    } catch (error) {
      return Promise.reject(error)
    }
  }

  addTask = async (list) => {
    try {
      const data = {
        title: list.projectName,
        description: list.description,
        timeline: list.date,
        assignedTo: list.employeeId,
      }
      const response = await this.axios.post(`/api/project`, data)
      return response.data
    } catch (error) {
      return Promise.reject(error)
    }
  }

  deleteTask = async (id) => {
    try {
      const response = await this.axios.delete(`/api/employee/project/delete/${id}`)
      return response.data
    } catch (error) {
      return Promise.reject(error)
    }
  }
}

const API = new APIHandler()

export default API
