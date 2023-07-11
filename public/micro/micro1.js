window.parent.addEventListener("mainChannel", (e) => {
  console.log("micro1 addEventListener: ", e);
});

window.parent.dispatchEvent(
  new CustomEvent("microChannel", {
    detail: "micro1",
  })
);

