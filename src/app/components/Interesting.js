'use client';
import { useEffect, useState } from "react";
import ProductList from "./ProductsCard";

export default function Interesting() {
  const [customerID, setCustomerID] = useState(null);
  const [roleID, setRoleID] = useState(null);

  useEffect(() => {
    const storedID = localStorage.getItem("customerId");
    const roleID = localStorage.getItem("roleId");
    if (roleID) setRoleID(roleID);
    if (storedID) setCustomerID(storedID);
  }, []);

  if (!customerID || roleID ==='2') return null; // Hoặc loading...

  return (
    <ProductList 
    title={
      <span className="text-3xl font-extrabold text-center text-white bg-gradient-to-r from-cyan-300 to-fuchsia-200 px-6 py-2 w-full shadow-lg inline-block">
         Product you may interesting in
      </span> }
      fetchUrl={`/api/Interesting?CustomerID=${customerID}`}
    />
  );
}
