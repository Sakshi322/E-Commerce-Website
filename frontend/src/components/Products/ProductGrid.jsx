import { Link } from "react-router-dom";

const ProductGrid = ({ products, loading, error }) => {
  if(loading) {
    return <p>Loading...</p>
  }


  if(error) {
    return <p>Error: {error}</p>
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-6 auto-rows-[300px] w-full">
      {products?.map((product) => {
        const imageUrl = product?.images?.[0]?.url || "https://via.placeholder.com/300x200?text=No+Image";
        const altText = product?.images?.[0]?.altText || product.name || "Product";

        return (
          <Link key={product._id} to={`/product/${product._id}`} className="block">
            <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition flex flex-col justify-between h-full">
              <div className="w-full h-[200px] mb-2 overflow-hidden rounded-lg">
                <img
                  src={imageUrl}
                  alt={altText}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-sm font-medium mb-1 truncate">{product.name}</h3>
              <p className="text-gray-600 font-semibold text-sm">₹{product.price}</p>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default ProductGrid;
