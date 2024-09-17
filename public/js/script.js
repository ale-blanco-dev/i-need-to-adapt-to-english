document.getElementById("grammar-link-1").addEventListener("click", function () {
            var selectMenu = document.getElementById("grammar-options-1");
            if (selectMenu.style.display === "none") {
                selectMenu.style.display = "block";
            } else {
                selectMenu.style.display = "none";
            }
        });

        document.getElementById("grammar-options-1").addEventListener("change", function () {
            var selectedURL = this.value;
            if (selectedURL) {
                window.open(selectedURL, "_blank");
            }
        });

        document.getElementById("grammar-link-2").addEventListener("click", function () {
            var selectMenu = document.getElementById("grammar-options-2");
            if (selectMenu.style.display === "none") {
                selectMenu.style.display = "block";
            } else {
                selectMenu.style.display = "none";
            }
        });

        document.getElementById("grammar-options-2").addEventListener("change", function () {
            var selectedURL = this.value;
            if (selectedURL) {
                window.open(selectedURL, "_blank");
            }
        });

        document.getElementById('sendButton').addEventListener('click', function (event) {
            event.preventDefault();

            const userInput = document.getElementById('my-input').value;

            fetch('https://traduce-lkdliiflpq-uc.a.run.app', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: userInput })
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Datos recibidos:', data);
                    if (data.error) {
                        throw new Error(data.error);
                    }
                    document.getElementById('response').innerText = data.reply;
                })                
                .catch(error => {
                    console.error('Error:', error);
                    document.getElementById('response').innerText = 'Ocurrió un error. Inténtalo de nuevo.';
                });
        });

        document.getElementById('sendButtonPhrase').addEventListener('click', function(event) {
            event.preventDefault();
            const userInput = document.getElementById('my-input').value;
            const userInputPhrase = document.getElementById('my-input-phrase').value;
            console.log(userInputPhrase)

            fetch('https://validatephrase-lkdliiflpq-uc.a.run.app', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: userInputPhrase, word:userInput })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Datos recibidos Frase:', data);
                if (data.error) {
                    throw new Error(data.error);
                }
                document.getElementById('responsePhrase').innerText = data.reply;
            })
            .catch(error => {
                console.error('Error:', error);
                document.getElementById('responsePhrase').innerText = 'Ocurrió un error. Inténtalo de nuevo.';
            });
        })

        document.getElementById('sendButtonQuestion').addEventListener('click', function(event) {
            event.preventDefault();
            const userInputQuestion = document.getElementById('my-input-question').value;
            console.log(userInputQuestion)

            fetch('https://validatequestion-lkdliiflpq-uc.a.run.app', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: userInputQuestion })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Datos recibidos Question:', data);
                if (data.error) {
                    throw new Error(data.error);
                }
                document.getElementById('responseQuestion').innerText = data.reply;
            })
            .catch(error => {
                console.error('Error:', error);
                document.getElementById('responseQuestion').innerText = 'Ocurrió un error. Inténtalo de nuevo.';
            });
        })