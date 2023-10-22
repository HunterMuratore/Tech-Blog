$(document).ready(function () {
    const inputField = $('#inputField');
    const charCount = $('#charCount');
    const form = $('#postForm');
    const submitButton = $('#submitBtn');
    const updateBtn = $("#updateBtn");
    const deleteBtn = $("#deleteBtn");

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

    updateBtn.click(function () {
        var postContainer = $(this).closest(".post");
        var postText = postContainer.find(".post-text");
        var editInput = postContainer.find(".edit-post-input");

        postText.hide();
        editInput.show();

        // Set the input field's value to the current text
        editInput.val(postText.text());

        // Fetch the postId associated with the post text
        fetch(`/getPostId?text=${encodeURIComponent(postText.text())}`, {
            method: 'GET',
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error fetching postId');
                }
                return response.json();
            })
            .then(data => {
                var postId = data.postId;

                // When the user presses enter, save the edited text
                editInput.keypress(function (e) {
                    if (e.which === 13) {
                        var newText = editInput.val();
                        postText.text(newText);

                        updatePostText(postId, newText);

                        editInput.hide();
                        postText.show();
                    }
                });
            })
            .catch(error => {
                console.log(error.message);
            });
    });

    deleteBtn.click(function () {
        var postId = deleteBtn.data("post-id");

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
            method: "POST",
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
