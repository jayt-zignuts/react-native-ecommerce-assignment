import { FavContext, FavoriteContextType } from "@/context/FavContext";
import { useContext } from "react";

export const useFavorites = (): FavoriteContextType => {
  const context = useContext(FavContext);
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavProvider");
  }
  return context;
};
