import React from 'react'

/*const Footer1 = () => {
    const today = new Date();
  return (
    <footer>
        <p>Copyright &copy; {today.getFullYear()}</p>
    </footer>
  )
}*/

const Footer1 = ({ length }) => {
  return (
    <div>
      <p>{length} List {length === 1 ? 'item': 'items'}</p>
    </div>
  )
}

export default Footer1