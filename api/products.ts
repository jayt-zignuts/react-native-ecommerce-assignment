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
export interface ProductsResponse {
  products: Product[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasMore: boolean;
}

export const fetchProducts = async (page = 1, limit = 5): Promise<ProductsResponse> => {
  try {
    const res = await fetch(`${API_URL}?sort=desc`);
    if (!res.ok) throw new Error('Failed to fetch products');
    const allProducts: Product[] = await res.json();

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProducts = allProducts.slice(startIndex, endIndex);
    
    return {
      products: paginatedProducts,
      currentPage: page,
      totalPages: Math.ceil(allProducts.length / limit),
      totalItems: allProducts.length,
      hasMore: endIndex < allProducts.length
    };
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
