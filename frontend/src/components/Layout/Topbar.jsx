import {TbBrandMeta} from "react-icons/tb";
import {IoLogoInstagram} from "react-icons/io";
import {RiTwitterXLine} from "react-icons/ri";

const Topbar = () => {
    return (
        <div className="bg-nexbuy-red text-white">
            <div className="container mx-auto flex justify-between items-center py-3 px4">
                <div className="hidden md:flex items-center space-x-4">
                    <a href="#" className="hover:text-gray-300">
                        <TbBrandMeta className="h-5 w-5" />
                    </a>
                    <a href="#" className="hover:text-gray-300">
                        <IoLogoInstagram className="h-5 w-5" />
                    </a>
                    <a href="#" className="hover:text-gray-300">
                        <RiTwitterXLine className="h-4 w-4" />
                    </a>
                </div>
                <div className="text-sm text-center flex-grow">
                    <span>We ship worldwide - Fast and reliable shipping!</span>
                </div>
                <div className="text-sm hidden md:block">
                <a href="tel:+1234567890" className="hover:text-gray-300">+91 1234567890</a>
            </div>
            </div>
            
        </div>
    )
}
export default Topbar