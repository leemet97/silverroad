document.addEventListener("DOMContentLoaded", () => {
  const frame = document.getElementById("contentFrame");
  const nav = document.querySelector("nav");
  const viewArea = document.getElementById("viewArea");

  // 모바일 햄버거 토글(있으면 작동)
  const navToggle = document.getElementById("navToggle");
  const menu = document.getElementById("primary-menu");
  navToggle?.addEventListener("click", () => {
    const open = menu.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(open));
  });

  // 상단 고정 헤더 그림자(스크롤 이벤트 ①)
  const header = document.querySelector("header");
  const toggleHeaderShadow = () => {
    if (window.scrollY > 4) header?.classList.add("scrolled");
    else header?.classList.remove("scrolled");
  };
  toggleHeaderShadow();
  window.addEventListener("scroll", toggleHeaderShadow, { passive: true });
  // 상단 버튼 안내 메시지
  [
    ["searchBtn", "검색 기능은 준비 중입니다.\n조금만 기다려주세요!"],
    ["loginBtn", "로그인 기능은 준비 중입니다."],
    ["joinBtn", "회원가입 기능은 준비 중입니다."],
    ["resvBtn", "예약 기능은 준비 중입니다."],
  ].forEach(([id, msg]) => {
    document.getElementById(id)?.addEventListener("click", () => alert(msg));
  });

  // 메뉴 클릭 → 같은 자리에서 페이지 로드(iframe)
  if (frame && nav && viewArea) {
    nav.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-page]");
      if (!btn) return;
      e.preventDefault();

      frame.src = btn.dataset.page; // 페이지 교체
      // ✅ 로드 직후 항상 맨 위부터 보이게 (반응형 공통)
      frame.addEventListener(
        "load",
        () => {
          // 1) iframe 내부 스크롤 맨 위
          try {
            frame.contentWindow?.scrollTo(0, 0);
          } catch (e) {}

          // 2) 바깥 문서도 viewArea의 꼭대기로 (sticky 헤더 높이 보정)
          const headerH = header?.getBoundingClientRect().height || 0;
          const y =
            viewArea.getBoundingClientRect().top + window.scrollY - headerH - 8;
          window.scrollTo({ top: y, behavior: "smooth" });
          // ✅ 추가: iframe 내부 서브메뉴(.gallery-trigger / .sr-gallery-trigger) 클릭 → 부모 갤러리 오픈
          bindGalleryInFrame();
        },
        { once: true }
      );
      viewArea.classList.add("show-frame"); // 히어로 숨기고 iframe 보이기
      if (menu?.classList.contains("is-open")) {
        menu.classList.remove("is-open");
        navToggle?.setAttribute("aria-expanded", "false");
      }
      viewArea.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }
  // });

  /*** 메인 히어로 슬라이더: 클릭/오토 + 드래그(마우스/터치) ***/
  const imgBox = document.querySelector(".imgBox");
  const slides = imgBox ? imgBox.querySelectorAll("img") : [];
  const leftBtn = document.querySelector(".leftarrow");
  const rightBtn = document.querySelector(".rightarrow");
  const hero = document.querySelector(".mainImg");

  if (imgBox && slides.length && leftBtn && rightBtn) {
    slides.forEach((img) => img.setAttribute("draggable", "false"));
    let index = 0;
    const total = slides.length;
    const AUTO_MS = 2500;
    let autoTimer = null;

    // 슬라이드 이동 함수
    function showSlide(i) {
      index = (i + total) % total;
      imgBox.style.transform = `translateX(-${index * 100}%)`;
    }
    const nextImg = () => showSlide(index + 1);
    const prevImg = () => showSlide(index - 1);

    // 화살표 클릭 이벤트
    rightBtn.addEventListener("click", nextImg);
    leftBtn.addEventListener("click", prevImg);

    // 자동재생 컨트롤
    function startAuto() {
      stopAuto();
      autoTimer = setInterval(nextImg, AUTO_MS);
    }
    function stopAuto() {
      if (autoTimer) {
        clearInterval(autoTimer);
        autoTimer = null;
      }
    }

    // 드래그(포인터 이벤트) 지원
    let isDown = false;
    let startX = 0;
    let currentX = 0;
    const THRESHOLD = 50; // 드래그 임계치

    window.addEventListener("pointerdown", (e) => {
      isDown = true;
      startX = e.clientX;
      currentX = startX;
      imgBox.style.transition = "none"; // 드래그 중 부드러운 이동 해제
      stopAuto();
    });

    window.addEventListener("pointermove", (e) => {
      if (!isDown) return;
      currentX = e.clientX;
      const delta = currentX - startX;
      imgBox.style.transform = `translateX(calc(-${
        index * 100
      }% + ${delta}px))`;
    });

    function endDrag() {
      if (!isDown) return;
      isDown = false;
      imgBox.style.transition = ""; // 전환 복구

      const delta = currentX - startX;
      if (Math.abs(delta) > THRESHOLD) {
        if (delta < 0) nextImg();
        else prevImg();
      } else {
        showSlide(index);
      }
      startAuto();
    }

    window.addEventListener("pointerup", endDrag);
    window.addEventListener("pointercancel", endDrag);
    window.addEventListener("pointerleave", endDrag);

    // 자동재생: 마우스 올리면 멈춤, 벗어나면 재시작
    hero.addEventListener("mouseenter", stopAuto);
    hero.addEventListener("mouseleave", startAuto);

    // 초기 실행
    showSlide(0);
    startAuto();
  }
  // ========= Gallery Core (붙이는 위치: 마지막 "});" 바로 위) =========
  const IMG_ROOT = "./img/trips";
  const LETTERS = ["a", "b", "c", "d", "e", "f", "g", "h"]; // 최대 8장

  // index.html 쪽 레이어 요소들
  const layer = document.getElementById("galleryLayer");
  const titleEl = document.getElementById("gTitle");
  const track = document.getElementById("track");
  const dotsBox = document.getElementById("dots");
  const prevBtn = document.getElementById("prev");
  const nextBtn = document.getElementById("next");
  const closeBtn = document.getElementById("gClose");

  let gIndex = 0,
    gTotal = 0,
    lastTrigger = null;

  function buildSlides(key, count) {
    track.innerHTML = "";
    dotsBox.innerHTML = "";
    for (let i = 0; i < count; i++) {
      const url = `${IMG_ROOT}/${key}/${LETTERS[i]}.jpg`;
      const div = document.createElement("div");
      div.className = "slide";
      div.style.backgroundImage = `url('${url}')`;
      div.setAttribute("role", "group");
      div.setAttribute("aria-label", `${i + 1}/${count}`);
      track.appendChild(div);

      const dot = document.createElement("div");
      dot.className = "dot";
      dot.addEventListener("click", () => go(i));
      dotsBox.appendChild(dot);
    }
  }
  function updateGallery() {
    track.style.transform = `translateX(-${gIndex * 100}%)`;
    [...dotsBox.children].forEach((d, i) =>
      d.classList.toggle("active", i === gIndex)
    );
  }
  function go(i) {
    gIndex = (i + gTotal) % gTotal;
    updateGallery();
  }

  function openGallery({ title, key, count }, trigger) {
    if (!layer) return;
    titleEl.textContent = title || key;
    count = Math.max(1, Math.min(8, Number(count) || 1));
    gTotal = count;
    gIndex = 0;
    buildSlides(key, count);
    updateGallery();
    lastTrigger = trigger || null;
    layer.classList.add("show");
    layer.setAttribute("aria-hidden", "false");
    nextBtn?.focus({ preventScroll: true });
  }
  function closeGallery() {
    layer?.classList.remove("show");
    layer?.setAttribute("aria-hidden", "true");
    if (lastTrigger) lastTrigger.focus({ preventScroll: true });
  }

  // 레이어 버튼/키/배경닫기
  prevBtn?.addEventListener("click", () => go(gIndex - 1));
  nextBtn?.addEventListener("click", () => go(gIndex + 1));
  closeBtn?.addEventListener("click", closeGallery);
  layer?.addEventListener("click", (e) => {
    if (e.target === layer) closeGallery();
  });
  window.addEventListener("keydown", (e) => {
    if (!layer?.classList.contains("show")) return;
    if (e.key === "ArrowLeft") go(gIndex - 1);
    if (e.key === "ArrowRight") go(gIndex + 1);
    if (e.key === "Escape") closeGallery();
  });

  // 슬라이더에 스와이프
  (() => {
    const sliderEl = document.getElementById("slider");
    if (!sliderEl) return;
    let down = false,
      startX = 0,
      dx = 0;
    sliderEl.addEventListener("pointerdown", (e) => {
      if (e.target.closest(".arrow")) return;
      down = true;
      startX = e.clientX;
      sliderEl.setPointerCapture(e.pointerId);
    });
    sliderEl.addEventListener("pointermove", (e) => {
      if (down) dx = e.clientX - startX;
    });
    sliderEl.addEventListener("pointerup", () => {
      if (!down) return;
      down = false;
      if (Math.abs(dx) > 50) dx < 0 ? go(gIndex + 1) : go(gIndex - 1);
      dx = 0;
    });
  })();

  // (A) 메인 문서 내부 트리거(.gallery-trigger 또는 .sr-gallery-trigger)도 지원
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".gallery-trigger, .sr-gallery-trigger");
    if (!btn) return;
    e.preventDefault();
    openGallery(
      {
        title: btn.dataset.title || btn.textContent.trim(),
        key: btn.dataset.key,
        count: btn.dataset.count,
      },
      btn
    );
  });

  // (B) iframe(= #contentFrame) 내부 트리거를 부모가 열도록 바인딩
  function bindGalleryInFrame() {
    try {
      if (!frame?.contentDocument) return;
      const doc = frame.contentDocument;
      // 중복 바인딩 방지용 플래그
      if (doc.__galleryBound) return;
      doc.__galleryBound = true;
      frame?.addEventListener("load", bindGalleryInFrame);

      doc.addEventListener("click", (e) => {
        const btn = e.target.closest(".gallery-trigger, .sr-gallery-trigger");
        if (!btn) return;
        e.preventDefault();
        openGallery(
          {
            title: btn.dataset.title || btn.textContent.trim(),
            key: btn.dataset.key,
            count: btn.dataset.count,
          },
          null
        );
      });
    } catch (err) {}
  }
});
