const axios = require('axios');

axios.defaults.baseURL = 'http://localhost:4040/api'

export const signup = user => {
    return axios('/signup', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        data: user
    })
        .then(response => {
            return response.data;
        })
        .catch(error => {
            return error.response.data;
        });
}

export const signin = user => {
    return axios('/signin', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        data: user
    })
        .then(response => {
            return response.data;
        })
        .catch(error => {
            return error.response.data;
        });
}

export const getStudent = (studentId, token) => {
    return axios(`/students/${studentId}`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token
        }
    })
        .then(response => {
            return response.data;
        })
        .catch(error => {
            return error.response.data;
        });
}

export const updateStudent = (studentId, token, user) => {
    return axios(`/students/${studentId}`, {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token
        },
        data: user
    })
        .then(response => {
            return response.data;
        })
        .catch(error => {
            return error.response.data;
        });
}

export const getStudents = token => {
    return axios(`/students`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token
        }
    })
        .then(response => {
            return response.data;
        })
        .catch(error => {
            return error.response.data;
        });
}

export const getStudentByAdmin = (studentId, token) => {
    return axios(`/admin/students/${studentId}`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token
        }
    })
        .then(response => {
            return response.data;
        })
        .catch(error => {
            return error.response.data;
        });
}

export const updateStudentByAdmin = (studentId, token, data) => {
    return axios(`/admin/students/${studentId}`, {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token
        },
        data: data
    })
        .then(response => {
            return response.data;
        })
        .catch(error => {
            return error.response.data;
        });
}

export const deleteStudentByAdmin = (studentId, token) => {
    return axios(`/admin/students/${studentId}`, {
        method: 'DELETE',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token
        }
    })
        .then(response => {
            return response.data;
        })
        .catch(error => {
            return error.response.data;
        });
}

export const createClassByAdmin = (token, data) => {
    return axios('/admin/classes', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token
        },
        data: data
    })
        .then(response => {
            return response.data;
        })
        .catch(error => {
            return error.response.data;
        });
}

export const getClasses = token => {
    return axios(`/admin/classes`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token
        }
    })
        .then(response => {
            return response.data;
        })
        .catch(error => {
            return error.response.data;
        });
}

export const updateClassByAdmin = (classId, token, data) => {
    return axios(`/admin/classes/${classId}`, {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token
        },
        data: data
    })
        .then(response => {
            return response.data;
        })
        .catch(error => {
            return error.response.data;
        });
}

export const deleteClassByAdmin = (classId, token) => {
    return axios(`/admin/classes/${classId}`, {
        method: 'DELETE',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token
        }
    })
        .then(response => {
            return response.data;
        })
        .catch(error => {
            return error.response.data;
        });
}

export const getClass = (token, classId) => {
    return axios(`/admin/classes/${classId}`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token
        }
    })
        .then(response => {
            return response.data;
        })
        .catch(error => {
            return error.response.data;
        });
}

export const getStudentsInClass = (token, classId) => {
    return axios(`/admin/classes/${classId}/students`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token
        }
    })
        .then(response => {
            return response.data;
        })
        .catch(error => {
            return error.response.data;
        });
}

export const deleteStudentInClass = (token, classId, data) => {
    return axios(`/admin/classes/${classId}/remove-student`, {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token
        },
        data: data
    })
        .then(response => {
            return response.data;
        })
        .catch(error => {
            return error.response.data;
        });
}

export const addStudentInClass = (token, classId, data) => {
    return axios(`/admin/classes/${classId}/add-student`, {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token
        },
        data: data
    })
        .then(response => {
            return response.data;
        })
        .catch(error => {
            return error.response.data;
        });
}