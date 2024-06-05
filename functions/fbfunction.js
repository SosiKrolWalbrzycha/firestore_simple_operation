/* eslint-disable linebreak-style */
const fetch = require("node-fetch");
const admin = require("firebase-admin");
const functions = require("firebase-functions");

const fetchAndSaveDailyExchangeRates = async () => {
  console.log("Wywołuje poprawnie");
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  const ratesRef = admin.firestore().collection("dailyExchangeRates");

  const snapshot = await ratesRef.where("date", "==", today).get();
  if (!snapshot.empty) {
    console.log("Exchange rates for today already exist.");
    return;
  }

  try {
    console.log("zaczynamy próbe");
    const response = await fetch("https://api.freecurrencyapi.com/v1/latest?apikey=fca_live_fCFwo8OfRq3SvUlX7Zib40VnZoTL758F1tVozxH7&currencies=EUR%2CUSD%2CJPY%2CBGN%2CCZK%2CDKK%2CGBP%2CHUF%2CRON%2CSEK%2CCHF%2CISK%2CNOK%2CHRK%2CRUB%2CTRY%2CAUD%2CBRL%2CCAD%2CCNY%2CHKD%2CIDR%2CILS%2CINR%2CKRW%2CMXN%2CMYR%2CNZD%2CPHP%2CSGD%2CTHB%2CZAR&base_currency=PLN");
    if (!response.ok) {
      throw new Error("Failed to fetch exchange rates");
    }
    const data = await response.json();
    console.log(data);
    await ratesRef.add({
      date: today,
      //   // eslint-disable-next-line linebreak-style
      rates: data.data,
    });
  } catch (error) {
    console.error("Error fetching and saving exchange rates:", error);
  }
};

exports.fetchAndSaveDailyExchangeRates = fetchAndSaveDailyExchangeRates;
