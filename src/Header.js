import React from 'react'

//const Header = (props) => {//이와 같이 프롭을 쓰는 대신에
const Header = ({ title }) => { // 왼쪽의 디스트럭쳐링과 같은 형태를 
  // 쓸 수도 있다.
    /*const headerStyle = {
        backgroundColor: 'mediumblue',
        color: '#fff'
    };*/
  /*
  return (
    <header style={headerStyle}>
          <h1>{props.title}</h1>
    </header> 프롭을 썼을 경우, 아래는 디스트럭쳐링 형태를 썼을 경우
  )*/
  return (
    
    <header>
      <h1>{title}</h1>
    </header>
  )
}

Header.defaultProps = { // 디폴트 프롭
  // 프롭에서 이 부분이 빠져있을 경우, 혹은 어떤 이유로든지
  // 해당 프롭에서 값을 제대로 수신 받지 못하면 여기서의 
  // 디폴트 값으로 대신 대입
  title: "Default Title"
}

export default Header