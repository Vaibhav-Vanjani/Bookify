import { useEffect, useRef, useState } from 'react';
import slide6 from '../assets/book-discount-slide1.jpg';
import slide3 from '../assets/book-discount-slide2.jpg'; // assumed different for variety
import slide2 from '../assets/book-discount-slide3.jpg';
import slide5 from '../assets/book-discount-slide4.jpg';
import slide4 from '../assets/book-discount-slide5.jpg';
import slide1 from '../assets/book-discount-slide6.jpg';
import '../Css/ImageSlider.css'

const slides = [{slide:slide1,id:1}, {slide:slide2,id:2}, {slide:slide3,id:3}, {slide:slide4,id:4}, {slide:slide5,id:5}, {slide:slide6,id:6}];

export default function ImageSlider({ size = 6 }) {
    // Only keep as many as requested (avoid going beyond available images)
    const visibleSlides = slides.slice(0, size);
    const [nextVisible,setNextVisible] = useState(2);
    const ref = useRef(null);

   useEffect(() => {
    const id = setInterval(() => {
        setNextVisible(prev => {
            // console.log(prev, "prev");
            return prev === 1 ? size : prev - 1;
        });
    }, 2000);

    ref.current = id;

    return () => clearInterval(id); 
}, []);

    return (
        <div className="image-slider">
            <span className='left-slide' onClick={()=>{
                if(!!ref.current){
                    clearInterval(ref.current);
                    ref.current = null;
                }
                setNextVisible(prev=>{
                    if(prev==1){
                        return size;
                    }
                    else{
                        return (prev-1);
                    }
                })
            }}>{`<`}</span>
            {visibleSlides.map((slide, index) => (
                <img
                    data-visible={slide.id == nextVisible ? "visible" : "hide"}
                    key={slide.id}
                    src={slide.slide}
                    alt={`discount-book-slide-${index + 1}`}
                />
            ))}

             <span 
                className='right-slide'
                onClick={()=>{
                    
                    if(!!ref.current){
                        clearInterval(ref.current);
                        ref.current = null;
                    }

                setNextVisible(prev=>{
                    if(prev==size){
                        return 1;
                    }
                    else{
                        return (prev+1);
                    }
                })
            }}>{`>`}</span>
        </div>
    );
}
