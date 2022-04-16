import { initializeApp} from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { collection, addDoc , getDoc} from "firebase/firestore"; 

const firebaseConfig = {
  apiKey: "AIzaSyB6ssZ2hOfOx-UoUJEVGBjVJd7pQylAtLM",
  authDomain: "cp-rate-my-professor.firebaseapp.com",
  projectId: "cp-rate-my-professor",
  storageBucket: "cp-rate-my-professor.appspot.com",
  messagingSenderId: "967764561714",
  appId: "1:967764561714:web:e1a728b40b7cb3265e512b",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.getElementById("professor-search").onchange = async () => {
  const searchQuery = document.getElementById("professor-search").value;

  console.log(searchQuery);
  const docRef = await getDoc(collection(db, "professor-names"))
  console.log(docRef)
};
