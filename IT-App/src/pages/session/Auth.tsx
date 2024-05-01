import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function SecurePage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar si el token no existe en localStorage
    const token = localStorage.getItem('token');
    if (!token) {
      // Redirigir al usuario a la ruta de inicio de sesión si no hay token
      navigate('/authentication/sign-in');
    }
  }, [navigate



]);

  console.log('SecurePage rendered'); // Agrega este console.log para verificar si el componente se está renderizando
  return null;
}

export default SecurePage;
