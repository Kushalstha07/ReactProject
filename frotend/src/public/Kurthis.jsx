import React from 'react'
import { useNavigate } from 'react-router-dom';
import './Kurtis.css';

import W5 from '../assets/W5.jpg';
import W6 from '../assets/W6.jpg';
import W7 from '../assets/W7.jpg';

import W8 from '../assets/W8.jpg';
import W2 from '../assets/W2.png';
import W4 from '../assets/W4.png';

import W10 from '../assets/W10.jpg';
import W9 from '../assets/W9.jpg';
import W3 from '../assets/W3.png';

   function Kurtis(){
    const navigate = useNavigate();
    
      const handleNavigation = (path) => {
        navigate(path);
      };

   return(
    <div className= 'mainbody'>
        
        <p className='dresshead'>Kurtis Module</p>


        <div className='topimage'>
            <img src={W5} alt='' style={{width:'20%'}}/>
            <img src={W6} alt=''style={{width:'20%'}}/>
            <img src={W7} alt=''style={{width:'20%'}}/>
            <img src={W4} alt='' style={{width:'20%'}}/>
        </div>

        <div className='price0'>
        <div className='price'>
            <p style={{color: 'black'}}>Dark Volient Flower Set</p>
            <p style={{color: 'black'}}>Size Avaiable: 36, 40</p>
            <p style={{color: 'black'}}>Rs. 666</p>
        </div>
        <div className='price'>
            <p style={{color: 'black'}}>Light Volient Flower Set</p>
            <p style={{color: 'black'}}>Size Avaiable: 36, 40</p>
            <p style={{color: 'black'}}>Rs. 666</p>
        </div>
        <div className='price'>
            <p style={{color: 'black'}}>Dark Blue Volient Flower Set</p>
            <p style={{color: 'black'}}>Size Avaiable: 36, 40</p>
            <p style={{color: 'black'}}>Rs. 666</p>
        </div>
        <div className='price'>
            <p style={{color: 'black'}}>Dark Blue Volient Flower Set</p>
            <p style={{color: 'black'}}>Size Avaiable: 36, 40</p>
            <p style={{color: 'black'}}>Rs. 666</p>
        </div>
        </div>

        <div className='middleimage'>
            <img src={W8} alt='' style={{width:'20%'}}/>
            <img src={W2} alt='' style={{width:'20%'}}/>
            <img src={W4} alt='' style={{width:'20%'}}/>
            <img src={W8} alt='' style={{width:'20%'}}/>
        </div>

        <div className='price0'>
        <div className='price'>
            <p style={{color: 'black'}}>Dark Volient Flower Set</p>
            <p style={{color: 'black'}}>Size Avaiable: 36, 40</p>
            <p style={{color: 'black'}}>Rs. 666</p>
        </div>
        <div className='price'>
            <p style={{color: 'black'}}>Light Volient Flower Set</p>
            <p style={{color: 'black'}}>Size Avaiable: 36, 40</p>
            <p style={{color: 'black'}}>Rs. 666</p>
        </div>
        <div className='price'>
            <p style={{color: 'black'}}>Dark Blue Volient Flower Set</p>
            <p style={{color: 'black'}}>Size Avaiable: 36, 40</p>
            <p style={{color: 'black'}}>Rs. 666</p>
        </div>
        <div className='price'>
            <p style={{color: 'black'}}>Dark Blue Volient Flower Set</p>
            <p style={{color: 'black'}}>Size Avaiable: 36, 40</p>
            <p style={{color: 'black'}}>Rs. 666</p>
        </div>
        </div>

        <div className='buttonimage'>
            <img src={W10} alt=''  style={{width:'20%'}}/>
            <img src={W9} alt=''  style={{width:'20%'}}/>
            <img src={W3} alt=''  style={{width:'20%'}}/>
            <img src={W5} alt='' style={{width:'20%'}}/>
        </div>
        <div className='price0'>
        <div className='price'>
            <p style={{color: 'black'}}>Dark Volient Flower Set</p>
            <p style={{color: 'black'}}>Size Avaiable: 36, 40</p>
            <p style={{color: 'black'}}>Rs. 666</p>
        </div>
        <div className='price'>
            <p style={{color: 'black'}}>Light Volient Flower Set</p>
            <p style={{color: 'black'}}>Size Avaiable: 36, 40</p>
            <p style={{color: 'black'}}>Rs. 666</p>
        </div>
        <div className='price'>
            <p style={{color: 'black'}}>Dark Blue Volient Flower Set</p>
            <p style={{color: 'black'}}>Size Avaiable: 36, 40</p>
            <p style={{color: 'black'}}>Rs. 666</p>
        </div>
        <div className='price'>
            <p style={{color: 'black'}}>Dark Blue Volient Flower Set</p>
            <p style={{color: 'black'}}>Size Avaiable: 36, 40</p>
            <p style={{color: 'black'}}>Rs. 666</p>
        </div>
        </div>

         <div className='lastimage'>
            <img src={W7} alt=''  style={{width:'20%'}}/>
            <img src={W5} alt=''  style={{width:'20%'}}/>
            <img src={W8} alt=''  style={{width:'20%'}}/>
            <img src={W4} alt='' style={{width:'20%'}}/>
        </div>
        <div className='price0'>
        <div className='price'>
            <p style={{color: 'black'}}>Dark Volient Flower Set</p>
            <p style={{color: 'black'}}>Size Avaiable: 36, 40</p>
            <p style={{color: 'black'}}>Rs. 666</p>
        </div>
        <div className='price'>
            <p style={{color: 'black'}}>Light Volient Flower Set</p>
            <p style={{color: 'black'}}>Size Avaiable: 36, 40</p>
            <p style={{color: 'black'}}>Rs. 666</p>
        </div>
        <div className='price'>
            <p style={{color: 'black'}}>Dark Blue Volient Flower Set</p>
            <p style={{color: 'black'}}>Size Avaiable: 36, 40</p>
            <p style={{color: 'black'}}>Rs. 666</p>
        </div>
        <div className='price'>
            <p style={{color: 'black'}}>Dark Blue Volient Flower Set</p>
            <p style={{color: 'black'}}>Size Avaiable: 36, 40</p>
            <p style={{color: 'black'}}>Rs. 666</p>
        </div>
        </div>

    </div>
     )
     };
export default Kurtis; 