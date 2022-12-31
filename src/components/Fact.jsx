import { useState } from 'react';
import supabase from '../supabase';
import { CATEGORIES } from '../data/Catagory';

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
      <span
        className='tag'
        style={{ backgroundColor: CATEGORIES.find((cat) => cat.name === fact.category).color }}
      >
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

export default Fact;
