const functions = require("firebase-functions");
const admin = require("firebase-admin");
const {freecurrencyapi} = require(".");

// eslint-disable-next-line max-len
exports.calculateRealValue = functions.firestore
    .document("danedodat/{documentId}")
    .onCreate(async (snap) => {
      const newData = snap.data();
      const value = newData.value; // wartość z danedodat
      const dataInString = newData.stringdata; // timestamp z nowego obiektu
      // Pobierz aktualną cenę z newPrices
      const priceRef = admin.firestore().collection("newPrices");
      // eslint-disable-next-line max-len
      const priceQuerrySnapshot = await priceRef.where("stringData", "==", dataInString).get();
      if (priceQuerrySnapshot.empty) {
        // Brak odpowiednika w newPrices, wykonaj zapytanie do Freecurrency API
        freecurrencyapi
            .historical({
              date: "2024-04-10",
              base_currency: "USD",
              currencies: "PLN",
            })
            .then(async (response) => {
              // eslint-disable-next-line max-len
              // Przykład zapisu odpowiedzi API do Firestore (dostosuj do swoich potrzeb)
              // eslint-disable-next-line max-len
              const rate = response.data.dataInString.PLN; // Dostosuj ścieżkę dostępu do odpowiedzi

              // await admin.firestore().collection("newPrices").add({
              //   stringData: dataInString,
              //   price: rate,
            });

        // Kontynuuj obliczenia z nowo pobraną ceną
        const realPrice = Number(value) * rate;

        // Zapisz w kolekcji realvalue
        await admin.firestore().collection("realvalue").add({
          operationId: snap.id,
          price: realPrice,
          date: dataInString,
        });
      }
    })
    .catch((error) => {
      console.error("Error fetching currency data:", error);
    });
