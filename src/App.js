import './App.css';
import React, { useState, useEffect } from 'react';

function App() {
  const [form, setForm] = useState({
    nomeDono: '',
    nomePet: '',
    especie: '',
    raca: '',
    banho: '',
    observacoes: ''
  });

  const [checkins, setCheckins] = useState([]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const res = await fetch('https://petshop-backend-axz2.onrender.com/checkins', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      alert('Check-in registrado!');
      setForm({
        nomeDono: '',
        nomePet: '',
        especie: '',
        raca: '',
        banho: '',
        observacoes: ''
      });
      fetchCheckins(); // atualiza a lista após cadastrar
    } else {
      alert('Erro ao registrar check-in.');
    }
  }

  async function fetchCheckins() {
    try {
      const res = await fetch('https://petshop-backend-axz2.onrender.com/checkins');
      const data = await res.json();
      setCheckins(data);
    } catch (err) {
      console.error("Erro ao buscar check-ins:", err);
    }
  }

  async function handleClearAll() {
    if (!window.confirm('Tem certeza que deseja limpar todos os check-ins?')) return;

    try {
      const res = await fetch('https://petshop-backend-axz2.onrender.com/checkins', {
        method: 'DELETE',
      });

      if (res.ok) {
        alert('Todos os check-ins foram removidos!');
        fetchCheckins(); // Atualiza a lista
      } else {
        alert('Erro ao limpar os check-ins.');
      }
    } catch (error) {
      alert('Erro na conexão para limpar os check-ins.');
    }
  }

  async function handleRemove(id) {
    if (!window.confirm('Tem certeza que deseja remover esse check-in?')) return;

    try {
      const res = await fetch(`https://petshop-backend-axz2.onrender.com/checkins/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        alert('Check-in removido com sucesso!');
        fetchCheckins(); // atualiza a lista após remover
      } else {
        alert('Erro ao remover check-in.');
      }
    } catch (error) {
      alert('Erro na conexão para remover.');
    }
  }

  useEffect(() => {
    fetchCheckins();
  }, []);

  return (
    <div style={{ maxWidth: 800, margin: 'auto', padding: 20 }}>
      <h1>Check-in de Pets</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: 30 }}>
        <input
          name="nomeDono"
          placeholder="Nome do dono"
          value={form.nomeDono}
          onChange={handleChange}
          required
        /><br />
        <input
          name="nomePet"
          placeholder="Nome do pet"
          value={form.nomePet}
          onChange={handleChange}
          required
        /><br />
        <input
          name="especie"
          placeholder="Espécie"
          value={form.especie}
          onChange={handleChange}
          required
        /><br />
        <input
          name="raca"
          placeholder="Raça"
          value={form.raca}
          onChange={handleChange}
        /><br />
        <input
          name="banho"
          placeholder="Banho"
          value={form.banho}
          onChange={handleChange}
        /><br />
        <textarea
          name="observacoes"
          placeholder="Observações"
          value={form.observacoes}
          onChange={handleChange}
        /><br />
        <button type="submit">Registrar Check-in</button>
      </form>

      <button 
        style={{ marginBottom: 20, backgroundColor: '#c00', color: 'white', padding: '8px 12px', border: 'none', borderRadius: 4, cursor: 'pointer' }} 
        onClick={handleClearAll}
      >
        Limpar Todos os Check-ins
      </button>

      <h2>Check-ins Recentes</h2>
      {checkins.length === 0 ? (
        <p>Nenhum check-in registrado ainda.</p>
      ) : (
        checkins.map(item => (
          <div key={item.id} style={{ background: '#eee', padding: 10, borderRadius: 8, marginBottom: 10 }}>
            <p><strong>Pet:</strong> {item.nome_pet} ({item.especie} - {item.raca})</p>
            <p><strong>Dono:</strong> {item.nome_dono}</p>
            <p><strong>Banho:</strong> {item.banho}</p>
            <p><strong>Data:</strong> {item.data_checkin}</p>
            <p><strong>Observações:</strong> {item.observacoes}</p>
            <button onClick={() => handleRemove(item.id)}>Remover</button>
          </div>
        ))
      )}
    </div>
  );
}

export default App;
