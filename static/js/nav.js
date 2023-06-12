// 상단 네비바, 푸터 가져오기

document.addEventListener("DOMContentLoaded", function () {

    // 네비바를 삽입할 위치
    const navbar = document.querySelector("#navbar");
  
    if (navbar) {
        // base-nav.html 파일을 가져와서 네비게이션바 위치에 삽입
        fetch("/base/nav.html")
            .then(response => response.text())
            .then(data => {
                navbar.innerHTML = data;
            })
            .then(() => {
  
                // nav.html이 로드된 후에 intro 태그와 기타 작업을 수행
                const payload = localStorage.getItem("payload");
                const payload_parse = JSON.parse(payload)
  
                const intro = document.getElementById("intro");
                if (intro) {
                    const payload = localStorage.getItem("payload");
                    const payload_parse = JSON.parse(payload);
                    intro.innerHTML = `
                <a href="${frontend_base_url}/user/profile_page.html?user_id=${payload_parse.user_id}">
                <span><img class="profile-img" src="${backend_base_url}/media/${payload_parse.profile_img}" alt="" style="width:40px;"></span>
                ${payload_parse.nickname}</a>`
  
                    let navbarRight = document.getElementById("navbar-up");
                    let newLi = document.createElement("li");
                    newLi.setAttribute("class", "nav-item");
  
                    let logoutBtn = document.createElement("a");
                    logoutBtn.setAttribute("class", "nav-link btn");
                    logoutBtn.innerText = "로그아웃";
                    logoutBtn.setAttribute("href", "#");
  
                    logoutBtn.setAttribute("onclick", "confirmLogout()");
  
  
  
                    newLi.appendChild(logoutBtn);
  
                    navbarRight.appendChild(newLi);
                }
  
                let loginbtn = document.getElementById("login-btn");
                let signupbtn = document.getElementById("signup-btn");
                let createbtn = document.getElementById('create-article')
                let createmotebtn = document.getElementById('create-note')
                if (loginbtn) {
                    loginbtn.style.display = "none";
                    signupbtn.style.display = "none";
                    createbtn.style.display = "block";
                    createmotebtn.style.display = "block";
                }
  
  
            })
            .catch(error => {
                console.error("Error fetching navigation bar:", error);
            });
    }
  });
  
  //로그아웃
  function confirmLogout() {
    if (confirm("로그아웃하시겠습니까?")) {
        handleLogout();
    }
  }
  async function handleLogout() {
    localStorage.removeItem("access")
    localStorage.removeItem("refresh")
    localStorage.removeItem("payload")
    location.replace('/base/nav.html')
  }
  
  