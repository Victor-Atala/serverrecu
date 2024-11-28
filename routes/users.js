import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserList = ({ token }) => {
  const [users, setUsers] = useState([]);

  // Obtener usuarios al cargar el componente
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('https://serverrecu.duckdns.org/users', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(response.data);
      } catch (err) {
        console.error(err);
        alert('Error al obtener usuarios');
      }
    };
    fetchUsers();
  }, [token]);

  // Manejar la edición de usuarios
  const handleEdit = (id) => {
    const newUsername = prompt('Ingrese el nuevo nombre de usuario:');
    if (!newUsername) return;

    const newPassword = prompt('Ingrese la nueva contraseña (opcional):');

    axios
      .put(
        `https://serverrecu.duckdns.org/users/${id}`,
        { newUsername, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        setUsers((prevUsers) =>
          prevUsers.map((user) => (user.id === id ? { ...user, username: newUsername } : user))
        );
        alert('Usuario actualizado correctamente');
      })
      .catch((err) => {
        console.error(err);
        alert('Error al actualizar el usuario');
      });
  };

  // Manejar la eliminación de usuarios
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar este usuario?');
    if (!confirmDelete) return;

    try {
      await axios.delete(`https://serverrecu.duckdns.org/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
      alert('Usuario eliminado correctamente');
    } catch (err) {
      console.error(err);
      alert('Error al eliminar el usuario');
    }
  };

  return (
    <div>
      <h2>Usuarios</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.username}{' '}
            <button onClick={() => handleEdit(user.id)}>Editar</button>{' '}
            <button onClick={() => handleDelete(user.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
