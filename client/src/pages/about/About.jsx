import "./About.scss";

function About() {
  return (
    <div className="about">
      <div className="container">
        <div className="box">
          <h1>About PlacePoint</h1>
          <p>
            <strong>PlacePoint</strong> is a modern real estate platform that
            helps you find your dream apartment or house. With over{" "}
            <strong>2000+ listings</strong>, we make it easier than ever for you
            to find the perfect place to live or invest.
          </p>
        </div>

        <div className="box">
          <h2>🚀 What We Offer</h2>
          <ul>
            <li>
              <span>🔍</span> Advanced property search
            </li>
            <li>
              <span>🏠</span> Properties for sale and rent
            </li>
            <li>
              <span>📊</span> Market statistics and analysis
            </li>
            <li>
              <span>🛠️</span> Support from verified agents
            </li>
          </ul>
        </div>

        <div className="box">
          <h2>💡 Our Values</h2>
          <p>
            We believe in <strong>transparency</strong>,{" "}
            <strong>professionalism</strong>, and <strong>innovation</strong>.
            Our goal is to provide simple and secure solutions for everyone
            looking to buy a home or sell their property.
          </p>
        </div>
      </div>
    </div>
  );
}

export default About;
