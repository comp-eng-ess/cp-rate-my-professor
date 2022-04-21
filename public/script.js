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
  let professorsDiv = "";
  let professorOption = "";
  let filteredData = querySnapshot.docs.filter((doc) => {
    return (doc.data().firstname + " " + doc.data().lastname).includes(
      searchQuery
    );
  });
  filteredData.map((doc) => {
    professorsDiv += `<div class="professor-block" id=${doc.id}>${
      doc.data().firstname
    } ${doc.data().lastname}</div>`;
    professorOption += `<option value="${doc.data()["firstname"]} ${
      doc.data()["lastname"]
    }">${doc.data()["firstname"]} ${doc.data()["lastname"]}</option>`;
  });

  document.getElementById("teacher-names").innerHTML = professorsDiv;
  document.getElementById("professor-options").innerHTML = professorOption;
  addProfOnClick();
}

let genHomePage = () => {
  document.getElementById("application").innerHTML = `
      <h1 id="application-title">CP Rate My <span>Professor!</span></h1>
      <input name="professor-name" id="professor-search" placeholder="Search professor name" />
      <datalist id="professor-options"> </datalist>
      <div id="teacher-names"></div>
      `;
  document.getElementById("professor-search").oninput = () =>
    fetchTeacherName(document.getElementById("professor-search").value);
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

const genCommentPage = (id, professorName) => {
  document.getElementById("application").innerHTML = `
  <button id="back-button">
    Go Back
  </button>
  <h2>Adding comment for ${professorName}</h2>
  <div id="comment-form">
    <form>
      <div>
        Score
        <input type="text" />
      </div>
      <div>
        Course
        <input type="text" id="course" name="course" value="" />
      </div>
      <div>
        <label for="section">section </label>
        <input type="text" id="section" name="section" value="" />
      </div>
      <div>
        <label for="year">year </label>
        <input type="text" id="year" name="year" value="" />
      </div>
      <div>
        <label for="semester">semester</label>
        <input type="text" id="semester" name="semester" value="" />
      </div>
      <div>
        <label for="comment">comment</label>
        <input type="textarea" />
      </div>
      <button id="submit-button">submit</button>
    </form>
  </div>
  `;
};

document.getElementById("go-home").onclick = genHomePage;
document.getElementById("logo").onclick = genHomePage;
document.getElementById("go-contact").onclick = genContactPage;
document.getElementById("go-about").onclick = genAboutPage;

genHomePage();
// genCommentPage(1,"Noppakorn Jiravaranun");
