import { useContext, useState } from "react";
import SearchBar from "../../components/searchBar/SearchBar";
import "./homePage.scss";
import { AuthContext } from "../../context/AuthContext";
import About from "../../pages/about/About";
import Contact from "../../pages/contact/Contact";
import Footer from "../../pages/footer/Footer";
//import ArticlesList from "../../components/article/ArticlesList";
function HomePage() {
  const { currentUser } = useContext(AuthContext);
  console.log(currentUser);
  // const [showArticles, setShowArticles] = useState(false);

  // const toggleArticles = () => setShowArticles(prev => !prev);

  return (
    <div className="homePage">
      <section className="hero">
        <div className="textContainer">
          <div className="wrapper">
            <h1 className="title">Discover Your Perfect Place with PlacePoint</h1>
            <SearchBar />
            <div className="boxes">
              <div className="box">
                <h1>16+</h1>
                <h2>Years of Expertise</h2>
              </div>
              <div className="box">
                <h1>200</h1>
                <h2>Awards Achieved</h2>
              </div>
              <div className="box">
                <h1>2000+</h1>
                <h2>Properties Available</h2>
              </div>
            </div>
          </div>
        </div>
        <div className="imgContainer">
        <img src="placepoint.jpg" alt="PlacePoint Background" />

        </div>
      </section>

      <section id="about" className="aboutSection">
        <About />
      </section>

      <section id="contact" className="contactSection">
        <Contact />
      </section>

       {/* <section className="articlesSection">
        <div className="toggleArticles" style={{ textAlign: 'center', margin: '5px 0' }}>
          <span
            onClick={toggleArticles}
            style={{
              display: 'inline-block',
              marginTop: 1,
              color: '#007bff',
              textDecoration: 'underline',
              cursor: 'pointer',
              fontSize: 14
            }}
          >
            Click for our articles
          </span>
        </div>

        {showArticles && (
          <div className="articlesListContainer">
            <ArticlesList />
          </div>
        )}
      </section> */}

      <footer className="footerSection">
        <Footer />
      </footer>
    </div>
  );
}

export default HomePage;
