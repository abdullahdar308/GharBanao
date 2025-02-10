import { createSlice, nanoid } from "@reduxjs/toolkit";

import productPic from "../../assets/itemPic.png";

const initialState = {
  categories: [
    {
      id: nanoid(),
      name: "Furniture",
      subCategories: [
        {
          id: nanoid(),
          name: "Living Room",
          items: [
            {
              id: nanoid(),
              name: "Sofa Set",
              price: 80000,
              pic: [productPic],
              description:
                "This sofa set offers both comfort and luxury, with a modern design that fits perfectly in any living room. Made from high-quality fabric and durable frames, it provides optimal seating for family and guests. The neutral colors ensure it complements any décor, making it a versatile addition to your home.",
            },
            {
              id: nanoid(),
              name: "Coffee Table",
              price: 20000,
              pic: [productPic],
              description:
                "This sleek coffee table is a perfect blend of style and function. Its minimalist design allows it to fit seamlessly into any living room décor. The sturdy frame and spacious top make it an ideal spot for your coffee, books, or decorative pieces, adding a touch of elegance to your home.",
            },
            {
              id: nanoid(),
              name: "TV Stand",
              price: 15000,
              pic: [productPic],
              description:
                "This modern TV stand is designed to accommodate all your entertainment needs. Its sleek, contemporary design helps organize your space while supporting large televisions and multimedia devices. With additional storage for cables and remotes, it combines practicality with aesthetic appeal.",
            },
            {
              id: nanoid(),
              name: "Bookshelf",
              price: 10000,
              pic: [productPic],
              description:
                "This bookshelf is perfect for organizing your favorite books, décor, and trinkets. The sturdy construction ensures longevity while the modern design keeps it stylish and functional. Its open shelving design allows easy access to your books while making a statement in your living room or office.",
            },
          ],
        },
        {
          id: nanoid(),
          name: "Bedroom",
          items: [
            {
              id: nanoid(),
              name: "Bed Frame",
              price: 50000,
              pic: [productPic],
              description:
                "This bed frame is crafted for durability and comfort, providing a sturdy base for your mattress. Its sleek design fits perfectly with various bedroom styles, offering both functionality and aesthetics. With easy-to-assemble instructions, it ensures a peaceful and restful sleep environment.",
            },
            {
              id: nanoid(),
              name: "Nightstand",
              price: 10000,
              pic: [productPic],
              description:
                "This nightstand offers both storage and convenience. Featuring a spacious drawer and a compact design, it’s perfect for keeping your essentials close at hand. Its simple, modern design complements any bedroom, while the high-quality materials ensure long-lasting use.",
            },
            {
              id: nanoid(),
              name: "Wardrobe",
              price: 30000,
              pic: [productPic],
              description:
                "This spacious wardrobe is designed to help you organize your clothing with ease. Featuring multiple shelves and hanging spaces, it provides ample storage. The contemporary design blends seamlessly into modern bedrooms, while the sturdy build ensures longevity and reliability.",
            },
          ],
        },
      ],
    },
    {
      id: nanoid(),
      name: "Electronics",
      subCategories: [
        {
          id: nanoid(),
          name: "Home Appliances",
          items: [
            {
              id: nanoid(),
              name: "Air Conditioner",
              price: 120000,
              pic: [productPic],
              description:
                "This air conditioner ensures cool comfort during hot days. With energy-efficient features and a sleek design, it offers both performance and aesthetics. The unit cools rooms quickly and operates quietly, making it a must-have for a comfortable and pleasant living environment.",
            },
            {
              id: nanoid(),
              name: "Washing Machine",
              price: 85000,
              pic: [productPic],
              description:
                "This washing machine makes laundry a breeze with its variety of washing cycles. Its efficient design and energy-saving technology ensure that you get the best clean while keeping power consumption low. With a large capacity, it can handle your family’s laundry needs with ease.",
            },
            {
              id: nanoid(),
              name: "Refrigerator",
              price: 140000,
              pic: [productPic],
              description:
                "This spacious refrigerator offers ample storage for all your food and beverages. With adjustable shelves and energy-efficient cooling, it keeps your items fresh while saving on electricity costs. The modern design complements any kitchen and provides years of reliable performance.",
            },
          ],
        },
        {
          id: nanoid(),
          name: "Kitchen Appliances",
          items: [
            {
              id: nanoid(),
              name: "Microwave Oven",
              price: 40000,
              pic: [productPic],
              description:
                "This microwave oven offers quick cooking and reheating. With its easy-to-use interface and multiple settings, it’s perfect for defrosting, reheating, and cooking meals in minutes. The compact design ensures it fits easily in your kitchen, while the durable materials ensure longevity.",
            },
            {
              id: nanoid(),
              name: "Blender",
              price: 15000,
              pic: [productPic],
              description:
                "This powerful blender is ideal for making smoothies, soups, sauces, and more. With durable blades and multiple speed settings, it handles a wide variety of tasks with ease. Its easy-to-clean design and compact size make it a convenient addition to any kitchen.",
            },
            {
              id: nanoid(),
              name: "Toaster",
              price: 10000,
              pic: [productPic],
              description:
                "This toaster is designed to deliver perfectly toasted bread every time. With adjustable settings for light to dark toast, it caters to everyone’s preferences. Its sleek design fits well in any kitchen, while the durable construction ensures it will last for years.",
            },
          ],
        },
      ],
    },

    {
      id: nanoid(),
      name: "House Decor",
      subCategories: [
        {
          id: nanoid(),
          name: "Wall Art",
          items: [
            {
              id: nanoid(),
              name: "Framed Painting",
              price: 25000,
              pic: [productPic],
              description:
                "This framed painting brings an artistic touch to your walls. The vivid colors and beautiful brushstrokes make it a perfect addition to any living room, bedroom, or hallway. The frame complements the painting, enhancing its beauty while providing a refined, elegant look.",
            },
            {
              id: nanoid(),
              name: "Wall Mirror",
              price: 15000,
              pic: [productPic],
              description:
                "This stylish wall mirror serves as both a functional and decorative piece. Its elegant frame adds sophistication to any room, while the mirror itself opens up space and reflects light, making it a perfect choice for enhancing the visual appeal of your home.",
            },
          ],
        },
        {
          id: nanoid(),
          name: "Decorative Accessories",
          items: [
            {
              id: nanoid(),
              name: "Decorative Vases",
              price: 5000,
              pic: [productPic],
              description:
                "These decorative vases add a touch of elegance and style to any room. Perfect for holding fresh flowers or standing alone as a beautiful accent piece, they come in a variety of shapes, sizes, and finishes to complement any décor style.",
            },
            {
              id: nanoid(),
              name: "Table Lamps",
              price: 12000,
              pic: [productPic],
              description:
                "This table lamp provides both functionality and style. The sleek design fits into any room, while the soft light creates a cozy ambiance. Perfect for side tables, desks, or nightstands, this lamp adds a warm glow to your living space.",
            },
          ],
        },
      ],
    },
  ],

  selectedCategoryId: "",
  selectedSubCategoryId: "",
  selectedItemId: null,
};

export const categoriesSlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    setCategory: (state, action) => {
      state.selectedCategoryId = action.payload;
    },
    setSubCategory: (state, action) => {
      state.selectedSubCategoryId = action.payload;
    },
    setSelectedtItem: (state, action) => {
      state.selectedItemId = action.payload;
    },
  },
});

export const { setCategory, setSubCategory, setSelectedtItem } =
  categoriesSlice.actions;

export default categoriesSlice.reducer;
