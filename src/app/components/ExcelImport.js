'use client';

import React, { useState } from 'react';
import * as XLSX from 'xlsx';

export default function ExcelImport() {
  const [data, setData] = useState([]);
  const [isImporting, setIsImporting] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const json = XLSX.utils.sheet_to_json(worksheet);
    setData(json);
  };

  const handleImport = async () => {
    setIsImporting(true);
    setMessage("");

    for (const row of data) {
      const payload = {
        name: row.Name,
        description: row.Description,
        cost: row.Cost,
        price: row.Price,
        stock: row.Stock,
        categoryId: row.CategoryID,
        penType: row.PenType || null,
        inkColor: row.InkColor || null,
        author: row.Author || null,
        publisher: row.Publisher || null,
        publishYear: row.PublishYear || null,
        tags: row.TagID ? row.TagID.toString().split(',').map(id => parseInt(id.trim())) : [],
        images: row.ImageURL ? [row.ImageURL] : [],
      };

      try {
        const res = await fetch('/api/admin/products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const err = await res.json();
          console.error("Error:", err);
        }
      } catch (err) {
        console.error("Error adding product:", err);
      }
    }

    setIsImporting(false);
    setMessage("✅ Nhập dữ liệu thành công!");
  };

  return (
    <div className="p-4 border rounded-md shadow-md bg-white space-y-4">
      <h2 className="text-xl font-semibold">📥 Nhập dữ liệu từ Excel</h2>

      <input type="file" accept=".xlsx" onChange={handleFileUpload} className="mb-4" />

      {data.length > 0 && (
        <>
          <table className="w-full text-sm border">
            <thead>
              <tr>
                {Object.keys(data[0]).map((key) => (
                  <th key={key} className="border px-2 py-1 bg-gray-100">{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => (
                <tr key={i}>
                  {Object.values(row).map((val, idx) => (
                    <td key={idx} className="border px-2 py-1">{val}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          <button
            onClick={handleImport}
            disabled={isImporting}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {isImporting ? 'Đang nhập...' : 'Nhập dữ liệu vào hệ thống'}
          </button>

          {message && <p className="text-green-600 mt-2">{message}</p>}
        </>
      )}
    </div>
  );
}
