import "./About.scss";

function About() {
  return (
    <div className="about">
      <div className="container">
        <div className="box">
          <h1>Rreth PlacePoint</h1>
          <p>
            <strong>PlacePoint</strong> është një platformë moderne për tregun e patundshmërive që ju
            ndihmon të gjeni apartamentin ose shtëpinë e ëndrrave. Me mbi <strong>2000+ prona</strong> të listuara,
            ne e bëjmë më të lehtë se kurrë për ju që të gjeni vendin e përsosur për të jetuar ose për të investuar.
          </p>
        </div>

        <div className="box">
          <h2>🚀 Çfarë ofrojmë</h2>
          <ul>
            <li><span>🔍</span> Kërkim i avancuar për prona</li>
            <li><span>🏠</span> Prona për shitje dhe me qira</li>
            <li><span>📊</span> Statistikë dhe analiza të tregut</li>
            <li><span>🛠️</span> Mbështetje nga agjentë të verifikuar</li>
          </ul>
        </div>

        <div className="box">
          <h2>💡 Vlerat tona</h2>
          <p>
            Ne besojmë në <strong>transparencë</strong>, <strong>profesionalizëm</strong> dhe <strong>inovacion</strong>. Qëllimi ynë
            është të sjellim zgjidhje të thjeshta dhe të sigurta për të gjithë
            ata që kërkojnë një shtëpi apo duan të shesin pronën e tyre.
          </p>
        </div>
      </div>
    </div>
  );
}

export default About;
