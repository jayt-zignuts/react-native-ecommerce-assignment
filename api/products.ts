export type Product = {
  id: number;                
  title: string;               
  price: number;             
  description: string;         
  category: string;           
  image: string;              
  rating?: {                   
    rate: number;
    count: number;
  };
};

const API_URL = 'https://fakestoreapi.com/products';

export const fetchProducts = async (page = 1, limit = 5): Promise<Product[]> => {
  try {
    const res = await fetch(`${API_URL}?limit=${limit}&sort=desc`);
    if (!res.ok) throw new Error('Failed to fetch products');
    const data: Product[] = await res.json();

    const start = (page - 1) * limit;
    const end = page * limit;
    return data.slice(start, end);
  } catch (error) {
    console.error('fetchProducts error:', error);
    throw error;
  }
};


export const fetchProductById = async (id: number): Promise<Product> => {
  try {
    const res = await fetch(`${API_URL}/${id}`);
    if (!res.ok) throw new Error(`Failed to fetch product with id ${id}`);
    const data: Product = await res.json();
    return data;
  } catch (error) {
    console.error('fetchProductById error:', error);
    throw error;
  }
};
