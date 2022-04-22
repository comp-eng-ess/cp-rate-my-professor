import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
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
  // const commentCount = 10;
  let d = await getDoc(doc(db, "professor-names", id));

  let querySnapshot = await getDocs(
    collection(db, "professor-names", id, "comments")
  );
  document.getElementById("application").innerHTML = `
  <div>
    <button id="back-button">
      Go Back
    </button>
    <div>
      <h1>${d.data().firstname + " " + d.data().lastname}</h1>
      <div>Score:</div>
      <div><span class="average-score">${rating}</span>/5</div>
      <div>Comments : ${querySnapshot.docs.length}</div>
    </div>
    <button id="new-comment-button">
      New comment
    </button>
    <div id="comment-box">
    </div>
  </div>
  `;
  querySnapshot.docs.map((doc, idx) => {
    let a = doc.data();
    document.getElementById("comment-box").innerHTML += `
    <div class="comment">
      <div class="comment-number">Comment #${idx + 1}</div>
      <div>Score ${a.score}</div>
      <div>Course ${a.course}</div>
      <div>Section ${a.section}</div>
      <div>Semester ${a.year}</div>
      <div>Academic Year ${a.year}</div>
      <div>Comment ${a.comment}</div>
    </div>`;
  });
  document.getElementById("back-button").onclick = () => {
    genHomePage();
  };
  document.getElementById("new-comment-button").onclick = () => {
    genCommentPage(id, d.data().firstname + " " + d.data().lastname);
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
  let limit = 280;
  document.getElementById("application").innerHTML = `
  <div id="head-comment-page">
    <h2>
      Adding comment for
      <span id="comment-page-prof-name">${professorName}</span>
    </h2>
  </div>
  <div class="container">
    <form id="comment-form">
      <div class="select-box">
        <h2>Score</h2>
        <div class="options-container" id="semester-option">
          <div class="option">
            <input type="radio" class="radio" id="1" name="score" value="1" />
            <label for="1">1</label>
          </div>
          <div class="option">
            <input type="radio" class="radio" id="2" name="score" value="2" />
            <label for="2">2</label>
          </div>
          <div class="option">
            <input type="radio" class="radio" id="3" name="score" value="3" />
            <label for="3">3</label>
          </div>
          <div class="option">
            <input type="radio" class="radio" id="4" name="score" value="4" />
            <label for="4">4</label>
          </div>
          <div class="option">
            <input type="radio" class="radio" id="5" name="score" value="5" />
            <label for="5">5</label>
          </div>
        </div>
        <div class="selected" id="selected-score">Select Score</div>
      </div>
      <div class="number-input-box">
        <h2>Course</h2>
        <input
          placeholder="Type Course"
          type="number"
          class="number-input"
          id="course"
          name="course"
          min="1000000"
          max="9000000"
        />
      </div>
      <div class="number-input-box">
        <h2>section</h2>
        <input
          placeholder="Type Section"
          type="number"
          class="number-input"
          id="section"
          name="section"
          min="1"
          max="100"
        />
      </div>
      <div class="number-input-box">
        <h2>Academic year</h2>
        <input
          placeholder="Type Academic Year"
          type="number"
          class="number-input"
          id="year"
          name="year"
          min="2015"
          max="2022"
        />
      </div>
      <h2>semester</h2>
      <div class="select-box">
        <div class="options-container">
          <div class="option">
            <input type="radio" class="radio" id="1" name="semester" value="1" />
            <label for="1">1</label>
          </div>
          <div class="option">
            <input type="radio" class="radio" id="2" name="semester" value="2" />
            <label for="2">2</label>
          </div>
        </div>
        <div class="selected" id="selected-semester">Select semester</div>
      </div>
      <h2>comment</h2>
      <div class="comment-container">
        <textarea id="comment-area" rows="4" maxlength="200"> </textarea>
      </div>
      <div class="text-counter">
        <p id="char-lenght"></p>
      </div>
      <div id="comment-page-button-container">
        <button id="submit-button">submit</button>
        <button id="back-button">Go Back</button>
      </div>
    </form>
  </div>

  `;

  //comment-counter
  let commentText = document.getElementById("comment-area");
  let charLength = document.getElementById("char-lenght");
  charLength.textContent = 0 + "/" + limit;
  commentText.addEventListener("input", function () {
    var textLength = commentText.value.length;
    charLength.textContent = textLength + "/" + limit;
  });
  //select-function
  const selected = document.querySelectorAll(".selected");
  const optionsContainer = document.querySelectorAll(".options-container");
  const optionsList = document.querySelectorAll(".option");
  selected[0].addEventListener("click", () => {
    optionsContainer[0].classList.toggle("active");
  });
  selected[1].addEventListener("click", () => {
    optionsContainer[1].classList.toggle("active");
  });
  optionsList[0].addEventListener("click", () => {
    selected[0].innerHTML = optionsList[0].querySelector("label").innerHTML;
    optionsContainer[0].classList.remove("active");
  });
  optionsList[1].addEventListener("click", () => {
    selected[0].innerHTML = optionsList[1].querySelector("label").innerHTML;
    optionsContainer[0].classList.remove("active");
  });
  optionsList[2].addEventListener("click", () => {
    selected[0].innerHTML = optionsList[2].querySelector("label").innerHTML;
    optionsContainer[0].classList.remove("active");
  });
  optionsList[3].addEventListener("click", () => {
    selected[0].innerHTML = optionsList[3].querySelector("label").innerHTML;
    optionsContainer[0].classList.remove("active");
  });
  optionsList[4].addEventListener("click", () => {
    selected[0].innerHTML = optionsList[4].querySelector("label").innerHTML;
    optionsContainer[0].classList.remove("active");
  });
  optionsList[5].addEventListener("click", () => {
    selected[1].innerHTML = optionsList[5].querySelector("label").innerHTML;
    optionsContainer[1].classList.remove("active");
  });
  optionsList[6].addEventListener("click", () => {
    selected[1].innerHTML = optionsList[6].querySelector("label").innerHTML;
    optionsContainer[1].classList.remove("active");
  });
  document.getElementById("back-button").onclick = () => genTeacherPage(id);
  document.getElementById("comment-form").onsubmit = async (event) => {
    event.preventDefault();
    let inputs = document
      .getElementById("comment-form")
      .querySelectorAll("input");
    let result = Array.from(inputs).reduce((r, ele) => {
      r[ele.name] = ele.value;
      return r;
    }, {});

    let docRef = collection(db, "professor-names", id, "comments");
    let data = {
      comment: document.getElementById("comment-area").value.trim(),
    };
    for (const key in result) {
      data[key] = parseInt(result[key]);
    }
    await addDoc(docRef, data);
    genTeacherPage(id);
  };
};

document.getElementById("go-home").onclick = genHomePage;
document.getElementById("logo").onclick = genHomePage;
document.getElementById("go-contact").onclick = genContactPage;
document.getElementById("go-about").onclick = genAboutPage;

genHomePage();
