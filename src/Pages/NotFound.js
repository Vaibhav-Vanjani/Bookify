export default function NotFound() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      backgroundColor: '#f8f8f8',
      color: '#444',
      fontFamily: 'Arial, sans-serif',
      textAlign: 'center'
    }}>
      <h1 style={{ fontSize: '6rem', margin: 0 }}>404</h1>
      <p style={{ fontSize: '1.5rem' }}>Oops! Page not found.</p>
    </div>
  );
}
