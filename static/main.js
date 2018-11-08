const urlInput = document.getElementById("url-input");
const urlInputSubmit = document.getElementById("url-input-sbt");

urlInputSubmit.onclick = () => {
  const url = encodeURI(urlInput.value);

  fetch(`api/1/get_words?url=${url}`)
    .then(res => res.json())
    .then(json => {
      console.log(json);
    });
};
