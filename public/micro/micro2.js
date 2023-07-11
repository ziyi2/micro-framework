window.parent.addEventListener("mainChannel", (e) => {
  console.log("micro2 addEventListener: ", e);
});

window.parent.dispatchEvent(
  new CustomEvent("microChannel", {
    detail: "micro2",
  })
);
