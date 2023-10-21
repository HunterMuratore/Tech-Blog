$(document).ready(function() {
    const inputField = $('#inputField');
    const charCount = $('#charCount');
    const form = $('#postForm');
    const submitButton = $('#submitBtn');
    const updateBtn = $("#updateBtn");

    inputField.on('input', function() {
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
    form.on('submit', function(event) {
        const inputLength = inputField.val().length;
        if (inputLength > 500) {
            event.preventDefault(); // Prevent form submission
        }
    });

    updateBtn.click(function () {
        var postContainer = $(this).closest(".post");
        var postText = postContainer.find(".post-text");
        var editInput = postContainer.find(".edit-post-input");

        // Show the input field, hide the text
        postText.hide();
        editInput.show();

        // Set the input field's value to the current text
        editInput.val(postText.text());

        // When the user presses enter (13), save the edited text
        editInput.keypress(function (e) {
            if (e.which === 13) {
                var newText = editInput.val();
                postText.text(newText);

                // Send the updated text to the server
                var postId = postContainer.data("post-id");
                updatePostText(postId, newText);

                // Hide the input and show the text again
                editInput.hide();
                postText.show();
            }
        });
    });

    function updatePostText(postId, newText) {
        fetch("/update", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ postId, newText }),
        })
        .then(response => {
            if (!response.ok) {
                console.log('Error updating the post text');
            }
        });
    }
});
