$(document).ready(function () {
    const inputField = $('#inputField');
    const charCount = $('#charCount');
    const form = $('#postForm');
    const submitButton = $('#submitBtn');
    const updateBtn = $(".updateBtn");
    const deleteBtn = $(".deleteBtn");

    inputField.on('input', function () {
        const inputValue = inputField.val();
        const inputLength = inputValue.length;

        charCount.text(inputLength);

        // Disable the submit button if character count exceeds 500
        if (inputLength > 500) {
            submitButton.prop('disabled', true);
        } else {
            submitButton.prop('disabled', false);
        }
    });

    // Show/hide the character count error popup
    form.on('submit', function (event) {
        const inputLength = inputField.val().length;
        if (inputLength > 500) {
            event.preventDefault(); // Prevent form submission
        }
    });

    $(".post-output").on("click", ".updateBtn", function () {
        const postId = $(this).data("post-id");
        const postContainer = $(this).closest(".post");
        const postText = postContainer.find(".post-text");
        const editInput = postContainer.find(".edit-post-input");

        postText.hide();
        editInput.show();

        // Set the input field's value to the current text
        editInput.val(postText.text());

        // When the user presses enter, save the edited text
        editInput.keypress(function (e) {
            if (e.which === 13) {
                const newText = editInput.val();
                postText.text(newText);

                updatePostText(postId, newText);

                editInput.hide();
                postText.show();
            }
        });
    });

    $(".post-output").on("click", ".deleteBtn", function () {
        const postId = $(this).data("post-id");

        if (confirm("Are you sure you want to delete this post?")) {
            fetch(`/delete/${postId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            })
                .then((response) => {
                    if (response.ok) {
                        deleteBtn.closest(".post").remove();
                    } else {
                        throw new Error("Failed to delete the post.");
                    }
                })
                .catch(error => {
                    console.log(error.message);
                });
        }
    });

    function updatePostText(postId, newText) {
        fetch("/update", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ postId, newText })
        })
            .then(response => {
                if (!response.ok) {
                    console.log('Error updating the post text');
                }
            });
    }
});
