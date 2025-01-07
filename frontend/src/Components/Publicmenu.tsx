import {slide as Menu } from 'react-burger-menu'
import { Button } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import axios from 'axios';
import VisibilityIcon from '@mui/icons-material/Visibility';


interface menuprops {
    state:boolean;
  }

async function handlelogout(){
  try{
     axios.post(`${process.env.REACT_APP_SERVER_ENV}/api/logout`,{},{withCredentials:true}).then(()=>{
      window.location.reload();
     })
    }
  catch(error:unknown){
    if (axios.isAxiosError(error)) {
      if (error.response && error.response.data) {
          throw new Error(`${error.response.data.detail}` || "An error occurred");
      } else if (error.message) {
          throw new Error(error.message);
      }
  } else {
      // For any non-Axios errors
      throw new Error("An unknown error occurred");
  }

  }

}

interface Menuprops{
  uid?:Number;
}

const Publicmenu:React.FC<Menuprops>=({uid})=>{

  const pathname: string = window.location.pathname;

  // Split the pathname by '/' and get the last segment
  const lastSegment: string = pathname.split('/').filter(Boolean).pop() || '';
  
  // Capitalize the first letter
  const profile: string = lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1);

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
          padding: '2.5em 0em 0',
          fontSize: '1.2em',
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
        <a href="/" style={{color:'white',textDecoration: 'none'}}>
        <div style={{
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap'}}>
       <HomeIcon />
       Home
        </div>  
        </a>
     
      </Menu>
    );
  }

export default Publicmenu;