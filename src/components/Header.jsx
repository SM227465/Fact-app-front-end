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

export default Header;
