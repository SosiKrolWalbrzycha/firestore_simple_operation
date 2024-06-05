
const functions = require("firebase-functions");
const admin = require("firebase-admin");
// eslint-disable-next-line max-len
admin.initializeApp();

// eslint-disable-next-line max-len
exports.calculateRealValue = functions.firestore.document("danedodat/{documentId}").onCreate(async (snap) => {
  const newData = snap.data();
  const value = newData.value; // wartość z danedodat
  const dataInString = newData.stringdata; // timestamp z nowego obiektu

  // Pobierz aktualną cenę z newPrices
  const priceRef = admin.firestore().collection("newPrices");
  // eslint-disable-next-line max-len
  const priceQuerrySnapshot = await priceRef.where("stringData", "==", dataInString).get();
  if (priceQuerrySnapshot.empty) {
    try {
      const response = await fetch(`https://api.freecurrencyapi.com/v1/historical?apikey=fca_live_fCFwo8OfRq3SvUlX7Zib40VnZoTL758F1tVozxH7&currencies=PLN&base_currency=EUR&date=${dataInString}`);
      if (!response.ok) {
        throw new Error("Failed to fetch data from API");
      }
      const data = await response.json();
      console.log(data);
      const rate = data.data[dataInString]["PLN"];
      console.log(rate);

      await admin.firestore().collection("newPrices").add({
        stringData: dataInString,
        price: rate,
      });
    } catch (error) {
      console.error("Error fetching historical data:", error);
      return null;
    }
  } else {
    const priceDoc = priceQuerrySnapshot.docs[0];
    const priceData = priceDoc.data();
    const price = priceData.price; // cena z newPrices
    const date = priceData.stringData; // data w stringu z newPrices

    // Oblicz realPrice
    const realPrice = Number(value) * Number(price);

    // Zapisz w kolekcji realvalue
    return admin.firestore().collection("realvalue").add({
      operationId: snap.id, // ID z danedodat
      price: realPrice,
      date: date,
    });
  }
  return;
});
