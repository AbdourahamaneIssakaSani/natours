import logo from './logo.svg';
import './App.css';
import ProductCards from './ProductCards';

function App() {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="X-UA-Compatible" content="ie=edge" />
        <link
          href="https://fonts.googleapis.com/css?family=Megrim|Nunito+Sans:400,900"
          rel="stylesheet"
        />
        <link
          rel="icon"
          href="https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/240/apple/155/ear-of-maize_1f33d.png"
        />

        <title>NODE FARM</title>

      </head>

      <body>
        <div class="container">
          <h1>🌽 Node Farm 🥦</h1>

          <div class="cards-container">
            <ProductCards />
          </div>
        </div>
      </body>
    </html>

  );
}

export default App;
