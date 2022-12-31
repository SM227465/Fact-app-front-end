import { useEffect, useState } from 'react';
import Loader from './components/Loader';
import Header from './components/Header';
import FactList from './components/FactList';
import NewFactForm from './components/NewFactForm';
import supabase from './supabase';
import CategoryFilter from './components/CategoryFilter';
import './style.css';

function App() {
  const [showForm, setShowForm] = useState(false);
  const [facts, setFacts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCategory, setCurrentCategory] = useState('all');

  useEffect(() => {
    async function getFacts() {
      setIsLoading(true);
      let query = supabase.from('facts').select('*');
      if (currentCategory !== 'all') {
        query = query.eq('category', currentCategory);
      }
      const { data: facts, error } = await query
        .order('voteLikeIt', { ascending: false })
        .limit(100);

      if (!error) {
        setFacts(facts);
      } else {
        alert('There is a problem getting data');
      }
      setIsLoading(false);
    }

    getFacts();
  }, [currentCategory]);

  return (
    <>
      <Header showForm={showForm} setShowForm={setShowForm} />
      {showForm ? <NewFactForm setFacts={setFacts} setShowForm={setShowForm} /> : null}
      <main className='main'>
        <CategoryFilter setCurrentCategory={setCurrentCategory} />
        {isLoading ? <Loader /> : <FactList facts={facts} setFacts={setFacts} />}
      </main>
    </>
  );
}

export default App;
