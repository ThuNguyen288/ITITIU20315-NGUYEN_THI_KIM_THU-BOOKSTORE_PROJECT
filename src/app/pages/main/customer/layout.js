import Footer from "@/app/components/Footer";
import Header from "@/app/components/Header";

export default function CustomerLayout({ children }) {
  return (
    <div>
      {/* Header luôn cố định trên top */}
      <Header className="fixed top-0 bg-white shadow-md z-50" />
      
      {/* Nội dung phía dưới Header */}
      <main className="pt-16"> {/* pt-16 để tránh header che mất phần trên */}
        {children}
      </main>
      <Footer/>
    </div>
  );
}
