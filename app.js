(() => {
  const slots = [
    {
      id: 'slot-1',
      displayDate: 'Суббота, 21 сентября',
      time: '18:30 – 21:30',
      availableSpots: 3,
      totalSpots: 10,
    },
    {
      id: 'slot-2',
      displayDate: 'Суббота, 28 сентября',
      time: '18:30 – 21:30',
      availableSpots: 6,
      totalSpots: 10,
    },
  ];

  const plusIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus w-4 h-4" aria-hidden="true"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>';
  const minusIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-minus w-4 h-4" aria-hidden="true"><path d="M5 12h14"></path></svg>';
  const menuIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-menu w-6 h-6" aria-hidden="true"><path d="M4 12h16"></path><path d="M4 18h16"></path><path d="M4 6h16"></path></svg>';
  const closeIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x w-6 h-6" aria-hidden="true"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>';

  const faqAnswers = [
    'Да. Практикум изначально рассчитан в том числе на людей без художественного опыта. Вам не придётся рисовать реалистичные предметы или повторять работу преподавателя.',
    'Здесь нет образца, с которым сравнивается результат. Основная задача — создать собственную работу, а ведущий поможет вам с технической частью и композицией.',
    'Нет. Это практикум по абстрактной живописи, в котором эмоции становятся основой для создания работы.',
    'Ничего. Все материалы будут на месте.',
  ];

  const header = document.querySelector('#main-header');
  const mobileToggle = document.querySelector('#mobile-menu-toggle-btn');
  const bookingButtons = [
    '#header-booking-btn',
    '#hero-cta-btn',
    '#practical-booking-btn',
    '#final-cta-booking-btn',
  ];
  let mobileMenuOpen = false;
  let selectedSlotIndex = 0;

  const updateHeader = () => {
    header.className = window.scrollY > 30
      ? 'fixed top-0 left-0 right-0 z-40 transition-all duration-300 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#171615]/10 shadow-xs py-3'
      : 'fixed top-0 left-0 right-0 z-40 transition-all duration-300 bg-transparent py-5';
  };

  const closeMobileMenu = () => {
    document.querySelector('#mobile-nav-panel')?.remove();
    mobileMenuOpen = false;
    mobileToggle.innerHTML = menuIcon;
    mobileToggle.setAttribute('aria-label', 'Открыть меню');
  };

  const openBooking = () => {
    closeMobileMenu();
    const fragment = document.querySelector('#booking-form-template').content.cloneNode(true);
    document.body.append(fragment);
    const modal = document.querySelector('#booking-modal-backdrop');
    const radios = [...modal.querySelectorAll('input[name="practicum_slot"]')];
    radios.forEach((radio, index) => {
      radio.checked = index === selectedSlotIndex;
      const label = radio.closest('label');
      label.className = index === selectedSlotIndex
        ? 'flex items-center justify-between p-3 border cursor-pointer transition-all border-[#171615] bg-[#F2EFE9]'
        : 'flex items-center justify-between p-3 border cursor-pointer transition-all border-[#171615]/15 hover:border-[#171615]/40';
      radio.addEventListener('change', () => {
        radios.forEach((item, radioIndex) => {
          item.closest('label').className = radioIndex === index
            ? 'flex items-center justify-between p-3 border cursor-pointer transition-all border-[#171615] bg-[#F2EFE9]'
            : 'flex items-center justify-between p-3 border cursor-pointer transition-all border-[#171615]/15 hover:border-[#171615]/40';
        });
      });
    });

    const close = () => modal.remove();
    modal.querySelector('#close-booking-modal-btn').addEventListener('click', close);
    modal.addEventListener('click', (event) => {
      if (event.target === modal) close();
    });
    modal.querySelector('form').addEventListener('submit', (event) => {
      event.preventDefault();
      const name = modal.querySelector('#user-name').value.trim();
      const phone = modal.querySelector('#user-phone').value.trim();
      if (!name || !phone) return;
      const chosenIndex = Math.max(0, radios.findIndex((radio) => radio.checked));
      const slot = slots[chosenIndex];
      const success = document.querySelector('#booking-success-template').content.cloneNode(true);
      modal.replaceWith(success);
      const successModal = document.querySelector('#booking-modal-backdrop');
      const heading = successModal.querySelector('h3');
      heading.textContent = `Ждём вас на практикуме, ${name}!`;
      const confirmation = successModal.querySelector('p strong');
      confirmation.textContent = phone;
      const ticketRows = successModal.querySelectorAll('.space-y-2.text-xs.font-mono > div');
      ticketRows[0].querySelector('span:last-child').textContent = `${slot.displayDate} (${slot.time})`;
      ticketRows[2].querySelector('span:last-child').textContent = name;
      successModal.querySelector('.text-right.font-mono.text-xs.text-\\[\\#171615\\].font-semibold').textContent = `APL-${Math.floor(1000 + Math.random() * 9000)}`;
      const closeSuccess = () => successModal.remove();
      successModal.querySelector('#close-booking-modal-btn').addEventListener('click', closeSuccess);
      successModal.querySelector('.text-center.py-4 > button').addEventListener('click', closeSuccess);
      successModal.addEventListener('click', (successEvent) => {
        if (successEvent.target === successModal) closeSuccess();
      });
    });
  };

  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();

  mobileToggle.addEventListener('click', () => {
    if (mobileMenuOpen) {
      closeMobileMenu();
      return;
    }
    header.append(document.querySelector('#mobile-menu-template').content.cloneNode(true));
    mobileMenuOpen = true;
    mobileToggle.innerHTML = closeIcon;
    mobileToggle.setAttribute('aria-label', 'Закрыть меню');
    const panel = document.querySelector('#mobile-nav-panel');
    panel.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMobileMenu));
    panel.querySelector('button').addEventListener('click', openBooking);
  });

  bookingButtons.forEach((selector) => document.querySelector(selector)?.addEventListener('click', openBooking));

  const detailButtons = [...document.querySelectorAll('#details button')].filter((button) => button.id !== 'practical-booking-btn');
  const dateFact = document.querySelector('#details .grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-4');
  const dateTitle = dateFact?.children[0]?.querySelector('.font-serif');
  const dateMeta = dateFact?.children[0]?.querySelector('p');
  const placesMeta = dateFact?.children[2]?.querySelector('p');

  detailButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
      selectedSlotIndex = index;
      detailButtons.forEach((item, itemIndex) => {
        const active = itemIndex === index;
        item.className = active
          ? 'p-5 text-left border transition-all cursor-pointer flex items-center justify-between bg-[#171615] text-[#FAF8F5] border-[#171615] shadow-sm'
          : 'p-5 text-left border transition-all cursor-pointer flex items-center justify-between bg-[#FAF8F5] text-[#171615] border-[#171615]/15 hover:border-[#171615]/40';
        item.querySelector('.font-serif').className = active
          ? 'font-serif text-xl sm:text-2xl font-normal text-[#FAF8F5]'
          : 'font-serif text-xl sm:text-2xl font-normal text-[#171615]';
        const meta = item.querySelector('.font-mono.text-xs.mt-1');
        meta.className = active
          ? 'font-mono text-xs mt-1 text-[#FAF8F5]/70'
          : 'font-mono text-xs mt-1 text-[#171615]/60';
        const badge = item.querySelector('.inline-block');
        badge.className = active
          ? 'inline-block px-2.5 py-1 text-[11px] font-mono tracking-wider uppercase bg-[#A83324] text-[#FAF8F5]'
          : 'inline-block px-2.5 py-1 text-[11px] font-mono tracking-wider uppercase bg-[#F2EFE9] text-[#A83324] font-medium';
      });
      const slot = slots[index];
      dateTitle.textContent = slot.displayDate;
      dateMeta.textContent = `${slot.time} (сбор гостей за 15 мин)`;
      placesMeta.textContent = `Осталось ${slot.availableSpots} свободных мест`;
    });
  });

  const faqButtons = [...document.querySelectorAll('[id^="faq-toggle-"]')];
  faqButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
      const row = button.parentElement;
      const alreadyOpen = Boolean(row.querySelector(':scope > div.mt-4'));
      faqButtons.forEach((otherButton) => {
        const otherRow = otherButton.parentElement;
        otherRow.querySelector(':scope > div.mt-4')?.remove();
        otherButton.querySelector('span:last-child').innerHTML = plusIcon;
      });
      if (!alreadyOpen) {
        const answer = document.createElement('div');
        answer.className = 'mt-4 pr-12 text-base text-[#171615]/80 font-light leading-relaxed';
        const paragraph = document.createElement('p');
        paragraph.className = 'p-4 bg-[#F2EFE9] border-l-2 border-[#A83324]';
        paragraph.textContent = faqAnswers[index];
        answer.append(paragraph);
        row.append(answer);
        button.querySelector('span:last-child').innerHTML = minusIcon;
      }
    });
  });

  const participantGallery = document.querySelector('#participant-gallery');
  if (participantGallery) {
    const works = [
      { src: 'assets/practicum-gallery/work-04.webp', width: 1131, height: 1600 },
      { src: 'assets/practicum-gallery/work-01.webp', width: 1600, height: 1600 },
      { src: 'assets/practicum-gallery/work-07.webp', width: 1131, height: 1600 },
      { src: 'assets/practicum-gallery/work-02.webp', width: 1600, height: 1131 },
      { src: 'assets/practicum-gallery/work-03.webp', width: 1600, height: 1600 },
      { src: 'assets/practicum-gallery/work-05.webp', width: 1131, height: 1600 },
      { src: 'assets/practicum-gallery/work-06.webp', width: 1600, height: 1131 },
      { src: 'assets/practicum-gallery/work-08.webp', width: 1131, height: 1600 },
    ];
    const cloneCount = 3;
    const galleryViewport = participantGallery.querySelector('.participant-gallery__viewport');
    const galleryTrack = participantGallery.querySelector('.participant-gallery__track');
    const galleryCounter = participantGallery.querySelector('#participant-gallery-counter');
    const previousButton = participantGallery.querySelector('#participant-gallery-prev');
    const nextButton = participantGallery.querySelector('#participant-gallery-next');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const trackWorks = [...works.slice(-cloneCount), ...works, ...works.slice(0, cloneCount)];
    let trackIndex = cloneCount;
    let touchStartX = 0;
    let transitionRunning = false;

    galleryTrack.innerHTML = trackWorks.map((work, position) => {
      const workIndex = (position - cloneCount + works.length) % works.length;
      return `<figure class="participant-gallery__slide"><button class="participant-gallery__open" type="button" data-work-index="${workIndex}" aria-label="Открыть работу ${workIndex + 1} полностью" aria-haspopup="dialog"><img class="participant-gallery__image" src="${work.src}" alt="Абстрактная работа участника практикума, ${workIndex + 1} из ${works.length}" width="${work.width}" height="${work.height}" loading="lazy" decoding="async"></button></figure>`;
    }).join('');

    const gallerySlides = [...galleryTrack.querySelectorAll('.participant-gallery__slide')];

    const getActiveWork = () => (trackIndex - cloneCount + works.length) % works.length;

    const updateCounter = () => {
      const activeWork = getActiveWork();
      galleryCounter.innerHTML = `<strong>${String(activeWork + 1).padStart(2, '0')}</strong> / ${String(works.length).padStart(2, '0')} · Работы участников`;
    };

    const positionTrack = (animate) => {
      const trackPadding = Number.parseFloat(getComputedStyle(galleryTrack).paddingLeft) || 0;
      const offset = gallerySlides[trackIndex].offsetLeft - trackPadding;
      galleryTrack.style.transition = animate && !reducedMotion.matches
        ? 'transform 480ms cubic-bezier(.22,.61,.36,1)'
        : 'none';
      galleryTrack.style.transform = `translate3d(${-offset}px, 0, 0)`;
    };

    const normalizeTrack = () => {
      if (trackIndex >= cloneCount + works.length) trackIndex = cloneCount;
      if (trackIndex < cloneCount) trackIndex = cloneCount + works.length - 1;
      positionTrack(false);
      updateCounter();
    };

    const moveGallery = (direction) => {
      if (transitionRunning) return;
      trackIndex += direction;
      updateCounter();
      if (reducedMotion.matches) {
        normalizeTrack();
        return;
      }
      transitionRunning = true;
      positionTrack(true);
    };

    const openWork = (workIndex) => {
      const work = works[workIndex];
      const dialog = document.createElement('dialog');
      dialog.className = 'participant-lightbox';
      dialog.setAttribute('aria-label', `Работа участника ${workIndex + 1} из ${works.length}`);
      dialog.innerHTML = `<div class="participant-lightbox__inner"><div class="participant-lightbox__topbar"><span>Работа участника · ${String(workIndex + 1).padStart(2, '0')} / ${String(works.length).padStart(2, '0')}</span><button class="participant-lightbox__close" type="button" aria-label="Закрыть полноэкранный просмотр"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"></path></svg></button></div><img class="participant-lightbox__image" src="${work.src}" width="${work.width}" height="${work.height}" alt="Абстрактная работа участника практикума, ${workIndex + 1} из ${works.length}"></div>`;
      document.body.append(dialog);
      const closeDialog = () => dialog.close();
      dialog.querySelector('.participant-lightbox__close').addEventListener('click', closeDialog);
      dialog.addEventListener('click', (event) => {
        if (event.target === dialog) closeDialog();
      });
      dialog.addEventListener('close', () => dialog.remove(), { once: true });
      dialog.showModal();
    };

    galleryTrack.querySelectorAll('.participant-gallery__open').forEach((button) => {
      button.addEventListener('click', () => openWork(Number(button.dataset.workIndex)));
    });
    galleryTrack.addEventListener('transitionend', (event) => {
      if (event.propertyName !== 'transform') return;
      transitionRunning = false;
      normalizeTrack();
    });
    previousButton.addEventListener('click', () => moveGallery(-1));
    nextButton.addEventListener('click', () => moveGallery(1));
    participantGallery.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        moveGallery(-1);
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        moveGallery(1);
      }
    });
    participantGallery.addEventListener('touchstart', (event) => {
      touchStartX = event.changedTouches[0].clientX;
    }, { passive: true });
    participantGallery.addEventListener('touchend', (event) => {
      const distance = event.changedTouches[0].clientX - touchStartX;
      if (Math.abs(distance) < 50) return;
      moveGallery(distance < 0 ? 1 : -1);
    }, { passive: true });
    new ResizeObserver(() => {
      if (!transitionRunning) positionTrack(false);
    }).observe(galleryViewport);
    requestAnimationFrame(() => {
      positionTrack(false);
      updateCounter();
    });
  }

  document.querySelector('footer button')?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();
