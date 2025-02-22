function Footer() {
  return (
   <div style={{
    position: 'absolute', 
    bottom: '5%', 
    right: '0', 
    padding: '.5% 1%', 
    backgroundColor: 'white',
    borderRadius: '250px 0 0 250px', 
    width: '25%',
    height: '10%',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3

  }}>
    <span>
      Created by an Avocado
    </span>
    <div style={{ flex: .1 }} />
    <img src="/images/avocado.svg" alt="avo pic palette"
    style={{
      height:'30px',
    }} />
  </div>
  )
}

export default Footer