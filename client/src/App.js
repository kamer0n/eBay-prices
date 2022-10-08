import logo from './logo.svg';
import './App.css';
import React from "react";

const apiAddress = "http://127.0.0.1:9000"


function App() {

  let map = '';

  const [data, setData] = React.useState(null);
  const [spinner, setSpinner] = React.useState(false);
  React.useEffect(() => {
    fetch(apiAddress+'/api')
      .then((res) => res.json())
      .then((data) => setData(data.coins));
  }, []);
  let titles = [];

  try {
    let parsed = parseCoins(data);
    let titlesWithPrice = {};
    Object.keys(parsed).forEach((e) => {
      let average = 0;
      parsed[e].forEach(coin => {
        average += parseFloat(coin.price)
      })
      average = average / parsed[e].length
      titlesWithPrice[e] = average.toFixed(2);
    })

    titles = displayCoinTitles(titlesWithPrice);
    
  }
  catch (err) {
  }

  return (
    <div className="App">
        <div className="body">
          <div className="card">
            <div className="header">
              <p>Add new coin</p>
            </div>
            <div className="container">
              <input id="searchTxt" className="search"></input>
              <button className="button" onClick={SendNewCoin}>Add</button>
              {spinner && (
        <div className="loading"><div className='loading-spinner'></div></div> 
        )}
            </div>
          </div>
        {!data ? <p>Loading...</p> :
          titles
        }

        </div>
      
    </div>
  );

  
  function SendNewCoin(){
    setSpinner(true);
    let response = '';
    const search = document.getElementById("searchTxt").value;
    console.log(search);
    response = fetch(apiAddress+'/addCoin/'+search).then(function(res) { 
      console.log(response);
      setSpinner(false);
      window.location.reload();
    })
  }

}


function parseCoins(listOfCoin) {
  let parsed = {};
  Object.keys(listOfCoin).forEach(coinType => {
    let currentCoinCollection = []
    Object.keys(listOfCoin[coinType]).forEach(coinDate => {
      Object.keys(listOfCoin[coinType][coinDate]).forEach(coinObject => {
        let currentCoin = listOfCoin[coinType][coinDate][coinObject];
        currentCoinCollection.push(currentCoin);
      })
    })
    parsed[coinType] = currentCoinCollection;
  })
  return parsed;
}

function displayCoinTitles(listOfCoin) {
  let parsed = [];
  Object.keys(listOfCoin).forEach(coinObject => {
    parsed.push(
      <div className="card">
        <div className="header">
          <p>{coinObject}</p>
        </div>
        <div className="container" key={coinObject}>
          <p>£{listOfCoin[coinObject]}</p>
        </div>
      </div>
    );
  })
  return parsed;
}
export default App;
