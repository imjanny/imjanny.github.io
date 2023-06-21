console.log("index.js 연결 확인")

window.addEventListener('load', function() {
    loadMainArticles();
    loadSubArticles();
    loadToday();
    loadUserList();
  });

document.addEventListener('DOMContentLoaded', function() {
    backToTop();
    setTimeout(subscribeCheck, 200);
});

// 게시글 불러오기 
async function getArticles(order) {
    const response = await fetch(`${backend_base_url}/article/home/?order=${order}`, {
    })
    if (response.status == 200) {
        const response_json = await response.json()
        return response_json
    } else {
        alert('게시글 로딩 실패')
        console.log(response_json)
    }
}

// 게시글 불러와서 메인에 표시하기
// 페이지네이션 - 4개까지
async function loadMainArticles() {
    try {
        articles = await getArticles("main");
        const sliderContainer = document.querySelector(".my-slider");
        
        articles.results.results.forEach(article => {
            const newSlide = document.createElement("div");
            newSlide.classList.add("slide");
            
            const articleImage = document.createElement("img")
            articleImage.setAttribute("class", "main-img")
            articleImage.setAttribute("src", `${backend_base_url}${article.image} `)
            articleImage.style.width = "530px";  
            articleImage.style.height = "250px";


            const newTitle = document.createElement("h5")
            newTitle.setAttribute("class", "main-title")
            newTitle.innerText = article.title

            newSlide.appendChild(articleImage)
            // newSlide.appendChild(newTitle)

            sliderContainer.appendChild(newSlide)

            // 게시글 클릭시 
            articleImage.addEventListener('click', () => {
                window.location.href = `${frontend_base_url}/article/detail.html?article_id=${article.id}`;
            });
        });
        //슬라이더 초기화
        var slider = tns({
            container: ".my-slider",
            items: 1,
            slideBy: 'page',
            mouseDrag: true,
            autoplay: true,
            autoplayText: ["▶", "❚❚"],
            controlsText: ["◀", "▶"],
            controls: false,
            nav : false,
            autoplayTimeout : 2000,
        });
    } catch (error) {
      console.error("메인기사 로딩 실패", error);
    }   

}

// 게시글 불러와서 서브구역에 표시하기
// 페이지네이션 10개까지
async function loadSubArticles() {
    
    articles = await getArticles("sub");
    
    const sub_article = document.getElementById("sub-article")
    
    articles.results.results.forEach(article => {
        const newArticle = document.createElement("div");
        newArticle.setAttribute("class", "article")
        
        const articleImage = document.createElement("img")
        articleImage.setAttribute("class", "sub-img")
        if (article.image) {
            articleImage.setAttribute("src", `${backend_base_url}${article.image}`)
        } else {
            articleImage.setAttribute("src", "static/image/nuri꾼logo2.png")
        }

        const newTitle = document.createElement("h5")
        newTitle.setAttribute("class", "sub-title")
        newTitle.innerText = article.title
        
        newArticle.appendChild(newTitle)
        newArticle.appendChild(articleImage)

        sub_article.appendChild(newArticle)

        // 게시글 클릭시 
        articleImage.addEventListener('click', () => {
            window.location.href = `${frontend_base_url}/article/detail.html?article_id=${article.id}`;
        });
        // 어디 클릭해서 이동할지 다수결
})
}

// today 표시
async function loadToday() {
    const currentDate = new Date()
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth() + 1
    const day = currentDate.getDate()

    const formattedDate = `${year}-${month}-${day}`

    const todayElement = document.getElementById("today")
    todayElement.innerText = formattedDate
}

// back to top 버튼
async function backToTop() {
    let debounceTimeout;
    let body = document.querySelector('body');
    let scrollingElement = document.scrollingElement;

    setScrollClass();

    window.addEventListener('scroll', setScrollClass);
    window.addEventListener('resize', setScrollClass);

    function setScrollClass() {
    if (debounceTimeout) {
        window.cancelAnimationFrame(debounceTimeout);
    }

    debounceTimeout = window.requestAnimationFrame(function () {
        let scrollTop = scrollingElement.scrollTop;
        let scrollHeight = scrollingElement.scrollHeight;
        let innerHeight = window.innerHeight;
        let scrollBottom = scrollHeight - innerHeight - scrollTop;

        body.classList.toggle('at-top', scrollTop < 48);
        body.classList.toggle('at-bottom', scrollBottom < 48);
    });
    }
}


// 유저리스트 불러오기 
async function getUserList() {
    const response = await fetch(`${backend_base_url}/user/home/userlist/`, {
    })
    if (response.status == 200) {
        const response_json = await response.json()
        return response_json
    } else {
        alert('유저리스트 로딩 실패')
    }
}

// 유저리스트 불러와서 유저리스트 구역에 표시하기
async function loadUserList() {
    
    users = await getUserList();

    const userList = document.getElementById("user-list")
    console.log(users)
    users.forEach(user => {
        
        const newUserCard = document.createElement("div");
        newUserCard.setAttribute("class", "user-card")

        const newUserImage = document.createElement("img")
        newUserImage.setAttribute("class", "user-img")
        if (user.profile_img) {
            profileImage = `${backend_base_url}${user.profile_img}`
        } else {
            profileImage = `${noProfileImage}`
        }
        newUserImage.setAttribute("src", `${profileImage} `)
        newUserImage.setAttribute("alt", "프로필이미지")        

        const newUserName = document.createElement("div")
        newUserName.setAttribute("class", "user-name")
        newUserName.innerText = user.nickname
        
        const newSubscribeButton = document.createElement("button")
        newSubscribeButton.setAttribute("type", "button")
        newSubscribeButton.setAttribute("class", "subscribe-button")
        newSubscribeButton.setAttribute("id", `${user.pk}`)
        newSubscribeButton.setAttribute("onclick", `postSubscribe(${user.pk})`)
    
        const newSubscribeText = document.createElement("span")
        newSubscribeText.setAttribute("class", "subscribe-text")
        newSubscribeText.innerText = "구독"

        newSubscribeButton.appendChild(newSubscribeText)

        newUserCard.appendChild(newUserImage)
        newUserCard.appendChild(newUserName)
        newUserCard.appendChild(newSubscribeButton)

        userList.appendChild(newUserCard)

        // 유저 프로필이미지 클릭시 -> 프로필로 이동
        newUserImage.addEventListener('click', () => {
            window.location.href = `${frontend_base_url}/user/profile_page.html?user_id=${user.pk}`; })
    });
}

// 다이렉트 구독하기 & 취소하기
async function postSubscribe(user_id) {
    const response = await fetch(`${backend_base_url}/user/subscribe/${user_id}/`, {
        headers: {
            'content-type': 'application/json',
            "Authorization": "Bearer " + localStorage.getItem("access")
        },
        method: 'POST',
    })

    if (response.status == 200) {
        alert("구독을 하였습니다.")
        window.location.reload()
    } else if (response.status == 205) {
        alert("구독을 취소하였습니다.")
        window.location.reload()
    } else if (response.status == 403) {
        alert("자신을 구독 할 수 없습니다.")
    }
}

// 구독 체크해서 다르게 표시
async function subscribeCheck() {
    const logined_id = parseInt(payload_parse.user_id)
    const response = await fetch(`${backend_base_url}/user/subscribe/${logined_id}`, {
    })
    const response_json = await response.json()
    const subscribedUsers = response_json.subscribe[0].subscribe
    const subscribedUserIds = subscribedUsers.map(user => String(user.id))
    const subscribeButtons = document.querySelectorAll(".subscribe-button")
    console.log(subscribeButtons)

    subscribeButtons.forEach(subscribeButton => {
        const buttonId = subscribeButton.getAttribute("id")
        const buttonText = subscribeButton.querySelector("span")

        if (subscribedUserIds.includes(buttonId)) {
            buttonText.innerText = "구독중"
            subscribeButton.classList.add("subscribed")
        } else {
            buttonText.innerText = "구독"
            subscribeButton.classList.remove("subscribed")
        }
    })
}

