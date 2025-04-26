import ExcelImport from "@/app/components/ExcelImport";

export default function ImportPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📦 Import Sản Phẩm</h1>
        <ExcelImport/>
    </div>
  );
}
