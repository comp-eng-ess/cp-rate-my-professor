import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDoc,
  getDocs,
  query,
  where,
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

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

async function fetchTeacherName(searchQuery) {
  const teachersRef = collection(db, "professor-names");
  const querySnapshot = await getDocs(teachersRef);
  console.log(querySnapshot.docs.map((doc) => doc.data()));
  let teachersDiv = "";
  let teachersOption = "";
  querySnapshot.docs.map((doc) => {
    teachersDiv += `<div>${doc.data()["firstname"]} ${
      doc.data()["lastname"]
    }</div>`;
    teachersOption += `<option value="${doc.data()["firstname"]} ${
      doc.data()["lastname"]
    }">${doc.data()["firstname"]} ${doc.data()["lastname"]}</option>`;
  });

  document.getElementById("teacher-names").innerHTML = teachersDiv;
  document.getElementById("professor-options").innerHTML = teachersOption;
}

document.getElementById("professor-search").onchange = () => {
  const searchQuery = document.getElementById("professor-search").value;
  fetchTeacherName(searchQuery);
};
document.getElementById("search-button").onclick = () => {
  const searchQuery = document.getElementById("professor-search").value;
  fetchTeacherName(searchQuery);
}

const colorSwitch = document.getElementById("input-toggle-mode");
colorSwitch.addEventListener("click", checkMode);
function checkMode() {
  console.log("check");
}

document.getElementById("input-toggle-mode").onclick = () => {
  var element = document.body;
  element.classList.toggle("dark-mode");
};

fetchTeacherName("");
