import { useState, useCallback, useRef, useEffect } from "react";
import { toPng } from "html-to-image";
import { saveAs } from "file-saver";
import { HuePicker, CirclePicker } from "react-color";

function App() {
  const [quote, setQuote] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("happiness");
  const [loading, setLoading] = useState(false);

  const [bgColor, setBgColor] = useState("#ffffff");
  const [textColor, setTextColor] = useState("#000000");
  const quoteRef = useRef(null);

  const setToDefault = () => {
    setBgColor("#ffffff");
    setTextColor("#000000");
  };

  const fetchQuote = useCallback(async () => {
    setLoading(true);
    const response = await fetch(
      `https://api.api-ninjas.com/v1/quotes?category=${category}`,
      {
        headers: {
          "Content-Type": "application/json",
          "X-Api-Key": "581zNUXeL1cDEe8hlLpNXQ==PTf54ZQWQJN8qiUw",
        },
      }
    );
    const data = await response.json();
    setQuote(data[0].quote);
    setAuthor(data[0].author);
    setLoading(false);
  }, [category]);

  const downloadQuote = () => {
    if (quoteRef.current === null) {
      console.log("No Quote to Download");
      return;
    }

    toPng(quoteRef.current)
      .then((dataUrl) => {
        saveAs(dataUrl, "quote.png");
      })
      .catch((err) => {
        console.error("Failed to download image:", err);
      });
  };

  useEffect(() => {
    fetchQuote();
  }, [fetchQuote]);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <div className="w-full lg:w-1/3 bg-gray-800 text-white p-8 flex flex-col items-center justify-center gap-8 lg:gap-24">
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-xl text-center mb-4 lg:text-4xl">
            Random Quote Generator
          </h1>
          <p className="text-lg text-center">
            Click the button to get a new random quote.
          </p>
        </div>
        <div className="w-full lg:w-auto">
          <h3 className="text-xl text-center lg:text-left lg:text-2xl">
            Customize your Quote Card!
          </h3>
          <div className="mt-8 flex flex-col items-center lg:items-start">
            <HuePicker
              color={bgColor}
              onChangeComplete={(color) => setBgColor(color.hex)}
              width="100%"
            />
            <p className="mt-2">Background Color</p>
          </div>
          <div className="mt-4 flex flex-col items-center justify-center lg:items-start">
            <CirclePicker
              color={textColor}
              colors={["#ffffff", "#000000"]}
              onChangeComplete={(color) => setTextColor(color.hex)}
            />
            <p className="mt-2">Text Color</p>
          </div>
          <div className="flex items-center justify-center">
            {" "}
            <button
              onClick={() => setToDefault()}
              className="mt-8 px-4 py-2 bg-[#2ecc71] text-white rounded hover:bg-[#1c7a44]"
            >
              Set to Default
            </button>
          </div>
        </div>
      </div>
      <div className="w-full lg:w-2/3 bg-gray-100 p-8 flex flex-col items-center justify-around">
        <div className="w-full lg:w-auto">
          <h3 className="text-lg mb-4 text-center lg:text-left">
            Select a Category
          </h3>
          <div className="grid grid-rows-2 grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-4 md:gap-x-12 md:gap-y-4">
            {[
              "alone",
              "dreams",
              "happiness",
              "knowledge",
              "money",
              "life",
              "love",
              "success",
            ].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`${
                  category !== cat
                    ? "bg-[#2ecc71]"
                    : "bg-[#ff6900] hover:bg-[#993f00]"
                } text-white px-4 py-2 rounded hover:bg-[#1c7a44]`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-col items-center justify-center mt-8 lg:mt-6">
          <div
            ref={quoteRef}
            className="bg-white p-6 rounded shadow-md text-center max-w-xl"
            style={{ backgroundColor: bgColor, color: textColor }}
          >
            <p className="text-xl mb-4">
              {loading ? "Please Wait a few Seconds" : quote}
            </p>
            <p className="text-right ">- {loading ? "Loading...." : author}</p>
          </div>
          <button
            onClick={() => fetchQuote()}
            className="mt-8 px-4 py-2 bg-[#2ecc71] text-white rounded hover:bg-[#1c7a44]"
          >
            New Quote
          </button>
        </div>
        <div className="mt-8 lg:mt-0">
          <h3 className="text-center lg:text-left">Download and Share</h3>
          <div className="flex gap-4 justify-center lg:justify-start">
            <button
              onClick={() => downloadQuote()}
              className="mt-8 px-4 py-2 bg-[#2ecc71] text-white rounded hover:bg-[#1c7a44]"
            >
              Download Quote
            </button>
          </div>
        </div>
        <footer className="mt-8 text-center lg:text-left">
          Made with ❤️ by MohanRaji - Visit my website
          <a
            className="text-[#2ecc71] ml-1"
            href="https://mohanraji.me"
            target="_blank"
          >
            mohanraji.me
          </a>
        </footer>
      </div>
    </div>
  );
}

export default App;
