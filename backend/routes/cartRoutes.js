const express = require("express");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const { protect } = require("../middleware/authMiddleware");


const router = express.Router();

// Helper function to get a cart by user ID or guest ID
const getCart = async (userId, guestId) => {
  if (userId) {
    return await Cart.findOne({ user: userId });
  } else if (guestId) {
    return await Cart.findOne({ guestId });
  }
  return null;
};

// @route   POST /api/cart
// @desc    Add a product to the cart
router.post("/", async (req, res) => {
  const { productId, quantity, size, color, guestId, userId } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product)
      return res.status(404).json({ message: "Product not found" });

    let cart = await getCart(userId, guestId);

    if (cart) {
      const productIndex = cart.products.findIndex(
        (p) =>
          p.productId.toString() === productId &&
          p.size === size &&
          p.color === color
      );

      if (productIndex > -1) {
        cart.products[productIndex].quantity += quantity;
      } else {
        cart.products.push({
          productId,
          name: product.name,
          image: product.images?.[0]?.url || "",
          price: product.price,
          size,
          color,
          quantity,
        });
      }

      cart.totalPrice = cart.products.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );

      await cart.save();
      return res.status(200).json(cart);
    } else {
      const newCart = await Cart.create({
        user: userId || undefined,
        guestId: guestId || "guest_" + Date.now(),
        products: [
          {
            productId,
            name: product.name,
            image: product.images?.[0]?.url || "",
            price: product.price,
            size,
            color,
            quantity,
          },
        ],
        totalPrice: product.price * quantity,
      });

      return res.status(201).json(newCart);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// @route   PUT /api/cart
// @desc    Update product quantity in cart or remove if quantity is 0
router.put("/", async (req, res) => {
  const { productId, quantity, size, color, guestId, userId } = req.body;

  try {
    let cart = await getCart(userId, guestId);
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const productIndex = cart.products.findIndex(
      (p) =>
        p.productId.toString() === productId &&
        p.size === size &&
        p.color === color
    );

    if (productIndex > -1) {
      if (quantity > 0) {
        cart.products[productIndex].quantity = quantity;
      } else {
        cart.products.splice(productIndex, 1); // Remove product if quantity <= 0
      }

      cart.totalPrice = cart.products.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );

      await cart.save();
      return res.status(200).json(cart);
    } else {
      return res.status(404).json({ message: "Product not found in cart" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
});

// @route   DELETE /api/cart
// @desc    Delete product from cart
router.delete("/", async (req, res) => {
  const { productId, size, color, guestId, userId } = req.body;

  try {
    let cart = await getCart(userId, guestId);
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const productIndex = cart.products.findIndex(
      (p) =>
        p.productId.toString() === productId &&
        p.size === size &&
        p.color === color
    );

    if (productIndex === -1) {
      return res
        .status(404)
        .json({ message: "Product not found in cart" });
    }

    cart.products.splice(productIndex, 1);

    cart.totalPrice = cart.products.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    await cart.save();

    return res.status(200).json({ message: "Product removed", cart });
  } catch (error) {
    console.error(error);
     return res.status(500).json({ message: "Server Error" });
  }
});


   router.get("/", async (req, res) => {
  const { userId, guestId } = req.query;

  try {
    const cart = await getCart(userId, guestId);
    if (cart) {
      res.json(cart);
    } else {
      res.status(404).json({ message: "Cart not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

  // @route POST /api/cart/merge
// @desc Merge guest cart into user cart on login
// @access Private
router.post("/merge", protect, async (req, res) => {
  const { guestId } = req.body;

  try {
    // Find the guest cart and user cart
    const guestCart = await Cart.findOne({ guestId });
    const userCart = await Cart.findOne({ user: req.user._id });
 
    if(guestCart) {
        if(guestCart.products.length === 0) {
            return res.status(400).json({message: "Guest cart is empty"})
        }

        if(userCart) {
            guestCart.products.forEach((guestItem) => {
                const productIndex = userCart.products.findIndex((item) => 
                    item.productId.toString() === guestItem.productId.toString() && item.size === guestItem.size && item.color === guestItem.color
            );

            if(productIndex > -1) {
                userCart.products[productIndex].quantity += guestItem.quantity;
            } else{
                userCart.products.push(guestItem);
            }

            });

            userCart.totalPrice = userCart.products.reduce((acc, item) => acc+item.price * item.quantity,
             0  
         );
                await userCart.save();

    // Remove the guest cart after merging
    try {
        await Cart.findOneAndDelete({ guestId });
    } catch (error) {
        console.error("Error deleting guest cart:", error);
    }

    res.status(200).json(userCart);
} else {
    // If the user has no existing cart, assign the guest cart to the user
    guestCart.user = req.user._id;
    guestCart.guestId = undefined;
    await guestCart.save();

    res.status(200).json(guestCart);
}

} else {
    if (userCart) {
        return res.status(200).json(userCart);
    }

    res.status(404).json({message: "guest cart not found"});
}
    
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Server Error"});
    }
});


module.exports = router;
