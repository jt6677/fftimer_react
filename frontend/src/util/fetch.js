import axios from "axios";

const publicFetch = axios.create({
  baseURL: "",
});

export { publicFetch };
