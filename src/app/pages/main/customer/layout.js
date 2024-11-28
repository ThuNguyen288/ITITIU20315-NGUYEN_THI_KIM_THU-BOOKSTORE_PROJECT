import Header from "@/app/components/Header";


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
          <Header/>
          {children}
      </body>
    </html>
  );
}