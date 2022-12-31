import { useEffect, useState } from 'react';
import supabase from './supabase';
import './style.css';

// Fake data
const CATEGORIES = [
  { name: 'technology', color: '#3b82f6' },
  { name: 'science', color: '#16a34a' },
  { name: 'finance', color: '#ef4444' },
  { name: 'society', color: '#eab308' },
  { name: 'entertainment', color: '#db2777' },
  { name: 'health', color: '#14b8a6' },
  { name: 'history', color: '#f97316' },
  { name: 'news', color: '#8b5cf6' },
];

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
      const { data: facts, error } = await query.order('voteLikeIt', { ascending: false }).limit(100);

      if (!error) {
        setFacts(facts);
      } else {
        alert('There is a problem getting data');
      }
      setIsLoading(false);
      console.log(error);
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

function Loader() {
  return <p className='message'>Loading...</p>;
}

function Header(props) {
  const { showForm, setShowForm } = props;
  const appTitle = 'Facts';

  return (
    <header className='header'>
      <div className='logo'>
        <img src='logo.png' alt='Today I Learned Logo' />
        <h1>{appTitle}</h1>
      </div>
      <button
        className='btn btn-large btn-open'
        onClick={() => {
          setShowForm((formState) => !formState);
        }}
      >
        {showForm ? 'Close' : 'Share a fact'}
      </button>
    </header>
  );
}

function isValidHttpUrl(string) {
  let url;
  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }
  return url.protocol === 'http:' || url.protocol === 'https:';
}

function NewFactForm(props) {
  const { setFacts, setShowForm } = props;
  const [text, setText] = useState('');
  const [source, setSource] = useState('');
  const [category, setCategory] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const textLength = text.length;
  const handleFormSubmit = async (event) => {
    // i) Prevent the browser reload
    event.preventDefault();

    // ii) Check if data is valid
    if (!text || !isValidHttpUrl(source) || !category || textLength > 200) {
      console.log('Invalid data');
      return;
    }

    // iii) Create a new fact object
    const newFactObj = {
      // id: initialFacts.length + 2,
      text: text,
      source: source,
      category: category,
      // voteLikeIt: 0,
      // voteLoveIt: 0,
      // VoteDislikeIt: 0,
    };

    // Upload fact to DB
    setIsUploading(true);
    const { data: newFact, error } = await supabase.from('facts').insert([newFactObj]).select();
    console.log(newFact);
    setIsUploading(false);

    // iv) Add new fact to UI
    if (!error) {
      setFacts((facts) => [newFact[0], ...facts]);
    }

    // v) Reset form inputs
    setText('');
    setSource('');
    setCategory('');

    // vi) Close the form
    setShowForm(false);
    console.log(text, source, category);
  };
  return (
    <form className='fact-form' onSubmit={handleFormSubmit}>
      <input
        type='text'
        placeholder='Share a fact with the world...'
        disabled={isUploading}
        value={text}
        onChange={(event) => {
          setText(event.target.value);
        }}
      />
      <span>{200 - textLength}</span>
      <input
        type='text'
        value={source}
        onChange={(event) => setSource(event.target.value)}
        placeholder='Trustworthy spurce...'
        disabled={isUploading}
      />
      <select disabled={isUploading} value={category} onChange={(event) => setCategory(event.target.value)}>
        <option value=''>Choose category:</option>
        {CATEGORIES.map((cat) => (
          <option key={cat.name} value={cat.name}>
            {cat.name.toUpperCase()}
          </option>
        ))}
      </select>
      <button className='btn btn-large' disabled={isUploading}>
        Post
      </button>
    </form>
  );
}

function CategoryFilter(props) {
  const { setCurrentCategory } = props;
  return (
    <aside>
      <ul>
        <li className='category'>
          <button className='btn btn-all-categories' onClick={() => setCurrentCategory('all')}>
            All
          </button>
        </li>
        {CATEGORIES.map((cat) => (
          <li key={cat.name} className='category'>
            <button
              className='btn btn-category'
              onClick={() => setCurrentCategory(cat.name)}
              style={{ backgroundColor: cat.color }}
            >
              {cat.name}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}

function FactList(props) {
  const { facts, setFacts } = props;

  if (facts.length === 0) {
    return <p className='message'>No facts for this category yet! Create the first one</p>;
  }
  return (
    <section>
      <ul className='facts-list'>
        {facts.map((fact) => (
          <Fact key={fact.id} fact={fact} setFacts={setFacts} />
        ))}
      </ul>
    </section>
  );
}

function Fact(props) {
  const { fact, setFacts } = props;
  const [isUpdating, setIsUpdating] = useState(false);
  const isDisputed = fact.voteLikeIt + fact.voteLoveIt < fact.voteDislikeIt;

  async function handleVotes(columnName) {
    setIsUpdating(true);
    const { data: updatedFact, error } = await supabase
      .from('facts')
      .update({ [columnName]: fact[columnName] + 1 })
      .eq('id', fact.id)
      .select();
    setIsUpdating(false);
    console.log(updatedFact);

    if (!error) {
      setFacts((facts) => facts.map((f) => (f.id === fact.id ? updatedFact[0] : f)));
    }
  }

  return (
    <li className='fact'>
      <p>
        {isDisputed ? <span className='disputed'>[⛔️DISPUTED]</span> : null}
        {fact.text}
        <a className='source' href={fact.source} target='_blank' rel='noopener noreferrer'>
          (Source)
        </a>
      </p>
      <span className='tag' style={{ backgroundColor: CATEGORIES.find((cat) => cat.name === fact.category).color }}>
        {fact.category}
      </span>
      <div className='vote-buttons'>
        <button disabled={isUpdating} onClick={() => handleVotes('voteLikeIt')}>
          👍 {fact.voteLikeIt}
        </button>
        <button disabled={isUpdating} onClick={() => handleVotes('voteLoveIt')}>
          🤯 {fact.voteLoveIt}
        </button>
        <button disabled={isUpdating} onClick={() => handleVotes('voteDislikeIt')}>
          ⛔️ {fact.voteDislikeIt}
        </button>
      </div>
    </li>
  );
}

export default App;
