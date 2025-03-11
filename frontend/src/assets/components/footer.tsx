function Footer() {
  return (
    <div style={{
      position: 'absolute', 
      bottom: '2%', 
      right: '0', 
      padding: '1%', 
      backgroundColor: 'white',
      borderRadius: '250px 0 0 250px', 
      width: 'auto', // Let the content dictate the width
      minWidth: '150px', // Set a minimum width to ensure it doesn't get too small
      maxWidth: '90%', // Set a maximum width to ensure it doesn't get too large
      height: 'auto',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 3,
      flexWrap: 'wrap', // Prevent wrapping for inline alignment
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Add some shadow for better visibility
      transition: 'width 0.3s ease', // Smooth transition for width changes
    }}>
      <span style={{
        fontSize: '1rem', // Adjust font size for responsiveness
        // textAlign: 'center', // Center text for better alignment
        flex: '1', // Allow text to grow and shrink
        whiteSpace: 'nowrap', // Prevent text from wrapping
      }}>
        Created by an Avocado
      </span>
      <img src="/images/avocado.svg" alt="avo pic palette"
        style={{
          height: '30px',
          flex: '0 0 auto', // Prevent image from stretching
          marginLeft: '10px', // Add some space between text and image
        }} />
    </div>
  )
}

export default Footer;