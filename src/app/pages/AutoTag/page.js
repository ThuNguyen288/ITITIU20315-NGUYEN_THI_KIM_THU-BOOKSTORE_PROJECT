'use client';

export default function AutoTagButton() {
  const handleAutoTag = async () => {
    const res = await fetch('/api/AutoTag');
    const data = await res.json();
    alert(data.message || data.error);
  };

  return (
    <button
      onClick={handleAutoTag}
      className="bg-blue-600 text-white px-4 py-2 rounded"
    >
      Gán Tag Tự Động
    </button>
  );
}
