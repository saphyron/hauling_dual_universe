// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { addDoc, collection, getFirestore,
  getDocs, setDoc, where, query, getDoc, doc, updateDoc } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBdWkdbIce66Rkg2OrOvSrFIVuID5-Figo",
  authDomain: "dual-universe-hauling.firebaseapp.com",
  projectId: "dual-universe-hauling",
  storageBucket: "dual-universe-hauling.appspot.com",
  messagingSenderId: "953681035933",
  appId: "1:953681035933:web:dbbb736e8af2225ba34a74",
  measurementId: "G-67DC7GSM6S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const data = require("./HaulingData.json");



// Functions
function generateUUID() { // Public Domain/MIT
  var d = new Date().getTime();//Timestamp
  var d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now() * 1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16;//random number between 0 and 16
    if (d > 0) {//Use timestamp until depleted
      r = (d + r) % 16 | 0;
      d = Math.floor(d / 16);
    } else {//Use microseconds since page-load if supported
      r = (d2 + r) % 16 | 0;
      d2 = Math.floor(d2 / 16);
    }
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

export async function opretData(data) {
  try {
    await addDoc(collection(db, "Hauling"), data)
  } catch (e) {
    console.log(e);
  }
}

export async function getTypeOfContract() {
  try {
    const querySnapshot = await getDocs(collection(db, "Types"));
    const result = [];
    querySnapshot.forEach((doc) => {
      result.push(doc.data().Type);
    })
    return result;
  } catch (e) {
    console.log(e)
  }
}

export async function getContractsSizes(Type) {
  try {
    const q = query(collection(db, "Hauling"), where("Type", "==", Type));
    const qresult = await getDocs(q);
    const result = [];
    qresult.forEach((doc) => {
      result.push(doc.data().Name);
    })
    return result;
  } catch (e) {
    console.log(e)
  }
}

export async function calculateReward(Collateral, Type, Contract, Distance, diskm) {
  try {
    const q = query(collection(db, "Hauling"), where("Type", "==", Type));
    const qresult = await getDocs(q);
    let tempResult = "";
    qresult.forEach((doc) => {
      if (doc.data().Name === Contract) {
        tempResult = doc.id;
      }
    });
    const docRef = doc(db, "Hauling", tempResult);
    const docSnap = await getDoc(docRef);
    let modifier = 0;
    switch (Type) {
      case "Pure Space":
      case "Space":
        modifier = 0.1;
        break;
      case "Planet":
        modifier = 0.05;
        break;
      default:
        modifier = 0.25;
    }
    let disKMNitron = 0;
    if (diskm > 0) {
      disKMNitron = diskm;
    } else {
      disKMNitron = 55;
    }
    const docPriceRef = doc(db, "Price", "Price");
    const docPriceSnap = await getDoc(docPriceRef);
    const percentageReward = Collateral * modifier;
    let warpCellsExists = 0;
    if (docSnap.data().Warpcells) {
      warpCellsExists = docSnap.data().Warpcells;
    }
    let result = 0;
    const tempReward = docSnap.data().BasicPayment +
      ((docSnap.data().KergonperSU * Distance * docPriceSnap.data().Kergon) +
      (docSnap.data().NitronperKM * disKMNitron * docPriceSnap.data().Nitron) +
      (warpCellsExists * docPriceSnap.data().WarpCell)) * (1 + modifier);


    if (percentageReward >= tempReward) {
      result = percentageReward;
    } else {
      result = tempReward;
    }
    return result;
  } catch (e) {
    console.log(e)
  }
}

export async function createContract(Name, Collateral, Reward, From, To, Type, Size, date) {
  try {
    let data = {
      Username: Name,
      Collateral: Collateral,
      Reward: Reward,
      StartLocation: From,
      EndLocation: To,
      Status: "Not Taken",
      Type: Type,
      Size: Size,
      Dato: date
    }
    await addDoc(collection(db, "Contracts"), data);
  } catch (e) {
    console.log(e);
  }
}

export async function getAllContracts() {
  try {
    const querySnapshot = await getDocs(collection(db, "Contracts"));
    const result = [];
    querySnapshot.forEach((doc) => {
      if (doc.data().Status === "Not Taken") {
        result.push(doc.data());
      }
    })
    return result;
  } catch (e) {
    console.log(e)
  }
}

export async function updateContract(status, contract) {
  try {
    const contractRef = doc(db, "Contracts", contract);
    await updateDoc(contractRef, {
      Status: status
    });
  } catch (e) {
    console.log(e);
  }
}
export async function getContract(contract) {
  try {
    const contractRef = doc(db, "Contracts", contract);
    const snapshot = await getDoc(contractRef);
    console.log(snapshot.data());
    return snapshot.data();
  } catch (e) {
    console.log(e);
  }
}

export const jsontoFirestore = async () => {
  try {
    for (let k in data) {
      opretData(data[k]);
    }
    console.log('Upload Success');
  } catch (e) {
    console.log(e)
  }
}

//jsontoFirestore();
//getTypeOfContract();
//getContractsSizes("Pure Space");
//calculateReward(1000000, "Space", "Max 150T Space Safe", 15);
//createContract("Saphyron", 2000000, 200000, "::pos{0,22,0.9324,66.5623,9.6216}", "::pos{0,22,-32.2141,55.1746,14.2060}");
//getAllContracts();
//updateContract("Taken", "oKlbLR2eIua9QPAGgTvM");
//getContract("oKlbLR2eIua9QPAGgTvM");

const DBfunctions = {
  jsontoFirestore,
  getContract,
  updateContract,
  getAllContracts,
  createContract,
  calculateReward,
  getContractsSizes,
  getTypeOfContract,
  opretData
};

export default DBfunctions;