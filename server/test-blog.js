import axios from 'axios';
export async function test() {
  try {
    const login = await axios.post('http://localhost:4000/api/user/login', { email: 'admin@example.com', password: 'password' }); 
    console.log(login.data);
  } catch (e) {
    console.error(e);
  }
}
