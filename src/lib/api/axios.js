import axios from "axios";

export const submitHE = (server, data) => {
  return axios({
    url: server,
    headers: {'Content-Type': 'multipart/form-data'},
    method: "POST",
    data
  })
}


