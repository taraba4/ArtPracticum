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

  document.querySelector('footer button')?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();
