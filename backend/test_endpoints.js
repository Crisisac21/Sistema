const base = 'http://localhost:3000';

async function req(path, opts) {
  const res = await fetch(base + path, opts);
  const text = await res.text();
  let body;
  try { body = JSON.parse(text); } catch(e) { body = text; }
  return { status: res.status, body };
}

(async ()=>{
  try {
    console.log('Registering admin...');
    const r1 = await req('/api/auth/register-admin', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ nombre: 'Admin2', email: 'admin2', password: 'admin2' }) });
    console.log('register-admin:', r1.status, r1.body);

    console.log('Logging in...');
    const r2 = await req('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: 'admin2', password: 'admin2' }) });
    console.log('login:', r2.status, r2.body);

    let token = null;
    if (r2.status === 200 && r2.body && r2.body.token) token = r2.body.token;

    console.log('GET reservas...');
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
    const r3 = await req('/api/horarios/reservas', { method: 'GET', headers });
    console.log('reservas:', r3.status, r3.body);
  } catch (e) {
    console.error('Error:', e.message);
  }
})();
