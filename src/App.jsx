// App.jsx
import Header from "./components/header/header.jsx";
import Pages from "./pages/Pages.jsx";
import Footer from "./components/footer/footer.jsx";



function App() {
    const token = localStorage.getItem("token");

    return (

            <div className='w-full dark:bg-gray-950'>
                {/*this is my comment*/}
                {token && <Header/>}
                <Pages/>
                {token && <Footer/>}
            </div>

    );
}

export default App;