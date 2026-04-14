import axios from 'axios';
async function test() {
  try {
    const login = await axios.post('http://localhost:4000/api/user/login', { email: 'admin@example.com', password: 'password' }); // Replace with real admin if needed, but wait I don't know the admin password.
  } catch(e) {}
}
