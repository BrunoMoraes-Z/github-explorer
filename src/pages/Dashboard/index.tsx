import React, { useState, useEffect, FormEvent } from 'react';
import { FiChevronRight } from 'react-icons/fi';

import api from '../../services/api';

import logo from '../../assets/github-logo.svg';
import { Title, Form, Repositories, Error } from './styles';
import { Link } from 'react-router-dom';

interface Repository {
  full_name: string;
  description: string;
  owner: {
    login: string;
    avatar_url: string;
  }
}

const Dashboard: React.FC = () => {
  const [repo, setRepo] = useState('');
  const [inputError, setInputError] = useState('');
  const [repositories, setRepositories] = useState<Repository[]>(() => {
    const storagedRepositories = localStorage.getItem('@GithubExplorer:repositories');
    if (storagedRepositories) {
      return JSON.parse(storagedRepositories);
    } else {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('@GithubExplorer:repositories', JSON.stringify(repositories));
  }, [repositories]);

  async function handleAddRepository(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!repo) {
      setInputError('Digite o autor/nome do repositório');
      return;
    }

    try {
      const response = await api.get(`repos/${repo}`);

      setRepositories([...repositories, response.data]);
      setRepo('');
      setInputError('');
    } catch (error) {
      setInputError('Erro na busca por este repositório');
    }
  }

  return (
    <>
      <img src={logo} alt="Github Explorer" />
      <Title>Explore repositórios go Github</Title>

      <Form hasError={!!inputError} onSubmit={handleAddRepository}>
        <input
          value={repo}
          onChange={(e) => setRepo(e.target.value)}
          placeholder='Digite o nome do repositório'
        />
        <button type="submit">Pesquisar</button>
      </Form>

      {inputError && <Error>{inputError}</Error>}

      <Repositories>
        {repositories.map(repository => (
          <Link key={repository.full_name} to={`/repository/${repository.full_name}`}>
            <img src={repository.owner.avatar_url} alt={repository.owner.login} />
            <div>
              <strong>{repository.full_name}</strong>
              <p>{repository.description}</p>
            </div>
            <FiChevronRight size={20} />

          </Link>
        ))}
      </Repositories>
    </>
  );
}

export default Dashboard;
