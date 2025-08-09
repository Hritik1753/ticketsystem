import "@/styles/globals.css"; // This loads TailwindCSS
// import Navbar from "@/components/Navbar"; // Your shared navbar

export default function App({ Component, pageProps }) {
  return (
    <>
      {/* <Navbar /> */}
      <Component {...pageProps} />
    </>
  );
}
