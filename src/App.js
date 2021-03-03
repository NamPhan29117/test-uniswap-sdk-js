import logo from "./logo.svg";
import "./App.css";
import {
  ChainId,
  Token,
  Fetcher,
  WETH,
  Pair,
  TokenAmount,
  Route,
  Trade,
  TradeType,
} from "@uniswap/sdk";

function App() {
  //// ========TOKEN
  const chainId = ChainId.MAINNET;
  const tokenAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F"; // must be checksummed ok
  const decimals = 18;

  const DAI = new Token(
    chainId,
    tokenAddress,
    decimals,
    "DAI",
    "Dai Stablecoin"
  );
  console.log("DAI----------", DAI);

  // const DAI = new Token(
  //   chainId,
  //   tokenAddress,
  //   decimals,
  //   "SUN",
  //   "Nam coin"
  // ).equals(tokenAddress);
  // console.log("DAI----------", DAI);

  // async function getDecimals(chainId, tokenAddress) {
  //   // implementation details
  //   console.log(chainId);
  //   console.log(tokenAddress);
  // }

  // getDecimals(chainId, tokenAddress);

  let fetchData = async () => {
    const DAI1 = await Fetcher.fetchTokenData(
      chainId,
      tokenAddress,
      undefined,
      "DAI",
      "Dai Stablecoin"
    );
    console.log("dai1111111111---", DAI1);

    // const PAIR = await Fetcher.fetchPairData(
    //   "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
    //   "0x6b175474e89094c44da98b954eedeac495271d0f"
    // );
    // console.log(PAIR);
  };
  fetchData();

  //// PAIR ==========================================================

  const DAI2 = new Token(
    ChainId.MAINNET,
    "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    18
  );

  async function getPair() {
    const pairAddress = Pair.getAddress(DAI2, WETH[DAI2.chainId]);

    const reserves = [
      /* use pairAddress to fetch reserves here */
      1, // hard code
      2, // hard code
    ];
    const [reserve0, reserve1] = reserves;

    const tokens = [DAI2, WETH[DAI2.chainId]];

    const [token0, token1] = tokens[0].sortsBefore(tokens[1])
      ? tokens
      : [tokens[1], tokens[0]];

    const pair = new Pair(
      new TokenAmount(token0, reserve0),
      new TokenAmount(token1, reserve1)
    );
    console.log("qqqqqqqqq", pair);

    return pair;
  }
  getPair();

  const fetchPairDataBySDK = async () => {
    const DAI = new Token(
      ChainId.MAINNET,
      "0x6B175474E89094C44Da98b954EedeAC495271d0F",
      18
    );
    const pair = await Fetcher.fetchPairData(DAI, WETH[DAI.chainId]);

    console.log("q222222222222", pair);
  };

  fetchPairDataBySDK();

  //----------------------------------------- Price

  // 1 :  Direct ---> TRUC TIEP

  let midPrice = async () => {
    const DAI = new Token(
      ChainId.MAINNET,
      "0x6B175474E89094C44Da98b954EedeAC495271d0F",
      18
    );

    console.log("INPUT Token-----", WETH[DAI.chainId]);

    const pair = await Fetcher.fetchPairData(DAI, WETH[DAI.chainId]);
    const route = new Route([pair], WETH[DAI.chainId]);

    console.log("mid1111111111", route.midPrice.toSignificant(6)); //1588.57 - change with realtime
    console.log("mid22222222", route.midPrice.invert().toSignificant(6)); // 0.000629497 - change with realtime
  };

  midPrice();

  // 2: Indirect
  // vi khong co cap giua 2 dong A va B, Nhung ca A va B co cung cap voi token thu 3 : C,  nen tu C co the tinh gia trung binh gian tiep qua dong C

  const midPriceIndirect = async () => {
    const USDC = new Token(
      ChainId.MAINNET,
      "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      6
    );
    const DAI = new Token(
      ChainId.MAINNET,
      "0x6B175474E89094C44Da98b954EedeAC495271d0F",
      18
    );
    const USDCWETHPair = await Fetcher.fetchPairData(
      USDC,
      WETH[ChainId.MAINNET]
    );
    const DAIUSDCPair = await Fetcher.fetchPairData(DAI, USDC);
    const route = new Route([USDCWETHPair, DAIUSDCPair], WETH[ChainId.MAINNET]);

    console.log(route.midPrice.toSignificant(6)); // 1602.88
    console.log(route.midPrice.invert().toSignificant(6)); // 0.000623878
  };

  midPriceIndirect();

  //----------------------------------------- Excution Price

  let excutionPrice = async () => {
    const DAI = new Token(
      ChainId.MAINNET,
      "0x6B175474E89094C44Da98b954EedeAC495271d0F",
      18
    );
    const pair = await Fetcher.fetchPairData(DAI, WETH[DAI.chainId]);
    const route = new Route([pair], WETH[DAI.chainId]);

    const trade = new Trade(
      route,
      new TokenAmount(WETH[DAI.chainId], "1000000000000000000"),
      TradeType.EXACT_INPUT
    );

    console.log("excution 111111---", trade.executionPrice.toSignificant(6));
    console.log(
      "next Mid Price 222222----",
      trade.nextMidPrice.toSignificant(6)
    );
  };

  excutionPrice();

  return <div className="App">phan hai nam</div>;
}

export default App;
