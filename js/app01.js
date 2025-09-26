document.addEventListener("DOMContentLoaded", () => {
  const frame = document.getElementById("contentFrame");
  const nav = document.querySelector("nav");
  const viewArea = document.getElementById("viewArea");

  // 메뉴 클릭 → 같은 자리에서 페이지 로드
  if (frame && nav && viewArea) {
    nav.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-page]");
      if (!btn) return;
      e.preventDefault();

      frame.src = btn.dataset.page; // 페이지 교체
      viewArea.classList.add("show-frame"); // 히어로 숨기고 iframe 보이기

      // 모바일에서 메뉴 닫기(선택)
      const menu = document.getElementById("primary-menu");
      const navToggle = document.getElementById("navToggle");
      if (menu?.classList.contains("is-open")) {
        menu.classList.remove("is-open");
        navToggle?.setAttribute("aria-expanded", "false");
      }

      // 스크롤 포커스
      viewArea.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  // (선택) 슬라이더 버튼 이벤트를 JS에서 연결
  const imgBox = document.querySelector(".imgBox");
  const slides = document.querySelectorAll(".imgBox img");
  const leftBtn = document.querySelector(".leftarrow");
  const rightBtn = document.querySelector(".rightarrow");

  if (imgBox && slides.length) {
    let index = 0;
    const total = slides.length;
    const AUTO_MS = 2500;
    let autoTimer = null;

    function showSlide(i) {
      index = (i + total) % total;
      imgBox.style.transform = `translateX(-${index * 100}%)`;
    }
    function nextImg() {
      showSlide(index + 1);
    }
    function prevImg() {
      showSlide(index - 1);
    }

    rightBtn?.addEventListener("click", nextImg);
    leftBtn?.addEventListener("click", prevImg);

    const hero = document.querySelector(".mainImg");
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
    hero?.addEventListener("mouseenter", stopAuto);
    hero?.addEventListener("mouseleave", startAuto);

    showSlide(0);
    startAuto();
  }
});
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
  }

  /*** 메인 히어로 슬라이더: 클릭/오토 + 드래그(마우스/터치) ***/
  const imgBox = document.querySelector(".imgBox");
  const slides = document.querySelectorAll(".imgBox img");
  const leftBtn = document.querySelector(".leftarrow");
  const rightBtn = document.querySelector(".rightarrow");
  const hero = document.querySelector(".mainImg");

  if (imgBox && slides.length) {
    let index = 0;
    const total = slides.length;
    const AUTO_MS = 2500;
    let autoTimer = null;

    function showSlide(i) {
      index = (i + total) % total;
      imgBox.style.transform = `translateX(-${index * 100}%)`;
    }
    function nextImg() {
      showSlide(index + 1);
    }
    function prevImg() {
      showSlide(index - 1);
    }

    rightBtn?.addEventListener("click", nextImg);
    leftBtn?.addEventListener("click", prevImg);

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

    // 드래그(마우스/터치/펜) 지원
    let isDown = false;
    let startX = 0;
    let currentX = 0;
    const THRESHOLD = 50; // 넘기기 임계 픽셀

    // 포인터 이벤트 사용
    hero?.addEventListener("pointerdown", (e) => {
      isDown = true;
      startX = e.clientX;
      currentX = startX;
      imgBox.style.transition = "none"; // 드래그 중에는 부드럽게 이동 취소
      stopAuto();
      hero.setPointerCapture(e.pointerId);
    });

    hero?.addEventListener("pointermove", (e) => {
      if (!isDown) return;
      currentX = e.clientX;
      const delta = currentX - startX;
      // 현재 슬라이드 위치에서 델타 만큼 살짝 끌어주기(시각 피드백)
      imgBox.style.transform = `translateX(calc(-${
        index * 100
      }% + ${delta}px))`;
    });

    function endDrag(e) {
      if (!isDown) return;
      isDown = false;
      imgBox.style.transition = ""; // 원래 전환 복구

      const delta = currentX - startX;
      if (Math.abs(delta) > THRESHOLD) {
        if (delta < 0) nextImg();
        else prevImg();
      } else {
        // 임계 미만이면 원래 위치로 복귀
        showSlide(index);
      }
      startAuto();
    }
    hero?.addEventListener("pointerup", endDrag);
    hero?.addEventListener("pointercancel", endDrag);
    hero?.addEventListener("pointerleave", endDrag);

    // 자동재생: 슬라이더에 마우스 올리면 일시정지
    hero?.addEventListener("mouseenter", stopAuto);
    hero?.addEventListener("mouseleave", startAuto);

    showSlide(0);
    startAuto();
  }

  /*** iframe 내부 스크롤 진입 애니메이션(스크롤 이벤트 ②) ***/
  const revealWithObserver = (rootDoc) => {
    if (!rootDoc) return;

    // 대상 자동 태깅: 공통 요소에 reveal 클래스 부여
    const autoTargets = rootDoc.querySelectorAll(
      ".trip-card, .detail-card, .detail-panel, section h2, .selectrip > *"
    );
    autoTargets.forEach((el) => el.classList.add("reveal"));

    const targets = rootDoc.querySelectorAll(".reveal");
    if (!targets.length) return;

    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    targets.forEach((t) => io.observe(t));
  };

  // 처음 로드 시(혹시 기본 콘텐츠가 있을 때 대비)
  revealWithObserver(document);

  // iframe 로드될 때 내부 문서에도 적용 (동일 출처 전제)
  frame?.addEventListener("load", () => {
    try {
      const doc = frame.contentDocument || frame.contentWindow.document;
      revealWithObserver(doc);
      // 높이 자동 맞춤(선택)
      const h = Math.max(
        doc.body.scrollHeight,
        doc.documentElement.scrollHeight
      );
      frame.style.minHeight = Math.max(h, 600) + "px";
    } catch (e) {
      // 교차 출처면 접근 불가
    }
  });
});
