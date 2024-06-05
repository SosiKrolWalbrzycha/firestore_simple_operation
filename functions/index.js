const functions = require("firebase-functions");
const admin = require("firebase-admin");
// const {fetchAndSaveDailyExchangeRates} = require("./fbfunction.js");


if (!admin.apps.length) {
  admin.initializeApp();
}
// // Wywołanie funkcji przy uruchomieniu
// fetchAndSaveDailyExchangeRates();

// eslint-disable-next-line max-len
exports.calculateRealValue = functions.firestore.document("orders/{documentId}").onCreate(async (snap) => {
  try {
    const newData = snap.data();
    const value = newData.value;
    const fromCurrency = newData.fromCurrency;
    const toCurrency = newData.toCurrency;
    const dataInString = newData.stringdata;
    // eslint-disable-next-line max-len
    const price = await getCurrentExchangeRate(fromCurrency, toCurrency, dataInString);

    if (!price) {
      const response = await fetch(`https://api.freecurrencyapi.com/v1/historical?apikey=fca_live_fCFwo8OfRq3SvUlX7Zib40VnZoTL758F1tVozxH7&currencies=${toCurrency}&base_currency=${fromCurrency}&date=${dataInString}`);
      if (!response.ok) {
        throw new Error("Nie udało się pobrac danych z API");
      }
      const data = await response.json();
      const rate = data.data[dataInString][toCurrency];

      await admin.firestore().collection("prices").add({
        stringData: dataInString,
        price: rate,
        fromCurrency: fromCurrency,
        toCurrency: toCurrency,

      });

      const realPrice = Number(value) * rate;
      return admin.firestore().collection("transactions").add({
        operationId: snap.id,
        price: realPrice,
        date: dataInString,
        fromCurrency: fromCurrency,
        toCurrency: toCurrency,
      });
    } else {
      const realPrice = Number(value) / Number(price);

      try {
        await admin.firestore().collection("transactions").add({
          operationId: snap.id,
          price: realPrice,
          date: dataInString,
        });
      } catch (error) {
        console.error("Nie dodało wartości transakcji");
        return null;
      }
    }
  } catch (error) {
    console.error("An error occurred during the operation:", error);
    return null; // Odpowiednia obsługa błędu
  }
});


exports.updateOrder = functions.firestore
    .document("orders/{documentId}")
    .onUpdate(async (change, context) => {
      const newData = change.after.data();
      const oldData = change.before.data();

      // eslint-disable-next-line max-len
      // Porównanie nowych i starych danych, sprawdzenie czy kluczowe parametry się zmieniły

      // eslint-disable-next-line max-len
      if (newData.value === oldData.value && newData.fromCurrency === oldData.fromCurrency && newData.toCurrency === oldData.toCurrency && newData.data === oldData.data && newData.stringdata === oldData.stringdata) {
        console.log("Nic się nie zmieniło w transakcji");
        return null;
      }

      const {fromCurrency, toCurrency, value, stringdata} = newData;
      const documentId = context.params.documentId;

      try {
        // Pobieranie aktualnej ceny
        // eslint-disable-next-line max-len
        let rate = await getCurrentExchangeRate(fromCurrency, toCurrency, stringdata);
        if (!rate) {
          const response = await fetch(`https://api.freecurrencyapi.com/v1/historical?apikey=fca_live_fCFwo8OfRq3SvUlX7Zib40VnZoTL758F1tVozxH7&currencies=${toCurrency}&base_currency=${fromCurrency}&date=${stringdata}`);
          if (!response.ok) {
            throw new Error("Failed to fetch exchange rate from API");
          }
          const data = await response.json();
          rate = data.data[stringdata][toCurrency];

          await admin.firestore().collection("prices").add({
            stringData: stringdata,
            price: rate,
            fromCurrency: fromCurrency,
            toCurrency: toCurrency,
          });
          console.log("diala");
        }

        const realPrice = Number(value) * rate;

        // Aktualizacja istniejącej transakcji zamiast tworzenia nowej
        // eslint-disable-next-line max-len
        const transactionRef = admin.firestore().collection("transactions").where("operationId", "==", documentId);
        const snapshot = await transactionRef.get();
        if (!snapshot.empty) {
          const transactionDoc = snapshot.docs[0];
          await transactionDoc.ref.update({
            price: realPrice,
            date: stringdata,
            fromCurrency,
            toCurrency,
          });
        }

        return console.log("Transaction updated successfully.");
      } catch (error) {
        console.error("Error updating order and transaction:", error);
        return null;
      }
    });

// funkcja sprawdzania czy cena już istnieje w bazie
// eslint-disable-next-line require-jsdoc
async function getCurrentExchangeRate(fromCurrency, toCurrency, stringdata) {
  try {
    const priceRef = admin.firestore().collection("prices");
    const snapshot = await priceRef.where("stringData", "==", stringdata)
        .where("fromCurrency", "==", fromCurrency)
        .where("toCurrency", "==", toCurrency)
        .get();
    if (!snapshot.empty) {
      return snapshot.docs[0].data().price;
    }
    return null;
  } catch (error) {
    console.error("Nie pobrało ceny z bazy na podstawie daty:", error);
    return null;
  }
}
