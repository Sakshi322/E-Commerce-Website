import mensCollectionImage from "../../assets/assests_/product_24.png";
import womensCollectionImage from "../../assets/assests_/product_10.png";
import { Link } from "react-router-dom";

const GenderCollectionSection = () => {
    return (
        <section className="py-16 px-4 lg:px-0">
            <div className="container mx-auto flex flex-col md:flex-row gap-8">
                {/* Women collection */}
                <div className="relative flex-1">
                    <img src ={womensCollectionImage} 
                       alt="Women's collection"
                       className="w-full h-[400px] object-cover object-top" 
                    />
                    <div className="absolute bottom-8 left-8 bg-white bg-opacity-90 p-4">
                        <h2 className="text-2xl font-bold text-gray-900 mb-3 tracking-tighter">
                            Women's Collection
                        </h2>
                        <Link to="/collections/all?gender=Women"
                        className="text-gray-900 underline">
                            Shop Now
                        </Link>
                    </div>
                    
                </div>

                {/* Men's Collection */}

                 <div className="relative flex-1">
                    <img src ={mensCollectionImage} 
                       alt="Men's collection"
                       className="w-full h-[400px] object-cover object-top" 
                    />
                    <div className="absolute bottom-8 left-8 bg-white bg-opacity-90 p-4">
                        <h2 className="text-2xl font-bold text-gray-900 mb-3 tracking-tighter">
                            Men's Collection
                        </h2>
                        <Link to="/collections/all?gender=Men"
                        className="text-gray-900 underline">
                            Shop Now
                        </Link>
                    </div>
                    
                </div>


            </div>
        </section>
    )
}
export default GenderCollectionSection;