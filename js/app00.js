const imgBox = document.querySelector(".imgBox");
const slides = document.querySelectorAll(".imgBox img");
let index = 0;
const total = slides.length;

function showSlide(i) {
  index = (i + total) % total; // 끝에 가면 다시 처음으로
  imgBox.style.transform = `translateX(-${index * 100}%)`;
}
function nextImg() {
  showSlide(index + 1);
}
function prevImg() {
  showSlide(index - 1);
}

const PLACEHOLDER = "https://via.placeholder.com/800x500?text=Silver+Road";
function showUpdateMsg() {
  alert(
    "지금은 업데이트 중입니다. 더욱 좋은 여행상품이 되도록 최선을 다하겠습니다."
  );
}

const DATA = {
  domestic: [
    {
      id: "buyeo",
      title: "부여 수륙양용시티투어",
      sub: "정림사지 · 궁남지 · 국립부여박물관",
      thumb: "./img/buyeo.jpg",
      scenes: [
        { title: "정림사지", sub: "석불좌상", img: "./img/buyeo06.jpg" },
        {
          title: "궁남지",
          sub: "유래와 버드나무절경",
          img: "./img/buyeo05.jpg",
        },
        {
          title: "국립부여박물관",
          sub: "백제문화전시",
          img: "./img/buyeo04.jpg",
        },
      ],
      stays: [
        {
          title: "월함지 한옥",
          sub: "온돌방, 픽업",
          img: "./img/buyeo07.jpg",
          url: "#",
        },
        {
          title: "부여안방마님",
          sub: "한옥펜션,수영장,반려견 입장가능",
          img: "./img/buyeo08.jpg",
          url: "#월함지-한옥",
        },
        {
          title: "롯데리조트 부여",
          sub: "아쿠아가든, 분수쇼",
          img: "./img/buyeo09.jpg",
          url: "#롯데리조트-부여",
        },
      ],
    },
    {
      id: "gangneung",
      title: "강릉 힐링 1박2일",
      sub: "안목해변 · 경포호 · 주문진",
      thumb: "./img/gangneung01.jpg",
      scenes: [
        {
          title: "안목해변",
          sub: "커피거리 산책",
          img: "./img/gangneung05.jpg",
        },
        {
          title: "경포호",
          sub: "둘레길 완만",
          img: "./img/gangneung07.webp",
        },
        {
          title: "주문진 항",
          sub: "어시장 구경",
          img: "./img/gangneung08.jpg",
        },
      ],
      stays: [
        {
          title: "스카이 베이 경포호텔",
          sub: "조식 · 엘리베이터",
          img: "./img/gangneung09.jpg",
          url: "#경포-인근 호텔",
        },
        {
          title: "안목 바닷가 숙소",
          sub: "오션뷰 · 1층 객실 옵션",
          img: "./img/gangneung10.jpg",
          url: "#안목-바닷가 숙소",
        },
      ],
    },
    {
      id: "suncheon",
      title: "순천만 국가정원과 미식체험",
      sub: "국가정원관람차 · 순천만습지 · 순천형 브런치",
      thumb: "./img/suncheonman.jpg",
      scenes: [
        {
          title: "국가정원관람차",
          sub: "여유있게 차로",
          img: "./img/suncheon05.jpg",
        },
        {
          title: "순천만습지",
          sub: "거대한 갈대군락지",
          img: "./img/suncheon01.jpg",
        },
        {
          title: "순천형 브런치",
          sub: "제철해소+해물죽",
          img: "./img/suncheon06.jpg",
        },
      ],
      stays: [
        {
          title: "순천만 에코 유스호스텔",
          sub: "우리도 간다",
          img: "./img/suncheon07.jpg",
          url: "#순천만-에코 유스호스텔",
        },
        {
          title: "순천만 황토한옥샘터",
          sub: "한옥과 황토",
          img: "./img/suncheon08.jpg",
          url: "#순천만-황토한옥샘터",
        },
      ],
    },
  ],
  silverHotels: [
    {
      id: "seoul",
      title: "서울 시니어 케어 호캉스",
      sub: "의료 연계 · 무장애 동선",
      thumb: "./img/seoulsigniel.webp",
      features: [
        "무장애 엘리베이터 / 휠체어 동선 확보",
        "의료기관 연계 · 건강식 제공",
        "서울 시내 관광지 셔틀",
      ],
      gallery: [
        "./img/seoulsigniel.webp",
        "./img/barrierfree.jpg",
        "./img/tourbus.png",
      ],
      url: "#",
    },
    {
      id: "busan",
      title: "부산 해운대 온천 호캉스",
      sub: "전 객실 오션뷰 · 온천",
      thumb: "./img/busanheaundea.jpg",
      features: [
        "오션뷰 객실 · 석양 감상",
        "온천/사우나 · 낙상 방지 바 설치",
        "해운대 해변 도보 5분",
      ],
      gallery: [
        "./img/busansunset.jfif",
        "./img/hotwaterhotel.jpg",
        "./img/beachhotel.avif",
      ],
      url: "#",
    },
  ],
};

// === 롤링(자동 넘김) 이벤트 ===
const slider = document.querySelector(".mainImg");
let autoTimer = null;
const AUTO_MS = 3000;

function startAuto() {
  stopAuto();
  autoTimer = setInterval(() => nextImg(), AUTO_MS);
}
function stopAuto() {
  if (autoTimer) {
    clearInterval(autoTimer);
    autoTimer = null;
  }
}

// 마우스 올리면 잠시 멈춤, 떼면 재시작
slider.addEventListener("mouseenter", stopAuto);
slider.addEventListener("mouseleave", startAuto);

// 최초 시작
startAuto();

const sec2Box = document.querySelector("#sec2 .selectrip");
const reviewBox = document.querySelector("#review .photoreview");
const menuDom = {
  domestic: document.getElementById("menu1"),
  silver: document.getElementById("menu2"),
  tips: document.getElementById("menu3"),
  comm: document.getElementById("menu4"),
};

const safeImg = (src) => (src && src.trim() ? src : PLACEHOLDER);
function renderDomesticList() {
  sec2Box.innerHTML = "";
  reviewBox.innerHTML = "";
  DATA.domestic.forEach((item) => {
    const card = document.createElement("article");
    card.className = "trip-card";
    card.innerHTML = `
              <img class="trip-thumb" src="${safeImg(item.thumb)}" alt="${
      item.title
    }" />
              <div class="trip-body">
                <div class="trip-title">${item.title}</div>
                <div class="trip-sub">${item.sub}</div>
              </div>
            `;
    card.addEventListener("click", () => renderDetail(item));
    sec2Box.appendChild(card);
  });
}

function renderDetail(item) {
  reviewBox.innerHTML = `
            <div class="detail-panel" aria-live="polite">
              <div class="detail-header">
                <i class="ri-map-pin-line" aria-hidden="true"></i>
                <h3>${item.title}</h3>
              </div>
              <div class="detail-tabs">
                <button class="tab-btn active" data-tab="scenes" aria-pressed="true">주변경치</button>
                <button class="tab-btn" data-tab="stays" aria-pressed="false">숙소</button>
              </div>
              <div class="detail-content"></div>
            </div>
          `;

  const content = reviewBox.querySelector(".detail-content");
  const tabs = reviewBox.querySelectorAll(".tab-btn");

  function renderScenes() {
    content.innerHTML = `
              <div class="detail-grid">
                ${item.scenes
                  .map(
                    (s) => `
                  <div class="detail-card">
                    <img src="${safeImg(s.img)}" alt="${s.title}" />
                    <div class="dc-body">
                      <div class="dc-title">${s.title}</div>
                      <div class="dc-sub">${s.sub}</div>
                    </div>
                  </div>
                `
                  )
                  .join("")}
              </div>
            `;
  }
  function renderStays() {
    content.innerHTML = `
              <div class="detail-grid">
                ${item.stays
                  .map(
                    (s) => `
                  <div class="detail-card">
                    <img src="${safeImg(s.img)}" alt="${s.title}" />
                    <div class="dc-body">
                      <div class="dc-title">${s.title}</div>
                      <div class="dc-sub">${s.sub}</div>                      
                    </div>
                  </div>
                `
                  )
                  .join("")}
              </div>`;
  }
  renderScenes();

  tabs.forEach((btn) => {
    btn.addEventListener("click", () => {
      tabs.forEach((b) => {
        b.classList.remove("active");
        b.setAttribute("aria-pressed", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-pressed", "true");
      if (btn.dataset.tab === "stays") renderStays();
      else renderScenes();
    });
  });
}

// ===== 실버호캉스: 리스트 -> 상세 =====
function renderSilverHotels() {
  sec2Box.innerHTML = "";
  reviewBox.innerHTML = "";
  DATA.silverHotels.forEach((hotel) => {
    const card = document.createElement("article");
    card.className = "trip-card";
    card.innerHTML = `
              <img class="trip-thumb" src="${safeImg(hotel.thumb)}" alt="${
      hotel.title
    }" />
              <div class="trip-body">
                <div class="trip-title">${hotel.title}</div>
                <div class="trip-sub">${hotel.sub}</div>
              </div>
            `;
    card.addEventListener("click", () => renderHotelDetail(hotel));
    sec2Box.appendChild(card);
  });
}

function renderHotelDetail(hotel) {
  reviewBox.innerHTML = `
            <div class="detail-panel">
              <div class="detail-header">
                <i class="ri-hotel-line" aria-hidden="true"></i>
                <h3>${hotel.title}</h3>
              </div>
              <ul>
                ${hotel.features.map((f) => `<li>${f}</li>`).join("")}
              </ul>
              <div class="detail-grid" style="margin-top:10px;">
                ${hotel.gallery
                  .map(
                    (g) => `
                  <div class="detail-card">
                    <img src="${safeImg(g)}" alt="${hotel.title}" />
                  </div>
                `
                  )
                  .join("")}
              </div>              
            </div>
          `;
}

document.addEventListener("DOMContentLoaded", () => {
  document
    .querySelectorAll("#searchBtn,#loginBtn,#joinBtn,#resvBtn")
    .forEach((btn) => {
      btn.addEventListener("click", showUpdateMsg);
    });

  function openPage(page) {
    window.open(`?page=${page}`, "_blank");
  }
  menuDom.domestic.addEventListener("click", () => openPage("domestic"));
  menuDom.silver.addEventListener("click", () => openPage("silver"));
  menuDom.domestic.addEventListener("click", () => {
    renderDomesticList();
    document
      .getElementById("sec2")
      .scrollIntoView({ behavior: "smooth", block: "start" });
  });

  menuDom.silver.addEventListener("click", () => {
    renderSilverHotels();
    document
      .getElementById("sec2")
      .scrollIntoView({ behavior: "smooth", block: "start" });
  });
  function renderByQuery() {
    const params = new URLSearchParams(location.search);
    const page = params.get("page");
    if (!page) return;

    if (page === "domestic") {
      renderDomesticList();
      document
        .getElementById("sec2")
        .scrollIntoView({ behavior: "instant", block: "start" });
    } else if (page === "silver") {
      renderSilverHotels();
      document
        .getElementById("sec2")
        .scrollIntoView({ behavior: "instant", block: "start" });
    } else {
      reviewBox.innerHTML = `
        <div class="detail-panel">
            <div class="detail-header"><h3>준비 중: ${page}</h3></div>
            <p>이 메뉴는 곧 제공될 예정입니다.</p>
        </div>
        `;
      document
        .getElementById("review")
        .scrollIntoView({ behavior: "instant", block: "start" });
    }
  }
  renderByQuery();
  // menuDom.tips.addEventListener("click", () => alert("여행 팁은 준비중입니다."));//
  //menuDom.comm.addEventListener("click", () => alert("커뮤니티는 준비중입니다.")); //
});
