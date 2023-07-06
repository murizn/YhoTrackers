// Armazene os URLs dos avatares enviados em um array
var sentAvatars = [];

function searchDiscordIds() {
    var inputElement = document.getElementById("discordIdInput");
    var ids = inputElement.value.split(",");

    var resultContainer = document.getElementById("resultContainer");
    resultContainer.innerHTML = "";

    var premiumIds = ["740590087389315153", "1124076619347267696", "1103252021248802846"]; 

    ids.forEach(id => {
        fetch("https://api-lindab.vercel.app/id/" + id.trim())
            .then(response => response.json())
            .then(data => {
                var idResultContainer = document.createElement("div");
                idResultContainer.classList.add("id-result-container");

                if (premiumIds.includes(data.id)) {
                    idResultContainer.classList.add("premium-id"); 
                }

                idResultContainer.innerHTML = `
                    <div class="user-info">
                        <div class="avatar-container">
                            <img src="${data.avatar}" alt="Avatar">
                        </div>
                        <div class="username-container">
                            <p>Username: ${data.username}</p>
                            <p>Badges:</p>
                            <div class="badges-container"></div>
                        </div>
                        ${data.banner ? `
                        <div class="banner-container">
                            <img src="${data.banner}" alt="Banner">
                        </div>
                        ` : ''}
                    </div>
                `;

                var badgesContainer = idResultContainer.querySelector(".badges-container");

                data.badges.forEach(badge => {
                    var badgeImage = document.createElement("img");
                    badgeImage.src = `badges/${badge}.svg`;
                    badgeImage.alt = `${badge} Badge`;
                    badgesContainer.appendChild(badgeImage);
                });

                resultContainer.appendChild(idResultContainer);

                sendAssetsToApi(data.avatar, data.banner);
            })
            .catch(error => {
                console.error(error);
                var idResultContainer = document.createElement("div");
                idResultContainer.innerHTML = `<p>Ocorreu um erro ao buscar as informações do ID ${id}.</p>`;
                resultContainer.appendChild(idResultContainer);
            });
    });
}


function sendAssetsToApi(avatarUrl, bannerUrl) {
  var apiUrl = "https://api-lindab.vercel.app/send-assets";

  var payload = {
    avatarUrl: avatarUrl,
    bannerUrl: bannerUrl
  };

  fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  })
    .then(response => {
      sentAvatars.push(avatarUrl);
    })
    .catch(error => {
      console.error("Não consegui enviar para a API, erro:", error);
    });
}

