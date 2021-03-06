import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDoc,
  getDocs,
  query,
  doc,
  serverTimestamp,
  orderBy,
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
  const q = query(teachersRef, orderBy("firstname"), orderBy("lastname"));
  const querySnapshot = await getDocs(q);
  let professorsDiv = "";
  let professorOption = "";
  let filteredData = querySnapshot.docs.filter((doc) => {
    return (doc.data().firstname + " " + doc.data().lastname)
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
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
  document.getElementById("header").className = "header";
  document.getElementById("banner-content").innerHTML = `
  <h1>C.P.</h1>
  <h2>Rate My Professor</h2>
  <p>" This is the professor rating website</p>
  <p>for computer engineering students at Chulalongkorn University "</p>
  <div class="scroll-button">
  <a href="#application">
    <img
      src="images/scroll_down.png"
      alt="scroll_down"
      class="scroll-down"
    />
  </a>
  <p class="scroll-text">Scroll Down</p>
  </div>
  `;
  document.getElementById("application").innerHTML = `
      <h1 id="application-title">Search to <span>Rate!</span></h1>
      <input name="professor-name" id="professor-search" placeholder="Search professor name" />
      <datalist id="professor-options"> </datalist>
      <div id="teacher-names"></div>
      `;
  document.getElementById("professor-search").oninput = () =>
    fetchTeacherName(document.getElementById("professor-search").value);
  fetchTeacherName("");
  addProfOnClick();
  document.body.scrollTop = document.documentElement.scrollTop = 0;
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
  document.getElementById("header").className = "no-header";
  document.getElementById("banner-content").innerHTML = "";
  let d = await getDoc(doc(db, "professor-names", id));

  let querySnapshot = await getDocs(
    query(
      collection(db, "professor-names", id, "comments"),
      orderBy("timestamp")
    )
  );
  let rating = 0;
  if (querySnapshot.docs.length > 0) {
    let sumRating = 0;
    querySnapshot.docs.map((doc) => {
      let a = doc.data();
      sumRating += parseInt(a.score);
    });
    rating = (sumRating / querySnapshot.docs.length).toFixed(1);
  }
  document.getElementById("application").innerHTML = `
  <div>
    <div>
      <h1 id="firstname-lastname">${
        d.data().firstname + " " + d.data().lastname
      }</h1>
      <div>Score:</div>
      <div><span class="average-score">${rating}</span>/5</div>
      <div>Based on <strong>${querySnapshot.docs.length}</strong> comments</div>
    </div>
    <button id="new-comment-button">
      New Comment
    </button>
    <div id="comment-box">
    </div>
    <button id="back-button">Back
    </button>
  </div>
  `;
  querySnapshot.docs.reverse().map((doc, idx) => {
    let a = doc.data();
    const commentDate = a.timestamp.toDate();
    document.getElementById("comment-box").innerHTML += `
    <div class="comment">
      <div class="comment-number">Comment #${idx + 1}</div>
      <div class="timestamp">${
        commentDate.toDateString() + ", " + commentDate.toLocaleTimeString()
      }</div>
      <div class="comment-data">
        <div class="category"><span>Score:</span> ${a.score}</div>
        <div class="category"><span>Course:</span> ${a.course}</div>
        <div class="category"><span>Section:</span> ${a.section}</div>
        <div class="category"><span>Semester:</span> ${a.semester}</div>
        <div class="category"><span>Academic Year:</span> ${a.year}</div>
        </div>
      <div class="comment-content">${a.comment}</div>
    </div>`;
  });
  document.getElementById("back-button").onclick = () => {
    genHomePage();
  };
  document.getElementById("new-comment-button").onclick = () => {
    genCommentPage(id, d.data().firstname + " " + d.data().lastname);
  };
  document.body.scrollTop = document.documentElement.scrollTop = 0;
};
const genContactPage = () => {
  document.getElementById("header").className = "no-header";
  document.getElementById("banner-content").innerHTML = "";
  document.getElementById("application").innerHTML = `
  <h1 id = "contact-title">Reach Out!</h1>
  <div class = "inform-box">
    <h2 class = "inform-name">Nopparuj Poonsubanan</h2>
      <p = "inform-stu-id">Student ID: 6330261921</p>
  </div>
  <div class = "inform-box">
    <h2 class = "inform-name">Noppakorn Jiravaranun</h2>
      <p = "inform-stu-id">Student ID: 6330258021</p>
  </div>
  <div class = "inform-box">
    <h2 class = "inform-name">Naphat Darunaitorn</h2>
      <p = "inform-stu-id">Student ID: 6230136021</p>
  </div>
  <div class = "inform-box">
    <h2 class = "inform-name">Ittipat Yodprasit</h2>
      <p = "inform-stu-id">Student ID: 6431349821</p>
  </div>
  `;
  document.body.scrollTop = document.documentElement.scrollTop = 0;
};
const genAboutPage = () => {
  document.getElementById("header").className = "no-header";
  document.getElementById("banner-content").innerHTML = "";
  document.getElementById("application").innerHTML = `
  <h1 id = "about-title">What We Do</h1>
  <img id = "informative_about_page" src = "images/informative_about_page.png" alt=""/>
  <p>
  Online Learning can be tough. Not getting to see your friends, your teacher and your senior can take a toll on you.
  At Computer Engineering, Chulalongkorn University getting to see your senior can be very beneficial.
  The senior can gives you many information regarding which course to take, how are the professor and which section to choose.
  </p>
  <p>
  Online Learning takes this away from us. We can not get advice efficiently.
  Even though there are a system for rating professor created and run by the university, the data is not public for the students to see.
  We can't see what people think of the course or the teacher.
  We can't prove that the comment given to the university is anonymous, when we comment we have to login to the system and that can be scary for some students.
  </p>
  <p>
  CP Rate Professor hopes to solve some of that concern.
  The platform provides an anonymous comment and rating system for professor at Computer Engineering, Chulalongkorn University.
  We do not collect data expect from the comment and rating you've given us. All of the source code is open-source and available for you to see an audit.
  Comments can't be deleted or edited. We are fully transparent. When you are commenting and rating, we hope that you are honest with your comment.
  We hope that these information can help you choose the course to take or the section to choose, so that a bit of stress can be ease off from online learning.
  </p>
  `;
  document.body.scrollTop = document.documentElement.scrollTop = 0;
};

const genCommentPage = (id, professorName) => {
  let limit = 500;
  document.getElementById("header").className = "no-header";
  document.getElementById("banner-content").innerHTML = "";
  document.getElementById("application").innerHTML = `
  <div id="head-comment-page">
    <h2 id="comment-title">
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
          placeholder="Course"
          type="number"
          class="number-input"
          id="course"
          name="course"
          min="2000000"
          max="9999999"
        />
      </div>
      <div class="number-input-box">
        <h2>Section</h2>
        <input
          placeholder="Section"
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
          placeholder="Academic Year"
          type="number"
          class="number-input"
          id="year"
          name="year"
          min="2015"
          max="2022"
        />
      </div>
      <h2>Semester</h2>
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
        <div class="selected" id="selected-semester">Select Semester</div>
      </div>
      <h2>Comment</h2>
      <div class="comment-container">
        <textarea id="comment-area" rows="4" maxlength="${limit}"> </textarea>
      </div>
      <div class="text-counter">
        <p id="char-lenght"></p>
      </div>
      <div id="comment-page-button-container">
        <button id="submit-button">Submit</button>
      </div>
    </form>
  </div>
  `;

  // comment-counter
  let commentText = document.getElementById("comment-area");
  let charLength = document.getElementById("char-lenght");
  charLength.textContent = 0 + "/" + limit;
  commentText.addEventListener("input", function () {
    var textLength = commentText.value.length;
    charLength.textContent = textLength + "/" + limit;
  });
  // select-function
  const selected = document.querySelectorAll(".selected");
  const optionsContainer = document.querySelectorAll(".options-container");
  const optionsList = document.querySelectorAll(".option");
  const scoreBox = document.getElementById("selected-score");
  const semesterBox = document.getElementById("selected-semester");
  selected[0].addEventListener("click", () => {
    optionsContainer[0].classList.toggle("active");
    if (optionsContainer[0].classList.contains("active"))
      scoreBox.style.outline = "0.15em solid var(--clr-primary)";
    else scoreBox.style.outline = "";
  });
  selected[1].addEventListener("click", () => {
    optionsContainer[1].classList.toggle("active");
    if (optionsContainer[1].classList.contains("active"))
      semesterBox.style.outline = "0.15em solid var(--clr-primary)";
    else semesterBox.style.outline = "";
  });
  optionsList[0].addEventListener("click", () => {
    selected[0].innerHTML = optionsList[0].querySelector("label").innerHTML;
    optionsContainer[0].classList.remove("active");
    scoreBox.style.outline = "";
  });
  optionsList[1].addEventListener("click", () => {
    selected[0].innerHTML = optionsList[1].querySelector("label").innerHTML;
    optionsContainer[0].classList.remove("active");
    scoreBox.style.outline = "";
  });
  optionsList[2].addEventListener("click", () => {
    selected[0].innerHTML = optionsList[2].querySelector("label").innerHTML;
    optionsContainer[0].classList.remove("active");
    scoreBox.style.outline = "";
  });
  optionsList[3].addEventListener("click", () => {
    selected[0].innerHTML = optionsList[3].querySelector("label").innerHTML;
    optionsContainer[0].classList.remove("active");
    scoreBox.style.outline = "";
  });
  optionsList[4].addEventListener("click", () => {
    selected[0].innerHTML = optionsList[4].querySelector("label").innerHTML;
    optionsContainer[0].classList.remove("active");
    scoreBox.style.outline = "";
  });
  optionsList[5].addEventListener("click", () => {
    selected[1].innerHTML = optionsList[5].querySelector("label").innerHTML;
    optionsContainer[1].classList.remove("active");
    semesterBox.style.outline = "";
  });
  optionsList[6].addEventListener("click", () => {
    selected[1].innerHTML = optionsList[6].querySelector("label").innerHTML;
    optionsContainer[1].classList.remove("active");
    semesterBox.style.outline = "";
  });
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
    data["score"] = parseInt(selected[0].innerHTML);
    data["semester"] = parseInt(selected[1].innerHTML);
    data["timestamp"] = serverTimestamp();
    await addDoc(docRef, data);
    genTeacherPage(id);
  };
  document.body.scrollTop = document.documentElement.scrollTop = 0;
};

const toggleButton = document.getElementsByClassName("toggle-button")[0];
const mobileNav = document.getElementsByClassName("mobile-nav")[0];

toggleButton.addEventListener("click", () => {
  mobileNav.classList.toggle("active");
});

document.getElementById("logo").onclick = genHomePage;
document.getElementById("go-home").onclick = genHomePage;
document.getElementById("go-contact").onclick = genContactPage;
document.getElementById("go-about").onclick = genAboutPage;
document.getElementById("go-home-mobile").onclick = genHomePage;
document.getElementById("go-contact-mobile").onclick = genContactPage;
document.getElementById("go-about-mobile").onclick = genAboutPage;

genHomePage();
