//import { key } from "./ref";
let input = document.querySelector("#input");
let searchbtn = document.querySelector("#search");
let notFound = document.querySelector(".notfound");
let defBox = document.querySelector(".def");
let audioBox = document.querySelector(".audio");
let loading = document.querySelector(".loading");

let apiKey = "34076b5c-b57f-4c71-a706-2d4ed930ad80";
searchbtn.addEventListener("click", (e) => {
  e.preventDefault();
  //clear previous loaded data
  defBox.innerText = "";
  audioBox.innerHTML = "";
  notFound.innerText = "";
  //get innput data
  let word = input.value;
  //call api get data
  if (word === "") {
    alert("Word is required");
    return;
  }

  getData(word);
});

async function getData(word) {
  //api ajax call
  loading.style.display = " block";
  const response = await fetch(
    `https://www.dictionaryapi.com/api/v3/references/learners/json/${word}?key=${apiKey}`
  );
  //convett promise data into json data
  const data = await response.json();

  //check for empty data
  loading.style.display = "none";

  if (!data.length) {
    notFound.innerText = "No Result found :(";
    return;
  }

  //check for words suggestion
  loading.style.display = "none";

  if (typeof data[0] === "string") {
    console.log("its working");
    let heading = document.createElement("h3");
    heading.innerText = "Did You Mean?";
    notFound.appendChild(heading);
    data.forEach((element) => {
      let suggestion = document.createElement("span");
      suggestion.classList.add("suggested");
      suggestion.innerText = element;
      notFound.appendChild(suggestion);
    });
    return;
  }

  //result found
  loading.style.display = "none";

  let def = data[0].shortdef[0];
  defBox.innerText = def;

  //audio
  let aud = data[0].hwi.prs[0].sound.audio;
  if (aud) {
    renderSound(aud);
  }
  console.log(def);
  console.log(data);
}

function renderSound(aud) {
  let audiPlayer = document.createElement("audio");
  let subfolder = aud.charAt(0);
  let audioSrc = `https://media.merriam-webster.com/audio/prons/en/us/wav/${subfolder}/${aud}.wav`;
  audiPlayer.src = audioSrc;
  audiPlayer.controls = true;
  audioBox.appendChild(audiPlayer);
}
