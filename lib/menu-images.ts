export interface MenuImageConfig {
  src: string
  alt: string
  priority?: boolean
}

export const menuImages: Record<string, MenuImageConfig> = {
  // Main section heroes
  tandoori: {
    src: "/images/menu-tandoori-hero.jpg",
    alt: "Tandoori chicken with perfect char marks and traditional spices",
    priority: true
  },
  
  rice: {
    src: "/images/menu-rice-hero.jpg", 
    alt: "Aromatic biryani with basmati rice and spices",
    priority: true
  },
  
  curry: {
    src: "/images/menu-curry-hero.jpg",
    alt: "Rich and flavorful Indian curry with aromatic spices",
    priority: false
  },
  
  "veg-curry": {
    src: "/images/menu-curry-veggie-hero.jpg",
    alt: "Delicious vegetarian curry with fresh vegetables and spices",
    priority: false
  },
  
  "egg-curry": {
    src: "/images/menu-curry-egg-hero.jpg", 
    alt: "Traditional egg curry in rich, aromatic spices",
    priority: false
  },
  
  noodles: {
    src: "/images/menu-noodles-hero.jpg",
    alt: "Mixed ingredient fried noodles with vegetables and protein",
    priority: false
  },
  
  // Tiffin section images
  tiffin: {
    src: "/images/menu-tiffin-hero.jpg",
    alt: "Traditional South Indian dosa with chutneys",
    priority: false
  },
  
  "tiffin-panipuri": {
    src: "/images/menu-tiffin-panipuri.jpg",
    alt: "Pani puri with chutneys and traditional garnishes",
    priority: false
  },
  
  "veg-starter": {
    src: "/images/veg-starter-hero.jpg",
    alt: "Delicious vegetarian starters and appetizers",
    priority: false
  },
  
  "non-veg-starter": {
    src: "/images/non-veg-starter-hero.jpg",
    alt: "Delicious non-vegetarian starters and appetizers",
    priority: false
  },
  
  // Dessert section
  dessert: {
    src: "/images/menu-dessert-hero.jpg",
    alt: "Traditional gulab jamun dessert in sweet syrup",
    priority: false
  },
  
  "bread": {
    src: "/images/bread-hero.jpg",
    alt: "Fresh Indian breads and naans from the tandoor",
    priority: false
  },
  
  // Overall variety spread
  variety: {
    src: "/images/menu-variety-spread.jpg",
    alt: "Collection of various Indian dishes showcasing menu diversity",
    priority: false
  }
}