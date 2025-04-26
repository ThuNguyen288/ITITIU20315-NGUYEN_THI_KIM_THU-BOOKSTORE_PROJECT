'use client';
import { useEffect, useState } from "react";
import ProductList from "./ProductsCard";

export default function Interesting() {
  const [customerID, setCustomerID] = useState(null);

  useEffect(() => {
    const storedID = localStorage.getItem("customerId");
    if (storedID) setCustomerID(storedID);
  }, []);

  if (!customerID) return null; // Hoặc loading...

  return (
    <ProductList 
      title="Products you may be interested in" 
      fetchUrl={`/api/Interesting?CustomerID=${customerID}`}
    />
  );
}
