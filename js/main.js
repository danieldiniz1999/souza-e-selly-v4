/**
 * SOUZA & SELLY ADVOCACIA — ULTRA-LUXURY DESIGN ENGINE
 * Módulo de interatividade, micro-interações, cálculos em tempo real e animações
 */

(function () {
  'use strict';

  // Configurações do Escritório
  const CONFIG = {
    whatsappNumber: '5585999999999',
    phoneFormatted: '(85) 99999-9999',
    fullAddress: 'Av. Jovita Feitosa, nº 3072, Parquelândia, Fortaleza - CE, CEP 60455-410',
    businessHours: {
      open: 9,   // 09:00
      close: 17  // 17:00
    }
  };

  /* ==========================================================================
     1. STATUS DO ESCRITÓRIO EM TEMPO REAL (HORÁRIO DE FORTALEZA / BRT)
     ========================================================================== */
  function initOfficeStatus() {
    const dots = document.querySelectorAll('.status-dot, [data-status-dot]');
    const texts = document.querySelectorAll('.status-text, [data-status-text]');

    function update() {
      const now = new Date();
      // Ajustar para fuso horário do Ceará (UTC-3)
      const options = { timeZone: 'America/Fortaleza', hour12: false, hour: 'numeric', minute: 'numeric', weekday: 'short' };
      const formatter = new Intl.DateTimeFormat('pt-BR', options);
      const parts = formatter.formatToParts(now);

      let hour = now.getHours();
      let day = now.getDay(); // 0 = Domingo, 6 = Sábado

      parts.forEach((p) => {
        if (p.type === 'hour') hour = parseInt(p.value, 10);
      });

      const isWeekday = day >= 1 && day <= 5;
      const isOpen = isWeekday && hour >= CONFIG.businessHours.open && hour < CONFIG.businessHours.close;

      dots.forEach((dot) => {
        dot.style.backgroundColor = isOpen ? '#10B981' : '#F59E0B';
        dot.style.boxShadow = isOpen ? '0 0 10px #10B981' : '0 0 10px #F59E0B';
      });

      texts.forEach((text) => {
        text.textContent = isOpen
          ? 'Plantão Aberto Agora · Atendimento 09h às 17h'
          : 'Plantão WhatsApp Ativo · Atendimento 09h às 17h (Seg a Sex)';
      });
    }

    update();
    setInterval(update, 60000);
  }

  /* ==========================================================================
     2. BARRA DE PROGRESSO DE LEITURA (TOP READING BAR)
     ========================================================================== */
  function initScrollProgress() {
    let progressBar = document.getElementById('scroll-progress');
    if (!progressBar) {
      progressBar = document.createElement('div');
      progressBar.id = 'scroll-progress';
      progressBar.className = 'scroll-progress-bar';
      document.body.prepend(progressBar);
    }

    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressBar.style.width = `${progress}%`;
    }, { passive: true });
  }

  /* ==========================================================================
     3. CONTADOR NUMÉRICO ANIMADO (5 PILARES DE AUTORIDADE)
     ========================================================================== */
  function initCounters() {
    const counterElements = document.querySelectorAll('[data-counter]');
    if (!counterElements.length) return;

    function parseTarget(valStr) {
      const isPercent = valStr.includes('%');
      const isPlus = valStr.startsWith('+');
      const hasAnos = valStr.toLowerCase().includes('anos');
      const cleanNum = parseFloat(valStr.replace(/[^\d.,]/g, '').replace('.', '').replace(',', '.'));
      return {
        value: cleanNum,
        isPercent,
        isPlus,
        hasAnos,
        decimals: valStr.includes(',') || valStr.includes('.') ? (valStr.split(/[.,]/)[1]?.replace('%', '').length || 0) : 0
      };
    }

    function animateCount(el, targetObj, duration = 1800) {
      let startTime = null;

      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        // Easing out cubic
        const ease = 1 - Math.pow(1 - progress, 3);
        const current = ease * targetObj.value;

        let formatted = '';
        if (targetObj.decimals > 0) {
          formatted = current.toFixed(targetObj.decimals).replace('.', ',');
        } else {
          formatted = Math.floor(current).toLocaleString('pt-BR');
        }

        let result = '';
        if (targetObj.isPlus) result += '+';
        result += formatted;
        if (targetObj.hasAnos) result += ' Anos';
        if (targetObj.isPercent) result += '%';

        el.textContent = result;

        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else {
          // Garantir valor final exato
          let finalStr = '';
          if (targetObj.isPlus) finalStr += '+';
          if (targetObj.decimals > 0) {
            finalStr += targetObj.value.toFixed(targetObj.decimals).replace('.', ',');
          } else {
            finalStr += Math.floor(targetObj.value).toLocaleString('pt-BR');
          }
          if (targetObj.hasAnos) finalStr += ' Anos';
          if (targetObj.isPercent) finalStr += '%';
          el.textContent = finalStr;
        }
      }

      window.requestAnimationFrame(step);
    }

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const rawTarget = el.getAttribute('data-counter') || el.textContent.trim();
            const targetObj = parseTarget(rawTarget);
            animateCount(el, targetObj);
            obs.unobserve(el);
          }
        });
      }, { threshold: 0.25 });

      counterElements.forEach((el) => observer.observe(el));
    } else {
      counterElements.forEach((el) => {
        const rawTarget = el.getAttribute('data-counter') || el.textContent.trim();
        el.textContent = rawTarget;
      });
    }
  }

  /* ==========================================================================
     4. SPOTLIGHT INTERATIVO EM CARDS (MOUSE TRAIL RADIAL GLOW)
     ========================================================================== */
  function initCardSpotlight() {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const cards = document.querySelectorAll('.glass-card, .lawyer-card, .stat-box, .showcase-card');
    cards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      }, { passive: true });
    });
  }

  /* ==========================================================================
     5. ABAS INTERATIVAS DE ÁREAS DE ATUAÇÃO COM FADE FLUIDO
     ========================================================================== */
  function switchTab(areaId, clickedBtn) {
    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach((btn) => btn.classList.remove('active'));

    const tabs = ['previdenciario', 'trabalhista', 'civel'];
    tabs.forEach((tab) => {
      const el = document.getElementById('tab-' + tab);
      if (el) {
        el.style.display = 'none';
        el.classList.remove('tab-content-active');
      }
    });

    const activeEl = document.getElementById('tab-' + areaId);
    if (activeEl) {
      activeEl.style.display = 'block';
      activeEl.classList.add('tab-content-active');
    }

    if (clickedBtn) {
      clickedBtn.classList.add('active');
    } else {
      const matchingBtn = document.querySelector(`.tab-btn[data-area="${areaId}"]`);
      if (matchingBtn) matchingBtn.classList.add('active');
    }
  }

  // Exportar globalmente para inline handlers se necessário
  window.switchTab = switchTab;

  /* ==========================================================================
     6. ACORDEÃO DE DÚVIDAS (FAQ)
     ========================================================================== */
  function toggleFaq(btn) {
    const item = btn.parentElement;
    const isOpen = item.classList.contains('open');

    // Fechar todos
    document.querySelectorAll('.faq-item').forEach((i) => {
      i.classList.remove('open');
      const b = i.querySelector('.faq-q');
      if (b) b.setAttribute('aria-expanded', 'false');
    });

    if (!isOpen) {
      item.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
    }
  }

  window.toggleFaq = toggleFaq;

  /* ==========================================================================
     7. MENU MOBILE (DRAWER) COM TRATAMENTO DE TECLADO & FOCO
     ========================================================================== */
  function toggleMobileMenu() {
    const drawer = document.getElementById('mobile-drawer');
    const overlay = document.getElementById('drawer-overlay');
    const toggle = document.getElementById('mobile-toggle');
    if (!drawer) return;

    const isOpen = drawer.classList.contains('active');
    if (isOpen) {
      closeMobileMenu();
    } else {
      drawer.classList.add('active');
      if (overlay) overlay.classList.add('active');
      if (toggle) {
        toggle.classList.add('active');
        toggle.setAttribute('aria-expanded', 'true');
      }
      document.body.style.overflow = 'hidden';
    }
  }

  function closeMobileMenu() {
    const drawer = document.getElementById('mobile-drawer');
    const overlay = document.getElementById('drawer-overlay');
    const toggle = document.getElementById('mobile-toggle');
    if (drawer) drawer.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
    if (toggle) {
      toggle.classList.remove('active');
      toggle.setAttribute('aria-expanded', 'false');
    }
    document.body.style.overflow = '';
  }

  window.toggleMobileMenu = toggleMobileMenu;
  window.closeMobileMenu = closeMobileMenu;

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMobileMenu();
  });

  /* ==========================================================================
     8. MÁSCARA INTELIGENTE DE TELEFONE E SUBMISSÃO PARA WHATSAPP
     ========================================================================== */
  function setupPhoneMask() {
    const phoneInput = document.getElementById('form-phone');
    if (!phoneInput) return;

    phoneInput.addEventListener('input', (e) => {
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

  function handleContactSubmit(e) {
    if (e && e.preventDefault) e.preventDefault();

    const nameEl = document.getElementById('form-name');
    const phoneEl = document.getElementById('form-phone');
    const cityEl = document.getElementById('form-city');
    const areaEl = document.getElementById('form-area');
    const msgEl = document.getElementById('form-msg');

    const name = nameEl ? nameEl.value.trim() : '';
    const phone = phoneEl ? phoneEl.value.trim() : '';
    const city = cityEl ? cityEl.value.trim() : '';
    const area = areaEl ? areaEl.value : '';
    const msg = msgEl ? msgEl.value.trim() : '';

    if (!name) {
      if (nameEl) nameEl.focus();
      return;
    }

    const lines = [
      '⚖️ *Souza & Selly Advocacia — Nova Consulta*',
      '',
      `*Nome:* ${name}`,
      phone ? `*Telefone/WhatsApp:* ${phone}` : null,
      city ? `*Cidade/Região:* ${city}/CE` : null,
      area ? `*Área de Interesse:* ${area}` : null,
      msg ? `*Resumo da Situação:* ${msg}` : '*Mensagem:* Gostaria de orientações e agendamento de consulta.',
      '',
      '_Enviado pelo formulário oficial da Souza & Selly Advocacia_'
    ].filter(Boolean);

    const fullMessage = lines.join('\n');
    const url = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(fullMessage)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  window.handleContactSubmit = handleContactSubmit;

  /* ==========================================================================
     9. COPIAR ENDEREÇO DA SEDE COM FEEDBACK VISUAL
     ========================================================================== */
  function copyOfficeAddress() {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(CONFIG.fullAddress).then(() => {
        showToast('Endereço copiado com sucesso!');
      }).catch(() => {
        fallbackCopyText(CONFIG.fullAddress);
      });
    } else {
      fallbackCopyText(CONFIG.fullAddress);
    }
  }

  function fallbackCopyText(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      showToast('Endereço copiado com sucesso!');
    } catch (err) {
      prompt('Copie o endereço manualmente:', text);
    }
    document.body.removeChild(textArea);
  }

  function showToast(message) {
    let toast = document.getElementById('ui-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'ui-toast';
      toast.className = 'ui-toast-msg';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('visible');
    setTimeout(() => {
      toast.classList.remove('visible');
    }, 2800);
  }

  window.copyOfficeAddress = copyOfficeAddress;

  /* ==========================================================================
     10. SCROLL REVEAL SUAVE (INTERSECTION OBSERVER)
     ========================================================================== */
  function initScrollReveal() {
    const cardsToAnimate = document.querySelectorAll(
      '.glass-card, .lawyer-card, .stat-box, .showcase-card, .contact-card-wrap, .section-head, .faq-item'
    );

    cardsToAnimate.forEach((card) => {
      card.classList.add('reveal-card');
    });

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            obs.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.08,
        rootMargin: '0px 0px -25px 0px'
      });

      cardsToAnimate.forEach((card) => observer.observe(card));
    } else {
      cardsToAnimate.forEach((card) => card.classList.add('revealed'));
    }
  }

  /* ==========================================================================
     11. CHIPS DE ROTA DO INTERIOR COM MENSAGEM PERSONALIZADA
     ========================================================================== */
  function setupRegionChips() {
    const chips = document.querySelectorAll('[data-region-city]');
    chips.forEach((chip) => {
      chip.addEventListener('click', (e) => {
        e.preventDefault();
        const city = chip.getAttribute('data-region-city');
        const msg = `Olá, Dra. Samara e Dra. Maria! Moro em ${city}/CE e gostaria de saber sobre atendimento presencial ou visita na minha cidade.`;
        const url = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(msg)}`;
        window.open(url, '_blank', 'noopener,noreferrer');
      });
    });
  }

  /* ==========================================================================
     12. MAPA INTERATIVO DO CEARÁ (ROTAS, HOVER, TOOLTIP E CHIPS)
     ========================================================================== */
  function initCearaMap() {
    const card = document.getElementById('cearaMapCard');
    if (!card) return;

    const nodes = card.querySelectorAll('.map-node-interactive');
    const chips = card.querySelectorAll('.map-chip');
    const arcs = card.querySelectorAll('.map-connection-arc');
    const tooltipCity = document.getElementById('tooltipCity');
    const tooltipDesc = document.getElementById('tooltipDesc');
    const tooltipLink = document.getElementById('tooltipLink');

    const cityData = {
      fortaleza: {
        name: 'Fortaleza (Sede Central)',
        desc: 'Sede na Parquelândia · Atendimento Presencial & Online',
        msg: 'Olá! Gostaria de agendar um atendimento na sede de Fortaleza da Souza & Selly.'
      },
      sobral: {
        name: 'Sobral (Polo Norte)',
        desc: 'Visitas Domiciliares & Audiências em toda a Região Norte',
        msg: 'Olá! Gostaria de atendimento da Souza & Selly para a região de Sobral.'
      },
      juazeiro: {
        name: 'Juazeiro do Norte (Cariri)',
        desc: 'Atendimento Domiciliar e Presencial (Juazeiro, Crato e Barbalha)',
        msg: 'Olá! Gostaria de atendimento da Souza & Selly para a região do Cariri / Juazeiro do Norte.'
      },
      crateus: {
        name: 'Crateús (Sertão Ocidental)',
        desc: 'Visitas Periódicas · Defesa de Trabalhadores e Aposentados',
        msg: 'Olá! Gostaria de atendimento da Souza & Selly para a região de Crateús.'
      },
      quixada: {
        name: 'Quixadá (Sertão Central)',
        desc: 'Polo Sertão Central · Visitas Presenciais e Coleta de Documentos',
        msg: 'Olá! Gostaria de atendimento da Souza & Selly para a região de Quixadá.'
      },
      iguatu: {
        name: 'Iguatu (Centro-Sul)',
        desc: 'Polo Centro-Sul Cearense · Suporte Jurídico Especializado',
        msg: 'Olá! Gostaria de atendimento da Souza & Selly para a região de Iguatu.'
      },
      limoeiro: {
        name: 'Limoeiro do Norte (Jaguaribe)',
        desc: 'Polo Vale do Jaguaribe · Defesa de Direitos Trabalhistas e Previdenciários',
        msg: 'Olá! Gostaria de atendimento da Souza & Selly para a região de Limoeiro do Norte.'
      }
    };

    function selectCity(cityId, shouldOpenWhatsApp = false) {
      const data = cityData[cityId] || cityData.fortaleza;

      nodes.forEach((n) => {
        if (n.getAttribute('data-city-id') === cityId) {
          n.classList.add('is-active');
        } else {
          n.classList.remove('is-active');
        }
      });

      chips.forEach((c) => {
        if (c.getAttribute('data-city-target') === cityId) {
          c.classList.add('is-active');
        } else {
          c.classList.remove('is-active');
        }
      });

      arcs.forEach((a) => {
        if (a.id === `path-${cityId}`) {
          a.classList.add('is-active');
        } else {
          a.classList.remove('is-active');
        }
      });

      if (tooltipCity) tooltipCity.textContent = data.name;
      if (tooltipDesc) tooltipDesc.textContent = data.desc;
      if (tooltipLink) {
        tooltipLink.href = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(data.msg)}`;
      }

      if (shouldOpenWhatsApp) {
        window.open(`https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(data.msg)}`, '_blank', 'noopener,noreferrer');
      }
    }

    nodes.forEach((node) => {
      const cityId = node.getAttribute('data-city-id');
      node.addEventListener('mouseenter', () => selectCity(cityId, false));
      node.addEventListener('focus', () => selectCity(cityId, false));
      node.addEventListener('click', () => selectCity(cityId, false));
    });

    chips.forEach((chip) => {
      const cityId = chip.getAttribute('data-city-target');
      chip.addEventListener('click', (e) => {
        e.preventDefault();
        selectCity(cityId, false);
      });
    });
  }

  /* ==========================================================================
     INICIALIZAÇÃO NO DOM READY
     ========================================================================== */
  function init() {
    initOfficeStatus();
    initScrollProgress();
    initCounters();
    initCardSpotlight();
    setupPhoneMask();
    initScrollReveal();
    setupRegionChips();
    initCearaMap();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
