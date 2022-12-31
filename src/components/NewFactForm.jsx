import { useState } from 'react';
import { CATEGORIES } from '../data/Catagory';
import { isValidHttpUrl } from '../validator';
import supabase from '../supabase';

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
      <select
        disabled={isUploading}
        value={category}
        onChange={(event) => setCategory(event.target.value)}
      >
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

export default NewFactForm;
