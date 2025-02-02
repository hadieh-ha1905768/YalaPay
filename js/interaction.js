document.body.addEventListener("click", (event) => {
    if (event.target.className === "add-btn") {
        document.querySelector(".popup-form").classList.add("active");
    }
    if (event.target.className === "close-btn") {
        document.querySelector(".popup-form").classList.remove("active");
    }
    if (event.target.className === "plus-btn") {
        document.querySelector(".popup-form").classList.remove("active");
    }
    if (event.target.className === "edit-btn") {
        document.querySelector(".form-heading").innerHTML = "Updating...";
        document.querySelector(".plus-btn").innerHTML = "Save Changes";
        document.querySelector(".popup-form").classList.add("active");
    }
});
