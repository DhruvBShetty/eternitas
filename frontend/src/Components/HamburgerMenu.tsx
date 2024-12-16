import Hamburger from 'hamburger-react'
import React,{useState} from 'react'
import Mymenu from './Menu'



const Hamburgermenu=()=>{
    const [open, setstate] = useState(false)
    return(
    <>
    <Hamburger label="Menu" toggled={open} toggle={setstate}/>
    {/* <Mymenu state={open}/> */}
    </>
    )
}

export default Hamburgermenu