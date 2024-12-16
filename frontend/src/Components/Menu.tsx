import {slide as Menu } from 'react-burger-menu'
import React from 'react';



interface menuprops {
    state:boolean;
  }

class Mymenu extends React.Component {
 
  render () {
    // NOTE: You also need to provide styles, see https://github.com/negomi/react-burger-menu#styling
    var styles = {
        bmBurgerButton: {
          position: 'fixed',
          width: '36px',
          height: '30px',
          left: '36px',
          top: '36px'
        },
        bmBurgerBars: {
          background: '#373a47'
        },
        bmBurgerBarsHover: {
          background: '#a90000'
        },
        bmCrossButton: {
          height: '24px',
          width: '24px'
        },
        bmCross: {
          background: 'white'//'#bdc3c7'
        },
        bmMenuWrap: {
          position: 'fixed',
          height: '100%'
        },
        bmMenu: {
          background: 'black',//'#373a47',
          padding: '2.5em 1.5em 0',
          fontSize: '1.5em',
          overflow:'hidden'
        },
        bmMorphShape: {
          fill:' #FFDF00',//'#373a47'
        },
        bmItemList: {
          color: '#b8b7ad',
          padding: '0.8em'
        },
        bmItem: {
          display: 'inline-block',
          color:'white'
        },
        bmOverlay: {
          background: 'rgba(0, 0, 0, 0.3)'
        }
      };

    return (
      <Menu styles= {styles} width={'200px'}>
        <a id="home" className="menu-item" href="/">Home</a><br></br>
      </Menu>
    );
  }
}

export default Mymenu;