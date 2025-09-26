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

  // 메뉴 클릭 → 같은 자리에서 페이지 로드(iframe)
  if (frame && nav && viewArea) {
    nav.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-page]");
      if (!btn) return;
      e.preventDefault();

      frame.src = btn.dataset.page; // 페이지 교체
      viewArea.classList.add("show-frame"); // 히어로 숨기고 iframe 보이기
      if (menu?.classList.contains("is-open")) {
        menu.classList.remove("is-open");
        navToggle?.setAttribute("aria-expanded", "false");
      }
      viewArea.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }}

  /*** 메인 히어로 슬라이더: 클릭/오토 + 드래그(마우스/터치) ***/
const imgBox = document.querySelector(".imgBox");
const slides = document.querySelectorAll(".imgBox img");
const leftBtn = document.querySelector(".leftarrow");
const rightBtn = document.querySelector(".rightarrow");
const hero = document.querySelector(".mainImg");

if (imgBox && slides.length && leftBtn && rightBtn) {
  let index = 0;
  const total = slides.length;
  const AUTO_MS = 2500;
  let autoTimer = null;

  // 슬라이드 이동 함수
  function showSlide(i) {
    index = (i + total) % total;
    imgBox.style.transform = `translateX(-${index * 100}%)`;
  }
  function nextImg() { showSlide(index + 1); }
  function prevImg() { showSlide(index - 1); }

  // 화살표 클릭 이벤트
  rightBtn.addEventListener("click", () => {
    console.log("＞ 버튼 클릭됨");
    nextImg();
  });
  leftBtn.addEventListener("click", () => {
    console.log("＜ 버튼 클릭됨");
    prevImg();
  });

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

  hero.addEventListener("pointerdown", (e) => {
    isDown = true;
    startX = e.clientX;
    currentX = startX;
    imgBox.style.transition = "none"; // 드래그 중 부드러운 이동 해제
    stopAuto();
    hero.setPointerCapture(e.pointerId);
  });

  hero.addEventListener("pointermove", (e) => {
    if (!isDown) return;
    currentX = e.clientX;
    const delta = currentX - startX;
    imgBox.style.transform = `translateX(calc(-${index * 100}% + ${delta}px))`;
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

  hero.addEventListener("pointerup", endDrag);
  hero.addEventListener("pointercancel", endDrag);
  hero.addEventListener("pointerleave", endDrag);

  // 자동재생: 마우스 올리면 멈춤, 벗어나면 재시작
  hero.addEventListener("mouseenter", stopAuto);
  hero.addEventListener("mouseleave", startAuto);

  // 초기 실행
  showSlide(0);
  startAuto();
}
