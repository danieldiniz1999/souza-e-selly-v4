/**
 * SOUZA & SELLY ADVOCACIA — JAVASCRIPT PRINCIPAL
 * Interatividade, animações, mapas vetoriais SVG, slider e integração WhatsApp
 */

(function () {
  'use strict';

  // Configurações
  const CONFIG = {
    whatsappNumber: '5585999999999', // Número oficial (DDD 85 - Fortaleza/CE)
    businessHours: {
      open: 9,  // 09:00
      close: 17 // 17:00
    },
    cityRouteIndexMap: {
      sobral: 0,
      crateus: 1,
      quixada: 2,
      limoeiro: 3,
      iguatu: 4,
      juazeiro: 5
    }
  };

  /* ==========================================================================
     1. INSERÇÃO DO MAPA DO CEARÁ (VETORIAL SVG DO TEMPLATE)
     ========================================================================== */
  function initMaps() {
    const template = document.getElementById('tpl-map');
    if (!template) return;

    const mapContainers = document.querySelectorAll('[data-map]');
    mapContainers.forEach((container) => {
      const clone = template.content.cloneNode(true);
      container.innerHTML = '';
      container.appendChild(clone);
    });

    // Configurar interatividade no mapa do interior
    const interiorMap = document.querySelector('[data-map="interior"]');
    if (interiorMap) {
      setupInteriorMapInteractions(interiorMap);
    }
  }

  function setupInteriorMapInteractions(mapContainer) {
    const cityButtons = document.querySelectorAll('[data-city-btn]');
    const pins = mapContainer.querySelectorAll('.pin');
    const routes = mapContainer.querySelectorAll('.ce-route');

    function setActiveCity(cityName) {
      // Ativar botão
      cityButtons.forEach((btn) => {
        const match = btn.getAttribute('data-city-btn') === cityName;
        btn.classList.toggle('active', match);
      });

      // Ativar pin
      pins.forEach((pin) => {
        const match = pin.getAttribute('data-city') === cityName;
        pin.classList.toggle('active', match);
      });

      // Ativar rota correspondente
      const routeIdx = CONFIG.cityRouteIndexMap[cityName];
      routes.forEach((route) => {
        const rIndex = parseInt(route.style.getPropertyValue('--r') || '-1', 10);
        route.classList.toggle('active', rIndex === routeIdx);
      });
    }

    function clearActiveCity() {
      cityButtons.forEach((b) => b.classList.remove('active'));
      pins.forEach((p) => p.classList.remove('active'));
      routes.forEach((r) => r.classList.remove('active'));
    }

    // Eventos nos botões
    cityButtons.forEach((btn) => {
      const city = btn.getAttribute('data-city-btn');
      btn.addEventListener('mouseenter', () => setActiveCity(city));
      btn.addEventListener('focus', () => setActiveCity(city));
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        setActiveCity(city);
      });
    });

    // Eventos nos pins
    pins.forEach((pin) => {
      const city = pin.getAttribute('data-city');
      if (!city || city === 'fortaleza') return;

      pin.addEventListener('mouseenter', () => setActiveCity(city));
      pin.addEventListener('focus', () => setActiveCity(city));
      pin.addEventListener('click', () => setActiveCity(city));
    });

    mapContainer.addEventListener('mouseleave', () => {
      // Opcional: manter ou limpar
    });
  }

  /* ==========================================================================
     2. BARRA DE PROGRESSO DE SCROLL & BOTÃO FLUTUANTE
     ========================================================================== */
  function initProgressBar() {
    const progressBar = document.querySelector('.progress span');
    const floatCta = document.querySelector('.float-cta');

    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      if (progressBar) progressBar.style.width = `${progress}%`;

      if (floatCta) {
        if (scrollTop > 260) {
          floatCta.classList.add('is-visible');
        } else {
          floatCta.classList.remove('is-visible');
        }
      }
    }, { passive: true });
  }

  /* ==========================================================================
     3. MENU MOBILE & BURGER
     ========================================================================== */
  function initMobileMenu() {
    const burger = document.querySelector('.burger');
    const menu = document.getElementById('menu');
    if (!burger || !menu) return;

    burger.addEventListener('click', () => {
      const isExpanded = burger.getAttribute('aria-expanded') === 'true';
      burger.setAttribute('aria-expanded', String(!isExpanded));
      menu.classList.toggle('active', !isExpanded);
    });

    // Fechar ao clicar em link
    menu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        burger.setAttribute('aria-expanded', 'false');
        menu.classList.remove('active');
      });
    });

    // Fechar com ESC
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menu.classList.contains('active')) {
        burger.setAttribute('aria-expanded', 'false');
        menu.classList.remove('active');
      }
    });
  }

  /* ==========================================================================
     4. CONTADOR NUMÉRICO ANIMADO (STATS)
     ========================================================================== */
  function initCounters() {
    const countEls = document.querySelectorAll('[data-count]');
    if (!countEls.length) return;

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.getAttribute('data-count'), 10);
          if (isNaN(target)) return;

          animateCount(el, target, 1600);
          obs.unobserve(el);
        }
      });
    }, { threshold: 0.3 });

    countEls.forEach((el) => observer.observe(el));
  }

  function animateCount(el, target, duration) {
    let startTimestamp = null;
    const startVal = 0;

    function step(timestamp) {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Easing out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(ease * (target - startVal) + startVal);
      el.textContent = current.toLocaleString('pt-BR');

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        el.textContent = target.toLocaleString('pt-BR');
      }
    }

    window.requestAnimationFrame(step);
  }

  /* ==========================================================================
     5. REVEAL & STAGGER ANIMATIONS (INTERSECTION OBSERVER)
     ========================================================================== */
  function initReveals() {
    const revealEls = document.querySelectorAll('[data-reveal]');
    const staggerContainers = document.querySelectorAll('[data-stagger]');

    function revealElement(el) {
      el.classList.add('revealed');
    }

    function revealStagger(container) {
      const children = Array.from(container.children);
      children.forEach((child, idx) => {
        setTimeout(() => {
          child.classList.add('revealed');
        }, idx * 100);
      });
    }

    if ('IntersectionObserver' in window) {
      const observerOptions = {
        root: null,
        rootMargin: '100px 0px 50px 0px',
        threshold: 0.02
      };

      const revealObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            revealElement(entry.target);
            obs.unobserve(entry.target);
          }
        });
      }, observerOptions);

      revealEls.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight + 150) {
          revealElement(el);
        } else {
          revealObserver.observe(el);
        }
      });

      const staggerObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            revealStagger(entry.target);
            obs.unobserve(entry.target);
          }
        });
      }, observerOptions);

      staggerContainers.forEach((container) => {
        const rect = container.getBoundingClientRect();
        if (rect.top < window.innerHeight + 150) {
          revealStagger(container);
        } else {
          staggerObserver.observe(container);
        }
      });
    } else {
      // Fallback sem IntersectionObserver
      revealEls.forEach(revealElement);
      staggerContainers.forEach(revealStagger);
    }

    // Safety fallback: garante que nada fique oculto após 1.2s
    setTimeout(() => {
      revealEls.forEach(revealElement);
      staggerContainers.forEach(revealStagger);
    }, 1200);
  }

  /* ==========================================================================
     6. CARD 3D TILT EFFECT
     ========================================================================== */
  function initTilt() {
    const cards = document.querySelectorAll('[data-tilt]');
    if (!cards.length || window.matchMedia('(pointer: coarse)').matches) return;

    cards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const deltaX = (x - centerX) / centerX;
        const deltaY = (y - centerY) / centerY;

        const tiltX = deltaY * -7;
        const tiltY = deltaX * 7;

        card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-4px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  /* ==========================================================================
     7. MAGNETIC BUTTON EFFECT
     ========================================================================== */
  function initMagneticButtons() {
    const buttons = document.querySelectorAll('[data-magnetic]');
    if (!buttons.length || window.matchMedia('(pointer: coarse)').matches) return;

    buttons.forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.18}px, ${y * 0.18}px)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }

  /* ==========================================================================
     8. SLIDER DE DEPOIMENTOS
     ========================================================================== */
  function initTestimonialSlider() {
    const slider = document.querySelector('.tslider');
    const prevBtn = document.querySelector('[data-t="prev"]');
    const nextBtn = document.querySelector('[data-t="next"]');
    const progressBar = document.querySelector('.t-progress span');

    if (!slider || !prevBtn || !nextBtn) return;

    function getCardWidth() {
      const card = slider.querySelector('.tcard');
      return card ? card.offsetWidth + 20 : 320;
    }

    prevBtn.addEventListener('click', () => {
      slider.scrollBy({ left: -getCardWidth(), behavior: 'smooth' });
    });

    nextBtn.addEventListener('click', () => {
      slider.scrollBy({ left: getCardWidth(), behavior: 'smooth' });
    });

    if (progressBar) {
      slider.addEventListener('scroll', () => {
        const maxScroll = slider.scrollWidth - slider.clientWidth;
        if (maxScroll > 0) {
          const ratio = slider.scrollLeft / maxScroll;
          const leftPercent = ratio * (100 - 16.66);
          progressBar.style.left = `${Math.max(0, Math.min(leftPercent, 83.33))}%`;
        }
      }, { passive: true });
    }
  }

  /* ==========================================================================
     9. FAQ ACCORDION
     ========================================================================== */
  function initFaq() {
    const faqButtons = document.querySelectorAll('.faq-q');
    faqButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const isExpanded = btn.getAttribute('aria-expanded') === 'true';
        // Fechar todos do mesmo bloco para elegância
        faqButtons.forEach((b) => b.setAttribute('aria-expanded', 'false'));
        if (!isExpanded) {
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  /* ==========================================================================
     10. STATUS DE ATENDIMENTO EM TEMPO REAL (FORTALEZA / BRT UTC-3)
     ========================================================================== */
  function initBusinessStatus() {
    const statusEl = document.querySelector('[data-status]');
    const statusTextEl = document.querySelector('[data-status-text]');
    if (!statusEl || !statusTextEl) return;

    function update() {
      // Obter horário atual no Ceará (America/Fortaleza)
      const now = new Date();
      const options = { timeZone: 'America/Fortaleza', hour12: false, hour: 'numeric', minute: 'numeric', weekday: 'short' };
      const formatter = new Intl.DateTimeFormat('pt-BR', options);
      const parts = formatter.formatToParts(now);

      let hour = now.getHours();
      let day = now.getDay(); // 0 = Domingo, 6 = Sábado

      parts.forEach(p => {
        if (p.type === 'hour') hour = parseInt(p.value, 10);
      });

      const isWeekday = day >= 1 && day <= 5;
      const isOpen = isWeekday && hour >= CONFIG.businessHours.open && hour < CONFIG.businessHours.close;

      if (isOpen) {
        statusEl.classList.remove('closed');
        statusTextEl.textContent = 'Aberto agora · Atendimento até 17:00';
      } else {
        statusEl.classList.add('closed');
        statusTextEl.textContent = 'Atendimento das 09:00 às 17:00 (Seg a Sex)';
      }
    }

    update();
    setInterval(update, 60000);
  }

  /* ==========================================================================
     11. FORMULÁRIO DE CONTATO & FORMATADOR WHATSAPP
     ========================================================================== */
  function initContactForm() {
    const form = document.getElementById('form-contato');
    if (!form) return;

    const telInput = document.getElementById('f-tel');
    if (telInput) {
      // Máscara amigável de telefone brasileiro (DDD) 90000-0000
      telInput.addEventListener('input', (e) => {
        let v = e.target.value.replace(/\D/g, '');
        if (v.length > 11) v = v.substring(0, 11);
        if (v.length > 10) {
          e.target.value = `(${v.substring(0, 2)}) ${v.substring(2, 7)}-${v.substring(7)}`;
        } else if (v.length > 6) {
          e.target.value = `(${v.substring(0, 2)}) ${v.substring(2, 6)}-${v.substring(6)}`;
        } else if (v.length > 2) {
          e.target.value = `(${v.substring(0, 2)}) ${v.substring(2)}`;
        } else if (v.length > 0) {
          e.target.value = `(${v}`;
        } else {
          e.target.value = '';
        }
      });
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const nomeInput = document.getElementById('f-nome');
      const cidadeInput = document.getElementById('f-cidade');
      const areaSelect = document.getElementById('f-area');
      const msgTextarea = document.getElementById('f-msg');

      const errNome = document.querySelector('[data-err="nome"]');
      const errTel = document.querySelector('[data-err="tel"]');
      const okMsg = document.querySelector('[data-form-ok]');

      // Reset de erros
      if (errNome) errNome.textContent = '';
      if (errTel) errTel.textContent = '';
      if (okMsg) okMsg.hidden = true;

      let hasError = false;

      if (!nomeInput.value.trim()) {
        if (errNome) errNome.textContent = 'Por favor, informe seu nome.';
        nomeInput.focus();
        hasError = true;
      }

      const cleanTel = telInput ? telInput.value.replace(/\D/g, '') : '';
      if (!cleanTel || cleanTel.length < 10) {
        if (errTel) errTel.textContent = 'Por favor, informe um WhatsApp válido com DDD.';
        if (!hasError && telInput) telInput.focus();
        hasError = true;
      }

      if (hasError) return;

      // Montar mensagem elegante para o WhatsApp
      const lines = [
        '⚖️ *Souza & Selly Advocacia — Nova Consulta*',
        '',
        `*Nome:* ${nomeInput.value.trim()}`,
        `*WhatsApp:* ${telInput.value.trim()}`,
        cidadeInput && cidadeInput.value.trim() ? `*Cidade:* ${cidadeInput.value.trim()}` : null,
        areaSelect ? `*Área de Interesse:* ${areaSelect.value}` : null,
        msgTextarea && msgTextarea.value.trim() ? `*Resumo do Caso:* ${msgTextarea.value.trim()}` : null,
        '',
        '_Mensagem enviada através do site oficial_'
      ].filter(Boolean);

      const messageText = lines.join('\n');
      const waUrl = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(messageText)}`;

      if (okMsg) {
        okMsg.textContent = 'Redirecionando para o WhatsApp com a sua mensagem pronta...';
        okMsg.hidden = false;
      }

      setTimeout(() => {
        window.open(waUrl, '_blank', 'noopener,noreferrer');
      }, 400);
    });

    // Links gerais com [data-wa]
    const waLinks = document.querySelectorAll('a[data-wa]');
    waLinks.forEach((link) => {
      const customMsg = link.getAttribute('data-wa-msg') || 'Olá! Vim pelo site da Souza & Selly Advocacia e gostaria de falar com uma advogada.';
      const waUrl = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(customMsg)}`;
      link.setAttribute('href', waUrl);
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
    });
  }

  /* ==========================================================================
     12. ATUALIZAR ANO CORRENTE
     ========================================================================== */
  function initCurrentYear() {
    const yearEls = document.querySelectorAll('[data-year]');
    const currentYear = new Date().getFullYear();
    yearEls.forEach((el) => {
      el.textContent = currentYear;
    });
  }

  /* ==========================================================================
     INICIALIZAÇÃO GERAL
     ========================================================================== */
  function init() {
    initMaps();
    initProgressBar();
    initMobileMenu();
    initCounters();
    initReveals();
    initTilt();
    initMagneticButtons();
    initTestimonialSlider();
    initFaq();
    initBusinessStatus();
    initContactForm();
    initCurrentYear();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
