import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDoc,
  getDocs,
  query,
  where,
  doc,
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
  // console.log(querySnapshot.docs.map((doc) => doc.data()));
  let professorsDiv = "";
  let professorOption = "";
  querySnapshot.docs.map((doc) => {
    professorsDiv += `<div class="professor-block" id=${doc.id}>${
      doc.data()["firstname"]
    } ${doc.data()["lastname"]}</div>`;
    professorOption += `<option value="${doc.data()["firstname"]} ${
      doc.data()["lastname"]
    }">${doc.data()["firstname"]} ${doc.data()["lastname"]}</option>`;
  });

  document.getElementById("teacher-names").innerHTML = professorsDiv;
  document.getElementById("professor-options").innerHTML = professorOption;
  addProfOnClick();
}

// document.getElementById("input-toggle-mode").onclick = () => {
//   var element = document.body;
//   element.classList.toggle("dark-mode");
// };

let genHomePage = () => {
  document.getElementById("application").innerHTML = `
      <div class="search">
        <h1>CP Rate My <span>Professor!</span></h1>
        <input name="professor-name" id="professor-search" placeholder="Search professor name" />
        <button type="submit" id="search-button">
          <span class="material-icons"> search </span>
        </button>
      </div>

      <datalist id="professor-options"> </datalist>
      <div id="teacher-names"></div>
      `;
  document.getElementById("professor-search").onchange = () => {
    const searchQuery = document.getElementById("professor-search").value;
    fetchTeacherName(searchQuery);
  };
  document.getElementById("search-button").onclick = () => {
    const searchQuery = document.getElementById("professor-search").value;
    fetchTeacherName(searchQuery);
  };
  fetchTeacherName("");
  addProfOnClick();
};

function addProfOnClick() {
  Array.from(document.getElementsByClassName("professor-block")).forEach(
    (el) =>
      (el.onclick = function () {
        genTeacherPage(el.id);
      })
  );
}
const genTeacherPage = async (id) => {
  const rating = 2.5;
  const commentCount = 10;
  let d = await getDoc(doc(db, "professor-names", id));

  document.getElementById("application").innerHTML = `
  <div>
    <button id="back-button">
      Go Back
    </button>
    <div>
      <h2>${d.data().firstname + " " + d.data().lastname}</h2>
      <div>Score: ${rating}/5</div>
      <div>Comments : ${commentCount}</div>
    </div>
  </div>
  `;
  document.getElementById("back-button").onclick = () => {
    genHomePage();
  };
};
const genContactPage = () => {
  document.getElementById("application").innerHTML = `
  <div>Placeholder for contact page</div>
  `;
};
const genAboutPage = () => {
  document.getElementById("application").innerHTML = `
  <div>Placeholder for about page</div>
  `;
};

document.getElementById("go-home").onclick = genHomePage;
document.getElementById("go-contact").onclick = genContactPage;
document.getElementById("go-about").onclick = genAboutPage;

genHomePage();
