// 최종 테스트 후 console.log 지우기
console.log('게시글 수정 페이지 연결 확인')

window.onload = () => {
    // 현재 페이지에서 이전 페이지의 데이터 가져오기
    const originalTitle = sessionStorage.getItem('article-title');
    document.getElementById('article-update-title').value = originalTitle;

    const originalImage = sessionStorage.getItem('article-image');
    document.getElementById('article-update-image').src = originalImage;

    const originalContent = sessionStorage.getItem('article-content');
    document.getElementById('article-update-content').value = originalContent;
}

// 게시글 수정하기
function articleUpdate() {
    const updateTitle = $('#article-update-title').val();
    const updateContent = $('#article-update-content').val();
    const updateImage = $('#article-update-image').val();

    const article_id = new URLSearchParams(window.location.search).get('article_id');

    if (updateTitle == '' || updateContent == '') {
        alert("빈칸 없이 입력해 주세요.");
        return;
    }

    const formData = new FormData();

    formData.append("title", updateTitle);
    formData.append("content", updateContent);

    // 이미지 데이터를 File 객체로 변환하여 추가
    if (updateImage) {
        formData.append("uploaded_image", updateImage);
    }

    $.ajax({
        url: `${backend_base_url}/article/${article_id}/`,
        type: 'PATCH',
        data: formData,
        processData: false,
        contentType: false,
        headers: {
            Authorization: `Bearer ${localStorage.getItem('access')}`
        },
        success: function (response) {
            alert("글 수정 완료");
            window.parent.location.href = `${frontend_base_url}/article/detail.html?article_id=${article_id}`;
        },
        error: function (xhr) {
            const message = xhr.responseJSON.message;
            alert(message);
        }
    });
};


