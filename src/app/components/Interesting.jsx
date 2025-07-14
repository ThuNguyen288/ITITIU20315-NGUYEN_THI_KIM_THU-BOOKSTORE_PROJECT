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
      titleText="Interesting"
      titleElement={
        <div className="flex justify-center items-center py-3">
          <span className="inline-block px-6 py-2 rounded-2xl text-primaryCustom-light text-2xl md:text-4xl font-extrabold tracking-wide">
            Products You May Be Interested In
          </span>
        </div>
      } 
      fetchUrl={`/api/Interesting?CustomerID=${customerID}`}
    />
  );
}
