import {useRef , useState , useEffect} from "react";

import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { Link } from "react-router-dom";
import axios from "axios";

const NewArrivals = () => {
    const scrollRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(false);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);
   
      const [newArrivals, setNewArrivals] = useState([]);

      useEffect(() => {
        const fetchNewArrivals = async() => {
          try {
            const response = await axios.get(
              `${import.meta.env.VITE_BACKEND_URL}/api/products/new-arrivals`
            );
            setNewArrivals(response.data);
          } catch (error) {
              console.error(error);
          }
        };
           fetchNewArrivals();
      },  []);

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartX(e.pageX - scrollRef.current.offsetLeft);
        setScrollLeft(scrollRef.current.scrollLeft);
    };

    const handleMouseMove = (e) => {
         if(!isDragging) return;
         const x = e.pageX - scrollRef.current.offsetLeft;
         const walk = x - startX;
         scrollRef.current.scrollLeft = scrollLeft - walk;
    };

    const handleMouseUpOrLeave = () => {
       setIsDragging(false);
    };
 

   const scroll = (direction) => {
    const scrollAmount = direction === "left" ? -300 : 300;
    scrollRef.current.scrollBy({left: scrollAmount, behavior: "smooth"})
   };

   //Update Scroll Buttons

   const updateScrollButtons = () => {
     const container = scrollRef.current;

        if(container) {
            const leftScroll = container.scrollLeft;
            const rightScrollable = 
            container.scrollWidth > leftScroll + container.clientWidth;

            setCanScrollLeft(leftScroll > 0);
            setCanScrollRight(rightScrollable);
        }

     console.log({
        scrollLeft: container.scrollLeft,
        clientWidth: container.clientWidth,
        containerScrollWidth: container.scrollWidth,
        offsetLeft : scrollRef.current.offsetLeft,
     });
     }
   
   useEffect(() => {
    const container = scrollRef.current;
    if(container) {
        container.addEventListener("scroll", updateScrollButtons);
        updateScrollButtons();
        return () => container.removeEventListener("scroll", updateScrollButtons);
    }
   }, [newArrivals]);
   
   
   
    return (
        <section className="py-16 px-4 lg:px-0">
            <div className="container mx-auto text-center mb-10 relative">
                <h2 className="text-3xl font-bold mb-4">
                    Explore New Arrivals
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                    Discover the latest styles straight off the runway, freshly added to keep your wardrobe on the cutting edge of fashion.
                </p>

                {/* Scroll buttons */}

                <div className="absolute right-0 bottom-[30px] flex space-x-2 ">
                    <button 
                    onClick={() => scroll("left")}
                    disabled = {!canScrollLeft}
                    className={ `p-2 rounded border 
                    ${canScrollLeft ? "bg-white text-black" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}>
                        <FiChevronLeft className="text-2xl"/>
                    </button>
                    <button 
                    onClick={() => scroll("right")}
                    className= { `p-2 rounded border 
                    ${canScrollRight ? "bg-white text-black" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}>
                        <FiChevronRight className="text-2xl"/>
                    </button>
                </div>
            </div>

            {/* Scrollable Content */}

            <div 
            ref={scrollRef} 
            className= {`container mx-auto overflow-x-scroll flex space-x-6 relative ${isDragging ? "cursor-grabbing" : "cursor-grab" } `}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onMouseLeave={handleMouseUpOrLeave}
            >
                {newArrivals.map((product) => (
                    <div 
                     key= { product._id } 
                     className="min-w-[100%] sm:min-w-[50%] lg:min-w-[20%] relative">
                        <img 
                        src= {product.images[0]?.url}
                        alt= {product.images[0]?.altText || product.name} 
                        className="w-[300px] h-[300px] object-cover rounded-lg"
                        loading="lazy"
                        draggable = "false"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-opacity-50 backdrop-blur-md text-white p-4 rounded-b-lg">
                            <Link to={`/product/${product._id}`} className="block" >
                               <h4 className="font-medium"> {product.name} </h4>
                               <p className="mt-1 h-[10px]">&#8377;{product.price}</p>
                            </Link>
                        </div>
                    </div>
                ))}

            </div>
        </section>
    );
};
export default NewArrivals;